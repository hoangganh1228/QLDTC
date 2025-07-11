const Review = require("../../models/review.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const review = async (req, res) => {
  try {
    const { rating, comment, product, user, order } = req.body;
  
    if (!rating || !product || !user || !order) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc: rating, product, user, order" });
    }

    // ✅ 1. Kiểm tra đơn hàng đó có thuộc về user không, và có chứa sản phẩm này không
    const foundOrder = await Order.findOne({
      _id: order,
      userId: user,
      items: {
        $elemMatch: {product_id: product }
      }
    });

    if (!foundOrder) {
      return res.status(400).json({
        message: "Đơn hàng không hợp lệ hoặc không chứa sản phẩm này"
      });
    }

    // ✅ 2. Kiểm tra đã review sản phẩm trong đơn hàng này chưa
    const existedReview = await Review.findOne({ user, product, order });
    if (existedReview) {
      return res.status(400).json({
        message: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi."
      });
    }

    // ✅ 3. Tạo review
    const newReview = new Review({ rating, comment, product, user, order });
    await newReview.save();

    const allReviews = await Review.find({ product });

    const totalRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const ratingCount = allReviews.length;
    const averageRating = totalRatings / ratingCount;

    await Product.findByIdAndUpdate(product, {
      $set: {
        "rating.rate": averageRating.toFixed(1),
        "rating.count": ratingCount
      }
    });
    
    res.status(201).json({
      message: "Tạo đánh giá thành công",
      review: newReview
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi." });
    }

    res.status(500).json({
      message: "Lỗi khi tạo đánh giá",
      error: error.message
    });
  }
};


const getReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Review.find({ product: id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách đánh giá thành công",
      reviews
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách đánh giá",
      error: error.message
    });
  }
};

module.exports = { review, getReviews };
