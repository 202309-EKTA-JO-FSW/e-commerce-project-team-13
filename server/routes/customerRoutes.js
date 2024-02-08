// server/routes/customerRoutes.js

const express = require("express");
const router = express.Router();
const ShopItem = require("../db/ShopItem");


// GET all shop items with optional filters including search by title, price, and genre
router.get("/shop-items/search", async (req, res) => {
  try {
    let query = {};

    // Add conditions for title, price range, and genre if provided
    if (req.query.title) {
      query.title = { $regex: new RegExp(req.query.title, "i") }; // Case-insensitive regex search for title
    }
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = { $gte: parseFloat(req.query.minPrice), $lte: parseFloat(req.query.maxPrice) }; // Filter by price range
    }
    if (req.query.genre) {
      query.genre = { $regex: new RegExp(req.query.genre, "i") }; 
    }

    const shopItems = await ShopItem.find(query);
    res.json(shopItems);
  } catch (error) {
    console.error("Error fetching shop items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET single shop item by ID
router.get("/shop-items/:id", async (req, res) => {
  try {
    const shopItem = await ShopItem.findById(req.params.id);
    if (!shopItem) return res.status(404).json({ error: "Item not found" });
    res.json(shopItem);
  } catch (error) {
    console.error("Error fetching shop item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/cart", async (req, res) => {
    try {
      const { customerId, itemId, quantity } = req.body;
  
      const item = await ShopItem.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
  
      // Check if there are enough available items
      if (item.availableCount < quantity) {
        return res.status(400).json({ error: "Not enough available items" });
      }
  
      // Update the item's available count
      item.availableCount -= quantity;
      await item.save();
  
      // Add the item to the customer's cart (implementation depends on your data model)
  
      res.json({ message: "Item added to cart successfully" });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


router.get("/shop-items", async (req, res) => {
    try {
      let query = {};
      if (req.query.category) query.genre = req.query.category;
      if (req.query.minPrice && req.query.maxPrice)
        query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
  
      const shopItems = await ShopItem.find(query);
      res.json(shopItems);
    } catch (error) {
      console.error("Error fetching shop items:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  // router.post("/checkout", async (req, res) => {
  //   try {
  //     const { customerId } = req.body;
  
  //     // Fetch the customer's cart from the database
  //     const customer = await Customer.findById(customerId).populate("cart.item");
  //     if (!customer) {
  //       return res.status(404).json({ error: "Customer not found" });
  //     }
  
  //     // Calculate the total bill
  //     let totalBill = 0;
  //     customer.cart.forEach(cartItem => {
  //       totalBill += cartItem.quantity * cartItem.item.price;
  //     });
  
  //     // Create an order object with the items in the cart and the total bill
  //     const order = {
  //       customer: customerId,
  //       items: customer.cart,
  //       totalBill
  //     };
  
  //     // Clear the customer's cart
  //     customer.cart = [];
  //     await customer.save();
  
  //     res.json(order);
  //   } catch (error) {
  //     console.error("Error processing checkout:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // });




module.exports = router;
