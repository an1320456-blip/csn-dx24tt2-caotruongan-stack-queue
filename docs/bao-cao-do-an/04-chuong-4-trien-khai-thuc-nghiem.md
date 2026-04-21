# Chương 4. Triển khai và thực nghiệm

## 4.1. Môi trường và công cụ

Bảng phiên bản **tham chiếu `package.json`** tại thời điểm soạn tài liệu (khi hoàn tất báo cáo, nên chạy lại và cập nhật nếu có thay đổi):

| Thành phần | Phiên bản (semver trong dự án) |
|------------|--------------------------------|
| react / react-dom | ^19.2.4 |
| typescript | ~5.9.3 |
| vite | ^8.0.1 |
| vitest | ^4.1.2 |
| react-router-dom | ^7.13.2 |
| tailwindcss | ^4.2.2 |
| react-markdown | ^10.1.0 (trang About) |
| remark-gfm | ^4.0.1 |

- **Runtime:** Node.js (để chạy `npm`/`yarn`, Vite, Vitest) — ghi rõ **phiên bản Node** bạn dùng khi build (ví dụ `node -v`) và OS trong bảng thực nghiệm hoặc phụ lục.

Cấu hình Vite tối giản: hai plugin `react()` và `tailwindcss()`.

## 4.2. Khởi tạo ứng dụng

`main.tsx` gắn root React, bọc **`ThemeProvider`** (context theme sáng/tối) và `BrowserRouter` (từ React Router) xung quanh `App`.

`App.tsx`:

- Dùng `React.lazy` và `Suspense` để **tách mã** theo route.
- `Routes`/`Route` khai báo các đường dẫn như bảng thiết kế ở Chương 3.
- `ErrorBoundary` bao bọc phần có `Suspense`.

## 4.3. Triển khai tính năng theo module

### 4.3.1. Trang chủ (`Home.tsx`)

Giới thiệu slogan, mô tả ngắn về học Stack/Queue trực quan, nút dẫn tới `/stack` và `/queue`, kèm thẻ tính năng (card) nối tới các phần con.

**Gợi ý hình:** *Hình 4.1 — Trang chủ.*

### 4.3.2. Stack (`StackVisualizer.tsx`)

Cài đặt trực quan hóa stack: người dùng thêm/xóa phần tử, giao diện phản ánh **đỉnh** và thứ tự phần tử. (Chi tiết animation và state cụ thể nằm trong mã nguồn component.)

**Gợi ý hình:** *Hình 4.2 — Màn hình mô phỏng Stack.*

### 4.3.3. Infix → Postfix (`InfixToPostfix.tsx`)

Cho phép nhập hoặc chọn biểu thức, hiển thị quá trình/chuyển đổi phù hợp logic đã cài. Đây là phần minh họa **ứng dụng stack** trong biên dịch biểu thức.

**Gợi ý hình:** *Hình 4.3 — Infix sang Postfix.*

### 4.3.4. Queue (`QueueVisualizer.tsx`)

Mô phỏng enqueue/dequeue với phản hồi trực quan.

**Gợi ý hình:** *Hình 4.4 — Mô phỏng Queue.*

### 4.3.5. BFS (`BFSVisualizer.tsx`)

Hiển thị đồ thị minh họa và trình tự BFS, nhấn mạnh hàng đợi chờ duyệt.

**Gợi ý hình:** *Hình 4.5 — Minh họa BFS.*

### 4.3.6. Luyện tập (`PracticePage.tsx`)

- Dữ liệu: mảng `EXAM_BANK` (câu hỏi trắc nghiệm có `topic: 'stack' | 'queue'`).
- Hàm `buildExamQuestions(filter)` lọc và **shuffle** rồi `slice` giới hạn số câu.
- State React: chỉ số câu hiện tại, map đáp án, `examSubmitted`, tính `examScore` sau nộp.

**Gợi ý hình:** *Hình 4.6 — Trang trắc nghiệm.*

### 4.3.7. About — tài liệu Markdown (`AboutPage.tsx`)

- Route `/about`, lazy-load giống các trang khác trong `App.tsx`.
- **`aboutSources.ts`:** liệt kê slug + tên file `.md`, nạp nội dung bằng `import.meta.glob('../../../docs/bao-cao-do-an/*.md', { query: '?raw', eager: true })`.
- **`MarkdownArticle.tsx`:** render Markdown với `react-markdown` + `remark-gfm`, map component để đồng bộ typography với theme sáng/tối.
- **UX:** sidebar (desktop) / `<select>` (mobile); `useSearchParams` với khóa `doc` (ví dụ `/about?doc=chuong-2`).

**Gợi ý hình:** *Hình 4.7 — Trang About với nội dung một chương báo cáo.*

## 4.4. Layout và theme (`Layout.tsx`, `ThemeProvider.tsx`)

- Header: logo **Algoverse**, liên kết `NavLink` tới Home/Stack/Queue/Practice/**About**, menu responsive, **ThemeToggle** (sun/moon).
- `useTheme()` đọc theme hiện tại và `toggleTheme`.

`index.css` chứa các biến/utility Tailwind và style toàn cục (kích thước lớn — báo cáo chỉ cần nêu vai trò: định nghĩa giao diện đồng bộ).

## 4.5. Thuật toán và logic bổ sung trong repo

### 4.5.1. `puzzle.ts`

- **Hash FNV-1a 32-bit** (`hash32`) để dẫn xuất seed từ chuỗi chứa topic/độ khó.
- **Mulberry32** tạo dãy giả ngẫu nhiên xác định.
- Mô phỏng từng thao tác trên **bản sao mảng** trạng thái; cờ lỗi khi pop/dequeue rỗng hoặc push/enqueue thiếu giá trị.

Phần này **đã được kiểm thử** (`puzzle.test.ts`) để đảm bảo hành vi cốt lõi ổn định khi tích hợp UI sau này.

### 4.5.2. `engine.ts`

Logic phiên luyện tập (điểm, combo, độ khó theo vòng) — có file `engine.test.ts`; **UI trắc nghiệm hiện tại** không gọi đầy đủ pipeline này.

## 4.6. Kiểm thử

Chạy:

```bash
npm test
```

Vitest thực thi các file `*.test.ts` trong dự án, gồm test cho `puzzle` và `engine`.

## 4.7. Build và xem trước bản production

```bash
npm run build
npm run preview
```

Kết quả build nằm trong thư mục `dist/`, có thể triển khai tĩnh lên nền tảng như Vercel (theo metadata trong `package.json`).

---

Chương này tương ứng phần “thực nghiệm cài đặt”; **Chương 5** tổng hợp nhận xét kết quả.
