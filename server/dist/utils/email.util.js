"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendStatusUpdateEmail = exports.sendAssignmentEmail = exports.sendServiceRequestCreatedEmail = exports.sendTicketCreatedEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'noreply@ticketing.com',
            to,
            subject,
            html,
        });
        console.log(`✅ Email sent to ${to}`);
    }
    catch (error) {
        console.error('❌ Email sending failed:', error);
    }
};
exports.sendEmail = sendEmail;
const sendTicketCreatedEmail = async (ticket, user) => {
    const subject = `Ticket Created: ${ticket.ticketId}`;
    const html = `
    <h2>Ticket Created Successfully</h2>
    <p>Dear ${user.name},</p>
    <p>Your ticket has been created with the following details:</p>
    <ul>
      <li><strong>Ticket ID:</strong> ${ticket.ticketId}</li>
      <li><strong>Type:</strong> ${ticket.type}</li>
      <li><strong>Category:</strong> ${ticket.category}</li>
      <li><strong>Priority:</strong> ${ticket.priority}</li>
      <li><strong>Status:</strong> ${ticket.status}</li>
    </ul>
    <p><strong>Description:</strong> ${ticket.description}</p>
    <p>We will update you on the progress.</p>
    <br>
    <p>Best regards,<br>IT Support Team</p>
  `;
    await (0, exports.sendEmail)(user.email, subject, html);
};
exports.sendTicketCreatedEmail = sendTicketCreatedEmail;
const sendServiceRequestCreatedEmail = async (request, user) => {
    const subject = `Service Request Created: ${request.requestId}`;
    const html = `
    <h2>Service Request Created Successfully</h2>
    <p>Dear ${user.name},</p>
    <p>Your service request has been created with the following details:</p>
    <ul>
      <li><strong>Request ID:</strong> ${request.requestId}</li>
      <li><strong>Service Type:</strong> ${request.serviceType}</li>
      <li><strong>Date:</strong> ${new Date(request.dateFrom).toLocaleDateString()} - ${new Date(request.dateTo).toLocaleDateString()}</li>
      <li><strong>Priority:</strong> ${request.priority}</li>
      <li><strong>Status:</strong> ${request.status}</li>
    </ul>
    <p><strong>Description:</strong> ${request.description}</p>
    <p>We will review your request and get back to you soon.</p>
    <br>
    <p>Best regards,<br>IT Support Team</p>
  `;
    await (0, exports.sendEmail)(user.email, subject, html);
};
exports.sendServiceRequestCreatedEmail = sendServiceRequestCreatedEmail;
const sendAssignmentEmail = async (ticketId, agent, type) => {
    const subject = `New ${type === 'ticket' ? 'Ticket' : 'Service Request'} Assigned: ${ticketId}`;
    const html = `
    <h2>New ${type === 'ticket' ? 'Ticket' : 'Service Request'} Assigned</h2>
    <p>Dear ${agent.name},</p>
    <p>A new ${type === 'ticket' ? 'ticket' : 'service request'} has been assigned to you:</p>
    <p><strong>ID:</strong> ${ticketId}</p>
    <p>Please review and take necessary action.</p>
    <br>
    <p>Best regards,<br>IT Support Team</p>
  `;
    await (0, exports.sendEmail)(agent.email, subject, html);
};
exports.sendAssignmentEmail = sendAssignmentEmail;
const sendStatusUpdateEmail = async (ticketId, newStatus, user, type) => {
    const subject = `${type === 'ticket' ? 'Ticket' : 'Service Request'} Status Updated: ${ticketId}`;
    const html = `
    <h2>Status Updated</h2>
    <p>Dear ${user.name},</p>
    <p>The status of your ${type === 'ticket' ? 'ticket' : 'service request'} <strong>${ticketId}</strong> has been updated to:</p>
    <p><strong>${newStatus}</strong></p>
    <br>
    <p>Best regards,<br>IT Support Team</p>
  `;
    await (0, exports.sendEmail)(user.email, subject, html);
};
exports.sendStatusUpdateEmail = sendStatusUpdateEmail;
//# sourceMappingURL=email.util.js.map