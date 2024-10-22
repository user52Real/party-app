import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// export async function sendEmail(to: string, subject: string, text: string) {
//   const transporter = nodemailer.createTransport({
//     // Configure your email service here
//   });

//   await transporter.sendMail({
//     from: 'your-email@example.com',
//     to,
//     subject,
//     text,
//   });
// }
