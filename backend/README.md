# NASA Space Challenge 2025 - Backend API

This backend service provides APIs for astronomical data analysis and exoplanet detection using NASA's exoplanet database.

## Features

### 🌟 Star Information API
- **Endpoint**: `POST /api/star-info`
- **Description**: Retrieves detailed information about stars from NASA's exoplanet archive
- **Input**: Star name
- **Output**: Star details including spectral type, constellation, distance, and sky image

### 🪐 Exoplanet Detection APIs

#### Single Planet Detection
- **Endpoint**: `GET /api/exoplanet-detection`
- **Description**: Determines if a single planet with given parameters is an exoplanet based on NASA data
- **Parameters**:
  - `period` (float): Orbital period in days
  - `impact` (float): Impact parameter (0-1)
  - `depth` (float): Transit depth in parts per million

#### Batch CSV Upload Detection
- **Endpoint**: `POST /api/exoplanet-detection-csv`
- **Description**: Upload a CSV file to detect exoplanets for multiple planets at once
- **Input**: CSV file with columns: `period`, `impact`, `depth`
- **Output**: Batch results with summary statistics

#### Example Usage

```bash
# Check if a single planet is an exoplanet
curl "http://localhost:8001/api/exoplanet-detection?period=6.33125228&impact=0.094&depth=306.6"

# Upload CSV file for batch detection
curl -X POST "http://localhost:8001/api/exoplanet-detection-csv" \
  -F "file=@planets.csv"
```

#### CSV Format Example

```csv
period,impact,depth
6.33125228,0.094,306.6
7.32851947,0.983,277.8
18.6052046,0.093,242.5
100.0,0.5,1000.0
```

#### Response Format

**Single Planet Response:**
```json
{
  "is_exoplanet": true,
  "matches_found": 1,
  "matching_planet": {
    "kepler_name": "Kepler-1892 b",
    "koi_period": 6.33125228,
    "koi_impact": 0.094,
    "koi_depth": 306.6,
    "koi_disposition": "CONFIRMED",
    "is_exoplanet": true
  },
  "input_parameters": {
    "period": 6.33125228,
    "impact": 0.094,
    "depth": 306.6
  }
}
```

**CSV Batch Response:**
```json
{
  "summary": {
    "total_rows_processed": 5,
    "exoplanets_found": 4,
    "non_exoplanets": 1,
    "errors": 0
  },
  "results": [
    {
      "is_exoplanet": true,
      "matches_found": 1,
      "matching_planet": {...},
      "row_number": 1
    }
  ]
}
```

## How It Works

The exoplanet detection API uses a matching algorithm that:

1. **Loads NASA Data**: Reads exoplanet data from `NASA.json` at startup
2. **Parameter Matching**: Compares input parameters against the NASA database
3. **Tolerance Matching**: Uses 10% tolerance for flexible matching
4. **Disposition Check**: Verifies if the planet is confirmed as an exoplanet

### Matching Criteria

- **Period**: Orbital period within 10% tolerance
- **Impact**: Impact parameter within 10% tolerance  
- **Depth**: Transit depth within 10% tolerance
- **Disposition**: Must be "CONFIRMED" to be classified as an exoplanet

### CSV Processing Features

- **Automatic Validation**: Checks for required columns and data types
- **Error Handling**: Reports errors for individual rows without stopping processing
- **Batch Processing**: Processes multiple planets efficiently
- **Summary Statistics**: Provides overview of results

## Setup and Installation

### Prerequisites
- Python 3.12+
- uv package manager

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   uv sync
   ```

4. Start the server:
   ```bash
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8001
   ```

### API Documentation

Once the server is running, visit:
- **Interactive API Docs**: `http://localhost:8001/docs`
- **OpenAPI Schema**: `http://localhost:8001/openapi.json`

## Dependencies

- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI applications
- **Requests**: HTTP library for making API calls to NASA
- **Astropy**: Astronomy and astrophysics library for coordinate calculations
- **Pydantic**: Data validation using Python type annotations
- **Pandas**: Data manipulation and analysis library for CSV processing
- **Python-multipart**: File upload support for FastAPI

## Data Source

The exoplanet detection uses data from NASA's Kepler Object of Interest (KOI) catalog, including:
- Kepler planet names
- Orbital periods
- Impact parameters
- Transit depths
- Disposition status (CONFIRMED, FALSE POSITIVE, etc.)

## Error Handling

The API includes comprehensive error handling for:
- Missing or invalid parameters
- Data loading failures
- Network connectivity issues
- Invalid JSON responses
- CSV file format errors
- Missing required columns
- Invalid data types in CSV

## Testing

The API has been tested with various scenarios:
- ✅ Exact matches from NASA database
- ✅ Tolerance-based matches
- ✅ Non-matching parameters
- ✅ CSV file uploads with multiple planets
- ✅ Error conditions and validation

## Contributing

This project is part of the NASA Space Challenge 2025. For contributions or issues, please refer to the main project repository.