# E-Commerce Platform - Comprehensive Technical Documentation
### Home
<img src="/Frontend/img/Home.png">

### Shop
<img src="/Frontend/img/Shop.png">

### Cart
<img src="/Frontend/img/Cart.png">

### Login
<img src="/Frontend/img/Login.png">

### Register
<img src="/Frontend/img/Register.png">

---
## 1. Project Overview & Architectural Vision

This Documentation Provides An Exhaustive Technical Analysis Of A Modern, Enterprise-Grade Full-Stack E-Commerce Application. The Project Is Engineered To Demonstrate The Pinnacle Of Contemporary Software Development Practices, Seamlessly Integrating A High-Performance Backend With A Dynamic, Server-Side Rendered Frontend.

The Primary Objective Of This Platform Is To Deliver A Scalable, Maintainable & Secure Online Shopping Environment. It Goes Beyond Basic Crud Operations To Incorporate Advanced Features Such As Real-Time Customer Support Via WebSockets, A Hybrid API Architecture Supporting Both REST & GraphQL Paradigms & A Sophisticated Administration Dashboard Equipped With Data Visualization Tools.

From An Architectural Standpoint, The System Is Built Upon The Principles Of Modularity & Separation Of Concerns. The Backend Leverages The Robustness Of NestJS To Create A Structured, Dependency-Injected Environment, While The Frontend Utilizes The Next.js App Router To Optimize Rendering Performance & Search Engine Visibility. This Project Serves As A Definitive Reference Implementation For Developers Seeking To Master Full-Stack TypeScript Ecosystems.

---

## 2. Technology Stack & Infrastructure Decisions

### 2.1 Backend Infrastructure (Server-Side)

The Server-Side Architecture Is Constructed On A Foundation Of Node.js, Selected For Its Non-Blocking I/O Capabilities & Vast Ecosystem.

* **Framework**: **NestJS**
    * **Strategic Rationale**: NestJS Was Selected For Its Opinionated Structure Which Enforces Architectural Discipline. It Heavily Utilizes Decorators & Dependency Injection, Making The Codebase Highly Testable & Modular.
    * **Performance Optimization**: The Application Configures NestJS To Use The **Fastify** Adapter Instead Of The Default Express Adapter. Fastify Is Renowned For Its Low Overhead & High Throughput, Ensuring The API Can Handle A Significant Volume Of Concurrent Requests With Minimal Latency.
* **Programming Language**: **TypeScript**
    * **Implementation Details**: The Entire Backend Is Written In Strict TypeScript. This Enforces Static Typing, Which Drastically Reduces Runtime Errors & Enhances Developer Productivity Through Intelligent Code Completion & Refactoring Tools.
* **Database Management System**: **SQLite**
    * **Deployment Strategy**: A Serverless, Self-Contained SQL Database Engine Is Utilized. The Database Resides In A Single File (`./data/sqlite.db`), Which Simplifies Configuration & Deployment Processes While Offering Full ACID Compliance & Relational Data Integrity Capabilities.
* **Object-Relational Mapping (ORM)**: **TypeORM**
    * **Functionality**: TypeORM Serves As The Data Access Layer, Abstracting The Underlying SQL Queries. It Allows Database Schemas To Be Defined Using TypeScript Classes (Entities) & Decorators. It Manages Complex Entity Relationships Such As One-To-Many & Many-To-Many & Provides A Powerful Query Builder For Advanced Data Retrieval.
* **API Interface Paradigms**:
    * **RESTful API**: Standard HTTP Endpoints Are Implemented Using NestJS Controllers. These Endpoints Adhere To REST Principles, Utilizing Proper HTTP Methods (GET, POST, PUT, DELETE) & Status Codes To Manage Resources Like Users, Products & Orders Efficiently.
    * **GraphQL API**: A Flexible Data Query Language Is Integrated Via **Apollo Server**. The Implementation Follows A Code-First Approach, Where GraphQL Schemas Are Automatically Generated From TypeScript Classes/DTOs. This Allows Frontend Clients To Request Exact Data Structures, Preventing Over-Fetching & Under-Fetching.
* **Real-Time Communication Layer**: **Socket.io**
    * **Usage Scenario**: WebSocket Functionality Is Implemented To Power The Live Customer Support Chat. A Dedicated Gateway Handles Connection Events, Message Broadcasting & Event-Based Communication Between The Server & Connected Clients In Real-Time.
