import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "antd";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Xato:", err));
  }, []);

  const addToCart = (product: Product) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} savatga qo‘shildi!`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📦 Mahsulotlar</h1>
      <Row gutter={[16, 16]}>
        {products.map((p) => (
          <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
            <Card title={p.name} bordered>
              <p>{p.description}</p>
              <p><b>Narx:</b> {p.price} so‘m</p>
              <p><b>Omborda:</b> {p.stock} dona</p>
              <Button type="primary" onClick={() => addToCart(p)}>
                Savatga qo‘shish
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
