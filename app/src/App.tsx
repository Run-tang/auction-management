import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import AuctionApplies from '@/pages/AuctionApplies'
import AuctionApplyDetail from '@/pages/AuctionApplyDetail'
import OrderDetail from '@/pages/OrderDetail'
import AccountList from '@/pages/AccountList'

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
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
