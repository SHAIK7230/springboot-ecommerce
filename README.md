# 🛒 Full-Stack Spring Boot & React E-Commerce Platform

[![Java](https://img.shields.io/badge/Java-23-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4+-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Material UI](https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A modern, production-grade e-commerce application engineered with **Spring Boot 3 (REST API)** on the backend and **React 18 + Vite** on the frontend. Features complete user authentication with JWT, role-based access control (Admin, Seller, Customer), inventory & stock tracking, a 4-step interactive checkout flow with multi-method payment support (Cash on Delivery, UPI QR code, Credit/Debit Card, and Stripe), and a responsive store interface formatted in **Indian Rupees (₹)** with high-resolution product photography.

---

## ⚡ 1-Click Instant Cloud Demo (Run & Test Online)

Interviewers and recruiters can test the application live in the cloud without installing Java, Maven, or Node.js locally:

| Platform | Direct Launch Link | Setup Time |
| :--- | :--- | :--- |
| **GitHub Codespaces** | [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/SHAIK7230/springboot-ecommerce) | ~1 min (Pre-configured) |
| **Gitpod** | [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/SHAIK7230/springboot-ecommerce) | ~1 min |

> 💡 **Quick Run in Codespaces / Cloud Terminal**:
> 1. Click **[Open in GitHub Codespaces](https://codespaces.new/SHAIK7230/springboot-ecommerce)**.
> 2. Start the Backend API: `cd sb-ecom && ./mvnw spring-boot:run`
> 3. Start the Frontend Store: `cd ecom-frontend && npm run dev`
> 4. Preview opens automatically at port `5173`!

---

## 🌟 Key Highlights & Architectural Features

### 🛍️ Customer Experience & Catalog
- **Rich Product Catalog**: Pre-seeded with 8 diverse products across 3 categories (Electronics, Fashion, Home & Living) featuring high-resolution images, discount percentages, and special pricing formatted in Indian Rupees (`₹`).
- **Real-Time Stock Checks**: Dynamic inventory validation ensures customers cannot add more units than currently available in stock.
- **Cart Management**: Persistent shopping cart synced across browser sessions and validated against live database inventory.

### 💳 Robust 4-Step Checkout Flow
- **Step 1 - Address Management**: Add, update, and delete shipping addresses with automatic address selection and visual checkmark highlighting.
- **Step 2 - Payment Method Selection**: Choose between multiple payment options:
  - **Cash on Delivery (COD)** (Doorstep payment)
  - **UPI / QR Code (Instant Demo)** (Simulated QR code & UPI VPA validation)
  - **Credit / Debit Card (Instant Demo)** (Visual card preview with live formatted inputs)
  - **Stripe Gateway** (Global credit/debit card processing)
- **Step 3 - Order Summary**: Real-time invoice review detailing billing address, itemized products, quantities, tax, and order subtotal in `₹`.
- **Step 4 - Order Placement & Confirmation**: Decrements inventory stock in real-time, clears database cart, saves order and payment records, and renders a celebratory order confirmation receipt with an Order Reference Number.

### 🛡️ Enterprise Security & Role-Based Access Control (RBAC)
- **JWT (JSON Web Token)**: Stateless authentication via HTTP-only security cookies and `Authorization: Bearer` token validation.
- **Role Permissions**:
  - `ROLE_USER`: Browse catalog, manage personal cart, add delivery addresses, place orders.
  - `ROLE_SELLER`: Access seller dashboard, manage owned products, and view incoming orders.
  - `ROLE_ADMIN`: Complete administrative control over all categories, products, sellers, user orders, and revenue analytics.
- **Client Route Protection**: Enhanced `PrivateRoute` middleware prevents unauthorized access while ensuring customers seamlessly access their cart and checkout steps.

### 📊 Admin & Seller Dashboards
- **Inventory & Category Controls**: Add new categories, upload product images, set discounts, and update quantities.
- **Order Lifecycle Management**: View, filter, and transition order states (e.g., `Accepted`, `Processing`, `Shipped`, `Delivered`).
- **Revenue Analytics**: Visual summary cards tracking total sales volume, order counts, and active products.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 23, Spring Boot 3.4+, Spring Data JPA, Hibernate, Spring Security 6, JJWT (0.12.6), Lombok, ModelMapper |
| **Frontend** | React 18, Vite 7, Redux Toolkit, React Router v6, Tailwind CSS, Material UI (MUI), React Icons, React Hot Toast |
| **Database** | Embedded Persistent H2 Database (`jdbc:h2:file:./data/ecomdb`) with zero-config auto-seeding. Supports external PostgreSQL / MySQL. |
| **Build Tools** | Maven Wrapper (`mvnw`), npm / Node.js |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java Development Kit (JDK)**: Version 17, 21, or 23 installed (`java -version`)
- **Node.js**: Version 18+ and npm installed (`node -v`, `npm -v`)
- **Git**: Installed on your system

### 1. Clone the Repository
```bash
git clone https://github.com/SHAIK7230/springboot-ecommerce.git
cd springboot-ecommerce
```

### 2. Start the Backend API (Port 8080)
The backend uses an embedded H2 database that automatically creates tables and seeds sample products on first boot—no external database setup required!

```bash
cd sb-ecom

# On Windows:
.\mvnw.cmd spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```
- API Base URL: `http://localhost:8080/api`
- Swagger UI Documentation: `http://localhost:8080/swagger-ui.html`
- H2 Database Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/ecomdb`, User: `sa`, Password: *(leave blank)*)

### 3. Start the Frontend Application (Port 5173)
In a new terminal window:

```bash
cd ecom-frontend
npm install
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

---

## 👥 Demo Credentials for Interviewers

The database comes pre-populated with accounts for every user role:

| Role | Username | Password | Email | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `adminPass` | `admin@example.com` | Full platform control (`/admin`) |
| **Seller** | `seller1` | `password2` | `seller1@example.com` | Product & Seller order management |
| **Customer** | `user1` | `password1` | `user1@example.com` | Shopping, Cart & Checkout |
| **Customer (Demo)** | `rotonaz` | `password123` | `rotonaz.men413@gmail.com` | Shopping, Cart & Checkout |

*You can also register a brand new customer account directly from the **Register** page!*

---

## 📡 Key REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new customer account | Public |
| `POST` | `/api/auth/signin` | Sign in & receive authentication cookie | Public |
| `GET` | `/api/auth/user` | Get currently authenticated user details | Authenticated |
| `POST` | `/api/auth/signout` | Logout user & invalidate session | Authenticated |

### Products & Categories (`/api/public`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/public/products` | Paginated product list with search & sort | Public |
| `GET` | `/api/public/categories` | List all product categories | Public |
| `GET` | `/api/public/categories/{id}/products` | Filter products by category | Public |

### Cart & Checkout (`/api/carts`, `/api/addresses`, `/api/order`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/carts/users/cart` | Get customer cart (auto-created if new) | Customer |
| `POST` | `/api/cart/create` | Synchronize items into user cart | Customer |
| `GET` | `/api/addresses` | Fetch addresses for logged-in user | Customer |
| `POST` | `/api/addresses` | Add a new shipping address | Customer |
| `POST` | `/api/order/users/payments/{method}` | Place order with payment details | Customer |

### Admin & Seller (`/api/admin`, `/api/seller`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/categories` | Create new product category | Admin |
| `POST` | `/api/admin/categories/{id}/product` | Add product to category | Admin / Seller |
| `GET` | `/api/admin/orders` | View all platform orders | Admin |
| `PUT` | `/api/admin/orders/{id}/state/{status}` | Update order fulfillment status | Admin / Seller |

---

## 📂 Project Directory Structure

```
springboot-ecommerce/
├── sb-ecom/                             # Spring Boot Backend
│   ├── images/                          # Product photo assets served statically
│   ├── src/main/java/com/ecommerce/project/
│   │   ├── config/                      # App constants & Swagger configuration
│   │   ├── controller/                  # REST Controllers (Auth, Product, Cart, Order, Address)
│   │   ├── exceptions/                  # Global exception handling & API errors
│   │   ├── model/                       # JPA Entities (User, Role, Product, Category, Cart, Order, Payment)
│   │   ├── payload/                     # Request/Response DTOs
│   │   ├── repositories/                # Spring Data JPA Repositories
│   │   ├── security/                    # Spring Security 6, JWT Filter & AuthEntryPoint
│   │   ├── service/                     # Service layer interfaces & implementations
│   │   └── util/                        # Security & Auth context helpers
│   ├── src/main/resources/
│   │   └── application.properties       # Server port, database, and CORS configuration
│   └── pom.xml                          # Maven build dependencies
│
├── ecom-frontend/                       # React 18 + Vite Frontend
│   ├── src/
│   │   ├── api/                         # Axios client with credentials configuration
│   │   ├── components/
│   │   │   ├── admin/                   # Admin & Seller dashboard views & tables
│   │   │   ├── auth/                    # Login & Register forms with regex validation
│   │   │   ├── cart/                    # Shopping cart & empty state
│   │   │   ├── checkout/                # 4-Step Checkout (Address, Method, Summary, Payment, Confirmation)
│   │   │   ├── home/                    # Hero banner & featured sections
│   │   │   ├── products/                # Product grid, pagination & filter sidebars
│   │   │   └── shared/                  # Navbar, Footer, Product Cards, Modals, Spinners
│   │   ├── store/                       # Redux Toolkit store, actions & reducers
│   │   ├── utils/                       # INR currency formatter (formatPrice.js)
│   │   └── App.jsx                      # Route definitions with PrivateRoute protection
│   ├── package.json                     # Frontend dependencies & Vite scripts
│   └── vite.config.js                   # Vite configuration
│
└── README.md                            # Comprehensive project documentation
```

---

## 👨‍💻 Author & Contributions

- **Developer**: Shaik Nazeer
- **GitHub**: [@SHAIK7230](https://github.com/SHAIK7230)
- **Repository**: [https://github.com/SHAIK7230/springboot-ecommerce](https://github.com/SHAIK7230/springboot-ecommerce)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
