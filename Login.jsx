import { useState } from "react";

function Login({ setUser, setCurrentPage }) {
  const [formData, setFormData] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setCurrentPage("home");
      }
    } catch {
      setMessage("حدث خطأ في تسجيل الدخول");
    }
  };

  return (
    <div className="form-page">
      <div className="form-box">
        <h2>تسجيل الدخول</h2>

        <form onSubmit={handleLogin}>
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

          <button type="submit">دخول</button>
        </form>

        {message && <p className="message-text">{message}</p>}
      </div>
    </div>
  );
}

export default Login;