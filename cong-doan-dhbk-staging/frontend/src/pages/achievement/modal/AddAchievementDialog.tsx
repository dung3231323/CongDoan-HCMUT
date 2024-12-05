import React, { useState } from 'react';

import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Nullable } from 'primereact/ts-helpers';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
// import { Input } from 'postcss';
import { Button } from 'primereact/button';
import achievementSlice from '@/states/slices/achievement';
import { RootState } from '@/states/store';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { toast } from 'react-toastify';
import { AchievementAPI, createBody, APIResponse } from '@/services/achievement';
import { Achievement } from '@/types/achievement';
import { Faculty } from '@/types/faculty';
const AddAchievementDialog: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const dispatch = useDispatch();
  // const addNewVisible = useTypedSelector((state) => state.achievement.addNewVisible);
  const faculties = useTypedSelector((state) => state.achievement.faculties);
  const lazyParams = useTypedSelector((state) => state.achievement.lazyParams);

  const [date, setDate] = useState<Nullable<Date>>(null);
  const [no, setNo] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [faculty, setFaculty] = useState<Faculty | undefined>(undefined);
  // const [typeActi, setTypeActi] = useState<Nullable<string>>(null);
  const handleSubmit = async () => {
    if (!date || !no || !content || !faculty) {
      toast.error('Vui lòng nhập đủ thông tin');
      return;
    }
    const createBody: createBody = {
      signDate: date.toISOString(),
      no: no,
      content: content,
      facultyId: faculty.id,
    };
    console.log('createBody', createBody);
    try {
      const response = await AchievementAPI.create(createBody);
      if (response) {
        const fetchResponse: APIResponse<Achievement[]> | undefined = await AchievementAPI.getAll(
          lazyParams.page,
          lazyParams.rows,
        );

        if (fetchResponse) {
          dispatch(achievementSlice.actions.setAchievementData(fetchResponse.data || []));
        }
        if (fetchResponse) {
          dispatch(achievementSlice.actions.setAchievementData(fetchResponse.data || []));
        }
      }
      // dispatch(userSlice.actions.setLoading(true));
      // const fetchResponse: ApiResponse | undefined = await UserAPI.get(lazyParams.page + 1, lazyParams.rows);
      // if (fetchResponse) {
      //     dispatch(userSlice.actions.setData({
      //         data: fetchResponse.data,
      //         metadata: fetchResponse.metadata,
      //     }));
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      // dispatch(userSlice.actions.setLoading(false));
      toast.success('Thêm dữ liệu thành công');
    }
  };

  const footerContent = (
    <div>
      <Button
        label="Đóng"
        icon="pi pi-times"
        onClick={() => {
          dispatch(achievementSlice.actions.setAddNewVisible(false));
        }}
        className="p-button-text"
      />
      <Button
        label="Thêm mới"
        icon="pi pi-check"
        onClick={() => {
          handleSubmit();
          dispatch(achievementSlice.actions.setAddNewVisible(false));
        }}
        autoFocus
      />
    </div>
  );
  return (
    <Dialog
      footer={footerContent}
      dismissableMask={true}
      closeOnEscape={true}
      header="Thêm mới: Hoạt động"
      visible={true}
      style={{ width: '50vw' }}
      onHide={() => {
        dispatch(achievementSlice.actions.setAddNewVisible(false));
      }}
    >
      <div className="formgrid grid">
        <div className="field col-12 md:col-6">
          <label htmlFor="no">Số quyết định</label>
          <div>
            <InputText type="text" className="w-full" id="no" value={no} onChange={(e) => setNo(e.target.value)} />
          </div>
        </div>
        <div className="field col-12 md:col-6">
          <label htmlFor="date">Ngày ký khen thưởng</label>
          <Calendar
            className="w-full"
            id="date"
            value={date}
            onChange={(e) => setDate(e.value)}
            dateFormat="dd/mm/yy"
          />
        </div>
        <div className="field col-12 md:col-12">
          <label htmlFor="content">Nội dung khen thưởng</label>
          <div>
            <InputText
              type="text"
              className="w-full"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <div className="field col-12 md:col-12">
          <label htmlFor="facultyId">Đơn vị khen thưởng</label>
          <div>
            <Dropdown
              name="falcuty"
              placeholder="Select..."
              className="w-full "
              id="facultyId"
              value={faculty}
              options={faculties}
              optionLabel="name"
              onChange={(e) => setFaculty(e.value)}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddAchievementDialog;
