import { bbox } from '@turf/bbox'
import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as JSURL from 'jsurl';

export function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

export function countOccurrence(arr, sort=false) {
  let counts = {}
  for (const a of arr) {
    counts[a] = counts[a] ? counts[a] + 1 : 1;
  }

  if (sort){
    const sorted = Object.keys(counts).sort(function(a,b){return counts[a]-counts[b]})
    let sortedCounts = {}
    sorted.forEach((s) => {sortedCounts[s] = counts[s]})
    return sortedCounts
  } else {
    return counts
  }
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

export function getBbox(gj){
  let totalBbox = [ 180., 90., -180., -90. ]
  gj.forEach((g) => {
      const b = bbox(g)
      totalBbox[0] = Math.min(totalBbox[0], b[0])
      totalBbox[1] = Math.min(totalBbox[1], b[1])
      totalBbox[2] = Math.max(totalBbox[2], b[2])
      totalBbox[3] = Math.max(totalBbox[3], b[3])
  })

  return [[totalBbox[1],totalBbox[0]], [totalBbox[3],totalBbox[2]]]
}

export function getImageUrl(name) {
  return new URL(name, import.meta.url).href
}

export function useQueryParam(key) {
    let [searchParams, setSearchParams] = useSearchParams();
    let paramValue = searchParams.get(key);
    let value = useMemo(() => JSURL.parse(paramValue), [paramValue]);
    
    let setValue = useCallback(
      (newValue, options) => {
        let newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(key, JSURL.stringify(newValue));
        setSearchParams(newSearchParams, options);
      },
      [key, searchParams, setSearchParams]
    );
  
    return [value, setValue];
}
