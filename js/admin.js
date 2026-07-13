// ===================================================
//  CraveHub — Admin Dashboard
//  IMPORTANT: this password check runs entirely in the
//  browser. Anyone who views the page source can read it.
//  It's fine for a local demo, but NOT for a real deployed
//  admin panel — that needs server-side authentication.
// ===================================================

const ADMIN_PASSWORD = 'admin123'; // change this
const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

document.getElementById('adminLoginBtn').addEventListener('click', tryLogin);
document.getElementById('adminPass').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tryLogin();
});

function tryLogin() {
  const val = document.getElementById('adminPass').value;
  if (val === ADMIN_PASSWORD) {
    sessionStorage.setItem('ch_admin_ok', '1');
    showDashboard();
  } else {
    document.getElementById('adminGateError').textContent = 'Incorrect password.';
  }
}

document.getElementById('adminLogoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('ch_admin_ok');
  location.reload();
});

function showDashboard() {
  document.getElementById('adminGate').style.display = 'none';
  document.getElementById('adminContent').style.display = 'block';
  renderAll();
}

function renderAll() {
  const orders = JSON.parse(localStorage.getItem('ch_orders') || '[]');
  const reservations = JSON.parse(localStorage.getItem('ch_reservations') || '[]');
  const messages = JSON.parse(localStorage.getItem('ch_messages') || '[]');
  const mailLog = JSON.parse(localStorage.getItem('ch_mail_log') || '[]').filter(m => m.form_type === 'Contact Form');
  const subs = JSON.parse(localStorage.getItem('ch_newsletter') || '[]');

  const allMessages = messages.concat(mailLog.map(m => ({
    name: m.from_name, email: m.from_email, subject: m.subject, message: m.message
  })));

  document.getElementById('statOrders').textContent = orders.length;
  document.getElementById('statReservations').textContent = reservations.length;
  document.getElementById('statMessages').textContent = allMessages.length;
  document.getElementById('statSubs').textContent = subs.length;

  document.getElementById('ordersTableBody').innerHTML = orders.length === 0
    ? `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No orders yet.</td></tr>`
    : orders.map(o => `
        <tr>
          <td>${o.id}</td>
          <td>${new Date(o.date).toLocaleDateString()}</td>
          <td>${o.customer.name}<br><span style="color:var(--text-muted);">${o.customer.phone}</span></td>
          <td>$${o.total}</td>
          <td>${o.payment}</td>
          <td>
            <select onchange="updateOrderStatus('${o.id}', this.value)">
              ${STATUS_STEPS.map(s => `<option value="${s}" ${s === (o.status || 'Pending') ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </td>
        </tr>`).join('');

  document.getElementById('reservationsTableBody').innerHTML = reservations.length === 0
    ? `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No reservations yet.</td></tr>`
    : reservations.map(r => `
        <tr><td>${r.name}</td><td>${r.email}</td><td>${r.phone}</td><td>${r.date}</td><td>${r.time}</td><td>${r.guests}</td></tr>`).join('');

  document.getElementById('messagesTableBody').innerHTML = allMessages.length === 0
    ? `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No messages yet.</td></tr>`
    : allMessages.map(m => `
        <tr><td>${m.name || ''}</td><td>${m.email || ''}</td><td>${m.subject || ''}</td><td>${m.message || ''}</td></tr>`).join('');

  document.getElementById('subsTableBody').innerHTML = subs.length === 0
    ? `<tr><td style="text-align:center; color:var(--text-muted);">No subscribers yet.</td></tr>`
    : subs.map(s => `<tr><td>${s}</td></tr>`).join('');
}

function updateOrderStatus(orderId, status) {
  const orders = JSON.parse(localStorage.getItem('ch_orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    localStorage.setItem('ch_orders', JSON.stringify(orders));
  }
}

// Tabs
document.querySelectorAll('.tab_btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab_btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab_panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.getAttribute('data-tab')).classList.add('active');
  });
});

// Auto-login if already authenticated this session
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('ch_admin_ok') === '1') showDashboard();
});
