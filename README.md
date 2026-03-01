# EXC React Frontend

A React 19 + TypeScript application for managing product packages with multi-locale currency support.

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and builds
- **Redux Toolkit** for state management
- **MUI (Material UI)** for icons
- **Custom CSS** with co-located stylesheets

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

The app expects the API to be running at `http://localhost:8080` (configurable via `VITE_API_BASE_URL` environment variable).

## Project Structure

```
src/
├── components/          # React components
│   ├── packages/        # Package-related components
│   │   ├── AllPackagesModal.tsx      # View all packages from all users
│   │   ├── CreatePackageForm.tsx     # Form to create new packages
│   │   ├── EditPackageModal.tsx      # Modal to edit existing packages
│   │   ├── PackageModal.tsx          # View package details
│   │   └── PackagesSidebar.tsx       # User's packages list sidebar
│   ├── products/        # Product display components
│   │   ├── ProductItem.tsx
│   │   └── ProductList.tsx
│   ├── AppHeader.tsx    # Header with locale selector
│   └── LoginPage.tsx    # Authentication UI
├── constants/           # Application constants
│   └── locale.ts        # Locale options (UK, US, France, Japan)
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication logic
│   ├── usePackages.ts   # Package CRUD operations
│   └── useProducts.ts   # Product fetching and creation
├── store/               # Redux store
│   ├── store.ts         # Store configuration
│   ├── packagesSlice.ts # Packages state management
│   ├── productsSlice.ts # Products state management
│   └── userSlice.ts     # User state management
├── types/               # TypeScript type definitions
│   ├── locale.ts
│   ├── login.ts
│   ├── package.ts
│   ├── product.ts
│   └── user.ts
├── utils/               # Utility functions
│   └── formatPrice.ts   # Currency formatting helpers
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Key Features

### Authentication

- Simple username/password login
- Session stored in Redux state
- User locale preferences synced with backend

### Locale & Currency Support

- **Supported locales**: UK (GBP), US (USD), France (EUR), Japan (JPY)
- Locale selector in header persists preference to backend
- Prices automatically converted using live exchange rates
- Formatting respects locale conventions (e.g., ¥1,234 for JPY)

### Package Management

- **Create**: Form with name, description, and product selector with quantities
- **View**: Modal showing package details with products, prices, and totals
- **Edit**: Modal to modify package contents
- **Delete**: Remove packages with confirmation
- **View All**: Browse all packages from all users

### Product Creation

- Inline "Add Product" form within the Create Package modal
- Enter name and price in the currently selected currency
- Product is immediately added to the list

## Points of Interest

### State Management

- [store/store.ts](src/store/store.ts) - Redux store configuration
- [store/productsSlice.ts](src/store/productsSlice.ts) - Products async thunks and state
- [store/packagesSlice.ts](src/store/packagesSlice.ts) - Packages CRUD operations

### Custom Hooks

- [hooks/useAuth.ts](src/hooks/useAuth.ts) - Authentication with backend integration
- [hooks/useProducts.ts](src/hooks/useProducts.ts) - Products with auto-refresh every 15s
- [hooks/usePackages.ts](src/hooks/usePackages.ts) - Packages polling and CRUD

### Currency Formatting

- [utils/formatPrice.ts](src/utils/formatPrice.ts) - `Intl.NumberFormat` wrapper for locale-aware pricing
- [constants/locale.ts](src/constants/locale.ts) - Locale configuration and defaults

### UI Components

- [components/packages/CreatePackageForm.tsx](src/components/packages/CreatePackageForm.tsx) - Package creation with inline product addition
- [components/packages/EditPackageModal.tsx](src/components/packages/EditPackageModal.tsx) - Full package editing
- [components/AppHeader.tsx](src/components/AppHeader.tsx) - Locale dropdown and logout

### Styling

Each component has a co-located CSS file (e.g., `PackageModal.tsx` → `PackageModal.css`).

## API Integration

The frontend communicates with a Spring Boot API:

| Endpoint        | Method | Description                            |
| --------------- | ------ | -------------------------------------- |
| `/login`        | POST   | Authenticate user                      |
| `/products`     | GET    | List products (with locale conversion) |
| `/products`     | POST   | Create new product                     |
| `/packages`     | GET    | List packages (optionally by owner)    |
| `/packages`     | POST   | Create package                         |
| `/packages/:id` | PUT    | Update package                         |
| `/packages/:id` | DELETE | Delete package                         |
| `/packages/all` | GET    | List all packages                      |

## Environment Variables

| Variable            | Default                 | Description     |
| ------------------- | ----------------------- | --------------- |
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API URL |
