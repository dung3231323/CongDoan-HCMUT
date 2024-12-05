import React, { useEffect } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { Button } from 'primereact/button';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Link } from 'react-router-dom';

import { Column } from 'primereact/column';
// import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import AddAchievementDialog from '../modal/AddAchievementDialog';
import EditAchievementDialog from '../modal/EditAchievementDialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
// import achievementFakedata from '../data';
import moment from 'moment';
import 'moment/locale/vi';
import { AchievementAPI, APIResponse } from '@/services/achievement';
import { Achievement } from '@/types/achievement';
import achievementSlice from '@/states/slices/achievement';
import { RootState } from '@/states/store';

const AchievementPage: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const dispatch = useDispatch();
  // const [addNewVisible, setAddNewVisible] = useState(false);
  // const [editVisible, setEditVisible] = useState(false);
  // const [editAchievement, setEditAchievement] = useState<Achievement | undefined>(undefined);
  // const [deleteAchievement, setDeleteAchievement] = useState<Achievement | undefined>(undefined);
  // const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 1 });
  // const [loading, setLoading] = useState(false);
  const data = useTypedSelector((state) => state.achievement.data);
  // const metaData = useTypedSelector((state) => state.achievement.metaData);
  const lazyParams = useTypedSelector((state) => state.achievement.lazyParams);
  // const loading = useTypedSelector((state) => state.achievement.loading);
  const addNewVisible = useTypedSelector((state) => state.achievement.addNewVisible);
  const editVisible = useTypedSelector((state) => state.achievement.editVisible);
  const editAchievement = useTypedSelector((state) => state.achievement.editAchievement);
  // const deleteAchievement = useTypedSelector((state) => state.achievement.deleteAchievement);
  // const [rowsPerPage, setRowsPerPage] = useState<number>(lazyParams.rows);
  // useEffect(() => {
  //   moment.locale('vi');
  //   document.title = 'Danh mục thành tích';
  // }, []);
  const indexBodyTemplate = (rowData: Achievement, column: { rowIndex: number }) => {
    // console.log(lazyParams.page, lazyParams.rows, column.rowIndex);
    console.log(rowData);
    return (lazyParams.page - 1) * lazyParams.rows + column.rowIndex + 1;
  };
  const convertDate = (rowData: Achievement) => {
    const date = new Date(rowData.signDate);
    const formattedDate =
      date.getDate().toString().padStart(2, '0') +
      '/' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      date.getFullYear().toString().substr(-2);
    return formattedDate;
  };
  const lastUpdateTemplate = (rowData: Achievement) => {
    return moment(rowData.updateAt).locale('vi').fromNow();
  };

  const loadLazyData = async (event: DataTablePageEvent) => {
    dispatch(achievementSlice.actions.setLoading(true));
    const page = event.first / event.rows + 1;
    const rows = event.rows;

    try {
      const response: APIResponse<Achievement[]> | undefined = await AchievementAPI.getAll(page, rows);
      if (response) {
        console.log(response?.data);
        dispatch(
          achievementSlice.actions.setAchievementData(response?.data || []),
          // achievementSlice.actions.setMetaData(
          //   response.metaData || {
          //     hasNextPage: false,
          //     hasPreviousPage: false,
          //     itemCount: 0,
          //     page: 1,
          //     pageCount: 1,
          //     take: 10,
          //   },
          // ),
        );
        // dispatch(achievementSlice.actions.setLazyParams({ first: event.first, rows: event.rows, page: page - 1 }));
      }
      const responseFaculty = await AchievementAPI.getFaculties();
      if (responseFaculty) {
        console.log(responseFaculty?.data);
        dispatch(achievementSlice.actions.setFaculties(responseFaculty?.data || []));
      }
      const responseParticipant = await AchievementAPI.getParticipants();
      if (responseParticipant) {
        console.log(responseParticipant);
        dispatch(achievementSlice.actions.setParticipant(responseParticipant));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      dispatch(achievementSlice.actions.setLoading(false));
    }
  };

  useEffect(() => {
    loadLazyData({ first: 0, rows: lazyParams.rows, page: 0 });
  }, []);

  // const toast = useRef<Toast>(null);

  // const accept = () => {
  //   toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  // };

  // const reject = () => {
  //   toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  // };
  const handleDelete = (rowData: Achievement): void => {
    // console.log(rowData);
    // dispatch(achievementSlice.actions.setDeleteAchievement(rowData));
    // console.log(deleteAchievement);
    confirmDialog({
      message: `Bạn có muốn xóa thành tích có số hiệu ${rowData?.no} ra khỏi hệ thống?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Hủy',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          const response = await AchievementAPI.delete(rowData.id);
          if (response) {
            const fetchResponse: APIResponse<Achievement[]> | undefined = await AchievementAPI.getAll(
              lazyParams.page,
              lazyParams.rows,
            );
            if (fetchResponse) {
              dispatch(achievementSlice.actions.setAchievementData(fetchResponse?.data || []));
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          // dispatch(achievementSlice.actions.setDeleteAchievement(undefined));
        }
      },
    });
  };

  const handleEdit = (rowData: Achievement): void => {
    // console.log(rowData);
    dispatch(achievementSlice.actions.setEditAchievement(rowData));
    dispatch(achievementSlice.actions.setEditVisible(true));
    // dispatch(userSlice.actions.setEditModalVisibility({ visibility: true }));
  };

  return (
    <div className="m-5">
      {/* <AddAchievementDialog></AddAchievementDialog> */}
      <ConfirmDialog dismissableMask closeOnEscape></ConfirmDialog>
      {/* <AddAchievementDialog></AddAchievementDialog> */}
      {addNewVisible && <AddAchievementDialog></AddAchievementDialog>}
      {/* <EditAchievementDialog editAchievement={editAchievement}></EditAchievementDialog> */}
      {editVisible && <EditAchievementDialog editAchievement={editAchievement}></EditAchievementDialog>}
      <Panel header="Danh mục: Thành tích">
        <Button
          label="Thêm mới"
          icon="pi pi-plus"
          className="p-button-sm mr-2"
          onClick={() => {
            dispatch(achievementSlice.actions.setAddNewVisible(true));
          }}
        />
        <Button label="Tìm kiếm" icon="pi pi-search" className="p-button-sm mr-2">
          <Link to="/achievement-search" className="absolute w-full h-full -ml-2"></Link>
        </Button>

        <DataTable
          value={data}
          paginator
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          rows={5}
          scrollable
          scrollHeight="450px"
          selectionMode="single"
          className="mt-4"
          size="small"
          rowHover
        >
          <Column alignHeader="center" align="center" body={indexBodyTemplate} header="STT"></Column>
          <Column alignHeader="center" align="left" field="content" header="Nội dung khen thưởng"></Column>
          <Column alignHeader="center" align="left" field="no" header="Số quyết định"></Column>
          <Column
            alignHeader="center"
            align="center"
            field="signDate"
            header="Ngày ký khen thưởng"
            body={convertDate}
          ></Column>
          <Column alignHeader="center" align="left" field="facultyName" header="Đơn vị khen thưởng"></Column>
          <Column
            alignHeader="center"
            align="center"
            field="lastUpdate"
            header="Cập nhật lần cuối"
            // body={(rowData) => new Date(rowData.updatedAt).toLocaleDateString()}
            body={lastUpdateTemplate}
          ></Column>
          <Column
            alignHeader="center"
            align="center"
            header="Thao tác"
            body={(rowData) => (
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    handleEdit(rowData);
                    // console.log(rowData);
                  }}
                  icon="pi pi-cog"
                  rounded
                  text
                  className=""
                ></Button>
                <Button icon="pi pi-file" rounded text className="p-button-warning">
                  <Link to={`/achievement-detail/${rowData.id}`} className="absolute w-full h-full -ml-2"></Link>
                </Button>
                <Button
                  onClick={() => {
                    handleDelete(rowData);
                  }}
                  icon="pi pi-trash"
                  rounded
                  text
                  className=" p-button-danger"
                ></Button>
              </div>
            )}
          />
        </DataTable>
      </Panel>
    </div>
  );
};

export default AchievementPage;
