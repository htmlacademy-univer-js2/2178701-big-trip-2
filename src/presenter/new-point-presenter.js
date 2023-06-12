import { render, RenderPosition, remove } from '../framework/render.js';
import EditPointView from '../view/edit-point.js';
import { UpdateType, UserAction } from '../const.js';

export default class NewPointPresenter {
  #pointListContainer = null;
  #editingPointComponent = null;
  #changeData = null;
  #destroyCallback = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;
  #isNewPoint = true;

  constructor(pointListContainer, changeData, pointsModel, destinationsModel, offersModel) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editingPointComponent !== null) {
      return;
    }
    this.#destinations = this.#destinationsModel.destinations;
    this.#offers = this.#offersModel.offers;

    this.#editingPointComponent = new EditPointView({
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: this.#isNewPoint
    });
    this.#editingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editingPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#editingPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#editingPointComponent === null) {
      return;
    }
    this.#destroyCallback?.();
    remove(this.#editingPointComponent);
    this.#editingPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#editingPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#editingPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#editingPointComponent.shake(resetFormState);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
