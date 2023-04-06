import { humanizePointDueDate } from '../util';
import { getTime } from '../util';
import { getDate} from '../util';
import { duration } from '../util';
import AbstractView from '../framework/view/abstract-view.js';

const createPointTemplate = (point, destinations, offersByType) => {
  const pointDestinations = destinations.find((dest) => dest.id === point.destination);
  const pointTypeOffers = offersByType.find((offer) => offer.type === point.type).offers;
  const pointOffers = pointTypeOffers.filter((offer) => point.offers.includes(offer.id));
  const startDate = point.dateFrom !== null ? humanizePointDueDate(point.dateFrom) : '';
  const endDate = point.dateTo !== null ? humanizePointDueDate(point.dateTo) : '';
  const eventDuration = duration(point.dateFrom, point.dateTo);
  return(
    `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${getDate(point.dateFrom)}">${startDate}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${point.type} ${pointDestinations.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${point.dateFrom}">${(startDate === endDate) ? getTime(point.dateFrom) : startDate}</time>
        &mdash;
        <time class="event__end-time" datetime="${point.dateTo}">${(startDate === endDate) ? getTime(point.dateTo) : endDate}</time>
      </p>
      <p class="event__duration">${eventDuration}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${pointOffers.map((offer) => (
      `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
      </li>`
    )).join('')}
      
    </ul>
    <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : '' }" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
  </li>`
  );
};

export default class PointView extends AbstractView{
  #element = null;
  #point = null;
  #destinations = null;
  #offersByType = null;

  constructor(point, destinations, offersByType){
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#offersByType);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };
}
