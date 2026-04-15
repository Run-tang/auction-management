import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import AuctionApplies from '@/pages/AuctionApplies'
import AuctionApplyDetail from '@/pages/AuctionApplyDetail'
import OrderDetail from '@/pages/OrderDetail'
import AccountList from '@/pages/AccountList'
import Login from '@/pages/Login'
import ChangePassword from '@/pages/ChangePassword'

// 登录验证组件
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* 登录页 */}
        <Route path="/login" element={<Login />} />
        
        {/* 修改密码页（独立页面） */}
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* 需要登录的页面 */}
        <Route path="/" element={
          <RequireAuth>
            <AuctionApplies />
          </RequireAuth>
        } />
        <Route path="/applies" element={
          <RequireAuth>
            <AuctionApplies />
          </RequireAuth>
        } />
        <Route path="/applies/:id" element={
          <RequireAuth>
            <AuctionApplyDetail />
          </RequireAuth>
        } />
        <Route path="/orders/:id" element={
          <RequireAuth>
            <OrderDetail />
          </RequireAuth>
        } />
        <Route path="/accounts" element={
          <RequireAuth>
            <AccountList />
          </RequireAuth>
        } />
        
        {/* 其他路径重定向 */}
        <Route path="*" element={<Navigate to="/applies" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
