# Complete Forgot Password Application

Full-stack MERN application with forgot password functionality, rate limiting, and password generator.

## Features

✅ User Registration & Login
✅ Forgot Password with Email/Phone
✅ Rate Limiting - 1 request per day
✅ Random Password Generator (only uppercase & lowercase letters)
✅ Email & SMS Integration
✅ MongoDB Database
✅ Modern React UI
✅ Complete Authentication System

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Nodemailer (Email)
- Twilio (SMS)
- bcryptjs (Password Hashing)

**Frontend:**
- React 18
- React Router v6
- Axios
- CSS3

## Installation

### 1. Clone & Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Setup Environment Variables

Create `.env` file in root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/forgot-password-db

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. Setup MongoDB

```bash
# Install MongoDB locally or use MongoDB Atlas
# Make sure MongoDB is running on localhost:27017
```

### 4. Run Application

```bash
# Run backend (from root)
npm run dev

# Run frontend (in new terminal)
cd client
npm start
```

Backend: http://localhost:5000
Frontend: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Password Reset
- `POST /api/forgot-password` - Request password reset

## Project Structure

```
forgot-password-app/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── ForgotPassword.js
│       │   └── Dashboard.js
│       ├── App.js
│       └── index.js
├── config/
│   └── database.js        # MongoDB connection
├── controllers/
│   ├── authController.js
│   └── forgotPasswordController.js
├── models/
│   ├── User.js
│   └── PasswordReset.js
├── routes/
│   ├── authRoutes.js
│   └── forgotPasswordRoutes.js
├── utils/
│   ├── passwordGenerator.js
│   ├── emailService.js
│   └── smsService.js
├── server.js
├── package.json
└── .env.example
```

## How It Works

### Password Reset Flow

1. User enters email/phone on forgot password page
2. System checks if user exists
3. System checks if user already requested reset in last 24 hours
4. If allowed, generates random password (only letters, mixed case)
5. Updates password in database (hashed)
6. Sends new password via email or SMS
7. Records reset attempt with timestamp

### Rate Limiting

- Users can request password reset only once per 24 hours
- Attempts are tracked in `PasswordReset` collection
- Warning message shown if trying again within 24 hours

### Password Generator

- Generates 12-character passwords
- Only uppercase (A-Z) and lowercase (a-z) letters
- No numbers or special characters
- Ensures at least 1 uppercase and 1 lowercase
- Randomly shuffled for security

## Email Setup (Gmail)

1. Enable 2-Factor Authentication in Gmail
2. Generate App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App Passwords
   - Generate password for "Mail"
3. Use generated password in `.env` as `EMAIL_PASSWORD`

## SMS Setup (Twilio)

1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Get a Twilio phone number
4. Add credentials to `.env`

## Security Notes

- Passwords are hashed using bcryptjs
- Reset attempts tracked in database
- Rate limiting prevents abuse
- Environment variables for sensitive data
- CORS enabled for frontend-backend communication

## Production Deployment

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for database
3. Configure production email/SMS services
4. Build React app: `cd client && npm run build`
5. Serve static files from Express
6. Use HTTPS
7. Add proper error logging
8. Implement additional security measures

## Future Enhancements

- Email/Phone verification before reset
- OTP-based verification
- Password strength requirements
- Account lockout after multiple failed attempts
- Admin dashboard
- Audit logs
- Multi-language support

## License

MIT
