import { filter } from '../utils/filter.js';

export const generateFilter = (points) => Object.entries(filter).map(
  ([filterName, filteredPoints]) => ({
    name: filterName,
    count: filteredPoints(points).length,
  }),
);
