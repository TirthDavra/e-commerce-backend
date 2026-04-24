import dotenv from "dotenv";

import Stripe from "stripe";
import Product from "../model/product.model.js";

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export const createCheckoutSession = async (req, res) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  const { items, address } = req.body;

  if (userRole !== "user") {
    return res.status(403).json({ message: "Only customers can checkout." });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart items are required." });
  }

  try {
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length === 0) {
      return res.status(400).json({ message: "No valid products found" });
    }

    const lineItems = [];

    for (const item of items) {
      const product = products.find((product) => product._id.toString() === item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            ...(product.image && { images: [product.image] }),
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    if (lineItems.length === 0) {
      return res.status(400).json({ message: "No items in checkout" });
    }

    const successUrl = process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success`;
    const cancelUrl = process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout`;

    console.log("Creating Stripe session with:", { 
      lineItems: lineItems.length, 
      userId, 
      successUrl, 
      cancelUrl 
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: req.user?.email,
      metadata: {
        userId: userId?.toString() || "",
        address: address || "",
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe checkout session:", {
      message: error.message,
      type: error.type,
      statusCode: error.statusCode,
      raw: error.raw,
    });
    return res.status(500).json({ 
      message: "Could not create checkout session",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};