# 🌌 A World Away: Hunting for Exoplanets with AI

> A submission for the **NASA Space Apps Challenge 2025**.  
> This project introduces **OrbitAI**, a web-based platform designed to accelerate the discovery and validation of exoplanets using machine learning.

---

## 📜 The Challenge

The discovery of over 4,000 exoplanets has been revolutionary, but the detection process remains slow and challenging. Techniques such as the **transit method** are limited by rare orbital alignments, and a major bottleneck is the high rate of **false positives** (e.g., eclipsing binary stars).  
These issues require time-consuming manual validation, especially for data from missions like **Kepler**.

The goal of this project is to create a **reliable, automated system** to prioritize the most promising exoplanet candidates — accelerating the search for habitable worlds and expanding our understanding of the universe.

---

## 💡 Our Solution: OrbitAI

To tackle this challenge, we built **OrbitAI** — a sleek, user-friendly web platform that streamlines exoplanet detection.  
OrbitAI leverages a powerful machine learning model to analyze astronomical data and deliver instant predictions — making exoplanet vetting **fast, accurate, and accessible**.

---

### ✨ Key Features

- **Batch Analysis**: Upload a CSV file containing multiple planet candidates to receive a full classification report. The interface summarizes total rows processed, exoplanets found, and any detected errors.

- **Planet Lookup**: Search by star or planet name (e.g., `Kepler-146 b`) to fetch real-time details like status, orbital period, radius, and AI-generated confidence scores from NASA archives.

- **Manual Entry**: Input specific transit parameter values manually to get instant predictions from our trained AI model.

---

## 🛠️ Technical Implementation

OrbitAI combines a robust backend with a clean, responsive frontend — all powered by a carefully designed **machine learning pipeline**.

### 📊 Data Sources

- **Primary Datasets:**  
  - NASA’s **Kepler Object of Interest (KOI)** dataset  
  - NASA’s **TESS Object of Interest (TOI)** dataset  
- **Research Basis:**  
  Methodology inspired by peer-reviewed research on **ensemble-based ML for exoplanet identification**.

---

### 🤖 Machine Learning Pipeline

1. **Preprocessing**  
   - Outlier handling using **IQR**  
   - Missing value imputation via **SimpleImputer / KNNImputer**  
   - Feature scaling (StandardScaler + log transformations)  
   - Data leakage prevention and validation checks  

2. **Feature Engineering**  
   - Introduced a *"natural vs. artificial score"* feature to improve model discrimination.

3. **Model Architecture**  
   - Core model: **Voting Classifier** ensemble  
   - Components: **RandomForest**, **XGBoost**, **CatBoost**  
   - Validated against a **LightGBM** baseline for performance benchmarking.  

---

### ⚙️ Backend Architecture

- **Language:** Python  
- **Key Components:**  
  - `ensemble_model.sav` and `scaler.sav` — pre-trained model and scaler  
  - `main.py` — entry point and API server  
  - `requirements.txt` — dependency management  
  - `experiment*.ipynb` — model training notebooks  

---

## 🌳 Project Structure

## 🌳 Project Structure

```plaintext
.
├── __pycache__/
├── catboost_info/
├── model_training/
├── .python-version
├── NASA.json
├── README.md
├── ensemble_model.sav
├── experiment.ipynb
├── experimentation_toi.ipynb
├── main.py
├── pyproject.toml
├── requirements.txt
├── sample_planets.csv
├── scaler.sav
└── uv.lock



---

## 🚀 Getting Started

Follow these steps to set up and run OrbitAI locally.

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name

2. **Create and Activate a Virtual Environment**

python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate


3. **Install Dependencies**

pip install -r requirements.txt


4. **Run the Application**

python main.py


5. **Access the Web App**
Open your browser and go to the local server address displayed in the terminal (e.g., http://127.0.0.1:5000).

🔮 Future Work

Our roadmap includes exciting extensions for OrbitAI:

Real-time Data Integration: Incorporate live data streams from active NASA missions like TESS.

Deep Learning Models: Explore advanced deep learning approaches such as Astronet for improved accuracy.

Community Partnerships: Collaborate with observatories and academic institutions to expand OrbitAI into a widely used scientific tool.

## 👥 Team Members

Tushar Mishra — Team Owner

Om Santosh Mishra

Dip Koonjoobeeharry

Prasoon Mahawar

Shaik Mohammed Noorullah

Disha Faujdar

## 🙏 Acknowledgements

Our deepest gratitude to our mentors, collaborators, and the NASA Space Apps Challenge community for their guidance and inspiration.

### 🛰️ “Somewhere, something incredible is waiting to be known.” — Carl Sagan
