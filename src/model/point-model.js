import { points } from '../mock/point';
import { destinations } from '../mock/destinations';
import { offersByType } from '../mock/offers';

export default class PointModel {
  constructor() {
    this.points = points;
    this.destinations = destinations;
    this.offersByType = offersByType;
  }

  GetPoints() {
    return this.points;
  }

  GetDestinations() {
    return this.destinations;
  }

  GetOffersByType() {
    return this.offersByType;
  }
}