* **Security & Authentication**: **Passport-JWT** & **Bcrypt**
    * **Security Model**: Authentication Is Stateless, Relying On JSON Web Tokens (JWT). Passwords Are Never Stored In Plain Text; Instead, They Are Hashed Using The Bcrypt Algorithm With Salt Rounds To Ensure Maximum Security Against Rainbow Table Attacks.

### 2.2 Frontend Client (Client-Side)

The Frontend Is A Sophisticated Single-Page Application (SPA) That Leverages Server-Side Rendering (SSR) For Optimal Performance.

* **Core Framework**: **Next.js**
    * **Architectural Choice**: The Application Uses The Modern App Router Architecture. This Paradigm Supports React Server Components, Allowing Heavy Computation To Offload To The Server, Thereby Reducing The JavaScript Bundle Size Sent To The Client & Improving First Contentful Paint (FCP).
* **User Interface Library**: **Material-UI (MUI)**
    * **Component System**: A Comprehensive Suite Of Pre-Built, Accessible & Customizable React Components Is Utilized. MUI Provides The Foundational Building Blocks Such As Cards, Grids, Dialogs & Typography, Ensuring Consistent Design Patterns Across The Application.
* **Styling Framework**: **Tailwind CSS**
    * **Integration**: Tailwind Is Used In Conjunction With MUI To Provide Utility-First Styling. It Enables Rapid UI Prototyping & Fine-Grained Control Over Spacing, Colors & Responsive Breakpoints Directly Within The JSX Markup.
* **State Management Strategy**: **React Context API**
    * **Implementation**: Global Application State Is Managed Through Custom Context Providers.
        * `AuthContext`: Handles User Sessions, Login Status & Token Persistence.
        * `CartContext`: Manages Shopping Cart Operations (Add, Remove, Clear) & Persists Data To Local Storage.
        * `ThemeContext`: Controls The Application-Wide Theme (Light/Dark Mode) Toggling.
* **Data Fetching & Synchronization**:
    * **Apollo Client**: A Powerful GraphQL Client Used For Fetching, Caching & Modifying Application Data Via The GraphQL API. It Includes Integration For Server-Side Rendering Support.
    * **Axios**: A Robust HTTP Client Used For Interacting With The REST API Endpoints. It Is Configured With Interceptors To Automatically Attach Authorization Headers To Outgoing Requests.
* **Rich Text Editor**: **Tiptap**
    * **Feature**: A Headless Wrapper Around ProseMirror, Tiptap Is Integrated Into The Admin Dashboard To Provide A Rich Text Editing Experience For Product Descriptions, Allowing Admins To Format Content Easily.
* **Data Visualization**: **Chart.js**
    * **Analytics**: Integrated Via `react-chartjs-2`, This Library Powers The Admin Dashboard's Analytical Charts, Visualizing Key Metrics Such As Sales Revenue Trends & User Demographics.

---

## 3. Detailed System Architecture & Design Patterns

### 3.1 Backend Architecture Deep Dive

The Backend Adheres To A Strictly Layered Architecture, Promoting Separation Of Concerns & Maintainability.

* **Controller Layer**:
    * **Role**: Controllers Are The Entry Points For Incoming HTTP Requests. They Define Routes & HTTP Methods.
    * **Function**: Their Primary Responsibility Is To Handle Request Parsing, Validation Using DTOs (Data Transfer Objects) & Delegating Business Logic Execution To The Service Layer. They Do Not Contain Business Rules.
    * **Examples**: `ProductsController` Manages Product-Related Routes While `AuthController` Handles Login Requests.
* **Service Layer**:
    * **Role**: Services Encapsulate The Core Business Logic Of The Application.
    * **Function**: They Interact With The Database Via Repositories, Perform Computations, Transform Data & Execute Domain Rules. They Are Designed To Be Reusable & Injectable.
    * **Examples**: `UsersService` Contains Logic For Finding & Creating Users. `AuthService` Handles Password Verification & Token Generation.
* **Data Access Layer (Repositories)**:
    * **Role**: This Layer Is Responsible For Direct Interaction With The Database.
    * **Function**: Powered By TypeORM, Repositories Provide Methods To Find, Save, Update & Delete Entities. They Abstract The Complexity Of SQL Queries Away From The Service Layer.
