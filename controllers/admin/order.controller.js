const Order = require("../../models/order.model");

module.exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email") // Lấy thông tin user nếu cần
      .populate("items.product_id", "title price image") // Lấy thông tin product trong từng item
      .sort({ createdAt: -1 }); // sắp xếp mới nhất trước

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports.getDetailOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate("items.product_id", "name price image")
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy chi tiết đơn hàng' });
  }
}

module.exports.deleteOrder = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Thiếu ID đơn hàng." });
  }

  try {
    const deleted = await Order.deleteOne({
      _id: id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng để xóa." });
    }

    return res.status(200).json({ message: "Đơn hàng đã được xóa thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa đơn hàng:", error);
    return res.status(500).json({ message: "Đã xảy ra lỗi khi xóa đơn hàng." });
  }
}

