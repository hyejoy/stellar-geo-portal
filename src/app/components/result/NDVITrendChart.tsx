'use clinet';
import { useNDVITrendChart } from '@/src/app/store/analysisStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// const data = [
//   { year: 2018, ndvi: 0.05 },
//   { year: 2019, ndvi: 0.12 },
//   { year: 2020, ndvi: 0.18 },
//   { year: 2021, ndvi: 0.25 },
//   { year: 2022, ndvi: 0.35 },
//   { year: 2023, ndvi: 0.42 },
//   { year: 2024, ndvi: 0.6 },
// ];

export default function NDVITrendChart() {
  const data = useNDVITrendChart();
  console.log('>>>', data);
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#2a2c31" />
          <XAxis dataKey="year" stroke="#888" />
          <YAxis stroke="#888" />
          <Line type="monotone" dataKey="mean" stroke="#facc15" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
