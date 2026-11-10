# 🌿 AgroCare AI — AI-Powered Crop Doctor & Smart Recovery Platform

AgroCare AI is a modern agricultural diagnostic and rehabilitation platform designed for Indian smallholders and agronomists. It provides real-time crop disease detection using explainable computer vision (Grad-CAM), precision treatment planning, spray window recommendations, and continuous 14-day recovery monitoring.

---

## 🚀 Key Features

* **Instant Leaf Diagnosis:** Upload or capture leaf photos across 30+ Indian crops with instant pathogen identification and neural laser scanning animation.
* **Explainable AI (Grad-CAM):** Visual heatmaps and lesion bounding boxes highlighting where the deep learning model localized disease symptoms.
* **Micro-Climate Spray Advisory:** Real-time weather monitoring with dynamic spray suitability windows to minimize pesticide runoff and optimize application.
* **Integrated Pest Management (IPM):** 3-tier treatment recommendations:
  1. *Cultural & Mechanical Sanitation*
  2. *Biological & Organic Controls* (Trichoderma viride, cold-pressed Neem oil)
  3. *CIB&RC Registered Chemical Fungicides* with verified registration numbers
* **Sprayer Tank Dosage Calculator:** Calculates exact grams or milliliters required for 10L, 15L, 16L, and 20L backpack sprayers to prevent pesticide overdosing.
* **14-Day Recovery Monitoring:** Before-and-after photographic comparisons and lesion severity trajectory charts over 14 days.
* **AI Plant Doctor Chatbot:** Case-specific agricultural advisory with citations from ICAR and CIB&RC research.
* **Verified Local Agri-Dealer Locator:** Discover authorized nearby farm-input shops with live inventory and contact details.
* **Agronomist Triage Desk:** Expert dashboard for second opinions, diagnosis overrides, and verified prescription sign-offs.
* **Multilingual:** Supports English and Kannada (ಕನ್ನಡ).

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite
* **Styling:** Tailwind CSS, PostCSS
* **Routing:** React Router v6
* **Icons:** Lucide React
* **Data Visualization:** Recharts

---

## 💻 Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shravanbabu565-create/agrocare-ai.git
   cd agrocare-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://127.0.0.1:5173/
   ```

---

## 🎨 Color System

| Token | Hex | Usage |
| :--- | :--- | :--- |
| **Forest** | `#166534` | Primary brand green, buttons, headers |
| **Leaf** | `#22C55E` | Accent green, healthy status indicators |
| **Mint** | `#F0FDF4` | Soft backgrounds, active case containers |
| **Alert** | `#F59E0B` | Severity warnings, fungal risk alerts |
| **Slate** | `#0F172A` | Clean typography, dark elements |

---

## 📄 License
This project is open-source under the MIT License.
