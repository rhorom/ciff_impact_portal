import { useState, useMemo, useCallback } from 'react';
import { useLocation } from "react-router";
import { 
    Accordion, Badge, Button, Card, Image, Modal, Stack
} from 'react-bootstrap'

import 'primeicons/primeicons.css'

import { DetailInfo } from "./PanelInfo";
import table from './data/impact_table.json';

export function Evaluation() {
    let location = useLocation()
    const path = location.pathname.split('/')[2].split('-')

    const obj = table.filter((row) => row['EvaluationID'] === Number(path[0]))
    return (
        <div>
            {obj.length > 0 ? (
            <Card>
                <Card.Header>
                    {/*<Stack direction='horizontal' style={{fontSize:'x-large'}} gap={3}>
                        <i className='pi pi-print ms-auto' title='Print this evaluation'/>
                        <i className='pi pi-facebook' title='Share on Facebook'/>
                        <i className='pi pi-instagram' title='Share on Instagram'/>
                    </Stack>*/}
                </Card.Header>
                <Card.Body><DetailInfo obj={obj[0]}/></Card.Body>
                <Card.Footer>
                    
                </Card.Footer>
            </Card>
            ) : (
            <div className='text-center p-5'>
                <h1><i className='pi pi-exclamation-triangle'/></h1>
                <h2>Page not found</h2>
                <blockquote>Go back to the <a href='#'>main page</a> and find available evaluation from the list.</blockquote>
            </div>
        )}
        </div>
    )
}