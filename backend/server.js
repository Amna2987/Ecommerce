require("dotenv").config();
const app = require("./app");
const connectDB = require("./components/config/db");

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log("server is running"));
});
