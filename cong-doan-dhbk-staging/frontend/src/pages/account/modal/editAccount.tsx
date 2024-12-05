import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import userSlice from '@/states/slices/user';
import UserAPI, { ApiResponse, DepartmentsApiResponse, DepartmentsInfo, EditParams, User } from '@/services/user';
import { InputText } from 'primereact/inputtext';
import { RootState } from '@/states/store';

interface EditAccountModalProps {
  user: User | undefined;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({ user }) => {
  const dispatch = useDispatch();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const lazyParams = useTypedSelector((state) => state.user.lazyParams);

  const [familyName, setFamilyName] = useState(user?.familyName ?? '');
  const [givenName, setGivenName] = useState(user?.givenName ?? '');
  const [role, setRole] = useState(user?.role ?? '');
  const [unionDept, setUnionDept] = useState<string | undefined>(user?.unionDeptId);
  const [listOfUnionDepartments, setListOfUnionDepartments] = useState<DepartmentsInfo[] | undefined>([]);

  const optionRoles = [
    {
      value: 'ADMIN',
      label: 'ADMIN',
    },
    {
      value: 'MODERATOR',
      label: 'MODERATOR',
    },
  ];

  useEffect(() => {
    const fetchUnionDepartment = async () => {
      const response: DepartmentsApiResponse | undefined = await UserAPI.getListOfUnionDepartments();
      if (response?.msg === 'Success') {
        const list: DepartmentsInfo[] = response.data;
        setListOfUnionDepartments(list);
      }
    };
    fetchUnionDepartment();
  }, []);

  const optionUnionDepts = listOfUnionDepartments?.map((unionDepartment) => ({
    value: unionDepartment.id,
    label: unionDepartment.name,
  }));

  const handleSubmit = async () => {
    const params: EditParams = {
      id: user?.id ?? 'error',
      familyName: familyName,
      givenName: givenName,
      role: role,
      unionDeptId: unionDept,
    };
    const response = await UserAPI.edit(params);
    if (response?.status === 200 && response?.statusText === 'OK') {
      try {
        dispatch(userSlice.actions.setLoading(true));
        const fetchResponse: ApiResponse | undefined = await UserAPI.get(lazyParams.page + 1, lazyParams.rows);
        if (fetchResponse) {
          dispatch(
            userSlice.actions.setData({
              data: fetchResponse.data,
              metadata: fetchResponse.metadata,
            }),
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Cập nhật thành công nhưng lấy danh sách thất bại, hãy reload lại trang web');
      } finally {
        dispatch(userSlice.actions.setLoading(false));
        toast.success('Cập nhật thành công');
      }
    } else {
      toast.error('Truyền dữ liệu thất bại');
    }
    handleClose();
  };

  const handleClose = () => {
    dispatch(userSlice.actions.setEditModalVisibility({ visibility: false }));
  };

  return (
    <Dialog
      header="Cập nhật: Tài khoản người dùng"
      visible={true}
      style={{ width: '50vw' }}
      modal
      onHide={() => handleClose()}
    >
      <div>
        Cập nhật tài khoản <strong>{user?.email}</strong>
      </div>
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="familyName">Họ và tên lót</label>
          <InputText id="familyName" value={familyName} onChange={(e) => setFamilyName(e.target.value)} required />
        </div>
        <div className="p-field">
          <label htmlFor="givenName">Tên</label>
          <InputText id="givenName" value={givenName} onChange={(e) => setGivenName(e.target.value)} required />
        </div>
        <div className="p-field">
          <label htmlFor="role">Vai trò</label>
          <Dropdown
            id="role"
            value={role}
            options={optionRoles}
            onChange={(e) => setRole(e.value)}
            placeholder="Chọn vai trò"
            required
          />
        </div>
        {role === 'MODERATOR' && (
          <div className="p-field">
            <label htmlFor="unionDept">Công đoàn</label>
            <Dropdown
              id="unionDept"
              value={unionDept}
              options={optionUnionDepts}
              onChange={(e) => setUnionDept(e.value)}
              placeholder="Chọn công đoàn"
              required
            />
          </div>
        )}
      </div>
      <div className="p-d-flex p-jc-end">
        <Button
          label="Đóng"
          className="p-button-secondary"
          style={{ marginRight: '10px', marginTop: '10px' }}
          onClick={() => handleClose()}
        />
        <Button label="Thay đổi" className="p-ml-2" onClick={() => handleSubmit()} />
      </div>
    </Dialog>
  );
};

export default EditAccountModal;
