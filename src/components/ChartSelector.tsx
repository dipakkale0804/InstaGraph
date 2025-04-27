
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ChartBar, ChartLine, ChartPie } from 'lucide-react';
import { Label } from '@/components/ui/label';

export type ChartType = 'bar' | 'line' | 'pie';

interface ChartSelectorProps {
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
  columns: string[];
  selectedColumn: string;
  onColumnChange: (column: string) => void;
  numericalColumns: string[];
}

const ChartSelector: React.FC<ChartSelectorProps> = ({
  chartType,
  onChartTypeChange,
  columns,
  selectedColumn,
  onColumnChange,
  numericalColumns
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="w-full md:w-1/2">
        <Label htmlFor="chart-type" className="mb-2 block">Chart Type</Label>
        <Select value={chartType} onValueChange={(value) => onChartTypeChange(value as ChartType)}>
          <SelectTrigger id="chart-type" className="w-full">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar" className="flex items-center">
              <div className="flex items-center">
                <ChartBar className="mr-2 h-4 w-4" /> 
                Bar Chart
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <ChartLine className="mr-2 h-4 w-4" /> 
                Line Chart
              </div>
            </SelectItem>
            <SelectItem value="pie">
              <div className="flex items-center">
                <ChartPie className="mr-2 h-4 w-4" /> 
                Pie Chart
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-1/2">
        <Label htmlFor="data-column" className="mb-2 block">Data Column</Label>
        <Select 
          value={selectedColumn} 
          onValueChange={onColumnChange}
          disabled={numericalColumns.length === 0}
        >
          <SelectTrigger id="data-column" className="w-full">
            <SelectValue placeholder={numericalColumns.length === 0 ? 
              "No numerical columns found" : "Select data column"} 
            />
          </SelectTrigger>
          <SelectContent>
            {numericalColumns.map(column => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChartSelector;
