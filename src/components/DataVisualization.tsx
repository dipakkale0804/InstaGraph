
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import type { ChartType } from './ChartSelector';

interface DataVisualizationProps {
  data: any[];
  chartType: ChartType;
  dataColumn: string;
  labelColumn?: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ 
  data, 
  chartType, 
  dataColumn,
  labelColumn 
}) => {
  const colors = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
  ];

  const chartData = useMemo(() => {
    if (!dataColumn) return [];
    
    // For pie charts, aggregate the data by unique values
    if (chartType === 'pie') {
      const aggregatedData: Record<string, number> = {};
      
      data.forEach(item => {
        const value = item[dataColumn];
        if (value !== undefined && value !== null) {
          const key = String(value);
          aggregatedData[key] = (aggregatedData[key] || 0) + 1;
        }
      });
      
      return Object.entries(aggregatedData).map(([name, value]) => ({
        name,
        value
      }));
    }
    
    // For line and bar charts, use the first 50 data points
    return data.slice(0, 50).map((item, index) => {
      const result: Record<string, any> = { index: index + 1 };
      
      // Use the specified label column, or index if not provided
      if (labelColumn && item[labelColumn] !== undefined) {
        result.name = String(item[labelColumn]);
      } else {
        result.name = `Item ${index + 1}`;
      }
      
      if (item[dataColumn] !== undefined) {
        const value = Number(item[dataColumn]);
        result[dataColumn] = isNaN(value) ? 0 : value;
      } else {
        result[dataColumn] = 0;
      }
      
      return result;
    });
  }, [data, dataColumn, chartType, labelColumn]);

  if (!dataColumn || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 border rounded-md bg-gray-50">
        <p className="text-gray-500">Select a data column to visualize</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 border rounded-md p-4">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'bar' ? (
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              interval={0} 
              tick={{ fontSize: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataColumn} fill="#0088FE" />
          </BarChart>
        ) : chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              interval={0} 
              tick={{ fontSize: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataColumn} stroke="#0088FE" activeDot={{ r: 8 }} />
          </LineChart>
        ) : (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default DataVisualization;
