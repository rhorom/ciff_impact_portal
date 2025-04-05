import { onlyUnique } from './utils';
import boundary from './data/boundary.json'
import table from './data/impact_table.json';

//const icons = import.meta.glob("./../public/icon-*")
const countryList = boundary.features.map((item) => {return item.properties.Country}).filter(onlyUnique);
const evalIDs = table.map((item) => {return item.EvaluationID});

export const columns = {
    'country':'Country', 'sector':'Sector', 'type':'Type', 'funder':'Funder', 'yearsOfInvestment':'Years of Investment'}

export const regionList = boundary.features.filter((item) => {return item.properties.Level === 'ADM_1'}).map((item) => {return {'Country':item.properties.Country, 'Region':item.properties.Region}})
export const homepage = 'localhost:5173'
export const shortContent = ['Country', 'Sector', 'Type', 'Primary Outcome', 'Implementing Agency', 'Evaluation Agency', 'Funder']
export const midContent = ['Sector', 'Type', 'Funder']
export const longContent = ['Programme Description', 'Study Design', 'Areas of Programme', 'Impact Statement']
export const fields = {
    'evaluationID':{'title':'EvaluationID', 'type':'text', 'info':'Should be unique number', 'default':1+Math.max(...evalIDs)}, 
    'investmentName':{'title':'Investment Name', 'type':'text', 'info':'', 'default':''}, 
    'publicTitle':{'title':'Proposed Public Title', 'type':'text', 'info':'', 'default':''}, 
    'image':{'title':'Image', 'type':'text', 'info':'Relative path to the image', 'default':'./image-sample.png'}, 
    'status':{'title':'Status', 'type':'select', 'options':['On-going','Completed'], 'info':'', 'default':'On-going'},  
    'funder':{'title':'Funder', 'type':'select', 'options':['CIFF','Implementing Organisation','CIFF + Implementing Organisation', 'CIFF + Other Funder'], 'info':'', 'default':''}, 
    'country':{'title':'Country', 'type':'country', 'options':countryList, 'info':'Press CTRL to select multiple countries', 'default':''}, 
    'subRegion':{'title':'Region', 'type':'skip', 'info':'Press CTRL to select multiple regions', 'default':''},
    'coord':{'title':'Coordinate', 'type':'text', 'info':'Format: [[39.259,-6.826], [Lon,Lat], ...]', 'default':''}, 
    'sector':{'title':'Sector', 'type':'select', 'options':['Girl Captial', 'Nutrition', 'Maternal and Newborn Health', 'WASH'], 'info':'', 'default':''}, 
    'primaryOutcomes':{'title':'Primary Outcomes', 'type':'text', 'info':'Separated by commas', 'default':''}, 
    'type':{'title':'Type', 'type':'select', 'options':['Formative evaluation', 'Process evaluation', 'Outcome Evaluation', 'Impact evaluation', 'Summative evaluation', 'Sustainability evaluation or assessment', 'Cost effectiveness & value for money studies', 'Discrete research or learning project', 'Data & Performance Management', 'Data Quality Assessment'], 'info':'', 'default':''},
    'implementingAgency':{'title':'Implementing Agency', 'type':'text', 'info':'', 'default':''}, 
    'evaluationAgency':{'title':'Evaluation Agency', 'type':'text', 'info':'', 'default':''}, 
    'yearsOfInvestment':{'title':'Years of Investment', 'type':'years', 'info':'', 'default':''}, 
    'investmentAmount':{'title':'Investment Amount', 'type':'text', 'info':'', 'default':''}, 
    'studyDesign':{'title':'Study Design', 'type':'rte', 'info':'', 'default':''}, 
    'programmeDescription':{'title':'Programme Description', 'type':'rte', 'info':'', 'default':''}, 
    'areasOfProgramme':{'title':'Areas of Programme', 'type':'rte', 'info':'', 'default':''}, 
    'impactStatement':{'title':'Impact Statement', 'type':'rte', 'info':'', 'default':''}, 
    'link':{'title':'Link to Publication', 'type':'text', 'info':'Link to data/publication', 'default':''},
}

export const palette = {
    'ciffPink':'#e90051',
    'ciffBlue':'#189cac',
    'ciffGold':'#ffbd00',
    'ciffPurple':'#7646ad',
    'warmPink':'#e9546e',
    'dustyPink':'#ffe6ea',
    'lightPink':'#ffb3bb',
    'offBlack':'#2b2b2b',
    'darkGray':'#8d8d8d',
    'coolGrey':'#cfcccc',
    'warmGray':'#e8e5e3',
    'lightGray':'#f0f0f0'
};

export const iconMapper = {
    'Agriculture': './icon-agriculture.png',
    'Maternal Health': './icon-maternal.png',
    'NTDs': './icon-ntds.png',
    'Newborn Health': './icon-newborn.png',
    'Nutrition': './icon-nutrition.png',
    'Performance Management': './icon-management.png',
    'WASH': './icon-wash.png',
    'Girl Capital': './icon-management.png',
    'Maternal and Newborn Health': './icon-newborn.png'
}

export const basemaps = {
    'esri-gray': 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    'esri-imagery': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    'esri-ocean': 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    'positron': 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    'label': 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
}

export const inactiveStyle = {
    weight: 0,
    color: '#fff',
    fillOpacity: 0,
    fillColor: palette['darkGray'],
    zIndex: 200,
    active: 'false'
}

export const activeStyle = {
    weight: 1,
    color: palette['ciffPink'],
    opacity: 1,
    fillOpacity: 0.5,
    fillColor: palette['ciffPink'],
    zIndex: 300,
    active: 'yes'
}

export const regionStyle = {
    weight: 1,
    color: palette['ciffPink'],
    opacity: 1,
    fillOpacity: 1,
    fillColor: palette['ciffGold'],
    zIndex: 800,
}

export const pointStyle = {
    radius: 3,
    weight: 1,
    color: palette['offBlack'],
    opacity: 1,
    fillOpacity: 1,
    fillColor: palette['offBlack'],
}