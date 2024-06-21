import "./index.css"
import Layout from "./Layout"
import { Route, Routes } from "react-router-dom"
import AdminPage from "./pages/management/AdminPage"
import { Toaster } from "./components/ui/toaster"


function App(){
  return (
    <>
    <Layout>
      <Routes>
        <Route path="/" element={<AdminPage />} />
      </Routes>
    </Layout>
    <Toaster />
    
    </>
  )
}

export default App