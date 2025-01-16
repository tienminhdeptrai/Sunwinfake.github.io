const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Sử dụng body-parser để xử lý JSON trong request body
app.use(bodyParser.json());

// Cơ sở dữ liệu người dùng (chỉ lưu trữ tạm thời trong bộ nhớ)
let users = {};

// API đăng ký người dùng
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.json({ success: false, message: "Tài khoản đã tồn tại!" });
  }
  users[username] = { password, balance: 100000 }; // Cung cấp số dư mặc định
  res.json({ success: true });
});

// API đăng nhập
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res.json({ success: false, message: "Tên tài khoản hoặc mật khẩu không đúng!" });
  }
  res.json({ success: true, balance: user.balance });
});

// Chạy server
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
