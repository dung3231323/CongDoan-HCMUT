import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { toast } from 'react-toastify';

import { AllCg, CategoryAPI } from '@/services/category';
import { useEffect, useState } from 'react';

interface CreateActivityProgs {
  onClose: () => void;
  action?: string;
  infCg?: AllCg;
  fetchData: () => Promise<void>;
}
export const CreateCategory: React.FC<CreateActivityProgs> = ({ onClose, action = 'Thêm mới', infCg, fetchData }) => {
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (action === 'Cập nhật' && infCg) setInput(infCg.name);
  }, [action, infCg]);

  const handleSubmit = async (): Promise<void> => {
    if (input === '') toast.error('Thiếu thông tin');
    else {
      if (action === 'Thêm mới') await CategoryAPI.create(input);
      else {
        //ktra có sự thay đổi hay ko
        if (infCg && infCg.name !== input) {
          infCg.name = input;
          infCg.updatedAt = new Date().toString();
          await CategoryAPI.update(infCg);
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
            <h1 className="text-black text-4xl">{action} loại hoạt động</h1>
            <Button
              className="hover:border-spacing-2 hover:border-[#321fdb] bg-transparent border-none"
              onClick={onClose}
              icon="pi pi-times-circle text-2xl"
            ></Button>
          </div>
          <hr />

          <div className=" mx-3 my-2">
            <label className="mt-2 mb-1 text-xl text-black block">Tên loại hoạt động</label>
            <InputText
              className="w-full p-inputtext-lg"
              placeholder="Tên loại hoạt động"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <hr />
          <div className="mr-3 flex justify-end items-center mb-3">
            <Button
              className="hover:bg-opacity-50 text-[16px] px-3 py-2 mt-3 bg-[#321fdb] border-none text-white"
              label={action}
              onClick={handleSubmit}
            ></Button>
          </div>
        </div>
      </div>
    </>
  );
};
