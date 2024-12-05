import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';
import '../css/addAccount2.css';
import userSlice from '@/states/slices/user';
import UserAPI, { ApiResponse, CreateManyResult, DepartmentsApiResponse, DepartmentsInfo } from '@/services/user';
import { RootState } from '@/states/store';

const AddAccountBatchModal = () => {
  const dispatch = useDispatch();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const addModalShow2 = useTypedSelector((state) => state.user.addModalShow2);
  const lazyParams = useTypedSelector((state) => state.user.lazyParams);

  const [file, setFile] = useState<File | null>(null);
  const [userList, setUserList] = useState<
    { email: string; role: string; unionDept: string | undefined; isValid: boolean; errors: string[] }[]
  >([]);
  const [previewList, setPreviewList] = useState<
    { email: string; role: string; unionDept: string | undefined; isValid: boolean; errors: string[] }[]
  >([]);
  const [resultList, setResultList] = useState<CreateManyResult[] | undefined>([]);
  const [loading, setLoading] = useState(false);
  const [listOfUnionDepartments, setListOfUnionDepartments] = useState<DepartmentsInfo[]>([]);
  const [isSent, setIsSent] = useState<boolean>(false);

  useEffect(() => {
    const fetchUnionDepts = async () => {
      const response: DepartmentsApiResponse | undefined = await UserAPI.getListOfUnionDepartments();
      if (response && response.msg === 'Success') {
        setListOfUnionDepartments(response.data);
      }
    };
    fetchUnionDepts();
  }, []);

  const unionDeptOptions = listOfUnionDepartments.map((dept) => ({
    label: dept.name,
    value: dept.name,
  }));

  const roleOptions = [
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'MODERATOR', value: 'MODERATOR' },
  ];

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const processFile = () => {
    if (file) {
      const fileType = file.name.split('.').pop();
      if (fileType === 'xlsx') {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            handleUserList(json);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (fileType === 'csv') {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            handleUserList(results.data);
          },
        });
      }
    }
  };

  const validateUser = (user: { email: string; role: string; unionDept: string | undefined }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(user.email);
    const isValidRole = ['ADMIN', 'MODERATOR'].includes(user.role);
    const isValidUnionDept =
      user.role === 'ADMIN' || listOfUnionDepartments.some((dept) => dept.name === user.unionDept);
    const errors: string[] = [];

    if (!isValidEmail) errors.push('Email không hợp lệ');
    if (!isValidRole) errors.push('Role không hợp lệ');
    if (!isValidUnionDept) errors.push('UnionDept không hợp lệ');

    return { isValid: isValidEmail && isValidRole && isValidUnionDept, errors };
  };

  const handleUserList = (data: any[]) => {
    const processedList = data.map((row) => {
      const user = {
        email: row.email,
        role: row.role,
        unionDept: row.unionDept,
      };
      const { isValid, errors } = validateUser(user);
      return { ...user, isValid, errors };
    });
    setUserList(processedList);
    setPreviewList(processedList);
  };

  const createUserAccounts = async () => {
    setIsSent(true);
    setLoading(true);
    try {
      const validUsers = userList
        .filter((user) => user.isValid)
        .map((user) => {
          const unionDept = listOfUnionDepartments.find((dept) => dept.name === user.unionDept);
          return {
            email: user.email,
            role: user.role,
            unionDeptId: unionDept ? unionDept.id : undefined,
          };
        });
      const resultList: CreateManyResult[] | undefined = await UserAPI.createMany(validUsers);
      setResultList(resultList);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra trong quá trình tạo tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (rowData: any) => {
    return rowData.isValid ? (
      <i className="pi pi-check" style={{ color: 'green' }}></i>
    ) : (
      <i className="pi pi-times" style={{ color: 'red' }} title={rowData.errors.join(', ')}></i>
    );
  };

  const renderResult = (rowData: any) => {
    return rowData.result === 'Success' ? (
      <i className="pi pi-check" style={{ color: 'green' }}></i>
    ) : (
      <i className="pi pi-times" style={{ color: 'red' }} title={rowData.reason}></i>
    );
  };

  const fetchListAgain = async () => {
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
      toast.error('Lấy danh sách thất bại, hãy reload lại trang web');
    } finally {
      dispatch(userSlice.actions.setLoading(false));
      toast.success('Cập nhật thành công');
    }
  };

  const handleClose = () => {
    if (isSent) fetchListAgain();
    dispatch(userSlice.actions.setAddModal2Visibility({ visibility: false }));
  };

  const handleDropdownChange = (value: any, field: string, email: string) => {
    const updatedUserList = previewList.map((user) => {
      if (user.email === email) {
        const updatedUser = { ...user, [field]: value };
        const { isValid, errors } = validateUser(updatedUser);
        return { ...updatedUser, isValid, errors };
      }
      return user;
    });
    setPreviewList(updatedUserList);
    setUserList(updatedUserList);
  };

  return (
    <Dialog
      header="Thêm mới hàng loạt: Tài khoản người dùng"
      visible={addModalShow2}
      style={{ width: '60vw' }}
      onHide={handleClose}
      modal
      className="dialog-header"
    >
      <div className="p-fluid file-upload">
        <div className="p-field">
          <h5>Tải tệp lên</h5>
          <input type="file" accept=".xlsx, .csv" onChange={handleFile} />
        </div>
        <Button label="Kiểm tra" icon="pi pi-check" style={{ marginTop: '10px' }} onClick={processFile} />
        {previewList.length > 0 && (
          <div className="card preview-card">
            <DataTable value={previewList} header={<div className="data-table-header">Xem trước và chỉnh sửa</div>}>
              <Column field="email" header="Email" className="data-column" />
              <Column
                field="role"
                header="Vai trò"
                body={(rowData) => (
                  <Dropdown
                    placeholder={rowData.role}
                    value={rowData.role}
                    options={roleOptions}
                    onChange={(e) => handleDropdownChange(e.value, 'role', rowData.email)}
                  />
                )}
                className="data-column"
              />
              <Column
                field="unionDept"
                header="Công đoàn"
                body={(rowData) => (
                  <Dropdown
                    placeholder={rowData.unionDept}
                    value={rowData.unionDept}
                    options={unionDeptOptions}
                    onChange={(e) => handleDropdownChange(e.value, 'unionDept', rowData.email)}
                  />
                )}
                className="data-column"
              />
              <Column header="Có thể thêm" body={renderStatus} className="data-column" />
            </DataTable>
            <div className="action-buttons">
              <Button label="Hủy" icon="pi pi-times" className="p-button-secondary" onClick={handleClose} />
              <Button label="Thêm hàng loạt" icon="pi pi-check" onClick={createUserAccounts} loading={loading} />
            </div>
          </div>
        )}
        {resultList && resultList.length > 0 && (
          <div className="card">
            <DataTable value={resultList} header={<div className="data-table-header">Kết quả</div>}>
              <Column field="email" header="Email" className="data-column" />
              <Column header="Kết quả" body={renderResult} className="data-column" />
            </DataTable>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default AddAccountBatchModal;
