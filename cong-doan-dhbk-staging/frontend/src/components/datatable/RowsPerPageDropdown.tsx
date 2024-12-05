import React from 'react';
import { Dropdown } from 'primereact/dropdown';

interface RowsPerPageDropdownProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

const RowsPerPageDropdown: React.FC<RowsPerPageDropdownProps> = ({ options, value, onChange }) => {
  return (
    <div className="rows-per-page-dropdown">
      <Dropdown
        value={value}
        options={options.map((opt) => ({ label: `${opt} dòng/trang`, value: opt }))}
        onChange={(e) => onChange(e.value)}
        placeholder="Số dòng mỗi trang"
      />
    </div>
  );
};

export default RowsPerPageDropdown;
