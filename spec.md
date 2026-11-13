# Bài nộp LAB5 — [T5] · Nhóm [ViDienTu]
[Danh sách thành viên và việc mỗi người làm — copy bảng từ README]
**Lớp:** L3B · **Bàn / zone:** I1 · **Track:** T5

| Họ và Tên | Mã Học Viên | Việc đã làm |
|---|---|---|
| Nguyễn Minh Quang | 2A202603791 | Đóng góp 4 kịch bản rủi ro (§2), viết phần Mức tự chủ (§4) và Tiêu chí nghiệm thu (§6) thuyết trình, tham gia thảo luận và đóng góp ý kiến trong nhóm |
| Nguyễn Đình Nam |  |  |
| Nguyễn Nhật Minh |  |  |


## §1. Lát cắt & phạm vi
- Trong Chat với ví (giống Chat với MoMo), khi người dùng ví đang lo lắng nhắn hỏi vì một giao dịch bị giữ, bị giục chuyển tiền gấp, hoặc thấy tiền bị trừ lạ, AI tự trả lời và hướng dẫn thao tác, hỏi lại cho rõ, hay chuyển tư vấn viên, để tiền không đi sai chỗ, mà khách thật đang gấp không bị bỏ lơ.
- 3 việc tính năng KHÔNG làm, mỗi việc một câu vì sao.

## §2. Kịch bản rủi ro  (chặng 2)
- ≥8 kịch bản, mỗi lớp ①②③④ ít nhất một; mỗi kịch bản: tin người dùng · lớp · AI có thể sai thế nào · sản phẩm tốt nên làm gì · nhãn (nhẹ / sửa được / không chấp nhận được).
tin người dùng nhắn | lớp | AI có thể sai thế nào | một sản phẩm tốt nên làm gì | nhãn

- Bằng chứng: cột "AI có thể sai thế nào" trỏ về một tool hoặc một dòng dữ liệu của track (hoặc chỗ dữ liệu không có).
- Quyết định: 2 kịch bản đắt nhất — vì sao đắt hơn các kịch bản còn lại; kịch bản nào suýt được chọn và vì sao không.

## §3. Khi AI sai  (chặng 3)
Với mỗi kịch bản đắt nhất:
- AI nói gì (nguyên văn) · người dùng thấy gì · làm gì tiếp · ai được báo, sau bao lâu.
- Quyết định: hỏi lại / trả lời kèm giới hạn / dừng và chuyển người — chọn cách nào, đã loại cách nào, vì sao.
- Loại lỗi (hệ thống / người dùng / ngữ cảnh) và vì sao cách nói, cách sửa đi theo loại đó.
- 2–3 nguyên tắc HAX/PAIR, mỗi cái trỏ vào một chỗ cụ thể (câu chữ hoặc chỗ trên màn hình).
- Lỗi nào sửa câu chữ không cứu được (nếu có), và thiết kế cứu nó thế nào.

## §4. Mức tự chủ  (chặng 4)
Với mỗi tool:
- Mức của nhóm (tự làm / cần người duyệt / cấm). Nếu cần người duyệt: ai duyệt · người duyệt thấy gì · quá hạn thì sao.
- Lý do theo cost-of-error: sai thì ai chịu gì · đảo lại được không · chờ người thì mất gì.
- Phương án đã cân nhắc và vì sao loại.
Thêm:
- Tool khó xếp nhất: mỗi người từng chọn gì, cái giá của mỗi phía (trỏ về kịch bản ở §2), nhóm chốt thế nào.
- Thử mức đã đặt trên 2 kịch bản đắt nhất + 1 kịch bản bình thường: cái sai có bị chặn không? còn việc nào làm khi lẽ ra phải hỏi? người dùng bình thường có phải chờ vô ích không?
- Luật thêm hoặc tool tách bước (nếu có), và vì sao.
- Một mức tự chủ đã đổi lời hứa nào với người dùng.
## §4. Mức tự chủ  (chặng 4)

