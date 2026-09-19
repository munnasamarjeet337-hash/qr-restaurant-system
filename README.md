# 🍽️ GourmetQR: Full-Stack QR Restaurant Ordering & Realtime Kitchen Management System

An end-to-end, production-ready Full-Stack QR Restaurant Ordering and Realtime Kitchen Management System with four interconnected interfaces:
1. **Customer Mobile Web App** (`/menu?table=:tableNumber`)
2. **Kitchen Display System (KDS)** (`/kitchen`)
3. **Receptionist / Cashier Billing Dashboard** (`/reception`)
4. **QR Code Table Card Generator** (`/admin/qr`)

---

## 🌟 Key Features

- 📱 **Customer Mobile Ordering:** Mobile-first moody food hero header fading into slate surface, table name onboarding modal, sticky horizontal category chips, 2-column food grid, item customization notes ("Less spicy, extra cheese"), slide-up cart review, celebratory `canvas-confetti` burst, and a live 4-stage order status tracking badge.
- 👨‍🍳 **Kitchen Display System (KDS):** High-contrast dark theme (`#111827`) optimized for kitchen tablets and wall TVs. 3-column Kanban board (`New Orders`, `Preparing`, `Ready to Serve`), real-time elapsed timers (warning highlight at >15 mins), **prominent high-contrast amber callouts for item notes**, and Web Audio API synthesizer bell chimes on incoming orders.
- 💳 **Receptionist & Cashier Dashboard:** Live 20-table floor plan occupancy grid (🟢 Vacant, 🔵 Active Order, 🟠 Bill Requested), active orders table, printable receipt modal with tax & service charge calculations, and a physical POS punch assistant with instant **Settle & Clear Table** action.
- 🖨️ **Dynamic QR Code Generator:** Configure custom domains (e.g. Vercel URL), choose table range (1 to 20), and render print-ready branded table stand cards with scan-to-order QR codes.
- ⚡ **Bidirectional Realtime Synchronization:** Powered by Socket.io rooms (`kitchen`, `reception`, `table_N`) with instant state propagation across devices without manual browser refresh.

---

## 📐 Architecture & Realtime Event Flow

```
   ┌────────────────────────────────────────────────────────┐
   │                  Node.js + Socket.io                   │
   │               Express Backend (Port 5000)              │
   └──────────▲──────────────────▲──────────────────▲───────┘
              │                  │                  │
    order:placed                 │                  │
    table:request_bill     kitchen:new_order   reception:new_order
              │            order:status_update table:status_update
              │                  │             table:bill_settled
              ▼                  ▼                  ▼
      ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
      │   Customer   │   │  Kitchen KDS │   │ Receptionist │
      │  Mobile App  │   │  Tablet / TV │   │ POS Terminal │
      │ (/menu?tab=3)│   │  (/kitchen)  │   │ (/reception) │
      └──────────────┘   └──────────────┘   └──────────────┘
```

