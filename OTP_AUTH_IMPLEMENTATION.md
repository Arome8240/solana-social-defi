# Passwordless OTP Authentication - Complete ✅

## Overview

The authentication system has been completely redesigned to use **passwordless OTP (One-Time Password)** authentication instead of traditional password-based auth.

## Key Changes

### 1. User Model Updates

- **Removed**: `passwordHash` field
- **Added**:
  - `fullName` - User's full name (required)
  - `bio` - Optional user biography (max 500 chars)
  - `emailVerified` - Boolean flag for email verification status

### 2. New OTP Model

Created `apps/api/src/models/OTP.ts` with:

- `email` - User's email address
- `code` - 6-digit OTP code
- `expiresAt` - Expiration timestamp (10 minutes)
- `verified` - Verification status
- `attempts` - Failed attempt counter (max 5)
- Auto-deletion after expiration

### 3. Email Service

Created `apps/api/src/services/emailService.ts`:

- Sends OTP codes via email
- Development mode: Logs OTP to console
- Production ready: Integrate with SendGrid, AWS SES, Mailgun, or Resend

## Authentication Flow

### Signup Flow (3 Steps)

#### Step 1: Check Username Availability

```http
POST /api/auth/check-username
Content-Type: application/json

{
  "username": "johndoe"
}
```

Response:

```json
{
  "message": "Username available",
  "available": true
}
```

#### Step 2: Send OTP to Email

```http
POST /api/auth/signup/send-otp
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "bio": "Crypto enthusiast", // optional
  "email": "john@example.com"
}
```

Response:

```json
{
  "message": "OTP sent to your email",
  "email": "john@example.com"
}
```

The user receives a 6-digit OTP code via email (in development, check console logs).

#### Step 3: Verify OTP and Complete Signup

```http
POST /api/auth/signup/verify-otp
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "bio": "Crypto enthusiast",
  "email": "john@example.com",
  "code": "123456"
}
```

Response:

```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "bio": "Crypto enthusiast",
    "role": "user",
    "walletAddress": "...",
    "emailVerified": true,
    "biometricEnabled": false,
    "balances": {
      "skr": 100,
      "sol": 0.1
    }
  }
}
```

New users receive:

- 100 SKR tokens (welcome bonus)
- 0.1 SOL (for gas fees)
- Auto-generated Solana wallet

### Login Flow (2 Steps)

#### Step 1: Send OTP to Email

```http
POST /api/auth/login/send-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

Response:

```json
{
  "message": "OTP sent to your email",
  "email": "john@example.com"
}
```

#### Step 2: Verify OTP and Login

```http
POST /api/auth/login/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "bio": "Crypto enthusiast",
    "role": "user",
    "walletAddress": "...",
    "emailVerified": true,
    "biometricEnabled": false,
    "balances": {
      "skr": 100,
      "sol": 0.1
    }
  }
}
```

## OTP Security Features

### 1. Expiration

- OTPs expire after **10 minutes**
- Expired OTPs are automatically deleted from database

### 2. Rate Limiting

- Strict rate limiting on OTP endpoints (5 requests per 15 minutes)
- Prevents spam and abuse

### 3. Attempt Limiting

- Maximum **5 verification attempts** per OTP
- After 5 failed attempts, OTP is deleted and user must request a new one

### 4. Single Use

- OTPs are marked as `verified` after successful use
- Verified OTPs cannot be reused
- OTPs are deleted after successful verification

### 5. Email Uniqueness

- Only one active OTP per email at a time
- New OTP request deletes previous OTP for that email

## API Endpoints

### Authentication

- `POST /api/auth/check-username` - Check username availability
- `POST /api/auth/signup/send-otp` - Send OTP for signup
- `POST /api/auth/signup/verify-otp` - Verify OTP and create account
- `POST /api/auth/login/send-otp` - Send OTP for login
- `POST /api/auth/login/verify-otp` - Verify OTP and login
- `PATCH /api/auth/biometric` - Toggle biometric auth (requires JWT)
- `POST /api/auth/export-private-key` - Export wallet key (requires OTP)
- `GET /api/auth/wallet` - Get wallet info (requires JWT)

## Development Testing

### View OTP Codes in Console

In development mode, OTP codes are logged to the console:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 OTP Email (Development Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To: john@example.com
Subject: Your Verification Code

Your verification code is: 123456

This code will expire in 10 minutes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Test Accounts

After running `npm run seed`, use these test accounts:

| Email               | Role    | SKR  | SOL |
| ------------------- | ------- | ---- | --- |
| dev@arome.com       | admin   | 1000 | 10  |
| alice@example.com   | creator | 500  | 5   |
| bob@example.com     | user    | 250  | 2.5 |
| charlie@example.com | user    | 750  | 7.5 |
| diana@example.com   | creator | 600  | 6   |

To login:

1. Send OTP: `POST /api/auth/login/send-otp` with email
2. Check console for OTP code
3. Verify: `POST /api/auth/login/verify-otp` with email and code

## Production Setup

### Email Service Integration

Update `apps/api/src/services/emailService.ts` to integrate with your email provider:

#### Option 1: SendGrid

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async sendOTP(email: string, code: string): Promise<void> {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<strong>Your verification code is: ${code}</strong>`,
  };

  await sgMail.send(msg);
}
```

#### Option 2: AWS SES

```typescript
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: process.env.AWS_REGION });

