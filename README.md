# 🌊 FloatChat — Oceanographic AI Intelligence Agent

> **Smart India Hackathon (SIH) Project**  
> An interactive AI-driven conversational agent and spatial visualization dashboard for analyzing real-time oceanographic ARGO float data across the Indian Ocean, Arabian Sea, and Bay of Bengal.

---

## 📌 Executive Summary

**FloatChat** bridges the gap between complex oceanographic data formats and actionable scientific insights. By unifying natural language processing (LLM parameter extraction) with direct API fetching through INCOIS / ERDDAP nodes (`argopy`, `xarray`, `pandas`), FloatChat enables marine scientists, researchers, and climate analysts to query subsurface ocean parameters effortlessly.

---

## ✨ Key Features

* 💬 **Natural Language AI Query Console**: Ask complex oceanographic questions (e.g., temperature/salinity profiles, thermal anomalies) using plain English.
* 🗺️ **Interactive Spatial Canvas**: Real-time trajectory mapping and interactive depth-profile plots built with dynamic data visualization libraries.
* ⚡ **Live ERDDAP Pipeline Integration**: Direct integration with INCOIS ERDDAP servers via a robust FastAPI proxy server.
* 🔍 **Transparent Execution Pipeline**: Transparent, step-by-step UI drawer demonstrating LLM entity extraction, query generation, and data processing metrics in real time.
* 🛡️ **Fail-Safe Offline Mode**: Intelligent fallback logic ensuring seamless UI responsiveness and continuous functionality even during server latencies.

---

## 🏗️ System Architecture

┌─────────────────────────┐         ┌───────────────────────────────┐
│ React / Vite Frontend   │  ────>  │ FastAPI Backend Server        │
│ (Tailwind CSS, Lucide)  │         │ (Python 3.11+, Uvicorn)       │
└───────────┬─────────────┘         └───────────────┬───────────────┘
│                                       │
│ HTTP / REST                           │ Real-Time Fetching
▼                                       ▼
┌─────────────────────────┐         ┌───────────────────────────────┐
│ Execution Pipeline UI   │         │ ERDDAP Data Node / argopy     │
│ (Live Process Drawer)   │         │ (INCOIS Data Processing)      │
└─────────────────────────┘         └───────────────────────────────┘


---

## 🛠️ Tech Stack & Dependencies

### Frontend
* **Framework:** React 18 with Vite & TypeScript
* **Styling:** Tailwind CSS (Custom Dark Glassmorphic Theme)
* **Icons:** Lucide React

### Backend
* **API Framework:** FastAPI with Uvicorn ASGI server
* **Oceanographic Libraries:** `argopy` (pinned `erddapy==2.2.4`), `xarray`, `pandas`, `numpy`

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0 or higher
* **Python**: v3.10 or higher
* **Git**: Installed on your local system

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn argopy erddapy==2.2.4 xarray pandas

# Launch FastAPI application server
uvicorn main:app --reload --port 8000

# 2. Frontend Setup
# Navigate to the project directory
cd project

# Install dependencies
npm install

# Start Vite development server
npm run dev


