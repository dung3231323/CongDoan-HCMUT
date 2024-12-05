import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Panel } from 'primereact/panel';
import { TabPanel, TabView } from 'primereact/tabview';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Menubar } from 'primereact/menubar';
import { CreateParticipant } from '@/types/createParticipant';
import { RootState } from '@/states/store';
import moment from 'moment';
import { Tooltip } from 'primereact/tooltip';
import RowsPerPageDropdown from '@/components/datatable/RowsPerPageDropdown';
import * as XLSX from 'xlsx';
import UploadFile from '../modal/UploadFile';
import participantSlice from '@/states/slices/participant';
import { Toast } from 'primereact/toast';
import FacultyAPI from '@/services/faculty';
import facultySlice from '@/states/slices/faculty';
import UnionDepartmentAPI from '@/services/unionDepartment';
import unionDepartmentSlice from '@/states/slices/unionDepartment';
import { WorkingStatus } from '@/types/workingStatus';
import { Gender } from '@/types/gender';
import { Children } from '@/types/children';
import { templateExcelFormForCreate } from '@/public/template_excel/templateExcelFormForCreate';
import FileSaver from 'file-saver';
import { Faculty } from '@/types/faculty';
import { UnionDepartment } from '@/types/unionDepartment';

interface RowData {
  [key: string]: string | number | boolean | undefined;
}

interface MetaData {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  page: number;
  pageCount: number;
  take: number;
}

interface LazyParams {
  first: number;
  rows: number;
  page: number;
}

interface CreateParticipantWithCheck {
  participant: CreateParticipant;
  checked: boolean;
}

