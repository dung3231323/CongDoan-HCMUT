import { Participant } from '@/types/participant';
import participantSlice from '@/states/slices/participant';
import { RootState } from '@/states/store';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { Toast } from 'primereact/toast';
import { WorkingStatus, WorkingStatusOption } from '@/types/workingStatus';
import { Gender, GenderOption } from '@/types/gender';
import UnionDepartmentAPI from '@/services/unionDepartment';
import unionDepartmentSlice from '@/states/slices/unionDepartment';
import FacultyAPI from '@/services/faculty';
import facultySlice from '@/states/slices/faculty';
import { UnionDepartment } from '@/types/unionDepartment';
import ParticipantApi from '@/services/participant';
import { Faculty } from '@/types/faculty';

interface GetDetailParticipantProps {
  participantId: string;
}

const GetDetailParticipant: React.FC<GetDetailParticipantProps> = ({ participantId }) => {
  const dispatch = useDispatch();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const toast = useRef<Toast>(null);

  const visible = useTypedSelector((state: RootState) => state.participant.getDetailModalShow);

  const [detailParticipant, setDetailParticipant] = useState<Participant | undefined>(undefined);

  const listOfFaculty = useTypedSelector((state) => state.faculty.data);
  const listOfUnionDept = useTypedSelector((state) => state.unionDepartment.data);

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

  useEffect(() => {
    const fetchData = async () => {
      if (!participantId) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Không tìm thấy cán bộ công đoàn',
        });
        setTimeout(() => {
          dispatch(participantSlice.actions.setGetDetailModalShow(false));
        }, 2000);
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
            setDetailParticipant(data);
          } else {
            toast.current?.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Không tìm thấy dữ liệu cán bộ công đoàn',
            });

            setTimeout(() => {
              dispatch(participantSlice.actions.setGetDetailModalShow(false));
            }, 2000);
          }
        };

        await fetchFaculty();
        await fetchUnionDepartment();
        await fetchParticipant();
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Đã xảy ra lỗi khi tải dữ liệu',
        });
      }
    };

    fetchData();
  }, [participantId, dispatch]);

  const onHide = () => {
    dispatch(participantSlice.actions.setGetDetailModalShow(false));
  };

  const footer = (
    <div>
      <Button label="Đóng" icon="pi pi-times" onClick={onHide} className="p-button-text" />
    </div>
  );

  return (
    <Dialog
      header="Thôg tin chi tiết cán bộ công đoàn"
      visible={visible}
      style={{ width: '50vw' }}
      footer={footer}
      onHide={onHide}
    >
      <Toast ref={toast} />
      <form>
        <Card title="Thông tin cá nhân">
          <div className="p-fluid grid formgrid">
            <div className="field col-12 md:col-6">
              <label htmlFor="familyName">Họ và tên lót</label>
              <InputText id="familyName" disabled value={detailParticipant?.familyName} />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="givenName">Tên</label>
              <InputText id="givenName" disabled value={detailParticipant?.givenName} />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="sId">Mã số cán bộ</label>
              <InputText id="sId" disabled value={detailParticipant?.sID} />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="dob">Ngày tháng năm sinh</label>
              <Calendar
                id="dob"
                value={detailParticipant?.dob ? new Date(detailParticipant.dob) : null}
                disabled
                dateFormat="mm/dd/yy"
                showIcon
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="email">Email</label>
              <InputText id="email" disabled value={detailParticipant?.email} />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <InputText id="phone" disabled value={detailParticipant?.phone} />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="faculty">Khoa/phòng ban/trung tâm</label>
              <Dropdown
                options={optionFaculty}
                disabled
                id="faculty"
                value={detailParticipant?.facultyId}
                placeholder="Chọn khoa/ phòng ban/ trung tâm"
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="gender">Giới tính</label>
              <Dropdown
                id="gender"
                disabled
                value={detailParticipant?.gender}
                options={optionGender}
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
                  disabled
                  checked={detailParticipant?.isUnionMember || false}
                  style={{ width: '20px   ', height: '20px', marginLeft: '10px' }}
                  className="p-mr-2"
                />
              </div>
            </div>
            {detailParticipant?.isUnionMember && (
              <div className="p-fluid grid formgrid">
                <div className="field col-12 md:col-6">
                  <label htmlFor="uId">Mã số công đoàn viên</label>
                  <InputText id="uId" disabled value={detailParticipant?.uID} />
                </div>
                <div className="field col-12 md:col-6">
                  <label htmlFor="unionDept">Công đoàn bộ phận</label>

                  <Dropdown
                    id="unionDept"
                    placeholder="Công đoàn bộ phận đang sinh hoạt"
                    disabled={true}
                    value={detailParticipant.unionDeptId}
                    options={optionUnionDepartments}
                  />
                </div>

                <div className="field col-12 md:col-6">
                  <label htmlFor="unionJoinDate">Ngày gia nhập công đoàn</label>
                  <Calendar
                    id="unionJoinDate"
                    disabled
                    value={detailParticipant.unionJoinDate ? new Date(detailParticipant.unionJoinDate) : null}
                    dateFormat="mm/dd/yy"
                    showIcon
                  />
                </div>

                <div className="field col-12 md:col-6">
                  <label htmlFor="workingStatus">Tình trạng làm việc</label>
                  <Dropdown
                    id="workingStatus"
                    disabled
                    value={detailParticipant?.workingStatus}
                    options={optionWorkingStatus}
                    placeholder="Select..."
                  />
                </div>

                <div className="field col-12 md:col-6">
                  <label htmlFor="numOfChildren">Số con</label>
                  <InputNumber
                    id="numOfChildren"
                    disabled
                    value={detailParticipant.numOfChildren}
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

        {(detailParticipant?.numOfChildren || 0) > 0 && (
          <Card>
            <div className="p-fluid grid formgrid">
              <div className="field col-12 md:col-12" style={{ flex: 1 }}>
                <div className="p-mt-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Thông tin con cái
                </div>
              </div>

              {[...Array(detailParticipant?.numOfChildren || 0)].map((_, index) => (
                <div key={index} className="p-fluid grid formgrid">
                  <div className="field col-12 md:col-3">
                    <label htmlFor={`familyNameChild${index}`}>Họ và tên lót {index + 1}</label>
                    <InputText
                      id={`familyNameChild${index}`}
                      disabled
                      value={detailParticipant?.childs?.[index]?.familyName}
                    />
                  </div>

                  <div className="field col-12 md:col-3">
                    <label htmlFor={`givenNameChild${index}`}>Tên {index + 1}</label>
                    <InputText
                      id={`givenNameChild${index}`}
                      disabled
                      value={detailParticipant?.childs?.[index]?.givenName}
                    />
                  </div>

                  <div className="field col-12 md:col-4">
                    <label htmlFor={`dobChild${index}`}>Ngày tháng năm sinh {index + 1}</label>
                    <Calendar
                      id={`dobChild${index}`}
                      disabled
                      value={new Date(detailParticipant?.childs?.[index]?.dob || '')}
                      dateFormat="mm/dd/yy"
                      showIcon
                    />
                  </div>

                  <div className="field col-12 md:col-2">
                    <label htmlFor={`genderChild${index}`}>Giới tính {index + 1}</label>
                    <Dropdown
                      id={`genderChild${index}`}
                      disabled
                      value={detailParticipant?.childs?.[index]?.gender}
                      options={optionGender}
                      placeholder="Select..."
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

export default GetDetailParticipant;
