import Product from "../model/product.model.js";

export const getProducts = async (req, res) => {
    
  const { q, minPrice, maxPrice } = req.query;
  const filter = { isActive: true };

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  try {
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products", error);
    return res.status(500).json({ message: "Unable to fetch products" });
  }
};
