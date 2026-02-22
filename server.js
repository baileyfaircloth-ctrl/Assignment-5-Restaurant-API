// Import packages, initialize an express app, and define the port you will use
const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());

let menu = [];
let idCounter = 1;

/* ======================================
   1️⃣ REQUEST LOGGING MIDDLEWARE
====================================== */
const requestLogger = (req, res, next) => {
  console.log("==================================");
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);

  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request Body:", req.body);
  }

  next();
};

app.use(requestLogger);

/* ======================================
   2️⃣ INPUT VALIDATION MIDDLEWARE
====================================== */
const validateMenuItem = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),

  body("category")
    .notEmpty().withMessage("Category is required")
    .isIn(["appetizer", "entree", "dessert", "beverage"])
    .withMessage("Category must be appetizer, entree, dessert, or beverage"),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Ingredients must be an array with at least one item"),

  body("available")
    .optional()
    .isBoolean()
    .withMessage("Available must be true or false")
];

/* ======================================
   ROUTES
====================================== */

/* GET All Menu Items */
app.get('/api/menu', (req, res) => {
  res.status(200).json(menu);
});

/* GET Single Menu Item */
app.get('/api/menu/:id', (req, res) => {
  const item = menu.find(m => m.id === parseInt(req.params.id));

  if (!item) {
    return res.status(404).json({ error: "Menu item not found" });
  }

  res.status(200).json(item);
});

/* POST Create Menu Item */
app.post('/api/menu', validateMenuItem, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newItem = {
    id: idCounter++,
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    category: req.body.category,
    ingredients: req.body.ingredients,
    available: req.body.available ?? true
  };

  menu.push(newItem);

  res.status(201).json(newItem);
});

/* PUT Update Menu Item */
app.put('/api/menu/:id', validateMenuItem, (req, res) => {
  const item = menu.find(m => m.id === parseInt(req.params.id));

  if (!item) {
    return res.status(404).json({ error: "Menu item not found" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  item.name = req.body.name;
  item.description = req.body.description;
  item.price = parseFloat(req.body.price);
  item.category = req.body.category;
  item.ingredients = req.body.ingredients;
  item.available = req.body.available ?? true;

  res.status(200).json(item);
});

/* DELETE Menu Item */
app.delete('/api/menu/:id', (req, res) => {
  const index = menu.findIndex(m => m.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Menu item not found" });
  }

  menu.splice(index, 1);

  res.status(200).json({ message: "Menu item deleted successfully" });
});

/* START SERVER */
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});


// Data for the server
const menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// Define routes and implement middleware here
