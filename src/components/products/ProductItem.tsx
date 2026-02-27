import type { CSSProperties } from "react";
import type { Product } from "../../types/product";

type ProductItemProps = {
  product: Product;
};

const ProductItem = ({ product }: ProductItemProps) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.usdPrice);

  return (
    <article style={styles.card}>
      <h3 style={styles.name}>{product.name}</h3>
      <p style={styles.price}>{formattedPrice}</p>
    </article>
  );
};

const styles: Record<string, CSSProperties> = {
  card: {
    minHeight: "120px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#fff",
    justifyContent: "space-between",
    color: "#111",
  },
  name: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.2,
  },
  price: {
    margin: 0,
    marginTop: "auto",
    fontSize: "1rem",
    fontWeight: 700,
  },
};

export default ProductItem;
