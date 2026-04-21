# Báo cáo đồ án — hướng dẫn sử dụng bộ Markdown

Bộ tài liệu này hỗ trợ soạn **báo cáo đồ án** theo mẫu **Word/PDF** của trường. Nội dung chính nằm trong các file `01-chuong-1-…` đến `06-chuong-6-…`.

## Thứ tự ghép vào bản nộp

1. Trang bìa, phụ bìa, lời cam đoan, lời cảm ơn — theo **mẫu nhà trường** (không có trong repo).
2. **Tóm tắt (Abstract) tiếng Việt** — lấy từ `tom-tat-tieng-viet.md` (hoặc chỉnh theo yêu cầu khoa).
3. **Abstract + Keywords tiếng Anh** — lấy từ `abstract-keywords-en.md`.
4. Mục lục tự động, danh mục hình, danh mục bảng — tạo trên Word; cập nhật `danh-muc-hinh-bang.md` nếu muốn bản nháp song song.
5. `01-chuong-1-tong-quan.md` → … → `06-chuong-6-ket-luan-huong-phat-trien.md`.
6. `tai-lieu-tham-khao.md`.
7. `tu-viet-tat.md` (nếu trường yêu cầu).
8. `phu-luc.md` (ảnh chụp màn hình, hướng dẫn chạy, v.v.).

## Hình ảnh và bảng

- Trong từng chương có chỗ ghi **Hình X.Y** / **Bảng X.Y** dạng gợi ý. Khi chèn ảnh thật vào Word, **đánh số lại** theo thứ tự xuất hiện toàn văn bản.
- Nên lưu ảnh chụp màn hình độ phân giải đủ (ví dụ ≥ 1280 px chiều ngang) và đặt tên rõ ràng trong thư mục phụ lục hoặc thư mục `assets` riêng khi nộp.

## Chuẩn trích dẫn

- `tai-lieu-tham-khao.md` dùng phong cách gần với **IEEE**: [số] trong ngoặc vuông, phù hợp báo cáo kỹ thuật. Nếu trường bắt **APA** hoặc **Harvard**, chỉnh lại định dạng danh mục và trích dẫn trong bản Word cho đồng nhất.

## Chạy thử ứng dụng khi viết Chương 4–5

```bash
cd /path/to/learner-app
npm install
npm run dev
```

Build và kiểm thử:

```bash
npm run build
npm test
```

## Tên hiển thị vs tên repo

- Giao diện dùng thương hiệu **Algoverse** (thanh điều hướng).
- Repository / gói npm: **learner-app**. Trong báo cáo có thể nêu cả hai để tránh nhầm lẫn.
