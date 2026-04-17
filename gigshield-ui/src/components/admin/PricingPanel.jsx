import { useEffect, useState } from 'react';
import PriceGraph from '../graphs/PriceGraph';
import RiskGraph from '../graphs/RiskGraph';
import { getMlAnalytics, predictPrice, predictWorkerRisk } from '../../api/mlApi';

const samplePricingPayload = {
  age: 30,
  gig_platform: 'Zepto',
  monthly_income: 30000,
  work_hours_per_week: 48,
  years_experience: 2,
  health_condition: 'Fair',
  coverage_type: 'Accident Only',
  location_risk_score: 5.8,
  num_dependents: 0,
  past_accidents: 0,
  city_tier: 1
};

const sampleRiskPayload = {
  age: 30,
  gig_type: 'Delivery',
  monthly_income: 30000,
  work_hours_per_week: 48,
  night_shift_ratio: 0.25,
  vehicle_age_years: 4,
  traffic_violations: 0,
  health_score: 72,
  city_tier: 1,
  coverage_gap_days: 0
};

const PricingPanel = () => {
  const [priceData, setPriceData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [riskPrediction, setRiskPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        const analytics = await getMlAnalytics();
        if (!cancelled) {
          setPriceData(analytics.graphs?.price ?? []);
          setRiskData(analytics.graphs?.risk ?? []);
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
      const [priceResult, riskResult] = await Promise.all([
        predictPrice(samplePricingPayload),
        predictWorkerRisk(sampleRiskPayload)
      ]);
      setPrediction(Number(priceResult.price?.[0] ?? 0).toFixed(2));
      setRiskPrediction(((riskResult.riskScore ?? 0) * 100).toFixed(1));
    } catch (error) {
      console.error('Prediction failed', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-text-primary">Pricing Intelligence</h2>
            <p className="text-xs text-text-muted">Live graph data generated from the ML CSV datasets.</p>
          </div>
          <button onClick={handlePredict} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold">
            Run Sample Prediction
          </button>
        </div>
        {(prediction || riskPrediction) && (
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-dark-surface p-3">
              <p className="text-xs text-text-muted">Estimated annual premium</p>
              <p className="text-lg font-bold text-text-primary">Rs {prediction ?? '--'}</p>
            </div>
            <div className="rounded-xl bg-dark-surface p-3">
              <p className="text-xs text-text-muted">Predicted risk score</p>
              <p className="text-lg font-bold text-text-primary">{riskPrediction ?? '--'}%</p>
            </div>
          </div>
        )}
        {loading && <p className="text-xs text-text-muted mb-4">Loading dataset analytics...</p>}
        <PriceGraph data={priceData} />
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold text-text-primary mb-1">Risk by Worker Segment</h3>
        <p className="text-xs text-text-muted mb-4">Average risk pulled directly from `risk_data.csv`.</p>
        <RiskGraph data={riskData} />
      </div>
    </div>
  );
};

export default PricingPanel;
