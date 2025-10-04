import numpy as np
import pandas as pd

def add_physics_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df['koi_depth'] = df['koi_depth'].fillna(df['koi_depth'].median())
    df['koi_depth_log'] = np.log1p(df['koi_depth'])         
    df['koi_model_snr'] = df['koi_model_snr'].fillna(df['koi_model_snr'].median())
    df['koi_model_snr_log'] = np.log1p(df['koi_model_snr'])
    df['transit_strength'] = df['koi_depth'] * df['koi_model_snr'] / (df['koi_period'] + 1)
    df['planet_star_ratio'] = df['koi_prad'] / (df['koi_steff'] / 5778)  # normalize to solar T_eff
    df['impact_depth_product'] = df['koi_impact'] * df['koi_depth_log']
    df['period_duration_ratio'] = df['koi_period'] / (df['koi_duration'] / 24)
    return df

def preprocess_features(df: pd.DataFrame, fill_with="median") -> pd.DataFrame:
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
        
    for col in df.select_dtypes(include=[np.number]).columns:
        Q1, Q3 = df[col].quantile([0.25, 0.75])
        IQR = Q3 - Q1
        lower_bound = Q1 - 2.0 * IQR
        upper_bound = Q3 + 2.0 * IQR
        df[col] = df[col].clip(lower_bound, upper_bound)
        
        
    return df
