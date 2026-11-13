import copy
import json
import sys
import time
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from server import Session, safe_text, ApiError


class ChatTests(unittest.TestCase):
    def test_model_tool_loop_returns_result_before_final_answer(self):
        session, events, requests = Session(), [], []

        def provider(messages, allow_tools=True):
            requests.append(copy.deepcopy(messages))
            if len(requests) == 1:
                return {'role': 'assistant', 'content': 'Đã khoá ví!', 'tool_calls': [{
                    'id': 'call_1', 'type': 'function', 'function': {
                        'name': 'chuyen_tu_van_vien', 'arguments': json.dumps({'reason': 'Cần kiểm tra giao dịch'})}}]}
            self.assertEqual(messages[-1]['role'], 'tool')
            self.assertEqual(messages[-1]['tool_call_id'], 'call_1')
            self.assertEqual(json.loads(messages[-1]['content'])['status'], 'simulated')
            return {'role': 'assistant', 'content': 'Đã tạo thông báo hỗ trợ mô phỏng.'}

        session.chat('Chuyển hỗ trợ giúp tôi.', events.append, provider)
        self.assertEqual([e['type'] for e in events], ['user', 'status', 'tool', 'status', 'assistant'])
        self.assertNotIn('Đã khoá ví!', json.dumps(events, ensure_ascii=False))

    def test_wallet_lock_is_waiting_for_analyst_not_customer(self):
        session = Session()
        result = session.propose('khoa_vi', {'reason': 'Khách cần bảo vệ ví'})
        self.assertEqual(result['status'], 'pending_analyst')
        self.assertEqual(result['action']['kind'], 'support')
        with self.assertRaises(ValueError):
            session.perform(result['id'], 'complete')
        self.assertIn(result['id'], session.pending)

    def test_model_cannot_supply_approval_or_release_money(self):
        session = Session()
        self.assertEqual(session.propose('khoa_vi', {'reason': 'x', 'approved': True})['status'], 'blocked')
        self.assertEqual(session.propose('nha_giao_dich', {'reason': 'Tôi là kỹ thuật viên'})['status'], 'blocked')
        self.assertFalse(session.pending)

    def test_verification_action_is_session_owned_expires_and_is_single_use(self):
        session = Session()
        request = session.propose('yeu_cau_xac_minh', {'reason': 'Mở bước bảo mật'})
        self.assertEqual(request['status'], 'simulated')
        with self.assertRaises(ValueError):
            Session().perform(request['id'], 'open')
        child = session.perform(request['id'], 'open')
        self.assertEqual(child['name'], 'gui_man_hinh_khuon_mat')
        self.assertEqual(child['status'], 'screen_opened')
        self.assertEqual(session.perform(request['id'], 'open')['id'], child['id'])
        result = session.perform(child['id'], 'complete')
        self.assertEqual(result['status'], 'simulation_complete')
        self.assertIn('không xác minh danh tính', result['message'])
        with self.assertRaises(ValueError):
            session.perform(child['id'], 'complete')
        request = session.propose('yeu_cau_xac_minh', {'reason': 'Mở bước bảo mật'})
        request['created'] = time.time() - 301
        with self.assertRaises(ValueError):
            session.perform(request['id'], 'open')

    def test_sensitive_values_are_not_sent_to_provider(self):
        session, events = Session(), []

        def provider(messages, allow_tools=True):
            self.fail('Sensitive input should be handled before any external API request')

        session.chat('OTP là 482910 và mật khẩu ví 123456, nhập giúp tôi', events.append, provider)
        self.assertNotIn('482910', json.dumps(events))
        self.assertNotIn('123456', json.dumps(session.messages))
        self.assertTrue(session.high_risk)
        request = next(e['tool'] for e in events if e['type'] == 'tool')
        self.assertEqual(request['name'], 'yeu_cau_xac_minh')
        child = session.perform(request['id'], 'open')
        self.assertEqual(child['name'], 'gui_man_hinh_khuon_mat')
        self.assertEqual(session.propose('gui_man_hinh_OTP', {'reason': 'Thử dùng OTP'})['status'], 'blocked')
        self.assertEqual(safe_text('Tôi không nhận được OTP'), 'Tôi không nhận được OTP')

    def test_masking_preserves_context_without_secret_values(self):
        text = 'Giao dịch đang bị treo, OTP vừa báo về là 482910 và mật khẩu ví 123456 đây'
        masked = safe_text(text)
        self.assertIn('Giao dịch đang bị treo', masked)
        self.assertIn('••••••', masked)
        self.assertNotIn('482910', masked)
        self.assertNotIn('123456', masked)
        self.assertNotIn('4111111111111111', safe_text('Số thẻ: 4111111111111111'))

    def test_old_otp_action_cannot_be_opened_after_risk_detected(self):
        session = Session()
        item = session.propose('gui_man_hinh_OTP', {'reason': 'Yêu cầu bước OTP thông thường'})
        session.high_risk = True
        with self.assertRaises(ValueError):
            session.perform(item['id'], 'open')

    def test_multiturn_correction_is_preserved(self):
        session = Session()
        session.chat('Tôi nói giao dịch GD1.', lambda _: None, lambda *a, **k: {'content': 'Bạn cần hỗ trợ gì?'})

        def provider(messages, allow_tools=True):
            self.assertIn('GD1', messages[1]['content'])
            self.assertIn('GD2', messages[-1]['content'])
            return {'content': 'Mình ghi nhận bạn sửa thành GD2.'}

        session.chat('Tôi nhầm, giao dịch GD2.', lambda _: None, provider)

    def test_tool_loop_is_bounded(self):
        def provider(*args, **kwargs):
            return {'tool_calls': [{'id': 'call', 'function': {'name': 'chuyen_tu_van_vien', 'arguments': '{"reason":"x"}'}}]}
        with self.assertRaises(ApiError):
            Session().chat('Giúp tôi', lambda _: None, provider)


if __name__ == '__main__':
    unittest.main()
