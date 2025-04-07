import { 
  Accordion, Button, Form, FloatingLabel
} from 'react-bootstrap'

import 'primeicons/primeicons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'leaflet/dist/leaflet.css'
import './index.css'

import { columns } from './config'
import { onlyUnique } from './utils'

export function FilterPanel({ data, cols, param, setParam }) {
  function handleChange(e){
    const target = e.target
    let par = {...param}
    par[target.id] = target.value
    par['id'] = ''
    setParam(par)
  }
  
  return (
    <div style={{pointerEvents:'auto'}}>
      <Accordion defaultActiveKey={'0'}>
        <Accordion.Item eventKey='0'>
          <Accordion.Header><b>Filter</b></Accordion.Header>
          <Accordion.Body>
            <div id='panel-filter' className='row m-0 p-0'>
            {
              Object.keys(cols).map((c, i) => {
                const col = columns[c]
                let options = []
                data.forEach((item) => {
                  if (typeof item[col] === 'string'){
                    options.push(item[col].replaceAll(', ',',').split(','))
                  } else {
                    options.push(item[col])
                  }
                })
                options = options.flat().filter(onlyUnique).sort()

                return (
                  <div className='dropdowns col-md m-0 p-0 px-1' key={'dropdown'+i}>
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
              <Button size='sm' variant='danger'><i className='pi pi-undo'/> Reset</Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}