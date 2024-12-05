import AuthService, { AUTH_KEY } from '@/services/auth';
import { removeItem } from '@/helpers/localStorage';

import { useGoogleLogin } from '@react-oauth/google';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
// import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  document.title = 'Đăng nhập';

  const navigate = useNavigate();
  // const token = getItem(AUTH_KEY);
  // const isFirstRender = useRef(true);

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     if (!token) {
  //       navigate('/');
  //     }
  //   }
  // }, [navigate, token]);

  const handleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async ({ code }) => {
      AuthService.loginWithCode(code)
        .then(({ status }) => {
          // success
          if (200 <= status && status < 300) {
            navigate('/');
          }
        })
        .catch(() => {
          toast.error('Bạn không có quyền truy cập vào hệ thống');
          removeItem(AUTH_KEY);
        });
    },
  });

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card title="Công đoàn bộ phận TRƯỜNG ĐH BÁCH KHOA - ĐHQG-HCM" subTitle="Hệ thống thông tin">
        <Button label="Đăng nhập bằng Google" severity="danger" icon="pi pi-google" onClick={handleLogin} />
      </Card>
    </div>
  );
}
