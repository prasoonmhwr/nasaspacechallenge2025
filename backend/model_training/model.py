from sklearn.ensemble import RandomForestClassifier, VotingClassifier
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder, StandardScaler
from imblearn.over_sampling import SMOTE
from catboost import CatBoostClassifier

def build_rf():
    return RandomForestClassifier(
            n_estimators=300,
            max_depth=18,
            min_samples_split=4,
            min_samples_leaf=2,
            max_features='sqrt',
            bootstrap=True,
            random_state=42,
            n_jobs=-1
        )

def build_xgb():
    return xgb.XGBClassifier(
            n_estimators=250,
            max_depth=9,
            learning_rate=0.08,
            subsample=0.85,
            colsample_bytree=0.85,
            gamma=0.1,
            reg_alpha=0.1,
            random_state=42,
            eval_metric='mlogloss'
        )

def build_catboost():
    return CatBoostClassifier(
            iterations=200,
            depth=9,
            learning_rate=0.08,
            l2_leaf_reg=3,
            bootstrap_type='Bernoulli',
            subsample=0.8,
            random_seed=42,
            verbose=False
        )
def build_ensemble(rf, xgb_model,cat_model):
    return VotingClassifier(estimators=[('rf', rf), ('xgb', xgb_model), ('cat', cat_model)], voting='soft')
