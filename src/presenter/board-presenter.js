import { render, RenderPosition } from '../framework/render.js';
import SortingView from '../view/sort.js';
import ListPointsView from '../view/list-points.js';
import NoPointView from '../view/no-point.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortPricePoint, sortDayPoint, sortTimePoint } from '../utils/point.js';

export default class BoardPresenter {
  #listPointsComponent = new ListPointsView();
  #container = null;
  #pointsModel = null;
  #noPointComponent = new NoPointView();
  #sortPointComponent = new SortingView();
  #pointPresenter = new Map();
  #boardPoints = null;
  #currentSortType = null;
  #sourcedBoardPoints = [];

  constructor({container}, pointsModel){
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];

    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    const points = this.#pointsModel.points;
    if (points.length === 0){
      this.#renderNoPointView();
    }
    else{
      this.#renderSort();
      this.#renderPointsList();
    }
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints.sort(sortDayPoint);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortTimePoint);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPricePoint);
        break;
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType){
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointsList();
  };

  #renderSort = () => {
    this.#boardPoints.sort(sortDayPoint);
    render(this.#sortPointComponent, this.#container, RenderPosition.AFTERBEGIN);
    this.#sortPointComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

  }

  #renderNoPointView = () => {
    render(this.#noPointComponent, this.#container);
  }


  #renderPointsList = () => {
    render (this.#listPointsComponent, this.#container);
    this.#renderPoints();
  }

  #renderPoints = () => {
    for (const point of this.#boardPoints){
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
