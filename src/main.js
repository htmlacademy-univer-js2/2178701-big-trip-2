import { render } from './framework/render.js';
import MenuView from './view/menu-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import PointsApiService from './api-service/points-api-service.js';
import DestinationsApiService from './api-service/destinations-api-service.js';
import OffersApiService from './api-service/offers-api-service.js';
import { AUTHORIZATION, END_POINT } from './api-service/const-api-service.js';

const headerContainer = document.querySelector('.trip-main');
const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const routeInfoContainer = document.querySelector('.trip-main__trip-info');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);
const boardPresenter = new BoardPresenter(tripContainer, routeInfoContainer, pointsModel, destinationsModel, offersModel, filterModel);
const newPointButtonPresenter = new NewPointButtonPresenter(headerContainer, destinationsModel, offersModel, boardPresenter);

render(new MenuView, menuContainer);
newPointButtonPresenter.init();
filterPresenter.init();
boardPresenter.init();
offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      newPointButtonPresenter.renderNewPointButton();
    });
  });
});
