import { render } from '../framework/render.js';
import SortView from '../view/sort.js';
import ListPointsView from '../view/list-points.js';
import NoPointView from '../view/no-point.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../util.js';

export default class BoardPresenter {
  #listPointsComponent = new ListPointsView();
  #container = null;
  #pointsModel = null;
  #noPointComponent = new NoPointView();
  #sortPointComponent = new SortView();
  #pointPresenter = new Map();
  #boardPoints = null;

  constructor({container}, pointsModel){
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];

    const points = this.#pointsModel.points;
    if (points.length === 0){
      this.#renderNoPointView();
    }
    else{
      this.#renderSortView();
      this.#renderPointsList();
    }
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderNoPointView = () => {
    render(this.#noPointComponent, this.#container);
  }

  #renderSortView = () => {
    render(this.#sortPointComponent, this.#container);
  }

  #renderPointsList = () => {
    render (this.#listPointsComponent, this.#container);
    this.#renderPoints();
  }

  #renderPoints = () => {
    for (const point of this.#pointsModel.points){
      this.#renderPoint(point);
    }
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listPointsComponent.element, this.#pointsModel, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

}
