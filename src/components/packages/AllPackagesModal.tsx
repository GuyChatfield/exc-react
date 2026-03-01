import { useEffect, useState } from "react";
import type { UserPackage } from "../../types/package";
import type { Product } from "../../types/product";
import "./AllPackagesModal.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type Props = {
  token: string;
  products: Product[];
  formatPrice: (amount: number) => string;
  onClose: () => void;
};

export default function AllPackagesModal({
  token,
  products,
  formatPrice,
  onClose,
}: Props) {
  const [allPackages, setAllPackages] = useState<UserPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/packages/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch packages");
        const data = await res.json();
        setAllPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchAllPackages();
  }, [token]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>All Packages: {allPackages.length}</h2>
        <p>
          For exercise purposes, find here all packages regardless of owner.
        </p>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <ul className="all-packages-list">
            {allPackages.length === 0 ? (
              <li>No packages found</li>
            ) : (
              allPackages.map((pkg) => {
                const quantities = pkg.productQuantities ?? {};
                const packageProducts = products.filter((p) =>
                  Object.prototype.hasOwnProperty.call(quantities, p.id),
                );
                const total = packageProducts.reduce(
                  (sum, p) => sum + p.price * quantities[p.id],
                  0,
                );
                return (
                  <li key={pkg.id} className="all-packages-item">
                    <div className="package-header-row">
                      <strong>{pkg.name}</strong>
                      <span className="package-owner">
                        by {pkg.ownerUsername}
                      </span>
                    </div>
                    {pkg.description && (
                      <p className="package-description">{pkg.description}</p>
                    )}
                    {packageProducts.length > 0 && (
                      <ul className="package-products-list">
                        {packageProducts.map((p) => (
                          <li key={p.id}>
                            {p.name} ({formatPrice(p.price)}) x{" "}
                            {quantities[p.id]}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="package-total">
                      <strong>Total: {formatPrice(total)}</strong>
                    </p>
                  </li>
                );
              })
            )}
          </ul>
        )}
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
