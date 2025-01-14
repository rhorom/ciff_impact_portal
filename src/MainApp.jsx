import { useMemo } from 'react';
import { Accordion } from 'react-bootstrap';

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { columns } from './config';
import table from './data/impact_table.json';
import { filterData, useQueryParam } from './utils';
import { FilterPanel } from './PanelFilter';
import { InfoPanel } from './PanelInfo';
import { Map } from './Map';
import { Graphic } from './Graphic';

export function MainApp(){
    let [filter, setFilter] = useQueryParam('filter')

    if (!filter){
      filter = {
        country: '',
        sector: '',
        population: '',
        outcome: '',
        status: '',
        evaluator: '',
      }
    }

    const filteredTable = useMemo(() => {
      return filterData(table, columns, filter)
    }, [filter])
  
    const theFilter = useMemo(() => {
      return <FilterPanel data={filteredTable} cols={columns} param={filter} setParam={setFilter}/>
    }, [filter])
  
    const theMap = useMemo(() => {
      return <Map data={filteredTable} param={filter} setParam={setFilter}/>
    }, [filter])
  
    const theInfo = useMemo(() => {
        if (filter.country !== ''){
          return (
            <InfoPanel 
              data={filteredTable}
              param={filter}
              setParam={setFilter}/>
          )
        } else {
          return <Accordion defaultActiveKey='summary' flush>
            <Accordion.Item eventKey='summary'>
                <Accordion.Header>
                    <b>Summary</b>
                </Accordion.Header>
                <Accordion.Body id='summary-graphic'>
                  <Graphic data={filteredTable} param={filter} setParam={setFilter} single={false}/>
                </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        }
    }, [filter])

    return <div className='container-fluid'>
        <div className='row'>
            <div className='m-0 p-0 pb-2'>{theFilter}</div>
            <div className='row m-0 p-0'>
                <div className='col-md-8 m-0' id='panel-map'>{theMap}</div>
                <div className='col-md-4 m-0 p-0' id='panel-info'>{theInfo}</div>
            </div>
        </div>

    </div>
}