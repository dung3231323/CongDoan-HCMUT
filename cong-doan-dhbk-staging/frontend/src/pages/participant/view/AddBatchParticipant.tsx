// import { Button } from 'primereact/button';
// import { Dialog } from 'primereact/dialog';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Papa from 'papaparse';
// import FacultyAPI from '@/services/faculty';
// import facultySlice from '@/states/slices/faculty';
// import UnionDepartmentAPI from '@/services/unionDepartment';
// import unionDepartmentSlice from '@/states/slices/unionDepartment';
// import participantSlice from '@/states/slices/participant';
// import ParticipantApi from '@/services/participant';
// import { CreateParticipant } from '@/components/types/createParticipant';
// import { Card } from 'primereact/card';
// import { Toast } from 'primereact/toast';
// import React from 'react';

// const AddBatchParticipantModal: React.FC = () => {
//   const dispatch = useDispatch();
//   const [inputData, setInputData] = useState('');
//   const [parsedData, setParsedData] = useState<(CreateParticipant | null)[]>([]);
//   const [isParse, setIsParse] = useState(false);
//   const [listPreview, setListPreview] = useState<any[]>();
//   const toast = useRef<Toast>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setInputData(e.target.value);
//     setIsParse(false);
//   };

//   const listOfFaculty = useSelector((state: any) => state.faculty.data);
//   const listOfUnionDept = useSelector((state: any) => state.unionDepartment.data);

//   const findFaculty = (facultyCode: string) => {
//     const faculty = listOfFaculty.find(
//       (item: any) => item && item.code && item.code.trim().toLowerCase() === facultyCode.trim().toLowerCase(),
//     );
//     return faculty
//       ? {
//           id: faculty.id,
//           name: faculty.name,
//         }
//       : null;
//   };

//   const findUnionDept = (unionDeptCode: string) => {
//     const unionDept = listOfUnionDept.find(
//       (item: any) => item && item.code && item.code.trim().toLowerCase() === unionDeptCode.trim().toLowerCase(),
//     );
//     return unionDept
//       ? {
//           id: unionDept.id,
//           name: unionDept.name,
//         }
//       : null;
//   };

//   useEffect(() => {
//     const fetchFaculty = async () => {
//       const { data } = await FacultyAPI.getAll();
//       dispatch(
//         facultySlice.actions.setData({
//           data: data || [],
//           metaData: {
//             hasNextPage: false,
//             hasPreviousPage: false,
//             itemCount: 0,
//             page: 1,
//             pageCount: 1,
//             take: 10,
//           },
//         }),
//       );
//     };
//     fetchFaculty();
//   }, [dispatch]);

//   useEffect(() => {
//     const fetchUnionDepartment = async () => {
//       const { data } = await UnionDepartmentAPI.getAll();
//       dispatch(
//         unionDepartmentSlice.actions.setData({
//           data: data || [],
//         }),
//       );
//     };
//     fetchUnionDepartment();
//   }, [dispatch]);

//   const parseInputData = () => {
//     const parsed = Papa.parse(inputData, { header: true });
//     const newListPreview: any[] = [];
//     const renamedHeadersData: (CreateParticipant | null)[] = parsed.data
//       .map((item: any) => {
//         const renamedItem: any = {};
//         const previewItem: any = {};
//         const listOfChildren: any[] = [];
//         let childrenInfo: any = {
//           parent: '',
//           familyName: '',
//           givenName: '',
//           dob: '',
//           gender: 0,
//         };
//         let validSId = true;
//         Object.entries(item).forEach(([key, value], index) => {
//           const stringValue = String(value).trim();
//           if (key !== '' && !key.startsWith('_')) {
//             switch (index) {
//               case 0: // TT
//                 break;
//               case 1: // HO_TEN_LOT
//                 renamedItem.familyName = stringValue;
//                 previewItem.familyName = stringValue;
//                 break;
//               case 2: // TEN
//                 renamedItem.givenName = stringValue;
//                 previewItem.givenName = stringValue;
//                 break;
//               case 3: // MSCB
//                 const sId = stringValue;
//                 previewItem.sId = sId;
//                 if (/^\d{6}$/.test(sId)) {
//                   renamedItem.sId = sId;
//                   previewItem.checked = 1;
//                 } else {
//                   previewItem.checked = 0;
//                   validSId = false;
//                 }
//                 break;
//               case 4: // MSCD
//                 renamedItem.uId = stringValue;
//                 previewItem.uId = stringValue;
//                 break;
//               case 5: // NGAY_SINH
//                 renamedItem.dob = stringValue;
//                 previewItem.dob = stringValue;
//                 break;
//               case 6: // GIOI_TINH
//                 renamedItem.gender = stringValue.toLowerCase() === 'nam' ? 1 : 0;
//                 previewItem.gender = stringValue.toLowerCase() === 'nam' ? 1 : 0;
//                 break;
//               case 7: // EMAIL
//                 renamedItem.email = stringValue;
//                 previewItem.email = stringValue;
//                 break;
//               case 8: // SDT
//                 renamedItem.phone = stringValue;
//                 previewItem.phone = stringValue;
//                 break;
//               case 9: // DON_VI
//                 renamedItem.faculty = findFaculty(stringValue)?.id;
//                 previewItem.faculty = findFaculty(stringValue)?.name;
//                 break;
//               case 10: // DON_VI_CONG_DOAN
//                 renamedItem.unionDept = findUnionDept(stringValue)?.id;
//                 previewItem.unionDept = findUnionDept(stringValue)?.name;
//                 break;
//               case 11: // NGAY_VAO_CONG_DOAN
//                 renamedItem.unionJoinDate = stringValue;
//                 previewItem.unionJoinDate = stringValue;
//                 break;
//               case 12: // TINH_TRANG
//                 renamedItem.workingStatus = Number(stringValue);
//                 previewItem.workingStatus = Number(stringValue);
//                 break;
//               case 13: // LA_CDV
//                 renamedItem.isUnionMember = stringValue === '1';
//                 previewItem.isUnionMember = stringValue === '1';
//                 break;
//               case 14: // CON_CAI
//                 renamedItem.numOfChildren = stringValue === '' ? 0 : Number(stringValue);
//                 previewItem.numOfChildren = stringValue === '' ? 0 : Number(stringValue);
//                 break;
//               default:
//                 switch (index % 4) {
//                   case 3:
//                     childrenInfo.familyName = stringValue === '' ? null : stringValue;
//                     childrenInfo.parent = renamedItem.sId;
//                     break;
//                   case 0:
//                     childrenInfo.givenName = stringValue === '' ? null : stringValue;
//                     break;
//                   case 1:
//                     childrenInfo.dob = stringValue === '' ? null : stringValue;
//                     break;
//                   case 2:
//                     childrenInfo.gender = stringValue === '' ? null : Boolean(stringValue);
//                     listOfChildren.push(childrenInfo);
//                     childrenInfo = {
//                       parent: '',
//                       familyName: '',
//                       givenName: '',
//                       dob: '',
//                       gender: 0,
//                     };
//                     break;
//                 }
//             }
//           }
//         });
//         if (validSId) {
//           newListPreview.push(previewItem);
//           if (listOfChildren.length > 0) {
//             renamedItem.children = listOfChildren.slice(0, renamedItem.numOfChildren);
//           }
//           return renamedItem as CreateParticipant;
//         } else {
//           newListPreview.push(previewItem);
//           return null;
//         }
//       })
//       .filter((item: any) => item !== null);
//     setIsParse(true);
//     setParsedData(renamedHeadersData);
//     setListPreview(newListPreview);
//   };

//   const handleSubmit = async () => {
//     if (parsedData === null) {
//       toast.current?.show({
//         severity: 'warn',
//         summary: 'Không có dữ liệu để thêm',
//       });

