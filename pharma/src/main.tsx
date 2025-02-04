import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import './index.css'

import MainPage from './pages/IllnessesPage/IllnessesPage';
import IllnessPage from './pages/IllnessPage/IllnessPage';
import {HomePage} from './pages/HomePage/HomePage';
import Layout from './components/Layout/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element:( 
      <Layout>
        <HomePage />
      </Layout>)
  },
  {
    path: '/illnesses',
    element:( 
    <Layout>
      <MainPage />
    </Layout>)
  },
  {
    path: '/illnesses/:illnessId',
    element:( 
      <Layout>
        <IllnessPage />
      </Layout>)
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)