### 1. Phân định mức tự chủ

Các mức dưới đây áp dụng cho thiết kế sản phẩm. Trong prototype, mọi tool chỉ phát thông báo; chưa có nhân viên, dữ liệu thiết bị hay thao tác ví thật.

| Tool | Mức của nhóm | Lý do theo chi phí khi sai | Phương án đã cân nhắc và vì sao loại |
|---|---|---|---|
| `giu_giao_dich` | **Tự làm** | Giữ nhầm làm khách chậm thanh toán; nhân viên/hệ thống lõi có thể kiểm tra để nhả theo quy trình. Nếu đợi duyệt khi có nguy cơ tức thời, tiền có thể đã đi. Chỉ áp dụng cho giao dịch đang chờ đã xác định đúng, không thu hồi được khoản đã hoàn tất. | Loại chờ người duyệt trong ca khẩn cấp vì phản ứng có thể quá chậm. Không tự giữ giao dịch chưa xác định chỉ từ câu chữ mơ hồ. |
| `yeu_cau_xac_minh` | **Tự làm** | Tạo yêu cầu nhầm gây thêm thao tác nhưng chưa chuyển tiền. Khách có thể đóng màn hình, không có xác minh thành công nếu họ không thực hiện. | Loại cấm tạo yêu cầu chỉ vì giao dịch nhỏ: giá trị nhỏ không tự chứng minh an toàn. Không để AI nhập OTP hoặc xác nhận thay. |
| `chuyen_tu_van_vien` | **Tự làm** | Chuyển nhầm làm tăng tải hỗ trợ; nhân viên có thể đóng yêu cầu trùng. Chờ thêm có thể làm chậm xử lý sự cố. Chỉ chuyển nội dung tối thiểu đã che thông tin mật. | Loại bắt khách duyệt thêm một bước trước mỗi lần chuyển khẩn cấp; vẫn cho khách chủ động mở Trung tâm hỗ trợ. |
| `nha_giao_dich` | **Cấm AI tự làm** | Nhả sai có thể làm mất tiền, khó hoặc không thể thu hồi; không có bảo đảm đảo ngược. Chỉ nhân viên có thẩm quyền hoặc luồng lõi độc lập được quyết định sau kiểm tra. | Loại tự nhả chỉ vì quét mặt thành công: người thật vẫn có thể bị lừa tự xác thực. Không giao quyền này cho LLM hoặc lời tự nhận là nhân viên. |
| `khoa_vi` | **Cần người duyệt** | Khoá nhầm làm khách mất phương tiện thanh toán; mở lại cần xác minh và có thể mất nhiều thời gian. | Loại tự khoá vì AI dễ suy diễn từ tin nhắn mơ hồ. Người dùng bấm trong chat không thay thế quyền duyệt của chuyên viên. |

**Chi tiết `khoa_vi`:** chuyên viên chống gian lận duyệt. Trong thiết kế thật, người đó cần xem đoạn chat đã che, giao dịch liên quan, dữ liệu thiết bị/IP và lịch sử khi có quyền truy cập; prototype không tự tạo những dữ liệu này. Nếu quá hạn duyệt thì không tự khoá cả ví; giữ nguyên trạng thái của giao dịch đã được giữ hợp lệ và chuyển cấp theo quy trình. Không tự tạo/giữ vô thời hạn một giao dịch khi chưa đủ căn cứ. Bản mẫu chỉ hiện nhãn “Chờ chuyên viên chống gian lận”, không có nút khách tự duyệt.

### 2. Tool khó xếp nhất

