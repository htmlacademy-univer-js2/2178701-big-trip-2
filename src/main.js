import { render } from './framework/render.js';
import MenuView from './view/menu.js';
import NewPointButtonView from './view/new-point-btn.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import PointsApiService from './api-service/points-api-service.js';
import DestinationsApiService from './api-service/destinations-api-service.js';
import OffersApiService from './api-service/offers-api-service.js';
import { AUTHORIZATION, END_POINT } from './api-service/const-api.js';


const menuContainer = document.querySelector('.trip-controls__navigation');
const headerContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');

render(new MenuView, menuContainer);

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);
const tripPresenter = new BoardPresenter({container: tripContainer}, pointsModel, destinationsModel, offersModel, filterModel);
const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

filterPresenter.init();
tripPresenter.init();
offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      render(newPointButtonComponent, headerContainer);
      newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
    });
  });
});

