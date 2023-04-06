import { filter } from '../util.js';

export const generateFilter = (points) => Object.entries(filter).map(
  ([filterName, filteredPoints]) => ({
    name: filterName,
    count: filteredPoints(points).length,
  }),
);
