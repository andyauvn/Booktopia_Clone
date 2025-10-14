# 📚 Booktopia: E-commerce Bookstore Clone

Booktopia is a full-featured e-commerce platform that replicates the core functionality of a modern online bookstore, allowing users to purchase books, manage their orders, and providing robust administrative tools for inventory and sales management.

---

## ✨ Key Features

### User Features
1.  **Book Browsing & Search:** View a catalog of books, filter by category/author, and search for specific titles.
2.  **Shopping Cart & Checkout:** Add/remove items from the cart and complete secure purchases using simulated or integrated online payment.
3.  **Order Tracking:** Users can view the real-time status and delivery progress of their orders.
4.  **Wishlist Management:** Users can save books for later purchase in their personal wishlist.

### Admin Features
1.  **Inventory Management:** Admins can add new books, update stock levels, and modify book details (title, price, description).
2.  **Sales & Analytics:** Track total sales, view order history, and monitor sales trends.
3.  **User Management:** Ability to view, edit, or deactivate user accounts.

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

| Model | Purpose | Key Fields (Simplified) | Relationships |
| :--- | :--- | :--- | :--- |
| **User** | Stores user authentication and profile data. | `name`, `email`, `password`, `role` (`user` or `admin`), `wishlist` | Has many **Orders** |
| **Book** | Core product catalog data. | `title`, `author`, `ISBN`, `price`, ``stockQuantity``, `category`, `description` | Has many **OrderItems** |
| **Order** | Tracks customer purchases. | `user` (ref **User**), `orderItems` (ref **OrderItem**), `totalPrice`, `status` (`pending`, `shipped`, `delivered`), `shippingAddress` | Belongs to **User** |
| **OrderItem** | Details of books within a specific order. | `book` (ref **Book**), `quantity`, `priceAtPurchase` | Belongs to **Order** |



---

## 🗺️ Project Management & Development Process

This project was managed using an **Agile-like workflow** and visualized using **GitHub Projects** to maintain focus and prioritize feature development.

### **Development Workflow Highlights:**

* **Task Management:** A **GitHub Project board** (Kanban style) was used to track features, bugs, and tasks, moving them through `To Do`, `In Progress`, and `Done` columns.
* **Version Control:** **Git** and **GitHub** were used for source control, following a feature-branch workflow.


---

## 🧪 Testing Strategy

Since this project has critical user and financial data, a comprehensive testing approach is recommended, covering the following areas:

### 1. Unit Testing (Focus: Business Logic)

* **Tools:** **Jest** (for Node.js/Express and React)
* **What to Test:**
    * **Backend:** Validation logic (e.g., ensuring book prices are positive), stock decrement/increment logic, user authentication middleware.
    * **Frontend:** Simple utility functions, custom React hooks, and component props rendering correctness.

### 2. Integration Testing (Focus: API Endpoints)

* **Tools:** **Supertest** (for Express/Node.js)
* **What to Test:**
    * **Order Flow:** Test the complete sequence: user adds book $\rightarrow$ stock decreases $\rightarrow$ order is created $\rightarrow$ payment is processed (simulated).
    * **Admin Permissions:** Ensure non-admin users cannot access routes like `/api/admin/add-stock`.

### 3. End-to-End (E2E) Testing (Focus: User Workflow)

* **Tools:** **Cypress** or **Playwright**
* **What to Test:**
    * **The "Happy Path":** Full user journey from landing page $\rightarrow$ searching for a book $\rightarrow$ adding to cart $\rightarrow$ logging in $\rightarrow$ checkout $\rightarrow$ viewing the successful order status.
    * **Failure States:** Test login with bad credentials, attempting to add an out-of-stock book, and cart manipulation.

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
    npm start
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```

4.  **Access the App:**
    The application should now be running on `http://localhost:3000`.

---

## 🤝 Contribution

This is a personal project, but suggestions for new features, bug fixes, or performance improvements are always welcome! Feel free to open an issue or submit a pull request.
