import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { UserPackage } from "../../types/package";
import "./PackagesSidebar.css";

type Props = {
  packages: UserPackage[];
  onSelectPackage: (pkg: UserPackage) => void;
  onEditPackage?: (pkg: UserPackage) => void;
  onDeletePackage?: (pkg: UserPackage) => void;
  onViewAllPackages?: () => void;
};

export default function PackagesSidebar({
  packages,
  onSelectPackage,
  onEditPackage,
  onDeletePackage,
  onViewAllPackages,
}: Props) {
  return (
    <aside className="packages-nav-pane">
      <div className="packages-header">
        <h3>My Packages</h3>
        {onViewAllPackages && (
          <button
            type="button"
            className="view-all-btn"
            onClick={onViewAllPackages}
          >
            View All
          </button>
        )}
      </div>
      <ul className="packages-nav-list">
        {packages.length === 0 ? (
          <li className="empty-nav-item">No packages yet</li>
        ) : (
          packages.map((pkg) => (
            <li key={pkg.id} className="package-nav-item">
              <span className="package-name">{pkg.name}</span>
              <div className="package-actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => onSelectPackage(pkg)}
                  title="View"
                >
                  <VisibilityIcon fontSize="small" />
                </button>
                {onEditPackage && (
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => onEditPackage(pkg)}
                    title="Edit"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                )}
                {onDeletePackage && (
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => onDeletePackage(pkg)}
                    title="Delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
