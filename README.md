
# TempMail Haven - Free Temporary Email Service

A free temporary email web application built with React, TypeScript, and Tailwind CSS. This application allows users to generate temporary email addresses and receive emails without exposing their personal email accounts.

## Features

- Generate random temporary email addresses
- View incoming emails in real-time
- Copy email address to clipboard
- Auto-refresh inbox every 15 seconds
- Clean, responsive UI
- No registration required
- View HTML and plain text emails

## How It Works

This application uses the free Mail.gw API service to create disposable email addresses. All data is stored in the browser's local storage and deleted when the session ends.

## Technical Details

- Built with React and TypeScript
- Styled with Tailwind CSS and shadcn/ui components
- Uses browser local storage for session management
- Fetches emails using the Mail.gw API
- Responsive design for all screen sizes

## Privacy & Security

- No personal data is collected
- Email addresses automatically expire
- All data is stored locally in your browser
- No account creation required

## Usage Limitations

- Email addresses are temporary and will expire
- Can only receive emails, not send them
- Attachments cannot be downloaded
- Some email services may block emails to temporary domains

## Disclaimer

This service is intended for legitimate privacy purposes only. Please do not use it for spam or illegal activities.
