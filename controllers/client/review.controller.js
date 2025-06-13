const Review = require("../../models/review.model");

module.exports.review = async (req, res) => {
  try {
    const { rating, image, comment, product, user } = req.body;
    if (!rating || !product || !user) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: rating, product, user' });
    }

    // Thêm dữ liêu vào DB
    const newReview = new Review({
      rating,
      image,
      comment,
      product,
      user
    });

    await newReview.save();

    res.status(201).json({
      message: 'Tạo đánh giá thành công',
      review: newReview
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi tạo đánh giá',
      error: error.message
    });
  }
};
