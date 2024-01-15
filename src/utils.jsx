export function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

export function filterData(data, cols, param){
  return data.filter((row) => {
    let yes = true;
    
    Object.keys(cols).forEach((c) => {
      const included = row[cols[c]].split(', ').includes(param[c]);
      const add = param[c] ? included : true;
      yes = yes && add;
    })
    return yes;
  })
}