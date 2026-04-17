import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PriceGraph = ({ data = [] }) => {
  const processedData = Array.isArray(data) && data.length > 0 ? data : [
    { name: 'Jan', price: 99, riskScore: 0.45 },
    { name: 'Feb', price: 105, riskScore: 0.48 },
    { name: 'Mar', price: 98, riskScore: 0.42 },
    { name: 'Apr', price: 112, riskScore: 0.52 },
    { name: 'May', price: 108, riskScore: 0.50 },
    { name: 'Jun', price: 115, riskScore: 0.54 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length > 0) {
      return (
        <div className="bg-gray-800 text-white p-2 rounded shadow-lg text-sm">
          <p className="font-semibold">{payload[0].payload.name}</p>
          <p className="text-blue-400">Premium: Rs {Number(payload[0].value).toFixed(2)}</p>
          {payload[0].payload.riskScore !== undefined && (
            <p className="text-orange-400">Risk: {(payload[0].payload.riskScore * 100).toFixed(1)}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={processedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,114,160,0.18)" />
        <XAxis dataKey="name" stroke="#7C72A0" />
        <YAxis stroke="#7C72A0" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#a45b33" strokeWidth={2} name="Premium" dot={{ fill: '#a45b33' }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceGraph;
