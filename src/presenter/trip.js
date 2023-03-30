import { render, RenderPosition } from '../render.js';
import SortView from '../view/sort.js';
import ListPointsView from '../view/list-points.js';
import PointView from '../view/point.js';
import NewPointView from '../view/new-point.js';
import EditPointView from '../view/edit-point.js';
import PointModel from '../model/point-model.js';

export default class Trip {
  #component = null;
  #container = null;
  #pointModel = null;

  #renderPoint = (point) => {
    const pointView = new PointView(point, this.#pointModel.destinations, this.#pointModel.offersByType);
    const editPointView = new EditPointView(point, this.#pointModel.destinations, this.#pointModel.offersByType);

    const replacePointToEditForm = () => {
      this.#component.element.replaceChild(editPointView.element, pointView.element);
    };

    const replaceEditFormToPoint = () => {
      this.#component.element.replaceChild(pointView.element, editPointView.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointView.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointView.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointView.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointView, this.#component.element);
  }


  constructor({container}){
    this.#component = new ListPointsView();
    this.#container = container;
    this.#pointModel = new PointModel();
  }

  init() {
    const points = this.#pointModel.points;
    const destinations = this.#pointModel.destinations;
    const offersByType = this.#pointModel.offersByType;
    render(new SortView(), this.#container, RenderPosition.BEFOREEND);
    render (this.#component, this.#container);
    for (const point of this.#pointModel.points){
      this.#renderPoint(point);
    }
  }
}
