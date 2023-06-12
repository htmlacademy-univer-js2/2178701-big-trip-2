import dayjs from 'dayjs';
const DATE_TIME_FORMAT = 'DD/MM/YY hh:mm';
const TIME_FORMAT = 'hh:mm';
const TOTAL_DAY_MINUTES_COUNT = 1440;
const HOUR_MINUTES_COUNT = 60;
const DATE_FORMAT = 'YYYY-MM-DD';
const getZeroInDuration = (value) =>{
  if (value < 10){
    return `0${value}`;
  } else {
    return `${value}`;
  }
};
const getDateTime = (date) => dayjs(date).format(DATE_TIME_FORMAT);
const humanizePointDueDate = (date) => dayjs(date).format('DD MMM');
const getTime = (date) => dayjs(date).format(TIME_FORMAT);
const getDate = (date) => dayjs(date).format(DATE_FORMAT);
const getDuration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  const days = Math.floor(difference / TOTAL_DAY_MINUTES_COUNT);
  const restHours = Math.floor((difference - days * TOTAL_DAY_MINUTES_COUNT) / HOUR_MINUTES_COUNT);
  const restMinutes = difference - (days * TOTAL_DAY_MINUTES_COUNT + restHours * HOUR_MINUTES_COUNT);

  const daysOutput = (days) ? `${getZeroInDuration(days)}D` : '';
  const hoursOutput = (restHours) ? `${getZeroInDuration(restHours)}H` : '';
  const minutesOutput = (restMinutes) ? `${getZeroInDuration(restMinutes)}M` : '';


  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
};

const sortPricePoint = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const sortDayPoint = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortTimePoint = (pointA, pointB) => {
  const timePointA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timePointB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return timePointB - timePointA;
};

const capitalizedString = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export {getDateTime, humanizePointDueDate, getTime, getDate, getDuration, sortPricePoint, sortDayPoint, sortTimePoint, capitalizedString};
