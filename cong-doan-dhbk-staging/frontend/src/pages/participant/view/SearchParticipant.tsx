import RowsPerPageDropdown from '@/components/datatable/RowsPerPageDropdown';
import FacultyAPI from '@/services/faculty';
import UnionDepartmentAPI from '@/services/unionDepartment';
import facultySlice from '@/states/slices/faculty';
import searchParticipantSlice from '@/states/slices/searchParticipant';
import unionDepartmentSlice from '@/states/slices/unionDepartment';
import { RootState } from '@/states/store';
import { Participant } from '@/types/participant';
import { UnionDepartment } from '@/types/unionDepartment';
import moment from 'moment';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Tooltip } from 'primereact/tooltip';
import React, { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import SearchParticipantDialog from '../modal/SearchParticipantDialog';
import { useNavigate } from 'react-router-dom';
import ParticipantApi, { ApiResponse } from '@/services/participant';

const SearchParticipant: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Data table
  const data = useTypedSelector((state) => state.searchParticipant.data);
  const metaData = useTypedSelector((state) => state.searchParticipant.metaData);
  const lazyParams = useTypedSelector((state) => state.searchParticipant.lazyParams);
  const loading = useTypedSelector((state) => state.searchParticipant.loading);

  const filterParticipant = useTypedSelector((state) => state.searchParticipant.filterParticipant);

  const listOfUnionDept = useTypedSelector((state) => state.unionDepartment.data);

  const searchDialoglShow = useTypedSelector((state) => state.searchParticipant.searchDialogShow);


  useEffect(() => {
    const fetchUnionDepartment = async () => {
      const { data } = await UnionDepartmentAPI.getAll();
      dispatch(unionDepartmentSlice.actions.setData(data || []));
    };

    const fetchFaculty = async () => {
      const { data } = await FacultyAPI.getAll();
      dispatch(facultySlice.actions.setData(data || []));
    };

    fetchUnionDepartment();
    fetchFaculty();
  }, [dispatch]);

  const indexBodyTemplate = (_rowData: Participant, column: { rowIndex: number }) => {
    return column.rowIndex + 1;
  };

  const lastUpdateTemplate = (rowData: Participant) => {
    return moment(rowData.updatedAt).locale('vi').fromNow();
  };

  // Handle action for each participant
  const handleSettingsClick = (participant: Participant) => {
    // setEditParticipant(participant);
    // dispatch(participantSlice.actions.setEditModalShow(true));
  };

  const handleFileClick = (participant: Participant) => {
    // setDetailParticipant(participant);
    // dispatch(participantSlice.actions.setGetDetailModalShow(true));
  };

  const handleDeleteClick = (participant: Participant) => {
    // setDeleteParticipant(participant);
    // dispatch(participantSlice.actions.setDeleteModalShow(true));
  };

  const optionButtonTemplate = (rowData: Participant) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Tooltip target=".settings-btn" content="Cập nhập" position="top" />
        <Tooltip target=".file-btn" content="Thông tin" position="top" />
        <Tooltip target=".delete-btn" content="Xóa" position="top" />
        <Button
          icon="pi pi-cog"
          className="p-button-rounded p-button-secondary settings-btn"
          style={{ margin: '0 0.25em' }}
          onClick={() => handleSettingsClick(rowData)}
        />
        <Button
          icon="pi pi-file"
          className="p-button-rounded p-button-warning file-btn"
          style={{ margin: '0 0.25em' }}
          onClick={() => handleFileClick(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger delete-btn"
          style={{ margin: '0 0.25em' }}
          onClick={() => handleDeleteClick(rowData)}
        />
      </div>
    );
  };

  const loadLazyData = async (event: DataTablePageEvent) => {
    dispatch(searchParticipantSlice.actions.setLoading(true));
    const page = Math.floor(event.first / event.rows) + 1;
    const rows = event.rows;
    try {
      const cur_filterParticipant = { ...filterParticipant, page, limit: rows };
      const response: ApiResponse<Participant[]> = await ParticipantApi.getWithFilter(cur_filterParticipant);
      if (response.status !== 404 && response.status !== 400 && response.status !== 500) {
        dispatch(searchParticipantSlice.actions.setParticipantData(response.data || []));
        dispatch(
          searchParticipantSlice.actions.setMetaData(
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
        dispatch(searchParticipantSlice.actions.setLazyParams({ first: event.first, rows: event.rows, page: page- 1}));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      dispatch(searchParticipantSlice.actions.setLoading(false));
    }
  };

  useEffect(() => {
    moment.locale('vi');
    document.title = 'Danh mục tài khoản';  
    loadLazyData({ first: 0, rows: lazyParams.rows, page: 1 });
  }, []);
  
  return (
    <div className="p-4" style={{ overflowY: 'auto' }}>
      <Card title="Tìm kiếm: Công đoàn viên">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div> 
            <Button
              label="Danh sách chính"
              icon="pi pi-user"
              className="p-button-sm mr-2"
              onClick={() => {
                navigate('/participants');
              }}
            />
            <Button
              label="Chọn điều kiện tìm kiếm"
              icon="pi pi-search"
              className="p-button-sm mr-2"
              onClick={() => {
                dispatch(searchParticipantSlice.actions.setSearchDialogShow(true));
              }}
            />
          </div>
          <RowsPerPageDropdown
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            value={lazyParams.rows}
            onChange={(value: number) => {
              loadLazyData({ first: Math.floor(lazyParams.first / value), rows: value, page: lazyParams.page });
            }}
          />
        </div>

        {searchDialoglShow && <SearchParticipantDialog></SearchParticipantDialog>}

        <div>
          <div>
            <DataTable
              value={data}
              lazy
              showGridlines
              stripedRows
              paginator
              paginatorPosition="bottom"
              first={lazyParams.first}
              rows={lazyParams.rows}
              totalRecords={metaData?.itemCount ?? 10}
              loading={loading}
              onPage={(e) => {
                loadLazyData(e);
              }}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              scrollable
              scrollHeight='800px'
              tableStyle={{ minWidth: '50rem', maxHeight: '80vh', overflowY: 'auto' }}
              className="data-table"
            >
              <Column
                field="#"
                header="STT"
                body={indexBodyTemplate}
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                alignHeader="center"
              />
              <Column
                field="sID"
                header="MSCB"
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                alignHeader="center"
              />
              <Column
                field="uID"
                header="MSCĐ"
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                alignHeader="center"
              />
              <Column
                field="familyName"
                header="Họ và tên lót"
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                alignHeader="center"
              />
              <Column
                field="givenName"
                header="Tên"
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                alignHeader="center"
              />
              <Column
                field="facultyName"
                header="Khoa/ Phòng ban"
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                alignHeader="center"
              />
              <Column
                field="#"
                header="Công đoàn"
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                alignHeader="center"
                body={(rowData) => {
                  const cur_unionDept = listOfUnionDept.find((u: UnionDepartment) => u.id === rowData.unionDeptId);
                  return (cur_unionDept) ? cur_unionDept.name : '';
                }}
              />
              <Column
                field="updatedAt"
                header="Cập nhật lần cuối"
                body={lastUpdateTemplate}
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                alignHeader="center"
              />
              <Column
                field="#"
                header="Thao tác"
                body={optionButtonTemplate}
                style={{ textAlign: 'center', verticalAlign: 'middle' }}
                alignHeader="center"
              />
            </DataTable>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchParticipant;