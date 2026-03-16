# 🍃 Food Waste Management System
# Foodbridge

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" />
</p>

> A smart, sustainable solution to track, reduce, and manage food waste — from households to large-scale food service operations.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🌍 About the Project

Food waste is one of the world's most pressing environmental and economic challenges. The **Food Waste Management System** is a full-stack application designed to:

- **Track** food inventory and expiry dates in real time
- **Alert** users before food items expire
- **Donate** surplus food by connecting with NGOs and food banks
- **Analyze** waste patterns with insightful reports and dashboards
- **Reduce** carbon footprint through smarter food management

Whether you're a restaurant owner, a grocery store manager, or a household user — this system helps you make data-driven decisions to cut waste and save money.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🏠 **Inventory Management** | Add, update, and track food items with quantities and expiry dates |
| 🔔 **Expiry Alerts** | Get automated notifications before items expire |
| 📊 **Waste Analytics Dashboard** | Visual charts showing waste trends over time |
| 🤝 **Food Donation Module** | List surplus food for donation to registered NGOs |
| 👥 **Role-Based Access** | Admin, Staff, and Viewer roles with different permissions |
| 📦 **Category Management** | Organize food by categories (dairy, vegetables, grains, etc.) |
| 📱 **Responsive UI** | Works seamlessly on mobile, tablet, and desktop |
| 🗓️ **Waste Logs** | Maintain detailed logs of disposed/donated items |
| 📤 **Export Reports** | Download reports as PDF or CSV |
| 🔐 **Secure Auth** | JWT-based authentication and authorization |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — Component-based UI
- **Tailwind CSS** — Utility-first styling
- **Chart.js / Recharts** — Data visualization
- **Axios** — API communication

### Backend
- **Node.js + Express.js** — RESTful API server
- **JWT** — Authentication
- **Nodemailer** — Email notifications

### Database
- **MongoDB** — NoSQL database for flexible food data
- **Mongoose** — ODM for MongoDB

### DevOps & Tools
- **Docker** — Containerization
- **GitHub Actions** — CI/CD pipeline
- **Postman** — API testing

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│              React.js + Tailwind CSS                    │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP / REST API
┌───────────────────────▼─────────────────────────────────┐
│                    API SERVER                           │
│             Node.js + Express.js                        │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │   Auth   │  │ Inventory  │  │  Donation / Alerts  │  │
│  │ Module   │  │  Module    │  │      Module         │  │
│  └──────────┘  └────────────┘  └─────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                    DATABASE                             │
│                   MongoDB Atlas                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/food-waste-management.git
cd food-waste-management
```

2. **Install server dependencies**

```bash
cd server
npm install
```

3. **Install client dependencies**

```bash
cd ../client
npm install
```

4. **Set up environment variables**

Create a `.env` file in the `/server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

5. **Run the application**

```bash
# In the server directory
npm run dev

# In the client directory (new terminal)
npm start
```

6. **Open in browser**

```
http://localhost:3000
```

---

## 💻 Usage

### Admin Panel
1. Login with admin credentials
2. Add food categories and inventory items
3. Set expiry thresholds for alerts
4. Manage registered NGOs for donations
5. View analytics dashboard and download reports

### Staff User
1. Update inventory quantities daily
2. Mark items as disposed or donated
3. View upcoming expiry alerts

### NGO / Donor
1. Register as a donation partner
2. Browse available surplus food listings
3. Confirm collection/delivery of donated food

---

## 📸 Screenshots



>

| Dashboard | Inventory | Analytics |
|-----------|-----------|-----------|
| ![dashboard](screenshots/dashboard.png) | ![inventory](screenshots/inventory.png) | ![analytics](screenshots/analytics.png) |

---

## 🗄️ Database Schema

### Food Item
```json
{
  "_id": "ObjectId",
  "name": "String",
  "category": "String",
  "quantity": "Number",
  "unit": "String",
  "expiryDate": "Date",
  "addedBy": "ObjectId (ref: User)",
  "status": "active | expired | donated | disposed",
  "createdAt": "Date"
}
```

### User
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password": "String (hashed)",
  "role": "admin | staff | viewer",
  "createdAt": "Date"
}
```

### Waste Log
```json
{
  "_id": "ObjectId",
  "foodItem": "ObjectId (ref: FoodItem)",
  "action": "disposed | donated",
  "quantity": "Number",
  "date": "Date",
  "notes": "String",
  "handledBy": "ObjectId (ref: User)"
}
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user profile |

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/inventory` | Get all food items |
| POST | `/api/inventory` | Add a new food item |
| PUT | `/api/inventory/:id` | Update a food item |
| DELETE | `/api/inventory/:id` | Delete a food item |
| GET | `/api/inventory/expiring` | Get items expiring soon |

### Waste Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | Get all waste logs |
| POST | `/api/logs` | Create a new waste log entry |
| GET | `/api/logs/report` | Get analytics report data |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donations` | List all donation entries |
| POST | `/api/donations` | Create a donation listing |
| PUT | `/api/donations/:id/confirm` | Confirm a donation |

---

## 🤝 Contributing

Contributions are what make the open source community amazing! Here's how you can help:

1. **Fork** the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 📬 Contact
  Amal Vishnu.G
  amalvishnu21702@gmail.com
  


**Project Link:** https://github.com/Amal-vishnu04/Foodbridge.git

---

<p align="center">
  Made with 💚 to fight food waste — one meal at a time.
</p>
