
---

# 🛡️ **GuardianLink: Smart Emergency Resource Allocation**

**GuardianLink** is a data-driven emergency response platform designed to bridge the gap between scattered community needs and available volunteer resources.

By leveraging **AI-powered data extraction** and **real-time mapping**, GuardianLink ensures that help reaches the **right place at the right time**.

---

## 🚀 **The Problem**

During local emergencies, critical information is often trapped in:

* Paper surveys
* Field reports
* Fragmented social media posts

This **data silo problem** makes it difficult for NGOs and volunteers to:

* Identify urgent geographical **hotspots**
* Match **specific needs** (medical, food, water) with the right volunteers

---

## ✨ **Our Solution**

GuardianLink creates a seamless pipeline from **Data Capture → Action**:

* 🤖 **AI-Powered Ingestion**
  Uses **Gemini API** to extract structured data from handwritten reports and unstructured text

* 🗺️ **Real-time Coordination**
  Flutter-based mobile app displaying live needs on **Google Maps**

* 🧠 **Smart Matching**
  Python backend intelligently assigns volunteers based on **location and resources**

---

## 🛠️ **Tech Stack**

| Component          | Technology                     |
| ------------------ | ------------------------------ |
| **Frontend**       | Flutter (Dart)                 |
| **Database**       | Supabase (PostgreSQL)          |
| **Authentication** | Supabase Auth                  |
| **File Storage**   | Supabase Storage               |
| **Real-time Sync** | Supabase Realtime              |
| **Matching Logic** | Python (Railway)               |
| **AI Extraction**  | Gemini API                     |
| **Maps & Geo**     | Google Maps Platform           |
| **Notifications**  | Firebase Cloud Messaging (FCM) |

---

## 🏗️ **Architecture Flow**

1. 📸 **Capture**
   Volunteer uploads a photo of a community survey using the Flutter app

2. 🤖 **Extract**
   Gemini API converts the image into structured **JSON data**

3. 💾 **Store**
   Data stored in **Supabase PostgreSQL**, images in storage

4. ⚙️ **Process**
   Python backend calculates priority & finds nearest volunteer

5. 🔔 **Alert**
   Volunteer receives notification via **FCM** with navigation details

---

## 🛠️ **Setup & Installation**

### 🔧 **Prerequisites**

* Flutter SDK
* Python 3.x
* Supabase Account & Project
* Google Cloud Project (Gemini + Maps API keys)

---

### ⚙️ **Backend Setup (Python / Railway)**

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:

```env
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
GEMINI_API_KEY=your_key
```

Deploy to **Railway**

---

### 📱 **Frontend Setup (Flutter)**

```bash
cd app
flutter pub get
flutter run
```

Add your API key:

* Android → `AndroidManifest.xml`
* iOS → `AppDelegate.swift`

---

## 🌍 **Impact**

GuardianLink aims to:

* ⏱️ Reduce emergency response time by **30–50%**
* 📊 Eliminate manual data entry
* 🚑 Optimize volunteer allocation

Supports **UN SDG 11 — Sustainable Cities and Communities**

---

## 📝 **License**

This project is licensed under the **MIT License**

---

# Steps to use this 

git clone https://github.com/zain22972/GuardianLink

cd GuardianLink

npm install

npm run dev
