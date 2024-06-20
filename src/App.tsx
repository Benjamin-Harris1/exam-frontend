import "./index.css"
import Layout from "./Layout"
import { Route, Routes } from "react-router-dom"
import Home from "./Home"


function App(){
  return (
    <>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
    
    </>
  )
}

export default App