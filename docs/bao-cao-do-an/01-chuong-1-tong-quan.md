# Chương 1. Tổng quan đề tài

## 1.1. Đặt vấn đề

Cấu trúc dữ liệu **Stack (ngăn xếp)** và **Queue (hàng đợi)** là kiến thức nền tảng trong chương trình đào tạo Công nghệ Thông tin. Sinh viên thường tiếp cận chúng qua định nghĩa, giả mã thao tác trên giấy và một số bài tập lập trình cố định. Cách học này đôi khi **thiếu liên kết trực quan** giữa trạng thái cấu trúc theo thời gian và **ứng dụng thực tế** như xử lý biểu thức, undo/redo, lập lịch, hay duyệt đồ thị theo chiều rộng (BFS).

Xu hướng học tập trực tuyến và **học chủ động** đòi hỏi công cụ có khả năng:

- Mô phỏng từng bước thao tác một cách **dễ quan sát**;
- Cho phép người học **thử nghiệm** trên giao diện web mà không cần cài đặt môi trường nặng;
- Có thêm **kênh ôn luyện** (câu hỏi trắc nghiệm) để củng cố khái niệm.

Từ đó phát sinh **vấn đề nghiên cứu/thực hiện:** xây dựng một ứng dụng web nhẹ, hiện đại, tập trung vào Stack/Queue và các bài toán liên quan, phục vụ mục đích giáo dục và báo cáo đồ án.

## 1.2. Lý do chọn đề tài

Đề tài kết hợp **nền tảng lý thuyết** (cấu trúc dữ liệu, thuật toán cơ bản) với **công nghệ phát triển web** đang được sử dụng rộng rãi trong ngành: **React**, **TypeScript**, **Vite**. Việc triển khai dưới dạng **SPA (Single Page Application)** giúp thể hiện năng lực tổ chức mã nguồn, định tuyến, và trải nghiệm người dùng — các kỹ năng sát với thực tế làm phần mềm.

## 1.3. Mục tiêu của hệ thống

Hệ thống **Algoverse** (mã nguồn dự án: **learner-app**) hướng tới các mục tiêu sau:

1. **Trực quan hóa** thao tác Stack và Queue với phản hồi giao diện rõ ràng.
2. **Minh họa** chuyển biểu thức dạng trung tố (infix) sang hậu tố (postfix) — ứng dụng điển hình của Stack.
3. **Minh họa** thuật toán **BFS** trên đồ thị nhỏ, nhấn mạnh vai trò của Queue.
4. Cung cấp **trang luyện tập** dạng **trắc nghiệm** theo chủ đề Stack/Queue, hỗ trợ lọc đề và xáo trộn câu hỏi.
5. Đảm bảo mã nguồn **dễ bảo trì**, có **kiểm thử đơn vị** cho các phần logic quan trọng.
6. Có **trang About** (`/about`) để đọc bộ tài liệu báo cáo (Markdown trong `docs/bao-cao-do-an/`) trực tiếp trên ứng dụng, thuận tiện cho người chấm và người học.

## 1.4. Phạm vi và giới hạn

**Trong phạm vi đồ án:**

- Ứng dụng chạy trên **trình duyệt**, không yêu cầu người dùng đăng nhập.
- Dữ liệu luyện tập (câu trả lời, điểm) **không lưu trên máy chủ**; mỗi phiên làm bài độc lập trong phiên trình duyệt.
- Đồ thị trong BFS là **mô hình minh họa** cố định hoặc giản lược, phục vụ giảng dạy, không phải hệ thống bản đồ hay đồ thị lớn.

**Ngoài phạm vi (hướng mở rộng):**

- Hệ thống tài khoản, đồng bộ đám mây, bảng xếp hạng.
- Tích hợy đầy đủ giao diện cho module **puzzle** sinh đề xác định theo *seed* (hiện có trong mã nguồn và **kiểm thử**, chưa gắn UI).

## 1.5. Ý nghĩa thực tiễn

Ứng dụng có thể dùng làm **tài liệu minh học** trong giờ lý thuyết/thực hành môn Cấu trúc dữ liệu và Giải thuật, hoặc là **công cụ ôn tập cá nhân** cho sinh viên. Giao diện hỗ trợ **chế độ sáng/tối**, thuận tiện khi học trong điều kiện ánh sáng khác nhau.

## 1.6. Phương pháp thực hiện

Quy trình làm đồ án theo hướng **lặp tăng dần** (có thể mô tả tương đương mô hình mini-waterfall):

1. **Khảo sát & phân tích:** xác định đối tượng người học, chức năng cần có (mô phỏng, luyện tập, tài liệu).
2. **Thiết kế:** chọn kiến trúc SPA, cấu trúc thư mục, định tuyến, giao diện; soạn khung báo cáo song song.
3. **Cài đặt:** triển khai từng module (`stack`, `queue`, `practice`, `about`), tích hợp layout/theme.
4. **Kiểm thử:** chạy `npm test` cho logic; kiểm tra tay trên trình duyệt (desktop/mobile); chỉnh lỗi hiển thị.
5. **Đánh giá & hoàn thiện báo cáo:** ảnh chụp màn hình, số liệu build/test, kết luận.

*Nếu khoa yêu cầu mục “phương pháp nghiên cứu” riêng, có thể trích rút mục này sang đoạn văn so sánh với công cụ tham khảo (Visualgo, tài liệu giảng dạy) mà không cần khảo sát thực địa.*

### 1.6.1. Gợi ý bảng tiến độ (sinh viên điền)

| Tuần / giai đoạn | Nội dung công việc chính | Kết quả dự kiến |
|------------------|---------------------------|-----------------|
| | Thu thập tài liệu, chốt phạm vi đề tài | Bản mô tả yêu cầu sơ bộ |
| | Thiết kế UI/UX nháp, cấu trúc route | Wireframe / danh sách trang |
| | Cài đặt Stack, Queue, Infix, BFS | Các trang mô phỏng chạy được |
| | Trang Practice, About, hoàn thiện theme | Đủ chức năng theo báo cáo |
| | Kiểm thử, chụp ảnh, chỉnh văn bản | Bản báo cáo + mã nguồn nộp |

## 1.7. Cấu trúc báo cáo

- **Chương 2** trình bày cơ sở lý thuyết.
- **Chương 3** phân tích yêu cầu và thiết kế.
- **Chương 4** mô tả triển khai và môi trường thực nghiệm.
- **Chương 5** kết quả và đánh giá.
- **Chương 6** kết luận và hướng phát triển.

---

**Gợi ý hình minh họa (chèn khi hoàn thiện Word):** *Hình 1.1 — Giao diện tổng quan trang chủ Algoverse.*
