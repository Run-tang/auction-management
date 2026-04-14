import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import AuctionApplies from '@/pages/AuctionApplies'
import AuctionApplyDetail from '@/pages/AuctionApplyDetail'
import Dealers from '@/pages/Dealers'
import DealerAccounts from '@/pages/DealerAccounts'
import SysUsers from '@/pages/SysUsers'
import SysRoles from '@/pages/SysRoles'
import SysPermissions from '@/pages/SysPermissions'
import SysLogs from '@/pages/SysLogs'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/applies" replace />} />
          <Route path="/applies" element={<AuctionApplies />} />
          <Route path="/applies/:id" element={<AuctionApplyDetail />} />
          <Route path="/dealers" element={<Dealers />} />
          <Route path="/dealer-accounts" element={<DealerAccounts />} />
          <Route path="/sys/users" element={<SysUsers />} />
          <Route path="/sys/roles" element={<SysRoles />} />
          <Route path="/sys/permissions" element={<SysPermissions />} />
          <Route path="/sys/logs" element={<SysLogs />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
