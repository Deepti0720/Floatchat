# 🌊 FloatChat

### Natural Language Interface for Real-Time ARGO Oceanographic Data

FloatChat is an AI-powered conversational interface that allows users to explore **real-time and historical oceanographic data from ARGO floats using natural language**.

Instead of requiring users to understand complex oceanographic datasets, API parameters, coordinates, or data formats, FloatChat lets them simply ask questions such as:

> **"Show me ocean temperature near Mumbai."**

> **"What was the salinity at 500m depth?"**

> **"Track float 6902746."**

FloatChat interprets the user's intent, extracts the required parameters, retrieves the relevant data directly from oceanographic data servers, and presents the results in an understandable format.

---

## 🚨 Problem

Oceanographic datasets contain enormous amounts of valuable information about the world's oceans, but accessing and interpreting this data can be difficult.

Users often need to understand:

* Float IDs and metadata
* Latitude and longitude coordinates
* Depth levels
* Time ranges
* Oceanographic parameters
* Scientific data formats
* Specialized APIs and data services

This creates a barrier for researchers, students, policymakers, and other users who want to obtain ocean insights without dealing with the underlying technical complexity.

### FloatChat solves this by providing a conversational interface over live ARGO data.

---

# 💡 Solution

FloatChat acts as an intelligent bridge between **natural language queries** and **oceanographic data services**.

The user does not need to manually construct API requests.

Instead:

```text
User Query
    ↓
LLM / Intent Parser
    ↓
Extract Parameters
    ↓
FastAPI Backend
    ↓
argopy + xarray
    ↓
INCOIS ERDDAP / ARGO Data
    ↓
Process & Structure Data
    ↓
Visualization / Natural Language Response
```

For example:

```text
"Show me the temperature near Mumbai
between January and March 2026 at 500m depth"
```

is converted into structured parameters such as:

```text
Parameter: Temperature
Location: Mumbai region
Time Range: January–March 2026
Depth: 500m
```

The backend then uses these parameters to retrieve the relevant ARGO observations.

---

# 🧠 Does FloatChat Train an ML Model?

**No.**

FloatChat does **not train a machine-learning model from scratch on a static dataset.**

Instead, it uses:

### Natural Language Intent Parsing + Real-Time Data Retrieval

The LLM is used primarily to understand the user's request and extract the parameters required for a data query.

The actual oceanographic observations are retrieved dynamically from ARGO data services.

This approach avoids relying on a static CSV dataset that can quickly become outdated.

---

# 🌊 Data Source

FloatChat works with **ARGO float observations**, including data from the Indian Ocean.

### Primary Data Provider

**INCOIS — Indian National Centre for Ocean Information Services**

INCOIS operates under the **Ministry of Earth Sciences, Government of India**, and provides access to oceanographic datasets and services.

FloatChat accesses ARGO observations through:

* **INCOIS ERDDAP services**
* **Global Data Assembly Centre (GDAC)** infrastructure

### ARGO Data

ARGO is a global network of autonomous profiling floats that collect measurements throughout the world's oceans.

The data used by FloatChat can include:

| Parameter    | Description                      |
| ------------ | -------------------------------- |
| Temperature  | Subsurface seawater temperature  |
| Salinity     | Seawater salinity                |
| Pressure     | Pressure/depth measurements      |
| Latitude     | Float geographic position        |
| Longitude    | Float geographic position        |
| Time         | Observation/profile timestamp    |
| WMO Float ID | Unique identifier for each float |

ARGO floats can profile the ocean down to approximately **2000 metres**.

---

# 🆔 Float Identification

Each ARGO float is identified using a unique **7-digit WMO Float ID**.

Example:

```text
6902746
```

Users can directly query a specific float using its WMO ID.

Example:

```text
"Show me the latest observations from float 6902746."
```

---

# 🤖 AI Architecture

FloatChat uses an LLM as an **intent and parameter extraction layer**, rather than as a model that predicts oceanographic measurements.

### Example

User:

```text
"Show temperature near Mumbai at 500 metres."
```

The LLM identifies:

```json
{
  "parameter": "temperature",
  "location": "Mumbai",
  "depth": 500
}
```

The backend then converts these parameters into a data retrieval request.

### Important distinction

```text
LLM
↓
Understands what the user wants

ARGO Data Server
↓
Provides the actual scientific observations
```

The LLM does **not invent or generate the ocean measurements**.

---

# ⚙️ Technology Stack

## Frontend

The frontend provides the conversational interface through which users interact with FloatChat.

Possible components include:

* React / Next.js
* Interactive charts
* Maps
* Data tables
* Conversational UI

## Backend

### FastAPI

FastAPI handles:

* User requests
* Query processing
* API endpoints
* Intent extraction
* Data retrieval
* Response formatting

## Ocean Data Processing

### argopy

`argopy` provides Python tools for accessing and working with ARGO datasets.

It helps translate data requirements into ARGO data retrieval operations.

### xarray

`xarray` is used for working with multidimensional scientific datasets.

It is particularly useful for handling dimensions such as:

```text
Time × Depth × Latitude × Longitude
```

---

# 🔄 End-to-End Workflow

### 1. User asks a question

```text
"Show me the temperature profile near Mumbai."
```

### 2. Intent extraction

The LLM identifies the important information:

```text
Parameter → Temperature
Location → Mumbai
Depth → Profile
```

### 3. Backend processing

