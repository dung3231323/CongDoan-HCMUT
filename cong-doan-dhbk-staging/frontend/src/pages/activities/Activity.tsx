import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import moment from 'moment';

import { ButtonCRUD } from '@/components/activities/ButtonCRUD';
import { AllAct, ActivityAPI } from '@/services/activity';
import { CalculateTime } from '@/helpers/calcTime';

export default function Activity() {
  const [dataAct, setDataAct] = useState<AllAct[]>([]);

  const fetchData = async () => setDataAct((await ActivityAPI.getAll()).data);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-[#D8DBE0]">
      <div className="w-[95%] h-[90%] rounded-md bg-white mb-3">
        <h1 className="header-sub w-full my-2 mx-3 text-black text-4xl">Danh mục hoạt động</h1>
        <hr />
        <div className="mx-3">
          <ButtonCRUD
            children={<span className="mx-2">Thêm mới</span>}
            bgColor="#321fdb"
            icon="pi pi-plus"
            action="create-activity"
            fetchData={fetchData}
          />
          <ButtonCRUD
            children={<span className="mx-2">Tìm kiếm</span>}
            bgColor="#321fdb"
            icon="pi pi-search"
            action="find"
            fetchData={fetchData}
          />
        </div>

        <DataTable
          className="bg-white mx-3"
          value={dataAct}
          paginator
          rows={5}
          resizableColumns
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: '50rem', backgroundColor: 'white' }}
        >
          <Column
            header="STT"
            // body overloading 2 hàm 1 là: (data:any), 2 là: (data: any, options: ColumnBodyOptions)
            body={(rowData: AllAct, options) => {
              rowData;
              return options.rowIndex + 1;
            }}
            resizeable
          ></Column>
          <Column header="Tên hoạt động" field="name"></Column>
          <Column
            header="Thời gian diễn ra"
            body={(rowData: AllAct) =>
              moment(rowData.activityStartDate).format('DD/MM/YYYY') +
              ' - ' +
              moment(rowData.activityEndDate).format('DD/MM/YYYY')
            }
          ></Column>
          <Column header="Loại hoạt động" field="category.name"></Column>
          <Column header="Công đoàn bộ phận" field="unionDept.name"></Column>
          <Column header="Cập nhật lần cuối" body={(rowData: AllAct) => CalculateTime(rowData.updateAt)}></Column>
          <Column
            header="Thao tác"
            body={(rowData: AllAct) => (
              <>
                <ButtonCRUD
                  icon="pi pi-cog"
                  bgColor="#9DA5B1"
                  action="update-activity"
                  infAct={rowData}
                  fetchData={fetchData}
                />
                <ButtonCRUD
                  icon="pi pi-file"
                  bgColor="#f9b115"
                  action="read-activity"
                  infAct={rowData}
                  fetchData={fetchData}
                />
                <ButtonCRUD
                  icon="pi pi-trash"
                  bgColor="#e55353"
                  action="delete-activity"
                  infAct={rowData}
                  fetchData={fetchData}
                />
              </>
            )}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
