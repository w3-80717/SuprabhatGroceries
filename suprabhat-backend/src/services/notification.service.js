// File: src/services/notification.service.js

import { emailService } from './email.service.js';
import { whatsAppService } from './whatsapp.service.js';

// --- Template Generators ---
// These functions create the content for our messages.

const generateOrderConfirmationHtml = (order, user) => {
  const itemsHtml = order.items.map(item => 
    `<li>${item.name} (x${item.quantity}) - ₹${item.price.toFixed(2)} each</li>`
  ).join('');

  return `
    <h1>Thank you for your order, ${user.name}!</h1>
    <p>Your order #${order._id} has been confirmed.</p>
    <h3>Order Summary:</h3>
    <ul>${itemsHtml}</ul>
    <p><strong>Subtotal:</strong> ₹${order.subTotal.toFixed(2)}</p>
    <p><strong>Delivery Fee:</strong> ₹${order.deliveryFee.toFixed(2)}</p>
    <p><strong>Total:</strong> ₹${order.totalAmount.toFixed(2)}</p>
    <p>It will be delivered to: ${order.deliveryAddress}</p>
    <p>Thank you for shopping with Suprabhat!</p>
  `;
};

const generateOrderStatusUpdateText = (order, user) => {
  return `Hi ${user.name}, your Suprabhat order #${order._id.toString().slice(-6)} status has been updated to: *${order.orderStatus}*.`;
};


// --- Main Notification Functions ---

/**
 * Sends an order confirmation notification via Email and WhatsApp.
 * @param {Order} order - The full order object.
 * @param {User} user - The user object, containing email and phone.
 */
const sendOrderConfirmation = async (order, user) => {
  // Fire and forget: We don't want to block the user's request if a notification fails.
  // In a production app, this is where you'd use a message queue (e.g., RabbitMQ, SQS).
  
  // Send Email
  emailService.sendEmail(
    user.email,
    `Suprabhat Order Confirmed: #${order._id}`,
    generateOrderConfirmationHtml(order, user)
  ).catch(err => console.error('Failed to send confirmation email:', err));

  // Send WhatsApp (assuming user.phone exists and is formatted correctly)
  if (user.phone) {
    const message = `Thank you for your order, ${user.name}! Your Suprabhat order #${order._id.toString().slice(-6)} for ₹${order.totalAmount.toFixed(2)} is confirmed. We'll notify you when it's on its way.`;
    whatsAppService.sendWhatsAppMessage(user.phone, message)
      .catch(err => console.error('Failed to send confirmation WhatsApp:', err));
  }
};

/**
 * Sends a notification when an order's status is updated.
 * @param {Order} order - The full order object.
 * @param {User} user - The user object.
 */
const sendOrderStatusUpdate = async (order, user) => {
  // Here, we might choose to only send a WhatsApp for quick updates.
  // Ensure user and phone exist for WhatsApp notification.
  if (user && user.phone) { 
    const message = generateOrderStatusUpdateText(order, user);
    whatsAppService.sendWhatsAppMessage(user.phone, message)
      .catch(err => console.error('Failed to send status update WhatsApp:', err));
  }
};


export const notificationService = {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
};