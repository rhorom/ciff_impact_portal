import { useMemo } from 'react'
import { Badge, Button, Image, Stack } from 'react-bootstrap'
import 'primeicons/primeicons.css'
import { countOccurrence, onlyUnique } from './utils'
import { iconMapper } from './config'

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
    
    Object.keys(tally).forEach((k) => {nt = Math.max(nt, tally[k][0])})
    Object.keys(tally).forEach((k) => {
        bars.push(
            <Button key={k} variant='light' className='m-0 p-0' title='Select sector' onClick={() => selectSector(k)}>
            <div className='m-0'>
            <div className='m-0 p-0'>
            <Stack direction='horizontal' gap={1}>
                <Image src={iconMapper[k]} height='30px' roundedCircle/>
                <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'x-small', marginBottom:'-0.5em'}}><b>{k}</b> | {tally[k][0]} evaluation{tally[k][0]>1?'s':''}</div>
                    {Bar(tally[k][0], 0, nt, [' ',' ext'], ['#e9546e','#189cac'], width)}
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

function BarFunder({ tally, param_, setParam_ }){
    function selectSector(e){
        setParam_({...param_, funder:e})
        //console.log(e)
    }

    let nt = 1
    let bars = []
    const width = document.documentElement.clientWidth < 1080 ? 200 : 250
    
    Object.keys(tally).forEach((k) => {nt = Math.max(nt, tally[k][0])})
    Object.keys(tally).forEach((k) => {
        bars.push(
            <Button key={k} variant='light' className='m-0 p-0' title='Select sector' onClick={() => selectSector(k)}>
            <div className='m-0'>
            <div className='m-0 p-0'>
            <Stack direction='horizontal' gap={1}>
                <div style={{textAlign:'left'}}>
                    <div style={{fontSize:'x-small', marginBottom:'-0.5em'}}><b>{k}</b> | {tally[k][0]} evaluation{tally[k][0]>1?'s':''}</div>
                    {Bar(0, tally[k][0], nt, [' ',' '], ['#e9546e','#189cac'], width)}
                </div>
            </Stack>
            </div>
            </div>
            </Button>
        )
    })
    return <div className='mt-4 p-2 border border-success rounded-2'>
        <div style={{marginTop:'-20px'}}><kbd style={{background:'#189cac'}}><b>By Funder</b></kbd></div>
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

function Numbers({ data, single=false}){
    const nMulti = data.filter((item) => item['Multi']).length
    const nCompleted = data.filter((item) => item['Status'] === 'Completed').length
    const nOnGoing = data.filter((item) => item['Status'] === 'On-going').length
    const years = data.map((item) => {return item['Years of Investment'].replaceAll(', ',',').split(',')}).flat()
    const y1 = Math.min(...years)
    const y2 = Math.max(...years)

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
                <Stack direction='horizontal' className='my-1'>
                    <div className='border border-secondary text-secondary px-1'>from</div>
                    <div className='bg-secondary border border-secondary text-light px-1'><b>{y1}</b></div>
                    <div className='border border-secondary text-secondary px-1'>to</div>
                    <div className='bg-secondary border border-secondary text-light px-1'><b>{y2}</b></div>
                </Stack>

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
                {nCompleted > 0 ? 
                <Stack direction='horizontal' className='my-1'>
                    <div className='bg-success border border-success text-light px-1'><b>{nCompleted}</b></div>
                    <div className='border border-success text-success px-1'>completed</div>
                </Stack>
                : <></>}
                {nOnGoing > 0 ? 
                <Stack direction='horizontal' className='my-1'>
                    <div className='bg-info border border-info text-light px-1'><b>{nOnGoing}</b></div>
                    <div className='border border-info text-info px-1'>on-going</div>
                </Stack>
                : <></>}    
            </div>
        </Stack>

    </div>
}

function getTally(a, b, col){
    const ca = countOccurrence(a.map((item) => {
        if (typeof item[col] === 'string') {return item[col].replaceAll(', ',',').split(',')} else {return item[col]}
    }).flat())
    const cb = countOccurrence(b.map((item) => {
        if (typeof item[col] === 'string') {return item[col].replaceAll(', ',',').split(',')} else {return item[col]}
    }).flat())

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
    const tallySector = getTally(data, data, 'Sector')
    const tallyFunder = getTally(data, data, 'Funder')

    const bars = useMemo(() => {
        return <>
            <BarSector tally={tallySector} param_={param} setParam_={setParam}/>
            <BarFunder tally={tallyFunder} param_={param} setParam_={setParam}/>
            </>
    }, [tallySector, param])

    return <div id='infographic'>
        <Numbers data={data} single={single}/>
        {bars}
        {/*<BarStatus tally={tallyStatus}/>*/}
    </div>
}