import React, { useEffect, useMemo, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import FacultyAPI from '@/services/faculty';
import ParticipantAPI, { ApiResponse } from '@/services/participant';
import UnionDepartmentAPI from '@/services/unionDepartment';
import facultySlice from '@/states/slices/faculty';
import participantSlice from '@/states/slices/participant';
import unionDepartmentSlice from '@/states/slices/unionDepartment';
import { Checkbox } from 'primereact/checkbox';
import { Faculty } from '@/types/faculty';
import { UnionDepartment } from '@/types/unionDepartment';
import { Participant } from '@/types/participant';
import ParticipantApi from '@/services/participant';
import { RootState } from '@/states/store';
import { Card } from 'primereact/card';
import { Gender, GenderOption } from '@/types/gender';
import { WorkingStatus, WorkingStatusOption } from '@/types/workingStatus';
import { CreateParticipant } from '@/types/createParticipant';
import { Children } from '@/types/children';
import { toast } from 'react-toastify';

const AddParticipantModal: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const lazyParams = useTypedSelector((state) => state.participant.lazyParams);

  const [familyName, setFamilyName] = useState<string>('');
  const [givenName, setGivenName] = useState<string>('');
  const [sID, setSId] = useState<string>('');
  const [uID, setUId] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [gender, setGender] = useState<Gender | undefined>();
  const [faculty, setFaculty] = useState<Faculty>();
  const [unionDept, setUnionDept] = useState<UnionDepartment>();
  const [unionJoinDate, setUnionJoinDate] = useState<string>('');
  const [workingStatus, setWorkingStatus] = useState<WorkingStatus>(WorkingStatus.Working);
  const [isUnionMember, setIsUnionMember] = useState<boolean>(false);
  const [numOfChildren, setNumOfChildren] = useState<number>(0);
  const [listOfChildren, setListOfChildren] = useState<Children[]>([]);

  const listOfUnionDepartments = useTypedSelector((state) => state.unionDepartment.data);
  const listOfFaculty = useTypedSelector((state) => state.faculty.data);

  const dispatch = useDispatch();
  const visible = useTypedSelector((state) => state.participant.addModalShow);

  const onHide = () => {
    dispatch(participantSlice.actions.setAddModalShow(false));
  };

  useEffect(() => {
    const fetchUnionDepartment = async () => {
      const { data } = await UnionDepartmentAPI.getAll();
      dispatch(unionDepartmentSlice.actions.setData(data || []));
    };
    fetchUnionDepartment();
  }, [dispatch]);

  useEffect(() => {
    const fetchFaculty = async () => {
      const { data } = await FacultyAPI.getAll();
      dispatch(facultySlice.actions.setData(data || []));
    };
    fetchFaculty();
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    if (!familyName.trim()) {
      isValid = false;
      toast.warning('Họ và tên lót không được bỏ trống');
    }

    if (!givenName.trim()) {
      isValid = false;
      toast.warning('Tên không được bỏ trống');
    }

    if (!email.trim()) {
      isValid = false;
      toast.warning('Email không được bỏ trống');
    }

    if (!phone.trim()) {
      isValid = false;
      toast.warning('Số điện thoại không được bỏ trống');
    }

    if (!sID.trim()) {
      isValid = false;
      toast.warning('Mã số cán bộ không được bỏ trống');
    }

    if (!dob.trim()) {
      isValid = false;
      toast.warning('Ngày tháng năm sinh không được bỏ trống');
    }

    if (!faculty?.id) {
      isValid = false;
      toast.warning('Khoa/phòng ban/trung tâm không được bỏ trống');
    }

    if (!gender) {
      isValid = false;
      toast.warning('Giới tính không được bỏ trống');
    }

    if (isUnionMember) {
      if (!uID.trim()) {
        isValid = false;
        toast.warning('Mã số công đoàn viên không được bỏ trống');
      }

      if (!unionDept?.id) {
        isValid = false;
        toast.warning('Công đoàn bộ phận không được bỏ trống');
      }

      if (!unionJoinDate.trim()) {
        isValid = false;
        toast.warning('Ngày gia nhập công đoàn không được bỏ trống');
      }

      if (workingStatus === undefined) {
        isValid = false;
        toast.warning('Tình trạng làm việc không được bỏ trống');
      }
    }

    if (numOfChildren > 0) {
      listOfChildren.forEach((child, index) => {
        if (!child.familyName.trim()) {
          isValid = false;
          toast.warning(`Họ và tên lót của con ${index + 1} không được bỏ trống`);
         
        }
        if (!child.givenName.trim()) {
          isValid = false;
          toast.warning(`Tên của con ${index + 1} không được bỏ trống`);
        }
        if (!child.dob.trim()) {
          isValid = false;
          toast.warning(`Ngày tháng năm sinh của con ${index + 1} không được bỏ trống`);
        }
        if (!child.gender) {
          isValid = false;
          toast.warning(`Giới tính của con ${index + 1} không được bỏ trống`);
        }
      });
    }

    if (isValid) {
      const createParticipant: CreateParticipant = {
        familyName: familyName,
        givenName: givenName,
        email: email,
        phone: phone,
        sID: sID,
        dob: dob,
        facultyName: faculty?.name || '',
        facultyId: faculty?.id || '',
        gender: gender,
        isUnionMember: isUnionMember,
        uID: uID,
        workingStatus: workingStatus,
        unionDept: unionDept,
        unionDeptId: unionDept?.id || '',
        unionJoinDate: unionJoinDate,
        numOfChildren: numOfChildren,
        children: listOfChildren,
      };
      const { status } = await ParticipantAPI.create(createParticipant);

      if (status === 201) {
        const response: ApiResponse<Participant[]> = await ParticipantApi.getAll(1, lazyParams.rows);
        if (response) {
          dispatch(participantSlice.actions.setParticipantData(response.data || []));
          dispatch(
            participantSlice.actions.setMetaData(
              response.metaData || {
                hasNextPage: false,
                hasPreviousPage: false,
                itemCount: 0,
                page: 1,
                pageCount: 1,
                take: 10,
              },
            ),
          );
          dispatch(participantSlice.actions.setLazyParams({ first: 0, rows: lazyParams.rows, page: 1 }));
          toast.success('Dữ liệu đã được thêm vào hệ thống');
          
          dispatch(participantSlice.actions.setAddModalShow(false));
        } else {
          toast.error('Thêm dữ liệu thất bại');
        }
      } else {
        toast.error('Thêm dữ liệu thất bại');
      }
    }
  };

  const optionGender: GenderOption[] = useMemo(
    () => [
      { value: Gender.Male, label: 'Nam' },
      { value: Gender.Female, label: 'Nữ' },
    ],
    [],
  );

  const optionUnionDepartments = useMemo(
    () =>
      listOfUnionDepartments?.map((unionDepartment: UnionDepartment) => ({
        value: unionDepartment.id,
        label: unionDepartment.name,
      })),
    [listOfUnionDepartments],
  );

  const optionFaculty = useMemo(
    () =>
      listOfFaculty?.map((faculty: Faculty) => ({
        value: faculty.id,
        label: faculty.name,
      })),
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

  const footer = (
    <div>
      <Button label="Đóng" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label="Đồng ý" icon="pi pi-check" onClick={handleSubmit} className="p-ml-2" />
    </div>
  );

  const handleNumOfChildrenChange = (value: number) => {
    setNumOfChildren(value);
    setListOfChildren((prevChildren) => prevChildren.slice(0, value));
  };

  const handleChildInfoChange = (key: string, value: string | number, index: number) => {
    setListOfChildren((prevChildren) =>
      prevChildren.map((child, i) => (i === index ? { ...child, [key]: value } : child)),
    );
  };

  useEffect(() => {
    const newChildren = Array.from({ length: numOfChildren - listOfChildren.length }, () => ({
      familyName: '',
      givenName: '',
      dob: '',
      gender: undefined,
    }));

    setListOfChildren((prevChildren) => [...prevChildren, ...newChildren]);
  }, [numOfChildren]);

  return (
    <Dialog
      header="Thêm mới: Công đoàn viên"
      visible={visible}
      style={{ width: '50vw' }}
      modal
      footer={footer}
      onHide={onHide}
    >
      <form onSubmit={handleSubmit}>
        <Card title="Thông tin cá nhân">
          <div className="p-fluid grid formgrid">
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
                required
                id="givenName"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                placeholder="Tên"
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="sId">Mã số cán bộ</label>
              <InputText
                id="sId"
                value={sID}
                onChange={(e) => setSId(e.target.value)}
                placeholder="Mã số cán bộ/ Số hiệu công chức"
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="dob">Ngày tháng năm sinh</label>
              <Calendar
                id="dob"
                value={new Date(dob)}
                onChange={(e) => setDob(e.value?.toDateString() || '')}
                dateFormat="mm/dd/yy"
                placeholder="mm/dd/yyyy"
                showIcon
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="email">Email</label>
              <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <InputText
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại"
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
              <label htmlFor="gender">Giới tính</label>
              <Dropdown
                id="gender"
                value={gender}
                options={optionGender}
                onChange={(e) => setGender(e.value)}
                placeholder="Select..."
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-fluid grid formgrid">
            <div className="field col-12 md:col-6" style={{ flex: 1 }}>
              <div className="p-mt-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Thông tin công đoàn viên
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
            {isUnionMember && (
              <div className="p-fluid grid formgrid">
                <div className="field col-12 md:col-6">
                  <label htmlFor="uId">Mã số công đoàn viên</label>
                  <InputText
                    id="uId"
                    value={uID}
                    onChange={(e) => setUId(e.target.value)}
                    placeholder="Mã số công đoàn viên"
                  />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="unionDept">Công đoàn bộ phận</label>

                  <Dropdown
                    id="unionDept"
                    placeholder="Công đoàn bộ phận đang sinh hoạt"
                    disabled={true}
                    value={unionDept?.id}
                    options={optionUnionDepartments}
                  />
                </div>

                <div className="field col-12 md:col-6">
                  <label htmlFor="unionJoinDate">Ngày gia nhập công đoàn</label>
                  <Calendar
                    id="unionJoinDate"
                    value={new Date(unionJoinDate)}
                    onChange={(e) => setUnionJoinDate(e.value?.toDateString() || '')}
                    dateFormat="mm/dd/yy"
                    placeholder="mm/dd/yyyy"
                    showIcon
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
                  <label htmlFor="numOfChildren">Số con</label>
                  <InputNumber
                    id="numOfChildren"
                    value={numOfChildren}
                    onValueChange={(e: InputNumberValueChangeEvent) => handleNumOfChildrenChange(e.value || 0)}
                    mode="decimal"
                    showButtons
                    min={0}
                    max={10}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        {numOfChildren > 0 && (
          <Card>
            <div className="p-fluid grid formgrid">
              <div className="field col-12 md:col-12" style={{ flex: 1 }}>
                <div className="p-mt-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Thông tin con cái
                </div>
              </div>

              {[...Array(numOfChildren)].map((_, index) => (
                <div key={index} className="p-fluid grid formgrid">
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`familyNameChild${index}`}>Họ và tên lót {index + 1}</label>
                    <InputText
                      id={`familyNameChild${index}`}
                      value={listOfChildren[index]?.familyName}
                      onChange={(e) => handleChildInfoChange('familyName', e.target.value, index)}
                      placeholder="Họ và tên"
                    />
                  </div>

                  <div className="field col-12 md:col-3">
                    <label htmlFor={`givenNameChild${index}`}>Tên {index + 1}</label>
                    <InputText
                      id={`givenNameChild${index}`}
                      value={listOfChildren[index]?.givenName}
                      onChange={(e) => handleChildInfoChange('givenName', e.target.value, index)}
                      placeholder="Tên"
                    />
                  </div>

                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dobChild${index}`}>Ngày tháng năm sinh {index + 1}</label>
                    <Calendar
                      id={`dobChild${index}`}
                      value={new Date(listOfChildren[index]?.dob)}
                      onChange={(e) => handleChildInfoChange('dob', e.value?.toDateString() || '', index)}
                      dateFormat="mm/dd/yy"
                      placeholder="mm/dd/yyyy"
                      showIcon
                    />
                  </div>

                  <div className="field col-12 md:col-2">
                    <label htmlFor={`genderChild${index}`}>Giới tính {index + 1}</label>
                    <Dropdown
                      id={`genderChild${index}`}
                      value={listOfChildren[index]?.gender}
                      options={optionGender}
                      onChange={(e) => handleChildInfoChange('gender', e.value, index)}
                      placeholder="Select..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* <div className="p-d-flex p-jc-end">
        {/* <div className="p-d-flex p-jc-end">
          <Button label="Đóng" icon="pi pi-times" className="p-button-text" onClick={onHide} />
          <Button label="Thêm mới" icon="pi pi-check" className="p-ml-2" type="submit" />
        </div> */}
      </form>
    </Dialog>
  );
};

export default AddParticipantModal;