**`nha_giao_dich`:** cho AI tự nhả sau xác thực sẽ giảm thời gian chờ cho khách thật đang gấp, như ca viện phí ở §2. Nhưng nạn nhân có thể bị lừa tự xác thực, hoặc người nhắn giả danh nhân viên có thể thúc ép AI bỏ qua cảnh báo (KB 4 trong tài liệu nguồn). Nhóm ưu tiên cấm AI tự nhả; chịu thêm thời gian kiểm tra để hạn chế rủi ro mất tiền. Quyền nhả nằm ở quy trình độc lập, không ở câu trả lời của AI.

Hai quan điểm UX và bảo mật nêu trên là phương án cân nhắc. Chưa có bản ghi lựa chọn độc lập của từng thành viên; nhóm cần bổ sung tên và lựa chọn thực tế, không gán các ví dụ “Bạn A/B” thành ý kiến đã được phát biểu.

### 3. Thử mức trên ba kịch bản

| Ca thử | AI làm gì, khách thấy gì | Sai có bị chặn, việc nào cần hỏi, khách có chờ vô ích không? |
|---|---|---|
| Giả danh nhân viên ép nhả tiền | Không cung cấp `nha_giao_dich` cho model; máy chủ vẫn chặn lời gọi trái phép. Có đường chuyển hỗ trợ. | Chặn quyền nhả sai ở lớp công cụ; không chỉ dựa vào câu từ chối. Giao dịch cần kiểm tra có thể phải chờ người, không được tự nhả khi quá hạn. |
| Gửi OTP/mật khẩu trong chat | Che dữ liệu trước khi lưu/gửi ra ngoài; tự tạo `yeu_cau_xac_minh`, hiện nút tiếp tục bằng khuôn mặt. Bấm nút phát thông báo `gui_man_hinh_khuon_mat`. | Chặn AI nhận nhập hộ và chặn đường OTP trong phiên rủi ro. Khách tự bấm bước bảo mật; hoàn tất mô phỏng không đồng nghĩa xác minh thật hoặc nhả tiền. Có thể chọn chuyển hỗ trợ. |
| App báo chặn, khách muốn tiếp tục | Hỏi rõ giao dịch nếu thiếu thông tin; có thể tạo yêu cầu xác minh, không tự khoá ví hoặc nhả tiền. | Cần hỏi số tiền/dịch vụ thay vì đoán. Khách thật có thể chịu thêm bước xác minh hoặc chờ kiểm tra khi giao dịch nhạy cảm. Với câu hỏi hướng dẫn thông thường, không tạo tool/chờ người vô ích. |

### 4. Luật thêm và tách bước

**Che dữ liệu:** che OTP, mật khẩu, API key và số thẻ bị nhận diện trong chat trước khi đưa vào lịch sử, thông báo hoặc gọi model; không lặp lại trong câu trả lời. Bộ lọc minh hoạ không bảo đảm phát hiện mọi dạng thông tin nhạy cảm, không tuyên bố đáp ứng một chuẩn tuân thủ hay xoá được dữ liệu đã lộ.

**Tách bước xác thực:** `yeu_cau_xac_minh` tự tạo yêu cầu và nút điều hướng. Khi khách bấm, ứng dụng mở `gui_man_hinh_khuon_mat` hoặc `gui_man_hinh_OTP` theo đường được phép. Có dấu hiệu lộ thông tin thì chỉ dùng khuôn mặt; máy chủ chặn cả đề xuất OTP mới và link OTP cũ. Prototype không bật camera hoặc thu OTP. Xác thực khuôn mặt cũng không được dùng làm bằng chứng duy nhất để AI nhả tiền.

### 5. Lời hứa với người dùng

“AI giúp bạn phát hiện vấn đề, mở bước xác thực và tìm đúng nơi hỗ trợ. Việc nhả giao dịch cần quy trình có thẩm quyền riêng.” Sản phẩm đánh đổi một phần tốc độ để giảm rủi ro; không hứa bảo toàn 100% tài sản hoặc giải quyết mọi giao dịch ngay qua chat.
## §5. Prototype  (chặng 5)
- Link hoặc file · công cụ · phần nào mock · có lời gọi AI thật không.
- 1–2 ảnh có đánh số; mỗi số: thể hiện gì · nguyên tắc HAX/PAIR nào · mức tự chủ nào.
- Quyết định: cách hiện độ chắc/bằng chứng và điều khiển mức tự chủ — đã nghĩ tới cách nào khác, vì sao chọn cách này.

