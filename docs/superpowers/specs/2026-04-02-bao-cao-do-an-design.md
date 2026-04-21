# Thiết kế bộ tài liệu báo cáo đồ án (đã duyệt)

**Ngày:** 2026-04-02  
**Dự án:** learner-app (Algoverse — tên hiển thị trên giao diện)  
**Ngôn ngữ:** Tiếng Việt (thân báo cáo) + Abstract, Keywords và tóm tắt chương bằng tiếng Anh  

## Phạm vi đã thống nhất

- Cấu trúc file: mỗi chương một Markdown trong `docs/bao-cao-do-an/`.
- Kèm file tiếng Anh `abstract-keywords-en.md` (Abstract, Keywords, tóm tắt ngắn từng chương).
- Các file hỗ trợ: `README.md`, `tom-tat-tieng-viet.md`, `danh-muc-hinh-bang.md`, `tu-viet-tat.md`, `tai-lieu-tham-khao.md`, `phu-luc.md`.

## Ràng buộc trung thực với mã nguồn

- Ứng dụng triển khai: React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Framer Motion.
- Chức năng người dùng: trang chủ, mô phỏng Stack, chuyển Infix → Postfix, mô phỏng Queue, mô phỏng BFS, trang Practice (đề trắc nghiệm Stack/Queue), trang **About** (hiển thị Markdown trong `docs/bao-cao-do-an/`).
- Module `src/features/practice/puzzle.ts` (sinh đề/chấm có seed) có **kiểm thử đơn vị** nhưng **chưa tích hợp** vào giao diện Practice; báo cáo mô tả như **mở rộng kỹ thuật / tích lũy trong repo**, không gắn vào luồng người dùng hiện tại.

## Trạng thái

Thiết kế được người dùng xác nhận (“ok”). Nội dung đầy đủ được ghi trong các file tại `docs/bao-cao-do-an/`.

**Cập nhật:** Bổ sung mục phương pháp thực hiện & bảng tiến độ (Ch.1), F7 + sơ đồ Mermaid + mục About (Ch.3), bảng phiên bản & mục triển khai About (Ch.4), bảng số liệu kỹ thuật (Ch.5), tài liệu tham khảo tiếng Việt gợi ý, đồng bộ abstract/danh mục hình/phụ lục với trang `/about`.