* **Guard Layer (Security)**:
    * **Role**: Guards Determine Whether A Request Should Be Handled By The Route Handler Based On Permissions.
    * **Function**:
        * `JwtGuard`: Verifies The Presence & Validity Of The JWT Access Token In The Request Headers.
        * `AdminGuard`: Checks Within The Decoded User Payload If The User Possesses The 'Admin' Role, Restricting Access To Sensitive Administrative Endpoints.
* **Gateway Layer (WebSockets)**:
    * **Role**: Gateways Manage Real-Time Connections.
    * **Function**: `ChatGateway` Listens For WebSocket Connections & Messages. It Handles The Logic For The 'Echo' Bot & Can Be Expanded For Peer-To-Peer Support.

### 3.2 Frontend Architecture Deep Dive

The Frontend Architecture Is Built To Leverage The Latest React Features Within The Next.js Ecosystem.

* **App Router Strategy**:
    * **Structure**: The `app/` Directory Structure Directly Maps To URL Routes. Folders Like `shop/`, `cart/` & `auth/login` Automatically Become Accessible Routes.
    * **Layouts**: The Root `layout.tsx` Wraps The Entire Application, Providing Global Context Providers & Persistent UI Elements Like The `Navbar`. Specific Sub-Routes Like `admin/` Have Their Own Layouts To Render Sidebars Specific To That Section.
* **Component Composition**:
    * **Server Components**: By Default, Components Are Rendered On The Server. This Is Used For Static Content & Initial Data Fetching, Improving Performance.
    * **Client Components**: Components Requiring Browser APIs, Event Listeners, Or State Hooks Are Marked With `'use client'`. Examples Include The Interactive `ProductCard`, The `ChatWidget` & Forms.
* **Custom Hooks Pattern**:
    * **Usage**: Logic Is Encapsulated Into Reusable Hooks. `useAuth` Simplifies Accessing User Data, While `useCart` Provides An Interface For Cart Operations. `useDebounce` Is Used In Search Components To Limit API Calls.

---

## 4. Comprehensive Database Schema Definition

The Data Model Is Defined Using TypeORM Entities, Creating A Robust Relational Schema Within The SQLite Database.

### 4.1 User Entity (`users`)
The Central Entity For Identity Management.
* **id**: `Integer` (Primary Key, Auto-Incremented) - Unique Identifier.
* **email**: `String` (Unique) - The User's Email Address Used For Login.
* **name**: `String` - The User's Full Display Name.
* **password**: `String` - The Bcrypt Hashed Password String.
* **role**: `String` (Default: 'customer') - Determines Access Level ('admin' Or 'customer').

### 4.2 Product Entity (`products`)
Represents The Items Available For Sale.
* **id**: `Integer` (Primary Key).
* **title**: `String` - The Name Of The Product.
* **price**: `Float` - The Cost Of The Item.
* **stock**: `Integer` - Current Inventory Count.
* **category**: `String` - Categorization Tag (e.g., 'Electronics').
* **rating**: `Float` - Average Customer Rating (0-5).
* **description**: `Text` (Nullable) - Detailed HTML Or Plain Text Description.
* **sku**: `String` (Nullable) - Stock Keeping Unit Code.
* **imageUrl**: `String` (Nullable) - URL To The Product Image.
* **createdAt**: `Datetime` - Timestamp Of Creation.
* **updatedAt**: `Datetime` - Timestamp Of Last Modification.

### 4.3 Order Entity (`orders`)
Records Transactional Data.
* **id**: `Integer` (Primary Key).
* **userId**: `Integer` - Foreign Key Linking To The User Who Placed The Order.
* **items**: `Simple-JSON` - Stores A Snapshot Of Purchased Items Including IDs & Quantities.
* **total**: `Float` - The Final Transaction Amount.
* **status**: `String` (Default: 'pending') - Current State (e.g., 'pending', 'shipped').
* **createdAt**: `Datetime` - Date Of Purchase.

### 4.4 Review Entity (`reviews`)
Stores Customer Feedback.
* **id**: `Integer` (Primary Key).
* **productId**: `Integer` - Links To The Product Being Reviewed.
* **userId**: `Integer` - Links To The User Who Wrote The Review.
* **rating**: `Integer` - Numeric Score (1-5).
* **comment**: `Text` - The Written Feedback Content.
* **createdAt**: `Datetime`.

### 4.5 Coupon Entity (`coupons`)
Manages Promotional Discounts.
* **id**: `Integer` (Primary Key).
* **code**: `String` (Unique) - The Code Users Enter (e.g., 'SAVE10').
* **discount**: `Float` - The Percentage To Deduct.
* **active**: `Boolean` (Default: true) - Determines If The Coupon Is Usable.