//       return;
//     }
//     const validData: CreateParticipant[] = parsedData.filter(
//       (participant): participant is CreateParticipant => participant !== null,
//     );

//     const { status, data } = await ParticipantApi.createBulk(validData);

//     if (status === 201 && data) {
//       // Fetch new data after adding successfully
//       {
//         const { status, data, metaData, message } = await ParticipantApi.getAll(1, 10);
//         if (status !== 200) return;
//         dispatch(
//           participantSlice.actions.setParticipantData(data || []),
//           participantSlice.actions.setMetaData(
//             metaData || {
//               hasNextPage: false,
//               hasPreviousPage: false,
//               itemCount: 0,
//               page: 1,
//               pageCount: 1,
//               take: 10,
//             },
//           ),
//         );
//       }
//       // End: Fetch new data after adding successfully
//       toast.current?.show({
//         severity: 'success',
//         summary: 'Thêm dữ liệu thành công',
//       });
//     } else {
//       toast.current?.show({
//         severity: 'warn',
//         summary: 'Thêm dữ liệu thất bại',
//       });
//     }
//     dispatch(participantSlice.actions.setAddBatchModalShow(false));

//     setParsedData([]);
//     setIsParse(false);
//   };

//   const footer = (
//     // {!isParse && <Button label="Xem trước" icon="pi pi-eye" onClick={parseInputData} />}
//     //     {isParse && <Button label="Thêm hàng loạt" icon="pi pi-check" onClick={handleSubmit} />}
//     //     <Button
//     //       label="Đóng"
//     //       icon="pi pi-times"
//     //       onClick={() => dispatch(participantSlice.actions.setAddBatchModalShow(false))}
//     //     />

//     <div>
//       <Button
//         label="Đóng"
//         icon="pi pi-times"
//         className="p-button-text"
//         onClick={() => dispatch(participantSlice.actions.setAddBatchModalShow(false))}
//       />
//       {!isParse && <Button label="Xem trước" icon="pi pi-eye" onClick={parseInputData} />}
//       {isParse && <Button label="Thêm hàng loạt" icon="pi pi-check" onClick={handleSubmit} />}
//     </div>
//   );

//   return (
//     <Dialog
//       header="Thêm danh sách Công đoàn viên"
//       visible={true}
//       modal
//       footer={footer}
//       onHide={() => dispatch(participantSlice.actions.setAddBatchModalShow(false))}
//       style={{ fontSize: '14px' }}
//     >
//       <Toast ref={toast} />
//       <Card>
//         <div>
//           <label
//             htmlFor="textarea"
//             style={{
//               display: 'block',
//               marginBottom: '16px',
//               fontWeight: 'bold',
//               fontSize: '14px',
//             }}
//           >
//             Nhập danh sách Công đoàn viên
//           </label>
//           <InputTextarea
//             id="inputData"
//             autoFocus
//             value={inputData}
//             onChange={handleInputChange}
//             rows={10}
//             cols={80}
//             placeholder="Danh sách Công đoàn viên"
//             style={{ width: '100%' }}
//           />
//           {isParse && (
//             <div>
//               <h3>Danh sách Công đoàn viên</h3>
//               <DataTable value={listPreview} responsiveLayout="scroll">
//                 <Column field="sId" header="MSCB" />
//                 <Column field="uId" header="MSCĐ" />
//                 <Column field="familyName" header="Họ và tên lót" />
//                 <Column field="givenName" header="Tên" />
//                 <Column field="faculty" header="Khoa/ Phòng ban/ Trung Tâm" />
//                 <Column field="unionDept" header="Công Đoàn" />
//                 <Column
//                   field="checked"
//                   header="Kiểm tra"
//                   body={(rowData) => (rowData.checked ? 'Hợp lệ' : 'Không hợp lệ')}
//                 />
//               </DataTable>
//             </div>
//           )}
//         </div>
//       </Card>
//     </Dialog>
//   );
// };

// export default AddBatchParticipantModal;
