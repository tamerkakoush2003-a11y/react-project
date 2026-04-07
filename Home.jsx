function Home() {
  const products = [
    { id: 1, name: "Laptop", price: "$900", image: "💻" },
    { id: 2, name: "Phone", price: "$500", image: "📱" },
    { id: 3, name: "Headphones", price: "$120", image: "🎧" },
    { id: 4, name: "Watch", price: "$250", image: "⌚" },
  ];

  const categories = [
    { id: 1, name: "Electronics", icon: "🖥️" },
    { id: 2, name: "Mobiles", icon: "📱" },
    { id: 3, name: "Accessories", icon: "🎧" },
    { id: 4, name: "Watches", icon: "⌚" },
  ];

  return (
    <>
      <section className="hero">
        <h1>Welcome to Our E-Commerce Store</h1>
        <p>Shop the best products with easy ordering and fast delivery</p>
        <button>Shop Now</button>
      </section>

      <section className="products">
        <h2>Our Products</h2>

        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">{product.image}</div>
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>

        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.id}>
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;