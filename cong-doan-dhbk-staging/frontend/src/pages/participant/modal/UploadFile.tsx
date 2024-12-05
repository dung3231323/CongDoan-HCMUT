import React, { useRef, useState } from 'react';
import {
  FileUpload,
  FileUploadHandlerEvent,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
  ItemTemplateOptions,
} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { RootState } from '@/states/store';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import participantSlice from '@/states/slices/participant';
import { Toast } from 'primereact/toast';

const UploadFile: React.FC = () => {
  const dispatch = useDispatch();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const visible = useTypedSelector((state) => state.participant.uploadModalShow);
  const toast = useRef<Toast>(null);

  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);
  const [fileType, setFileType] = useState<string>('csv');

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = totalSize;
    const files = e.files;

    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size || 0;
    }

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e: FileUploadHandlerEvent) => {
    const file = e.files[0]; // Lấy file đầu tiên vì chỉ cho phép upload một file
    setTotalSize(file.size || 0);
    dispatch(participantSlice.actions.setUploadedFile(file));
    dispatch(participantSlice.actions.setUploadedTypeFile(fileType));
    toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    onHide();
  };

  const onTemplateRemove = (file: File, callback: (event: React.SyntheticEvent) => void) => {
    setTotalSize(totalSize - file.size);
    const syntheticEvent = new Event('remove') as unknown as React.SyntheticEvent;
    callback(syntheticEvent);
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <Dropdown
            value={fileType}
            options={fileTypes}
            onChange={(e) => setFileType(e.value)}
            placeholder="Select File Type"
          />
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File;
    const isExcelFile = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const iconClass = isExcelFile ? 'pi-file-excel' : 'pi-file';

    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '40%' }}>
          <i
            className={`pi ${iconClass} p-mr-2`}
            style={{ fontSize: '2em', color: isExcelFile ? 'green' : 'blue' }}
          ></i>
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: '5em',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-b)',
            color: 'var(--surface-d)',
          }}
        ></i>
        <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
          Drag and Drop File Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-file',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };
  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
  };
  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
  };

  const fileTypes = [
    { label: 'CSV', value: 'csv' },
    { label: 'Excel', value: 'excel' },
  ];

  const acceptType = fileType === 'csv' ? '.csv' : '.xls,.xlsx';

  const onHide = () => {
    dispatch(participantSlice.actions.setUploadModalShow(false));
  };

  const footer = (
    <div>
      <Button label="Đóng" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label="Tải lên" icon="pi pi-fw pi-cloud-upload" onClick={() => fileUploadRef.current?.upload()} />
    </div>
  );

  return (
    <Dialog header="Upload File" visible={visible} style={{ width: '50vw' }} footer={footer} onHide={onHide}>
      <Toast ref={toast} />
      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      <FileUpload
        ref={fileUploadRef}
        name="demo[]"
        customUpload
        uploadHandler={onTemplateUpload}
        multiple={false}
        accept={acceptType}
        maxFileSize={1000000}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
      />
    </Dialog>
  );
};

export default UploadFile;
