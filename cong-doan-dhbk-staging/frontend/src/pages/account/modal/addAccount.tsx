import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { toast } from 'react-toastify';
import userSlice from '@/states/slices/user';
import UserAPI, { DepartmentsApiResponse, DepartmentsInfo, CreateParams, ApiResponse } from '@/services/user';
import { RootState } from '@/states/store';

export default function AddAccountModal() {
  const dispatch = useDispatch();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const lazyParams = useTypedSelector((state) => state.user.lazyParams);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [unionDept, setUnionDept] = useState(undefined);
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
        console.log(response);
        const list: DepartmentsInfo[] = response.data;
        console.log(list);
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
    if (email === '' || role === '' || (role === 'MODERATOR' && unionDept === undefined)) {
      toast.error('Thiếu thông tin');
      return;
    }
    const createParams: CreateParams = {
      email: email,
      role: role,
      unionDeptId: unionDept,
    };
    const response = await UserAPI.create(createParams);
    console.log(response);
    if (response?.status === 201 && response.statusText === 'Created') {
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
        toast.error('Đã thêm thành công nhưng lấy danh sách thất bại, hãy reload lại trang web');
      } finally {
        dispatch(userSlice.actions.setLoading(false));
        toast.success('Thêm dữ liệu thành công');
      }
    } else {
      toast.error('Truyền dữ liệu thất bại');
    }
    handleClose();
  };

  const handleClose = () => {
    dispatch(userSlice.actions.setAddModalVisibility({ visibility: false }));
  };

  return (
    <Dialog header="Thêm mới: Tài khoản người dùng" visible={true} style={{ width: '50vw' }} modal onHide={handleClose}>
      <div className="p-fluid">
        <div className="p-field">
          <label htmlFor="email">Email</label>
          <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
          onClick={handleClose}
        />
        <Button label="Thêm mới" className="p-ml-2" onClick={handleSubmit} />
      </div>
    </Dialog>
  );
}