const AddBarch: React.FC = () => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const dispatch = useDispatch();
  const toast = useRef<Toast>(null);

  const [inputData, setInputData] = useState<CreateParticipantWithCheck[]>([]); // To handle checked participant for create
  const [isParse, setIsParse] = React.useState(false);

  const [data, setData] = useState<CreateParticipantWithCheck[]>([]); // To handle pagination
  const [metaData, setMetaData] = useState<MetaData | undefined>(undefined); // To handle pagination
  const [loading, setLoading] = useState<boolean>(false);
  const [lazyParams, setLazyParams] = useState<LazyParams>({ first: 0, rows: 10, page: 1 });

  const [isCreate, setIsCreate] = React.useState(false);

  // const [detailParticipant, setDetailParticipant] = React.useState<any>(null);

  // const [needToCreate, setNeedToCreate] = React.useState<CreateParticipant[]>([]); // To passing data api

  const [tableData, setTableData] = useState<RowData[]>([]); // to save file excel/csv data

  const upLoadShow = useTypedSelector((state) => state.participant.uploadModalShow);
  const upLoadedFile = useTypedSelector((state) => state.participant.uploadedFile);

    const listOfFaculty = useTypedSelector((state) => state.faculty.data);
    const listOfUnionDept = useTypedSelector((state) => state.unionDepartment.data);

  const findFaculty = (facultyCode: string) => {
    const faculty = listOfFaculty.find(
      (item: Faculty) => item && item.code && item.code.trim().toLowerCase() === facultyCode?.trim().toLowerCase(),
    );
    return faculty;
  };

  const findUnionDept = (unionDeptCode: string) => {
    const unionDept = listOfUnionDept.find(
      (item: UnionDepartment) =>
        item && item.code && item.code.trim().toLowerCase() === unionDeptCode?.trim().toLowerCase(),
    );
    return unionDept;
  };

  const convertToWorkingStatus = (status: string): WorkingStatus | undefined => {
    switch (status) {
      case '0':
        return WorkingStatus.Working;
      case '1':
        return WorkingStatus.Resigned;
      case '2':
        return WorkingStatus.Retired;
      default:
        return undefined;
    }
  };

  const convertToGender = (status: string): Gender | undefined => {
    switch (status) {
      case '0':
        return Gender.Male;
      case '1':
        return Gender.Female;
      default:
        return undefined;
    }
  };

  useEffect(() => {
    const fetchFaculty = async () => {
      const { status, data } = await FacultyAPI.getAll();
      if (status !== 200) return;
      dispatch(facultySlice.actions.setData(data || []));
    };
    console.log('fetchFaculty', isCreate);
    fetchFaculty();
  }, [dispatch]);

  useEffect(() => {
    const fetchUnionDepartment = async () => {
      const { status, data } = await UnionDepartmentAPI.getAll();
      if (status !== 200) return;
      dispatch(unionDepartmentSlice.actions.setData(data || []));
    };
    fetchUnionDepartment();
  }, [dispatch]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Tiêu đề trang
  useEffect(() => {
    moment.locale('vi');
    document.title = 'Thêm Công đoàn viên';
  }, []);

  const indexBodyTemplate = (rowData: CreateParticipantWithCheck) => {
    return <span>{data.indexOf(rowData) + 1}</span>;
  };

  const handleToggleUpload = () => {
    dispatch(participantSlice.actions.setUploadModalShow(!upLoadShow));
  };

  const handleSettingsClick = (rowData: CreateParticipantWithCheck) => {
    console.log(rowData);
  };

  const handleFileClick = (rowData: CreateParticipantWithCheck) => {
    console.log(rowData);
  };

  const handleDeleteClick = (rowData: CreateParticipantWithCheck) => {
    console.log(rowData);
  };

  const handleResetClick = () => {
    setInputData([]);
    setMetaData({ hasNextPage: false, hasPreviousPage: false, itemCount: 0, page: 0, pageCount: 0, take: 0 });
    setIsParse(false);
  };

  const loadLazyData = async (event: DataTablePageEvent) => {
    setLoading(true);
    const page = event.first / event.rows + 1;
    const rows = event.rows;

    const totalParticipant = data.length;

    const start = (page - 1) * rows;
    const end = start + rows;
    const participants: CreateParticipantWithCheck[] = inputData.slice(start, end);

    const metaData: MetaData = {
      hasNextPage: end < totalParticipant,
      hasPreviousPage: start > 0,
      itemCount: participants.length,
      page,
      pageCount: Math.ceil(totalParticipant / rows),
      take: rows,
    };

    setData(participants);
    setMetaData(metaData);
    setLoading(false);
  };

  useEffect(() => {
    loadLazyData({ first: 0, rows: lazyParams.rows, page: 0 });
  }, [inputData]);

  // Function for get data from exel
  const showError = (message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  };

  useEffect(() => {
    const handleExcelfileUpload = async () => {
      if (!upLoadedFile) {
        return;
      }
      const file = upLoadedFile;
      const fileName = file?.name.toLowerCase();

      if (!fileName?.endsWith('.xls') && !fileName?.endsWith('.xlsx')) {
        showError('Invalid file type. Please upload an Excel file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const binaryStr = e.target?.result;
        try {
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          const headers: string[] = jsonData[0];
          const data = jsonData.slice(1).map((row: string[]) => {
            const rowData: Record<string, string> = {};
            headers.forEach((header: string, index: number) => {
              rowData[header] = row[index];
            });
            return rowData;
          });

          setTableData(data);
        } catch (error) {
          showError('Error parsing the Excel file.');
        }
      };

      if (file) {
        reader.readAsArrayBuffer(file);
      }

      console.log('tableData', tableData);

      const participantsWithCheck: CreateParticipantWithCheck[] = tableData
        .map((row: RowData) => {
          const listOfChildren: Children[] = [];
          const isValid = true;

          const participant: CreateParticipant = {
            familyName: String(row['Họ Và Tên Lót'])?.trim(),
            givenName: String(row['Tên'])?.trim(),
            sID: String(row['MSCB'])?.trim(),
            uID: String(row['MSCĐ'])?.trim(),
            dob: String(row['Ngày Sinh'])?.trim(),
            email: String(row['Email'])?.trim(),
            phone: String(row['Số Điện Thoại'])?.trim(),
            faculty: findFaculty(String(row['Khoa/Phòng Ban'])) || undefined,
            facultyId: findFaculty(String(row['Khoa/Phòng Ban']))?.id || undefined,
            facultyName: String(row['Khoa/Phòng Ban'])?.trim(),
            unionDept: findUnionDept(String(row['Công Đoàn'])) || undefined,
            gender: convertToGender(String(row['Giới Tính'])?.trim()),
            isUnionMember: String(row['Là Công Đoàn Viên'])?.trim() === '1',
            unionDeptId: findUnionDept(String(row['Công Đoàn']))?.id || undefined,
            unionJoinDate: String(row['Ngày Vào Công Đoàn'])?.trim(),
            workingStatus: convertToWorkingStatus(String(row['Tình Trạng Làm Việc'])?.trim()),
            numOfChildren: Number(String(row['Số Con Cái'])?.trim()),
            children: [],
          };

          for (let i = 1; i <= participant.numOfChildren; i++) {
            const child: Children = {
              familyName: String(row[`Họ Con ${i}`])?.trim(),
              givenName: String(row[`Tên Con ${i}`])?.trim(),
              dob: String(row[`Ngày Sinh Con ${i}`])?.trim(),
              gender: convertToGender(String(row[`Giới Tính Con ${i}`])?.trim()),
            };
            listOfChildren.push(child);
          }
          if (listOfChildren.length > 0) {
            participant.children = listOfChildren.slice(0, participant.numOfChildren);
          }

          return { participant, checked: isValid };
        })
        .filter((item: CreateParticipantWithCheck) => item !== null);

      setInputData(participantsWithCheck);
    };

    handleExcelfileUpload();
  }, [upLoadedFile]);

  // const handleDowloadTemplateExcelFile = (e: any) => {
  //   // Path to the existing Excel file within your public directory
  //   const filePath = '/template_excel/templateExcelFormForCreate.xlsx';

  //   // Fetch the file and force download
  //   fetch(filePath)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.setAttribute('download', 'Template.xlsx');
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     })
  //     .catch((error) => console.error('There was an error downloading the file:', error));
  // };

  const handleDowloadTemplateExcelFile = () => {
    const sliceSize = 1024;
    const byteCharacters = atob(templateExcelFormForCreate);
    const bytesLength = byteCharacters.length;
    const sliceCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(sliceCount);
    for (let sliceIndex = 0; sliceIndex < sliceCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);
      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    const blob = new Blob(byteArrays, { type: 'application/vnd.ms-excel' });
    FileSaver.saveAs(new Blob([blob], {}), 'templateExcelFormForCreate.xlsx');
  };

  const handleUpload = () => {
    handleToggleUpload();
  };

  const optionButtonTemplate = (rowData: CreateParticipantWithCheck) => {
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
  const headerTemplate = (options: { className: string }) => {
    const className = `${options.className} justify-content-space-between`;

    const items = [
      {
        label: 'Tải file dữ liệu mẫu',
        icon: 'pi pi-download',
        items: [
          {
            label: 'File Excel',
            icon: 'pi pi-file-excel',
            command: () => {
              handleDowloadTemplateExcelFile();
            },
          },
          {
            label: 'File CSV',
            icon: 'pi pi-file',
            command: () => {
              console.log('File CSV');
            },
          },
        ],
      },

      {
        label: 'Upload dữ liệu',
        icon: 'pi pi-upload',
        command: () => {
          handleUpload();
        },
        // items: [
        //   {
        //     label: 'File Excel',
        //     icon: 'pi pi-file-excel',
        //     command: () => {
        //       console.log('File Excel');
        //     },
        //   },
        //   {
        //     label: 'File CSV',
        //     icon: 'pi pi-file',
        //     command: () => {
        //       console.log('File CSV');
        //     },
        //   },
        // ],
      },
    ];

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="font-bold">Danh sách Công đoàn viên cần thêm</span>
        </div>
        <div className="flex flex-row-reverse flex-wrap">
          <Menubar model={items} />
        </div>
      </div>
    );
  };

  const footerOfNeedToCreate = (
    <div>
      <Button
        label="Thêm hàng loạt"
        icon="pi pi-check"
        onClick={() => {
          setIsCreate(true);
        }}
      />
    </div>
  );

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
  return (
    <div className="p-4" style={{ overflowY: 'auto' }}>
      <Toast ref={toast} />
      <Panel headerTemplate={headerTemplate} footer={footer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Button label="Thêm thủ công" icon="pi pi-user-plus" className="p-button-text" onClick={() => {}} />
          </div>
          <RowsPerPageDropdown
            options={[1, 2, 3, 4]}
            value={rowsPerPage}
            onChange={(value: number) => {
              setRowsPerPage(value);
              setLazyParams({ ...lazyParams, rows: value });
            }}
          />
        </div>

        {upLoadShow && <UploadFile />}
        <div>
          <DataTable
            value={data}
            lazy
            showGridlines
            stripedRows
            paginator
            paginatorPosition="bottom"
            rows={lazyParams.rows}
            totalRecords={metaData?.itemCount ?? 10}
            loading={loading}
            first={lazyParams.first}
            onPage={loadLazyData}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            tableStyle={{ minWidth: '50rem', maxHeight: '80vh', overflowY: 'auto' }}
            className="data-table-container"
          >
            <Column
              field="#"
              header="STT"
              body={indexBodyTemplate}
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
              alignHeader="center"
            />
            <Column
              field="participant.sID"
              header="MSCB"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
              alignHeader="center"
            />
            <Column
              field="participant.uID"
              header="MSCĐ"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
              alignHeader="center"
            />
            <Column
              field="participant.familyName"
              header="Họ và tên lót"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
              alignHeader="center"
            />
            <Column
              field="participant.givenName"
              header="Tên"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
              alignHeader="center"
            />
            <Column
              field="participant.faculty.name"
              header="Khoa/ Phòng ban"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
              alignHeader="center"
            />
            <Column
              field="participant.unionDept.name"
              header="Công đoàn"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
              alignHeader="center"
            />

            <Column
              header="Kiếm tra"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
              alignHeader="center"
              body={(rowData) => (rowData.checked ? 'Hợp lệ' : 'Không hợp lệ')}
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
      </Panel>

      {isParse && (
        <>
          <TabView>
            <TabPanel header="Thêm mới">
              <Panel header="Danh sách Công đoàn viên cần thêm mới" footer={footerOfNeedToCreate}>
                <div>
                  <DataTable value={inputData} responsiveLayout="scroll">
                    <Column field="participant.sID" header="MSCB" />
                    <Column field="participant.uID" header="MSCĐ" />
                    <Column field="participant.familyName" header="Họ và tên lót" />
                    <Column field="participant.givenName" header="Tên" />
                    <Column field="participant.faculty" header="Khoa/ Phòng ban/ Trung Tâm" />
                    <Column field="participant.unionDept" header="Công Đoàn" />
                    <Column
                      field="checked"
                      header="Kiểm tra"
                      body={(rowData) => (rowData.checked ? 'Hợp lệ' : 'Không hợp lệ')}
                    />
                    <Column
                      field="#"
                      header="Thao tác"
                      body={(rowData: CreateParticipantWithCheck) => (
                        <Button
                          icon="pi pi-file"
                          className="p-button-rounded p-button-warning file-btn"
                          style={{ margin: '0 0.25em' }}
                          onClick={() => handleFileClick(rowData)}
                        />
                      )}
                      style={{ textAlign: 'center', verticalAlign: 'middle' }}
                      alignHeader="center"
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

export default AddBarch;
