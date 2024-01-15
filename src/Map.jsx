import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { MapContainer, GeoJSON, Marker, CircleMarker, Popup, Pane, TileLayer, useMap } from 'react-leaflet'
import { Badge } from 'react-bootstrap'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import 'primeicons/primeicons.css'

import table from './data/impact_table.json'
import boundary from './data/boundary.json'
import { onlyUnique } from './utils'
import { activeStyle, regionStyle, basemaps } from './config'

//let main_map

const init = {center:[0,10], zoom:4}
let main_map

const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const height = vw < 576 ? '60vh' : '100vh'

export function Map({ data, param, setParam, setting }){
    const DefineMap = () => {
        main_map = useMap();
        main_map.on({'dblclick': function(e){
            window.open('./', '_self')
        }})
    }

    let filteredTable = data
    let countries = []
    let regions = []

    if (param.id) {
        filteredTable = data.filter((item) => item['EvaluationID'] === param.id)[0]
        regions = filteredTable.Region.replace(/'/g, '"')
        if (regions) {regions = JSON.parse(regions)[param.country]}
        
        if (param.multi) {
            countries = filteredTable.Country.split(', ')
        } else {
            countries = [param.country]
        }
    } else if (param.country) {
        countries = [param.country]
    } else {
        countries = []
        data.forEach((item) => countries.push(item.Country.split(', ')))
        countries = countries.flat().filter(onlyUnique)
    }

    const countryBoundary = useMemo(() => {
        if (countries.length > 1 && main_map){
            main_map.setView(init.center, init.zoom, {animate:true, duration:0.5})
        }
        return (
            boundary.features.filter((item) => {
                let selected = item.properties.Level === 'ADM_0'
                selected = selected && (countries.includes(item.properties.Country))
                return selected;
            })
        )
    }, [countries])

    const regionBoundary = boundary.features.filter((item) => {
        let selected = item.properties.Level === 'ADM_1'
        selected = selected && (regions.includes(item.properties.Region))
        return selected;
    })        

    let points = {}
    let coords = [];
    if (param.id && filteredTable['Coord'] !== ''){
        points = JSON.parse(filteredTable['Coord'].replace(/'/g, '"'));
        Object.keys(points).forEach((key) => {
            if (key === param.country){
                coords = points[key];
            }
        })
    }
    
    const refCountry = useRef()
    useEffect(() => {
        if (refCountry.current) {
            refCountry.current.clearLayers()
            refCountry.current.addData(countryBoundary)
        }
    }, [refCountry, countryBoundary])

    const refRegion = useRef()
    useEffect(() => {
        if (refRegion.current) {
            refRegion.current.clearLayers()
            refRegion.current.addData(regionBoundary)
        }
    }, [refRegion, regionBoundary])

    const refPoint = useRef()
    useEffect(() => {
        if (refPoint.current) {
            refPoint.current.clearLayers()
            refPoint.current.addData(points)
        }
    }, [refPoint, points])

    function selectCountry(val) {
        let par = {...param}
        par['country'] = val
        par['id'] = ''
        par['multi'] = false
        countries = [val]
        setParam(par, {replace:false})
    }
    
    function zoomFit(bounds) {
        main_map.fitBounds(bounds)
    }

    let countryTally = {}
    data.forEach((row) => {
        const arr = row.CountryID.split(', ');
        arr.forEach((key) => {
            countryTally[key] = countryTally[key] ? countryTally[key] + 1 : 1
        })
    })

    const countryMarker = (regionBoundary.length > 0) ? (<></>) :
    (<> {countryBoundary.map((row, i) => {
        const count = countryTally[row.properties.CountryID];
        const icon = L.divIcon({
            html: '<span><div class="cmarker">'+count+'</div></span>',
            className: ''
        })
        return <Marker 
            position={[row.properties.Lat, row.properties.Lon]}
            icon={icon}
            key={i}
        />
    })}</>);
    
    function onEachCountry(feature, layer) {
        layer.on({
            mouseover: function(e){
                layer.setStyle({weight:4})

                if (!setting.showLabel) {
                    const prop = e.target.feature.properties
                    const content = `<div><Badge>
                        ${prop.Country}
                        </Badge></div>`
                    layer.bindTooltip(content)
                    layer.openTooltip()    
                }
            },
            mouseout: function(e){
                layer.setStyle({weight:1})
                layer.closeTooltip()
            },
            click: function(e){
                layer.setStyle({weight:3})
                zoomFit(e.target._bounds)
                selectCountry(e.target.feature.properties.Country)
            }
        })
    }

    function onEachRegion (feature, layer) {
        layer.bindTooltip(feature.properties.Region).addTo(main_map)
        layer.openTooltip()
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
                doubleClickZoom={false}
                id='map-container'
                style={{width:'100vw', height:height}}
            >

                <DefineMap />

                <Pane name='basemap' style={{zIndex:60}}>
                    <TileLayer url={basemaps[setting.basemap]}/>
                </Pane>

                <Pane name='country' style={{zIndex:70}}>
                    <GeoJSON
                        data={countryBoundary}
                        style={activeStyle}
                        ref={refCountry}
                        onEachFeature={onEachCountry}
                        />
                </Pane>

                <Pane name='marker' style={{zIndex:300}}>
                    {countryMarker}

                    <GeoJSON
                        data={regionBoundary}
                        style={regionStyle}
                        ref={refRegion}
                        onEachFeature={onEachRegion}
                    /> 
                </Pane>

                <Pane name='points' style={{zIndex:500}}>
                    {(coords.length > 0) ? (coords.map((c,i) => (
                        <CircleMarker
                            key={i} 
                            center={[c[1],c[0]]} 
                            radius={3}
                            color='#000'
                            opacity={0.9}
                            fillOpacity={0.9}
                            />))) : <></>}

                </Pane>

                {setting.showLabel ? <TileLayer url={basemaps['label']} zIndex={700}/> : <></>}

            </MapContainer>
        </div>
    )
}
