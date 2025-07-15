const systemConfig = require("../../config/system");

const productRoute = require("./product.route")

const categoryRoute = require("./category.route")


const reviewRoute = require("./review.route")

const userRoute = require("./user.route")

const orderRoute = require("./order.route")

const accountRoute = require("./account.route")


module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + "/products",
    productRoute
  );

  app.use(

    PATH_ADMIN + "/category",
    categoryRoute
  )


  app.use(
    PATH_ADMIN + "/reviews",
    reviewRoute
  )
  console.log(PATH_ADMIN + "/users")
  app.use(
    PATH_ADMIN + "/users",
    userRoute
  )

  app.use(
    PATH_ADMIN + "/orders",
    orderRoute
  )


  app.use(
    PATH_ADMIN + "/accounts",
    accountRoute
  )

}