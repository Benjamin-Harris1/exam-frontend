import "./index.css"
import Layout from "./Layout"
import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import { DeltagerManager } from "./pages/management/DeltagerManager"


function App(){
  return (
    <>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/management" element={<DeltagerManager />} />
      </Routes>
    </Layout>
    
    </>
  )
}

export default App