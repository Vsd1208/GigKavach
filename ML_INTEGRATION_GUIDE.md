# GigShield ML Integration Guide

## Overview
This guide explains the ML integration implemented in GigShield for predicting risk scores, fraud detection, insurance pricing, and claim approval likelihood.

## Architecture

### ML Service (Python Flask)
- **Location**: `/ml-service/`
- **Port**: 5000
- **Models Trained**:
  - `fraud_model.pkl` - Fraud detection classifier (99% test accuracy)
  - `price_model.pkl` - Price prediction regressor (91.96% accuracy)
  - `risk_model.pkl` - Risk assessment regressor (64.34% accuracy)
  - `claim_model.pkl` - Claim approval classifier (88% test accuracy)

### Backend Integration (Node.js)
- **ML Service Module**: `/backend/src/services/mlService.js`
- **ML Routes**: `/api/ml/*` endpoints in `/backend/src/router.js`
- **Controllers**: `/backend/src/controllers/mlController.js`

### Frontend Integration (React)
- **API Layer**: `/gigshield-ui/src/api/mlApi.js`
- **Graph Components**: `/gigshield-ui/src/components/graphs/`
  - `ClaimGraph.jsx` - Claim status distribution
  - `FraudGraph.jsx` - Fraud detection metrics
  - `PriceGraph.jsx` - Premium pricing trends
  - `RiskGraph.jsx` - Risk score evolution

## Data Flow

### 1. New User Registration → Data Storage → ML Prediction

```
User Registration
    ↓
Complete Profile (WorkerApp.jsx)
    ↓
POST /api/workers/onboarding
    ↓
Store in Backend Store
    ↓
POST /api/ml/store-worker (saves to CSV)
    ↓
Generate Risk Prediction
    ↓
Calculate Premium with ML-derived Risk Score
```

### 2. Claim Submission → Fraud Detection

```
Claim Submitted
    ↓
Extract Claim Features
    ↓
POST /api/ml/fraud-check
    ↓
ML Model Predicts Fraud Score
    ↓
Auto-Approve if Low Fraud Risk
    ↓
Manual Review if High Fraud Risk
```

### 3. Premium Calculation

```
Plan Selected
    ↓
Get Worker Profile
    ↓
POST /api/ml/worker-risk
    ↓
ML Predicts Risk Score
    ↓
Premium = Base × (1 + 0.3 × (RiskScore - 0.5)) × LoyaltyDiscount
```

## API Endpoints

### Single Prediction
```bash
POST /api/ml/worker-risk
{
  "age": 35,
  "gig_type": "Delivery",
  "monthly_income": 35000,
  "work_hours_per_week": 40,
  "night_shift_ratio": 0.3,
  "vehicle_age_years": 3,
  "traffic_violations": 1,
  "health_score": 75,
  "city_tier": 2,
  "coverage_gap_days": 30
}

Response:
{
  "riskScore": 0.45,
  "probability": [0.55, 0.45]
}
```

### Batch Prediction
```bash
POST /api/ml/batch-predict/risk
[
  { "age": 30, "gig_type": "Delivery", ... },
  { "age": 35, "gig_type": "Ride-hailing", ... }
]

Response:
{
  "predictions": [0.42, 0.48],
  "probabilities": [[0.58, 0.42], [0.52, 0.48]],
  "count": 2,
  "timestamp": "2026-04-17T10:30:00Z"
}
```

### Store Worker Data
```bash
POST /api/ml/store-worker
{
  "worker_id": "WRK-12345",
  "age": 35,
  "gig_platform": "Blinkit",
  "monthly_income": 35000,
  "work_hours_per_week": 40,
  "health_condition": "Fair",
  "location_risk_score": 5.0,
  "city_tier": 2
}

Response:
{
  "status": "success",
  "worker_id": "WRK-12345",
  "message": "Worker data stored successfully"
}
```

### Retrieve Worker Data
```bash
GET /api/ml/workers/{workerId}
GET /api/ml/workers  # Get all workers

Response:
{
  "worker_id": "WRK-12345",
  "age": 35,
  "gig_platform": "Blinkit",
  "monthly_income": 35000,
  "timestamp": "2026-04-17T10:30:00Z"
}
```

