import { useState, useMemo, useEffect, useCallback } from 'react'
import parser from 'html-react-parser'
import { 
  Accordion, Badge, Button, Card, Image, Modal, Stack
} from 'react-bootstrap'

import 'primeicons/primeicons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'leaflet/dist/leaflet.css'
import './index.css'

import { iconMapper, shortContent, longContent, midContent } from './config'
import { MapSmall } from './MapSmall';
import { Graphic } from './Graphic';

function OnGoing(){
    return <span className='pill'><Badge pill bg='info' text='light'>On-going</Badge></span>
}

function Completed(){
    return <span className='pill'><Badge pill bg='success' text='light'>Completed</Badge></span>
}

function Multi(){
    return <span className='pill'><Badge pill bg='primary' text='light'>Multi-country</Badge></span>
}

function Geoloc(){
    return <span className='pill'><Badge pill bg='warning' text='dark'>Geo-coordinate</Badge></span>
}

function Chvr(){return <i className='pi pi-chevron-circle-right mx-1'/>}

function EvalItem({ obj, func }){
    const sector = obj["Sector"].split(", ")[0]
    return (
    <div className='mb-1'>
        <Card bg='warning-subtle'>
            <div className='p-0 m-2 mb-0'>
                <Stack direction='horizontal' gap={3}>
                <div className='mb-2'>
                    <Image src={iconMapper[sector]} width={'50px'} roundedCircle/>
                </div>
                <Stack direction='vertical'>
                <div className='title'>
                    {obj["Investment Name"]}
                </div>
                <div className='subtitle'>
                    {obj["Proposed Public Title"]}
                </div>
                </Stack>
                </Stack>
            </div>
            <div className='p-1 px-2' style={{fontSize:'small'}}>
                {midContent.map((item, i) => {
                    return <span key={i}>{i>0? ' | ':''}<b>{item}: </b>
                    {obj[item]} 
                    </span>
                })}
            </div>
            <Card.Footer>
                <Stack direction='horizontal' gap={1}>
                    <div>
                        <span className='pill'><Badge pill bg='secondary'>{obj["Years of Investment"]}</Badge></span>
                        {obj["Status"] === "On-going" ? <OnGoing/> : <Completed/>}
                        {obj["Multi"] === "No" ? <></> : <Multi/>}
                        {obj["Coord"] === "" ? <></> : <Geoloc/>}
                    </div>
                    <div className='ms-auto'>
                        <Button size='sm' variant='danger' title='Click to see more' onClick={() => func([true, obj])}><i className='pi pi-file-export'/> Detail</Button>
                    </div>
                </Stack>
            </Card.Footer>
        </Card>
    </div>
    )
}

export function DetailInfo({ obj }){
    let regions = ''
    if (obj['Region']) {
        regions = JSON.parse(obj['Region'].replace(/'/g, '"'))
    }
    
    return <div className='row px-2'>
        <div className='small-only'>
            <h5>{obj["Investment Name"]}</h5>
            <div className='subtitle'>{obj["Proposed Public Title"]}</div>
        </div>
        <div className='col-sm-4 mb-3'>
            <div className='text-center mb-3'>
                <Image src={obj["Image"]} width='100%' rounded/>
            </div>
            <div className='short-content'>
                {shortContent.map((item, i) => {
                    const values = obj[item].split(", ")
                    if (obj[item]){
                        return (
                        <span key={'med'+i}>
                            <h6 className='mt-2'><kbd>{item}</kbd></h6>
                            {values.map((value, j) => {
                                return <span key={j}><Chvr/>{value}<br/></span>
                            })}
                        </span>
                        )  
                    }
                    })}
            </div>
        </div>

        <div className='col-sm-8 mb-3'>
            <div className='large-only'>
                <h5>{obj["Investment Name"]}</h5>
                <div className='subtitle'>{obj["Proposed Public Title"]}</div>
            </div>
            
            <Stack direction='horizontal' gap={1} className='my-2'>
                <span className='pill'><Badge pill bg='secondary'>{obj["Years of Investment"]}</Badge></span>
                {obj["Status"] === "On-going" ? <OnGoing/> : <Completed/>}
                {obj["Multi"] === "No" ? <></> : <Multi/>}
                {obj["Coord"] === "" ? <></> : <Geoloc/>}
            </Stack>
            <hr/>
            
            <div className='mb-3' style={{height:'300px'}}>
                <MapSmall data={obj}/>
            </div>

            <div className='short-content'>
                {obj["Region"] ? 
                    <span>
                        <h6><kbd>Region</kbd></h6>
                        {
                            Object.keys(regions).map((item, i) => {
                                return <span key={i}><Chvr/><b>{item}</b>: {regions[item].join(", ")}<br/></span>
                            })
                        }
                    </span>
                 : <></>}
            </div>

            <div className='short-content'>
                {longContent.map((item, i) => {
                if (obj[item]){
                    return (
                    <div key={'long'+i}>
                        <h6 className='mt-2'><kbd>{item}</kbd></h6>
                        <span>{parser(obj[item])}</span><br/>
                    </div>
                    )  
                }
                })}
            </div>
        </div>

    </div>
}

function GoToEval(evalID){
    window.open(`#/eval/${evalID}`, '_blank')
}

export function InfoPanel({ data, param, setParam }) {
    const [showModal, setShowModal] = useState([false, {}])

    const n = data.length
    return (
    <div className='p-0 m-0'>
        <Accordion defaultActiveKey='summary' flush>
            <Accordion.Item eventKey='summary'>
                <Accordion.Header>
                    <b>Summary of Evaluation{n > 1 ? 's' : ''} in {param.country}</b>
                </Accordion.Header>
                <Accordion.Body>
                <Graphic data={data} single={true}/>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey='list'>
                <Accordion.Header>
                    <b>List of evaluation{n > 1 ? 's' : ''}</b>
                </Accordion.Header>
                <Accordion.Body>
                    <div id='list-info'>
                        {data.map((item,i) => {
                            return <EvalItem obj={item} key={i} func={setShowModal}/>
                        })}
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>

        <Modal show={showModal[0]} size='lg' fullscreen='down' onHide={() => setShowModal([false, {}])}>
            <Modal.Header closeButton closeVariant='white'>
            <Modal.Title>Evaluation in Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showModal[0] === true ? <DetailInfo obj={showModal[1]}/> : <></>}
            </Modal.Body>
            <Modal.Footer>
                <Stack direction='horizontal' style={{fontSize:'x-large'}}>
                    <i className='pi pi-window-maximize mx-2' title='Show on a new page' onClick={()=>GoToEval(showModal[1]['EvaluationID'])}/>
                </Stack>
            </Modal.Footer>
        </Modal>

    </div>
    )
}
