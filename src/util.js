import dayjs from 'dayjs';
const DATE_TIME_FORMAT = 'DD/MM/YY hh:mm';
const TIME_FORMAT = 'hh:mm';
const TOTAL_DAY_MINUTES_COUNT = 1440;
const HOUR_MINUTES_COUNT = 60;
const DATE_FORMAT = 'YYYY-MM-DD';
export const getDateTime = (date) => dayjs(date).format(DATE_TIME_FORMAT);
export const humanizePointDueDate = (date) => dayjs(date).format('DD MMM');
export const getTime = (date) => dayjs(date).format(TIME_FORMAT);
export const getDate = (date) => dayjs(date).format(DATE_FORMAT);
export const duration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  const days = Math.floor(difference / TOTAL_DAY_MINUTES_COUNT);
  const restHours = Math.floor((difference - days * TOTAL_DAY_MINUTES_COUNT) / HOUR_MINUTES_COUNT);
  const restMinutes = difference - (days * TOTAL_DAY_MINUTES_COUNT + restHours * HOUR_MINUTES_COUNT);

  const daysOutput = (days) ? `${days}D` : '';
  const hoursOutput = (restHours) ? `${restHours}H` : '';
  const minutesOutput = (restMinutes) ? `${restMinutes}M` : '';

  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
};
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

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (elements) => {
  const MIN = 0;
  const max = elements.length - 1;
  return elements[getRandomInteger(MIN, max)];
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
