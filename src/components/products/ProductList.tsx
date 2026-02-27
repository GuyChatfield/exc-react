import React from "react";
import ProductItem from "./ProductItem";
import type { Product } from "../../types/product";

type ProductListProps = {
    products: Product[];
    maxHeight?: number | string;
};

const ProductList: React.FC<ProductListProps> = ({ products, maxHeight = "70vh" }) => {

    return (
        <div
            style={{
                maxHeight,
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "1rem",
                padding: "0.5rem",
            }}
        >
            {products.map((product) => (
                <ProductItem key={String(product.id)} product={product} />
            ))}
        </div>
    );
};

export default ProductList;