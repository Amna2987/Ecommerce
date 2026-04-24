const express = require("express");
const authRoutes = require("./components/routes/auth.routes");
const productRoutes = require("./components/routes/product.routes");
const cartRoutes = require("./components/routes/cart.route");
const orderRoutes = require("./components/routes/order.routes");
const adminRoutes = require("./components/routes/admin.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { success } = require("./components/utils/response.utils");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://ecommerce-production-7caf.up.railway.app",
    // origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/shop", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);
app.get("/api/health", (req, res) => {
  console.log("running successfully");
  success(res, 'server health is good');
});

module.exports = app;
