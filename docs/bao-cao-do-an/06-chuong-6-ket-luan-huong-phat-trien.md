# Chương 6. Kết luận và hướng phát triển

## 6.1. Kết luận

Đồ án đã xây dựng thành công ứng dụng web **Algoverse** (mã nguồn **learner-app**) hỗ trợ học và củng cố kiến thức về **Stack**, **Queue**, **chuyển đổi biểu thức**, và **BFS** thông qua **trực quan hóa** và **câu hỏi trắc nghiệm**, đồng thời tích hợp **trang About** để đọc báo cáo Markdown trên cùng giao diện. Hệ thống áp dụng **React**, **TypeScript**, **Vite** và **Tailwind CSS**, đồng thời áp dụng các thực hành tốt như **lazy loading route**, **theme sáng/tối**, và **xuất lỗi có kiểm soát** nhờ error boundary.

Về mặt học thuật, đồ án cho thấy có thể tạo công cụ giáo dục nhẹ, **chạy hoàn toàn phía client**, vẫn đủ hấp dẫn và dễ tiếp cận cho người học. Về mặt kỹ năng nghề nghiệp, đồ án thể hiện khả năng **phân chia module**, **triển khai SPA**, và **kiểm thử** phần logic.

## 6.2. Hướng phát triển

1. **Tích hợp UI cho module `puzzle.ts`**  
   Hiển thị các dạng bài sinh đề có **seed**, replay, gợi ý — tận dụng mã và test đã có.

2. **Mở rộng ngân hàng câu hỏi và chế độ ôn**  
   Thêm câu hỏi, giải thích chi tiết sau từng câu, hoặc chế độ “ôn sai”.

3. **Lưu tiến độ cục bộ**  
   Dùng `localStorage` để nhớ chủ đề đang học hoặc điểm cao gần nhất (không cần server).

4. **Backend tùy chọn**  
   Tài khoản, đồng bộ điểm, hoặc lớp học ảo nếu mở rộng thành sản phẩm dài hạn.

5. **Thêm cấu trúc dữ liệu**  
   Danh sách liên kết, heap minh họa, BST — tái sử dụng kiến trúc `features/`.

6. **Khả năng tiếp cận (a11y)**  
   Kiểm tra keyboard navigation, ARIA label cho các nút mô phỏng, tương phản màu theo WCAG.

## 6.3. Lời kết

Dự án đáp ứng mục tiêu đồ án: vừa **cố định kiến thức nền** về cấu trúc dữ liệu và thuật toán cơ bản, vừa **ứng dụng công nghệ web hiện đại** để trình bày trực quan. Các hướng mở rộng ở mục 6.2 là lộ trình tự nhiên nếu tiếp tục phát triển sau báo cáo.
