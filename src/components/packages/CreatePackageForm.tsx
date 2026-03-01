import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { Product } from "../../types/product";
import "./CreatePackageForm.css";

type Props = {
  packageName: string;
  packageDescription: string;
  selectedQuantities: Record<string, number>;
  products: Product[];
  ownerUsername: string;
  currencySymbol: string;
  formatPrice: (amount: number) => string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onAddProduct: (name: string, price: number) => Promise<void>;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
};

export default function CreatePackageForm({
  packageName,
  packageDescription,
  selectedQuantities,
  products,
  ownerUsername,
  currencySymbol,
  formatPrice,
  onNameChange,
  onDescriptionChange,
  onQuantityChange,
  onAddProduct,
  onSubmit,
}: Props) {
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  const handleAddProduct = async () => {
    const name = newProductName.trim();
    const price = parseFloat(newProductPrice);
    if (!name || isNaN(price) || price <= 0) return;

    setAddingProduct(true);
    try {
      await onAddProduct(name, price);
      setNewProductName("");
      setNewProductPrice("");
    } finally {
      setAddingProduct(false);
    }
  };

  return (
    <form className="create-package-form" onSubmit={onSubmit}>
      <input
        type="text"
        value={packageName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Package name"
        required
      />
      <input
        type="text"
        value={packageDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Description"
        required
      />
      <div className="product-selector">
        <p className="selector-label">Select Products</p>
        <div className="product-options">
          {products.map((product) => (
            <label key={product.id} className="product-option">
              <input
                type="number"
                min={0}
                value={selectedQuantities[product.id] ?? 0}
                onChange={(e) =>
                  onQuantityChange(product.id, Number(e.target.value))
                }
              />
              <span>
                {product.name} ({formatPrice(product.price)})
              </span>
            </label>
          ))}
          <div className="add-product-inline">
            <input
              type="text"
              className="add-product-name"
              placeholder="New product name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
            <div className="add-product-price-wrapper">
              <span className="currency-symbol">{currencySymbol}</span>
              <input
                type="number"
                className="add-product-price"
                placeholder="Price"
                min={0.01}
                step={0.01}
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="add-product-btn"
              onClick={handleAddProduct}
              disabled={
                addingProduct || !newProductName.trim() || !newProductPrice
              }
            >
              {addingProduct ? "..." : "+"}
            </button>
          </div>
        </div>
      </div>
      <p className="field-help">Owner: {ownerUsername}</p>
      <button type="submit" className="primary-btn">
        Create Package
      </button>
    </form>
  );
}
