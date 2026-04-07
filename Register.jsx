import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch {
      setMessage("حدث خطأ في التسجيل");
    }
  };

  return (
    <div className="form-page">
      <div className="form-box">
        <h2>إنشاء حساب</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="أدخل الاسم"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="أدخل البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="أدخل كلمة المرور"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">تسجيل</button>
        </form>

        {message && <p className="message-text">{message}</p>}
      </div>
    </div>
  );
}

export default Register;