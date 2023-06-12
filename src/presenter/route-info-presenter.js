import { render, remove } from '../framework/render.js';
import RouteInfoView from '../view/route-info-view.js';

export default class RouteInfoPresenter {
  #points = null;
  #routeInfoComponent = null;
  #routeInfoContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;

  constructor(routeInfoContainer, destinationsModel, offersModel) {
    this.#routeInfoContainer = routeInfoContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (points) => {
    this.#points = points;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];
    this.#routeInfoComponent = new RouteInfoView(this.#points, this.#destinations, this.#offers);
    render(this.#routeInfoComponent, this.#routeInfoContainer);
  };

  destroy = () => {
    remove(this.#routeInfoComponent);
  };
}
