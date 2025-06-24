const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/UserRoutes");
const productRoutes = require("./routes/ProductRoutes");
const cartRoutes = require("./routes/CartRoutes");
const CheckoutRoutes = require("./routes/CheckoutRoutes");
const OrderRoutes = require("./routes/OrderRoutes");
const UploadRoutes = require("./routes/UploadRoutes");
const SubscriberRoutes = require("./routes/SubscriberRoutes");
const AdminRoutes = require("./routes/AdminRoutes");
const ProductAdminRoutes = require("./routes/ProductAdminRoute");
const AdminOrderRoutes = require("./routes/AdminOrdersRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',           
    credentials: true
}));

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("WELCOME TO SHOPISTRY API!");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", CheckoutRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/upload", UploadRoutes);
app.use("/api/subscribe", SubscriberRoutes);

//Admin Routes
app.use("/api/admin/users", AdminRoutes);
app.use("/api/admin/products", ProductAdminRoutes);
app.use("/api/admin/orders", AdminOrderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