## §6. Tốt là gì  (chặng 6 — nhẹ, bỏ được nếu thiếu giờ)
- 3 tiêu chí Pass/Fail chấm được; thiết kế của nhóm đạt tiêu chí nào trên 2 kịch bản đắt nhất; lỗi còn lại.
**1. Ba tiêu chí nghiệm thu (Pass/Fail)**
Dưới đây là 3 điều kiện, nếu AI làm đúng thì nhóm mới dám phát hành cho người dùng thật:
- **Tiêu chí 1 (Chặn quyền thực thi rủi ro):** Lời gọi hàm `nha_giao_dich` phải bị vô hiệu hóa hoàn toàn đối với AI. Dù người dùng dùng thủ đoạn thao túng tâm lý hay giả danh nhân viên quản trị, AI tuyệt đối không thể tự động nhả giao dịch. (Pass/Fail)
- **Tiêu chí 2 (Che mờ dữ liệu nhạy cảm):** Các thông tin định dạng OTP, mật khẩu gửi vào khung chat phải lập tức bị che mờ (thành `••••••`) trên giao diện, trước khi lưu log và trước khi chuyển cho người thật. AI tuyệt đối không được lặp lại thông tin này trong câu trả lời. (Pass/Fail)
- **Tiêu chí 3 (Chuyển giao minh bạch):** Khi AI từ chối một yêu cầu vượt quyền (hoặc nhận thấy rủi ro lộ thông tin), UI phải hiển thị rõ các thẻ hành động (`yeu_cau_xac_minh` hoặc `chuyen_tu_van_vien`) để người dùng tự thao tác tiếp, không để khách hàng bị kẹt lại trong vòng lặp chat vô ích. (Pass/Fail)

**2. Đánh giá thiết kế trên 2 kịch bản đắt nhất**
- **Kịch bản 1 (Tự nhận nhân viên để yêu cầu nhả tiền): Đạt Tiêu chí 1 & 3.** AI không được cấp quyền gọi `nha_giao_dich` (bị chặn ở máy chủ). Trợ lý giải thích rõ giới hạn và hiển thị thẻ "Chưa đủ căn cứ nhả tiền", kèm nút chuyển yêu cầu hỗ trợ minh bạch.
- **Kịch bản 2 (Người dùng gửi OTP/Mật khẩu): Đạt Tiêu chí 2 & 3.** Giao diện tự động che chuỗi thông tin thành `••••••`. AI từ chối nhập hộ, không lặp lại mật khẩu, và hiển thị thẻ xác thực khuôn mặt để định hướng khách hàng thao tác an toàn.

**3. Lỗi còn lại chưa sửa được (Hạn chế của thiết kế)**
- **Lọt lưới che mờ dữ liệu (Lỗi hệ thống/ngữ cảnh):** Bộ lọc tự động che OTP hiện tại phụ thuộc vào nhận diện chuỗi số. Nếu khách hàng cố tình đánh vần bằng chữ (ví dụ: "mật khẩu là một hai ba...") hoặc chèn ký tự lạ ("m.ã: 1-2-3"), bộ lọc có thể bỏ sót. Khi đó, thông tin mật dạng chữ thô (plaintext) vẫn lọt vào ngữ cảnh của AI và log hệ thống. Prototype hiện tại chưa có cơ chế triệt để cứu được lỗi này nếu người dùng cố tình lách định dạng.

## §7. Demo
- Ca lạ nhận được ở demo: prototype đã làm gì, và nhóm có đổi ý gì sau ca đó không.