import { render, replace } from '../framework/render.js';
import SortView from '../view/sort.js';
import ListPointsView from '../view/list-points.js';
import PointView from '../view/point.js';
import NoPointView from '../view/no-point.js';
import EditPointView from '../view/edit-point.js';

export default class Trip {
  #component = null;
  #container = null;
  #pointModel = null;

  #renderPoint = (point) => {
    const pointView = new PointView(point, this.#pointModel.destinations, this.#pointModel.offersByType);
    const editPointView = new EditPointView(point, this.#pointModel.destinations, this.#pointModel.offersByType);

    const replacePointToEditForm = () => {
      replace(editPointView, pointView);
    };

    const replaceEditFormToPoint = () => {
      replace(pointView, editPointView);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointView.setEditClickHandler(() => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    editPointView.setPreviewClickHandler(() => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    editPointView.setFormSubmitHandler(() => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointView, this.#component.element);
  }


  constructor({container}, pointsModel){
    this.#component = new ListPointsView();
    this.#container = container;
    this.#pointModel = pointsModel;
  }

  init() {
    const points = this.#pointModel.points;
    if (points.length === 0){
      render(new NoPointView(), this.#container);
    }
    else{
      render(new SortView(), this.#container);
      render (this.#component, this.#container);
      for (const point of this.#pointModel.points){
        this.#renderPoint(point);
      }
    }

  }
}
