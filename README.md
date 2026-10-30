# 🛡️ Anonymous Feedback System (CipherFeedback)

An open, secure, and privacy-first feedback platform built for classrooms and educational institutions. **CipherFeedback** enables educators to collect candid, constructive, and completely anonymous insights from students without fear of bias or social pressure.

---

## 🌟 Key Features

- **🔒 True Anonymity Guaranteed**:
  - Feedback submissions store no student IDs, IP records, or metadata.
  - Messages are associated exclusively with topic IDs, ensuring complete privacy.

- **👨‍🏫 Teacher / Staff Portal**:
  - Teacher authentication and profile management.
  - Create and manage course or class groups.
  - Unique shareable Group IDs for seamless student enrollment.
  - Create and organize discussion/feedback topics with descriptions.
  - View real-time anonymous responses submitted under each topic.
  - Toggle feedback status (`reviewed` / `unreviewed`) for tracking action items.
  - Topic deletion with automatic cascade cleanup of associated feedbacks.

- **🎓 Student Portal**:
  - Quick, frictionless student onboarding.
  - Join course groups using teacher-provided Group IDs.
  - Browse active feedback topics posted by teachers.
  - Submit honest, uninhibited feedback on course curriculum, lectures, and assignments.

- **🚀 Modern Full-Stack Architecture**:
  - High-performance Express 5 API backend with MySQL connection pooling.
  - Modern React 19 Single Page Application (SPA) powered by Vite 7 and Tailwind CSS 4.
  - Unified production build where Express statically serves the optimized Vite frontend.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database Driver**: [mysql2](https://github.com/sidorares/node-mysql2) (Promises & Connection Pooling)
- **Utilities**: `dotenv`, `cors`, `nodemon`

### Database
- **Database Engine**: [MySQL](https://www.mysql.com/)

---

## 🗄️ Database Architecture

The system uses a relational MySQL database structured with foreign keys and cascade deletions:

```
[ users ]
   ├── (1:N) ──> [ groups ]
   │                ├── (1:N) ──> [ topics ]
   │                │                └── (1:N) ──> [ feedback ]
   │                └── (N:M) ──> [ group_members ]
   └── (1:N) ─────────────────────────┘
```

### Table Definitions

| Table | Columns | Description |
|---|---|---|
| `users` | `id`, `name`, `role` | Stores teachers (`teacher`) and students (`student`). |
| `groups` | `id`, `name`, `teacher_id`, `created_at` | Classroom or course groups managed by teachers. |
| `group_members` | `student_id`, `group_id`, `joined_at` | Junction table associating enrolled students with groups. |
| `topics` | `id`, `group_id`, `title`, `description`, `created_at` | Specific feedback prompts or subjects created within a group. |
| `feedback` | `id`, `topic_id`, `message`, `reviewed`, `created_at` | Anonymous submissions linked **only** to `topic_id`. |

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login/teacher` | Authenticate or register teacher by email and name |
| `POST` | `/api/auth/login/student` | Authenticate or register student by name |

### 👥 Groups (`/api/groups`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/groups` | Create a new group (Teacher) |
| `GET` | `/api/groups/teacher/:teacherId` | Retrieve all groups owned by a teacher |
| `POST` | `/api/groups/join` | Join a group using Group ID (Student) |
| `GET` | `/api/groups/student/:studentId` | Retrieve all groups a student has joined |
| `DELETE`| `/api/groups/:groupId` | Delete a group |

### 📝 Topics (`/api/topics`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/topics` | Create a new topic under a group |
| `GET` | `/api/topics/group/:groupId` | Fetch all topics for a given group |
| `DELETE`| `/api/topics/:id` | Delete a topic and its associated feedback |

### 💬 Feedback (`/api/feedback`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/feedback` | Submit anonymous feedback for a topic |
| `GET` | `/api/feedback/topic/:topicId` | Get all feedback entries for a topic |
| `PATCH` | `/api/feedback/:id/review` | Toggle feedback reviewed status |

### ⚙️ Utilities & Setup
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/setup` | Initialize database tables and seed mock test users |
| `GET` | `/verify-tables` | Check status of existing MySQL database tables |

---

## 📁 Project Directory Structure

```text
Anonymous-Feedback-System/
├── client_src/                 # React frontend application
│   ├── components/
│   │   ├── groups/             # Group management & contexts
│   │   ├── layout/             # Navigation and layout components
│   │   ├── staff/              # Teacher login & dashboard components
│   │   ├── student/            # Student login, dashboard & feedback views
│   │   └── topics/             # Topic and feedback state providers
│   ├── App.tsx                 # Route definitions & protected routes
│   ├── main.tsx                # Frontend entrypoint
│   └── style.css               # Tailwind CSS setup
├── src/                        # Node.js Express backend
│   ├── routes/
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── feedback.js         # Anonymous feedback endpoints
│   │   ├── groups.js           # Group operations
│   │   └── topics.js           # Topic creation & management
│   ├── db.js                   # MySQL connection pool configuration
│   └── index.js                # Express app configuration & server entrypoint
├── public/                     # Static frontend assets
├── build/                      # Compiled frontend distribution (production)
├── setup_db.js                 # Standalone database migration/setup script
├── vite.config.ts              # Vite bundler configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies and scripts
├── .env.example                # Sample environment variables
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) (v9.x or later)
- [MySQL](https://dev.mysql.com/downloads/) (v8.0+ or cloud instance such as Azure / PlanetScale / AWS RDS)

---

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AjayKumarOnly/Anonymous-Feedback-System.git
   cd Anonymous-Feedback-System
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to supply your MySQL connection credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=cipherfeedback
   ```

4. **Initialize Database Tables**:
   Run the database setup script to create all necessary tables:
   ```bash
   node setup_db.js
   ```
   *(Alternatively, start the server and navigate to `http://localhost:5000/api/setup`)*.

---

### Running the Application

#### Development Mode (Concurrent / Separate Processes)

- **Start Backend Server**:
  ```bash
  npm run dev:server
  ```
  *The backend will run on `http://localhost:5000` with hot-reloading via Nodemon.*

- **Start Frontend Vite Server**:
  ```bash
  npm run dev:client
  ```
  *The Vite dev server will start at `http://localhost:5173`.*

#### Production Build & Run

To build the client bundle and serve everything via the Express server:

1. **Build the Client Assets**:
   ```bash
   npm run build
   ```
2. **Start the Production Server**:
   ```bash
   npm start
   ```
   *Visit `http://localhost:5000` in your browser.*

---

## 🔒 Security & Privacy Notice

- **No Identity Linkage**: The `feedback` database table does not maintain any foreign keys or columns relating to users, students, IP addresses, or session tokens.
- **Data Protection**: Sensitive environment variables and credentials are kept out of version control via `.gitignore`. Always maintain secure credentials in your `.env` file.

---

## 🤝 Contributing

Contributions, feedback, and suggestions are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE) (or as designated in `package.json`).

