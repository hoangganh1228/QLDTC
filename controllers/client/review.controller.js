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