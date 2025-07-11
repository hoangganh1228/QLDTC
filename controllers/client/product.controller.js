const Product = require("../../models/product.model");
const productService = require("../../services/client/product.service");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false,
    status: "active"
  }).populate("category")
  
  res.status(200).json({
    message: 'Product retrieved successfully',
    data: products
  });
};


// _id 
module.exports.detailProduct = async (req, res) => {
  try {
    
    const id = req.params.id;
    const product = await Product.findOne({_id: id, deleted: false});

    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });

    res.status(200).json({ message: 'Lấy thông tin thành công', data: product });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error });
  }
}


exports.searchProduct = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
     const products = await Product.find({
      title: { 
        $regex: "^" + keyword,
        $options: "i" 
      }
    });
   

    res.json({ data: products });
  } catch (err) {
    console.error("Lỗi tìm kiếm sản phẩm:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

