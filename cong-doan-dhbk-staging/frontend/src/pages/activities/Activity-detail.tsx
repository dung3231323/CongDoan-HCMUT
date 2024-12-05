import { Button } from 'primereact/button';
import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useLocation } from 'react-router-dom';
import moment from 'moment';

import { ButtonCRUD } from '@/components/activities/ButtonCRUD';
// import { ActivityAPI } from '@/services/activity';

// interface Preview {
//   name: string;
//   check: string;
// }
export default function DetailActivity() {
  //show block
  const [showAddMember, setShowAddMember] = useState<boolean>(false);
  const [showMoreTable, setShowMoreTable] = useState<boolean>(false);

  // Khi người dùng bấm vào nút, thay đổi trạng thái của khối
  const handleButtonClick = () => {
    setShowMoreTable(false);
    return setShowAddMember(!showAddMember);
  };

  //show bảng ktra xem dữ liệu hợp lệ chưa
  const showMore = () => {
    return setShowMoreTable(!showMoreTable);
  };

  const fetchData = async () => {};
  const location = useLocation();
  const { infAct } = location.state || {}; // Lấy các giá trị từ state của Link

  //hiển thị thêm trạng thái hợp lệ hoặc không
  // const [inputMSCBs, setInputMSCBs] = useState<string[]>([]);
  // const [preview, setPreview] = useState<Preview[]>([]);
  // const handleButtonPreview = async () => {
  // return inputMSCBs.map(inputMSCB =>{
  //  {

  //  }
  // })
  // };

  //xử lý cái nào ok thì mới cho vô infAct
  // const handleSubmit = async () => {
  //   await ActivityAPI.AddParticipantModal(infAct);
  // };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-[#D8DBE0]">
        <div className="w-[95%] h-[90%] rounded-md bg-white mb-3">
          <div className="flex justify-between w-full my-2">
            <h1 className="header-sub text-4xl text-black my-auto ml-3">Chi tiết hoạt động</h1>
            <ButtonCRUD
              bgColor="#45444e"
              children={<span className="mx-2">Quay lại</span>}
              icon="pi pi-undo"
              action="back"
              fetchData={fetchData}
            />
          </div>
          <hr />

          <div className="flex justify-center items-center mb-4">
            <div className="w-full mt-3 mx-3">
              <div className="w-full flex justify-between items-center">
                <div className="w-[47%] inline-block">
                  <label htmlFor="event_date" className="block mb-2 text-black text-xl">
                    Ngày diễn ra hoạt động
                  </label>
                  <InputText
                    disabled
                    placeholder="dd/mm/yyyy"
                    className="w-full p-inputtext-lg"
                    id="event_date"
                    value={moment(infAct.activityStartDate).format('DD/MM/YYYY')}
                  />
                </div>
                <div className="w-[47%] inline-block">
                  <label htmlFor="end-day" className="block mb-2 text-black text-xl">
                    Ngày diễn ra hoạt động
                  </label>
                  <InputText
                    disabled
                    placeholder="dd/mm/yyyy"
                    className="w-full p-inputtext-lg"
                    id="end-day"
                    value={moment(infAct.activityEndDate).format('DD/MM/YYYY')}
                  />
                </div>
              </div>

              <label className="mt-3 mb-2 text-xl text-black block" htmlFor="buttondisplay">
                Tên hoạt động
              </label>
              <InputText disabled className="w-full p-inputtext-lg" id="event_date" value={infAct.name} />

              <label className="mt-3 mb-2 text-black text-xl block" htmlFor="buttondisplay">
                Đường dẫn hình ảnh hoạt động
              </label>
              <InputText disabled className="w-full p-inputtext-lg" id="event_date" value={infAct.imgURL} />
            </div>
          </div>
          <hr />

          <div className="flex justify-between w-full my-2">
            <h1 className="header-sub text-4xl text-black my-auto ml-3">Danh sách người tham gia</h1>
            <Button
              label="Thêm hàng loạt"
              icon="pi pi-plus"
              onClick={handleButtonClick}
              className="hover:bg-opacity-50 text-[16px] rounded-md h-10 my-2 mr-3 bg-[#321fdb] border-none text-white"
            ></Button>
            {showAddMember && (
              <>
                <div className="fixed flex justify-center items-center top-0 bottom-0 left-0 right-0 z-50 bg-black bg-opacity-[.2]">
                  <div className="w-[80%] bg-white rounded-lg">
                    <div className="flex justify-between items-center ">
                      <h1 className="text-black text-2xl ml-3">Thêm danh sách Công đoàn viên tham gia hoạt động</h1>
                      <Button
                        className="p-[2%] bg-transparent border-none"
                        icon={'pi pi-times-circle text-2xl mr-3'}
                        onClick={handleButtonClick}
                      ></Button>
                    </div>
                    <hr />

                    <div className="flex justify-center items-center mb-3">
                      <div className="w-full mt-2 mx-3">
                        <label className="my-2 text-black text-xl block">Công đoàn viên tham gia hoạt động</label>
                        <InputTextarea
                          className="w-full"
                          rows={6}
                          cols={2} // value={input}
                          // onChange={(e) => setInputMSCBs(e.target.value.split('\n'))}
                        />
                      </div>
                    </div>

                    {!showMoreTable && (
                      <>
                        <hr />
                        <div className="flex justify-end items-center mr-3 mb-3">
                          <Button
                            className="hover:bg-opacity-50 text-[16px] px-3 py-2 mt-3 bg-[#321fdb] border-none text-white"
                            onClick={() => {
                              showMore();
                              // handleButtonPreview();
                            }}
                            label={'Xem trước'}
                          ></Button>
                        </div>
                      </>
                    )}

                    {showMoreTable && (
                      <>
                        <h1 className="text-black text-xl ml-3 mb-2">
                          Thêm danh sách Công đoàn viên tham gia hoạt động
                        </h1>
                        <div className="mx-3 mb-3">
                          <DataTable
                            resizableColumns
                            // value={products}
                            tableStyle={{ minWidth: '50rem' }}
                          >
                            <Column
                              header="STT"
                              style={{ width: '5%' }}
                              body={(props, options) => {
                                props;
                                return options.rowIndex + 1;
                              }}
                            ></Column>
                            <Column field="" header="MSCB" style={{ width: '10%' }}></Column>
                            <Column field="" header="Họ và tên lót"></Column>
                            <Column field="" header="Tên"></Column>
                            <Column field="" header="Khoa/ Phòng ban/ Trung Tâm"></Column>
                            <Column field="" header="Kiểm tra"></Column>
                          </DataTable>
                        </div>

                        <hr />
                        <div className="flex justify-end items-center mr-3 mb-3">
                          <Button
                            className="hover:bg-opacity-50 text-[16px] px-3 py-2 mt-3 bg-[#321fdb] border-none text-white"
                            // onClick={handleSubmit()}
                            label={'Thêm hàng loạt'}
                          ></Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mx-3">
            <DataTable
              resizableColumns
              // value={products}
              tableStyle={{ minWidth: '50rem' }}
            >
              <Column field="" header="STT"></Column>
              <Column field="" header="MSCB"></Column>
              <Column field="" header="Họ và tên lót"></Column>
              <Column field="" header="Tên"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
}
