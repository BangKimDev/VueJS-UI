# Cinema Booking Draft (Cinestar Vue)

Đây là một dự án ứng dụng web đặt vé xem phim được xây dựng bằng các công nghệ web hiện đại. Ứng dụng cung cấp giao diện trực quan cho người dùng tương tác, xem thông tin phim và đặt vé, cùng với các tính năng tích hợp AI.

## Các công nghệ sử dụng

- **Frontend Framework:** Vue 3 với Script Setup
- **Build Tool:** Vite
- **Ngôn ngữ:** TypeScript
- **Quản lý trạng thái (State Management):** Pinia
- **Routing:** Vue Router
- **Mock Backend/Database:** JSON Server
- **Khác:** Axios (gọi API), Motion (Animation), Lucide Vue Next (Icons), và tích hợp `@google/genai` (Google Gemini AI).

---

## Hướng dẫn cài đặt và khởi chạy

Để chạy dự án này trên máy nội bộ của bạn, vui lòng làm theo các bước dưới đây.

### 1. Yêu cầu hệ thống
- Đảm bảo máy tính của bạn đã cài đặt [Node.js](https://nodejs.org/) (khuyến nghị phiên bản LTS mới nhất).
- Quản lý gói có thể là `npm` (được đi kèm mặc định với Node.js), `yarn` hoặc `pnpm`.

### 2. Cài đặt các thư viện (Dependencies)
Mở terminal tại thư mục gốc của dự án (thư mục chứa thư mục `src` và file `package.json`), chạy lệnh sau để tiến hành cài đặt các gói cần thiết:

```bash
npm install
```

### 3. Cấu hình biến môi trường (.env)
Dự án yêu cầu một số biến môi trường để hoạt động (đặc biệt là cho phần AI và API). 
Tạo một file mới có tên là `.env` từ file `.env.example` có sẵn:

- Copy file `.env.example` và đổi tên thành `.env`.
- Mở file `.env` vừa tạo và điền các giá trị thích hợp, đặc biệt là `GEMINI_API_KEY` (Khóa API của Google Gemini).

### 4. Khởi chạy ứng dụng

Dự án này sử dụng JSON Server để giả lập Backend Database (`db.json`) và Vite cho Frontend. Bạn sẽ cần mở **2 cửa sổ (terminal) khác nhau**.

**Terminal 1: Khởi chạy Máy chủ ảo (JSON Server)**
Chạy lệnh hiển thị dữ liệu giả lập (API sẽ chạy trên cổng `3001`):

```bash
npm run server
```

**Terminal 2: Khởi chạy Frontend (Vite)**
Chạy giao diện front-end của ứng dụng (Giao diện sẽ chạy trên cổng `3000`):

```bash
npm run dev
```

Sau khi chạy thành công, bạn có thể mở đường dẫn `http://localhost:3000` trên trình duyệt web để bắt đầu trải nghiệm dự án.

---

## 5. Build dự án (Dành cho Production)
Nếu bạn muốn build thư mục tĩnh để deploy ứng dụng, chạy lệnh sau:

```bash
npm run build
```
Kết quả build sẽ nằm trong thư mục `dist/`.
