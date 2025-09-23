# LidarFit Pro Gym Management System

LidarFit Pro is a full-stack gym management system designed to streamline operations for gyms, trainers, staff, and customers. It features a modern React frontend and a robust Express/MongoDB backend.

## Features

- **User Management:** Admins and staff can manage users, roles, and permissions.
- **Service Packages:** Create and manage gym membership packages (monthly, yearly, custom).
- **Equipment Tracking:** Track gym equipment inventory and maintenance.
- **Payments:** Record and view payments, generate receipts.
- **Attendance:** Check-in/check-out for members.
- **Announcements:** Post announcements for staff and customers.
- **Todos:** Assign and track tasks for customers.
- **Progress Tracking:** Record member progress and assessments.
- **Role-based Dashboards:** Separate dashboards for admin, staff, and customers.
- **API Documentation:** Swagger docs available at `/api/docs`.

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── server.js
│   │   └── swagger.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB

### Backend Setup

1. Install dependencies:

   ```sh
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/` with:

   ```
   MONGODB_URI=mongodb://localhost:27017/lidarfit
   JWT_SECRET=your_jwt_secret
   FRONTEND_ORIGIN=http://localhost:3000
   ```

3. Seed the database (optional):

   ```sh
   node src/seed/seed.js
   ```

4. Start the backend server:

   ```sh
   npm run dev
   ```

   The API will run on [http://localhost:5000](http://localhost:5000).

### Frontend Setup

1. Install dependencies:

   ```sh
   cd frontend
   npm install
   ```

2. Start the frontend dev server:

   ```sh
   npm run dev
   ```

   The app will run on [http://localhost:3000](http://localhost:3000).

### API Documentation

Visit [http://localhost:5000/api/docs](http://localhost:5000/api/docs) for interactive Swagger API docs.

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT

---

**Developed by LidarFit Team**