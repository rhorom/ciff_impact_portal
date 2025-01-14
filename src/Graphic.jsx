import { useMemo } from 'react'
import { Badge, Button, Image, Stack } from 'react-bootstrap'
import 'primeicons/primeicons.css'
import { countOccurrence, onlyUnique } from './utils'
import { iconMapper } from './config'
//import { Button } from 'react-bootstrap/lib/InputGroup'

function Bar(n1, n2, nt, suffix=['',''], color=['#e9546e','#189cac'], width=200){
    const w0 = width + 10
    const w1 = width*n1/nt
    const w2 = width*n2/nt

    return <svg width={w0} height='20px'>
        <rect width={w1} height='20' x='0' y='0' rx='5' ry='5' stroke='#fff' fill={color[0]}/>
        <rect width={w2} height='20' x={w1} y='0' rx='5' ry='5' stroke='#fff' fill={color[1]}/>
        {n1 > 0 ? <text x={w1-5} y='15' textAnchor='end' fill='#fff' fontSize='small' fontWeight='bold'>{(n1).toFixed(0)}{suffix[0]}</text> : <></>}
        {n2 > 0 ? <text x={w1+5} y='15' textAnchor='start' fill='#fff' fontSize='small' fontWeight='bold'>{(n2).toFixed(0)}{suffix[1]}</text> : <></>}
    </svg>
}

function BarSector({ tally, param_, setParam_ }){
    function selectSector(e){
        setParam_({...param_, sector:e})
        //console.log(e)
    }

    let nt = 1
    let bars = []
    const width = document.documentElement.clientWidth < 1080 ? 200 : 250
    
    Object.keys(tally).forEach((k) => {nt = Math.max(nt, tally[k][0] + tally[k][1])})
    Object.keys(tally).forEach((k) => {
        bars.push(
            <Button key={k} variant='light' className='m-0 p-0' title='Select sector' onClick={() => selectSector(k)}>
            <div className='m-0'>
            <div className='m-0 p-0'>
            <Stack direction='horizontal' gap={1}>
                <Image src={iconMapper[k]} height='30px' roundedCircle/>
                <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'x-small', marginBottom:'-0.5em'}}><b>{k}</b> | {tally[k][0]+tally[k][1]} evaluation{nt>1?'s':''}</div>
                    {Bar(tally[k][0], tally[k][1], nt, [' int',' ext'], ['#e9546e','#189cac'], width)}
                </div>
            </Stack>
            </div>
            </div>
            </Button>
        )
    })
    return <div className='mt-4 p-2 border border-danger rounded-2'>
        <div style={{marginTop:'-20px'}}><kbd><b>By Sector</b></kbd></div>
        <div>{bars}</div>
        </div>
}

function BarStatus({ tally }){
    const nt1 = (tally['Completed'][0] + tally['On-going'][0])
    const nt2 = (tally['Completed'][1] + tally['On-going'][1])
    
    const checks = (
    <div className='mt-1 px-1'>
        {nt1 > 0 ? (<div style={{maxWidth:'300px'}}>
        <div style={{fontSize:'x-small'}}><b>
            Internal evaluations </b>
            {tally['Completed'][0] > 0 ? <Badge bg='success'>{tally['Completed'][0]} complete </Badge> : ''}
            {tally['On-going'][0] > 0 ? <Badge bg='info'>{tally['On-going'][0]} on-going </Badge> : ''}
        </div>
            {[...Array(tally['Completed'][0]).keys()].map((x) => {return <span key={x} className='bg-success text-light p-1 pb-0' style={{fontSize:'small'}}><i className='pi pi-check-circle'/></span>})}
            {[...Array(tally['On-going'][0]).keys()].map((x) => {return <span key={x} className='bg-info text-light p-1 pb-0' style={{fontSize:'small'}}><i className='pi pi-circle'/></span>})}
        </div>) : <></>}

        {nt2 > 0 ? (<div>
        <div style={{fontSize:'x-small'}}><b>
            External evaluations </b>
            {tally['Completed'][1] > 0 ? <Badge bg='success'>{tally['Completed'][1]} complete </Badge> : ''}
            {tally['On-going'][1] > 0 ? <Badge bg='info'>{tally['On-going'][1]} on-going </Badge> : ''}
        </div>
            {[...Array(tally['Completed'][1]).keys()].map((x) => {return <span key={x} className='bg-success text-light p-1 pb-0' style={{fontSize:'small'}}><i className='pi pi-check-circle'/></span>})}
            {[...Array(tally['On-going'][1]).keys()].map((x) => {return <span key={x} className='bg-info text-light p-1 pb-0' style={{fontSize:'small'}}><i className='pi pi-circle'/></span>})}
        </div>) : <></>}

    </div>)

    return <div className='mt-4 p-1 border border-danger rounded-2'>
        <div style={{marginTop:'-20px'}}><kbd><b>By Status</b></kbd></div>
        {checks}
    </div>
}

