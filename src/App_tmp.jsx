import { useState, useMemo, useEffect } from 'react'
import { Routes, Route, useSearchParams } from 'react-router-dom'
import * as JSURL from 'jsurl'
import parser from 'html-react-parser'
import { 
  Nav, Navbar, NavDropdown, Accordion, 
  Button, Modal, Form, FloatingLabel, Badge 
} from 'react-bootstrap'

import 'primeicons/primeicons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'leaflet/dist/leaflet.css'
import './index.css'

import { Map } from './Map'
import { columns, badgeContent, shortContent, mediumContent, longContent } from './config'
import table from './data/impact_table.json'
import { onlyUnique, filterData } from './utils'

const values = {
  'country': ['Kenya', 'Benin', 'Ghana', 'Senegal'],
  'sector': ['Health', 'Agriculture', 'Education']
}

function MainApp() {
  const [count, setCount] = useState({'A':0, 'B':0});

  const doAdd = (e) => {
    console.log(e.target.id)
    let neo = {...count}
    neo[e.target.id] = neo[e.target.id] + 1

    setCount(neo, {replace:true})
  }

  const print = useMemo(() => {
    return (
      <>
        {Object.keys(count).map((c,i) => {
          return (
            <div key={i}>{c}: {count[c]}</div>
          )
        })}
      </>
    )
  }, [count])

  return (
    <div className='container'>
      <Button id='A' onClick={(e) => doAdd(e)}>Add_A</Button>
      <Button id='B' onClick={(e) => doAdd(e)}>Add_B</Button>
      
      {print}
    </div>
  )
}

export default function App() {
  return (
    <div>
      <Routes>
        <Route index element={<MainApp/>}/>
      </Routes>
    </div>
  )
}
