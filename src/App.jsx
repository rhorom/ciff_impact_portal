import { useState } from 'react'
import { 
  HashRouter,
  Outlet, 
  Route, Routes
} from 'react-router-dom'
import { Modal, Nav, Navbar, NavDropdown } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'primeicons/primeicons.css'
import './index.css'
import logo from './../public/logo-lg.png'

import { MainApp } from './MainApp.jsx'
import { About, Procedure, Glossary } from './Pages.jsx'
import { Evaluation } from './Evaluation.jsx'

function modalContent(val){
  const path = {
    'About': <About />,
    'Standard Operating Procedure': <Procedure />,
    'Glossary': <Glossary />
  }

  return (
    <div>
      {path[val]}
    </div>
  )
}

function Layout() {
  const [modal, setModal] = useState(false)
  
  return (
    <div>
      <div className='shadow mb-4'>
        <div className='container-xl px-2'>
          <Navbar expand='md'>
            <Navbar.Brand href='https://ciff.org'>
              <div className='hstack gap-3' style={{height:'40px'}}>
                <img alt='ciff-logo' src={logo} height='40px'/>
                <div className='vr'></div>
                <div>Impact Portal</div>
              </div>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav>
                <Nav.Link href='./'><i className='pi pi-home mx-1'></i>Home</Nav.Link>
                <Nav.Link href='#' onClick={() => setModal('About')}><i className='pi pi-info-circle mx-1'></i>About</Nav.Link>
                <NavDropdown title={<span><i className='pi pi-question-circle mx-1'></i>Guide</span>}>
                  <NavDropdown.Item href='#' onClick={() => setModal('Standard Operating Procedure')}><i className='pi pi-list-check mx-1'></i>Standard Operating Procedure</NavDropdown.Item>
                  <NavDropdown.Item href='#' onClick={() => setModal('Glossary')}><i className='pi pi-book mx-1'></i>Glossary</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>

      <div className='container-xl px-2' style={{paddingBottom:'50px'}}>
        <Outlet/>
      </div>

      <Modal show={modal} size='lg' fullscreen='down' onHide={() => setModal(false)}>
          <Modal.Header closeButton closeVariant='white'>
            <Modal.Title>{modal}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalContent(modal)}
          </Modal.Body>
        </Modal>

    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Layout />} exact>
          <Route index element={<MainApp />}/>
          <Route path='about' element={<About/>}/>
          <Route path='sop' element={<Procedure/>}/>
          <Route path='glossary' element={<Glossary/>}/>
          <Route path='eval/:evalID' element={<Evaluation/>}/>
        </Route>
      </Routes>
    </HashRouter>
  )
}