import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useAuth } from "./hooks/useAuth";
import { useProducts } from "./hooks/useProducts";
import { usePackages } from "./hooks/usePackages";
import type { UserPackage } from "./types/package";
import type { LocaleOption } from "./types/locale";
import {
  LOCALE_OPTIONS,
  DEFAULT_LOCALE,
  findLocaleOption,
} from "./constants/locale";
import { formatPrice, getCurrencySymbol } from "./utils/formatPrice";
import LoginPage from "./components/LoginPage";
import AppHeader from "./components/AppHeader";
import PackagesSidebar from "./components/packages/PackagesSidebar";
import CreatePackageForm from "./components/packages/CreatePackageForm";
import PackageModal from "./components/packages/PackageModal";
import EditPackageModal from "./components/packages/EditPackageModal";
import AllPackagesModal from "./components/packages/AllPackagesModal";
import "./App.css";

function App() {
  const [selectedLocale, setSelectedLocale] =
    useState<LocaleOption>(DEFAULT_LOCALE);
  const [packageName, setPackageName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [selectedProductQuantities, setSelectedProductQuantities] = useState<
    Record<string, number>
  >({});
  const [selectedPackage, setSelectedPackage] = useState<UserPackage | null>(
    null,
  );
  const [editingPackage, setEditingPackage] = useState<UserPackage | null>(
    null,
  );
  const [showAllPackages, setShowAllPackages] = useState(false);

  const {
    username,
    setUsername,
    password,
    setPassword,
    token,
    setToken,
    loading,
    error,
    authenticatedUser,
    handleLogin,
    handleLogout,
    updateLocale,
  } = useAuth();

  const {
    products,
    clear: clearProducts,
    addProduct,
  } = useProducts(token, selectedLocale);
  const {
    packages,
    clear: clearPackages,
    create: createPackageInDb,
    update: updatePackageInDb,
    remove: deletePackageInDb,
  } = usePackages(token, authenticatedUser);

  // Keep selectedPackage in sync with packages
  if (selectedPackage) {
    const updated = packages.find((pkg) => pkg.id === selectedPackage.id);
    if (!updated) setSelectedPackage(null);
    else if (updated !== selectedPackage) setSelectedPackage(updated);
  }

  const userPackages = packages.filter(
    (pkg) => pkg.ownerUsername === authenticatedUser,
  );

  const priceFormatter = (amount: number) =>
    formatPrice(amount, selectedLocale);

  const handleLocaleChange = (localeLabel: string) => {
    const option = LOCALE_OPTIONS.find((o) => o.label === localeLabel);
    if (!option) return;
    setSelectedLocale(option);
    if (authenticatedUser) updateLocale(authenticatedUser, option.locale);
  };

  const handleLogoutClick = () => {
    handleLogout();
    clearProducts();
    clearPackages();
    setSelectedPackage(null);
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    setSelectedProductQuantities((q) => ({
      ...q,
      [productId]: Math.max(0, Math.floor(quantity)),
    }));
  };

  const handleCreatePackage = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authenticatedUser) return;
    const productQuantities = Object.fromEntries(
      Object.entries(selectedProductQuantities).filter(([, v]) => v > 0),
    );
    try {
      await createPackageInDb({
        name: packageName.trim(),
        description: packageDescription.trim(),
        productQuantities,
        ownerUsername: authenticatedUser,
      });
      setPackageName("");
      setPackageDescription("");
      setSelectedProductQuantities({});
    } catch {
      // Error handled by hook
    }
  };

  const handleEditPackage = async (pkg: UserPackage) => {
    try {
      await updatePackageInDb(pkg);
      setEditingPackage(null);
    } catch {
      // Error handled by hook
    }
  };

  const handleDeletePackage = async (pkg: UserPackage) => {
    if (!window.confirm(`Delete package "${pkg.name}"?`)) return;
    try {
      await deletePackageInDb(pkg.id);
      if (selectedPackage?.id === pkg.id) setSelectedPackage(null);
      if (editingPackage?.id === pkg.id) setEditingPackage(null);
    } catch {
      // Error handled by hook
    }
  };

  const handleLoginSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    const data = await handleLogin(e);
    if (data) {
      setToken(data.token);
      setSelectedLocale(findLocaleOption(data.locale));
    }
  };

  if (!token) {
    return (
      <LoginPage
        username={username}
        password={password}
        loading={loading}
        error={error}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLoginSubmit}
      />
    );
  }

  return (
    <main className="app-shell">
      <AppHeader
        selectedLocale={selectedLocale}
        authenticatedUser={authenticatedUser ?? ""}
        onLocaleChange={handleLocaleChange}
        onLogout={handleLogoutClick}
      />
      <section className="page-layout">
        <PackagesSidebar
          packages={userPackages}
          onSelectPackage={setSelectedPackage}
          onEditPackage={setEditingPackage}
          onDeletePackage={handleDeletePackage}
          onViewAllPackages={() => setShowAllPackages(true)}
        />
        <section className="main-content-pane">
          <h2>Welcome, {authenticatedUser}</h2>
          <h3>Create Package</h3>
          <CreatePackageForm
            packageName={packageName}
            packageDescription={packageDescription}
            selectedQuantities={selectedProductQuantities}
            products={products}
            ownerUsername={authenticatedUser ?? ""}
            currencySymbol={getCurrencySymbol(selectedLocale.currency)}
            formatPrice={priceFormatter}
            onNameChange={setPackageName}
            onDescriptionChange={setPackageDescription}
            onQuantityChange={updateProductQuantity}
            onAddProduct={async (name, price) => {
              await addProduct(name, price, selectedLocale.currency);
            }}
            onSubmit={handleCreatePackage}
          />
        </section>
      </section>
      {selectedPackage && (
        <PackageModal
          selectedPackage={selectedPackage}
          products={products}
          formatPrice={priceFormatter}
          onClose={() => setSelectedPackage(null)}
        />
      )}
      {editingPackage && (
        <EditPackageModal
          key={editingPackage.id}
          packageToEdit={editingPackage}
          products={products}
          formatPrice={priceFormatter}
          onSave={handleEditPackage}
          onClose={() => setEditingPackage(null)}
        />
      )}
      {showAllPackages && (
        <AllPackagesModal
          token={token}
          products={products}
          formatPrice={priceFormatter}
          onClose={() => setShowAllPackages(false)}
        />
      )}
    </main>
  );
}

export default App;
