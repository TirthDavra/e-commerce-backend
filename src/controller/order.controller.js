import Order from "../model/order.model.js";
import Product from "../model/product.model.js";

export const createOrder = async (req, res) => {
  const userId = req.user?.id;
  const { items, address, paymentCompleted } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order items are required" });
  }

  if (req.user?.role !== "user") {
    return res.status(403).json({ message: "Only customers can place orders." });
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
      paymentStatus: paymentCompleted ? "paid" : "pending",
      status: paymentCompleted ? "completed" : "pending",
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

export const getOrders = async (req, res) => {
  const userId = req.user?.id;

  if (req.user?.role !== "user") {
    return res.status(403).json({ message: "Only customers can view orders." });
  }

  try {
    const orders = await Order.find({ user: userId })
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Failed to get orders", error);
    return res.status(500).json({ message: "Could not retrieve orders" });
  }
};
