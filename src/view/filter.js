import AbstractView from '../framework/view/abstract-view.js';

const createEventFilterTemplate = ({ name }, isChecked) =>
  `<div class="trip-filters__filter">\
      <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" 
        type="radio" name="trip-filter" value="${name}" {${isChecked ? 'checked' : ''}>\
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>\
    </div>`;

const createFilterTemplate = (items) => {
  const events = items.reduce((result, filter, index) => result.concat(createEventFilterTemplate(filter, index === 0)), '');
  return (
    `<form class="trip-filters" action="#" method="get">
    ${events}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};


export default class FilterView extends AbstractView{
  #filters = null;

  constructor(filters){
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
