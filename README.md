
# 🎉 Slotify — Event Booking Platform

Slotify is a full-stack event booking platform that allows users to browse vendors by category, make bookings, complete payments, and manage their profile — all with secure authentication and real-world integrations.

This project is built to mirror **production-grade workflows**, including authentication, email OTP verification, payments, and deployment.

---

## 🚀 Features

### 🔐 Authentication & Security

* User registration & login
* Email OTP verification (Gmail SMTP)
* JWT-based authentication
* Protected routes for authenticated users
* Secure environment variable handling

### 🗂️ Event & Vendor Management

* Category-based vendor listing
* Vendor pricing & rating display
* Fallback demo data for better UX

### 📅 Booking System

* Book vendors with custom details
* View all user bookings
* Booking status management

### 💳 Payments

* Razorpay integration (test mode)
* Backend order creation
* Secure payment verification
* Ready for live payments after Razorpay approval

### 👤 User Profile

* View user information
* Booking history
* Auth persistence across refresh

### 🌐 Deployment

* Backend deployed with environment-based config
* Frontend deployed separately
* Secure handling of secrets (no `.env` in repo)

---

## 🛠️ Tech Stack

### Frontend

* React
* Redux Toolkit (Auth & shared state)
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Nodemailer (OTP emails)
* Razorpay SDK

### Deployment & Tools

* Vercel (deployment & env vars)
* GitHub
* Gmail SMTP (App Passwords)

---

## 🧠 System Flow (High Level)

1. User registers → OTP sent via email
2. OTP verified → account activated
3. User logs in → JWT issued
4. User browses vendors by category
5. Booking created → payment initiated
6. Payment verified on backend
7. Booking marked as successful
8. User can view bookings & profile

---

## 🔑 Environment Variables

> ⚠️ **Do NOT commit `.env` files**

### Backend `.env` (example)

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=rzp_test_xxxx
```

All sensitive variables are configured in deployment environment settings (e.g., Vercel).

---

## 🧪 Payment Mode

Payments are currently running in **Razorpay Test Mode**:

* No real money involved
* Same security & verification logic as live mode
* Ready for live payments once Razorpay account approval is complete

---

## 📸 Screenshots / Demo

> *(Optional: add screenshots or a demo video link here)*

---

## 📦 Installation (Local Setup)

```bash
# Clone repository
git clone https://github.com/your-username/slotify.git

# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

---

## 📌 Project Status

✅ Core features complete
✅ Deployed & tested
🔄 Ready for enhancements (admin panel, live payments, availability calendar)

---

## 🧩 Key Learnings

* Full authentication lifecycle with OTP
* Secure backend payment verification
* Frontend–backend separation
* Environment variable management
* Debugging real deployment issues
* Building production-oriented workflows

---

## 📬 Contact

If you’d like to discuss this project or provide feedback, feel free to reach out.

---

### ⭐ If you like this project, consider giving it a star!

---

-by charan ❤️
* tailor this README for **internship vs full-time**
* rewrite it for **resume bullets**
* review it like a **hiring manager**

Just say the word.
