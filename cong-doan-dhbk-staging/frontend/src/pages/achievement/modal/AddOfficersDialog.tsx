import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

// import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
// import { Nullable } from 'primereact/ts-helpers';
// import { Dropdown } from 'primereact/dropdown';
// import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
// import { Input } from 'postcss';
import { Button } from 'primereact/button';
// import { Achievement } from '@/components/types/achievement';
import achievementSlice from '@/states/slices/achievement';
// import { RootState } from '@/states/store';

const AddOfficersDialog: React.FC = () => {
  // const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const dispatch = useDispatch();

  const footerContent = (
    <div>
      <Button
        label="Xem trước"
        onClick={() => {
          dispatch(achievementSlice.actions.setAddOfficersVisible(false));
        }}
        autoFocus
      />
      <Button
        label="Đóng"
        onClick={() => {
          dispatch(achievementSlice.actions.setAddOfficersVisible(true));
        }}
        className="p-button-text"
      />
    </div>
  );
  const [officers, setOfficers] = useState<string>('');

  return (
    <Dialog
      footer={footerContent}
      dismissableMask={true}
      closeOnEscape={true}
      header="Thêm danh sách Công đoàn viên đạt thành tích"
      visible={true}
      style={{ width: '50vw' }}
      onHide={() => {
        dispatch(achievementSlice.actions.setAddOfficersVisible(true));
      }}
    >
      <div className="card flex justify-content-center">
        <InputTextarea
          value={officers}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOfficers(e.target.value)}
          rows={10}
          cols={500}
        />
      </div>
    </Dialog>
  );
};

export default AddOfficersDialog;
