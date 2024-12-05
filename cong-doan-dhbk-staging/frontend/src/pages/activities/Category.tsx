import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';

import { ButtonCRUD } from '@/components/activities/ButtonCRUD';
import { AllCg, CategoryAPI } from '@/services/category';
import { CalculateTime } from '@/helpers/calcTime';

export default function Category() {
  const [dataCg, setDataCg] = useState<AllCg[]>([]);

  const fetchData = async () => setDataCg((await CategoryAPI.getAll()).data);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-[#D8DBE0]">
      <div className="w-[95%] h-[90%] rounded-md bg-white mb-3">
        <h1 className="header-sub w-full my-2 mx-3 text-2xl text-black ">Danh mục loại hoạt động</h1>
        <hr />

        <div className="mx-3">
          <ButtonCRUD
            children={<span className="mx-2">Thêm mới</span>}
            bgColor="#321fdb"
            icon="pi pi-plus"
            action="create-category"
            fetchData={fetchData}
          />
        </div>

        <DataTable
          className="bg-white mx-3"
          value={dataCg}
          paginator
          rows={5}
          resizableColumns
          rowsPerPageOptions={[5, 10, 25]}
          tableStyle={{ minWidth: '50rem', backgroundColor: 'white' }}
        >
          <Column
            header="STT"
            body={(rowData, options) => {
              rowData;
              return options.rowIndex + 1;
            }}
          ></Column>
          <Column header="Tên hoạt động" field="name"></Column>
          <Column header="Cập nhật lần cuối" body={(rowData: AllCg) => CalculateTime(rowData.updatedAt)}></Column>
          <Column
            header="Thao tác"
            body={(rowData: AllCg) => (
              <div>
                <ButtonCRUD
                  bgColor="#9DA5B1"
                  icon="pi pi-cog"
                  action="update-category"
                  infCg={rowData}
                  fetchData={fetchData}
                />
                <ButtonCRUD
                  bgColor="#e55353"
                  icon="pi pi-trash"
                  action="delete-category"
                  infCg={rowData}
                  fetchData={fetchData}
                />
              </div>
            )}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
