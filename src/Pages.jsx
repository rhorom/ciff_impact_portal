import glossary from './data/glossary.json'
import 'primeicons/primeicons.css'
import { Badge, Table, Form, FloatingLabel, Button } from 'react-bootstrap'
import { basemaps } from './config'

export function About () {
    return (
        <div>
            <p>
                CIFF Impact Portal shows the map of countries and regions where CIFF-funded programmes are implemented and evaluated. How this portal is normally used can be found in <a href='#/sop'>Standard Operating Procedure</a> page.
            </p>

            <h5>Disclaimer</h5>
            <p>
                Maps used on this website are for general illustration only, and are not intended to be used for reference purposes. The representation of political boundaries does not necessarily reflect the organization's view on the legal status of a country or territory.
            </p>

            <h5>Acknowledgement</h5>
            <ul>
            <li>India Administrative Boundaries were sourced from: Ministry of Science and Technology, Government of India. Survey of India. Online Maps Portal. Administrative Boundary Database (<a href='https://onlinemaps.surveyofindia.gov.in/Digital_Product_Show.aspx' target='_blank'>OVSF/1M/7</a>).
            </li>

            <li>Nigeria Administrative Boundaries were sourced from: eHealth Africa and Proxy Logics (2020). Nigeria Operational State Boundaries. Geo-Referenced Infrastructure and Demographic Data for Development (<a href='https://grid3.gov.ng/' target='_blank'>GRID3</a>).
            </li>

            <li>The administrative boundaries for the remaining countries were sourced from <a href='https://geoboundaries.org' target='_blank'>geoboundaries.org</a> (<a href='https://doi.org/10.1371/journal.pone.0231866' target='_blank'>Rufalo et al., 2020</a>).
            </li>
            </ul>
        </div>
    )
}

export function Procedure () {
    return (
        <div>
            <ul>
            <li>Select a country by clicking any highlighted region on the map. Evaluation(s) in this country will be visually summarised and listed on the right panel. The number of evaluations per country is displayed on the map.</li>
            <li>Click <kbd><i className='pi pi-file-export'/> Detail</kbd> on any listed evaluation to see further information.
            <ul>
            <li>Some evaluations contain <Badge pill bg='warning' text='dark'>Geo-coordinate</Badge> of the locations related to the evaluations. For such evaluation, location points are displayed on the map.</li>
            <li>Some evaluations are marked with  <Badge pill size='sm'>Multi-country</Badge> since they are conducted in multiple countries. All relevant countries are shown on the map.</li>
            <li>Selected evaluation can be opened in a new page by clicking <kbd><i className='pi pi-window-maximize '/></kbd></li>
            {/*<li>Data or publication related to some completed investments can be accessed by clicking <Badge pill size='sm'>Link to Data</Badge>.</li>*/}
            </ul>
            </li>
            <li>Filtering by <b>Country</b>, <b>Sector</b>, <b>Target Population</b>, <b>Primary Outcome</b>, <b>Status</b> and/or <b>Evaluator</b> can also be done using the top panel.</li>
            <li>Click <kbd><i className='pi pi-undo'/> Reset</kbd> to clear/reset the filter. Double click on the map will also reset the state.</li>
            {/*<li>Click <span className='pi pi-cog'></span> to perform additional setting to the map, such as toggle country labels, map scale, and auto-zoom functionality.</li>*/}
            </ul>
        </div>
    )
}

export function Glossary () {
    return (
        <div>
            <Table striped>
                <tbody>
                {Object.keys(glossary).map((key, i) => {
                    return (
                        <tr key={i}>
                            <td><b>{key}</b></td>
                            <td>{glossary[key]}</td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </div>
    )
}

export function Setting ({ param, setParam }) {
    function handleChange(e){
        let par = {...param}
        const tgt = e.target
        if (tgt.id === 'showLabel'){
            par[tgt.id] = tgt.checked
        } else {
            par[tgt.id] = tgt.value
        }

        setParam(par, {replace:true})
    }
    
    return (
        <div>
            <Form>
                <FloatingLabel controlId='basemap' label='Select Basemap'>
                    <Form.Select 
                        className='m-1' size='sm' 
                        as='basemap' id='basemap'
                        value={param.basemap}
                        onChange={handleChange}
                        >
                        {Object.keys(basemaps).map((key, i) => {
                            if (key === 'label'){
                                return
                            } else {
                                return (
                                    <option key={i} value={key}>{key}</option>
                                )    
                            }
                        })}
                    </Form.Select>                    
                </FloatingLabel>
                <hr/>
                <Form.Check 
                    type='switch'
                    id='showLabel'
                    label='Show label on map'
                    defaultChecked={param.showLabel}
                    onChange={handleChange}
                />
            </Form>
        </div>
    )
}