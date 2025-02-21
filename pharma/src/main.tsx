
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';

import MainPage from './pages/IllnessesPage/IllnessesPage';
import IllnessPage from './pages/IllnessPage/IllnessPage';
import AuthPage from './pages/AuthPage/AuthPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { HomePage } from './pages/HomePage/HomePage';
import Layout from './components/Layout/Layout';
import store from './store';
import API from "./api/API";
import DrugPage from './pages/DrugPage/DrugPage';
import DrugsPage from './pages/DrugsPage/DrugsPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import IllnessModerPage from './pages/IllnessModerPage/IllnessModerPage';
import IllnessEditPage from './pages/IllnessEditPage/IllnessEditPage';
import IllnessAddPage from './pages/IllnessAddPage/IllnessAddPage';

// Функция для получения и установки CSRF-токена
async function initializeCsrfToken() {
  try {
    const csrfToken = await API.getCsrfToken();
    if (csrfToken) {
      document.cookie = `csrftoken=${csrfToken}; path=/; SameSite=Strict`;
    }
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
  }
}

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
    {
      path: '/auth',
      element: (
        <Layout>
          <AuthPage />
        </Layout>
      ),
    },
    {
      path: '/profile',
      element: (
        <Layout>
          <ProfilePage />
        </Layout>
      ),
    },
    {
      path: '/drugs/:drugId',
      element: (
        <Layout>
          <DrugPage />
        </Layout>
      ),
    },
    {
      path: '/drugs',
      element: (
        <Layout>
          <DrugsPage />
        </Layout>
      ),
    },
    {
      path: '/error/:errorCode',
      element: (
        <Layout>
          <ErrorPage />
        </Layout>
      ),
    },
    {
      path: '/moderator-illnesses',
      element: (
        <Layout>
          <IllnessModerPage />
        </Layout>
      ),
    },
    {
      path: '/edit-illnesses/:illnessId',
      element: (
        <Layout>
          <IllnessEditPage />
        </Layout>
      ),
    },
    {
      path: '/add-illnesses',
      element: (
        <Layout>
          <IllnessAddPage />
        </Layout>
      ),
    },
  ],
);

async function main() {
  // Получение CSRF-токена перед инициализацией React-приложения
  await initializeCsrfToken();

  createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );

  // Регистрация Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('/Pharma/sw.js')
        .then(() => console.log('service worker registered'))
        .catch((err) => console.log('service worker not registered', err));
    });
  }
}

// Запуск приложения
main();