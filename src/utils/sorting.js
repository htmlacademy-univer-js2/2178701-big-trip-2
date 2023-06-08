import { sortDayPoint, sortTimePoint, sortPricePoint } from './point';
import { SortType } from '../const';

const sorting = {
  [SortType.DAY]: (points) => points.sort(sortDayPoint),
  [SortType.TIME]: (points) => points.sort(sortTimePoint),
  [SortType.PRICE]: (points) => points.sort(sortPricePoint)
};

export { sorting };