### ML Service Health Check
```bash
GET /api/ml/health

Response:
{
  "status": "healthy",
  "models_loaded": ["fraud", "price", "risk", "claim"],
  "timestamp": "2026-04-17T10:30:00Z"
}
```

## Feature Engineering

### Risk Model Features
- `age`: Worker age (18-65)
- `gig_type`: Type of gig work (Freelance Tech, Logistics, Delivery, etc.)
- `monthly_income`: Monthly income in INR
- `work_hours_per_week`: Work hours per week (0-168)
- `night_shift_ratio`: Ratio of night shifts (0-1)
- `vehicle_age_years`: Age of vehicle in years
- `traffic_violations`: Number of traffic violations
- `health_score`: Health score (0-100)
- `city_tier`: City tier (1-3)
- `coverage_gap_days`: Days without coverage

### Fraud Model Features
- `age`: Worker age
- `policy_duration_days`: Days since policy started
- `claim_amount`: Claim amount in INR
- `monthly_income`: Monthly income
- `num_claims_past_year`: Number of claims in past year
- `claim_to_income_ratio`: Claim amount to monthly income ratio
- `response_time_hours`: Response time for claim in hours
- `inconsistency_score`: Document inconsistency score (0-1)
- `ip_location_mismatch`: Binary flag for IP/location mismatch
- `document_auth_score`: Document authentication score (0-1)
- `previous_fraud_flag`: Binary flag for previous fraud

### Price Model Features
- `age`: Worker age
- `gig_platform`: Platform (Blinkit, Zepto, Ola, etc.)
- `monthly_income`: Monthly income
- `work_hours_per_week`: Work hours per week
- `years_experience`: Years of experience in gig work
- `health_condition`: Health status (Poor, Fair, Excellent)
- `coverage_type`: Coverage type (Accident Only, Health + Accident)
- `location_risk_score`: Location-based risk score
- `num_dependents`: Number of dependents
- `past_accidents`: Number of past accidents
- `city_tier`: City tier

### Claims Model Features
- `age`: Worker age
- `gig_platform`: Platform
- `monthly_income`: Monthly income
- `work_hours_per_week`: Work hours per week
- `policy_type`: Policy type (Basic, Standard, Premium)
- `claim_type`: Type of claim (Vehicle Damage, Accident, Health, etc.)
- `claim_amount`: Claim amount in INR
- `days_since_policy_start`: Days elapsed since policy started
- `previous_claims`: Number of previous claims
- `incident_severity`: Severity of incident (Low, Medium, High, Critical)

## CSV Data Storage

### User Data Storage
New worker data is automatically stored in `/ml-service/datasets/user_data.csv`:
- Automatically appends when new workers register
- Used for model retraining and analysis
- Contains all worker profile information

### Accessing Stored Data
```python
import pandas as pd

# Read all stored user data
df = pd.read_csv('datasets/user_data.csv')

# Analyze by platform
platform_stats = df.groupby('gig_platform')['monthly_income'].mean()

# Calculate average risk factors
avg_age = df['age'].mean()
avg_income = df['monthly_income'].mean()
```

## Frontend Integration Examples

### Predict Risk Score in React Component
```javascript
import { predictWorkerRisk } from '../api/mlApi.js'

// In a React component
const [riskScore, setRiskScore] = useState(null)

const fetchRiskScore = async (workerProfile) => {
  const result = await predictWorkerRisk(workerProfile)
  setRiskScore(result.riskScore)
}
```

### Display ML Data in Graphs
```javascript
import RiskGraph from './graphs/RiskGraph'

// Use in component
<RiskGraph data={riskTrendData} />

// Data format
const riskTrendData = [
  { name: 'Mon', risk: 0.42, traffic: 35 },
  { name: 'Tue', risk: 0.48, traffic: 42 },
]
```

### Store Worker Data on Registration
```javascript
import { storeWorkerData } from '../api/mlApi.js'

const completeRegistration = async (profileData) => {
  // Register in backend
  const response = await apiFetch('/api/workers/onboarding', {
    method: 'POST',
    body: JSON.stringify(profileData)
  })
  
  // Store in ML service
  if (response.worker) {
    await storeWorkerData({
      ...profileData,
      worker_id: response.worker.id
    })
  }
}
```

