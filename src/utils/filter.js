import dayjs from 'dayjs';
const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const checkDatesRelativeToCurrent = (dateFrom, dateTo) => dateFrom.isBefore(dayjs()) && dateTo.isAfter(dayjs());
const isEventPlanned = (dateFrom, dateTo) => dateFrom.isAfter(dayjs()) || checkDatesRelativeToCurrent(dateFrom, dateTo);
const isEventPassed = (dateFrom, dateTo) => dateTo.isBefore(dayjs()) || checkDatesRelativeToCurrent(dateFrom, dateTo);

export const filter = {
  [FILTER_TYPES.EVERYTHING]: (points) => points.map((point) => point),
  [FILTER_TYPES.FUTURE]: (points) => points.filter((point) => isEventPlanned(dayjs(point.dateFrom), dayjs(point.dateTo))),
  [FILTER_TYPES.PAST]: (points) => points.filter((point) => isEventPassed(dayjs(point.dateFrom), dayjs(point.dateTo)))
};
