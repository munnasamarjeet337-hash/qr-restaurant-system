GourmetQRA full-stack QR restaurant ordering system with real-time updates across the customer menu, kitchen display, and cashier dashboard.What It DoesCustomer View (/menu?table=3): Scanned via table QR code. Lets customers browse the menu, add item notes (like "less spicy"), and place orders directly from their phones.Kitchen KDS (/kitchen): Kanban board showing incoming orders, elapsed timers, highlighted food notes, and sound alerts for chefs.Reception / Billing (/reception): Shows live table status (Vacant, Active, Bill Requested), itemized order lists, and bill totals for the cashier.QR Generator (/admin/qr): Generates printable table stand QR codes for Tables 1 to 20.ScreenshotsCustomer MenuKitchen DisplayCashier DashboardTech StackFrontend: React, Tailwind CSS, ViteBackend: Node.js, Express, Socket.ioDatabase: PostgreSQL (Prisma ORM)How It Works (Real-time Flow)[Customer Orders] ──► (Socket.io) ──┬──► Kitchen Screen (Alert + Cooking Items)
                                    └──► Reception Screen (Bill Total Updates)
Run Locally1. BackendBashcd backend
npm install
npm run dev
Runs at http://localhost:5000.2. FrontendOpen a new terminal:Bashcd frontend
npm install
npm run dev
Runs at http://localhost:5173.Local URLsMenu (Table 3): http://localhost:5173/menu?table=3Kitchen: http://localhost:5173/kitchenReception: http://localhost:5173/receptionQR Codes: http://localhost:5173/admin/qr