The FastAPI backend validates and converts these parameters into a structured query.

### 4. ARGO data retrieval

The backend uses:

```text
argopy
    ↓
ARGO data services
    ↓
INCOIS / GDAC
```

to retrieve the relevant observations.

### 5. Data processing

The returned dataset is processed using tools such as:

```text
xarray
Python
```

### 6. Visualization

The results can be displayed as:

* Temperature-depth profiles
* Salinity-depth profiles
* Float trajectories
* Geographic maps
* Time-series graphs
* Data tables

### 7. Natural-language response

FloatChat presents the result in a user-friendly format rather than exposing raw scientific data structures.

---

# 🗺️ Example Queries

Users can ask questions such as:

```text
Show me ocean temperature near Mumbai.
```

```text
What is the salinity at 500 metres?
```

```text
Show the trajectory of float 6902746.
```

```text
Find ARGO floats near the Indian Ocean.
```

```text
Compare temperature profiles between two locations.
```

```text
Show historical temperature observations for this region.
```

---

# 📊 Prototype

The FloatChat prototype should demonstrate the complete pipeline:

```text
                 ┌─────────────────────┐
                 │       User          │
                 │ Natural Language    │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │   LLM Intent Parser │
                 │ Parameter Extraction│
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │     FastAPI         │
                 │      Backend        │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ argopy + xarray     │
                 │ Data Processing     │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ INCOIS ERDDAP /     │
                 │ ARGO Data Services  │
                 └──────────┬──────────┘
                            ↓
                 ┌─────────────────────┐
                 │ Visualization       │
                 │ Maps / Graphs / Data│
                 └─────────────────────┘
```

---

# 🚀 Key Features

### 💬 Natural Language Queries

Users can interact with oceanographic data using ordinary language.

### 🌊 Live Oceanographic Data

Data is retrieved dynamically rather than relying solely on an offline dataset.

### 🤖 LLM-Powered Query Understanding

The LLM converts natural-language requests into structured query parameters.

### 🗺️ Geographic Visualization

ARGO float positions and trajectories can be visualized on an interactive map.

### 📈 Scientific Visualizations

Temperature, salinity, pressure, and other observations can be represented using charts and profiles.

### 🔎 Float-Level Exploration

Users can search and inspect individual ARGO floats using WMO IDs.

### 🇮🇳 Indian Ocean Focus

The system can leverage oceanographic data provided through India's INCOIS infrastructure.

---

# 🔐 Data & AI Philosophy

FloatChat follows a simple principle:

> **Use AI to understand the question, and use authoritative scientific data to answer it.**

The LLM is not treated as the source of truth for oceanographic measurements.

Instead:

```text
LLM → Understands the question
       ↓
API → Retrieves authoritative data
       ↓
Processing → Structures the observations
       ↓
UI → Communicates the result
```

This separation helps reduce the risk of an LLM fabricating scientific measurements.

---

# 🎯 Why This Approach?

Traditional approach:

```text
User
 ↓
Download huge dataset
 ↓
Understand schema
 ↓
Write queries
 ↓
Process data
 ↓
Create visualization
```

FloatChat:

```text
User
 ↓
Ask a question naturally
 ↓
AI understands intent
 ↓
Live data retrieval
 ↓
Visualization
```

The goal is to make complex oceanographic information **accessible without requiring users to be experts in data retrieval systems.**

---

# 🏗️ Future Scope

FloatChat can be extended with:

* Multi-parameter ocean analysis
* Advanced geospatial filtering
* Historical trend analysis
* Ocean anomaly detection
* Automated scientific report generation
* Comparison of multiple ARGO floats
* Ocean forecasting integrations
* More regional and global ocean datasets
* Voice-based ocean data queries
* AI-assisted scientific exploration

---

# 📌 Important Technical Note

FloatChat currently focuses on **data retrieval and intelligent query interpretation**, not on training an ML model to predict ocean conditions.

The system therefore depends on the availability and accessibility of the underlying ARGO data services.

The architecture can later be extended with machine-learning models for tasks such as:

* Ocean temperature prediction
* Anomaly detection
* Salinity forecasting
* Missing-data estimation
* Pattern discovery

Such models would be an additional layer on top of the existing data-retrieval architecture.

---

# 👥 Target Users

FloatChat can be useful for:

* 🌊 Oceanographers
* 🔬 Researchers
* 🎓 Students
* 🏛️ Government and policy organizations
* 🌍 Environmental researchers
* 📊 Data scientists
* 🛰️ Marine technology teams

---

# 🏆 Hackathon Pitch

> **FloatChat is a conversational AI interface for exploring live ARGO oceanographic data. Instead of forcing users to understand complex scientific datasets and APIs, FloatChat allows them to ask questions in natural language. An LLM extracts the user's intent and required parameters, while our FastAPI backend retrieves the actual observations from authoritative ARGO data services such as INCOIS ERDDAP using argopy and xarray.**
>
> **We don't train a static ML model on an offline dataset. AI understands the question; authoritative oceanographic infrastructure provides the answer.**

---

# 📄 Summary

FloatChat combines:

**Natural Language Understanding**

*

**Real-Time Oceanographic Data Retrieval**

*

**ARGO / INCOIS Data**

*

**Scientific Data Processing**

*

**Interactive Visualization**

to create a simple conversational interface for exploring the world's oceans.

### 🌊 Ask the ocean a question. Let FloatChat find the data.
