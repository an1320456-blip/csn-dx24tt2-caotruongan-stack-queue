# Phụ lục

## Phụ lục A. Hướng dẫn chạy mã nguồn (tóm tắt)

```bash
git clone <URL-kho-mã> learner-app
cd learner-app
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ Vite in ra (thường `http://localhost:5173`).

## Phụ lục B. Cấu trúc thư mục gọn (tham chiếu)

```
learner-app/
  index.html
  package.json
  vite.config.ts
  src/
    App.tsx
    main.tsx
    index.css
    features/stack/
    features/queue/
    features/practice/
    features/about/    # AboutPage, MarkdownArticle, aboutSources
    shared/components/
    shared/theme/
    shared/lib/
  docs/
    bao-cao-do-an/     # Bộ báo cáo Markdown (hiển thị qua /about)
```

Định tuyến liên quan: `/about`, `/about?doc=<slug>` (xem `aboutSources.ts`).

## Phụ lục C. Ảnh chụp màn hình

*Dán ảnh hoặc liệt kê đường dẫn file ảnh đính kèm khi nộp bản PDF/in.*

Gợi ý tên file:

- `screenshot-home.png`
- `screenshot-stack.png`
- `screenshot-infix.png`
- `screenshot-queue.png`
- `screenshot-bfs.png`
- `screenshot-practice.png`
- `screenshot-practice-dark.png` (tuỳ chọn)

## Phụ lục D. Đoạn mã quan trọng (tuỳ chọn)

*Nếu quy định khoa cho phép, trích đoạn ngắn (≤ 1 trang) minh họa `App.tsx` routing hoặc hàm `hash32`/`mulberry32` — tránh dán cả file dài.*

## Phụ lục E. Bảng lệnh npm

| Lệnh | Ý nghĩa |
|------|---------|
| `npm run dev` | Chế độ phát triển |
| `npm run build` | Biên dịch production |
| `npm run preview` | Xem bản build |
| `npm test` | Chạy Vitest |
| `npm run lint` | ESLint |
