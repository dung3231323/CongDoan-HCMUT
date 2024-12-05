import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userSlice from '@/states/slices/user';
import { toast } from 'react-toastify';
import UserAPI, { ApiResponse, User } from '@/services/user';
import { RootState } from '@/states/store';

interface DeleteAccountModalProps {
  user: User | undefined; // Giả sử user có thể null nếu không có dữ liệu user
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ user }) => {
  const dispatch = useDispatch();
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const lazyParams = useTypedSelector((state) => state.user.lazyParams);

  const hanleSubmit = async () => {
    const response = await UserAPI.delete(user?.id ?? 'error');
    if (response?.status === 200 && response?.statusText === 'OK') {
      try {
        dispatch(userSlice.actions.setLoading(true));
        const fetchResponse: ApiResponse | undefined = await UserAPI.get(lazyParams.page + 1, lazyParams.rows);
        if (fetchResponse) {
          dispatch(
            userSlice.actions.setData({
              data: fetchResponse.data,
              metadata: fetchResponse.metadata,
            }),
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Đã xóa tài khoản nhưng lấy danh sách thất bại, hãy reload lại trang web');
      } finally {
        dispatch(userSlice.actions.setLoading(false));
        toast.success('Đã xóa tài khoản');
      }
    } else {
      toast.error('Truyền dữ liệu thất bại');
    }
    handleClose();
  };

  const handleClose = () => {
    dispatch(userSlice.actions.setDeleteModalVisibility({ visibility: false }));
  };
  return (
    <>
      <Dialog header="Xóa tài khoản" visible={true} style={{ width: '50vw' }} modal onHide={() => handleClose()}>
        <div>
          Bạn có muốn xóa Tài khoản <strong>{user?.email}</strong> ra khỏi hệ thống?
        </div>
        <div className="p-d-flex p-jc-end">
          <Button
            label="Đóng"
            className="p-button-secondary"
            style={{ marginRight: '10px', marginTop: '10px' }}
            onClick={() => handleClose()}
          />
          <Button label="Đồng ý" severity="danger" onClick={() => hanleSubmit()} />
        </div>
      </Dialog>
    </>
  );
};

export default DeleteAccountModal;
