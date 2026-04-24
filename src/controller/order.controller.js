import Order from "../model/order.model.js";
import Product from "../model/product.model.js";

export const createOrder = async (req, res) => {
  const userId = req.user?.id;
  const { items, address } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items are required" });
  }

  try {
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = products.find((product) => product._id.toString() === item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      address: address || "",
      paymentStatus: "pending",
      status: "pending",
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Failed to create order", error);
    return res.status(500).json({ message: "Could not place order" });
  }
};
