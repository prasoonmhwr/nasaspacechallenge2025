import pandas as pd
import requests
from io import StringIO

def load_koi_data():
    url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+cumulative&format=csv"
    r = requests.get(url, timeout=30)
    df = pd.read_csv(StringIO(r.text))
    return df

def load_toi_data():
    url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+toi&format=csv"
    r = requests.get(url, timeout=30)
    df = pd.read_csv(StringIO(r.text))
    return df