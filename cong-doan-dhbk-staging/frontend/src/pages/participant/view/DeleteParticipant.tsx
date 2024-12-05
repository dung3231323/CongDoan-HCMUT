import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { RootState } from '@/states/store';
import participantSlice from '@/states/slices/participant';
import { Participant } from '@/types/participant';
import ParticipantApi from '@/services/participant';
import { Toast } from 'primereact/toast';

interface DeleteParticipantProps {
  participant: Participant | null;
}

const DeleteParticipant: React.FC<DeleteParticipantProps> = ({ participant }) => {
  const dispatch = useDispatch();
  const visible = useSelector((state: RootState) => state.participant.deleteModalShow);
  const listOfParticipants = useSelector((state: RootState) => state.participant.data);
  const metaData = useSelector((state: RootState) => state.participant.metaData);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (participant === null) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Không tìm thấy cán bộ công đoàn',
        life: 3000,
      });
    }
  }, [participant, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic để xóa participant
    if (participant !== null && participant.id !== null && participant.id !== undefined && participant.id !== '') {
      const response = await ParticipantApi.delete(participant.id);

      // Handle the response here
      const { status, message } = response;

      if (status === 204) {
        dispatch(
          participantSlice.actions.setParticipantData(listOfParticipants.filter((p) => p.id !== participant.id)),
        );

        dispatch(participantSlice.actions.setLazyParams({ first: 0, rows: metaData.take, page: 1 }));

        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Xóa cán bộ công đoàn thành công',
          life: 3000,
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: message || 'Không thể xóa cán bộ công đoàn',
          life: 3000,
        });
      }
      setTimeout(() => {
        dispatch(participantSlice.actions.setDeleteModalShow(false));
      }, 2000);
    } else {
      // Handle the case where response is null or undefined
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Không thể xóa cán bộ công đoàn',
        life: 3000,
      });

      setTimeout(() => {
        dispatch(participantSlice.actions.setDeleteModalShow(false));
      }, 2000);
    }
  };

  const handleClose = () => {
    dispatch(participantSlice.actions.setDeleteModalShow(false));
  };

  if (participant === null) {
    return null;
  }

  const footer = (
    <div>
      <Button label="Đóng" icon="pi pi-times" onClick={handleClose} className="p-button-text" />
      <Button label="Đồng ý" icon="pi pi-check" onClick={handleSubmit} className="p-button-danger" />
    </div>
  );

  return (
    <Dialog
      header="Xóa: Công đoàn viên"
      visible={visible}
      style={{ width: '50vw' }}
      footer={footer}
      onHide={handleClose}
    >
      <Toast ref={toast} />
      <Card>
        <form onSubmit={handleSubmit}>
          <p>Bạn có muốn xóa {participant.familyName + ' ' + participant.givenName} ra khỏi hệ thống?</p>
        </form>
      </Card>
    </Dialog>
  );
};

export default DeleteParticipant;
