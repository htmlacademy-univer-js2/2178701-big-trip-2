import dayjs from 'dayjs';
import { FilterType } from '../const.js';

const isPointDateFuture = (dateFrom) => dayjs().diff(dateFrom, 'minute') <= 0;
const isPointDatePast = (dateTo) => dayjs().diff(dateTo, 'minute') > 0;
const isPointDateFuturePast = (dateFrom, dateTo) => dayjs().diff(dateFrom, 'minute') > 0 && dayjs().diff(dateTo, 'minute') < 0;

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointDateFuture(point.dateFrom) || isPointDateFuturePast(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointDatePast(point.dateTo) || isPointDateFuturePast(point.dateFrom, point.dateTo)),
};

export { filter };
