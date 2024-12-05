import { Button } from 'primereact/button';
import { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import ButtonExportExcel from '@/components/activities/ButtonExportExcel';
import { ButtonCRUD } from '@/components/activities/ButtonCRUD';

export default function FindActivity() {
  // save value radiobutton
  const [selectedOption, setSelectedOption] = useState<string>('Đơn vị');

  const fetchData = async () => {};

  return (
    <div className="flex justify-center items-center h-screen bg-[#D8DBE0]">
      <div className="w-[95%] h-[90%] rounded-md bg-white mb-3">
        <div className="flex justify-between w-full my-2">
          <h1 className="header-sub text-4xl text-black my-auto ml-3">Tìm kiếm</h1>
          <ButtonCRUD
            bgColor="#45444e"
            children={<span className="mx-2">Quay lại</span>}
            icon="pi pi-undo"
            action="back"
            fetchData={fetchData}
          />
        </div>
        <hr />

        <div className="mx-3">
          <div className="flex flex-wrap gap-3 mt-3">
            {/* checked: ktra gtri ban đầu/ gtri hiện tại có phải là value để sáng */}
            {/* onchange có sự thay đổi sẽ lưu vao selectOption */}
            <div className="flex align-items-center">
              <RadioButton
                inputId="ingredient1"
                name="pizza"
                value="Đơn vị"
                checked={selectedOption === 'Đơn vị'}
                onChange={(e) => setSelectedOption(e.value)}
              />
              <label htmlFor="ingredient1" className="ml-2 text-black">
                Lọc theo đơn vị
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="ingredient2"
                name="pizza"
                value="Cá nhân"
                checked={selectedOption === 'Cá nhân'}
                onChange={(e) => setSelectedOption(e.value)}
              />
              <label htmlFor="ingredient2" className="ml-2 text-black">
                Lọc theo cá nhân
              </label>
            </div>
          </div>

          <label htmlFor="filter" className="mt-3 text-xl text-black block">
            {selectedOption ? selectedOption : ''}
          </label>
          <Dropdown
            className="w-full p-inputtext-lg mb-3"
            // value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities}
            id="filter"
            optionLabel="name"
            placeholder="Select..."
          />

          <label htmlFor="day-to" className="mt-3 text-black text-xl">
            Từ ngày
          </label>
          <Calendar
            className="w-full p-inputtext-lg mt-1"
            id="day-to"
            placeholder="dd/mm/yyyy"
            // id="buttondisplay" value={date} onChange={(e) => setDate(e.value)}
            showIcon
          />

          <label htmlFor="to-day" className="mt-3 mb-1 text-xl text-black block">
            Đến ngày
          </label>
          <Calendar
            className="w-full p-inputtext-lg"
            id="to-day"
            placeholder="dd/mm/yyyy"
            // id="buttondisplay" value={date} onChange={(e) => setDate(e.value)}
            showIcon
          />

          <Button
            label={'Tìm'}
            className="hover:bg-opacity-50 text-[16px] rounded-md w-36 h-10 px-2 py-1 my-2 mr-2 bg-[#321fdb] border-none text-white"
          ></Button>
          <hr className="mb-3" />

          <DataTable
            // value={products}
            tableStyle={{ minWidth: '50rem' }}
          >
            <Column field="code" header="STT"></Column>
            <Column field="name" header="MSCB"></Column>
            <Column field="category" header="Họ và tên lót"></Column>
            <Column field="" header="Tên"></Column>
            <Column field="" header="Nội dung hoạt động"></Column>
            <Column field="" header="Ngày diễn ra"></Column>
            <Column field="" header="Ngày kết thúc"></Column>
            <Column field="" header="Người tạo"></Column>
            <Column field="" header="Công đoàn"></Column>
          </DataTable>

          {ButtonExportExcel()}
        </div>
      </div>
    </div>
  );
}
