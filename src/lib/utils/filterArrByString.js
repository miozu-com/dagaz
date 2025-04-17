import {any, includes, filter, path} from 'ramda';

export const filterArrByString = (propPath, arr) =>
 filter(item => any(string => includes(string, path(propPath, item)), arr));
