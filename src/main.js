import { render } from './framework/render.js';
import MenuView from './view/menu.js';
import NewPointButtonView from './view/new-point-btn.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';
import { getPoints, getDestinations, getOffersByType } from './mock/point.js';

const menuContainer = document.querySelector('.trip-controls__navigation');
const headerContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
render(new MenuView, menuContainer);
const points = getPoints();
const offersByType = getOffersByType();
const destinations = getDestinations();
const pointsModel = new PointsModel();
pointsModel.init(points, destinations, offersByType);
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);
filterPresenter.init();
const tripPresenter = new BoardPresenter({container: tripContainer}, pointsModel, filterModel);
tripPresenter.init();
const newPointButtonComponent = new NewPointButtonView();
const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};
const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};
render(newPointButtonComponent, headerContainer);
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);

