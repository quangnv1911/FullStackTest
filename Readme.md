# Teenup - Student Management System

Ứng dụng web quản lý học sinh - phụ huynh được phát triển với Node.js, Express, MongoDB và React.

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **ShadCN UI** - Component Library

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web Server (Frontend)

## 📋 Yêu cầu hệ thống

- Docker & Docker Compose
- Node.js 18+ (cho development)
- Git

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Clone repository

```bash
git clone <repository-url>
cd Teenup
```

### 2. Chạy với Docker (Khuyến nghị)

#### Build và chạy tất cả services:

```bash
# Build và chạy tất cả containers
docker-compose up --build

```

### 3. Seed sample data

Sau khi containers đã chạy, seed sample data:

```bash
# Chạy seed script trong backend container
docker-compose exec backend npm run seed
```

### 4. Truy cập ứng dụng

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017

### 5. Chạy development mode (không dùng Docker)

#### Backend:

```bash
cd backend
npm install
npm run dev
```

#### Frontend:

```bash
cd frontend
npm install
npm run dev
```

#### MongoDB:
Cài đặt MongoDB Community Edition hoặc sử dụng MongoDB Atlas.

## 📊 Database Schema

### Parents
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required, unique),
  email: String (required, unique),
  createdAt: Date,
  updatedAt: Date
}
```

### Students
```javascript
{
  _id: ObjectId,
  name: String (required),
  dob: Date (required),
  gender: String (enum: ['male', 'female', 'other']),
  current_grade: String (required),
  parent_id: ObjectId (ref: 'Parent'),
  createdAt: Date,
  updatedAt: Date
}
```

### Classes
```javascript
{
  _id: ObjectId,
  name: String (required),
  subject: String (required),
  day_of_week: String (enum: ['monday', 'tuesday', ...]),
  time_slot: String (format: 'HH:MM-HH:MM'),
  teacher_name: String (required),
  max_students: Number (min: 1, max: 50),
  createdAt: Date,
  updatedAt: Date
}
```

### ClassRegistrations
```javascript
{
  _id: ObjectId,
  class_id: ObjectId (ref: 'Class'),
  student_id: ObjectId (ref: 'Student'),
  registration_date: Date,
  status: String (enum: ['active', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

### Subscriptions
```javascript
{
  _id: ObjectId,
  student_id: ObjectId (ref: 'Student'),
  package_name: String (required),
  start_date: Date (required),
  end_date: Date (required),
  total_sessions: Number (min: 1, max: 200),
  used_sessions: Number (default: 0),
  status: String (enum: ['active', 'expired', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Parents
- `GET /api/parents` - Lấy danh sách tất cả phụ huynh
- `GET /api/parents/{id}` - Lấy thông tin chi tiết phụ huynh
- `POST /api/parents` - Tạo phụ huynh mới
- `PUT /api/parents/{id}` - Cập nhật thông tin phụ huynh
- `DELETE /api/parents/{id}` - Xóa phụ huynh

### Students
- `GET /api/students` - Lấy danh sách tất cả học sinh
- `GET /api/students/{id}` - Lấy thông tin chi tiết học sinh
- `POST /api/students` - Tạo học sinh mới
- `PUT /api/students/{id}` - Cập nhật thông tin học sinh
- `DELETE /api/students/{id}` - Xóa học sinh

### Classes
- `GET /api/classes` - Lấy danh sách tất cả lớp học
- `GET /api/classes?day={weekday}` - Lấy lớp học theo ngày
- `GET /api/classes/{id}` - Lấy thông tin chi tiết lớp học
- `POST /api/classes` - Tạo lớp học mới
- `PUT /api/classes/{id}` - Cập nhật thông tin lớp học
- `DELETE /api/classes/{id}` - Xóa lớp học
- `POST /api/classes/{id}/register` - Đăng ký học sinh vào lớp
- `GET /api/classes/schedule/week` - Lấy lịch học theo tuần

### Subscriptions
- `GET /api/subscriptions` - Lấy danh sách tất cả gói học
- `GET /api/subscriptions/{id}` - Lấy thông tin chi tiết gói học
- `POST /api/subscriptions` - Tạo gói học mới
- `PUT /api/subscriptions/{id}` - Cập nhật gói học
- `DELETE /api/subscriptions/{id}` - Xóa gói học
- `PATCH /api/subscriptions/{id}/use` - Sử dụng một buổi học
- `GET /api/subscriptions/{id}/status` - Xem trạng thái gói học


## 🗃️ Sample Data

Hệ thống bao gồm sample data:
- **3 phụ huynh:** Nguyễn Văn An, Trần Thị Bình, Lê Minh Cường
- **4 học sinh:** Nguyễn Minh Anh, Nguyễn Hoàng Nam, Trần Thùy Linh, Lê Đức Minh
- **5 lớp học:** Toán học, Tiếng Anh, Vật lý, Lịch sử, Hóa học
- **3 gói học:** Các gói 1-6 tháng với số buổi học khác nhau
- **5 đăng ký lớp học:** Học sinh đã đăng ký các lớp học

## 🏗️ Cấu trúc project

```
Teenup/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Database & app config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── app.js          # Express app entry
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React Vite app  
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities & API client
│   │   ├── types/          # TypeScript types
│   │   └── hooks/          # Custom hooks
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml      # Multi-container setup
├── mongo-init.js          # MongoDB initialization
├── Teenup-API.postman_collection.json    # Postman collection
├── Teenup-API.postman_environment.json   # Postman environment
└── README.md              # This file
```

## 🚨 Troubleshooting

### Port conflicts
Nếu ports đã được sử dụng, thay đổi trong `docker-compose.yml`:
```yaml
ports:
  - "3001:80"    # Frontend
  - "5001:5000"  # Backend
  - "27018:27017" # MongoDB
```

## 🧪 API Testing

### 📮 Postman Collection
Import các file sau vào Postman để test API một cách dễ dàng:
- **Collection:** [Teenup-API.postman_collection.json](./Teenup-API.postman_collection.json)
- **Environment:** [Teenup-API.postman_environment.json](./Teenup-API.postman_environment.json)

**Hướng dẫn sử dụng Postman:**
1. Mở Postman Desktop hoặc Web
2. Import collection: File → Import → chọn `Teenup-API.postman_collection.json`
3. Import environment: File → Import → chọn `Teenup-API.postman_environment.json`
4. Chọn environment "Teenup API Environment"


