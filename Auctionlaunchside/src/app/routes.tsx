import { createBrowserRouter } from 'react-router';
import { MobileLayout } from './components/MobileLayout';
import { ApplicationList } from './components/ApplicationList';
import { NewApplication } from './components/NewApplication';
import { ApplicationDetail } from './components/ApplicationDetail';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-8">
      <div className="text-[48px] mb-4">🔍</div>
      <div className="text-[16px] font-medium text-[#1F2937] mb-2">页面不存在</div>
      <div className="text-[14px] text-[#6B7280] mb-6">请检查链接是否正确</div>
      <a href="/" className="px-6 py-2.5 bg-[#FF6B00] text-white rounded-full text-[14px] no-underline">返回首页</a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MobileLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: ApplicationList },
      { path: 'form', Component: NewApplication },
      { path: 'detail/:id', Component: ApplicationDetail },
      { path: 'profile', Component: Profile },
      { path: '*', Component: NotFound },
    ],
  },
]);
