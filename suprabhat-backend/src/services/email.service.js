// In a real application, you would use a library like nodemailer or an SDK from your email provider.
// For now, we will create a stub that logs to the console.

/**
 * Sends an email.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML body of the email.
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, html) => {
  console.log('--- 📧 Sending Email ---');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log('Body:');
  console.log(html);
  console.log('----------------------');
  
  // In a real implementation, you'd have:
  // const transport = nodemailer.createTransport(...);
  // await transport.sendMail({ from: config.email.from, to, subject, html });
  
  // Simulate a successful send
  return Promise.resolve();
};

export const emailService = {
  sendEmail,
};