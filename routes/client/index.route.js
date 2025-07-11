const productRoute = require("./product.route")

const authRoute = require("./auth.route")

const reviewRoute = require("./review.route")

const orderRoute = require("./order.route")

const categoryRoute = require("./category.route")

const cartRoute = require("./cart.route")

module.exports = (app) => {
  app.use("/products", productRoute);

  app.use("/category", categoryRoute);
  
  app.use("/auth", authRoute);
  
  app.use("/cart", cartRoute);

  app.use("/reviews", reviewRoute)
  
  app.use("/order", orderRoute)

}


  




