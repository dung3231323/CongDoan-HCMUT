import { Button } from 'primereact/button';
import { toast } from 'react-toastify';

import { AllAct, ActivityAPI } from '@/services/activity';

interface AskDeleteActivityProps {
  onClose: () => void;
  infAct?: AllAct;
  fetchData: () => Promise<void>;
}
export const AskDeleteActivity = (obj: AskDeleteActivityProps) => {
  const handleSubmit = async () => {
    if (obj.infAct) await ActivityAPI.del(obj.infAct.id);
    obj.fetchData(); // Call fetchData to update the data in the parent component
    obj.onClose();
    toast.success(`Xoá thành công`);
  };

  return (
    <div className="fixed z-50 top-0 bottom-0 left-0 right-0 bg-black bg-opacity-[50%] flex justify-center items-center">
      <div className="w-[60%] bg-white">
        <div className="flex justify-between items-center mx-3 my-1">
          <h1 className="text-4xl text-black">Xóa hoạt động</h1>
          <Button
            icon={'pi pi-times-circle text-2xl'}
            onClick={obj.onClose}
            className=" bg-white hover:bg-slate-200 border-none"
          ></Button>
        </div>
        <hr />
        <div className="m-3 text-xl text-black whitespace-normal">
          Bạn có muốn xóa Hoạt động có tên <strong> {obj.infAct?.name} </strong> ra khỏi hệ thống?
        </div>
        <hr />
        <Button
          className="bg-red-400 hover:bg-red-500 border-none px-[2%] m-3 float-right text-xl text-white"
          onClick={handleSubmit}
        >
          Đồng ý
        </Button>
      </div>
    </div>
  );
};