function BarStatusX({ tally }){
    const nt1 = (tally['Completed'][0] + tally['On-going'][0])
    const nt2 = (tally['Completed'][1] + tally['On-going'][1])
    const p1 = (10*tally['On-going'][0]/nt1).toFixed(0)
    const p2 = (10*tally['On-going'][1]/nt2).toFixed(0)

    const checks = (
    <div className='mt-1 px-1'>
        {nt1 > 0 ? (<div>
        <div style={{fontSize:'x-small'}}><b>
            Internal evaluations</b>
            {tally['Completed'][0] > 0 ? ` | ${tally['Completed'][0]} complete` : ''}
            {tally['On-going'][0] > 0 ? ` | ${tally['On-going'][0]} on-going` : ''}
        </div>
        <Stack direction='horizontal'>
            {[...Array(Number(10-p1)).keys()].map((x) => {return <h5 key={x} className='bg-success text-light p-1 pb-0'><i className='pi pi-check-circle'/></h5>})}
            {[...Array(Number(p1)).keys()].map((x) => {return <h5 key={x} className='bg-info text-light p-1 pb-0'><i className='pi pi-circle'/></h5>})}
        </Stack>
        </div>) : <></>}

        {nt2 > 0 ? (<div>
        <div style={{fontSize:'x-small'}}><b>
            External evaluations</b>
            {tally['Completed'][1] > 0 ? ` | ${tally['Completed'][1]} complete` : ''}
            {tally['On-going'][1] > 0 ? ` | ${tally['On-going'][1]} on-going` : ''}
        </div>
        <Stack direction='horizontal'>
            {[...Array(Number(10-p2)).keys()].map((x) => {return <h5 key={x} className='bg-success text-light p-1 pb-0'><i className='pi pi-check-circle'/></h5>})}
            {[...Array(Number(p2)).keys()].map((x) => {return <h5 key={x} className='bg-info text-light p-1 pb-0'><i className='pi pi-circle'/></h5>})}
        </Stack>
        </div>) : <></>}

    </div>)

    return <div className='mt-4 p-1 border border-danger rounded-2'>
        <div style={{marginTop:'-20px'}}><kbd><b>By Status</b></kbd></div>
        {checks}
    </div>
}

function Numbers({ data, single=false}){
    const nInt = data.filter((item) => item['Evaluator'] === 'CIFF').length
    const nExt = data.filter((item) => item['Evaluator'] !== 'CIFF').length
    const nMulti = data.filter((item) => item['Multi'] !== 'Yes').length
    let nCountry = 1
    if (!single) {
        const countryTally = getTally(data, data, 'Country')
        nCountry = Object.keys(countryTally).length    
    }

    return <div>
        <Stack direction='horizontal' gap={2}>
            <div className='text-center bg-secondary-subtle text-danger px-2'>
                <div style={{fontSize:'70px', marginBottom:'-0.25em'}}><b>{data.length}</b></div>
                <div>evaluation{data.length > 1 ? 's' : ''}</div>
            </div>
            <div style={{fontSize:'smaller'}}>
                {nInt > 0 ? 
                <Stack direction='horizontal' className='my-1'>
                    <div className='bg-danger border border-danger text-light px-1'><b>{nInt}</b></div>
                    <div className='border border-danger text-danger px-1'>internal evaluations</div>
                </Stack>
                : <></>}
                {nExt > 0 ? 
                <Stack direction='horizontal' className='my-1'>
                    <div className='bg-info border border-info text-light px-1'><b>{nExt}</b></div>
                    <div className='border border-info text-info px-1'>external evaluations</div>
                </Stack>
                : <></>}
                {nCountry > 0 ? 
                <Stack direction='horizontal' className='my-1'>
                    <div className='bg-warning border border-warning text-light px-1'><b>{nCountry}</b></div>
                    <div className='border border-warning text-warning px-1'>countr{nCountry > 1 ? 'ies' : 'y'}</div>
                </Stack>
                : <></>}
                {nMulti > 0 ? 
                <Stack direction='horizontal' className='my-1'>
                    <div className='bg-primary border border-primary text-light px-1'><b>{nMulti}</b></div>
                    <div className='border border-primary text-primary px-1'>multi-country</div>
                </Stack>
                : <></>}
            </div>
        </Stack>

    </div>
}

function getTally(a, b, col){
    const ca = countOccurrence(a.map((item) => item[col].split(', ')).flat())
    const cb = countOccurrence(b.map((item) => item[col].split(', ')).flat())
    
    const ka = Object.keys(ca)
    const kb = Object.keys(cb)

    let keys = []
    let tally = {}
    ka.forEach((k) => keys.push(k))
    kb.forEach((k) => keys.push(k))
    keys = keys.filter(onlyUnique).sort()
    
    keys.forEach((k) => {
        tally[k] = [0,0]
        if (ka.includes(k)) {tally[k][0] = ca[k]}
        if (kb.includes(k)) {tally[k][1] = cb[k]}
    })

    return tally
}

export function Graphic({ data, param, setParam, single=false }){
    const dataInt = data.filter((item) => item['Evaluator'] === 'CIFF')
    const dataExt = data.filter((item) => item['Evaluator'] !== 'CIFF')

    const tallySector = getTally(dataInt, dataExt, 'Sector')
    
    {/*
    let tallyStatus = getTally(dataInt, dataExt, 'Status')
    if (!('Completed' in tallyStatus)) {
        tallyStatus['Completed'] = [0,0]
    }
    if (!('On-going' in tallyStatus)) {
        tallyStatus['On-going'] = [0,0]
    }
    */}

    const sectors = useMemo(() => {
        return <BarSector tally={tallySector} param_={param} setParam_={setParam}/>
    }, [tallySector, param])

    return <div id='infographic'>
        <Numbers data={data} single={single}/>
        {sectors}
        {/*<BarStatus tally={tallyStatus}/>*/}
    </div>
}