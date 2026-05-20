# Team Task Manager 🚀

A modern, full-stack task management system with role-based access control (Admin/Member), real-time dashboards, and collaborative features.

## 🌟 Live Demo

**Live Application:** [https://team-task-manager-production-d2fc.up.railway.app](https://team-task-manager-production-d2fc.up.railway.app)

## 📋 Features

### 🔐 Authentication
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes

### 👑 Admin Features
- Full CRUD operations on projects
- Create, edit, delete tasks
- Assign tasks to team members
- Add/remove team members from projects
- View all tasks across the system
- Complete analytics dashboard
- Team performance monitoring

### 👤 Member Features
- View assigned projects and tasks
- Update task status (Todo → In Progress → Completed)
- Personal dashboard with task statistics
- Calendar view of deadlines
- Profile management

### 📊 Dashboard
- Real-time task statistics
- Task completion rate
- Priority distribution charts
- Team performance metrics
- Recent activities feed
- Overdue task alerts

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router DOM | Navigation |
| Axios | API calls |
| React Icons | Icons |
| React Hot Toast | Notifications |
| Recharts | Charts |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| Prisma | ORM |
| MySQL | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |

## 📁 Project Structure
team-task-manager/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── routes/
│ │ └── index.js
│ ├── prisma/
│ │ └── schema.prisma
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── services/
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
└── README.md

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager

cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npx prisma migrate dev
npm run dev

cd frontend
npm install
cp .env.example .env
# Edit .env with your backend URL
npm run dev
