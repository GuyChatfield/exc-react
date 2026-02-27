import { useState } from "react";
import ProductList from "./components/products/ProductList";
import "./App.css";

const mockProducts = [
  { id: 1, name: "Product A", usdPrice: 10 },
  { id: 2, name: "Product B", usdPrice: 20 },
  { id: 3, name: "Product C", usdPrice: 30 },
  { id: 4, name: "Product D", usdPrice: 40 },
  { id: 5, name: "Product E", usdPrice: 50 },
  { id: 6, name: "Product F", usdPrice: 60 },
  { id: 7, name: "Product G", usdPrice: 70 },
  { id: 8, name: "Product H", usdPrice: 80 },
  { id: 9, name: "Product I", usdPrice: 90 },
  { id: 10, name: "Product J", usdPrice: 100 },
];

function App() {
  return (
    <>
      <h1>Package Manager</h1>
      <ProductList products={mockProducts} />
    </>
  );
}

export default App;
