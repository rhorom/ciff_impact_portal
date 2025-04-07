import { Accordion, Button, Form, InputGroup, Col, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import { DefaultEditor } from 'react-simple-wysiwyg';
import 'primeicons/primeicons.css'

import table from './data/impact_table.json';
import { fields, regionList } from './config';

const evalIDs = table.map((item) => {return item.EvaluationID});

function restructure(obj){
    const y1 = obj['yearsOfInvestment_start']
    const y2 = obj['yearsOfInvestment_end']
    var years = []
    for (var y=y1; y<=y2; y++){years.push(y)}
    
    var exportObj = {}
    Object.keys(obj).forEach((k) => {
        if (['yearsOfInvestment_start', 'yearsOfInvestment_end'].includes(k)){
            exportObj['Years of Investment'] = years.join(', ')
        } else {
            exportObj[fields[k]['title']] = obj[k]
        }
    })
    
    if (typeof obj['country'] === 'string'){
        exportObj['Multi'] = false
    } else {
        exportObj['Multi'] = obj['country'].length > 1
    }
    return exportObj
}

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function mergeAndDownload(originalArray, obj, id){
    if (evalIDs.includes(id)){
        originalArray = originalArray.map((item) => {
            if (item.EvaluationID == id) {return obj} else {return item}
        })
    } else {
        originalArray.push(obj)
    }

    downloadObjectAsJson(originalArray, 'impact_table_updated')
}

function labelInfo(obj){
    const info = (obj['info'] === '') ? <></> : <i className='pi pi-info-circle' title={obj['info']}/>
    return <span>{obj['title']} {info}</span>
}

function Evaluations({data}){
    var items = []
    data.forEach((item, i) => {
        const id = item['EvaluationID']
        var init = {};
        const data = table.filter((item) => {return item.EvaluationID === id})
        Object.keys(fields).forEach((k)=>{init[k] = data[0][fields[k]['title']]})

        items.push(<Accordion.Item key={i} eventKey={i}>
            <Accordion.Header>{item['Proposed Public Title']}</Accordion.Header>
            <Accordion.Body>
                <TheForm id={id} initialValues={init}/>
            </Accordion.Body>
        </Accordion.Item>)
    })
    return <div className='p-2'>
        <Accordion>
        {items}
        </Accordion>
    </div>
}

function AddNew({}){
    const id = -1
    var init = {}
    Object.keys(fields).forEach((k)=>{init[k] = fields[k]['default']})

    return <div className='p-2'><Accordion>
        <Accordion.Item eventKey='new'>
            <Accordion.Header>Empty Form</Accordion.Header>
            <Accordion.Body>
                <TheForm id={id} initialValues={init}/>
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
    </div>
}

function TheForm({ id, initialValues }) {
    return (
        <Formik
        onSubmit={(values) => {downloadObjectAsJson(restructure(values), 'impact_table_new')}}
        initialValues={initialValues}
        >
        {({ handleSubmit, handleChange, values }) => (
            <Form noValidate onSubmit={handleSubmit}>
                <Row className='mb-3'>
                    {Object.keys(fields).map(k => {
                        if (fields[k]['type'] === 'text'){
                            return <Form.Group key={k} as={Row}>
                                <Form.Label column sm={3}>{labelInfo(fields[k])}</Form.Label>
                                <Col sm={9}>
                                <Form.Control type='text' name={k} size='sm' defaultValue={values[k]} onChange={handleChange}></Form.Control>
                                </Col>
                            </Form.Group>
                        } else if (fields[k]['type'] === 'select'){
                            return <Form.Group key={k} as={Row}>
                                <Form.Label column sm={3}>{labelInfo(fields[k])}</Form.Label>
                                <Col sm={9}>
                                <Form.Select name={k} size='sm' defaultValue={values[k]} onChange={handleChange}>
                                    <option value={''}></option>
                                    {fields[k]['options'].map((option,i) => {
                                        return <option key={i} value={option}>{option}</option>
                                        })}
                                </Form.Select>
                                </Col>
                            </Form.Group>
                        } else if (fields[k]['type'] === 'country'){
                            const countries = (typeof values[k] === 'string') ? values[k].split(', ') : values[k]
                            const regions = values[k] ? regionList.filter((item) => {return countries.includes(item.Country)}) : regionList
                            const regionOptions = regions.map((item) => {return item.Region})

                            return <Row className='m-0 p-0' key={k}>
                                <Form.Group key={'country'} as={Row}>
                                    <Form.Label column sm={3}>{labelInfo(fields[k])}</Form.Label>
                                    <Col sm={9}>
                                    <Form.Text>{values[k] ? Array(values[k]).join(', ') : ''}</Form.Text>
                                    <Form.Select className='mb-2' size='sm' onChange={handleChange} name={k} multiple>
                                        {fields[k]['options'].map((option,i) => {
                                            return <option key={i} value={option}>{option}</option>
                                            })}
                                    </Form.Select>
                                    </Col>
                                </Form.Group>
                                <Form.Group key={'subRegion'} as={Row}>
                                    <Form.Label column sm={3}>{labelInfo(fields['subRegion'])}</Form.Label>
                                    <Col sm={9}>
                                    <Form.Text>{values['subRegion'] ? Array(values['subRegion']).join(', ') : ''}</Form.Text>
                                    <Form.Select className='mb-2' size='sm' onChange={handleChange} name={'subRegion'} multiple>
                                        {regionOptions.map((option,i) => {
                                            return <option key={i} value={option}>{option}</option>
                                            })}
                                    </Form.Select>
                                    </Col>
                                </Form.Group>
                            </Row>
                        } else if (fields[k]['type'] === 'years'){
                            return <Form.Group key={k} as={Row}>
                                <Form.Label column sm={3}>{labelInfo(fields[k])}</Form.Label>
                                <Col sm={9}>
                                <InputGroup onChange={handleChange} name={k} size='sm'>
                                    <Form.Control type='text' name={k+'_start'}/>
                                    <InputGroup.Text>to</InputGroup.Text>
                                    <Form.Control type='text' name={k+'_end'}/>
                                </InputGroup>
                                </Col>
                            </Form.Group>

                        } else if (fields[k]['type'] === 'rte'){
                            return <Form.Group className='mb-2' key={k} as={Row}>
                                <Form.Label column sm={3}>{fields[k]['title']}</Form.Label>
                                <Col sm={9}>
                                <DefaultEditor value={values[k]} onChange={handleChange} name={k}/>
                                </Col>
                                </Form.Group>

                        }
                    })}
                </Row>
                <div className='p-2 bg-danger-subtle'>
                    <Button className='m-0' variant='danger' size='sm' type="submit">Download</Button>
                    <Button className='m-0 mx-2' variant='danger' size='sm' onClick={() => {mergeAndDownload(table, restructure(values), id)}}>Merge and Download</Button>
                </div>
                
            </Form>
        )}
        </Formik>
        );
}

export function Edit(){
    return <div>
        <div className='border border-warning'>
            <h5 className='p-2 bg-danger text-light'>Create New Entry</h5>
            <AddNew/>
            <hr/>
            <h5 className='p-2 bg-danger text-light'>Existing Evaluations</h5>
            <Evaluations data={table}/>
        </div>
    </div>
}