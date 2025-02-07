import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import {registerSW} from "virtual:pwa-register";
import './index.css';

import MainPage from './pages/IllnessesPage/IllnessesPage';
import IllnessPage from './pages/IllnessPage/IllnessPage';
import { HomePage } from './pages/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import store from './store';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <Layout>
          <HomePage />
        </Layout>
      ),
    },
    {
      path: '/illnesses',
      element: (
        <Layout>
          <MainPage />
        </Layout>
      ),
    },
    {
      path: '/illnesses/:illnessId',
      element: (
        <Layout>
          <IllnessPage />
        </Layout>
      ),
    },
  ],
);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      registerSW()
      
  });
}