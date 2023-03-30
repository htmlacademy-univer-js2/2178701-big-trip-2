import { points } from '../mock/point';
import { destinations } from '../mock/destinations';
import { offersByType } from '../mock/offers';

export default class PointModel {
  #points = null;
  #destinations = null;
  #offersByType = null;

  constructor() {
    this.#points = points;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offersByType() {
    return this.#offersByType;
  }
}
