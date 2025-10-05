import joblib
import pandas as pd
from feature_engineering import add_physics_features, preprocess_features

model = joblib.load('ensemble_model.sav')
scaler = joblib.load('scaler.sav')
encode_map = { "FALSE POSITIVE": 0, "CANDIDATE": 1, "CONFIRMED": 2 }
decode_map = {v: k for k, v in encode_map.items()}

def predict_one(json_input):
    df = pd.DataFrame([json_input])
    df = add_physics_features(df)
    df = preprocess_features(df)
    X = scaler.transform(df)
    preds = model.predict(X)
    proba = model.predict_proba(X)
    return {
        'prediction': decode_map[int(preds[0])],
        'proba': proba.tolist()[0]
    }


