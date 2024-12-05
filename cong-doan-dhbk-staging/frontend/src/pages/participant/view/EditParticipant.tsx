import { Faculty } from '@/types/faculty';
import { Participant } from '@/types/participant';
import { UnionDepartment } from '@/types/unionDepartment';
import participantSlice from '@/states/slices/participant';
import { RootState } from '@/states/store';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useMemo, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify';

import UnionDepartmentAPI from '@/services/unionDepartment';
import unionDepartmentSlice from '@/states/slices/unionDepartment';
import FacultyAPI from '@/services/faculty';
import facultySlice from '@/states/slices/faculty';
import { Children } from '@/types/children';
import { Gender, GenderOption } from '@/types/gender';
import { WorkingStatus, WorkingStatusOption } from '@/types/workingStatus';
import ParticipantApi from '@/services/participant';
import { EditParticipantObject } from '@/types/editParticipant';

interface EditParticipantProps {
  participantId: string;
}

const EditParticipant: React.FC<EditParticipantProps> = ({ participantId }) => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

  const [editParticipant, setEditParticipant] = useState<Participant | undefined>(undefined);

  const [familyName, setFamilyName] = useState<string>('');
  const [givenName, setGivenName] = useState<string>('');
  const [sID, setSId] = useState<string>('');
  const [uID, setUId] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [gender, setGender] = useState<Gender | undefined>();
  const [faculty, setFaculty] = useState<Faculty >();
  const [unionDept, setUnionDept] = useState<UnionDepartment | undefined>(undefined);
  const [unionJoinDate, setUnionJoinDate] = useState<string>('');
  const [workingStatus, setWorkingStatus] = useState<WorkingStatus | undefined>();
  const [isUnionMember, setIsUnionMember] = useState<boolean>(false);
  const [numOfChildren, setNumOfChildren] = useState<number>(0);
  const [listOfChildren, setListOfChildren] = useState<Children[]>([]);

  const listOfParticipants = useTypedSelector((state) => state.participant.data);
  const metaData = useTypedSelector((state) => state.participant.metaData);

  const dispatch = useDispatch();
  const visible = useTypedSelector((state) => state.participant.editModalShow);

  const listOfFaculty = useTypedSelector((state) => state.faculty.data);
  const listOfUnionDept = useTypedSelector((state) => state.unionDepartment.data);

  const onHide = () => {
    dispatch(participantSlice.actions.setEditModalShow(false));
  };

  // const findFaculty = async (facultyId: string) => {
  //   const result = await listOfFaculty?.find((faculty: Faculty) => faculty.id === facultyId);
  //   return result || undefined;
  // };

  // const findUnionDepartment = async (unionDeptId: string) => {
  //   const result = await listOfUnionDept?.find((dept: UnionDepartment) => dept.id === unionDeptId);
  //   return result || undefined;
  // };

  const handleNumOfChildrenChange = (value: number) => {
    setNumOfChildren(value);
    let newListChildren: Children[] = [];
    if (value > listOfChildren.length) {
      newListChildren = [
        ...listOfChildren,
        ...Array.from({ length: value - listOfChildren.length }, () => ({
          familyName: '',
          givenName: '',
          dob: '',
          gender: undefined,
        })),
      ];
    } else {
      newListChildren = listOfChildren.slice(0, value);
    }

    setListOfChildren(newListChildren);
  };

  const handleDeleteChild = (index: number) => {
    const updatedChildrenList = listOfChildren.filter((_, i) => i !== index);
    setListOfChildren(updatedChildrenList);
    setNumOfChildren(updatedChildrenList.length);
  };

  const handleChildInfoChange = (key: string, value: string | number, index: number) => {
    setListOfChildren((prevChildren) =>
      prevChildren.map((child, i) => (i === index ? { ...child, [key]: value } : child)),
    );
  };

  useEffect(() => {
    const foundFaculty = listOfFaculty.find((faculty: Faculty) => faculty.id === editParticipant?.facultyId);
    setFaculty(foundFaculty);

    if (foundFaculty) {
      const foundUnionDept = listOfUnionDept?.find((dept: UnionDepartment) => dept.id === foundFaculty.unionDeptId);
      setUnionDept(foundUnionDept);
    }
  }, [editParticipant]);

  useEffect(() => {
    const fetchData = async () => {
      if (!participantId) {
        toast.warning(`không tìm thấy cán bộ công đoàn`)
        dispatch(participantSlice.actions.setEditModalShow(true));
        return;
      }

      try {
        const fetchUnionDepartment = async () => {
          const { data } = await UnionDepartmentAPI.getAll();
          dispatch(unionDepartmentSlice.actions.setData(data || []));
        };

        const fetchFaculty = async () => {
          const { data } = await FacultyAPI.getAll();
          dispatch(facultySlice.actions.setData(data || []));
        };

        const fetchParticipant = async () => {
          const { status, data } = await ParticipantApi.getParticipantWithId(participantId);
          if (status === 200) {
            setEditParticipant(data);
            setFamilyName(data?.familyName || '');
            setGivenName(data?.givenName || '');
            setSId(data?.sID || '');
            setUId(data?.uID || '');
            setDob(data?.dob || '');
            setEmail(data?.email || '');
            setPhone(data?.phone || '');
            setGender(data?.gender || undefined);
            setFaculty( listOfFaculty.find((faculty: Faculty) => faculty.id === data?.facultyId));
            setUnionDept(listOfUnionDept?.find((dept: UnionDepartment) => dept.id === faculty?.unionDeptId));
            setUnionJoinDate(data?.unionJoinDate || '');
            setWorkingStatus(data?.workingStatus || undefined);
            setIsUnionMember(data?.isUnionMember || false);
            setNumOfChildren(data?.numOfChildren || 0);
            setListOfChildren(data?.childs || []);
          } else {
            toast.error('Không tìm thấy dữ liệu cán bộ công đoàn');
            dispatch(participantSlice.actions.setEditModalShow(false));
          }
        };

        await fetchFaculty();
        await fetchUnionDepartment();
        await fetchParticipant();
      } catch (error) {
        toast.error('Đã xảy ra lỗi khi tải dữ liệu');
      }
    };

    fetchData();
  }, [participantId, dispatch]);

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
      const dataForEdit : EditParticipantObject = {
        familyName,
        givenName,
        sID,
        uID,
        dob,
        email,
        phone,
        gender,
        unionDept,
        unionDeptId: unionDept?.id,
        unionJoinDate,
        workingStatus,
        isUnionMember,
        numOfChildren,
        children: listOfChildren,
        faculty: faculty,
        facultyId: faculty?.id || '',
        facultyName: faculty?.name || '',
      };

      try {
        const response = await ParticipantApi.updateParticipantWithId(participantId, dataForEdit);

        if (response.status === 200) {
          toast.success('Cập nhật dữ liệu thành công');

          const new_data= response.data;
          const updatedParticipants = listOfParticipants.map((x: Participant) =>
            x.id === editParticipant?.id
              ? {
                  ...x,
                  familyName: familyName,
                  givenName: givenName,
                  sID: sID,
                  uID: uID,
                  dob: dob,
                  email: email,
                  phone: phone,
                  faculty: faculty,
                  unionDept: unionDept,
                  unionJoinDate: unionJoinDate,
                  workingStatus: workingStatus,
                  isUnionMember: isUnionMember,
                  numOfChildren: numOfChildren,
                  childs: listOfChildren,
                  gender: gender,
                  updatedAt: new_data?.updatedAt,
                  facultyId: dataForEdit.facultyId,
                  facultyName: dataForEdit.facultyName,
                  unionDeptId: dataForEdit.unionDeptId,
                }
              : x,
          );

          dispatch(
            participantSlice.actions.setParticipantData(updatedParticipants),
            participantSlice.actions.setMetaData(
              metaData || {
                hasNextPage: false,
                hasPreviousPage: false,
                itemCount: 0,
                page: 1,
                pageCount: 1,
                take: 10,
              },
            ),
          );

          setTimeout(() => {
            dispatch(participantSlice.actions.setEditModalShow(false));
          }, 2000);
          // Cập nhật lại dữ liệu sau khi chỉnh sửa thành công, nếu cần
        } else {
          toast.error('Cập nhật dữ liệu thất bại');
        }
      } catch (error) {
        toast.error('Cập nhật dữ liệu thất bại');
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
      listOfUnionDept?.map((unionDepartment: UnionDepartment) => ({
        value: unionDepartment.id,
        label: unionDepartment.name,
      })),
    [listOfUnionDept],
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

  const handleResetClick = () => {
    const originParticipant = editParticipant;

    setFamilyName(originParticipant?.familyName || '');
    setGivenName(originParticipant?.givenName || '');
    setSId(originParticipant?.sID || '');
    setUId(originParticipant?.uID || '');
    setDob(originParticipant?.dob || '');
    setEmail(originParticipant?.email || '');
    setPhone(originParticipant?.phone || '');
    setGender(originParticipant?.gender || undefined);
    setFaculty(faculty);
    setUnionDept(originParticipant?.unionDept);
    setUnionJoinDate(originParticipant?.unionJoinDate || '');
    setWorkingStatus(originParticipant?.workingStatus);
    setIsUnionMember(originParticipant?.isUnionMember || false);
    setNumOfChildren(originParticipant?.numOfChildren || 0);
    setListOfChildren(originParticipant?.childs || []);
  };

  const footer = (
    <div>
      <Button label="Đóng" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label="Trở lại ban đầu" icon="pi pi-refresh" onClick={handleResetClick} className="p-button-text" />
      <Button label="Thay đổi" icon="pi pi-check" onClick={handleSubmit} className="p-ml-2" />
    </div>
  );

  return (
    <Dialog
      header="Cập nhập: Công đoàn viên"
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
                options={optionFaculty}
                id="faculty"
                value={faculty?.id}
                onChange={(e) => {
                  const curFaculty = listOfFaculty.find((faculty: Faculty) => faculty.id === e.value);
                  setFaculty(curFaculty);
                  setUnionDept(listOfUnionDept?.find((dept: UnionDepartment) => dept.id === curFaculty?.unionDeptId));
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
                    value={faculty?.unionDeptId}
                    options={optionUnionDepartments}
                    onChange={(e) =>
                      setUnionDept(listOfUnionDept?.find((dept: UnionDepartment) => dept.id === e.value))
                    }
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

                  <div className="field col-12 md:col-3">
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

                  <div className="field col-12 md:col-1 flex align-items-end flex-wrap">
                    <Button
                      id={`deleteChild${index}`}
                      icon="pi pi-trash"
                      className="p-button-danger delete-btn"
                      onClick={() => handleDeleteChild(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </form>
    </Dialog>
  );
};

export default EditParticipant;
