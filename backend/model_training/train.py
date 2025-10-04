import pandas as pd
import numpy as np
from model import build_catboost, build_rf, build_xgb, build_ensemble
from data_loader import load_koi_data
from feature_engineering import add_physics_features, preprocess_features
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from imblearn.over_sampling import SMOTE
import joblib
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from sklearn.impute import SimpleImputer

def evaluate_models(model,X_test, y_test):
        """
        Comprehensive evaluation using competition metrics
        """
        print("📊 Model Evaluation:")
        print("=" * 40)
        
        models_to_evaluate = {
            
            'Ensemble': model
        }
        
        results = []
        
        for name, model in models_to_evaluate.items():
            # Predictions
            y_pred = model.predict(X_test)
            y_prob = model.predict_proba(X_test)
            
            # Key metrics
            accuracy = accuracy_score(y_test, y_pred)
            auc = roc_auc_score(y_test, y_prob, multi_class='ovr', average='weighted')
            
            print(f"\n{name}:")
            print(f"  Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
            print(f"  AUC-ROC:  {auc:.4f}")
            
            
            
            results.append({
                'Model': name,
                'Accuracy': f"{accuracy:.4f}",
                'AUC_ROC': f"{auc:.4f}",
                'Performance': f"{accuracy*100:.1f}%"
            })
        
        return pd.DataFrame(results)
    
def cross_validation_analysis(ensemble,X_train, y_train):
        """
        5-fold cross-validation for robust performance estimation
        """
        print("\n🔄 Cross-Validation Analysis:")
        
        cv_results = {}
        
       
            
        scores = cross_val_score(ensemble, X_train, y_train, cv=5, scoring='accuracy')
        cv_results['ensemble'] = scores
            
        print(f"{'ensemble'}: {scores.mean():.4f} ± {scores.std():.4f}")
        
        return cv_results
def run_complete_pipeline():
        """Runs the complete pipeline from data loading to model training and saving."""
        print("🚀 Starting the Model Training Pipeline...")
        df = load_koi_data()
        df = preprocess_features(df)
        target = 'koi_disposition_encoded'
        features = [col for col in df.columns if col != target]
        encode_map = {
            "FALSE POSITIVE": 0,
            "CANDIDATE": 1,
            "CONFIRMED": 2
        }

        df['koi_pdisposition_bin'] = df['koi_pdisposition'].map({
            'CANDIDATE': 1,
            'FALSE POSITIVE': 0
        })

        df["koi_disposition_encoded"] = df["koi_disposition"].map(encode_map)
        imp_columns = ['koi_period', 'koi_time0bk', 'koi_duration', 'koi_depth', 'koi_prad', 'koi_impact',
            'koi_model_snr', 'koi_score',
            'koi_pdisposition_bin',
            'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec',
            'koi_steff', 'koi_srad', 'koi_slogg'    
            ]
        X = df[imp_columns]

        X= add_physics_features(X)
        y = df[target]
        score_imputer = SimpleImputer(strategy='median')
        X['koi_score'] = score_imputer.fit_transform(X[['koi_score']])
       
        print("🔧 Preprocessing Data...")
        


        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
        scaler = StandardScaler().fit(X_train)
        X_train_scaled = scaler.transform(X_train)
        X_val_scaled = scaler.transform(X_val)


        sm = SMOTE(random_state=42)
        X_train_bal, y_train_bal = sm.fit_resample(X_train_scaled, y_train)


        rf = build_rf()
        xgb_model = build_xgb()
        cat_model = build_catboost()
        rf.fit(X_train_bal, y_train_bal)
        xgb_model.fit(X_train_bal, y_train_bal)

        ensemble = build_ensemble(rf, xgb_model,cat_model)
        ensemble.fit(X_train_bal, y_train_bal)

        print("💾 Saving Models...")
        joblib.dump(ensemble, 'ensemble_model.sav')
        joblib.dump(scaler, 'scaler.sav')

        results_df = evaluate_models(ensemble,X_val_scaled, y_val)
        
       
        cv_results = cross_validation_analysis(ensemble,X_train_bal, y_train_bal)
        
        print(f"\n🎉 PIPELINE COMPLETED!")
        print("=" * 30)
        print("PERFORMANCE SUMMARY:")
        print(results_df.to_string(index=False))
        
        print({
            'model': ensemble,
            'results': results_df,
            'cv_results': cv_results
        })

        print("Training complete and models saved.")


if __name__ == "__main__":
    run_complete_pipeline()