## Model Performance Metrics

### Training Results
| Model | Type | Train Accuracy | Test Accuracy |
|-------|------|----------------|---------------|
| Fraud Detection | Classifier | 100% | 99% |
| Price Prediction | Regressor | 98.46% | 91.96% |
| Risk Assessment | Regressor | 97.17% | 64.34% |
| Claim Approval | Classifier | 100% | 88% |

### Feature Importance Analysis
Use scikit-learn's built-in feature importance:
```python
import pickle

# Load trained model
model = pickle.load(open('risk_model.pkl', 'rb'))

# Get feature importances
importances = model.feature_importances_
feature_names = X.columns

# Sort by importance
indices = importances.argsort()[::-1]
for i in range(len(feature_names)):
    print(f"{feature_names[indices[i]]}: {importances[indices[i]]:.4f}")
```

## Retraining Models

### Automatic Retraining
Models should be retrained periodically with new data:

```bash
cd ml-service
python train.py
```

### Manual Retraining with Custom Data
```python
from train import train_model

# Train with new dataset
train_model(
    'datasets/user_data.csv',
    'risk_model_updated.pkl',
    'risk_encoders_updated.json',
    'regressor'
)
```

## Error Handling

### ML Service Unavailable
```javascript
try {
  const prediction = await predictWorkerRisk(workerProfile)
} catch (error) {
  // Fallback to default risk score
  console.error('ML prediction failed:', error)
  const defaultRiskScore = 0.5
  // Continue with default value
}
```

### Invalid Input Features
The ML service validates input features:
- Missing required fields → Returns 400 error
- Invalid feature values → Automatically corrected or uses defaults
- Type mismatches → Converts or returns validation error

## Environment Variables

Set these in your `.env` file:
```
ML_SERVICE_URL=http://localhost:5000
FLASK_ENV=production
FLASK_DEBUG=0
```

## Testing the Integration

### 1. Start ML Service
```bash
cd ml-service
python main.py
```

### 2. Start Backend
```bash
cd backend
npm start
```

### 3. Start Frontend
```bash
cd gigshield-ui
npm run dev
```

### 4. Test ML Endpoints
```bash
# Test ML health
curl http://localhost:4000/api/ml/health

# Test risk prediction
curl -X POST http://localhost:4000/api/ml/worker-risk \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "gig_type": "Delivery",
    "monthly_income": 35000,
    "work_hours_per_week": 40,
    "night_shift_ratio": 0.3,
    "vehicle_age_years": 3,
    "traffic_violations": 1,
    "health_score": 75,
    "city_tier": 2,
    "coverage_gap_days": 30
  }'
```

## Troubleshooting

### Models Not Loading
```
Error: Model fraud not loaded
Solution: Ensure train.py has been executed to create .pkl files
```

### Encoding Errors
```
Error: Could not encode column X
Solution: Check that categorical values match training data
```

### CSV Not Being Created
```
Error: user_data.csv not found
Solution: Store worker endpoint was not called. Check API logs.
```

### ML Service Connection Failed
```
Error: Failed to connect to ML service
Solution: Ensure ML service is running on port 5000
```

## Next Steps

1. **Monitor Model Performance**: Track prediction accuracy over time
2. **Implement A/B Testing**: Test different model versions
3. **Add Real-time Feedback**: Use user feedback to improve models
4. **Expand Feature Set**: Add more predictive features as data grows
5. **Implement AutoML**: Use automated machine learning for optimization
6. **Create Admin Dashboard**: Display model metrics and analytics

## Dataset Schema

### user_data.csv
```csv
worker_id,age,gig_type,gig_platform,monthly_income,work_hours_per_week,health_condition,location_risk_score,city_tier,timestamp
WRK-001,32,Freelance Tech,Blinkit,53957,31,Fair,5.2,2,2026-04-17T10:30:00Z
```

### Datasets Used for Training
- `fraud_data.csv`: 1000 records for fraud detection
- `insurance_data.csv`: 1000 records for price prediction
- `risk_data.csv`: 1000 records for risk assessment
- `claims_data.csv`: 1000 records for claim approval

## Contact & Support
For issues or questions about the ML integration, contact the GigShield development team.
