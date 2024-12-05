import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import { Panel } from 'primereact/panel';
import { TabPanel, TabView } from 'primereact/tabview';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

const EditBarchParticipant: React.FC = () => {
  // const dispatch = useDispatch();
  const [inputData, setInputData] = useState('');
  // const [parseData, setParseData] = useState<any[]>([]);
  // const [listSID, setListSID] = useState<string[]>([]);
  const [isParse, setIsParse] = React.useState(false);

  // const [isCreate, setIsCreate] = React.useState(false);
  // const [isUpdate, setIsUpdate] = React.useState(false);
  // const [isDelete, setIsDelete] = React.useState(false);

  // const [detailParticipant, setDetailParticipant] = React.useState<any>(null);

  // const [needToCreate, setNeedToCreate] = React.useState<any[]>([]);
  // const [needToUpdate, setNeedToUpdate] = React.useState<any[]>([]);
  // const [needToDelete, setNeedToDelete] = React.useState<any[]>([]);

  const handleInputChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setInputData(e.currentTarget.value);
    setIsParse(false);
  };

  // const parseInputData = () => {
  //   setIsParse(true);
  // };

  // const handleCreateBulk = async () => {
  //   setIsParse(false);
  // };

  // const handleUpdateBulk = async () => {
  //   setIsParse(false);
  // };

  const handleResetClick = () => {
    setInputData('');
    setIsParse(false);
  };

  const footer = (
    <div>
      {!isParse && (
        <Button
          label="Xem trước"
          icon="pi pi-eye"
          onClick={() => {
            setIsParse(true);
          }}
        />
      )}
      {isParse && (
        <Button
          label="Xem trước"
          icon="pi pi-eye"
          className="p-button-text"
          onClick={() => {
            setIsParse(true);
          }}
        />
      )}
      <Button label="Reset" icon="pi pi-refresh" onClick={handleResetClick} className="p-button-text" />
    </div>
  );

  const footerOfNeedToCreate = (
    <div>
      <Button
        label="Thêm hàng loạt"
        icon="pi pi-check"
        // onClick={() => {
        //   setIsCreate(true);
        // }}
      />
    </div>
  );

  const footerOfNeedToUpdate = (
    <div>
      <Button
        label="Cập nhập hàng loạt"
        icon="pi pi-sync"
        // onClick={() => {
        //   setIsUpdate(true);
        // }}
        className="p-button-success"
      />
    </div>
  );

  const footerOfNeedToDelete = (
    <div>
      <Button
        label="Xóa hàng loạt"
        icon="pi pi-trash"
        // onClick={() => {
        //   setIsDelete(true);
        // }}
        className="p-button-danger"
      />
    </div>
  );
  return (
    <div className="p-4" style={{ overflowY: 'auto' }}>
      <Panel header="Cập nhập: Danh sách Công đoàn viên" footer={footer}>
        <div>
          <label
            htmlFor="inputData"
            style={{
              display: 'block',
              marginBottom: '16px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Nhập danh sách Công đoàn viên
          </label>

          <InputTextarea
            id="inputData"
            autoFocus
            value={inputData}
            onChange={handleInputChange}
            rows={10}
            cols={80}
            placeholder="Danh sách Công đoàn viên"
            style={{ width: '100%' }}
          />
        </div>
      </Panel>
      {isParse && (
        <>
          <TabView>
            <TabPanel header="Thêm mới">
              <Panel header="Danh sách Công đoàn viên cần thêm mới" footer={footerOfNeedToCreate}>
                <div>
                  <DataTable /* value={needToCreate} */ responsiveLayout="scroll">
                    <Column field="sId" header="MSCB" />
                    <Column field="uId" header="MSCĐ" />
                    <Column field="familyName" header="Họ và tên lót" />
                    <Column field="givenName" header="Tên" />
                    <Column field="faculty" header="Khoa/ Phòng ban/ Trung Tâm" />
                    <Column field="unionDept" header="Công Đoàn" />
                    <Column
                      field="checked"
                      header="Kiểm tra"
                      body={(rowData) => (rowData.checked ? 'Hợp lệ' : 'Không hợp lệ')}
                    />
                  </DataTable>
                </div>
              </Panel>
            </TabPanel>
            <TabPanel header="Cập nhập">
              <Panel header="Danh sách Công đoàn viên cần cập nhập" footer={footerOfNeedToUpdate}>
                <div>
                  <DataTable /* value={needToUpdate} */ responsiveLayout="scroll">
                    <Column field="sId" header="MSCB" />
                    <Column field="uId" header="MSCĐ" />
                    <Column field="familyName" header="Họ và tên lót" />
                    <Column field="givenName" header="Tên" />
                    <Column field="faculty" header="Khoa/ Phòng ban/ Trung Tâm" />
                    <Column field="unionDept" header="Công Đoàn" />
                    <Column
                      field="checked"
                      header="Kiểm tra"
                      body={(rowData) => (rowData.checked ? 'Hợp lệ' : 'Không hợp lệ')}
                    />
                  </DataTable>
                </div>
              </Panel>
            </TabPanel>
            <TabPanel header="Xóa">
              <Panel header="Danh sách Công đoàn viên cần xóa" footer={footerOfNeedToDelete}>
                <div>
                  <DataTable /* value={needToDelete} */ responsiveLayout="scroll">
                    <Column field="sId" header="MSCB" />
                    <Column field="uId" header="MSCĐ" />
                    <Column field="familyName" header="Họ và tên lót" />
                    <Column field="givenName" header="Tên" />
                    <Column field="faculty" header="Khoa/ Phòng ban/ Trung Tâm" />
                    <Column field="unionDept" header="Công Đoàn" />
                    <Column
                      field="checked"
                      header="Kiểm tra"
                      body={(rowData) => (rowData.checked ? 'Hợp lệ' : 'Không hợp lệ')}
                    />
                  </DataTable>
                </div>
              </Panel>
            </TabPanel>
          </TabView>
        </>
      )}
    </div>
  );
};

export default EditBarchParticipant;
