# 📚 Booktopia: E-commerce Bookstore Clone

Booktopia is a full-featured e-commerce platform that replicates the core functionality of a modern online bookstore, allowing users to purchase books, manage their orders, and providing robust administrative tools for inventory and sales management.

---

## ✨ Key Features

### User Features
1.  **Book Browsing & Search:** View a catalog of books, filter by category/author, and search for specific titles.
2.  **Shopping Cart & Checkout:** Add/remove items from the cart and complete secure purchases using simulated or integrated online payment.
3.  **Order Tracking:** Users can view the real-time status and delivery progress of their orders.
4.  **Wishlist Management:** Users can save books for later purchase in their personal wishlist.
5.  **Product Reviews:** Submit ratings and comments on purchased books.

### Admin Features
1.  **Inventory Management:** Admins can add new books, update stock levels, and modify book details (including special pricing and internal costs).
2.  **Sales & Analytics:** Track total sales, view order history, and monitor sales trends.
3.  **User Management & Moderation:** Ability to view, edit, or deactivate user accounts and approve submitted product reviews.

---

## 💻 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Front-end** | **React** | For building a fast, component-based, and dynamic user interface. 
| **Build Tool** | **Vite** | Used for blazing-fast development server and optimized production bundling.
| **Styling** | **Tailwind CSS** | A utility-first CSS framework for rapid and responsive design implementation. |
| **Back-end** | **Node.js** with **Express** | A lightweight and scalable environment for building the RESTful API and handling server logic. |
| **Database** | **MongoDB (via Mongoose)** | A flexible NoSQL database to efficiently manage the book catalog, user data, and orders. |

---

## 💾 Database Schema (MongoDB Models)

This section details the primary data models used in the application. We utilize a **NoSQL** structure optimized for speed and flexibility, managed through Mongoose schemas on the server.

| Model | Purpose | Key Fields (Enhanced) | Relationships |
| :--- | :--- | :--- | :--- |
| **User** | Stores auth, profile, and security tokens. | `name`, `email`, **`password` (hashed)**, **`permissions`** (array), **`wishlist`** (ref Book), `resetPasswordToken` | Has many **Orders** |
| **Book** | Core product catalog, pricing, and specs. | `title`, `author`, `slug`, **`fullPrice`**, **`discountPrice`**, **`costPrice`**, `stockCount`, `categories` (array), **`format`**, **`eBookFileUrl`** | Has many **OrderItems** and **Reviews** |
| **Review** | User-submitted ratings and comments. | `user` (ref User), `book` (ref Book), `rating` (1-5), `comment`, **`isApproved`** (for moderation) | Belongs to **User** and **Book** |
| **Order** | Tracks customer purchases. | `user` (ref User), `orderItems` (embedded), `totalPrice`, **`paymentResult`**, **`trackingNumber`**, `status` | Belongs to **User** |
| **OrderItem** | Details of books within a specific order. | `book` (ref Book), `quantity`, `priceAtPurchase` | Belongs to **Order** |
*\[Image Placeholder]*


---

## 🗺️ Project Management & Development Process

This project was managed using an **Agile-like workflow** and visualized using **GitHub Projects** to maintain focus and prioritize feature development. Development strictly followed a **Test-Driven Development (TDD)** methodology.

### **Development Workflow Highlights:**

* **TDD Cycle:** **Red-Green-Refactor** was used to ensure all business logic (validation, pricing, stock) and API endpoints are fully tested before deployment.
* **Task Management:** A **GitHub Project board** (Kanban style) was used to track features, bugs, and tasks, moving them through `To Do`, `In Progress`, and `Done` columns.
* **Version Control:** **Git** and **GitHub** were used for source control, following a feature-branch workflow.

*\[Image Placeholder]*

---

## 🧪 Testing Strategy

Since this project has critical user and financial data, a comprehensive testing approach is implemented.

### 1. Unit Testing (Focus: Business Logic & Security)
* **Tools:** **Jest**
* **Key Tests:** Mongoose Schema validation (e.g., non-negative prices, required fields), **Password hashing logic**, User authorization methods, utility functions.

### 2. Integration Testing (Focus: API Endpoints & Data Flow)
* **Tools:** **Jest** and **Supertest**
* **Key Tests:**
    * **Order Flow:** User purchase sequence (→ stock decrement → order creation → price calculation).
    * **Permission Checks:** Access control for Admin-only routes (e.g., `/api/admin/books`).
    * **Review Integration:** Verifying new reviews correctly update the book's cached `rating` and `numReviews`.

### 3. End-to-End (E2E) Testing (Focus: User Workflow)
* **Tools:** **Cypress** or **Playwright**
* **Key Tests:** Full user journey ("Happy Path"), user authentication/logout, cart persistence, and handling of failure states (e.g., out-of-stock items, bad login).

---

## ⚙️ Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd booktopia
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Set up environment variables (DB_URI, JWT_SECRET, etc.) in a .env file
    npm run dev # Use 'dev' for local development with Nodemon
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    npm run dev # Use 'dev' for fast Vite development server
    ```

4.  **Access the App:**
    The application should now be running on `http://localhost:5173` (Vite's default).

---

## 🤝 Contribution

This is a personal project, but suggestions for new features, bug fixes, or performance improvements are always welcome! Feel free to open an issue or submit a pull request.