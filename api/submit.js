// File: api/submit.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // 1. Send confirmation to the user
    await resend.emails.send({
      from: 'VEco Team <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to the VEco Waitlist',
      html: `
        <div style="font-family: sans-serif; color: #0B3D2E;">
          <h1>You're on the list!</h1>
          <p>Thanks for joining the revolution, <strong>${role}</strong>.</p>
          <p>We will reveal the future on <strong>Jan 15, 2026</strong>.</p>
          <br>
          <p>Greener by every scan,<br>SK Reezaal Arafat</p>
        </div>
      `
    });

    // 2. Send notification to YOU
    await resend.emails.send({
      from: 'VEco Bot <onboarding@resend.dev>',
      to: 'reezaalarafat@gmail.com',
      subject: `New Signup: ${email}`,
      html: `<p><strong>New user:</strong> ${email}</p><p><strong>Role:</strong> ${role}</p>`
    });

    return res.status(200).json({ message: 'Success' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}