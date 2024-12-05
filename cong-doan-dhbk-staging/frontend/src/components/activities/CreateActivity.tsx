import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { toast } from 'react-toastify';
import 'primeicons/primeicons.css';

import { useEffect, useState } from 'react';
import { AllCg, CategoryAPI } from '@/services/category';
import { AllAct, ActivityAPI } from '@/services/activity';
import { DepartmentsInfo } from '@/services/user';
import axiosClient from '@/services/httpClient';

interface CreateActivityProgs {
  onClose: () => void;
  action?: string;
  infAct?: AllAct;
  fetchData: () => Promise<void>;
}
export const CreateActivity: React.FC<CreateActivityProgs> = ({ onClose, action = 'Thêm mới', infAct, fetchData }) => {
  //cách định nghĩa obj nhanh hơn : const [input, setInput] = useState<AllAct | null>(null);
  const [input, setInput] = useState<AllAct>(
    infAct ?? {
      id: '',
      name: '',
      imgURL: '',
      activityStartDate: '',
      activityEndDate: '',
      description: '',
      updateAt: '',

      category: { id: '', name: 'Chọn loại hoạt động', updatedAt: '' },
      unionDept: { id: '', name: 'Chọn công đoàn' },

      ids: [''],
      participants: [''],
    },
  );
  const [dataCg, setDataCg] = useState<AllCg[]>([]);
  const [dataUnion, setDataUnion] = useState<DepartmentsInfo[]>([]);

  //! chưa đẩy useState lên cho chức năng update được :)))
  // const [cgTerm, setCgTerm] = useState<AllCg>(
  //   infAct?.category ?? { id: '', name: '', updatedAt: '' });
  // const [unionTerm, setUnionTerm] = useState<DepartmentsInfo>(
  //   infAct?.unionDept ?? { id: '', name: '' });
  // console.log(cgTerm.name);

  useEffect(() => {
    const fetchUnions = async () => {
      try {
        const response = await axiosClient.get('/union-department/all-name');
        return setDataUnion(response.data.data);
      } catch (error) {
        console.log(error);
        return;
      }
    };
    fetchUnions();

    const fetchOptions = async () => setDataCg((await CategoryAPI.getAll()).data);
    fetchOptions();
  }, [infAct, input]);

  //có sự thay đổi từ options
  const handleInputChange = (field: keyof AllAct, value: string) => {
    setInput((prevState: AllAct) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      input.name === '' ||
      input.activityStartDate === '' ||
      input.activityEndDate === '' ||
      input.category.id === '' ||
      input.unionDept.id === '' ||
      input.imgURL === '' ||
      input.description === ''
    ) {
      toast.error('Thiếu thông tin');
    } else {
      if (action === 'Thêm mới') await ActivityAPI.create(input);
      else {
        if (
          infAct && //ktra có sự thay đổi hay ko
          (input.name !== infAct.name ||
            input.activityStartDate !== infAct.activityStartDate ||
            input.activityEndDate !== infAct.activityEndDate ||
            input.category.id !== infAct.category.id ||
            input.unionDept.id !== infAct.unionDept.id ||
            input.imgURL !== infAct.imgURL ||
            input.description !== infAct.description)
        ) {
          input.updateAt = new Date().toString();
          await ActivityAPI.update(input);
        }
      }
      fetchData(); // Call fetchData to update the data in the parent component
      onClose();
      toast.success(`${action} thành công`);
    }
  };

  return (
    <>
      <div className="fixed flex justify-center items-center top-0 bottom-0 left-0 right-0 z-50 bg-black bg-opacity-[.5]">
        <div className="w-[500px] bg-white rounded-lg">
          <div className="header-add flex justify-between items-center my-2 mx-3">
            <h1 className="text-black text-4xl">{action} hoạt động</h1>
            <Button
              className="hover:border-spacing-2 hover:border-[#321fdb] bg-transparent border-none"
              onClick={onClose}
              icon="pi pi-times-circle text-2xl"
            ></Button>
          </div>
          <hr />

          <div className=" mx-3 my-2">
            <label className="mb-1 text-xl text-black block">Ngày diễn ra hoạt động</label>
            <Calendar
              className="w-full p-inputtext-lg"
              placeholder="dd/mm/yyyy"
              value={new Date(input.activityStartDate)}
              onChange={(e) => handleInputChange('activityStartDate', e.value ? e.value.toISOString() : '')}
              showIcon
            />

            <label className="mt-2 mb-1 text-xl text-black block">Ngày kết thúc hoạt động</label>
            <Calendar
              className="w-full p-inputtext-lg"
              placeholder="dd/mm/yyyy"
              value={new Date(input.activityEndDate)}
              onChange={(e) => handleInputChange('activityEndDate', e.value ? e.value.toISOString() : '')}
              showIcon
            />

            <label className="mt-2 mb-1 text-xl text-black block">Tên hoạt động</label>
            <InputText
              className="w-full p-inputtext-lg"
              placeholder="Tên hoạt động"
              value={input.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />

            <label className="mt-2 text-xl mb-1 text-black block">Loại hoạt động</label>
            <Dropdown
              className="w-full p-inputtext-lg text-blue-800"
              value={input?.category}
              // value={cgTerm}
              onChange={(e: DropdownChangeEvent) => {
                handleInputChange('category', e.value);
              }}
              options={dataCg}
              optionLabel="name" // trường trong options
              placeholder={input.category.name}
            />

            <label className="mt-2 text-xl mb-1 text-black block">Công đoàn bộ phận</label>
            <Dropdown
              className="w-full p-inputtext-lg text-blue-800"
              value={input?.unionDept}
              // value={unionTerm.name}
              onChange={(e: DropdownChangeEvent) => handleInputChange('unionDept', e.value)}
              options={dataUnion}
              optionLabel="name" // trường trong options
              placeholder={input.unionDept.name}
            />

            <label className="mt-2 mb-1 text-black text-xl block">Đường dẫn hình ảnh hoạt động</label>
            <InputText
              className="w-full p-inputtext-lg"
              placeholder="Đường dẫn hình ảnh hoạt động"
              value={input.imgURL}
              onChange={(e) => handleInputChange('imgURL', e.target.value)}
            />

            <label className="mt-2 mb-1 text-black text-xl block">Nội dung hoạt động</label>
            <InputTextarea
              className="w-full"
              value={input.description}
              onChange={(e) => {
                handleInputChange('description', e.target.value);
              }}
              rows={4}
              cols={4}
            />
          </div>

          <hr />
          <div className="mr-3 flex justify-end items-center mb-3">
            <Button
              className="hover:bg-opacity-50 text-[16px] px-3 py-2 mt-3 bg-[#321fdb] border-none text-white"
              onClick={handleSubmit}
              label={action}
            ></Button>
          </div>
        </div>
      </div>
    </>
  );
};
