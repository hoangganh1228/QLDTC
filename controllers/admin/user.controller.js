const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
// GET /users — Lấy danh sách người dùng
module.exports.index = async (req, res) => {
  try {
    console.log("HEELO");
    const users = await User.find({deleted: false}, "-password -email"); // loại bỏ password
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


module.exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, status } = req.body;

    const emailExists = await User.findOne({
        email: email,
    });

    if (emailExists) {
        return res.status(400).json({ success: false, error: "Email đã tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      status,
    });

    const savedUser = await user.save();

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, status } = req.body;

        if (email) {
        const emailExists = await User.findOne({
            email: email,
            _id: { $ne: id },
        });

        if (emailExists) {
            return res.status(400).json({ success: false, error: "Email đã tồn tại" });
        }
        }
        const updateData = {
            name,
            email,
            phone,
            address,
            status,
            updatedAt: Date.now(),
        };

        // Nếu người dùng truyền lên pass thì hash và cập nhật
        if (req.body.pass && req.body.pass.trim() !== "") {
        const hashedPassword = await bcrypt.hash(req.body.pass, 10);
        updateData.password = hashedPassword;
        }

        const result = await User.updateOne({ _id: id }, { $set: updateData });

        if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: "Không tìm thấy người dùng" });
        }

        res.status(200).json({ success: true, message: "Cập nhật người dùng thành công" });
    } catch (error) {
        res.status(500).json({ success: false, error: err.message });
    }
}

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.updateOne(
      { _id: id },
      { $set: { deleted: true, updatedAt: Date.now() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ success: true, message: "Đã xóa người dùng (soft delete)" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user) {
      res.status(404).json({message: 'Không tìm thấy sản phẩm hoặc không có thay đổi nào.'});
    }

    return res.status(200).json({
      message: "Lấy ra thông tin người dùng thành công!",
      data: user
    })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
  }
}