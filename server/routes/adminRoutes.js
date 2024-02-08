// server/routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const ShopItem = require("../db/ShopItem");
// const User = require("../db/User");
// const { createNewUser } = require("../db/authenticaton/controler");
// const authRoutes = require("./authRoutes");

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


// POST route to add an item to the database
router.post("/shop-items", async (req, res) => {
  try {
    const newItem = new ShopItem({
     
      title: req.body.title,
      image: req.body.image,
      price: req.body.price,
      description: req.body.description,
      availableCount: req.body.availableCount,
      genre: req.body.genre,
    });
    const savedItem = await newItem.save(); // Save the item to the database
    res.status(201).json(savedItem); // Return the saved item with a 201 Created status
  } catch (error) {
    console.error("Error adding item to database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT route to update a shop item
// router.get("/shop-items/:id", async (req, res) => {
//     try {
//       const updatedItem = await ShopItem.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true } // Return the updated item after the update operation
//       );
  
//       if (!updatedItem) {
//         return res.status(404).json({ error: "Item not found" });
//       }
  
//       res.json(updatedItem);
//     } catch (error) {
//       console.error("Error updating item:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });

// router.post("/cart", async (req, res) => {
//   try {
//     const { customerId, itemId,  } = req.body;

//     // Find the item in the database
//     const item = await ShopItem.findById(itemId);
//     if (!item) {
//       return res.status(404).json({ error: "Item not found" });
//     }

//     // Check if there are enough available items
//     if (item.availableCount < quantity) {
//       return res.status(400).json({ error: "Not enough available items" });
//     }

//     // Update the item's available count
//     item.availableCount -= quantity;
//     await item.save();

//     // Add the item to the customer's cart (implementation depends on your data model)

//     res.json({ message: "Item added to cart successfully" });
//   } catch (error) {
//     console.error("Error adding item to cart:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });






  
// PUT route to update a shop item
router.put("/shop-items/:id", async (req, res) => {
  try {
    const updatedItem = await ShopItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated item after the update operation
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



//   router.delete("/shop-items", async (req, res) => {
//     try {
//       const { ids } = req.body;
  
//       if (!ids || !Array.isArray(ids)) {
//         return res.status(400).json({ error: "Invalid request body" });
//       }
  
//       // Delete the items from the database
//       const deletedItems = await ShopItem.deleteMany({ _id: { $in: ids } });
  
//       res.json({ deletedCount: deletedItems.deletedCount });
//     } catch (error) {
//       console.error("Error deleting items:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });

router.delete('/shop-items/:id?', async (req, res) => {
    try {
        const { id } = req.params;
        const { ids } = req.body;

        if (!id && (!ids || !Array.isArray(ids))) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        if (id) {
            // If ID is provided in the URL, delete the single item
            const deletedItem = await ShopItem.findByIdAndDelete(id);
            if (!deletedItem) {
                return res.status(404).json({ error: 'Item not found' });
            }
            return res.json({ message: 'Item deleted successfully', deletedItem });
        } else {
            // If IDs are provided in the request body, delete multiple items
            const deletedItems = await ShopItem.deleteMany({ _id: { $in: ids } });
            return res.json({ message: 'Items deleted successfully', deletedCount: deletedItems.deletedCount });
        }
    } catch (error) {
        console.error('Error deleting items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  router.get("/shop-items/search", async (req, res) => {
    try {
      // Extract query parameters
      const title = req.query.title;
      const genre = req.query.genre;
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
  
      // Construct the initial query object
      const query = {};
  
      // Add conditions for title, genre, and price range if provided
      if (title) {
        query.title = { $regex: new RegExp(title, "i") }; // Case-insensitive regex search for title
      }
      if (genre) {
        query.genre = { $regex: new RegExp(genre, "i") }; // Case-insensitive regex search for genre
      }
      if (minPrice && maxPrice) {
        query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }; // Filter by price range
      } else if (minPrice) {
        query.price = { $gte: parseFloat(minPrice) }; // Filter by minimum price
      } else if (maxPrice) {
        query.price = { $lte: parseFloat(maxPrice) }; // Filter by maximum price
      }
  
      // Perform the search using the constructed query
      const searchResult = await ShopItem.find(query);
  
      res.json(searchResult);
    } catch (error) {
      console.error("Error searching for shop items:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

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

  // router.post("/signup", async (req, res) => {
  //   try {
  //     const { email, password, authority } = req.body;
  //     const newUser = new User({ email, password, authority });
  //     const savedUser = await newUser.save();
  //     res.status(201).json(savedUser);
  //   } catch (error) {
  //     console.error("Error creating user:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // });




//   router.post("/signup", async (req, res) => {
//     try {  
//         const { email , password } = req.body;
//         if (!(email && password)) {
//             throw Error("Empty fields!");
//         } else {
//             const newUser = await CreatNewUser({
//                 email,
//                 password,
//             });
//             res.status(200).json(newUser);
//         }
//     } catch(error) {
//         res.status(400).send(error.message);
//     }
// });


module.exports = router;
