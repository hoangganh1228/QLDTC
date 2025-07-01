const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/review.controller");

router.post("/", controller.review);

router.patch("/:id", controller.updateReview);

router.delete("/:id", controller.deleteReview);

router.get("/reviews/:productId", controller.getReviews);

module.exports = router