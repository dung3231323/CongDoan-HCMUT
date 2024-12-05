import { Faculty } from '@/types/faculty';
import { UnionDepartment } from '@/types/unionDepartment';
import FacultyAPI from '@/services/faculty';
import UnionDepartmentAPI from '@/services/unionDepartment';
import facultySlice from '@/states/slices/faculty';
import unionDepartmentSlice from '@/states/slices/unionDepartment';
import { RootState } from '@/states/store';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useMemo, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Gender, GenderOption } from '@/types/gender';
import { WorkingStatus, WorkingStatusOption } from '@/types/workingStatus';
import searchParticipantSlice from '@/states/slices/searchParticipant';
import { Checkbox } from 'primereact/checkbox';
import { toast } from 'react-toastify';
import { FilterParticipant } from '@/types/filterParticipant';
import ParticipantApi from '@/services/participant';

const SearchParticipantDialog: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

  const [familyName, setFamilyName] = useState<string>('');
  const [givenName, setGivenName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [sID, setSID] = useState<string>('');
  const [isUnionMember, setIsUnionMember] = useState<boolean>(false);
  const [uID, setUID] = useState<string>('');

  const [dobStartDate, setDobStartDate] = useState<string>('');
  const [dobEndDate, setDobEndDate] = useState<string>('');
  const [gender, setGender] = useState<Gender | undefined>();
  const [faculty, setFaculty] = useState<Faculty>();
  const [unionDept, setUnionDept] = useState<UnionDepartment>();
  const [workingStatus, setWorkingStatus] = useState<WorkingStatus | undefined>();
  const [numOfChildrenMin, setNumOfChildrenMin] = useState<number>(0);

  const [childGender, setChildGender] = useState<Gender | undefined>();
  const [childDobStartDate, setChildDobStartDate] = useState<string>('');
  const [childDobEndDate, setChildDobEndDate] = useState<string>('');

  const listOfUnionDepartments = useTypedSelector((state) => state.unionDepartment.data);
  const listOfFaculty = useTypedSelector((state) => state.faculty.data);

  const dispatch = useDispatch();
  const visible = useTypedSelector((state) => state.searchParticipant.searchDialogShow);

  const onHide = () => {
    dispatch(searchParticipantSlice.actions.setSearchDialogShow(false));
  };

  useEffect(() => {
    const fetchUnionDepartment = async () => {
      const { status, data } = await UnionDepartmentAPI.getAll();
      if (status !== 200) return;
      dispatch(unionDepartmentSlice.actions.setData(data || []));
    };
    fetchUnionDepartment();
  }, [dispatch]);

  useEffect(() => {
    const fetchFaculty = async () => {
      const { status, data } = await FacultyAPI.getAll();

      if (status != 200) return;
      dispatch(facultySlice.actions.setData(data || []));
    };
    fetchFaculty();
  }, [dispatch]);

  const optionGender: GenderOption[] = useMemo(
    () => [
      { value: Gender.Male, label: 'Nam' },
      { value: Gender.Female, label: 'Nữ' },
    ],
    [],
  );

  const optionUnionDepartments = useMemo(
    () => {
      const option = listOfUnionDepartments?.map((unionDepartment: UnionDepartment) => ({
        value: unionDepartment.id,
        label: unionDepartment.name,
      }))
      return [ { value: undefined, label: 'Để trống' }, ...option];
    },
    [listOfUnionDepartments],
  );

  const optionFaculty = useMemo(
    () => {
      const option = listOfFaculty?.map((faculty: Faculty) => ({
        value: faculty.id,
        label: faculty.name,
      }));
      return [ { value: undefined, label: 'Để trống' }, ...option];
    },
    [listOfFaculty],
  );

  const optionWorkingStatus: WorkingStatusOption[] = useMemo(
    () => [
      { value: WorkingStatus.Working, label: 'Đang làm việc' },
      { value: WorkingStatus.Resigned, label: 'Nghỉ làm' },
      { value: WorkingStatus.Retired, label: 'Nghỉ hưu' },
    ],
    [],
  );

  const handleReset = () => {
    setSID('');
    setUID('');
    setFamilyName('');
    setGivenName('');
    setEmail('');
    setDobStartDate('');
    setDobEndDate('');
    setGender(undefined);
    setFaculty(undefined);
    setUnionDept(undefined);
    setWorkingStatus(undefined);
    setNumOfChildrenMin(0);
    setChildGender(undefined);
    setChildDobStartDate('');
    setChildDobEndDate('');
  };

  const handleNumOfChildrenChange = (value: number) => {
    setNumOfChildrenMin(value);
    if (value < 0) {
        setNumOfChildrenMin(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault;
    if(isUnionMember && faculty?.unionDeptId !== unionDept?.id) {
      toast.warning(
        <>
          Bộ phận công đoàn <span style={{ color: 'red', fontWeight: 'bold' }}>{unionDept?.name}</span> không thuộc khoa/phòng ban/trung tâm <span style={{ color: 'red', fontWeight: 'bold' }}>{faculty?.name}</span> đã chọn
        </>
      );
      return;
    };

    if(dobStartDate && dobEndDate && new Date(dobStartDate) > new Date(dobEndDate)) {
      toast.warning(
        <>
          Ngày bắt đầu <span style={{ color: 'red' , fontWeight:'bold'}}>không thể lớn hơn</span> ngày kết thúc
        </>
      );
      return;
    }

    const data: FilterParticipant = {
      familyName,
      givenName,
      email,
      phone: "",
      sID,
      dob: "",
      faculty,
      facultyId: faculty?.id,
      gender,
      isUnionMember,
      uID,
      workingStatus,
      unionDept,
      unionDeptId: unionDept?.id,
      unionJoinDate: "",
      numOfChildrenMin,
      childs: [],
      facultyName: faculty?.name,
      unionDeptName: unionDept?.name,
      dobFrom: dobStartDate,
      dobTo: dobEndDate,
      page: 1,
      limit: 10,
      sortBy: "givenName",
      orderBy: "asc",
    };
    
    try {
      const response = await ParticipantApi.getWithFilter(data);
      if (response.status !== 404 && response.status !== 400 && response.status !== 500) {
        dispatch(searchParticipantSlice.actions.setFilterParticipant(data));
        dispatch(searchParticipantSlice.actions.setParticipantData(response.data || []));
        dispatch(searchParticipantSlice.actions.setMetaData(response.metaData || {
          hasNextPage: false,
          hasPreviousPage: false,
          itemCount: 0,
          page: 1,
          pageCount: 1,
          take: 10,
        }));
        dispatch(searchParticipantSlice.actions.setLazyParams({first: 0, rows: 10, page: 0}));
        onHide();
        toast.success('Tìm kiếm thành công');
      }
    } catch (error) {
      console.error('Error: ', error);
      toast.error('Tìm kiếm thất bại');
    }
  };
  const footer = (
    <div>
      <Button label="Hủy" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label="Reset" icon="pi pi-refresh" onClick={handleReset} className="p-button-text" />
      <Button label="Tìm kiếm" icon="pi pi-search" onClick={handleSubmit} autoFocus />
    </div>
  );
  return (
    <Dialog
      header="Tìm kiếm: Công đoàn viên"
      visible={visible}
      style={{ width: '50vw' }}
      modal
      footer={footer}
      onHide={onHide}
    >
      <form onSubmit={handleSubmit}>
        <Card >
          <div className="p-fluid grid formgrid">
            <div className="field col-12 md:col-6" >
                <div className="p-mt-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Thông tin cá nhân
                </div>
            </div>

            <div className="field col-12 md:col-6" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div className="field-checkbox" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="p-mt-4" style={{ fontSize: '1.25rem' }}>
                    Là công đoàn viên
                </div>
                <Checkbox
                  inputId="isUnionMember"
                  checked={isUnionMember}
                  onChange={() => setIsUnionMember(!isUnionMember)}
                  style={{ width: '20px', height: '20px', marginLeft: '10px' }}
                  className="p-mr-2"
                />
              </div>
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="familyName">Họ và tên lót</label>
              <InputText
                id="familyName"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="Nguyễn Văn"
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="givenName">Tên</label>
              <InputText
                id="givenName"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                placeholder="Tên"
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="email">Email</label>
              <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="gender">Giới tính</label>
              <Dropdown
                id="gender"
                value={gender}
                options={optionGender}
                onChange={(e) => setGender(e.value)}
                placeholder="Select..."
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="dob">Ngày sinh từ ngày</label>
              <Calendar
                id="dob"
                value={new Date(dobStartDate)}
                onChange={(e) => setDobStartDate(e.value?.toDateString() || '')}
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                showIcon
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="dob">Đến ngày</label>
              <Calendar
                id="dob"
                value={new Date(dobEndDate)}
                onChange={(e) => setDobEndDate(e.value?.toDateString() || '')}
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                showIcon
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="sId">Mã số cán bộ</label>
              <InputText
                id="sId"
                value={sID}
                onChange={(e) => setSID(e.target.value)}
                placeholder="Mã số cán bộ/ Số hiệu công chức"
              />
            </div>
            <div className="field col-12 md:col-6">
                  <label htmlFor="uId">Mã số công đoàn viên</label>
                  <InputText
                    id="uId"
                    value={uID}
                    onChange={(e) => setUID(e.target.value)}
                    placeholder="Mã số công đoàn viên"
                  />
                </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="faculty">Khoa/phòng ban/trung tâm</label>
              <Dropdown
                id="faculty"
                value={faculty?.id}
                options={optionFaculty}
                onChange={(e) => {
                  const curFaculty = listOfFaculty.find((faculty: Faculty) => faculty.id === e.value);
                  setFaculty(curFaculty);
                  setUnionDept(
                    listOfUnionDepartments?.find((dept: UnionDepartment) => dept.id === curFaculty?.unionDeptId),
                  );
                }}
                placeholder="Chọn khoa/ phòng ban/ trung tâm"
              />
            </div>

            <div className="field col-12 md:col-6">
                <label htmlFor="unionDept">Công đoàn bộ phận</label>

                <Dropdown
                id="unionDept"
                disabled={!isUnionMember}
                placeholder="Công đoàn bộ phận đang sinh hoạt"
                value={(!isUnionMember) ? undefined : unionDept?.id}
                options={optionUnionDepartments}
                onChange={(e) => {
                    if (e.value) {
                    setUnionDept(listOfUnionDepartments.find((dept: UnionDepartment) => dept.id === e.value));
                    if (faculty) {
                        if (faculty.unionDeptId !== e.value) {
                          toast.warning(
                            <>
                              Bộ phận công đoàn <span style={{ color: 'red', fontWeight: 'bold' }}>{unionDept?.name}</span> không có khoa/phòng ban/trung tâm <span style={{ color: 'red', fontWeight: 'bold' }}>{faculty?.name}</span> đã chọn
                            </>
                          )
                        }
                    }
                    } else {
                    setUnionDept(undefined);
                    }
                }
                }
                />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="workingStatus">Tình trạng làm việc</label>
              <Dropdown
                id="workingStatus"
                value={workingStatus}
                options={optionWorkingStatus}
                onChange={(e) => setWorkingStatus(e.value)}
                placeholder="Select..."
              />
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="numOfChildrenMin">Số con tối thiểu</label>
              <InputNumber
                id="numOfChildrenMin"
                value={numOfChildrenMin}
                onValueChange={(e: InputNumberValueChangeEvent) => handleNumOfChildrenChange(e.value || 0)}
                mode="decimal"
                showButtons
                min={0}
                max={10}
              />
            </div>
          </div>
        </Card>

        <Card title="Thông tin con cái">
        <div className="p-fluid grid formgrid">
            <div className="field col-12 md:col-5">
            <label htmlFor="childDobStartDate">Ngày sinh, từ ngày</label>
            <Calendar
                id="childDobStartDate"
                value={new Date(childDobStartDate)}
                onChange={(e) => setChildDobStartDate(e.value?.toDateString() || '')}
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                showIcon
            />
            </div>

            <div className="field col-12 md:col-5">
            <label htmlFor="childDobEndDate">Đến ngày</label>
            <Calendar
                id="childDobEndDate"
                value={new Date(childDobEndDate)}
                onChange={(e) => setChildDobEndDate(e.value?.toDateString() || '')}
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                showIcon
            />
            </div>

            <div className="field col-12 md:col-2">
            <label htmlFor="childGender">Giới tính</label>
            <Dropdown
                id="childGender"
                value={childGender}
                options={optionGender}
                onChange={(e) => setChildGender(e.value)}
                placeholder="Select..."
            />
            </div>
        </div>
        </Card>
      </form>
    </Dialog>
  );
};

export default SearchParticipantDialog;
