import { useState, useMemo, useEffect, useCallback } from 'react'
import { Routes, Route, useSearchParams } from 'react-router-dom'
import * as JSURL from 'jsurl'
import parser from 'html-react-parser'
import { 
  Nav, Navbar, NavDropdown, Accordion, 
  Button, Modal, Form, FloatingLabel, Badge,
  Stack
} from 'react-bootstrap'

import 'primeicons/primeicons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'leaflet/dist/leaflet.css'
import './index.css'

import { Map } from './Map'
import { About, Procedure, Glossary, Setting } from './pages'
import { columns, badgeContent, shortContent, mediumContent, longContent } from './config'
import table from './data/impact_table.json'
import { onlyUnique, filterData } from './utils'

export default function App() {
  return (
    <div>
      <Routes>
        <Route index element={<MainApp/>}/>
      </Routes>
    </div>
  )
}

function AppMenu({ setting, setSetting }) {
  const [param, setParam] = useState('')
  function modalContent(val){
    const path = {
      'About': <About />,
      'Standard Operating Procedure': <Procedure />,
      'Glossary': <Glossary />,
      'Setting': <Setting param={setting} setParam={setSetting}/>
    }

    return (
      <div>
        {path[val]}
      </div>
    )
  }

  return (
    <>
    <Navbar expand='sm'>
      <Navbar.Brand href='./'>
        <div className='hstack gap-3' style={{height:'40px'}}>
          {/*
          <img alt='ciff-logo' src='./assets/logo.svg' height='40px'/>
          <div className='vr'></div>
          */}
          <div>Impact Portal</div>
        </div>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav'/>
      <Navbar.Collapse>
        <Nav className='me-auto'>
          <Nav.Link href='#' onClick={() => setParam('About')}>About</Nav.Link>
          <NavDropdown title='Guide'>
            <NavDropdown.Item href='#' onClick={() => setParam('Standard Operating Procedure')}>Standard Operating Procedure</NavDropdown.Item>
            <NavDropdown.Item href='#' onClick={() => setParam('Glossary')}>Glossary</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href='#' onClick={() => setParam('Setting')}>Setting</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

    <Modal show={param} size='lg' fullscreen='down' onHide={() => setParam(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{param}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalContent(param)}
      </Modal.Body>
    </Modal>
    </>
  )
}

function FilterPanel({ data, cols, param, setParam }) {
  function handleChange(e){
    const target = e.target
    let par = {...param}
    par[target.id] = target.value
    par['id'] = ''
    setParam(par)
  }
  
  return (
    <div style={{pointerEvents:'auto'}}>
      <Accordion>
        <Accordion.Item eventKey='0'>
          <Accordion.Header><b>Filter</b></Accordion.Header>
          <Accordion.Body>
            <div className='row' style={{maxHeight:'40vh', overflowY:'auto'}}>
            {
              Object.keys(cols).map((c, i) => {
                const col = columns[c]
                let options = []
                data.forEach((item) => {options.push(item[col].split(', '))})
                options = options.flat().filter(onlyUnique).sort()

                return (
                  <div className='dropdowns' key={'dropdown'+i}>
                  <FloatingLabel controlId={c} label={col}>
                    <Form.Select className='m-1' size='sm' 
                      as={c}
                      id={c}
                      value={param[c]}
                      onChange={handleChange}
                    >
                      <option value=''></option>
                      {options.map((option, j) => {
                        return (
                          <option key={c+j} value={option}>{option}</option>
                        )
                      })}
                    </Form.Select>  
                  </FloatingLabel>
                  </div>
                )
              })
            }
            </div>
            <div className='mt-1 d-flex justify-content-end'>
              <Button size='sm' variant='danger' href='/'>Reset</Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

function InfoPanel({ data, param, setParam }) {
  const n = data.length
  return (
    <div style={{pointerEvents:'auto'}}>
      <Accordion>
        <Accordion.Item>
          <Accordion.Header>
            <Stack direction='horizontal' gap={1}>
              <Badge pill bg='light' text='dark'>{n}</Badge>
              <b>Investment{n > 1 ? 's' : ''} in {param.country}</b>
            </Stack>
          </Accordion.Header>
          <Accordion.Body>
            <div id='list-info'>
              {ListInfo({data:data, param:param, setParam:setParam})}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

function ListInfo({ data, param, setParam }) {
  function selectID(val){
    let par = {...param}
    par['id'] = val['EvaluationID']
    par['multi'] = false
    setParam(par, {replace:true})
  }

  function redirect(val){
    if (val['Link']){
      window.open(val['Link'], '_blank')
    }
  }

  function showMulti(val){
    let par = {...param}
    par['id'] = val['EvaluationID']
    par['multi'] = true
    setParam(par, {replace:true})
  }

  function DetailInfo({row, param}){
    let regions = ''
    if (row['Region']) {
      regions = JSON.parse(row['Region'].replace(/'/g, '"'))[param.country].join(', ')
    }  
    
    return (
      <div className='row' style={{fontSize:'small'}}>
        <i>{row['Proposed Public Title']}</i>
        <div className='mt-1'>
          {badgeContent.map((item, i) => {
            return (
              <Badge key={'badge'+i} bg='info'>{row[item]}</Badge>
            )
          })}
          {(row['Coord'] !== '') ? 
            <Badge bg='info'>Geo-coordinate</Badge>
            : <></>}
          {(row['Multi'] === 'Yes') ? 
            <Badge onClick={() => {showMulti(row)}} style={{cursor:'pointer'}}>Multi-Country</Badge>
            : <></>}
          {(row['Link']) ? 
            <Badge onClick={() => {redirect(row)}} style={{cursor:'pointer'}}>Link to Data</Badge>
            : <></>}
        </div>
        
        <div>
          <div className='mt-2'>
            {shortContent.map((item, i) => {
              return (
                <span key={'med'+i}>
                  {i === 0 ? '' : ' | '}
                  <b>{item}:</b> {row[item]}
                </span>
              )
            })}
          </div>
  
          <div className='mt-2'>
            {
              (row['Region']) ? <span><b>Regions:</b> {regions}<br/></span> : <></>
            }
          {mediumContent.map((item, i) => {
              if (row[item]){
                return (
                  <span key={'med'+i}>
                    <b>{item}:</b> {row[item]}
                    <br/>
                  </span>
                )  
              }
            })}
          </div>
  
          <div className='mt-2'>
            {longContent.map((item, i) => {
              if (row[item]){
                return (
                  <span key={'long'+i}>
                    <b>{item}:</b><br/>
                    <span>{parser(row[item])}</span><br/>
                  </span>
                )  
              }
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Accordion defaultActiveKey={'activity'+[param.id]}>
        {data.map((item, i) => {
          return (
            <Accordion.Item key={i} eventKey={'activity'+item['EvaluationID']}>
              <Accordion.Header onClick={() => selectID(item)}>{item['Investment Name']}</Accordion.Header>
              <Accordion.Body>
                <div id='detail-info'>
                  {DetailInfo({row:item, param:param})}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          )
        })}
      </Accordion>
    </div>
  )
}

function useQueryParam(key) {
  let [searchParams, setSearchParams] = useSearchParams();
  let paramValue = searchParams.get(key);
  let value = useMemo(() => JSURL.parse(paramValue), [paramValue]);
  
  let setValue = useCallback(
    (newValue, options) => {
      let newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set(key, JSURL.stringify(newValue));
      setSearchParams(newSearchParams, options);
    },
    [key, searchParams, setSearchParams]
  );

  return [value, setValue];
}

function MainApp() {
  const [settingOption, setSettingOption] = useState({
    basemap: 'positron',
    showLabel: false,
  })

  let [filterParam, setFilterParam] = useQueryParam('filterParam')

  if (!filterParam){
    filterParam = {
      country: '',
      sector: '',
      population: '',
      outcome: '',
      status: '',
      id: '',
      multi: false
    }
  }

  const filteredTable = useMemo(() => {
    return filterData(table, columns, filterParam)
  }, [filterParam])

  const theFilterPanel = useMemo(() => {
    return <FilterPanel data={filteredTable} cols={columns} param={filterParam} setParam={setFilterParam}/>
  }, [filterParam])

  const theInfoPanel = useMemo(() => {
    if (filterParam.country !== ''){
      return (
        <div id='panel-info' className='col-sm-3 p-2'>
          <InfoPanel 
            data={filteredTable}
            param={filterParam}
            setParam={setFilterParam}/>
        </div>
      )
    } else {
      return <div></div>
    }
  }, [filterParam])

  const theMap = useMemo(() => {
    return <Map 
        data={filteredTable}
        param={filterParam} setParam={setFilterParam}
        setting={settingOption}
      />
  }, [filterParam, settingOption])

  return (
    <div className='p-0'>
      <div className='p-0 m-0' style={{zIndex:10}}>
        {theMap}
      </div>

      <div id='main-content' className='p-0 m-0 fixed-top' style={{zIndex:500, pointerEvents:'none'}}>
        <div className='row p-0 m-0'>
          <div id='app-menu'>
            <AppMenu setting={settingOption} setSetting={setSettingOption}/>
          </div>
          <div className='row m-0 p-0 justify-content-between'>
            <div id='panel-filter' className='col-sm-3 p-2'>
              {theFilterPanel}
            </div>

            {theInfoPanel}
          </div>
        </div>
      </div>      
    </div>
  )
}