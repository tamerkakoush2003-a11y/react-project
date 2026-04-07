import { useEffect, useState } from "react";

function Admin({ products, fetchProducts }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
  });

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/orders");
        const data = await response.json();
        setOrders(data);
      } catch {
        console.log("حدث خطأ أثناء جلب الطلبات");
      }
    };

    loadOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/orders");
      const data = await response.json();
      setOrders(data);
    } catch {
      console.log("حدث خطأ أثناء جلب الطلبات");
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price) return;

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      setMessage(data.message);
      setNewProduct({ name: "", price: "" });
      fetchProducts();
    } catch {
      setMessage("حدث خطأ أثناء إضافة المنتج");
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      setMessage(data.message);
      fetchProducts();
    } catch {
      setMessage("حدث خطأ أثناء حذف المنتج");
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      setMessage(data.message);
      fetchOrders();
    } catch {
      setMessage("حدث خطأ أثناء تحديث حالة الطلب");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-box">
        <h2>لوحة تحكم المدير</h2>

        <form className="admin-form" onSubmit={addProduct}>
          <input
            type="text"
            name="name"
            placeholder="اسم المنتج"
            value={newProduct.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="سعر المنتج"
            value={newProduct.price}
            onChange={handleChange}
          />

          <button type="submit">إضافة منتج</button>
        </form>

        {message && <p className="message-text">{message}</p>}

        <div className="admin-products">
          <h3 className="admin-section-title">إدارة المنتجات</h3>

          {products.map((product) => (
            <div className="admin-product-card" key={product.id}>
              <div>
                <h3>{product.name}</h3>
                <p>${product.price}</p>
              </div>

              <button onClick={() => deleteProduct(product.id)}>حذف</button>
            </div>
          ))}
        </div>

        <div className="admin-orders">
          <h3 className="admin-section-title">الطلبات</h3>

          {orders.length === 0 ? (
            <p className="empty-cart">لا توجد طلبات حتى الآن.</p>
          ) : (
            orders.map((order) => (
              <div className="admin-order-card" key={order.id}>
                <div>
                  <h3>الزبون: {order.customer_name}</h3>
                  <p>المجموع: ${order.total}</p>
                  <p>رقم الطلب: {order.id}</p>
                  <p>الحالة: {order.status || "جديد"}</p>
                </div>

                <div className="order-actions">
                  <button onClick={() => updateOrderStatus(order.id, "جديد")}>
                    جديد
                  </button>

                  <button
                    onClick={() =>
                      updateOrderStatus(order.id, "قيد المعالجة")
                    }
                  >
                    قيد المعالجة
                  </button>

                  <button onClick={() => updateOrderStatus(order.id, "مكتمل")}>
                    مكتمل
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;