import { useRef, useEffect, useMemo } from 'react'
import { MapContainer, GeoJSON, CircleMarker, Pane, TileLayer, useMap } from 'react-leaflet'
import { Button, Stack } from 'react-bootstrap'
import 'leaflet/dist/leaflet.css'
import 'primeicons/primeicons.css'

import boundary from './data/boundary.json'
import { getBbox } from './utils'
import { activeStyle, regionStyle, basemaps } from './config'

const init = {center:[0,10], zoom:4}
let main_map

export function MapSmall({ data }){
    let countries = []
    let points = []

    if (typeof data.Country === 'string') {
        countries = data.Country.replaceAll(', ',',').split(',')
    } else {
        countries = data.Country
    }
    
    if (data.Coordinate !== ''){
        points = data.Coordinate
    }

    let regions = []
    if (data.Region !== '') {
        regions = data.Region
    }

    const countryBoundary = boundary.features.filter((item) => {
        const selected = item.properties.Level === 'ADM_0'
            && (countries.includes(item.properties.Country))
        return selected
    })

    const regionBoundary = boundary.features.filter((item) => {
        const selected = item.properties.Level === 'ADM_1'
            && (regions.includes(item.properties.Region))
        return selected
    })

    const bounds = getBbox(countryBoundary)

    const refCountry = useRef()
    //const refRegion = useRef()

    useEffect(() => {
        if (refCountry.current) {
            refCountry.current.clearLayers()
            refCountry.current.addData(countryBoundary)
            const bounds = getBbox(countryBoundary)
            main_map.fitBounds(bounds)
        }
    }, [refCountry, countryBoundary])

    const DefineMap = () => {
        main_map = useMap();
        main_map.on({'dblclick': function(e){
            window.open('./', '_self')
        }})
        main_map.fitBounds(bounds)
    }

    function Legend({points, regions}){
        const showPoints = points.length > 0
        const showRegion = regions.length > 0

        return (
          <div id='legend-panel-small' className='leaflet-bottom leaflet-left'>
            <div className='leaflet-control'>
                <div className='bg-light rounded p-1'>
                    <b>Legend</b>
                    <Stack direction='horizontal' gap={1}><i className='pi pi-circle-fill' style={{color:'#e90051', opacity:0.5}}/>Targetted country</Stack>
                    {showRegion ? <Stack direction='horizontal' gap={1}><i className='pi pi-circle-fill' style={{color:'#ffbd00', opacity:1.0}}/>Targetted region</Stack> : <></>}
                    {showPoints ? <Stack direction='horizontal' gap={1}><i className='pi pi-circle-fill'/>Targetted location</Stack> : <></>}
                </div>
            </div>
          </div>
        )
    }

    function ZoomPanel(){
        return (
          <div id='zoom-panel' className='leaflet-bottom leaflet-right'>
            <div className='leaflet-control'>
            <Button variant='outline-danger' size='sm' title='Reset zoom' onClick={() => main_map.fitBounds(bounds)}><i className='pi pi-undo'/></Button>
            </div>
          </div>
        )
    }

    const theLegend = useMemo(() => {
        return <Legend points={points} regions={regionBoundary}/>
    }, [points, regionBoundary])

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
                style={{width:'100%', height:'300px', borderRadius:'8px'}}
            >

                <DefineMap />

                <Pane name='positron' style={{zIndex:60}}>
                    <TileLayer url={basemaps['positron']}/>
                </Pane>

                <Pane name='country-boundary' style={{zIndex:70}}>
                    <GeoJSON
                        data={countryBoundary}
                        ref={refCountry}
                        style={activeStyle}
                        />
                    <GeoJSON
                        data={regionBoundary}
                        style={regionStyle}
                        />
                </Pane>

                <Pane name='points' style={{zIndex:200}}>
                    {(points.length > 0) ? (points.map((c,i) => (
                        <CircleMarker
                            key={i} 
                            center={[c[1],c[0]]} 
                            radius={1}
                            color='#000'
                            opacity={0.9}
                            fillOpacity={0.9}
                            />))) : <></>}

                </Pane>

                {theLegend}
                <ZoomPanel />

                <TileLayer url={basemaps['label']} zIndex={700}/>
            </MapContainer>
        </div>
    )
}
