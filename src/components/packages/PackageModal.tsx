import type { UserPackage } from "../../types/package";
import type { Product } from "../../types/product";
import "./PackageModal.css";

type Props = {
  selectedPackage: UserPackage;
  products: Product[];
  formatPrice: (amount: number) => string;
  onClose: () => void;
};

export default function PackageModal({
  selectedPackage,
  products,
  formatPrice,
  onClose,
}: Props) {
  const quantities = selectedPackage.productQuantities ?? {};
  const selectedPackageProducts = products.filter((product) =>
    Object.prototype.hasOwnProperty.call(quantities, product.id),
  );

  const total = selectedPackageProducts.reduce(
    (sum, product) => sum + product.price * quantities[product.id],
    0,
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="package-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{selectedPackage.name}</h3>
        <p>{selectedPackage.description}</p>

        <h4>Products</h4>
        {selectedPackageProducts.length === 0 ? (
          <p>No products in this package.</p>
        ) : (
          <>
            <ul>
              {selectedPackageProducts.map((product) => (
                <li key={product.id}>
                  {product.name} ({formatPrice(product.price)}){" x "}
                  {quantities[product.id]}
                </li>
              ))}
            </ul>
            <p className="package-total">
              <strong>Total: {formatPrice(total)}</strong>
            </p>
          </>
        )}

        <button type="button" className="secondary-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
