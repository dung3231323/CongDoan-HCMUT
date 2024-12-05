import { Button } from 'primereact/button';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { CreateActivity } from './CreateActivity';
import { AskDeleteActivity } from '@/components/activities/DeleteActivity';
import { CreateCategory } from './CreateCategory';
import { AskDeleteCategory } from './DeleteCategory';
import { AllAct } from '@/services/activity';
import { AllCg } from '@/services/category';

interface ButtonCRUDProgs {
  icon?: string;
  bgColor: string;
  action?: string; // action-show-component
  children?: JSX.Element; // để thêm margin cho text-button (nếu cần các button-width bằng nhau)
  infCg?: AllCg; //truyền AllCg[] từ Category.tsx, tuong tu AllAct[]
  infAct?: AllAct;
  fetchData: () => Promise<void>;
}
export const ButtonCRUD = (obj: ButtonCRUDProgs) => {
  const [isBlockVisible, setIsBlockVisible] = useState<boolean>(false);
  const handleButtonClick = () => {
    // Khi người dùng bấm vào nút, thay đổi trạng thái của khối
    return setIsBlockVisible(!isBlockVisible);
  };

  return (
    <>
      <Button
        icon={obj.icon}
        onClick={handleButtonClick}
        className={`relative p-2 my-2 mr-3 hover:bg-opacity-50 bg-[${obj.bgColor}] border-none text-[16px] text-white`}
        style={{ backgroundColor: obj.bgColor }} //Tailwind CSS không hỗ trợ trực tiếp màu sắc động qua class, gây ra lỗi truyền màu sắc dạng biến.
      >
        {obj.children}
        {obj.action === 'read-activity' ? (
          <Link
            to="/activity-detail"
            state={{ infAct: obj.infAct }} // Truyền infObj vào state của Link, không truyền dc hàm
            className="absolute top-0 bottom-0 left-0 right-0 z-40"
          ></Link>
        ) : (
          <></>
        )}
        {obj.action === 'find' ? (
          <Link to="/activity-search" className="absolute top-0 bottom-0 left-0 right-0"></Link>
        ) : (
          <></>
        )}
        {obj.action === 'back' ? (
          <Link to="/activity" className="absolute top-0 bottom-0 left-0 right-0"></Link>
        ) : (
          <></>
        )}
      </Button>
      {isBlockVisible && (
        <div className="w-0 inline">
          {obj.action === 'create-activity' && <CreateActivity onClose={handleButtonClick} fetchData={obj.fetchData} />}
          {obj.action === 'update-activity' && (
            <CreateActivity
              onClose={handleButtonClick}
              action={'Cập nhật'}
              infAct={obj.infAct}
              fetchData={obj.fetchData}
            />
          )}
          {obj.action === 'delete-activity' && (
            <AskDeleteActivity onClose={handleButtonClick} infAct={obj.infAct} fetchData={obj.fetchData} />
          )}

          {obj.action === 'create-category' && <CreateCategory onClose={handleButtonClick} fetchData={obj.fetchData} />}
          {obj.action === 'update-category' && (
            <CreateCategory
              onClose={handleButtonClick}
              action={'Cập nhật'}
              infCg={obj.infCg}
              fetchData={obj.fetchData}
            />
          )}
          {obj.action === 'delete-category' && (
            <AskDeleteCategory onClose={handleButtonClick} infCg={obj.infCg} fetchData={obj.fetchData} />
          )}
        </div>
      )}
    </>
  );
};
