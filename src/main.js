import { render } from './framework/render.js';
import FilterView from './view/filter.js';
import MenuView from './view/menu.js';
import Trip from './presenter/trip.js';
import PointModel from './model/point-model.js';
import { generateFilter } from './mock/filter.js';

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
render(new MenuView, menuContainer);
const pointsModel = new PointModel();
const filters = generateFilter(pointsModel.points);
render(new FilterView(filters), filterContainer);
const tripPresenter = new Trip({container: tripContainer}, pointsModel);
tripPresenter.init();

