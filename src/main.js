import { render } from './framework/render.js';
import FilterView from './view/filter.js';
import MenuView from './view/menu.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import { getPoints, getDestinations, getOffersByType } from './mock/point.js';
import { generateFilter } from './mock/filter.js';

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
render(new MenuView, menuContainer);
const points = getPoints();
const offersByType = getOffersByType();
const destinations = getDestinations();
const pointsModel = new PointsModel();
pointsModel.init(points, destinations, offersByType);
const filters = generateFilter(pointsModel.points);
render(new FilterView(filters), filterContainer);
const tripPresenter = new BoardPresenter({container: tripContainer}, pointsModel);
tripPresenter.init();

