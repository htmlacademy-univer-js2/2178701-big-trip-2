import { render } from './framework/render.js';
import FilterView from './view/filter.js';
import MenuView from './view/menu.js';
import Trip from './presenter/trip.js';

const menuContainer = document.querySelector('.trip-controls__navigation');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripPresenter = new Trip({container: tripContainer});
render(new FilterView, filterContainer);
render(new MenuView, menuContainer);
tripPresenter.init();