async sendOTP(email: string, code: string): Promise<void> {
  const command = new SendEmailCommand({
    Source: process.env.FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Your Verification Code" },
      Body: { Text: { Data: `Your verification code is: ${code}` } },
    },
  });

  await sesClient.send(command);
}
```

#### Option 3: Resend (Recommended)

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async sendOTP(email: string, code: string): Promise<void> {
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: email,
    subject: 'Your Verification Code',
    html: `<strong>Your verification code is: ${code}</strong>`,
  });
}
```

### Environment Variables

Add to `.env`:

```env
# Email Service (choose one)
SENDGRID_API_KEY=your-sendgrid-key
# or
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
# or
RESEND_API_KEY=your-resend-key

FROM_EMAIL=noreply@yourdomain.com
```

## Mobile App Integration

### Update API Client

Update `apps/mobile-app/lib/api.ts`:

```typescript
// Signup Step 1: Check username
export const checkUsername = async (username: string) => {
  const response = await api.post("/auth/check-username", { username });
  return response.data;
};

// Signup Step 2: Send OTP
export const signupSendOTP = async (data: {
  fullName: string;
  username: string;
  bio?: string;
  email: string;
}) => {
  const response = await api.post("/auth/signup/send-otp", data);
  return response.data;
};

// Signup Step 3: Verify OTP
export const signupVerifyOTP = async (data: {
  fullName: string;
  username: string;
  bio?: string;
  email: string;
  code: string;
}) => {
  const response = await api.post("/auth/signup/verify-otp", data);
  return response.data;
};

// Login Step 1: Send OTP
export const loginSendOTP = async (email: string) => {
  const response = await api.post("/auth/login/send-otp", { email });
  return response.data;
};

// Login Step 2: Verify OTP
export const loginVerifyOTP = async (email: string, code: string) => {
  const response = await api.post("/auth/login/verify-otp", { email, code });
  return response.data;
};
```

### Update Auth Screens

You'll need to create/update these screens:

1. `apps/mobile-app/app/(auth)/signup-step1.tsx` - Full name, username, bio
2. `apps/mobile-app/app/(auth)/signup-step2.tsx` - Email input
3. `apps/mobile-app/app/(auth)/signup-step3.tsx` - OTP verification
4. `apps/mobile-app/app/(auth)/login-email.tsx` - Email input
5. `apps/mobile-app/app/(auth)/login-otp.tsx` - OTP verification

## Benefits of Passwordless Auth

1. **Better Security**: No password storage, no password leaks
2. **Better UX**: No password to remember or reset
3. **Faster Onboarding**: Simpler signup process
4. **Email Verification**: Built-in email verification
5. **Modern**: Follows current best practices (used by Slack, Medium, etc.)

## Migration from Password-Based Auth

If you have existing users with passwords, you can:

1. Keep the old password-based endpoints temporarily
2. Add a migration endpoint that converts password users to OTP
3. Send migration emails to existing users
4. Deprecate password endpoints after migration period

## Files Modified

1. `apps/api/src/models/User.ts` - Removed passwordHash, added fullName, bio, emailVerified
2. `apps/api/src/models/OTP.ts` - New OTP model
3. `apps/api/src/controllers/authController.ts` - Complete rewrite for OTP auth
4. `apps/api/src/routes/authRoutes.ts` - Updated routes for OTP flow
5. `apps/api/src/services/emailService.ts` - New email service
6. `apps/api/src/scripts/seedData.ts` - Updated for passwordless users
7. `apps/api/src/scripts/quickSeed.ts` - Updated for passwordless users

## Next Steps

1. Update mobile app auth screens for 3-step signup
2. Integrate production email service (SendGrid/SES/Resend)
3. Design OTP input UI component
4. Add resend OTP functionality
5. Add OTP cooldown timer in UI
6. Test complete auth flow end-to-end
