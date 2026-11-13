# MEME — Chat với ví dùng DeepSeek

Chatbot nhận tin nhắn tự do, giữ ngữ cảnh hội thoại trong bộ nhớ máy chủ và dùng DeepSeek để trả lời. Không có phần chọn tình huống.

## Chạy trên máy

Cần Python 3.10 trở lên, không cần cài thư viện ngoài.

1. Trong thư mục `prototype`, sao chép `.env.example` thành `.env`.
2. Mở `.env` bằng trình soạn thảo và điền API key của bạn sau `DEEPSEEK_API_KEY=`. Không gửi key vào chat, không đưa key vào HTML/JavaScript. File `.env` đã được loại khỏi Git.
3. Mở terminal trong thư mục `prototype` và chạy:

   ```powershell
   python server.py
   ```

4. Mở [http://127.0.0.1:8765](http://127.0.0.1:8765) bằng trình duyệt. Không mở trực tiếp `index.html`.

API key cũng có thể đặt qua biến môi trường `DEEPSEEK_API_KEY` thay cho `.env`. Khởi động lại máy chủ sau khi sửa cấu hình. Nhấn Ctrl+C để dừng. Khi chạy trong Codex, có thể dùng Python đi kèm runtime nếu máy chưa có lệnh `python`.

## AI và tool

- DeepSeek được gọi thật từ Python qua `https://api.deepseek.com/chat/completions`; mặc định model `deepseek-flash`, có thể đổi qua `DEEPSEEK_MODEL`. Máy cần Internet, API key hợp lệ và số dư DeepSeek. Xem [tài liệu API chính thức](https://api-docs.deepseek.com/).
- Model chọn function phù hợp từ tin nhắn và ngữ cảnh; máy chủ xử lý đề xuất rồi trả kết quả về model để tổng hợp câu trả lời theo [định dạng tool calls](https://api-docs.deepseek.com/api/create-chat-completion/).
- **Không có tool ví thật.** `giu_giao_dich` và `chuyen_tu_van_vien` chỉ tạo thông báo mô phỏng. Không giữ tiền và không báo nhân viên thật.
- `yeu_cau_xac_minh` **tự tạo yêu cầu** và nút **Tiếp tục xác thực khuôn mặt**. Khi bấm, màn hình bảo mật mô phỏng mở và hiện thông báo gọi `gui_man_hinh_khuon_mat`. Nút **Tiếp tục mô phỏng** hoàn tất bước minh hoạ; không xác minh danh tính và không nhả giao dịch thật.
- Có hai tool con `gui_man_hinh_OTP` và `gui_man_hinh_khuon_mat`. Khi phát hiện lộ thông tin, máy chủ chặn đường OTP, kể cả model đề xuất hoặc người dùng mở một yêu cầu OTP cũ. Màn hình mẫu không có ô nhập OTP và không bật camera.
- `khoa_vi` chỉ tạo đề nghị **chờ chuyên viên chống gian lận**, không có nút khách tự duyệt. Không có chuyên viên hoặc cơ chế khoá ví thật trong bản mẫu.
- `nha_giao_dich` không được cung cấp cho model và vẫn bị chặn tại máy chủ nếu có lời gọi ngoài danh sách. Không có nút xác nhận nào cấp quyền nhả tiền cho AI.
- Nút chuông và mục Hoạt động hiển thị tên tool, lý do, trạng thái và giờ thông báo. Đây chỉ là thông báo trong ứng dụng, không gửi email/SMS/push hệ điều hành.
- Nút **Trung tâm hỗ trợ** trên thanh đầu trang hoặc link trong thẻ tool mở trang hỗ trợ nội bộ (`#ho-tro`). Bấm **Chuyển yêu cầu hỗ trợ** hiện thông báo `chuyen_tu_van_vien` và mã yêu cầu mô phỏng. Không điều hướng đến một địa chỉ ví thật chưa được cung cấp.

## Thử nhanh

Nhập tự do, không cần chọn ca. Có thể hỏi “Tôi vừa chuyển tiền nhưng bị treo, nên làm gì?”, tiếp tục sửa thông tin hoặc yêu cầu chuyển hỗ trợ. Với yêu cầu khoá ví, kiểm tra thẻ chờ chuyên viên. Với lời tự nhận là nhân viên kỹ thuật và yêu cầu bỏ qua cảnh báo, kiểm tra AI không nhả tiền.

Để thử đường bảo vệ dữ liệu, dùng **thông tin giả** trong bài lab: một câu nói giao dịch đang treo và đưa kèm OTP/mật khẩu giả. Bạn phải thấy dữ liệu được che, thẻ `yeu_cau_xac_minh`, nút **Tiếp tục xác thực khuôn mặt** và link **Đến Trung tâm hỗ trợ**. Bấm xác thực → thấy màn hình mô phỏng cùng thông báo `gui_man_hinh_khuon_mat`; bấm chuyển hỗ trợ → thấy thông báo `chuyen_tu_van_vien`. Hai đường này dùng được ngay cả khi chưa cấu hình DeepSeek, vì đây là bộ bảo vệ và thao tác nội bộ; những câu chat khác vẫn cần API key để AI trả lời.

## Phạm vi bản mẫu

Đây là bản chạy cục bộ cho bài lab, không phải ứng dụng ví production. Dùng dữ liệu dựng vì nội dung hội thoại được gửi tới DeepSeek. Máy chủ không ghi chat ra file và không phục vụ `.env`; lịch sử và đề xuất chỉ ở bộ nhớ, mất khi khởi động lại. Trình duyệt không lưu lịch sử vào localStorage. Bắt đầu cuộc trò chuyện mới tạo phiên mới.

Bộ lọc minh hoạ che số nghi nhạy cảm trong câu chứa OTP/mật khẩu/số thẻ và che API key trước khi lưu hội thoại hoặc gửi ra ngoài. Khi không che an toàn được, nó ẩn cả tin nhắn. Với thông tin xác thực bị phát hiện, bộ bảo vệ tự hiện đường xác thực khuôn mặt mà không gửi câu đó sang DeepSeek. Đây không phải bộ lọc production và không bảo đảm nhận diện mọi thông tin nhạy cảm; không nhập thông tin thật. Chưa có đăng nhập, backend ví, hàng đợi tư vấn viên hay thông báo ngoài ứng dụng.

Kiểm tra tự động bằng `python -m unittest discover -s tests -v`. Các kiểm tra dùng provider giả để xác minh đường gọi tool mà không tốn phí DeepSeek. Muốn xác nhận kết nối thật phải cấu hình key và gửi tin nhắn từ giao diện.
