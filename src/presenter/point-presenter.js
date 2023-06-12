import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point.js';
import EditPointView from '../view/edit-point.js';
import { Mode, UpdateType, UserAction } from '../const.js';


export default class PointPresenter{
  #pointListContainer = null;
  #pointViewComponent = null;
  #editingPointComponent = null;
  #destinationsModel = null;
  #offersModel = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.PREVIEW
  #isNewPoint = false;

  constructor(pointListContainer, destinationsModel, offersModel, changeData, changeMode){
    this.#pointListContainer = pointListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(point) {
    this.#point = point;
    this.#destinations = this.#destinationsModel.destinations;
    this.#offers = this.#offersModel.offers;

    const previewPointViewComponent = this.#pointViewComponent;
    const previewEditingPointComponent =  this.#editingPointComponent;

    this.#pointViewComponent = new PointView(point, this.#destinations, this.#offers);
    this.#editingPointComponent = new EditPointView({point: point, destinations: this.#destinations, offers: this.#offers, isNewPoint: this.#isNewPoint});

    this.#pointViewComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointViewComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editingPointComponent.setPreviewClickHandler(this.#handlePreviewClick);
    this.#editingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editingPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (previewPointViewComponent === null || previewEditingPointComponent === null) {
      render(this.#pointViewComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.PREVIEW) {
      replace(this.#pointViewComponent, previewPointViewComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#pointViewComponent, previewEditingPointComponent);
      this.#mode = Mode.PREVIEW;
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

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editingPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editingPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.PREVIEW) {
      this.#pointViewComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editingPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#editingPointComponent.shake(resetFormState);
  };


  #replaceEditFormToPoint = () => {
    replace(this.#pointViewComponent, this.#editingPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.PREVIEW;
  };

  #replacePointToEditForm = () => {
    replace(this.#editingPointComponent, this.#pointViewComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleEditClick = () => {
    this.#replacePointToEditForm();
  };

  #handlePreviewClick = () => {
    this.resetView();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

}
