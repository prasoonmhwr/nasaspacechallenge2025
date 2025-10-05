# A World Away: Hunting for Exoplanets with AI

![OrbitAI Landing Page]

> A submission for the **NASA Space Apps Challenge 2025**. [cite_start]This project introduces **OrbitAI**, a web-based platform designed to accelerate the discovery and validation of exoplanets using machine learning[cite: 1, 2, 22].

---

## 📜 The Challenge

The discovery of over 4,000 exoplanets has been revolutionary, but the detection process is slow and fraught with challenges. [cite_start]Methods like the transit technique are limited by rare orbital alignments[cite: 14]. [cite_start]A significant bottleneck is the high rate of **false positives** (e.g., eclipsing binary stars) that require time-intensive manual review to validate candidates, particularly from missions like **Kepler**[cite: 15, 16].

The goal is to create a reliable, automated system to prioritize the most promising planet candidates, thereby accelerating the search for habitable worlds and expanding our understanding of the universe[cite: 18, 19].

---

## 💡 Our Solution: OrbitAI

To tackle this challenge, we built **OrbitAI**—a user-friendly, sleek web interface that streamlines exoplanet detection[cite: 22]. [cite_start]Our platform leverages a powerful machine learning model to analyze astronomical data and provide instant predictions, making exoplanet vetting fast, accurate, and accessible[cite: 30].



### ✨ Key Features

-   **Batch Analysis**: Upload a CSV file with data for multiple planet candidates and receive a complete analysis classifying each entry[cite: 41]. The interface shows a clear summary of rows processed, exoplanets found, and any errors.
    
    
-   **Planet Lookup**: Enter the name of a star or planet candidate (e.g., Kepler-146 b) to retrieve its confirmed status, orbital period, radius, and AI score from NASA's archives[cite: 41].
-   **Manual Entry**: Input specific transit parameter values directly into the interface to get an instant prediction from our AI model[cite: 27, 41].

---

## 🛠️ Technical Implementation

OrbitAI is powered by a robust backend and a minimalist frontend, built on a carefully constructed machine learning pipeline.

### 📊 Data Sources

-   **Primary Datasets**: We utilized NASA's public **Kepler Object of Interest (KOI)** and **TESS Object of Interest (TOI)** datasets for training and validation[cite: 34].
-   **Research**: Our methodology was informed by insights from two research articles on ensemble-based machine learning for exoplanet identification[cite: 35].

### 🤖 Machine Learning Pipeline

1.  **Preprocessing**: We meticulously cleaned the data by handling outliers (**IQR**), imputing missing values (**Simple/KNN imputers**), addressing data leakage, and applying **Standard Scaler** and log scaling[cite: 37].
2.  **Feature Engineering**: We created a "natural vs. artificial score" feature to enhance model accuracy[cite: 38].
3.  **The Model**: We implemented a **Voting Classifier** combining the strengths of **RandomForest**, **XGBoost**, and **CatBoost**. [cite_start]This ensemble was validated against a **LightGBM** model for performance[cite: 39].

### ⚙️ Backend

The backend is built with Python and serves the core logic of our application. Based on the project files, it:
-   Hosts the pre-trained `ensemble_model.sav` and `scaler.sav` for making live predictions.
-   Uses `main.py` as the entry point for the web server/API.
-   Manages dependencies with a `requirements.txt` file.
-   Includes Jupyter Notebooks (`experiment*.ipynb`) for model training and experimentation.

---

## 🌳 Project Structure

.
├── pycache/
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

To run this project locally, follow these steps.

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```
2.  **Create and activate a virtual environment:**
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```
3.  **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```
4.  **Run the application:**
    ```sh
    python main.py
    ```
5.  Open your browser and navigate to the local server address (e.g., `http://127.0.0.1:8000`).

---

## 🔮 Future Work

[cite_start]We have an exciting roadmap for OrbitAI[cite: 49]:

-   [cite_start]**Real-time Data Integration**: Expand the platform to incorporate live data from ongoing NASA missions like TESS[cite: 50].
-   [cite_start]**Deep Learning Models**: Enhance accuracy by implementing deep learning techniques, such as the `astronet` model[cite: 51].
-   [cite_start]**Community Partnerships**: Partner with observatories and academic institutions to scale OrbitAI into a widely adopted tool[cite: 52].

---

## 👥 Team Members

-   [cite_start]Tushar Mishra (Team Owner) [cite: 5]
-   [cite_start]Om Santosh Mishra [cite: 6]
-   [cite_start]Dip Koonjoobeeharry [cite: 7]
-   [cite_start]Prasoon Mahawar [cite: 8]
-   [cite_start]Shaik Mohammed Noorullah [cite: 9]
-   [cite_start]Disha Faujdar [cite: 10]

---

## 🙏 Acknowledgements

We'd like to extend our sincere gratitude to our mentors, collaborators, and **NASA*
