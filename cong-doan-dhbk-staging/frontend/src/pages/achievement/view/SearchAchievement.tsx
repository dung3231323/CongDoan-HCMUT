import React, { useState } from 'react';
import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { Link } from 'react-router-dom';
// import { Dropdown } from 'primereact/dropdown';
// import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
// import AddNewDialog from '../modal/AddAchievementDialog';
// import EditDialog from '../modal/EditAchievementDialog';
// import { ConfirmDialog } from 'primereact/confirmdialog';
// import { confirmDialog } from 'primereact/confirmdialog';
// import achievementFakedata from '../data';
import moment from 'moment';
import { RadioButton } from 'primereact/radiobutton';
import { Nullable } from 'primereact/ts-helpers';
// import achievementSlice from '@/states/slices/achievement';
import { RootState } from '@/states/store';
// import AddOfficersDialog from '../modal/AddOfficersDialog';
import { Faculty } from '@/types/faculty';
// import { Participant } from '@/components/types/participant';
import { filterBody, Participant } from '@/services/achievement';

import 'moment/locale/vi';

// const unit = [
//   { name: 'Khoa KH và KTMT', code: 'NY' },
//   { name: 'Khoa Hóa', code: 'RM' },
// ];
// const person = [
//   { name: 'Dương', code: 'NY' },
//   { name: 'Hoàng', code: 'RM' },
// ];
// interface Content {
//   name: string;
//   code: string;
// }
const searchResult = [
  {
    id: '1',
    officerNumber: '123',
    familyName: 'Nguyễn',
    givenName: 'Văn A',
    prize: 'Giải nhất',
    signDate: '12/12/2021',
    unit: 'Khoa KH và KTMT',
  },
  {
    id: '2',
    officerNumber: '124',
    familyName: 'Nguyễn',
    givenName: 'Văn B',
    prize: 'Giải nhì',
    signDate: '12/12/2021',
    unit: 'Khoa Hóa',
  },
];
const SearchAchievementPage: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  // const dispatch = useDispatch();
  const faculties = useTypedSelector((state) => state.achievement.faculties);
  const participant = useTypedSelector((state) => state.achievement.participants);

  const [selectedFilter, setSelectedFilter] = useState<any>('Đơn vị');
  // const [selectedFaculties, setSelectedFaculties] = useState<Faculty | null>(null);
  // const [selectedParticipants, setSelectedParticipants] = useState<Participant | null>(null);
  const [selectedFa_Par, setSelectedFa_Par] = useState<Faculty | Participant | null>(null);
  const [content, setContent] = useState<string>('');
  const [fromDate, setFromDate] = useState<Nullable<Date>>(null);
  const [toDate, setToDate] = useState<Nullable<Date>>(null);
  // console.log(faculties);
  return (
    <div className="m-5">
      <Panel header="Tìm kiếm">
        <div className="flex justify-between">
          <div>
            <RadioButton
              inputId="ingredient1"
              name="filter"
              value="Đơn vị"
              checked={selectedFilter === 'Đơn vị'}
              onChange={(e) => {
                setSelectedFilter(e.value);
                setSelectedFa_Par(null);
              }}
            />
            <label htmlFor="ingredient1" className="ml-2 text-black">
              Lọc theo đơn vị
            </label>
            <RadioButton
              className="ml-3"
              inputId="ingredient2"
              name="filter"
              value="Cá nhân"
              checked={selectedFilter === 'Cá nhân'}
              onChange={(e) => {
                setSelectedFilter(e.value);
                setSelectedFa_Par(null);
              }}
            />
            <label htmlFor="ingredient2" className="ml-2 text-black">
              Lọc theo cá nhân
            </label>
          </div>
          <Button label="Quay lại" icon={'pi pi-undo'} className="p-button-sm mr-2">
            <Link to="/achievement" className="absolute w-full h-full -ml-2"></Link>
          </Button>
        </div>
        <div className="formgrid grid mt-2">
          <div className="field col-12 md:col-12">
            <label htmlFor="falcuty">{selectedFilter}</label>
            <div>
              {/* <Dropdown
                value={selectedUnit_Person}
                onChange={(e) => {
                  setSelectedUnit_Person(e.value);
                  // console.log(e.value);
                }}
                options={selectedFilter === 'Đơn vị' ? unit : person}
                optionLabel="name"
                placeholder="Select..."
                className="w-full "
                name="falcuty"
              /> */}
              <MultiSelect
                value={selectedFa_Par}
                onChange={(e: MultiSelectChangeEvent) => {
                  setSelectedFa_Par(e.value);
                  // console.log(selectedContents);
                }}
                // options={selectedFilter === 'Đơn vị' ? unit : person}
                options={selectedFilter === 'Đơn vị' ? faculties : participant}
                display="chip"
                optionLabel={selectedFilter === 'Đơn vị' ? 'name' : 'familyName'}
                placeholder="Select Cities"
                maxSelectedLabels={3}
                className="w-full"
                // optionGroupLabel=''
              />
            </div>
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="content">Nội dung hoạt động</label>
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
          <div className="field col-12 md:col-3">
            <label htmlFor="fromDate">Từ ngày</label>
            <Calendar
              className="w-full"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.value)}
              dateFormat="dd/mm/yy"
              placeholder="dd/mm/yy"
            />
          </div>
          <div className="field col-12 md:col-3">
            <label htmlFor="fromDate">Từ ngày</label>
            <Calendar
              className="w-full"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.value)}
              dateFormat="dd/mm/yy"
              placeholder="dd/mm/yy"
            />
          </div>
        </div>
        <Button
          label="Tìm"
          icon="pi pi-search"
          className="p-button-sm"
          onClick={() => {
            const filterBody: filterBody = {
              option: selectedFilter,
              facultyId: selectedFa_Par?.id || '',
              participantId: selectedFa_Par?.id || '',
              //? tach ko
              content: content,
              startDate: fromDate ? moment(fromDate).format('YYYY-MM-DD') : '',
              endDate: toDate ? moment(toDate).format('YYYY-MM-DD') : '',
            };
            console.log(filterBody);
            console.log('selectedFa_Par', selectedFa_Par);
          }}
        />
        <DataTable value={searchResult} selectionMode="single" className="mt-4" size="small" rowHover>
          <Column alignHeader="center" align="center" field="id" header="STT"></Column>
          <Column alignHeader="center" align="center" field="officerNumber" header="MSCB"></Column>
          <Column alignHeader="center" align="left" field="familyName" header="Họ và tên lót"></Column>
          <Column alignHeader="center" align="left" field="givenName" header="Tên"></Column>
          <Column alignHeader="center" align="left" field="prize" header="Giải thưởng"></Column>
          <Column alignHeader="center" align="center" field="signDate" header="Ngày ký"></Column>
          <Column alignHeader="center" align="left" field="unit" header="Đơn vị"></Column>
        </DataTable>
        <Button
          label="Xuất Excel"
          icon="pi pi-file-excel"
          className="p-button-sm mt-4"
          onClick={() => {
            // setAddOfficerVisible(true);
          }}
        />
      </Panel>
    </div>
  );
};
export default SearchAchievementPage;
