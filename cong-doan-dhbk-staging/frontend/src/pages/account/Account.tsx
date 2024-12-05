import { useEffect, useState } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import './css/account.css';
import moment from 'moment';
import 'moment/locale/vi';
moment.locale('vi');

import AddAccountModal from './modal/addAccount';
import EditAccountModal from './modal/editAccount';
import DeleteAccountModal from './modal/deleteAccount';

import { RootState } from '@/states/store';
import userSlice from '@/states/slices/user';
import UserAPI, { User, ApiResponse } from '@/services/user';
import AddAccountBatchModal from './modal/addAccount2';

export default function Account() {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const dispatch = useDispatch();

  // Các biểu mẫu
  const addModalShow = useTypedSelector((state) => state.user.addModalShow);
  const addModalShow2 = useTypedSelector((state) => state.user.addModalShow2);
  const editModalShow = useTypedSelector((state) => state.user.editModalShow);
  const [editUser, setEditUser] = useState<User | undefined>(undefined);
  const deleteModalShow = useTypedSelector((state) => state.user.deleteModalShow);
  const [deleteUser, setDeleteUser] = useState<User | undefined>(undefined);

  // DataTable
  const loading = useTypedSelector((state) => state.user.loading);
  const lazyParams = useTypedSelector((state) => state.user.lazyParams);
  const data = useTypedSelector((state) => state.user.data);
  const metadata = useTypedSelector((state) => state.user.metadata);

  // Thiết lập tiêu đề trang
  useEffect(() => {
    moment.locale('vi');
    document.title = 'Danh mục tài khoản';
  }, []);

  // Xử lý các hành động biểu mẫu
  const handleAddAccount = (): void => {
    dispatch(userSlice.actions.setAddModalVisibility({ visibility: true }));
  };
  const handleAddAccount2 = (): void => {
    dispatch(userSlice.actions.setAddModal2Visibility({ visibility: true }));
  };

  const handleEdit = (rowData: User): void => {
    setEditUser(rowData);
    dispatch(userSlice.actions.setEditModalVisibility({ visibility: true }));
  };

  const handleDelete = (rowData: User): void => {
    setDeleteUser(rowData);
    dispatch(userSlice.actions.setDeleteModalVisibility({ visibility: true }));
  };

  // Hàm xử lý DataTable
  const indexBodyTemplate = (rowData: User, column: { rowIndex: number }) => {
    console.log(rowData.email);
    return column.rowIndex + 1;
  };

  const lastUpdateTemplate = (rowData: User) => {
    moment.locale('vi');
    return moment(rowData.updateAt).fromNow();
  };

  const quantityBodyTemplate = (rowData: User) => {
    return (
      <>
        <Button severity="secondary" style={{ marginRight: '10px' }} onClick={() => handleEdit(rowData)}>
          <i className="pi pi-cog" style={{ fontSize: '1rem' }}></i>
        </Button>
        <Button severity="danger" onClick={() => handleDelete(rowData)}>
          <i className="pi pi-trash" style={{ fontSize: '1rem' }}></i>
        </Button>
      </>
    );
  };

  const loadLazyData = async (event: DataTablePageEvent) => {
    dispatch(userSlice.actions.setLoading(true));
    const page = event.first / event.rows + 1;
    const rows = event.rows;

    try {
      const response: ApiResponse | undefined = await UserAPI.get(page, rows);
      if (response) {
        dispatch(
          userSlice.actions.setData({
            data: response.data,
            metadata: response.metadata,
          }),
        );
        dispatch(userSlice.actions.setLazyParams({ first: event.first, rows: event.rows, page: page - 1 }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      dispatch(userSlice.actions.setLoading(false));
    }
  };

  useEffect(() => {
    moment.locale('vi');
    loadLazyData({ first: 0, rows: lazyParams.rows, page: 0 });
  }, []);

  return (
    <>
      <div className="container">
        <Card
          className="card"
          header={
            <div className="card-header">
              <div className="header-left">
                <strong>Danh mục: Tài khoản người dùng</strong>
                <Button size="small" onClick={handleAddAccount} className="add-button">
                  <i className="pi pi-plus" style={{ fontSize: '0.5rem' }}></i>
                  Thêm mới
                </Button>
                <Button size="small" onClick={handleAddAccount2}>
                  <i className="pi pi-plus" style={{ fontSize: '0.5rem' }}></i>
                  Thêm mới hàng loạt
                </Button>
              </div>
            </div>
          }
        >
          {addModalShow && <AddAccountModal />}
          {editModalShow && <EditAccountModal user={editUser} />}
          {deleteModalShow && <DeleteAccountModal user={deleteUser} />}
          {addModalShow2 && <AddAccountBatchModal />}
          <DataTable
            value={data}
            lazy
            paginator
            rows={lazyParams.rows}
            rowsPerPageOptions={[3, 10, 20, 30]}
            totalRecords={metadata?.totalItem ?? 10}
            loading={loading}
            first={lazyParams.first}
            onPage={loadLazyData}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            scrollable
            scrollHeight="400px"
            className="data-table"
          >
            <Column
              field="#"
              header="STT"
              body={indexBodyTemplate}
              className="column-center"
              headerClassName="column-header-center"
            />
            <Column field="email" header="Email" className="email-column" headerClassName="column-header-center" />
            <Column
              field="familyName"
              header="Họ và tên lót"
              className="column-center"
              headerClassName="column-header-center"
            />
            <Column field="givenName" header="Tên" className="column-center" headerClassName="column-header-center" />
            <Column field="role" header="Vai trò" className="column-center" headerClassName="column-header-center" />
            <Column
              field="updatedAt"
              header="Cập nhật lần cuối"
              body={lastUpdateTemplate}
              className="column-center"
              headerClassName="column-header-center"
            />
            <Column
              field="#"
              header="Thao tác"
              body={quantityBodyTemplate}
              className="column-center"
              headerClassName="column-header-center"
            />
          </DataTable>
        </Card>
      </div>
    </>
  );
}
