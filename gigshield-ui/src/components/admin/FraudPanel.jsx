import { useEffect, useState } from 'react';
import FraudGraph from '../graphs/FraudGraph';
import ClaimGraph from '../graphs/ClaimGraph';
import { getMlAnalytics, predictFraud } from '../../api/mlApi';

const sampleFraudPayload = {
  age: 34,
  policy_duration_days: 365,
  claim_amount: 8500,
  monthly_income: 30000,
  num_claims_past_year: 1,
  claim_to_income_ratio: 0.28,
  response_time_hours: 6,
  inconsistency_score: 0.08,
  ip_location_mismatch: 0,
  document_auth_score: 0.92,
  previous_fraud_flag: 0
};

const FraudPanel = () => {
  const [fraudData, setFraudData] = useState([]);
  const [claimData, setClaimData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        const analytics = await getMlAnalytics();
        if (!cancelled) {
          setFraudData(analytics.graphs?.fraud ?? []);
          setClaimData(analytics.graphs?.claim ?? []);
        }
      } catch (error) {
        console.error('Could not load ML analytics', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePredict = async () => {
    try {
      const result = await predictFraud(sampleFraudPayload);
      const fraudClass = result.fraud?.[0];
      const fraudProbability = result.probability?.[0]?.[1];
      setPrediction({
        label: fraudClass ? 'High fraud risk' : 'Low fraud risk',
        score: fraudProbability !== undefined ? `${(fraudProbability * 100).toFixed(1)}%` : 'N/A'
      });
    } catch (error) {
      console.error('Prediction failed', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-text-primary">Fraud Detection Analytics</h2>
            <p className="text-xs text-text-muted">Built from `fraud_data.csv` and `claims_data.csv`.</p>
          </div>
          <button onClick={handlePredict} className="px-4 py-2 rounded-xl bg-danger/10 text-danger text-sm font-semibold">
            Run Fraud Check
          </button>
        </div>
        {prediction && (
          <div className="rounded-xl bg-dark-surface p-3 mb-4">
            <p className="text-xs text-text-muted">Sample claim result</p>
            <p className="text-lg font-bold text-text-primary">{prediction.label}</p>
            <p className="text-sm text-danger">{prediction.score}</p>
          </div>
        )}
        {loading && <p className="text-xs text-text-muted mb-4">Loading dataset analytics...</p>}
        <FraudGraph data={fraudData} />
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-1">Claim Outcome Split</h3>
        <p className="text-xs text-text-muted mb-4">Approval vs rejection mix derived from the claims dataset.</p>
        <ClaimGraph data={claimData} />
      </div>
    </div>
  );
};

export default FraudPanel;
