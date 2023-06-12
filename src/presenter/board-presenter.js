import { render, remove } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortingView from '../view/sort-view.js';
import ListPointsView from '../view/list-points-view.js';
import NoPointsView from '../view/no-points-view.js';
import LoadingView from '../view/loading-view.js';
import NoInfoView from '../view/no-info-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import RouteInfoPresenter from './route-info-presenter.js';
import { SortType, UpdateType, UserAction, FilterType} from '../const.js';
import { TimeLimit } from '../api-service/const-api-service.js';
import { sorting } from '../utils/sorting.js';
import { filter } from '../utils/filter.js';


export default class BoardPresenter {
  #listPointsComponent = new ListPointsView();
  #container = null;
  #routeInfoContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #noPointsComponent = null;
  #sortPointsComponent = null;
  #pointPresenter = new Map();
  #routeInfoPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #newPointPresenter = null;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #noInfoComponent = new NoInfoView();

  constructor(container, routeInfoContainer, pointsModel, destinationsModel, offersModel, filterModel){
    this.#container = container;
    this.#routeInfoContainer = routeInfoContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter(this.#listPointsComponent.element, this.#handleViewAction, this.#destinationsModel, this.#offersModel);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = filter[this.#filterType](this.#pointsModel.points);
    sorting[this.#currentSortType](points);
    return points;
  }

  init() {
    this.#renderBoard();
  }

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
      render(this.#listPointsComponent, this.#container);
    }
    this.#newPointPresenter.init(callback);
  };

  #renderRouteInfo = () => {
    this.#routeInfoPresenter = new RouteInfoPresenter(this.#routeInfoContainer, this.#destinationsModel, this.#offersModel);
    const sortedPoints = sorting[SortType.DAY](this.points);
    this.#routeInfoPresenter.init(sortedPoints);
  };

  #clearRouteInfo = () => {
    this.#routeInfoPresenter.destroy();
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#container);
  };

  #renderSort = () => {
    this.#sortPointsComponent = new SortingView(this.#currentSortType);
    this.#sortPointsComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortPointsComponent, this.#container);
  }

  #renderNoPointsView = () => {
    this.#noPointsComponent = new NoPointsView(this.#filterType);
    render(this.#noPointsComponent, this.#container);
  }


  #renderPointsList = () => {
    render (this.#listPointsComponent, this.#container);
    this.#renderPoints();
  }

  #renderPoints = () => {
    for (const point of this.points){
      this.#renderPoint(point);
    }
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listPointsComponent.element, this.#destinationsModel, this.#offersModel, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortPointsComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderNoInfo = () => {
    render(this.#noInfoComponent, this.#container);
  };

  #renderBoard = () => {
    if (this.#isLoading){
      this.#renderLoading();
      return;
    }
    const pointsCount = this.points.length;

    if (pointsCount === 0 && this.#offersModel.offers.length !== 0 && this.#destinationsModel.destinations.length !== 0) {
      this.#renderNoPointsView();
      return;
    }
    if (pointsCount === 0 || this.#offersModel.offers.length === 0 || this.#destinationsModel.destinations.length === 0) {
      this.#renderNoInfo();
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#clearRouteInfo();
        this.#renderRouteInfo();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        remove(this.#noPointsComponent);
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#renderRouteInfo();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType){
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

}
