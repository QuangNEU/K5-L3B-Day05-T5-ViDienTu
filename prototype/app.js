'use strict';
const $ = id => document.getElementById(id);
const chat = $('chat');
const welcome = $('welcome');
const cards = new Map();
const notifications = new Map();
let busy = false;
let toastTimer;
let activeVerificationId = null;
let verificationCompleted = false;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function scrollChat() { chat.scrollTop = chat.scrollHeight; }
function showActivity() { $('activity').hidden = false; $('unread').hidden = true; }
function toast(text) {
  clearTimeout(toastTimer);
  $('toast').textContent = text;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4500);
}
function addMessage(role, text, error = false) {
  welcome.hidden = true;
  const row = element('div', `message ${role}${error ? ' error' : ''}`);
  if (role === 'assistant') row.appendChild(element('div', 'avatar', 'M'));
  row.appendChild(element('div', 'message-body', text));
  chat.appendChild(row);
  scrollChat();
  return row;
}
function setBusy(value) {
  busy = value;
  $('send').disabled = value;
  $('new-chat').disabled = value;
  $('new-chat-mobile').disabled = value;
  $('message').disabled = value;
  document.querySelectorAll('.tool-card button').forEach(button => { button.disabled = value; });
  document.querySelectorAll('.tool-card a').forEach(link => link.setAttribute('aria-disabled', String(value)));
  $('transfer-support').disabled = value;
  $('continue-verification').disabled = value || verificationCompleted;
}
function updateTool(tool) {
  if (!tool.id) return;
  welcome.hidden = true;
  if (tool.parent_id && cards.has(tool.parent_id)) {
    cards.get(tool.parent_id).buttons.querySelector('.primary-link')?.remove();
    cards.get(tool.parent_id).status.textContent = 'Đã mở bước xác thực mô phỏng. Không xác minh danh tính thật.';
  }
  let card = cards.get(tool.id);
  if (!card) {
    const node = element('div', 'tool-card');
    const title = element('div', 'tool-title');
    const detail = element('p');
    const code = element('code');
    const status = element('div', 'tool-status');
    const buttons = element('div', 'buttons');
    node.append(title, detail, code, status, buttons);
    card = { node, title, detail, code, status, buttons };
    cards.set(tool.id, card);
    chat.appendChild(node);
  }
  card.title.textContent = tool.title;
  card.detail.textContent = tool.reason + (tool.transaction_id ? ` · Giao dịch: ${tool.transaction_id}` : '');
  card.code.textContent = tool.name;
  card.status.textContent = tool.message;
  card.buttons.replaceChildren();
  if (tool.action?.kind === 'verification' && !tool.completed) {
    const link = element('a', 'primary-link', tool.action.label);
    link.href = '#xac-thuc'; link.setAttribute('aria-disabled', String(busy));
    link.addEventListener('click', event => { event.preventDefault(); if (!busy) openVerification(tool.id); });
    card.buttons.appendChild(link);
  }
  const support = element('a', '', 'Đến Trung tâm hỗ trợ');
  support.href = '#ho-tro'; support.setAttribute('aria-disabled', String(busy));
  support.addEventListener('click', event => { event.preventDefault(); if (!busy) showSupport(); });
  card.buttons.appendChild(support);
  let notification = notifications.get(tool.id);
  if (!notification) {
    if (!notifications.size) $('notifications').replaceChildren();
    notification = element('div', 'notification');
    notifications.set(tool.id, notification);
    $('notifications').prepend(notification);
  }
  notification.replaceChildren(element('strong', '', tool.title), element('p', '', tool.message),
    element('small', '', new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' · ' + tool.name));
  $('activity-count').textContent = String(notifications.size);
  $('unread').hidden = !$('activity').hidden;
  const prefix = tool.status === 'blocked' ? 'Đã chặn: ' : tool.status === 'pending_analyst' ? 'Chờ chuyên viên duyệt: ' : 'Thông báo gọi tool mô phỏng: ';
  toast(prefix + tool.name);
  scrollChat();
}
function clearFlowHash() { history.replaceState(null, '', location.pathname); }
function showSupport() {
  $('verification-dialog').close();
  if (!$('support-dialog').open) $('support-dialog').showModal();
  history.replaceState(null, '', '#ho-tro');
}
async function postAction(path, data) {
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Chưa thể xử lý thao tác.');
  return result.tool;
}
async function transferSupport() {
  if (busy) return;
  setBusy(true);
  try {
    const tool = await postAction('/api/support', {});
    updateTool(tool);
    $('support-status').textContent = 'Thông báo gọi chuyen_tu_van_vien (mô phỏng). Mã yêu cầu: ' + tool.id.slice(0, 8) + '. Chưa liên hệ nhân viên thật.';
  } catch (error) { $('support-status').textContent = error.message; }
  finally { setBusy(false); }
}
async function openVerification(id) {
  if (busy) return;
  setBusy(true);
  try {
    const tool = await postAction('/api/action', { id, operation: 'open' });
    activeVerificationId = tool.id; verificationCompleted = false;
    updateTool(tool);
    const face = tool.action.method === 'face';
    $('verification-title').textContent = face ? 'Xác thực khuôn mặt' : 'Xác thực bằng OTP';
    $('verification-description').textContent = face
      ? 'Tiếp tục tại màn hình bảo mật của ví. Không dùng lại OTP đã chia sẻ và không nhờ AI xác nhận hộ.'
      : 'Trên ứng dụng thật, OTP chỉ được nhập trong màn hình bảo mật. Bản mẫu này không yêu cầu nhập mã.';
    $('verification-status').textContent = tool.message;
    if (!$('verification-dialog').open) $('verification-dialog').showModal();
    history.replaceState(null, '', '#xac-thuc');
  } catch (error) { toast(error.message); }
  finally { setBusy(false); }
}
async function completeVerification() {
  if (busy || !activeVerificationId || verificationCompleted) return;
  setBusy(true);
  try {
    const tool = await postAction('/api/action', { id: activeVerificationId, operation: 'complete' });
    verificationCompleted = true;
    updateTool(tool);
    $('verification-status').textContent = tool.message;
  } catch (error) { $('verification-status').textContent = error.message; }
  finally { setBusy(false); }
}
async function connect(reset = false) {
  setBusy(true);
  try {
    if (location.protocol === 'file:') throw new Error('Hãy chạy python server.py rồi mở http://127.0.0.1:8765. Không mở trực tiếp file HTML.');
    const response = await fetch('/api/session');
    const config = await response.json();
    if (!response.ok) throw new Error(config.error || 'Chưa kết nối được máy chủ.');
    if (reset) {
      $('support-dialog').close(); $('verification-dialog').close(); clearFlowHash();
      activeVerificationId = null; verificationCompleted = false;
      chat.replaceChildren(welcome); welcome.hidden = false;
      cards.clear(); notifications.clear();
      $('notifications').replaceChildren(element('div', 'empty-notifications', 'Chưa có thông báo.'));
      $('activity-count').textContent = '0'; $('unread').hidden = true;
    }
    $('connection').textContent = config.configured ? 'DeepSeek · Sẵn sàng trò chuyện' : 'Chưa cấu hình DeepSeek';
    $('connection-dot').classList.toggle('connected', config.configured);
    $('setup').hidden = config.configured;
    $('setup').textContent = 'Chưa cấu hình DeepSeek. Các đường hỗ trợ và bảo vệ thông tin vẫn dùng được; để trò chuyện AI, thiết lập DEEPSEEK_API_KEY theo prototype/README.md.';
  } catch (error) {
    $('connection').textContent = 'Chưa kết nối';
    $('setup').textContent = error.message; $('setup').hidden = false;
  } finally { setBusy(false); }
}
async function sendMessage(event) {
  event.preventDefault();
  const text = $('message').value.trim();
  if (!text || busy) return;
  setBusy(true);
  $('message').value = ''; $('message').style.height = 'auto';
  welcome.hidden = true;
  const loading = element('div', 'message assistant');
  loading.append(element('div', 'avatar', 'M'), element('div', 'thinking', 'Trợ lý đang đọc yêu cầu'));
  chat.appendChild(loading); scrollChat();
  let accepted = false;
  let finished = false;
  function handle(item) {
    if (item.type === 'user') { accepted = true; addMessage('user', item.text); chat.appendChild(loading); }
    if (item.type === 'status') loading.querySelector('.thinking').textContent = item.text;
    if (item.type === 'tool') { updateTool(item.tool); chat.appendChild(loading); }
    if (item.type === 'assistant') addMessage('assistant', item.text);
    if (item.type === 'error') addMessage('assistant', item.text, true);
    if (item.type === 'done') finished = true;
    scrollChat();
  }
  try {
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) });
    if (!response.ok) { const result = await response.json(); throw new Error(result.error || 'Không gửi được tin nhắn.'); }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    for (;;) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split('\n'); buffer = lines.pop();
      for (const line of lines) if (line.trim()) handle(JSON.parse(line));
      if (done) break;
    }
    if (buffer.trim()) handle(JSON.parse(buffer));
    if (!finished) throw new Error('Kết nối bị ngắt trước khi hoàn tất. Bạn có thể hỏi lại.');
  } catch (error) {
    addMessage('assistant', error.message, true);
    if (!accepted) $('message').value = text;
  } finally {
    loading.remove(); setBusy(false); $('message').focus(); scrollChat();
  }
}
$('composer').addEventListener('submit', sendMessage);
$('message').addEventListener('input', () => { $('message').style.height = 'auto'; $('message').style.height = Math.min($('message').scrollHeight, 140) + 'px'; });
$('message').addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) sendMessage(event); });
$('new-chat').addEventListener('click', () => connect(true));
$('new-chat-mobile').addEventListener('click', () => connect(true));
$('bell').addEventListener('click', showActivity);
$('activity-toggle').addEventListener('click', showActivity);
$('close-activity').addEventListener('click', () => { $('activity').hidden = true; });
$('support-header').addEventListener('click', showSupport);
$('support-nav').addEventListener('click', showSupport);
$('verification-support').addEventListener('click', showSupport);
$('close-support').addEventListener('click', () => $('support-dialog').close());
$('back-to-chat').addEventListener('click', () => $('support-dialog').close());
$('close-verification').addEventListener('click', () => $('verification-dialog').close());
$('support-dialog').addEventListener('close', () => { if (!$('verification-dialog').open) clearFlowHash(); });
$('verification-dialog').addEventListener('close', () => { if (!$('support-dialog').open) clearFlowHash(); });
$('transfer-support').addEventListener('click', transferSupport);
$('continue-verification').addEventListener('click', completeVerification);
document.addEventListener('keydown', event => { if (event.key === 'Escape') $('activity').hidden = true; });
connect();
