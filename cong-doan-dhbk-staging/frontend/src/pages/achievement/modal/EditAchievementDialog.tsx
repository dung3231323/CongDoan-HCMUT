import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
// import { Nullable } from 'primereact/ts-helpers';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
// import { Input } from 'postcss';
import { Button } from 'primereact/button';
import { Achievement } from '@/types/achievement';
import { Faculty } from '@/types/faculty';
import achievementSlice from '@/states/slices/achievement';
import { RootState } from '@/states/store';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { AchievementAPI, editBody, APIResponse } from '@/services/achievement';

interface EditAchievementDialogProps {
  editAchievement: Achievement | undefined;
}

const EditAchievementDialog: React.FC<EditAchievementDialogProps> = ({ editAchievement }) => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const dispatch = useDispatch();
  // const editVisible = useTypedSelector((state) => state.achievement.editVisible);
  const lazyParams = useTypedSelector((state) => state.achievement.lazyParams);
  const faculties = useTypedSelector((state) => state.achievement.faculties);
  const [signDate, setSignDate] = useState(editAchievement?.signDate ? new Date(editAchievement.signDate) : undefined);
  const [no, setNo] = useState(editAchievement?.no);
  const [content, setContent] = useState(editAchievement?.content);
  const [faculty, setFaculty] = useState<Faculty | undefined>(
    faculties.find((faculty) => faculty.id === editAchievement?.facultyId),
  );
  // const [typeActi, setTypeActi] = useState<Nullable<string>>(null);
  const handleSubmit = async () => {
    console.log(signDate, no, content, faculty);

    if (!signDate || !no || !content || !faculty) {
      // toast.error('Vui lòng nhập đủ thông tin');
      console.log('Vui lòng nhập đủ thông tin');
      console.log(signDate, no, content, faculty);
      return;
    }
    const editBody: editBody = {
      id: editAchievement?.id || '',
      signDate: signDate?.toISOString(),
      no: no,
      content: content,
      facultyId: faculty.id,
    };
    try {
      // console.log('editBody', editBody);
      const response = await AchievementAPI.edit(editBody);
      if (response) {
        const fetchResponse: APIResponse<Achievement[]> | undefined = await AchievementAPI.getAll(
          lazyParams.page,
          lazyParams.rows,
        );
        if (fetchResponse) {
          // console.log('1');
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
    }
    // toast.success('Thêm dữ liệu thành công');
  };
  const footerContent = (
    <div>
      <Button
        label="Đóng"
        icon="pi pi-times"
        onClick={() => {
          dispatch(achievementSlice.actions.setEditVisible(false));
        }}
        className="p-button-text"
      />
      <Button
        label="Cập nhật"
        icon="pi pi-check"
        onClick={() => {
          handleSubmit();
          dispatch(achievementSlice.actions.setEditVisible(false));
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
        dispatch(achievementSlice.actions.setEditVisible(false));
      }}
    >
      <div className="formgrid grid">
        <div className="field col-12 md:col-6">
          <label htmlFor="no">Số quyết định</label>
          <div>
            {/* <Button
              onClick={() => {
                console.log(editAchievement);
              }}
            ></Button> */}
            <InputText
              type="text"
              className="text-base text-color surface-overlay p-2  appearance-none outline-none focus:border-primary w-full"
              id="no"
              value={no}
              onChange={(e) => setNo(e.target.value)}
              defaultValue={editAchievement?.no}
            />
          </div>
        </div>
        <div className="field col-12 md:col-6">
          <label htmlFor="signDate">Ngày ký khen thưởng</label>
          <Calendar
            className="text-base text-color surface-overlay  appearance-none outline-none focus:border-primary w-full"
            id="signDate"
            value={signDate}
            onChange={(e) => setSignDate(e.value || undefined)}
            dateFormat="dd/mm/yy"
          />
        </div>
        <div className="field col-12 md:col-12">
          <label htmlFor="no">Nội dung khen thưởng</label>
          <div>
            <InputText
              type="text"
              className="text-base text-color surface-overlay p-2  border-round appearance-none outline-none focus:border-primary w-full"
              id="content"
              // value={content}
              defaultValue={editAchievement?.content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <div className="field col-12 md:col-12">
          <label htmlFor="no">Đơn vị khen thưởng</label>
          <div>
            {/* <InputText
              type="text"
              className="text-base text-color surface-overlay p-2  border-round appearance-none outline-none focus:border-primary w-full"
              id="content"
              // value={falcutyID}
              defaultValue={editAchievement?.facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
            /> */}
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

export default EditAchievementDialog;
