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
    var countries = data.map((item) => {
        if (typeof item.Country === 'string'){
            return item.Country.replaceAll(', ',',').split(',')
        } else {
            return item.Country
        }
    }).flat()

    const countCountry = countOccurrence(countries)

    if (param.country) {
        countries = countries.includes(param.country) ? [param.country] : []
    }

    const countryBoundary = useMemo(() => {
        let features = boundary.features.filter((item) => {return (item.properties.Level === 'ADM_0') && (countries.includes(item.properties.Country))})
        features.forEach((feature) => {
            feature.properties['count'] = countCountry[feature.properties.Country]
            feature.param = param
        })
        return features
    }, [countries, countCountry, param])

    const refCountry = useRef()
    const refOverlay = useRef()
    useEffect(() => {
        if (refCountry.current) {
            refCountry.current.clearLayers()
            refCountry.current.addData(countryBoundary)
        }
        if (refOverlay.current) {
            refOverlay.current.clearLayers()
            refOverlay.current.addData(countryBoundary)
        }
    }, [refCountry, refOverlay, countryBoundary])

    const DefineMap = () => {
        main_map = useMap();
        main_map.on({'dblclick': function(){
            window.open('./', '_self')
        }})

        const bounds = getBbox(countryBoundary)
        main_map.flyToBounds(bounds)
    }

    function Legend({countInt, countExt}){
        function label(c){
            return <Stack direction='horizontal' gap={1}><i className='pi pi-circle-fill' 
            style={{color:c['color'], opacity:0.25}}/>{c['label']}</Stack>
        }

        const colors = [
            {
                'color':'#e90051', 
                'label':'internal evaluations'
            }, 
            {
                'color':'#189cac', 
                'label':'external evaluations'
            }, 
            {
                'color':'#ffbd00', 
                'label':'internal and external evaluations'
            }, 
        ]

        let both = false
        let idx = []
        if (Object.keys(countInt).length > 0){
            both = true
            idx.push(0)
        }
        if (Object.keys(countExt).length > 0){
            idx.push(1)
            if (both){idx.push(2)}
        }

        return (
          <div id='legend-panel' className='leaflet-bottom leaflet-left'>
            <div className='leaflet-control'>
                <div className='bg-light rounded p-1'>
                    <b>Legend</b>
                    {idx.map((i) => {
                        const c = colors[i]
                        return <Stack key={i} direction='horizontal' gap={1}><i className='pi pi-circle-fill' 
                        style={{color:c['color'], opacity:0.75}}/>{c['label']}</Stack>
                    })}
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

    const overlayStyle = {
        opacity: 0.02,
        color: '#fff',
        fillColor: '#fff',
        weight: 1
    }

    function countryStyle(feature){
        let idx = 0
        const colors = ['#ffbd00', '#e90051', '#189cac', '#ffbd00']
        
        return {
            opacity: 1,
            color: colors[0],
            fillColor: colors[0],
            weight: 1
        }
    }

    function iconTally(obj){
        const content = renderToString(
            <Stack direction='horizontal' gap={0}>
            <CircleFlag countryCode={obj.CountryISO} height={20}/>
            <div className='m-0 p-0'>
                <Badge bg='danger' text='light'>{obj.count}</Badge>
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
        //return <Legend countInt={countInt} countExt={countExt}/>
        return <></>
    }, [])

    function onEachCountry(feature, layer){
        const info = document.getElementById('info')
        layer.on({
            mouseover: function(e){
                layer.setStyle({weight:4})
                const prop = e.target.feature.properties
                info.innerHTML = `Country: <b>${prop.Country}</b> (${prop.count} evaluation${prop.count > 1 ? 's' : ''})`
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

                <Pane name='basemap' style={{zIndex:50}}>
                    <TileLayer url={basemaps['positron']}/>
                </Pane>

                <Pane name='country-boundary' style={{zIndex:100}}>
                    <GeoJSON
                        data={countryBoundary}
                        style={countryStyle}
                        ref={refCountry}
                        />
                </Pane>

                <Pane name='overlay' style={{zIndex:300}}>
                    <GeoJSON
                        data={countryBoundary}
                        style={overlayStyle}
                        ref={refOverlay}
                        onEachFeature={onEachCountry}
                        />
                </Pane>

                <Pane name='country-tally' style={{zIndex:200}}>
                    {countryTally}
                </Pane>

                <ZoomPanel/>
                {theLegend}
                <Info/>

            </MapContainer>
        </div>
    )
}
