function Products() {
  const products = [
    { id: 1, name: "Laptop", price: "$900", image: "💻" },
    { id: 2, name: "Phone", price: "$500", image: "📱" },
    { id: 3, name: "Headphones", price: "$120", image: "🎧" },
    { id: 4, name: "Watch", price: "$250", image: "⌚" },
    { id: 5, name: "Keyboard", price: "$80", image: "⌨️" },
    { id: 6, name: "Mouse", price: "$40", image: "🖱️" },
    { id: 7, name: "Camera", price: "$650", image: "📷" },
    { id: 8, name: "Speaker", price: "$150", image: "🔊" },
  ];

  return (
    <section className="page">
      <h1>Products Page</h1>

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
  );
}

export default Products;