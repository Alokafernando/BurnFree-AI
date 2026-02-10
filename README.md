# 🔥 BurnFree AI – Intelligent Mental Wellness & Burnout Prevention Mobile App

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.81-blue" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-SDK%2054-black" alt="Expo"/>
  <img src="https://img.shields.io/badge/Firebase-Backend-orange" alt="Firebase"/>
  <img src="https://img.shields.io/badge/TypeScript-Enabled-blue" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Build-EAS-purple" alt="Build"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License"/>
</p>

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)  
2. [Features](#features)  
3. [Technologies Used](#technologies-used)  
4. [Project Structure](#project-structure)  
5. [Installation & Setup](#installation--setup)  
6. [Firebase Configuration](#firebase-configuration)  
7. [AI Functionality](#ai-functionality)  
8. [Future Enhancements](#future-enhancements)  
9. [Author](#author)  


---

## About the Project

**BurnFree AI** is a smart mobile application designed to help users monitor, analyze, and improve their mental well-being. The app allows users to track their **mood, stress levels, and sleep patterns** while providing **AI-driven insights** to guide them toward better emotional balance and burnout prevention.

The main goal of BurnFree AI is to provide **personalized analytics** for each user, helping them identify trends, understand their mental health patterns, and make informed decisions to reduce stress and improve productivity. The app is ideal for students and professionals seeking a simple yet effective tool to manage their mental health in daily life.

Key highlights include:
- Interactive dashboard for tracking mood, stress, and sleep
- Personalized insights and recommendations
- Secure user accounts with cloud storage
- AI-driven analysis for preventive mental health care

---

## Features

BurnFree AI offers a variety of features designed to help users monitor and improve their mental health effectively:

- 🧠 **Mood Tracking:** Record daily moods to identify emotional patterns over time.  
- 😌 **Stress Monitoring:** Track stress levels and detect periods of high tension.  
- 💤 **Sleep Pattern Recording:** Log sleep duration and quality to see its effect on mental well-being.  
- 📊 **Personalized Analytics:** AI-driven insights based on individual user data to highlight trends and areas for improvement.  
- 🔐 **Secure User Authentication:** Each user has a private account with data securely stored in Firebase.  
- 🌐 **Cloud Data Storage:** User data is safely stored in Firebase for accessibility across devices.  
- 🖥️ **Interactive Dashboard:** Visual charts and summaries make it easy to understand personal trends.  
- 🤖 **AI-Based Recommendations:** Receive actionable advice and tips for stress reduction and emotional balance.

---

## Technologies Used

BurnFree AI is built using modern mobile development tools and cloud technologies to provide a seamless and intelligent user experience:

**Frontend (Mobile App):**  
- **React Native** – Cross-platform mobile app development framework  
- **Expo** – Simplified development and deployment environment  
- **TypeScript** – Strongly-typed JavaScript for better code reliability
- **NativeWind** – Tailwind CSS utility classes for styling React Native components  

**Backend & Database:**  
- **Firebase Authentication** – Secure user login and registration  
- **Firebase Firestore** – Cloud database for storing user data and analytics  

**Other Libraries & Tools:**  
- **React Navigation** – Smooth screen navigation  
- **Vector Icons** – Custom icons for UI elements  
- **Animated API** – Smooth animations and transitions  
- **EAS Build** – For building production-ready apps  

---

## Project Structure

The BurnFree AI project is organized to separate features, components, and services for easy maintenance and scalability:

```
BurnFree-AI/
│
├── app/                           # Expo Router navigation (file-based routing)
│   ├── (auth)/                    # Authentication flow (Login, Register)
│   ├── (dashboard)/               # Main application screens
│   ├── _layout.tsx                # Root layout configuration
│   └── index.tsx                  # App entry point
│
├── assets/                        # Images, icons, and other media files
├── components/                    # Reusable UI components (buttons, cards, loaders)
├── config/                        # Cloudinary configuration 
├── hooks/                         # Custom React hooks
├── services/                      # Firebase configuration, API calls, helper functions
│
├── store/                         # Redux / Zustand store management
│   ├── index.ts                   # Store entry point
│   ├── slice/                     # Slice files for state management
|
├── types/                         # TypeScript types for store
│
├── App.tsx                        # Main entry point of the application
├── .gitignore                     # Git ignore configuration
├── app.json                       # Expo configuration
├── eas.json                       # EAS build settings
├── babel.config.js                # Babel configuration
├── eslint.config.js               # ESLint configuration
├── expo-env.d.ts                   # Expo TypeScript environment
├── global.css                      # Global styling
├── package.json                    # Project dependencies and scripts
└── README.md                       # Project README

└── package.json # Project dependencies and scripts
```

---

## Installation & Setup

Follow these steps to set up **BurnFree AI** locally on your machine for development:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/BurnFree-AI.git](https://github.com/Alokafernando/BurnFree-AI
```

### 2️⃣ Navigate to the Project Directory

```
cd BurnFree-AI
```

### 3️⃣ Install Dependencies

Make sure you have Node.js and npm installed.

```
npm install
```

###4️⃣ Configure Firebase and Cloudinary

 - Firebase and Cloudinary configuration files are located in the config/ and services/ folders.

 - Make sure your Firebase project credentials and Cloudinary API keys are correctly added there.

   
### 5️⃣ Run the Development Server

Start the Expo development server:

```
npx expo start
```

---

## Firebase Configuration

BurnFree AI uses **Firebase** for authentication, cloud storage, and real-time data management. Follow these steps to configure Firebase in your local setup:

### 1️⃣ Create a Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
- Enable **Firestore Database** and **Authentication**.

### 2️⃣ Enable Authentication
- Go to **Authentication → Sign-in Method**.
- Enable **Email/Password** login for user accounts.

### 3️⃣ Set Up Firestore Database
- Create a Firestore database in **production or test mode**.
- Add collections to store user data such as:
  - `users` → User profiles
  - `moodEntries` → Mood tracking data
  - `stressEntries` → Stress tracking data
  - `sleepEntries` → Sleep tracking data

### 4️⃣ Configure Firebase in the Project
- Open `services/firebase.ts` (or `services/firebase.js`).
- Replace the Firebase configuration with your project credentials:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---


## Contact

Creator and maintainer of **BurnFree AI**  

- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/your-profile)  
- GitHub: [Your GitHub Profile](https://github.com/your-username)  

This project was developed as part of academic and personal research in **Advanced Mobile Developer**.


