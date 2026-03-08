'use clinet';
import { useNDVITrendChart } from '@/src/app/store/analysisStore';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// TODO : ndvitrend chart 바뀔때만 랜더링되는지 확인하기
export default React.memo(function NDVITrendChart() {
  const data = useNDVITrendChart();
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
});
