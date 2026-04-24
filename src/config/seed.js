import User from "../model/user.model.js";
import Product from "../model/product.model.js";
import { hashPassword } from "../common/utils/hash.js";

const products = [
  {
    name: "Vintage Denim Jacket",
    description: "A relaxed-fit denim jacket with contrast stitching and metal buttons.",
    price: 79.99,
    stock: 18,
    image: "https://images.unsplash.com/photo-1614699745279-2c61bd9d46b5?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Canvas Tote Bag",
    description: "Durable canvas tote for everyday errands and weekend outings.",
    price: 24.0,
    stock: 40,
    image: "https://img.freepik.com/free-photo/reusable-eco-friendly-tote-bag_53876-106023.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    name: "Everyday Sneakers",
    description: "Lightweight sneakers with breathable mesh and flexible rubber soles.",
    price: 64.5,
    stock: 25,
    image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRBQ9KsCmsMU9ljDO3xyzeJPE8G8NFp7u3OuPhDkB42NeJUUYaCk4UESnFA4iVxO5CGRNyu9kf3-hM3rcXLLxz_XMm_7onX9Xl9duGCg9rLBjxaMS5121JVsAY",
  },
  {
    name: "Charcoal Hoodie",
    description: "Soft cotton-blend hoodie with kangaroo pocket and ribbed cuffs.",
    price: 49.99,
    stock: 32,
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSzNOyVSuvU9OWQN8zD1ccjt_SxBpFauhVyMJ8vzy5hSzc6WRT0t1hJGWUy1jXxy76Y-180SDO_ykeBOHgJU3kwLsXHh1ZSpPQ_4uy2XO1qFsj8GmyA-WF4",
  },
  {
    name: "Smart Water Bottle",
    description: "Insulated water bottle that keeps drinks cold for 24 hours.",
    price: 29.99,
    stock: 55,
    image: "https://m.media-amazon.com/images/I/51uLHDfzI0L.jpg",
  },
  {
    name: "Noise-Cancelling Earbuds",
    description: "Compact wireless earbuds with crystal-clear sound and noise reduction.",
    price: 119.99,
    stock: 15,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTETkeGM6PvFOvh4Bw9GK11Pc_ZC-1DL7x1iz0OR-jrxFTOf_bvTpXpNBuq-FFuBFwsQgERj2SJK0oeih3Mac-e_dFm6krSAA",
  },
  {
    name: "Minimalist Wallet",
    description: "A slim leather wallet with room for cards and cash.",
    price: 34.99,
    stock: 28,
    image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTaUgivuFEf21RfWEsztrOadXNexQU9Jpk_hwaQ-CsbCr-bj80M8Y_0utKk1T_YfsbddHxCfKAYY7gtYluB7Gq-OD-t5mzTT6hfyKSAw1_PSSW0G4WP2zPasA",
  },
  {
    name: "Sporty Running Shorts",
    description: "Quick-dry shorts designed for training and weekend runs.",
    price: 27.5,
    stock: 38,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSwP9ialiOPNtXOb4ukPb-nM30oXDXJUwYPhU_oHFRPMz3g9AkjUBciPlAcSTu3Uux5OX_FIFNfa1Og8IDPQNMLJfi2cH-E6A",
  },
  {
    name: "Wireless Charger Pad",
    description: "Fast-charging pad for every Qi-enabled phone.",
    price: 39.99,
    stock: 45,
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQNn72OoFWVNxk8Xr_gXvw_JetCDt0k7HChLpiR-LU3TdHHEDfH13N5e0NeAE1DNtd7iN-weor9dTbPRkPxzOZ7OEz8qcV_ptiJTNLFA6MzY9vsSg8hvXAnYeM",
  },
  {
    name: "Classic Leather Belt",
    description: "Adjustable leather belt that pairs nicely with casual and business looks.",
    price: 29.0,
    stock: 22,
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQel_u6r_2HltCJfwEkQR-auttRXM5K2QOjilg8i2VK4fM8DMecF6070OPgxyheoFhPg6aj0SGs4FtbKvj17GGsq_I6vu7NaGpaV_SMVcJnVo2wDdW2Zk5hPQ",
  },
];

export const seedDatabase = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@demo.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123!";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await hashPassword(adminPassword);
      await User.create({
        name: "Store Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("Seeded admin user:", adminEmail);
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.create(products);
      console.log(`Seeded ${products.length} products`);
    }
  } catch (error) {
    console.error("Database seeding failed", error);
  }
};
