# 🔐 BaiTest - Account & Password Manager

Ứng dụng quản lý tài khoản và mật khẩu full-stack.

| Layer | Technology |
|-------|-----------|
| **Frontend** | React Native (Expo, Zustand, React Query) |
| **Backend** | NestJS (TypeORM, JWT, bcrypt) |
| **Database** | PostgreSQL 16 |

---

## 📋 Yêu cầu hệ thống

- **Node.js** >= 20
- **PostgreSQL** >= 16
- **Yarn** hoặc **npm**
- **Xcode** (iOS) / **Android Studio** (Android)

---

## 🗄️ Bước 1: Cài đặt PostgreSQL

### macOS (Homebrew)

```bash
# Cài đặt
brew install postgresql@16

# Khởi động service
brew services start postgresql@16

# Tạo database
createdb baitest
```

### Kiểm tra kết nối

```bash
psql -d baitest -c "SELECT 1;"
```

### Cấu hình Database

Backend mặc định kết nối với:

| Thuộc tính | Giá trị mặc định |
|-----------|-----------------|
| Host | `localhost` |
| Port | `5432` |
| Username | *(tên user hệ thống)* |
| Password | *(trống)* |
| Database | `baitest` |

> **Lưu ý:** Nếu cần thay đổi, sửa trong `backend/src/app.module.ts` hoặc dùng biến môi trường:
> `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`

---

## ⚙️ Bước 2: Chạy Backend (NestJS)

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài dependencies
npm install

# Chạy development server
npm run start:dev
```

### Kết quả mong đợi

```
🚀 Backend running on http://localhost:3000
✅ Admin account seeded (admin / Abcd1234$)
```

### API Endpoints

| Method | Endpoint | Mô tả | Auth |
|--------|----------|--------|------|
| `POST` | `/api/auth/login` | Đăng nhập, nhận JWT | ❌ |
| `GET` | `/api/accounts` | Danh sách tài khoản | ✅ JWT |
| `POST` | `/api/accounts` | Tạo tài khoản mới | ✅ JWT |
| `PATCH` | `/api/accounts/:id` | Cập nhật tài khoản | ✅ JWT |
| `DELETE` | `/api/accounts/:id` | Xóa tài khoản | ✅ JWT |

### Test API nhanh

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Abcd1234$"}'

# Lấy danh sách accounts (thay YOUR_TOKEN bằng access_token từ login)
curl http://localhost:3000/api/accounts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📱 Bước 3: Chạy Frontend (React Native)

> **Quan trọng:** Mở terminal MỚI, giữ backend chạy ở terminal cũ.

```bash
# Từ thư mục gốc (không phải backend/)
cd ..

# Cài dependencies (lần đầu)
yarn install

# Chạy Expo
npx expo start
```

Sau đó nhấn:
- `i` → Chạy trên iOS Simulator
- `a` → Chạy trên Android Emulator

### Hoặc chạy trực tiếp:

```bash
# iOS
npm run ios

# Android
npm run android
```

---

## 🔑 Tài khoản đăng nhập mặc định

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `Abcd1234$` |

Tài khoản admin được tự động tạo khi backend khởi động lần đầu.

---

## 📁 Cấu trúc dự án

```
.
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Module xác thực (JWT)
│   │   ├── accounts/          # Module CRUD tài khoản
│   │   ├── seed/              # Seed admin account
│   │   ├── app.module.ts      # Root module (cấu hình DB)
│   │   └── main.ts            # Entry point
│   └── package.json
│
├── src/                        # React Native Frontend
│   ├── app/store/             # Zustand stores (authStore)
│   ├── data/
│   │   ├── api/               # API calls (authApi, accountApi)
│   │   └── queries/           # React Query hooks
│   ├── presentation/
│   │   ├── screens/
│   │   │   ├── signIn/        # Màn hình đăng nhập
│   │   │   └── accountManagement/ # Màn hình quản lý tài khoản
│   │   └── navigator/         # Navigation setup
│   └── shared/                # Validation, constants
│
├── .env                        # Environment config
└── package.json
```

---

## 🔒 Bảo mật

- Mật khẩu được mã hóa bằng **bcrypt** (salt rounds = 10)
- API được bảo vệ bằng **JWT** (Bearer token, hết hạn 24h)
- Validation input với **class-validator** (backend) và **zod** (frontend)

---

## ❓ Troubleshooting

### PostgreSQL không kết nối được

```bash
# Kiểm tra service đang chạy
brew services list | grep postgresql

# Restart service
brew services restart postgresql@16
```

### Backend lỗi kết nối DB

Kiểm tra `backend/src/app.module.ts` — đảm bảo `username` khớp với user PostgreSQL:

```bash
# Xem user PostgreSQL hiện tại
whoami
```

### Lỗi `npm start:dev`

Dùng `npm run start:dev` (có `run`), không phải `npm start:dev`.
