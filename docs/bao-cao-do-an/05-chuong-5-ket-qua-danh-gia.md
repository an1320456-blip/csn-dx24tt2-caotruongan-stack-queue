# Chương 5. Kết quả và đánh giá

## 5.1. Kết quả đạt được

Đồ án đã hoàn thành một ứng dụng web **Algoverse / learner-app** với các mảng chính sau:

1. **Trang chủ** giới thiệu và điều hướng rõ ràng tới từng học phần.
2. **Mô phỏng Stack** và **Queue** giúp quan sát thao tác theo thời gian thực trên trình duyệt.
3. **Infix → Postfix** củng cố mối liên hệ giữa stack và xử lý biểu thức.
4. **BFS** minh học mối liên hệ giữa queue và duyệt đồ thị.
5. **Trang luyện tập** với bộ câu hỏi trắc nghiệm, lọc chủ đề, xáo trộn và chấm điểm sau khi nộp.
6. **Giao diện** nhất quán, hỗ trợ **dark mode**, điều hướng responsive.
7. **Kiến trúc mã** tách `features` / `shared`, định tuyến lazy, có **error boundary** và fallback tải route.
8. **Trang About** hiển thị đầy đủ bộ Markdown báo cáo trong repo, hỗ trợ `?doc=` để mở nhanh từng phần.

Về mặt kỹ thuật, dự án **build được** bằng TypeScript và Vite, và **bộ kiểm thử** chạy qua Vitest cho các module logic (trong đó có `puzzle`).

## 5.2. Minh họa kết quả

Sinh viên nên **chèn ảnh chụp màn hình** thực tế từ bản chạy local hoặc bản deploy:

- Trang chủ, từng visualizer, trang BFS, trang Practice (trước và sau khi nộp bài), **trang About** (ví dụ đang mở Chương 2).
- Tùy chọn: ảnh **dark mode** để thể hiện theme.

Tham chiếu danh sách gợi ý trong `danh-muc-hinh-bang.md` và cập nhật số hình cho khớp Word.

## 5.3. Đánh giá so với mục tiêu

| Mục tiêu (Chương 1) | Kết luận ngắn |
|---------------------|----------------|
| Trực quan hóa Stack/Queue | Đạt — có trang riêng cho từng cấu trúc |
| Infix → Postfix | Đạt — có route `/stack/infix` |
| BFS | Đạt — có route `/queue/bfs` |
| Luyện tập | Đạt — trắc nghiệm; puzzle UI **chưa** tích hợp |
| Tài liệu / About | Đạt — đọc Markdown `docs/bao-cao-do-an/` trên `/about` |
| Kiểm thử / mã sạch | Đạt một phần — có test cho engine/puzzle; coverage có thể mở rộng |

## 5.4. Hạn chế

- **Không có backend:** không lưu lịch sử học, không đăng nhập.
- **Module puzzle** trong `puzzle.ts` **chưa có mặt trên UI** — người dùng cuối chưa thấy dạng bài “sinh đề theo seed” trong ứng dụng hiện tại.
- **Đồ thị BFS** phục vụ minh họa, không phải công cụ nhập đồ thị tùy ý từ file hay API.
- **Trắc nghiệm** dựa trên **ngân hàng câu hữu hạn**; chưa có ngân hàng lớn hay thuật toán ra đề động trên UI.

## 5.5. Hướng đánh giá bổ sung (tuỳ chọn)

Nếu thời gian cho phép, có thể:

- Khảo sát **5–10** bạn sinh viên sau khi dùng thử (thang Likert về dễ hiểu, hữu ích).
- So sánh thời gian hoàn thành một bài tập lý thuyết **có/không** dùng công cụ (thiết kế đơn giản).

Các bước này **không bắt buộc** nhưng làm phần đánh giá phong phú hơn.

## 5.6. Bảng số liệu kỹ thuật (điền sau khi chạy lệnh)

*Chạy trên máy bạn rồi ghi số thực tế vào Word; bảng dưới là mẫu.*

| Chỉ số | Cách lấy (gợi ý) | Giá trị ghi nhận |
|--------|------------------|-----------------|
| `node -v` | Terminal | _…_ |
| Thời gian `npm run build` / `yarn build` | Đo bằng tay hoặc `time` | _…_ |
| Số test pass | `npm test` — dòng tổng kết Vitest | _…_ |
| Dung lượng thư mục `dist/` | `du -sh dist` (Unix) hoặc thuộc tính thư mục | _…_ |
| Dung lượng chunk About (ước lượng) | Xem tên file `AboutPage-*.js` trong `dist/assets/` | _…_ |
| Điểm Lighthouse (Performance / A11y) | Chrome DevTools, tab Lighthouse, chế độ mobile/desktop | _tuỳ chọn_ |

---

Kết quả trên là cơ sở cho **kết luận** trong Chương 6.
