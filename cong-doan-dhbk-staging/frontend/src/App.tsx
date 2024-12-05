import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';

import { Provider } from 'react-redux';
import store from './states/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { config } from './config';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <PrimeReactProvider>
        <GoogleOAuthProvider clientId={config.google.clientId}>
          <Provider store={store}>
            <RouterProvider router={createBrowserRouter(routes)} />
          </Provider>
        </GoogleOAuthProvider>
      </PrimeReactProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="colored"
        stacked
      />
    </>
  );
}