### Socket.io Events Reference Table

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_room` | Client ➔ Server | `{ room: 'kitchen' \| 'reception' \| 'table_N' }` | Subscribes socket to targeted broadcasts |
| `order:placed` | Customer ➔ Server | `{ table_number, customer_name, items }` | Saves order in DB and triggers kitchen & reception alerts |
| `kitchen:new_order` | Server ➔ Kitchen | `{ order, timestamp }` | Kitchen receives new order, plays chime, pulses card |
| `reception:new_order` | Server ➔ Reception | `{ order, table, timestamp }` | Updates active register and turns table blue |
| `order:status_update` | Kitchen ➔ Server ➔ All | `{ orderId, status }` | Transitions status (`placed` ➔ `preparing` ➔ `ready` ➔ `completed`) |
| `table:request_bill` | Customer ➔ Server | `{ tableNumber }` | Sets table status to `billing_pending` (turns table orange) |
| `reception:bill_requested` | Server ➔ Reception | `{ table_number, table }` | Plays cashier alert chime and flags table on grid |
| `table:bill_settled` | Reception ➔ Server ➔ All | `{ table_number, settled_at }` | Marks order `paid`, frees table to `vacant`, clears cart |

---

## 📂 Project Structure

```
qr-restaurant-system/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Relational schema (Category, MenuItem, Table, Order, OrderItem)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── menuController.js
│   │   │   ├── tableController.js
│   │   │   └── orderController.js
│   │   ├── models/
│   │   │   ├── db.js             # DB abstraction (Prisma & auto-initialized local store)
│   │   │   └── seedData.js       # 4 Categories, 16 realistic items, 20 tables
│   │   ├── routes/
│   │   │   ├── menuRoutes.js
│   │   │   ├── tableRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── sockets/
│   │   │   └── socketHandlers.js # Socket.io rooms & event emitters
│   │   └── server.js             # Express & Socket.io server entry
│   ├── .env.example
│   ├── Procfile
│   ├── render.yaml
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── apiClient.js      # Axios client for REST endpoints
│   │   ├── components/
│   │   │   ├── common/Navbar.jsx
│   │   │   ├── customer/         # Hero, CategoryChips, FoodCard, CustomizationModal, CartDrawer, Tracker
│   │   │   ├── kitchen/          # KanbanColumn, OrderCard (with timers & notes callouts)
│   │   │   └── receptionist/     # TableOccupancyGrid, ActiveOrdersTable, BillingModal
│   │   ├── context/
│   │   │   ├── CartContext.jsx   # Cart items, custom instructions, and tax calculations
│   │   │   └── SocketContext.jsx # Global WebSocket provider & room manager
│   │   ├── pages/
│   │   │   ├── HomeHub.jsx
│   │   │   ├── CustomerMenu.jsx
│   │   │   ├── KitchenKDS.jsx
│   │   │   ├── ReceptionistDashboard.jsx
│   │   │   └── QrGenerator.jsx
│   │   ├── utils/
│   │   │   └── soundEffects.js   # Web Audio API synthesizer for kitchen bells & success sounds
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
├── README.md
└── package.json
```

---

## 🚀 Quick Start / Local Development

### 1. Prerequisites
- **Node.js**: v18+ (Recommended: Node 20 or 24)
- **npm**: v9+

### 2. Install Dependencies

In the **Backend**:
```bash
cd backend
npm install
```

In the **Frontend**:
```bash
cd frontend
npm install
```

### 3. Run the System

**Terminal 1 (Backend Server on `http://localhost:5000`):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend Client on `http://localhost:5173`):**
```bash
cd frontend
npm run dev
```

---

## 🌐 Routes & Live Testing Guide

| Interface | URL | Description |
| :--- | :--- | :--- |
| **System Overview Hub** | `http://localhost:5173/` | Landing page with quick links and backend health status |
| **Customer Menu (Table 3)** | `http://localhost:5173/menu?table=3` | Mobile-first scan-to-order page |
| **Kitchen KDS** | `http://localhost:5173/kitchen` | Kitchen Kanban board with audio chime |
| **Receptionist / Billing** | `http://localhost:5173/reception` | 20-Table live occupancy grid and billing POS |
| **QR Code Generator** | `http://localhost:5173/admin/qr` | Print table stand cards for Tables 1 to 20 |

---

## 🚢 Production Deployment

### Frontend (Vercel)
1. Push repository to GitHub.
2. Import `frontend` directory in Vercel.
3. Add Environment Variables:
   - `VITE_API_URL`: `https://your-backend.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://your-backend.onrender.com`

### Backend (Render / Railway)
1. Import `backend` directory in Render as a Web Service.
2. Environment: `Node`. Build Command: `npm install`. Start Command: `node src/server.js`.
3. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `DATABASE_URL`: Your PostgreSQL / Supabase connection string.
