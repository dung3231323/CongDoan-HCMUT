import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import moment from 'moment';
import 'moment/dist/locale/vi';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import { RootState } from '@/states/store';
import participantSlice from '@/states/slices/participant';
import { Participant } from '@/types/participant';
import ParticipantApi, { ApiResponse } from '@/services/participant';
import RowsPerPageDropdown from '@/components/datatable/RowsPerPageDropdown.tsx';

import AddParticipantModal from './view/AddParticipant';
import DeleteParticipant from './view/DeleteParticipant';
import GetDetailParticipant from './view/GetDetailParticipant';

import EditParticipant from './view/EditParticipant';

import { useNavigate } from 'react-router-dom';
import UnionDepartmentAPI from '@/services/unionDepartment';
import unionDepartmentSlice from '@/states/slices/unionDepartment';
import facultySlice from '@/states/slices/faculty';
import FacultyAPI from '@/services/faculty';
import { UnionDepartment } from '@/types/unionDepartment';

moment.locale('vi');

const ParticipantManagement: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Data table
  const data = useTypedSelector((state) => state.participant.data);
  const metaData = useTypedSelector((state) => state.participant.metaData);
  const lazyParams = useTypedSelector((state) => state.participant.lazyParams);
  const loading = useTypedSelector((state) => state.participant.loading);

  const addModalShow = useTypedSelector((state) => state.participant.addModalShow);

  const editModalShow = useTypedSelector((state) => state.participant.editModalShow);
  const [editParticipant, setEditParticipant] = useState<Participant | null>(null);

  const deleteModalShow = useTypedSelector((state) => state.participant.deleteModalShow);
  const [deleteParticipant, setDeleteParticipant] = useState<Participant | null>(null);

  const getDetailModalShow = useTypedSelector((state) => state.participant.getDetailModalShow);
  const [detailParticipant, setDetailParticipant] = useState<Participant | null>(null);

  const listOfUnionDept = useTypedSelector((state) => state.unionDepartment.data);

  const findUnionDept = (unionDeptId: string) => {
    const unionDept = listOfUnionDept?.find((item: UnionDepartment) => item.id === unionDeptId);
    return unionDept;
  };

  // Uncomment this block if need
  // const findFaculty = (facultyId: string) => {
  //   const faculty = listOfFaculty?.find((item: any) => item.id === facultyId);
  //   return faculty;
  // };

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

<<<<<<< HEAD
  const indexBodyTemplate = (_rowData: Participant, column: { rowIndex: number }) => {
    return column.rowIndex + 1;
=======
  const indexBodyTemplate = (_rowData: RowData, options: { rowIndex: number }) => {
    return (lazyParams.page - 1) * lazyParams.rows + options.rowIndex + 1;
>>>>>>> 364ec89ae047109cdbbfb2de5bf6f47146641eee
  };


  // Handle action for each participant
  const handleSettingsClick = (participant: Participant) => {
    setEditParticipant(participant);
    dispatch(participantSlice.actions.setEditModalShow(true));
  };

  const handleFileClick = (participant: Participant) => {
    setDetailParticipant(participant);
    dispatch(participantSlice.actions.setGetDetailModalShow(true));
  };

  const handleDeleteClick = (participant: Participant) => {
    setDeleteParticipant(participant);
    dispatch(participantSlice.actions.setDeleteModalShow(true));
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

  // Handle action for data table

  const lastUpdateTemplate = (rowData: Participant) => {
    return moment(rowData.updatedAt).locale('vi').fromNow();
  };

  const loadLazyData = async (event: DataTablePageEvent) => {
    dispatch(participantSlice.actions.setLoading(true));
    const page = Math.floor(event.first / event.rows) + 1;
    const rows = event.rows;
    try {
      const response: ApiResponse<Participant[]> = await ParticipantApi.getAll(page, rows);
      if (response.status !== 404 && response.status !== 400 && response.status !== 500) {
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
<<<<<<< HEAD
        dispatch(participantSlice.actions.setLazyParams({ first: event.first, rows: event.rows, page: page- 1}));
=======
      } else {
        const response: ApiResponse<Participant[]> = await ParticipantApi.getAll(1, lazyParams.rows);
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
>>>>>>> 364ec89ae047109cdbbfb2de5bf6f47146641eee
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      dispatch(participantSlice.actions.setLoading(false));
    }
  };

  useEffect(() => {
    moment.locale('vi');
    document.title = 'Danh mục tài khoản';  
    loadLazyData({ first: 0, rows: lazyParams.rows, page: 1 });
  }, []);

  return (
    <div className="p-4" style={{ overflowY: 'auto' }}>
      <Card title="Danh mục: Công đoàn viên">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Button
              label="Thêm mới"
              icon="pi pi-plus"
              className="p-button-sm mr-2"
              onClick={() => {
                dispatch(participantSlice.actions.setAddModalShow(true));
              }}
            />
            <Button
              label="Thêm hàng loạt"
              icon="pi pi-plus"
              className="p-button-sm mr-2"
              onClick={() =>  navigate('/participants/add-bulk')}
            />
            <Button
              label="Tìm kiếm"
              icon="pi pi-search"
              className="p-button-sm mr-2"
              onClick={() => {
                navigate('/participants/search');
              }}
            />
            <Button
              label="Cập nhật hàng loạt"
              icon="pi pi-refresh"
              className="p-button-sm mr-2"
              onClick={() => navigate('/participants/edit-bulk')}
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

        {addModalShow && <AddParticipantModal />}

        {deleteModalShow && <DeleteParticipant participant={deleteParticipant} />}

        {getDetailModalShow && <GetDetailParticipant participantId={detailParticipant?.id || ''} />}

        {editModalShow && <EditParticipant participantId={editParticipant?.id || ''} />}

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
                  const unionDept = findUnionDept(rowData.unionDeptId);
                  return unionDept ? unionDept.name : '';
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

export default ParticipantManagement;
