
import './App.css'
import { Routes,Route } from 'react-router-dom'

function App() {


  return (
    <Routes>
      <Route path = "/" element = {<AuthPage></AuthPage>}></Route>
      <Route path = "/dashboard" element={<DashboardPage></DashboardPage>}></Route>
    </Routes>
  )
}

export default App
