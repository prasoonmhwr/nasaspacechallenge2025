from backend.model_training.inference import predict_one
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
from typing import List, Dict, Any

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


@app.post("/api/exoplanet-detection-csv")
async def detect_exoplanets_from_csv(file: UploadFile = File(..., description="CSV file with columns: period, impact, depth")):
    """
    Upload a CSV file to detect exoplanets for multiple planets at once.
    
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
        
        # Validate required columns
        required_columns = ['period', 'impact', 'depth']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {missing_columns}. Required columns are: {required_columns}"
            )
        
        # Process each row
        results = []
        for index, row in df.iterrows():
            data = row.to_dict()
            result = predict_one(data)
            results.append(result)
        return {"predictions": results}
        
        # Calculate summary statistics
        total_rows = len(results)
        exoplanets_found = sum(1 for r in results if r.get('is_exoplanet', False))
        errors = sum(1 for r in results if 'error' in r)
        
        return {
            "summary": {
                "total_rows_processed": total_rows,
                "exoplanets_found": exoplanets_found,
                "non_exoplanets": total_rows - exoplanets_found - errors,
                "errors": errors
            },
            "results": results
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV file: {str(e)}")
    
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type != 'text/csv':
        raise HTTPException(status_code=400, detail="File must be a CSV")
    content = await file.read()
    try:
        df = pd.read_csv(StringIO(content.decode('utf-8')))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file")
    try:
        
        results = []
        for index, row in df.iterrows():
            data = row.to_dict()
            result = predict_one(data)
            results.append(result)
        return {"predictions": results}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Preprocessing failed: {str(e)}")
   