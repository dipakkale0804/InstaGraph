
import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onDataLoaded: (data: any[], columns: string[]) => void;
  className?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onDataLoaded, 
  className,
  buttonVariant = "outline",
  buttonSize = "default",
  buttonText = "Upload a new file"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file) return;
    
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
      'text/csv', // csv
      'application/csv', // csv
      'text/x-csv', // csv
      'application/x-csv' // csv
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        
        // Convert to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          toast({
            title: "Empty dataset",
            description: "The uploaded file doesn't contain any data",
            variant: "destructive",
          });
          return;
        }
        
        // Extract column names from the first row
        const columns = Object.keys(jsonData[0]);
        
        onDataLoaded(jsonData, columns);
        
        toast({
          title: "File uploaded successfully",
          description: `${jsonData.length} rows loaded`,
        });
      } catch (error) {
        console.error("Error parsing file:", error);
        toast({
          title: "Error parsing file",
          description: "Please check if your file is valid",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // For direct button display
  if (buttonText) {
    return (
      <div className={className}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
        />
        <Button 
          variant={buttonVariant} 
          size={buttonSize} 
          onClick={handleButtonClick}
          className={buttonVariant === "default" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          <Upload className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </div>
    );
  }
  
  // Original drag and drop interface
  return (
    <div className={`w-full ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".csv,.xlsx,.xls"
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center py-4">
          <Upload className="w-10 h-10 text-blue-500 mb-3" />
          <p className="text-lg font-medium mb-1">Drag & drop or click to upload</p>
          <p className="text-sm text-gray-500">CSV or Excel files only (.csv, .xlsx)</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
