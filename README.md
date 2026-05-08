# Shopless (React E‑Commerce)

A small e‑commerce React app built as part of my React labs. It uses the public **Route E‑Commerce API** for products/cart/orders and integrates **Stripe Checkout** (via the API checkout-session endpoint).

Authentication supports:

- **Email/Password** using Route API (JWT token)
- **Google sign-in** using **Firebase Authentication** (UI login only)

## Features

- Browse products and view product details
- Authentication (register / login)
- Cart management (add, remove, update quantity, clear cart)
- Stripe checkout session + redirect flow
- Protected routes (cart + checkout)

## Tech Stack

- **React 18** + **Vite**
- **Redux Toolkit** for state management
- **React Router** for routing
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Firebase Auth** (Google provider)

## Important Note about Google Login

Google login is handled by Firebase and **does not provide the Route API JWT token**. Endpoints that require the Route API token (cart/checkout) work only after **email/password** login.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Routes

- `/products` Products listing
- `/products/:id` Product details
- `/cart` Cart (protected)
- `/checkout` Checkout (protected)
- `/success` Success redirect page

