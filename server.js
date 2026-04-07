const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("الخادم يعمل");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "تم الاتصال بقاعدة البيانات بنجاح",
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "فشل الاتصال بقاعدة البيانات",
      error: error.message,
    });
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء جلب المنتجات",
      error: error.message,
    });
  }
});

app.post("/products", async (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "اسم المنتج والسعر مطلوبان" });
  }

  try {
    const newProduct = await pool.query(
      "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
      [name, price]
    );

    res.status(201).json({
      message: "تمت إضافة المنتج بنجاح",
      product: newProduct.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء إضافة المنتج",
      error: error.message,
    });
  }
});

app.delete("/products/:id", async (req, res) => {
  const productId = Number(req.params.id);

  try {
    const foundProduct = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [productId]
    );

    if (foundProduct.rows.length === 0) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    await pool.query("DELETE FROM products WHERE id = $1", [productId]);

    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء حذف المنتج",
      error: error.message,
    });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "جميع الحقول مطلوبة" });
  }

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "المستخدم موجود مسبقًا" });
    }

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );

    res.status(201).json({
      message: "تم إنشاء الحساب بنجاح",
      user: newUser.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ في إنشاء الحساب",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    res.json({
      message: "تم تسجيل الدخول بنجاح",
      user: user.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ في تسجيل الدخول",
      error: error.message,
    });
  }
});

app.post("/orders", async (req, res) => {
  const { customer_name, total } = req.body;

  if (!customer_name || !total) {
    return res.status(400).json({ message: "اسم الزبون والمجموع مطلوبان" });
  }

  try {
    const newOrder = await pool.query(
      "INSERT INTO orders (customer_name, total) VALUES ($1, $2) RETURNING *",
      [customer_name, total]
    );

    res.status(201).json({
      message: "تم إنشاء الطلب بنجاح",
      order: newOrder.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء إنشاء الطلب",
      error: error.message,
    });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء جلب الطلبات",
      error: error.message,
    });
  }
});

app.put("/orders/:id", async (req, res) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "حالة الطلب مطلوبة" });
  }

  try {
    const foundOrder = await pool.query(
      "SELECT * FROM orders WHERE id = $1",
      [orderId]
    );

    if (foundOrder.rows.length === 0) {
      return res.status(404).json({ message: "الطلب غير موجود" });
    }

    const updatedOrder = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, orderId]
    );

    res.json({
      message: "تم تحديث حالة الطلب بنجاح",
      order: updatedOrder.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "حدث خطأ أثناء تحديث الطلب",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});