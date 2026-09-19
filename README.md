# GourmetQR

A clean, full-stack QR-based ordering system designed for restaurants. Customers scan a table QR code to view the menu and order without downloading any app, while tickets and billing sync instantly to the reception desks.

---

## 📸 App Preview

| Customer Menu | Kitchen Display (KDS) | Cashier Dashboard |
| :---: | :---: | :---: |
| <img src="./images/customer.png" width="260" alt="Customer Menu" /> | <img src="./images/kitchen.png" width="260" alt="Kitchen View" /> | <img src="./images/reception.png" width="260" alt="Reception View" /> |

*(Make sure your screenshots are placed inside the `images/` folder as `customer.png`, `kitchen.png`, and `reception.png`)*

---

##  Core Features

- **📱 Customer Web App (`/menu?table=N`):**
  - QR-based table detection via URL parameter.
  - Interactive menu with item filters and customization notes (e.g., *"less spicy"*).
  - Live order tracking badge on placement.

- **💳 Receptionist Dashboard (`/reception`):**
  - Live table occupancy floor plan (Vacant, Active, Bill Requested).
  - Itemized active order list with real-time subtotal calculations.
  - One-click table clearance and bill settlement.

- **🖨️ QR Table Generator (`/admin/qr`):**
  - Instant print-ready QR codes for Tables 1 through 20.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** PostgreSQL (Prisma ORM)
- **Deployment:** Vercel (Frontend) + Render / Supabase (Backend & DB)

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the Repository
```bash
git clone [https://github.com/munnasamarjeet337-hash/qr-restaurant-system.git](https://github.com/munnasamarjeet337-hash/qr-restaurant-system.git)
cd qr-restaurant-system
