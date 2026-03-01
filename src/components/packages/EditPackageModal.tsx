import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { UserPackage } from "../../types/package";
import type { Product } from "../../types/product";
import "./EditPackageModal.css";

type Props = {
  packageToEdit: UserPackage;
  products: Product[];
  formatPrice: (amount: number) => string;
  onSave: (pkg: UserPackage) => void;
  onClose: () => void;
};

export default function EditPackageModal({
  packageToEdit,
  products,
  formatPrice,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(packageToEdit.name);
  const [description, setDescription] = useState(packageToEdit.description);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    packageToEdit.productQuantities ?? {},
  );

  const updateQuantity = (productId: string, quantity: number) => {
    setQuantities((q) => ({
      ...q,
      [productId]: Math.max(0, Math.floor(quantity)),
    }));
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filteredQuantities = Object.fromEntries(
      Object.entries(quantities).filter(([, v]) => v > 0),
    );
    onSave({
      ...packageToEdit,
      name: name.trim(),
      description: description.trim(),
      productQuantities: filteredQuantities,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="package-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Package</h3>
        <form className="edit-package-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Package name"
            required
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
                    value={quantities[product.id] ?? 0}
                    onChange={(e) =>
                      updateQuantity(product.id, Number(e.target.value))
                    }
                  />
                  <span>
                    {product.name} ({formatPrice(product.price)})
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button type="submit" className="primary-btn">
              Save Changes
            </button>
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
