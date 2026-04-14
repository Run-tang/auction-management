import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import AuctionApplies from '@/pages/AuctionApplies'
import AuctionApplyDetail from '@/pages/AuctionApplyDetail'
import OrderDetail from '@/pages/OrderDetail'
import AccountList from '@/pages/AccountList'
import SysRoles from '@/pages/SysRoles'
import SysPermissions from '@/pages/SysPermissions'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/applies" replace />} />
          <Route path="/applies" element={<AuctionApplies />} />
          <Route path="/applies/:id" element={<AuctionApplyDetail />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/accounts" element={<AccountList />} />
          <Route path="/sys/roles" element={<SysRoles />} />
          <Route path="/sys/permissions" element={<SysPermissions />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
