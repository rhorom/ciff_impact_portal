import { useMemo, useRef, useEffect } from 'react'
import { renderToString } from 'react-dom/server'
import { MapContainer, GeoJSON, Marker, Pane, TileLayer, useMap } from 'react-leaflet'
import { Badge, Button, ButtonGroup, Stack } from 'react-bootstrap'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import 'primeicons/primeicons.css'
import { CircleFlag } from 'react-circle-flags'
import boundary from './data/boundary.json'
import { countOccurrence, getBbox } from './utils'
import { basemaps } from './config'

//let main_map

const init = {center:[0,10], zoom:4}
let main_map

//const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
//const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
//const height = vw < 576 ? '60vh' : '100vh'

export function Map({ data, param, setParam }){  
    let countryInt = data.filter((item) => item['Evaluator'] === 'CIFF')
        .map((item) => item.Country.split(', '))
        .flat()
    let countryExt = data.filter((item) => item['Evaluator'] !== 'CIFF')
        .map((item) => item.Country.split(', '))
        .flat()

    const countInt = countOccurrence(countryInt)
    const countExt = countOccurrence(countryExt)
    
    if (param.country) {
        countryInt = countryInt.includes(param.country) ? [param.country] : []
        countryExt = countryExt.includes(param.country) ? [param.country] : []
    }

    const countryBoundary = useMemo(() => {
        let features = boundary.features.filter((item) => {
            const selected = item.properties.Level === 'ADM_0'
                && ((countryInt.includes(item.properties.Country))
                || (countryExt.includes(item.properties.Country)))
            return selected;
        })

        features.forEach((feature) => {
            feature.properties['countInt'] = countInt[feature.properties.Country]
            feature.properties['countExt'] = countExt[feature.properties.Country]
            feature.param = param
        })

        return features
    }, [countryInt, countExt])

    const refCountry = useRef()
    useEffect(() => {
        if (refCountry.current) {
            refCountry.current.clearLayers()
            refCountry.current.addData(countryBoundary)
        }
    }, [refCountry, countryBoundary])

    const DefineMap = () => {
        main_map = useMap();
        main_map.on({'dblclick': function(){
            window.open('./', '_self')
        }})

        const bounds = getBbox(countryBoundary)
        main_map.flyToBounds(bounds)
    }

    function Legend({countInt, countExt}){
        const showInt = Object.keys(countInt).length > 0
        const showExt = Object.keys(countExt).length > 0
        return (
          <div id='legend-panel' className='leaflet-bottom leaflet-left'>
            <div className='leaflet-control'>
                <div className='bg-light rounded p-1'>
                    <b>Legend</b>
                    {showInt ? <Stack direction='horizontal' gap={1}><i className='pi pi-circle-fill' style={{color:'#e90051', opacity:0.5}}/>with evaluation(s)</Stack> : <></>}
                    {showExt > 0 ? <Stack direction='horizontal' gap={1}><i className='pi pi-circle-fill' style={{color:'#189cac', opacity:0.5}}/>with external evaluation(s)</Stack> : <></>}
                </div>
            </div>
          </div>
        )
    }

    function Info(){
        return (
          <div className='leaflet-top leaflet-left'>
            <div className='leaflet-control'>
                <div id='info' className='bg-light rounded p-1'>
                    Country:
                </div>
            </div>
          </div>
        )
    }

    function ZoomPanel(){
        return (
          <div id='zoom-panel' className='leaflet-bottom leaflet-right'>
            <div className='leaflet-control'>
            <ButtonGroup className='m-1'>
              <Button variant='outline-danger' size='sm' title='Zoom-out' onClick={() => main_map.zoomOut()}><i className='pi pi-minus-circle'/></Button>
              <Button variant='outline-danger' size='sm' title='Zoom-in' onClick={() => main_map.zoomIn()}><i className='pi pi-plus-circle'/></Button>
            </ButtonGroup>
            </div>
          </div>
        )
    }

    function countryStyle(feature){
        const color = feature.properties.countExt > 0 ? '#189cac' : '#e90051'
        return {
            opacity: 0.5,
            color: color,
            fillColor: color,
            weight: 1
        }
    }

    function iconTally(obj){
        const content = renderToString(
            <Stack direction='horizontal' gap={1}>
            <CircleFlag countryCode={obj.CountryISO} height={25}/>
            <div>
                {obj.countInt > 0 ? <Badge bg='danger' text='light'>{obj.countInt} int</Badge> : <></>}
                {obj.countExt > 0 ? <Badge bg='info' text='dark'>{obj.countExt} ext</Badge> : <></>}
            </div>
            </Stack>
        )
        let elem
        elem = `<div>${content}</div>`
        return L.divIcon({
            html: elem,
            className: ''
        })
    }

    const countryTally = useMemo(() => 
    { return <> {
        countryBoundary.map((row, i) => {
            const icon = iconTally(row.properties)
            return <Marker 
                position={[row.properties.Lat, row.properties.Lon]}
                icon={icon}
                key={i}
            />
        })
        }</>
    }, [countryBoundary])

    const theLegend = useMemo(() => {
        return <Legend countInt={countInt} countExt={countExt}/>
    }, [countInt, countExt])

    function onEachCountry(feature, layer){
        const info = document.getElementById('info')
        layer.on({
            mouseover: function(e){
                layer.setStyle({weight:4})
                const prop = e.target.feature.properties
                info.innerHTML = `Country: <b>${prop.Country}</b>`
            },
            mouseout: function(e){
                layer.setStyle({weight:1})
                info.innerHTML = `Country:`
            },
            click: function(e){
                layer.setStyle({weight:3})
                main_map.fitBounds(e.target._bounds)
                //selectCountry(e.target.feature.properties.Country)
                setParam({...feature.param, country:feature.properties.Country})
            }
        })
    }

    return (
        <div>
            <MapContainer
                center={init.center}
                zoom={init.zoom}            
                minZoom={3}
                maxZoom={10}            
                attributionControl={false}
                zoomAnimation={true}
                zoomControl={false}
                doubleClickZoom={false}
                id='map-container'
                style={{width:'100%', height:'72vh', borderRadius:'8px'}}
            >

                <DefineMap />

                <Pane name='basemap' style={{zIndex:60}}>
                    <TileLayer url={basemaps['positron']}/>
                </Pane>

                <Pane name='country-boundary' style={{zIndex:70}}>
                    <GeoJSON
                        data={countryBoundary}
                        style={countryStyle}
                        ref={refCountry}
                        onEachFeature={onEachCountry}
                        />
                </Pane>

                <Pane name='country-tally' style={{zIndex:100}}>
                    {countryTally}
                </Pane>

                <ZoomPanel/>
                {theLegend}
                <Info/>

            </MapContainer>
        </div>
    )
}
