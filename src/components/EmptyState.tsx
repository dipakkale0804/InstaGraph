
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUpload from './FileUpload';

interface EmptyStateProps {
  onUploadClick: () => void;
  onDataLoaded: (data: any[], columns: string[]) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onUploadClick, onDataLoaded }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="bg-blue-50 p-6 rounded-full mb-6">
        <Upload className="w-12 h-12 text-blue-500" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Upload your dataset</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        Upload a CSV or Excel file to visualize your data. You can create 
        bar charts, line graphs, and pie charts.
      </p>
      <FileUpload 
        onDataLoaded={onDataLoaded}
        className="w-auto"
        buttonVariant="default"
        buttonSize="lg"
        buttonText="Select a file"
      />
      <p className="text-xs text-gray-400 mt-4">
        Supported formats: .csv, .xlsx
      </p>
    </div>
  );
};

export default EmptyState;
