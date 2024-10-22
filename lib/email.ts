import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS, // SMTP password
  },
});

// Function to send an invitation email
export async function sendInvitationEmail(to: string, guestName: string, partyName: string) {
  try {
    const mailOptions = {
      from: '"Party Invitation" <no-reply@yourdomain.com>', // sender address
      to, // list of receivers
      subject: `You're Invited to ${partyName}!`, // Subject line
      text: `Hello ${guestName},\n\nYou are invited to ${partyName}. Please RSVP at your earliest convenience.\n\nBest regards,\nParty Organizer`, // plain text body
      html: `<p>Hello <strong>${guestName}</strong>,</p><p>You are invited to <strong>${partyName}</strong>. Please RSVP at your earliest convenience.</p><p>Best regards,<br/>Party Organizer</p>`, // HTML body
    };

    // Send email with defined transport object
    await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent to ${to}`);
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw new Error('Failed to send invitation email');
  }
}