# Feedback Collector System 🚀

**Live Demo**: [https://ffeedback.netlify.app/](https://ffeedback.netlify.app/)

A professional and modern platform to collect, analyze, and respond to feedback in real-time — powered by Firebase, Netlify Functions, and Gemini AI.

---
---
![image](https://github.com/user-attachments/assets/0ca52742-016c-4fbb-8a5c-9fa8bd8478f2)

## 🔐 Login Credentials (For Admin Testing)

Use the following credentials to log in as admin:

```
Email: admin@gmail.com
Password: admin123
```
![image](https://github.com/user-attachments/assets/6a01a96c-0de2-4c23-bef2-7fb7cd2d080d)

## ✨ Features

- **Real-Time Feedback Display** 📋
- **Smart Email Reply System** ✉️ (Integrated with EmailJS)
- **Dark / Light Theme Toggle** 🌗
- **AI-Powered Sentiment Analysis** 😃😐😠
- **Sentiment Pie Chart Analytics** 📊 (Visual chart of positive & negative feedbacks)
- **Responsive Carousel UI** 📱
- **Admin AI Assistant** 🤖 (Gemini AI to summarize insights)
- **Fully Responsive Design** ✅

---

## 📊 Sentiment Analysis Pie Chart

Easily visualize the overall sentiment with an auto-generated pie chart:

- Green: **Positive Feedbacks** ✅
- Red: **Negative Feedbacks** ❌

These are determined using Gemini AI and update dynamically with feedback entries.

---

## 🧠 How the AI Assistant Works

The AI assistant helps the admin get quick summaries:

- Auto-summarizes feedback trends
- Suggests actions
- Uses Gemini API to process feedbacks

💬 Just type your query and let the AI answer. For example:

```plaintext
"What are the most common concerns this week?"
```

---
![image](https://github.com/user-attachments/assets/49e01b4b-c273-4c02-b341-3e8fa84ae05c)

![image](https://github.com/user-attachments/assets/9bdc1ee1-5ab0-4303-8478-a473dda574c2)


## 📮 Email Feature Flow

### Step 1: Click on "Reply →"

```html
<button class="reply-button">Reply →</button>
```

### Step 2: Compose your message

- Pre-filled recipient email 🧑
- Subject line and message 📝
- Click **Send** 📤

### Step 3: Sent via EmailJS

```js
emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', '#email-form', 'USER_ID')
  .then(() => alert('Email sent! 🎉'))
  .catch(() => alert('Failed to send! ❌'));
```



---

## 🧰 Tech Stack

### Frontend
- HTML5 / CSS3 / JS (ES6+)
- React
- EmailJS (for email delivery)
- Chart.js (for analytics dashboard)
- -rechart.js

### Backend
- Firebase Firestore (Realtime database)
- Netlify Functions (for AI + email handling)
- Gemini AI API (for summarization and sentiment)

---

## ⚙️ Setup & Run Locally

```bash
git clone https://github.com/yourusername/feedback-collector.git
cd feedback-collector
npm install
```

### 🔑 Add Environment Variables
Create a `.env` file with:

```env
# .env.local
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID= 
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_SENDER_ID= 
VITE_FIREBASE_APP_ID=1:918033905563:
VITE_FIREBASE_MEASUREMENT_ID=
VITE_GEMINI_API_KEY
GEMINI_API_KEY=
REPLY_EMAIL=....
REPLY_PASSWORD=... .... ...
NODE_VERSION = 18
```

### 🚀 Start Dev Server

```bash
netlify dev
```

---

## 🌍 Deployment

Automatically deployed via **Netlify**

- Main branch → Production build
- Netlify functions (for email + AI) are in `netlify/functions`

---

## 🤝 Contributing

- Fork this repo
- Create a new branch: `git checkout -b feature/your-feature`
- Commit & Push
- Submit a Pull Request 🚀

---

## 📜 License

MIT License © K.Saketh

For help, contact: saketh1607@gmail.com

