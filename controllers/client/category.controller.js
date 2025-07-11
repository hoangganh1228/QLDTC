const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const categoryService = require("../../services/client/category.service");
const productService = require("../../services/client/product.service");

module.exports.index = async (req, res) => {
  
  const category = await Category.find();

  res.status(200).json({
      message: 'Category created successfully',
      data: category
    });
};

module.exports.getProductsByCategory = async (req, res) => {
  try {
    const rootId = req.params.id;
    const products = await Product.find({
      deleted: false,
      status: "active",
    })
    .populate('category');
    res.status(200).json({
      message: 'Lấy sản phẩm theo danh mục thành công',
      data: products
    });
  } catch (error) {
    console.error('[CATEGORY_PRODUCTS_ERROR]', error);
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
}

