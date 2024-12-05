import React from 'react';
import { Button } from 'primereact/button';

const DownloadExcelButton: React.FC = () => {
  const downloadExcel = () => {
    const link = document.createElement('a');
    link.href = `@/assets/template_excel/templateExcelFormForCreate.xlsx`;
    link.download = 'templateExcelFormForCreate.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <Button label="Download Excel" icon="pi pi-download" onClick={downloadExcel} />;
};

export default DownloadExcelButton;
