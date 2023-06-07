import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point.js';
import EditPointView from '../view/edit-point.js';

const Mode = {
  PREVIEW: 'preview',
  EDITING: 'editing',
};

export default class PointPresenter{
  #pointListContainer = null;
  #pointViewComponent = null;
  #editingPointComponent = null;
  #pointsModel = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.PREVIEW


  constructor(pointListContainer, pointsModel, changeData, changeMode){
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(point) {
    this.#point = point;
    this.#destinations = this.#pointsModel.destinations;
    this.#offers = this.#pointsModel.offers;

    const previewPointViewComponent = this.#pointViewComponent;
    const previewEditingPointComponent =  this.#editingPointComponent;

    this.#pointViewComponent = new PointView(point, this.#destinations, this.#offers);
    this.#editingPointComponent = new EditPointView(point, this.#destinations, this.#offers);

    this.#pointViewComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointViewComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editingPointComponent.setPreviewClickHandler(this.#handlePreviewClick);
    this.#editingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if (previewPointViewComponent === null || previewEditingPointComponent === null) {
      render(this.#pointViewComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.PREVIEW) {
      replace(this.#pointViewComponent, previewPointViewComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editingPointComponent, previewEditingPointComponent);
    }

    remove(previewPointViewComponent);
    remove(previewEditingPointComponent);

  }

  destroy = () => {
    remove(this.#pointViewComponent);
    remove(this.#editingPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.PREVIEW) {
      this.#editingPointComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  };

  #removeEventListenerByEsc(){
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #addEventListenerByEsc(){
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditFormToPoint = () => {
    replace(this.#pointViewComponent, this.#editingPointComponent);
    this.#removeEventListenerByEsc();
    this.#mode = Mode.PREVIEW;
  };

  #replacePointToEditForm = () => {
    replace(this.#editingPointComponent, this.#pointViewComponent);
    this.#addEventListenerByEsc();
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editingPointComponent.reset(this.#point);
      this.#replaceEditFormToPoint();
      this.#removeEventListenerByEsc();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleEditClick = () => {
    this.#replacePointToEditForm();
  };

  #handlePreviewClick = () => {
    this.#editingPointComponent.reset(this.#point);
    this.#replaceEditFormToPoint();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceEditFormToPoint();
  };

}
