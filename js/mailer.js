// ===================================================
//  CraveHub — Mailer (EmailJS)
//  ONE place to configure email notifications for:
//  Contact form, Reservation/Booking, Newsletter, Order form.
//
//  SETUP (free, no backend):
//  1. Sign up free at https://www.emailjs.com with your Gmail.
//  2. Add an "Email Service" -> connect your Gmail account.
//  3. Create TWO templates in the EmailJS dashboard:
//
//     TEMPLATE A — "Order Notification" (sent to YOU)
//     ---------------------------------------------------
//     To email:  your own Gmail address (hard-coded in the template,
//                NOT in this file — keep personal emails out of code
//                you might share or commit to version control)
//     Subject:   📦 New Order Received - CraveHub
//     Body uses variables: {{order_id}} {{customer_name}} {{customer_email}}
//                          {{phone}} {{address}} {{items_list}} {{total}} {{payment}}
//     -> Paste this Template ID into EMAILJS_TEMPLATE_ID below.
//
//     TEMPLATE B — "Order Confirmation" (sent to the CUSTOMER)
//     ---------------------------------------------------
//     To email:  {{to_email}}   <- IMPORTANT: set this in the template's "To Email" field
//     Subject:   🎉 Your CraveHub Order is Confirmed!
//     Body:
//       Hello {{customer_name}},
//
//       Thank you for ordering from CraveHub! 🍔
//
//       Your order has been confirmed.
//
//       Order Details
//       -------------------------
//       Order ID: #{{order_id}}
//       Items:
//       {{items_list}}
//
//       Total: ${{total}}
//
//       Estimated Delivery:
//       {{eta}}
//
//       If you have any questions, reply to this email.
//
//       Thank you for choosing CraveHub ❤️
//
//       Team CraveHub
//     -> Paste this Template ID into EMAILJS_ORDER_CONFIRM_ID below.
//
//  4. Contact form & Reservation auto-replies reuse EMAILJS_AUTOREPLY_ID
//     (a simple "thanks, we got your message" template — optional).
//
//  5. Paste your Public Key / Service ID and all template IDs below.
// ===================================================

const EMAILJS_PUBLIC_KEY       = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID       = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID      = 'YOUR_TEMPLATE_ID';             // Template A -> your Gmail (all form types)
const EMAILJS_AUTOREPLY_ID     = 'YOUR_AUTOREPLY_TEMPLATE_ID';   // optional generic "thanks" -> contact/reservation sender
const EMAILJS_ORDER_CONFIRM_ID = 'YOUR_ORDER_CONFIRM_TEMPLATE_ID'; // Template B -> customer order confirmation

const EMAILJS_CONFIGURED = (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY');
if (EMAILJS_CONFIGURED) emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Sends a notification email to YOUR Gmail (the template's own hard-coded "To" field
 * decides where it lands — nothing here needs your address).
 * Falls back to a local demo log if EmailJS isn't configured yet, so the
 * site still "works" out of the box for testing.
 */
function sendMailNotification(formType, payload) {
  return new Promise((resolve, reject) => {
    if (!EMAILJS_CONFIGURED) {
      const log = JSON.parse(localStorage.getItem('ch_mail_log') || '[]');
      log.unshift({ form_type: formType, ...payload, date: new Date().toISOString() });
      localStorage.setItem('ch_mail_log', JSON.stringify(log));
      resolve({ demo: true });
      return;
    }
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { form_type: formType, ...payload })
      .then(resolve)
      .catch(reject);
  });
}

/** Optional: sends a thank-you auto-reply to the customer's own email (Contact/Reservation). */
function sendAutoReply(payload) {
  if (!EMAILJS_CONFIGURED || EMAILJS_AUTOREPLY_ID === 'YOUR_AUTOREPLY_TEMPLATE_ID') return Promise.resolve({ skipped: true });
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_ID, payload);
}

/** Sends the "Your Order is Confirmed" email straight to the customer's inbox. */
function sendOrderConfirmation(payload) {
  return new Promise((resolve, reject) => {
    if (!EMAILJS_CONFIGURED || EMAILJS_ORDER_CONFIRM_ID === 'YOUR_ORDER_CONFIRM_TEMPLATE_ID') {
      const log = JSON.parse(localStorage.getItem('ch_mail_log') || '[]');
      log.unshift({ form_type: 'Order Confirmation (customer)', ...payload, date: new Date().toISOString() });
      localStorage.setItem('ch_mail_log', JSON.stringify(log));
      resolve({ demo: true });
      return;
    }
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ORDER_CONFIRM_ID, payload)
      .then(resolve)
      .catch(reject);
  });
}
