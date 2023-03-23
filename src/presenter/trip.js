import { render, RenderPosition } from '../render.js';
import SortView from '../view/sort.js';
import ListPointsView from '../view/list-points.js';
import PointView from '../view/point.js';
import NewPointView from '../view/new-point.js';
import EditPointView from '../view/edit-point.js';
import PointModel from '../model/point-model.js';

export default class Trip {
  constructor({container}){
    this.component = new ListPointsView();
    this.container = container;
    this.pointModel = new PointModel();
  }

  init() {
    const points = this.pointModel.GetPoints();
    const destinations = this.pointModel.GetDestinations();
    const offersByType = this.pointModel.GetOffersByType();
    render(new SortView(), this.container, RenderPosition.BEFOREEND);
    render (this.component, this.container);
    render (new NewPointView(), this.component.getElement(), RenderPosition.BEFOREEND);
    render (new EditPointView(points[2], destinations, offersByType), this.component.getElement(), RenderPosition.BEFOREEND);

    for (const point of points){
      render(new PointView(point, destinations, offersByType), this.component.getElement());
    }
  }
}
