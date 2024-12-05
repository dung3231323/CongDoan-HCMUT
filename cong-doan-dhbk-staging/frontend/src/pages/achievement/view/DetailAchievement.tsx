import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { Link, useParams } from 'react-router-dom';
// import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
// import AddNewDialog from '../modal/AddAchievementDialog';
// import EditDialog from '../modal/EditAchievementDialog';
// import { ConfirmDialog } from 'primereact/confirmdialog';
// import { confirmDialog } from 'primereact/confirmdialog';
// import achievementFakedata from '../data';
import moment from 'moment';
import 'moment/locale/vi';
import { AchievementAPI } from '@/services/achievement';
import { Achievement } from '@/types/achievement';
import achievementSlice from '@/states/slices/achievement';
import { RootState } from '@/states/store';
import AddOfficersDialog from '../modal/AddOfficersDialog';
//   );
// };
const data = [
  {
    id: '1',
    officerNumber: '123',
    familyName: 'Nguyễn',
    givenName: 'Văn A',
    faculty: 'Công nghệ thông tin',
  },
];
const DetailAchievementPage: React.FC = () => {
  const { id = '' } = useParams();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const [detailData, setDetailData] = useState<Achievement>();
  const dispatch = useDispatch();
  const addOfficersVisible = useTypedSelector((state) => state.achievement.addOfficersVisible);
  const faculties = useTypedSelector((state) => state.achievement.faculties);
  // console.log('id', id);
  const loadData = async () => {
    try {
      const response = await AchievementAPI.getByID(id);
      if (response) {
        setDetailData(response.data);
        console.log('detailData', detailData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    moment.locale('vi');
    document.title = 'Chi tiết thành tích';
    loadData();
  }, []);

  // const headerTemplate = () => {
  //   // const className = `${options.className} justify-content-space-between`;
  //   return (
  //     // <div className={className}>
  //     <div className="justify-content-between">justify-between</div>
  return (
    <div className="m-5">
      {addOfficersVisible && <AddOfficersDialog></AddOfficersDialog>}
      <Panel header="Chi tiết thành tích">
        <div className="flex justify-between">
          <Button
            label="Thêm cá nhân vào thành tích"
            icon="pi pi-plus"
            className="p-button-sm mr-2"
            onClick={() => {
              dispatch(achievementSlice.actions.setAddOfficersVisible(true));
            }}
          />
          <Button label="Quay lại" icon={'pi pi-undo'} className="p-button-sm mr-2">
            <Link to="/achievement" className="absolute w-full h-full -ml-2"></Link>
          </Button>
        </div>
        <div className="formgrid grid mt-2">
          <div className="field col-12 md:col-6">
            <label htmlFor="no">Số quyết định</label>
            <div>
              <InputText
                type="text"
                // filled={true}
                variant="filled"
                // className="text-base text-color surface-overlay p-2  appearance-none outline-none focus:border-primary w-full"
                className="w-full"
                id="no"
                disabled
                value={detailData?.no}
                // onChange={(e) => setNum(e.target.value)}
              />
            </div>
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="signDate">Ngày ký khen thưởng</label>
            <Calendar
              // className="text-base text-color surface-overlay  appearance-none outline-none focus:border-primary w-full"
              className="w-full"
              id="signDate"
              disabled
              variant="filled"
              value={moment(detailData?.signDate).toDate()}
              // onChange={(e) => setDate(e.value)}
              dateFormat="dd/mm/yy"
            />
          </div>
          <div className="field col-12 md:col-12">
            <label htmlFor="content">Nội dung khen thưởng</label>
            <div>
              <InputText
                disabled
                type="text"
                variant="filled"
                // className="text-base text-color surface-overlay p-2  border-round appearance-none outline-none focus:border-primary w-full"
                className="w-full"
                id="content"
                value={detailData?.content}
                // onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <div className="field col-12 md:col-12">
            <label htmlFor="facultyId">Đơn vị khen thưởng</label>
            <div>
              <InputText
                disabled
                type="text"
                variant="filled"
                // className="text-base text-color surface-overlay p-2  border-round appearance-none outline-none focus:border-primary w-full"
                className="w-full"
                id="facultyId"
                value={faculties.find((faculty) => faculty.id === detailData?.facultyId)?.name}
                // onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DataTable value={data} selectionMode="single" className="mt-4" size="small" rowHover>
          <Column alignHeader="center" align="center" field="id" header="STT"></Column>
          <Column alignHeader="center" align="center" field="officerNumber" header="MSCB"></Column>
          <Column alignHeader="center" align="left" field="familyName" header="Họ và tên lót"></Column>
          <Column alignHeader="center" align="left" field="givenName" header="Tên"></Column>
          <Column alignHeader="center" align="left" field="faculty" header="Khoa/ Phòng ban/ Trung tâm"></Column>
        </DataTable>
      </Panel>
    </div>
  );
};
export default DetailAchievementPage;
