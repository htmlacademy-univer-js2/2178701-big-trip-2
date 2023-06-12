import dayjs from 'dayjs';

const PointTypes = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant'
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const Mode = {
  PREVIEW: 'preview',
  EDITING: 'editing',
};

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const BLANK_POINT = {
  basePrice: 100,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: PointTypes.TAXI,
};

export { UserAction, UpdateType, FilterType, SortType, Mode, NoPointsTextType, BLANK_POINT, PointTypes};
