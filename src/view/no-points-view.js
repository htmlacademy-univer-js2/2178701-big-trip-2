import AbstractView from '../framework/view/abstract-view.js';
import { NoPointsTextType } from '../const.js';

const createNoPointTemplate = (filterType) => (
  `<p class="trip-events__msg">
  ${NoPointsTextType[filterType]}</p>`
);

export default class NoPointsView extends AbstractView {
  #filterType = null;

  constructor(filterType){
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
