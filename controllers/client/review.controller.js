const Review = require("../../models/review.model");

module.exports.review = async (req, res) => {
  try {
    const { rating, image, comment, product, user } = req.body;
    if (!rating || !product || !user) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: rating, product, user' });
    }
// 1. Kiểm tra user có mua sản phẩm chưa
    const ordered = await Order.findOne({
      user: user,
      product: product,
      status: 'completed' // chỉ đơn đã hoàn thành mới được review
    });

    if (!ordered) {
      return res.status(400).json({
        message: 'Bạn chỉ có thể đánh giá sản phẩm đã đặt hàng thành công.'
      });
    }

    // 2. Kiểm tra user đã review sản phẩm này chưa
    const existedReview = await Review.findOne({
      user: user,
      product: product
    });

    if (existedReview) {
      return res.status(400).json({
        message: 'Bạn đã đánh giá sản phẩm này rồi, không thể đánh giá lại.'
      });
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
module.exports.updateReview = async (req, res) => {
  try {
    const id = req.params.id;
    const newData = { ...req.body, updatedAt: new Date() };
    console.log(newData);

    const result = await Review.updateOne(
      { _id: id },
      newData
    );

    console.log(result);

    if (!result) {
      return res.status(404).json({
        message: 'Không tìm thấy đánh giá hoặc không có thay đổi nào.'
      });
    }

    res.status(200).json({
      message: 'Cập nhật đánh giá thành công',
      data: result
    });

  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi cập nhật đánh giá',
      error: error.message
    });
  }
};
module.exports.deleteReview = async (req, res) => {
  const id = req.params.id;
    try {
      const deletedProduct = await Review.deleteOne({
        _id: id
      });
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Không tìm thấy đánh giá để xóa' });
      }
  
      res.status(200).json({
        message: 'Xóa đánh giá thành công',
        product: deletedProduct
      });
    } catch (error) {
      res.status(500).json({
        message: 'Lỗi khi xóa đánh giá',
        error: error.message
      });
    }
};
module.exports.getReviews = async (req, res) => {
  try {
    const productId = req.params.productId; // ví dụ client gửi /reviews/:productId

    // tìm toàn bộ review của 1 sản phẩm
    const reviews = await Review.find({ product: productId })
      .populate("user", "name") // nếu user là ref, trả thêm tên/ảnh user
      .sort({ createdAt: -1 }); // mới nhất trước

    res.status(200).json({
      message: "Lấy danh sách đánh giá thành công",
      reviews: reviews
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách đánh giá",
      error: error.message
    });
  }
};
