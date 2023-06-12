import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDueDate } from '../utils/point.js';

const getPointsInRoute = (points) => {
  const pointsInRoute = [points[0].destination];
  for (let i = 1; i < points.length; i++) {
    if (points[i].destination !== points[i-1].destination) {
      pointsInRoute.push(points[i].destination);
    }
  }
  return pointsInRoute;
};

const renderRoute = (points, destinations) => {
  const pointsInRoute = getPointsInRoute(points);
  const startPoint = destinations.find((item) => item.id === pointsInRoute[0]);
  const endPoint = destinations.find((item) => item.id === pointsInRoute[pointsInRoute.length - 1]);
  if (pointsInRoute.length > 3) {
    return `${startPoint.name} — ... — ${endPoint.name}`;
  }
  return pointsInRoute.map((destination) => `${destinations.find((item) => item.id === destination).name}`).join(' — ');
};

const renderDates = (points) => {
  const startDate = humanizePointDueDate(points[0].dateFrom);
  const endDate = humanizePointDueDate(points[points.length - 1].dateTo);
  return `${startDate} — ${endDate}`;
};

const getOffersPrice = (point, offers) => {
  let offersPrice = 0;
  const offersByType = offers.find((offer) => offer.type === point.type);
  point.offers.forEach((offer) => {
    offersPrice += offersByType.offers.find((item) => item.id === offer).price;
  });
  return offersPrice;
};

const renderTotalPrice = (points, offers) => {
  let price = 0;
  points.forEach((point) => {
    price += point.basePrice;
    price += getOffersPrice(point, offers);
  });
  return `Total: € <span class="trip-info__cost-value">${price}</span>`;
};

const createRouteInfoTemplate = (points, destinations, offers) => {
  let result = '';
  if (destinations.length === 0 || offers.length === 0){
    return result;
  }
  result = `${result}
  <div class="trip-info"><div class="trip-info__main">
    <h1 class="trip-info__title">${ points.length === 0 ? '' : renderRoute(points, destinations)}</h1>
    <p class="trip-info__dates">${ points.length === 0 ? '' : renderDates(points)}</p>
  </div>
  <p class="trip-info__cost">
    ${points.length === 0 || offers.length === 0 ? '' : renderTotalPrice(points, offers)}
  </p>
  </div>`;
  return result;
};

export default class RouteInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor(points, destinations, offers) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template () {
    return createRouteInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
