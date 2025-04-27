import React, { useState, useMemo } from 'react';
import FileUpload from '@/components/FileUpload';
import DataTable from '@/components/DataTable';
import ChartSelector, { ChartType } from '@/components/ChartSelector';
import DataVisualization from '@/components/DataVisualization';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('data');

  // Check if a value is numerical
  const isNumeric = (value: any) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  // Filter columns that contain numerical data
  const numericalColumns = useMemo(() => {
    if (!data.length) return [];

    return columns.filter(column => {
      // Check the first 10 rows (or fewer if data has less than 10 rows)
      const rowsToCheck = Math.min(10, data.length);
      let numericCount = 0;

      for (let i = 0; i < rowsToCheck; i++) {
        const value = data[i][column];
        if (isNumeric(value)) {
          numericCount++;
        }
      }
      
      // Consider a column numerical if at least 70% of checked values are numbers
      return numericCount / rowsToCheck >= 0.7;
    });
  }, [data, columns]);

  // Handle data loading from file upload
  const handleDataLoaded = (newData: any[], newColumns: string[]) => {
    setData(newData);
    setColumns(newColumns);
    
    // Automatically select the first numerical column
    if (newColumns.length > 0) {
      // Check if any column has numerical data
      const firstNumColumn = newColumns.find(col => {
        return newData.some(row => isNumeric(row[col]));
      });

      if (firstNumColumn) {
        setSelectedColumn(firstNumColumn);
      }
    }

    // Switch to data tab once data is loaded
    setActiveTab('data');
  };

  // Reset the application state
  const handleReset = () => {
    setData([]);
    setColumns([]);
    setSelectedColumn('');
  };

  // Check if no data is loaded
  const noData = data.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chart Data Preview</h1>
        <p className="text-gray-500">Upload a CSV or Excel file to visualize your data</p>
      </div>

      {noData ? (
        <EmptyState 
          onUploadClick={() => {}} 
          onDataLoaded={handleDataLoaded} 
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <FileUpload 
              onDataLoaded={handleDataLoaded} 
              buttonText="Upload a new file"
              buttonVariant="outline" 
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dataset Preview and Visualization</CardTitle>
              <CardDescription>
                {data.length} rows and {columns.length} columns loaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="data">Data Table</TabsTrigger>
                  <TabsTrigger value="chart">Visualization</TabsTrigger>
                </TabsList>
                
                <TabsContent value="data">
                  <DataTable data={data} columns={columns} />
                </TabsContent>
                
                <TabsContent value="chart">
                  <ChartSelector
                    chartType={chartType}
                    onChartTypeChange={setChartType}
                    columns={columns}
                    selectedColumn={selectedColumn}
                    onColumnChange={setSelectedColumn}
                    numericalColumns={numericalColumns}
                  />
                  
                  <DataVisualization
                    data={data}
                    chartType={chartType}
                    dataColumn={selectedColumn}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Index;
