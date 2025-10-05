from fastapi import FastAPI, Query, UploadFile, File, HTTPException
from pydantic import BaseModel
import requests
import csv
from io import StringIO
from fastapi.middleware.cors import CORSMiddleware
from astropy.coordinates import SkyCoord
import astropy.units as u
from urllib.parse import urlencode
import json
import os
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from model_training.inference import predict_one

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StarRequest(BaseModel):
    star_name: str

# Load NASA exoplanet data
def load_nasa_data():
    try:
        with open('NASA.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

# Store the loaded data globally
nasa_data = load_nasa_data()

@app.post("/api/star-info")
async def get_star_info(request: StarRequest):

    star_name = request.star_name.strip()
    
    NASA_API_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    
    query_string = f"""
        select hostname, ra, dec, st_spectype, sy_snum, sy_pnum, sy_dist
        from pscomppars
        where hostname='{star_name}'
    """
    
    params = {
        'query': query_string,
        'format': 'csv'
    }
    
    try:
        response = requests.get(NASA_API_URL, params=params)
        response.raise_for_status()

        csv_data = StringIO(response.text)
        reader = csv.DictReader(csv_data)
        data_row = next(reader, None)

        if not data_row:
            return {"error": "Star not found in NASA's archive."}
        
        ra = data_row.get("ra")
        dec = data_row.get("dec")

        constellation = None
        if ra and dec:
            coord = SkyCoord(ra=float(ra)*u.deg, dec=float(dec)*u.deg, frame="icrs")
            constellation = coord.get_constellation()

        skyview_params = {
            "Survey": "DSS2 Red",
            "Position": f"{ra},{dec}",
            "Size": "0.25",
            "Pixels": "300",
            "Return": "JPEG"
        }
        image_url = "https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl?" + urlencode(skyview_params)

        result = {
            "name": data_row.get("hostname"),
            "imageUrl": image_url,
            "spectralType": data_row.get("st_spectype"),
            "numberOfStars": data_row.get("sy_snum"),
            "numberOfPlanets": data_row.get("sy_pnum"),
            "distance": f"{float(data_row.get('sy_dist')):,.2f} parsecs" if data_row.get("sy_dist") else None,
            "constellation": constellation
        }
        return result

    except Exception as e:
        return {"error": f"An error occurred: {e}"}

def detect_single_exoplanet(period: float, impact: float, depth: float) -> Dict[str, Any]:
    """
    Helper function to detect if a single planet is an exoplanet
    """
    if not nasa_data:
        return {"error": "NASA data not available"}
    
    # Define tolerance for matching (adjust as needed)
    period_tolerance = 0.1  # 10% tolerance for period
    impact_tolerance = 0.1  # 10% tolerance for impact
    depth_tolerance = 0.1   # 10% tolerance for depth
    
    matches = []
    
    for planet in nasa_data:
        koi_period = planet.get("koi_period")
        koi_impact = planet.get("koi_impact")
        koi_depth = planet.get("koi_depth")
        koi_disposition = planet.get("koi_disposition")
        kepler_name = planet.get("kepler_name")
        
        # Check if all required fields are present
        if koi_period is None or koi_impact is None or koi_depth is None:
            continue
        
        # Check if values match within tolerance
        period_match = abs(koi_period - period) / period <= period_tolerance
        impact_match = abs(koi_impact - impact) / max(impact, 0.001) <= impact_tolerance
        depth_match = abs(koi_depth - depth) / depth <= depth_tolerance
        
        if period_match and impact_match and depth_match:
            matches.append({
                "kepler_name": kepler_name,
                "koi_period": koi_period,
                "koi_impact": koi_impact,
                "koi_depth": koi_depth,
                "koi_disposition": koi_disposition,
                "is_exoplanet": koi_disposition == "CONFIRMED"
            })
    
    if matches:
        # Return the first match (or all matches if you prefer)
        best_match = matches[0]
        return {
            "is_exoplanet": best_match["is_exoplanet"],
            "matches_found": len(matches),
            "matching_planet": best_match,
            "all_matches": matches if len(matches) > 1 else None,
            "input_parameters": {
                "period": period,
                "impact": impact,
                "depth": depth
            }
        }
    else:
        return {
            "is_exoplanet": False,
            "matches_found": 0,
            "message": "No matching exoplanet found in NASA database",
            "input_parameters": {
                "period": period,
                "impact": impact,
                "depth": depth
            }
        }
    
encode_map = { "FALSE POSITIVE": 0, "CANDIDATE": 1, "CONFIRMED": 2 }
decode_map = {v: k for k, v in encode_map.items()}

# In backend/main.py

from pydantic import BaseModel, Field

# ... (other code remains the same)

# --- THE FIX: UNCOMMENT AND DEFINE THE Pydantic MODEL ---
class ExoplanetInput(BaseModel):
    koi_period: float = Field(default=75.0, description="Orbital Period (days)")
    koi_time0bk: float = Field(default=0.0, description="Transit Midpoint (BKJD)")
    koi_duration: float = Field(default=4.0, description="Transit Duration (hours)")
    koi_depth: float = Field(default=23791.0, description="Transit Depth (ppm)")
    koi_impact: float = Field(default=0.7, description="Impact Parameter")
    koi_model_snr: float = Field(default=10.0, description="Model Transit Signal-to-Noise")
    koi_prad: float = Field(default=1.0, description="Planetary Radius (Earth radii)")
    koi_steff: float = Field(default=5778.0, description="Stellar Effective Temperature (K)")
    koi_srad: float = Field(default=1.0, description="Stellar Radius (Solar radii)")
    koi_slogg: float = Field(default=4.4, description="Stellar Surface Gravity (log10(g))")
    koi_score: float = Field(default=0.5, description="KOI Score/Confidence")
    koi_pdisposition_bin: float = Field(default=1.0, description="Disposition (1=PC, 0=N)")

MODEL_COLUMNS = [
    'koi_period', 'koi_time0bk', 'koi_duration', 'koi_depth', 'koi_prad',
    'koi_impact', 'koi_model_snr', 'koi_score', 'koi_pdisposition_bin',
    'koi_steff', 'koi_srad', 'koi_slogg'
]

# In backend/main.py

# ... (all your other code and imports)

@app.post("/api/predict-single")
async def predict_manual_query(data: ExoplanetInput):
    try:
        # Pass the data to your prediction function
        json_input = data.model_dump()
        prediction = predict_one(json_input)
        
        # Simply return the result from predict_one directly.
        # It already contains the correct string prediction.
        return prediction
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")



@app.post("/api/exoplanet-detection-csv")
async def detect_exoplanets_from_csv(file: UploadFile = File(..., description="CSV file with columns: period, impact, depth")):
    """
    Upload a CSV file to detect exoplanets for multiple planets at once.
    
    Expected CSV format:
    - period: Orbital period in days
    - impact: Impact parameter (0-1) 
    - depth: Transit depth in parts per million
    
    Returns:
        List of exoplanet detection results for each row in the CSV
    """
    try:
        # Check if file is CSV
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV file")
        
        # Read CSV content
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        # Parse CSV using pandas
        df = pd.read_csv(StringIO(csv_content))
        
        # Define column mappings for flexibility
        # column_mappings = {
        #     'period': ['period', 'Period', 'PERIOD', 'orbital_period', 'orbital period', 'days', 'Days', 'koi_period'],
        #     'impact': ['impact', 'Impact', 'IMPACT', 'impact_parameter', 'impact parameter', 'b', 'B', 'koi_impact'],
        #     'depth': ['depth', 'Depth', 'DEPTH', 'transit_depth', 'transit depth', 'ppm', 'PPM', 'koi_depth']
        # }
        
        # Check if CSV already has all KOI columns (full dataset)
        koi_columns = ['koi_period', 'koi_time0bk', 'koi_duration', 'koi_depth', 'koi_prad', 
                      'koi_impact', 'koi_model_snr', 'koi_score', 'koi_pdisposition_bin', 
                      'koi_steff', 'koi_srad', 'koi_slogg']

        default_values = {
        'koi_period': 75.0,
        'koi_time0bk': 0.0,
        'koi_duration': 4.0,
        'koi_depth': 23791.0,
        'koi_prad': 1.0,
        'koi_impact': 0.7,
        'koi_model_snr': 10.0,
        'koi_score': 0.5,
        'koi_pdisposition_bin': 1,
        'koi_steff': 5778.0,
        'koi_srad': 1.0,
        'koi_slogg': 4.4,
        }

        for col in koi_columns:
            if col not in df.columns:
                df[col] = default_values.get(col, np.nan) 
        
        extra_cols = [col for col in df.columns if col not in koi_columns]
        if extra_cols:
            df = df.drop(columns=extra_cols)
        
        df = df[koi_columns]

        results = []

        for index, row in df.iterrows():
            json_input = row.to_dict()
            try:
                result = predict_one(json_input)
                result['row_number'] = index + 1
            except Exception as e:
                # Handle potential errors during prediction for a single row
                result = {'row_number': index, 'error': f"Prediction failed: {str(e)}"}
        
            results.append(result)

        total_rows = len(results)
        exoplanets_found = sum(1 for r in results if r.get('prediction') == 'CONFIRMED')
        errors = sum(1 for r in results if 'error' in r)


            
            # # 3. Augment the result with the original row number
            # result['row_number'] = index 

        
        # has_all_koi_columns = all(col in df.columns for col in koi_columns)
        
        # if has_all_koi_columns:
        #     # Use the full KOI dataset directly, but filter to only expected columns
        #     expected_columns = ['koi_period', 'koi_time0bk', 'koi_duration', 'koi_depth', 'koi_prad', 
        #                        'koi_impact', 'koi_model_snr', 'koi_score', 'koi_pdisposition_bin', 
        #                        'koi_steff', 'koi_srad', 'koi_slogg', 'koi_depth_log', 'koi_model_snr_log',
        #                        'transit_strength', 'planet_star_ratio', 'impact_depth_product', 'period_duration_ratio']
            
        #     # Filter to only include expected columns (ignore any extra columns like 'Unnamed: 0')
        #     available_columns = [col for col in expected_columns if col in df.columns]
        #     df_processed = df[available_columns].copy()
        #     mapped_columns = "Full KOI dataset - no mapping needed"
        # else:
        #     # Map columns to standard names
        #     df_mapped = df.copy()
        #     mapped_columns = {}
            
        #     for standard_name, possible_names in column_mappings.items():
        #         found_column = None
        #         for possible_name in possible_names:
        #             if possible_name in df.columns:
        #                 found_column = possible_name
        #                 break
                
        #         if found_column:
        #             if found_column != standard_name:
        #                 df_mapped[standard_name] = df[found_column]
        #                 mapped_columns[found_column] = standard_name
        #         else:
        #             raise HTTPException(
        #                 status_code=400, 
        #                 detail=f"Missing required column for '{standard_name}'. Looking for one of: {possible_names}. Found columns: {list(df.columns)}"
        #             )
            
        #     # Use the mapped dataframe with default values
        #     df_processed = df_mapped[['period', 'impact', 'depth']].copy()
        
        # # Process each row
        # results = []
        # for index, row in df_processed.iterrows():
        #     if has_all_koi_columns:
        #         # Use the data directly from the KOI columns
        #         data = row.to_dict()
        #     else:
        #         # Map to the column names expected by the ML model (in correct order)
        #         data = {
        #             'koi_period': row['period'],
        #             'koi_time0bk': 0.0,  # Default value
        #             'koi_duration': 4.0,  # Default value (4 hours)
        #             'koi_depth': row['depth'],
        #             'koi_prad': 1.0,  # Default value
        #             'koi_impact': row['impact'], 
        #             'koi_model_snr': 10.0,  # Default value
        #             'koi_score': 0.5,  # Default value
        #             'koi_pdisposition_bin': 0,  # Default value
        #             'koi_steff': 5778.0,  # Default value (solar temperature)
        #             'koi_srad': 1.0,  # Default value (solar radius)
        #             'koi_slogg': 4.4,  # Default value (solar log g)
        #             # Additional features will be computed by add_physics_features
        #             'koi_depth_log': 0.0,  # Will be computed
        #             'koi_model_snr_log': 0.0,  # Will be computed
        #             'transit_strength': 0.0,  # Will be computed
        #             'planet_star_ratio': 0.0,  # Will be computed
        #             'impact_depth_product': 0.0,  # Will be computed
        #             'period_duration_ratio': 0.0  # Will be computed
        #         }
            
        #     result = predict_one(data)
        #     result['row_number'] = index + 1
        #     results.append(result)
        
        # # Calculate summary statistics
        # total_rows = len(results)
        # exoplanets_found = sum(1 for r in results if r.get('prediction') == 'CONFIRMED')
        # errors = sum(1 for r in results if 'error' in r)
        
        return {
            "summary": {
                "total_rows_processed": total_rows,
                "exoplanets_found": exoplanets_found,
                "non_exoplanets": total_rows - exoplanets_found - errors,
                "errors": errors,
                # "column_mappings": mapped_columns if mapped_columns else "No column mappings needed",
                # "data_type": "Full KOI dataset" if has_all_koi_columns else "Simplified dataset (period, impact, depth)"
            },
            "results": results
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV file: {str(e)}")


if __name__ == "__main__":
    # Allow starting the app with: python main.py
    # This requires `uvicorn` to be installed in the environment.
    try:
        import uvicorn
    except Exception:
        raise RuntimeError(
            "uvicorn is required to run the app. Install it with `pip install uvicorn[standard]` or use `pip install .` to install project deps.`"
        )

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)