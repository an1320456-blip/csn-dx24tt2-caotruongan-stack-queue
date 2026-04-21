# Chương 2. Cơ sở lý thuyết

## 2.1. Stack (ngăn xếp)

Stack là cấu trúc dữ liệu trừu tượng tuân theo nguyên tắc **LIFO** (*Last-In, First-Out*): phần tử vào sau cùng sẽ được lấy ra trước. Hai thao tác cốt lõi thường dùng trong giảng dạy:

- **Push:** thêm phần tử vào **đỉnh** stack.
- **Pop:** loại bỏ phần tử tại đỉnh.

Trong nhiều ứng dụng còn nhắc tới **peek** (xem đỉnh không xóa). Stack được dùng trong **quản lý lời gọi hàm**, **undo/redo**, **kiểm tra ngoặc**, và **chuyển đổi biểu thức**.

## 2.2. Queue (hàng đợi)

Queue tuân theo nguyên tắc **FIFO** (*First-In, First-Out*): phần tử vào trước được xử lý trước. Thao tác cơ bản:

- **Enqueue:** thêm phần tử vào **cuối** hàng.
- **Dequeue:** lấy phần tử ở **đầu** hàng.

Queue xuất hiện trong **lập lịch tác vụ**, **bộ đệm**, và nhiều thuật toán trên đồ thị cần duyệt theo lớp.

## 2.3. Biểu thức trung tố và hậu tố

Biểu thức **trung tố (infix)** là dạng thường gặp với toán tử nằm **giữa** toán hạng, ví dụ `A + B * C`. Biểu thức **hậu tố (postfix / RPN)** đặt toán tử **sau** các toán hạng, ví dụ `A B C * +`.

Hậu tố có ưu điểm **không cần ngoặc** để biểu diễn thứ tự tính toán, thuận lợi cho máy tính dùng stack để đánh giá. Quá trình chuyển infix → postfix thường dùng **thuật toán Shunting-yard** hoặc phương pháp tương đương dựa trên stack và độ ưu tiên toán tử.

## 2.4. Đồ thị và duyệt BFS

**Đồ thị** gồm tập **đỉnh** và **cạnh**. Thuật toán **BFS** (*Breadth-First Search*) bắt đầu từ một đỉnh nguồn, thăm các đỉnh theo **lớp khoảng cách** tăng dần. Cấu trúc **queue** dùng để lưu các đỉnh **chờ duyệt**: mỗi lần lấy đỉnh ở đầu hàng, xét các láng giềng và đưa láng giềng chưa thăm vào cuối hàng.

BFS là nền tảng cho nhiều bài toán: đường đi ngắn nhất trên đồ thị **không trọng số**, lan truyền trên lưới, v.v.

## 2.5. Ứng dụng web một trang (SPA)

**SPA** tải một khung trang, sau đó **cập nhật nội dung** bằng JavaScript mà không tải lại toàn bộ trang cho mỗi thao tác nhỏ. Điều này phù hợp ứng dụng tương tác nhiều như mô phỏng thuật toán.

**React** là thư viện xây dựng giao diện theo **thành phần (component)** và mô hình **state** — khi state đổi, giao diện có thể được cập nhật có kiểm soát.

**TypeScript** là JavaScript có **hệ kiểu tĩnh**, giúp giảm lỗi khi dự án lớn dần và tài liệu hóa cấu trúc dữ liệu trong mã nguồn.

**Vite** là công cụ build/dev server hiện đại, khởi động nhanh và tích hợp tốt với React.

## 2.6. Định tuyến và tải lazy

**React Router** quản lý **đường phụ (URL)** và ánh xạ tới từng màn hình. **Lazy loading** cho phép **tách mã** theo tuyến đường, chỉ tải phần mã cần thiết khi người dùng truy cập trang đó, cải thiện thời gian tải ban đầu.

## 2.7. Kiểm thử đơn vị

**Kiểm thử đơn vị** xác minh từng hàm/module nhỏ với bộ **test case** cố định. Trong hệ sinh thái JavaScript, **Vitest** là công cụ phổ biến, tương thích Vite, giúp tự động hóa kiểm tra khi phát triển logic thuật toán (ví dụ chấm đáp án, mô phỏng thao tác).

---

Phần lý thuyết trên đủ để làm nền cho **Chương 3** (thiết kế) và **Chương 4** (cài đặt) của đồ án.
