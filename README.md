# Knowledge-Based FAQ Generator

An AI-powered web application that generates FAQs from uploaded documents and provides intelligent document-based and general-purpose chatbot interactions using Large Language Models (LLMs).

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

---

##  Description

Knowledge-Based FAQ Generator is a full-stack AI application designed to help users quickly extract information from documents and interact with it through natural language conversations. Users can upload PDF, DOCX, TXT, or Markdown files and ask questions related to the content.

The system combines FastAPI, React, Firebase Authentication, and OpenRouter AI models to provide document-based question answering and ChatGPT-style general conversations. This project is ideal for educational institutions, organizations, customer support systems, and knowledge management platforms.

### Key Features

* **AI-Powered FAQ Generation** – Automatically generates answers from uploaded documents.
* **Document Question Answering** – Ask questions directly about uploaded files.
* **General AI Chatbot** – Supports natural conversations like ChatGPT.
* **Firebase Authentication** – Secure Email/Password and Google Sign-In.
* **Multi-Format Support** – PDF, DOCX, TXT, and Markdown files.
* **Chat History Management** – Stores separate conversation history for each user.

### Live Demo

Frontend:
https://knowledge-based-faq-generator.vercel.app

Backend API:
https://knowledge-based-faq-generator.onrender.com

---

## 🗺️ Table of Contents

* [Features](#-features)
* [Technology Stack](#-technology-stack)
* [Directory Structure](#-directory-structure)
* [Getting Started](#-getting-started)
* [Usage](#-usage)
* [System Workflow](#-system-workflow)
* [Future Enhancements](#-future-enhancements)
* [Contributing](#-contributing)
* [License](#-license)

---

#  Features

### User Authentication

* Email & Password Login
* Google Sign-In
* Firebase Authentication

### Document Processing

* Upload PDF Files
* Upload DOCX Files
* Upload TXT Files
* Upload Markdown Files

### AI Chatbot

* ChatGPT-like Conversations
* General Knowledge Questions
* Document-Based Question Answering

### Chat History

* User-Specific History
* Load Previous Conversations
* Local Storage Support

### Deployment

* Frontend Hosted on Vercel
* Backend Hosted on Render

---

#  Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* React Icons

## Backend

* FastAPI
* Python
* Uvicorn
* HTTPX
* Pydantic

## AI Integration

* OpenRouter API
* GPT Models
* Large Language Models (LLMs)

## Authentication

* Firebase Authentication
* Google OAuth

## Database

* SQLite

---

##  Directory Structure

```text
knowledge-based-faq-generator/

├── backend/
│
│   ├── app/
│   │
│   │   ├── routes/
│   │   │   ├── chatbot_routes.py
│   │   │   ├── faq_routes.py
│   │   │   └── auth_routes.py
│   │
│   │   ├── services/
│   │   │   ├── openrouter_service.py
│   │   │   ├── faq_service.py
│   │   │   └── document_service.py
│   │
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│
│   ├── public/
│   │
│   ├── src/
│   │
│   │   ├── assets/
│   │
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── FAQBox.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── UploadMenu.jsx
│   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Chatbot.jsx
│   │
│   │   ├── services/
│   │   │   └── api.js
│   │
│   │   ├── firebase.js
│   │   ├── App.jsx
│   │   └── main.jsx
│
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── README.md
```

---

##  Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Required software:

* Python 3.10+
* Node.js 18+
* npm
* Firebase Project
* OpenRouter API Key

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/LakshmiPrasanna152/knowledge-based-faq-generator.git

cd knowledge-based-faq-generator
```

### 2. Backend Setup

```bash
cd backend

pip install -r requirements.txt
```



Run Backend

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

---

### 3. Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://127.0.0.1:8000
```

Run Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 💻 Usage

### User Registration

1. Open application.
2. Create an account.
3. Login using Email/Password or Google.

### Upload Document

1. Open Chatbot.
2. Click Upload File.
3. Select PDF, DOCX, TXT, or MD file.
4. Ask questions about the document.

### General AI Chat

Example:

```text
User: Hi

AI: Hello! How can I assist you today?
```

Example:

```text
User: What is Python?

AI: Python is a high-level programming language known for its readability and simplicity.
```

---

# 🔄 System Workflow

```text
User
  |
  ▼
Frontend (React)
  |
  ▼
FastAPI Backend
  |
  ├── File Upload Processing
  │
  ├── PDF/DOCX/TXT Extraction
  │
  ▼
OpenRouter API
  |
  ▼
AI Response Generation
  |
  ▼
Frontend Chat Interface
```

---

# Future Enhancements

* Voice Assistant Integration
* Multi-Language Support
* Vector Database Integration
* Retrieval-Augmented Generation (RAG)
* Advanced Search Functionality
* Admin Dashboard
* Real-Time Collaboration
* Cloud Storage Integration

---

##  Contributing

Contributions are welcome and appreciated.

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature/NewFeature
```

3. Commit changes.

```bash
git commit -m "Added New Feature"
```

4. Push changes.

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request.

---

##  License

Distributed under the MIT License.

See the LICENSE file for more information.

---
Contact / Support  

For questions, bug reports, feature requests, or collaboration opportunities:

Developer

 Lakshmi Prasanna

Email: pujarilakshmiprasanna152@gmail.com

GitHub Profile:

https://github.com/LakshmiPrasanna152

Project Repository:

https://github.com/LakshmiPrasanna152/knowledge-based-faq-generator
Report Issues

If you encounter a bug or want to request a feature, please open an issue:

https://github.com/LakshmiPrasanna152/knowledge-based-faq-generator/issues
