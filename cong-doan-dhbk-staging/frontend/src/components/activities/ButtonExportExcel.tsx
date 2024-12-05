import { Button } from 'primereact/button';
import { useState, useEffect } from 'react';
import { ProductService } from '@/services/ProductService';

interface Product {
  STT: number;
  MSCB: number;
  'Họ và tên lót': string;
  Tên: string;
  'Nội dung hoạt đông': string;
  'Ngày diễn ra': string;
  'Ngày kết thúc': string;
  'Người tạo': string;
  'Công đoàn': string;
}
export default function ExportExcel() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
  }, []);

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      saveAsExcelFile(excelBuffer, 'products');
    });
  };

  const saveAsExcelFile = (buffer: Uint8Array, fileName: string) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION: string = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };
  return (
    <Button
      className="w-36 h-10 px-2 py-1 my-2 mr-2 bg-[#321fdb] border-none text-white hover:bg-opacity-50 text-[16px]"
      type="button"
      icon="pi pi-file-excel"
      label="Xuất Excel"
      severity="success"
      onClick={exportExcel}
      data-pr-tooltip="XLS"
    />
  );
}