### 4.6 Additional Entities
* **Payment Entity**: Tracks Transaction Status, Provider IDs & Amounts.
* **Shipping Entity**: Stores Logistics Data Including Service Type, Cost & Estimated Days.
* **Notification Entity**: Stores User Alerts & Read Statuses.

---

## 5. Extensive API Documentation

### 5.1 REST API Endpoints

#### Authentication & Users
* **POST** `/auth/login`: Accepts Email & Password. Returns A JSON Object Containing The JWT Access Token Upon Success.
* **POST** `/users/register`: Accepts Name, Email & Password. Hashes The Password & Creates A New User Record. Returns The User Object.
* **GET** `/users/me`: **Protected**. Decodes The JWT From The Header & Returns The Profile Of The Logged-In User.

#### Products Management
* **GET** `/products`: Retrieves A List Of Products. Supports Query Parameters:
    * `limit`: Number Of Items To Return.
    * `offset`: Number Of Items To Skip (For Pagination).
    * `q`: Search String To Filter Products By Title.
* **GET** `/products/featured`: Returns A Fixed List Of 6 Products Marked As Featured.
* **GET** `/products/top`: Returns The Top 10 Products Sorted By Rating In Descending Order.
* **GET** `/products/:id`: Fetches Detailed Information For A Single Product By ID.
* **POST** `/products`: **Admin Only**. Creates A New Product Entry. Accepts A DTO With Title, Price, Stock, Etc.
* **PUT** `/products/:id`: **Admin Only**. Updates Details Of An Existing Product.
* **DELETE** `/products/:id`: **Admin Only**. Removes A Product From The Database.

#### Order Processing & Cart
* **GET** `/orders`: Retrieves A List Of Orders. Can Be Filtered By `userId` To See A Specific User's History.
* **GET** `/cart/:userId`: (Stub) Intended To Fetch Server-Stored Cart State.
* **POST** `/cart/:userId/checkout`: **Protected**. Converts The Client-Side Cart Payload Into A 'Pending' Order Record In The Database. Triggers Stock Deductions.

#### Administration & Analytics
* **GET** `/admin/reports/sales`: **Admin Only**. Aggregates Data To Return Total Revenue & Total Order Count.
* **GET** `/analytics/users`: Returns Statistics On User Registration Counts & The Ratio Of Admins To Customers.
* **POST** `/admin/product/:id/stock`: **Admin Only**. Specific Endpoint To Quickly Adjust Inventory Levels For A Product.

#### Auxiliary Services
* **GET** `/search/suggest`: Returns A List Of Product Titles Matching The Query `q` For Autocomplete Functionality.
* **GET** `/coupons`: Retrieves All Available Coupons.
* **GET** `/shipping/rates`: Returns Available Shipping Service Tiers.
* **GET** `/notifications`: Retrieves Unread Notifications For The Current User.

### 5.2 GraphQL API

The GraphQL Endpoint Provides A Flexible Alternative For Data Fetching.

* **Queries**:
    * `products(limit: Float)`: Fetches An Array Of Products With Customizable Limit.
    * `product(id: Float)`: Fetches A Single Product.
    * `users`: Fetches All Users.
    * `orders`: Fetches All Orders.
* **Mutations**:
    * `createProduct(input: CreateProductInput)`: **Admin**. Adds A Product.
    * `updateProduct(input: UpdateProductInput)`: **Admin**. Modifies A Product.
    * `removeProduct(id: Float)`: **Admin**. Deletes A Product.
    * `createOrder(input: CreateOrderInput)`: Creates An Order.
    * `register(input: RegisterInput)`: Registers A New User.

---

## 6. Detailed Installation & Setup Guide

Follow These Steps To Configure The Development Environment.

### 6.1 Prerequisites
* **Node.js**: Ensure A Current LTS Version Is Installed.
* **Package Manager**: NPM Or Yarn Is Required.

### 6.2 Backend Setup Procedure
1.  **Navigate To Directory**:
    Open Your Terminal & Move Into The Backend Folder.
    ```bash
    cd Backend
    ```
2.  **Install Dependencies**:
    Install All Server-Side Packages Defined In `package.json`.
    ```bash
    npm install
    ```
