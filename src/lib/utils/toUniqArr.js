import {pipe, defaultTo, uniq, map, flatten, path} from 'ramda';

// Gather all unique items in arrays
// full path would look like [payload.meta.tabs]
export const toUniqArr = (pathArr, dataArr) =>
 pipe(map(pipe(path(pathArr), defaultTo([]))), flatten, uniq)(dataArr);
