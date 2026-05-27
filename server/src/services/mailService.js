import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

function hasSmtpConfig() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass)
}

export async function sendOtpEmail(email, otp) {
  if (!hasSmtpConfig()) {
    console.log(`\nDEV OTP for ${email}: ${otp}\n`)
    return
  }

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass
    }
  })

  await transporter.sendMail({
    from: env.smtp.from,
    to: email,
    subject: 'Код входа в Mood Calendar',
    text: `Ваш код входа: ${otp}. Код действует ${env.otpTtlMinutes} минут.`,
    html: `<p>Ваш код входа:</p><h2>${otp}</h2><p>Код действует ${env.otpTtlMinutes} минут.</p>`
  })
}