3.  **Database Seeding**:
    Initialize The SQLite Database With Default Users (Admin/Customer) & A Batch Of Mock Products For Testing Purposes.
    ```bash
    npx ts-node src/seed.ts
    ```
4.  **Launch Server**:
    Start The NestJS Application In Development Mode With Hot-Reloading.
    ```bash
    npm run start:dev
    ```
    *The Backend Will Be Active At `http://localhost:3000`.*

### 6.3 Frontend Setup Procedure
1.  **Navigate To Directory**:
    Open A New Terminal Window & Move Into The Frontend Folder.
    ```bash
    cd Frontend
    ```
2.  **Install Dependencies**:
    **Critical Step**: Use The `--legacy-peer-deps` Flag To Resolve Potential Version Conflicts Common In Complex React Ecosystems.
    ```bash
    npm install --legacy-peer-deps
    ```
3.  **Launch Client**:
    Start The Next.js Development Server.
    ```bash
    npm run dev
    ```
    *The Application Will Be Accessible In Your Browser At `http://localhost:3001`.*

---

## 7. Project Directory Structure Deep Dive

### Backend Structure (`Backend/src`)
* **`main.ts`**: The Application Entry Point. Bootstraps The NestJS App With The Fastify Adapter.
* **`app.module.ts`**: The Root Module That Imports All Other Modules & Configures The Database Connection.
* **`controllers/`**: Contains All REST Route Handlers (e.g., `productsController.ts`, `authController.ts`).
* **`services/`**: Contains Business Logic Classes (e.g., `usersService.ts`, `authService.ts`).
* **`entities/`**: Contains TypeORM Database Models (e.g., `product.entity.ts`, `user.entity.ts`).
* **`guards/`**: Contains Security Middleware Like `jwt.guard.ts` & `admin.guard.ts`.
* **`gateways/`**: Contains WebSocket Logic In `chatGateway.ts`.
* **`graphql/`**: Contains GraphQL Resolvers & DTOs.
    * **`resolvers/`**: Logic To Handle GraphQL Queries.
    * **`dto/`**: Input Types For Mutations.

### Frontend Structure (`Frontend/app`)
* **`(auth)/`**: A Route Group Folder Containing Authentication Pages.
    * **`login/page.tsx`**: The User Login Interface.
    * **`register/page.tsx`**: The User Registration Interface.
* **`(admin)/`**: A Route Group For Administrative Pages.
    * **`dashboard/page.tsx`**: The Main Analytics Dashboard.
    * **`products/page.tsx`**: The CRUD Interface For Products.
* **`(shop)/`**: Routes For The Main Shopping Experience.
    * **`shop/page.tsx`**: The Main Product Catalog With Filters.
    * **`cart/page.tsx`**: The Shopping Cart & Checkout Initiation View.
    * **`product/[id]/page.tsx`**: The Dynamic Route For Individual Product Details.
* **`components/`**: Reusable UI Components.
    * **`Navbar.tsx`**: The Top Navigation Bar.
    * **`ProductCard.tsx`**: Component To Display Product Summaries.
    * **`ChatWidget.tsx`**: The Real-Time Chat Interface Component.
* **`context/`**: Global State Providers.
    * **`AuthContext.tsx`**: Authentication State Logic.
    * **`CartContext.tsx`**: Cart Logic & Storage Persistence.
* **`lib/`**: Utility Functions & Configurations.
    * **`api.ts`**: Axios Instance Configuration.
    * **`apolloWrapper.tsx`**: Apollo Client Provider Configuration.

---

## 8. Future Roadmap & Enhancements

To Evolve This Project Into A Production-Ready Solution, The Following Enhancements Are Planned:
* **Payment Gateway Integration**: Replace The Mock Controller With Stripe Or PayPal APIs To Process Real Transactions.
* **Advanced Search**: Implement Elasticsearch Or Typesense For Fuzzy Search & Relevance Ranking.
* **Email Service**: Integrate SendGrid Or Nodemailer For Transactional Emails (Order Confirmations, Password Resets).
* **Containerization**: Create Dockerfiles & A Docker Compose Configuration To Orchestrate The Backend, Frontend & Database Services For Easy Deployment.
* **Testing Suite**: Expand Test Coverage Using Jest For Unit/Integration Tests & Cypress For End-To-End Interface Testing.

---

## 9. License

This Project Is Open-Source & Available Under The **MIT License**. You Are Encouraged To Explore, Modify & Distribute This Software In Accordance With The License Terms.
