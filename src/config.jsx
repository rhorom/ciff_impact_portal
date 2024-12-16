//const icons = import.meta.glob("./../public/icon-*")

export const columns = {
    'country':'Country', 'sector':'Sector', 'population':'Target Population', 
    'outcome':'Primary Outcome', 'status':'Status', 'evaluator':'Evaluator'}

export const homepage = 'localhost:5173'
export const badgeContent = ['Years of Investment', 'Status']
export const shortContent = ['Country', 'Sector', 'Target Population', 'Primary Outcome', 'Implementing Agency', 'Evaluation Agency']
export const midContent = ['Sector', 'Target Population', 'Primary Outcome']
export const longContent = ['Programme Description', 'Study Design', 'Areas of Programme', 'Impact Statement']

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
    'WASH': './icon-wash.png'
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