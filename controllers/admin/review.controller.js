const Review = require("../../models/review.model");

module.exports.delete = async (req, res) => {
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
}

module.exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();


    if (!reviews) {
      return res.status(404).json({ message: 'Không có đánh giá nào' });
    }

    res.status(200).json({
      message: 'Lấy danh sách đánh giá thành công',
      reviews
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy danh sách đánh giá',
      error: error.message
    });
  }

}