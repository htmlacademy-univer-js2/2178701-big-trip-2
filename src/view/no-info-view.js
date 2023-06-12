import AbstractView from '../framework/view/abstract-view.js';


const createNoInfoTemplate = () => (
  `<p class="trip-events__msg">
    Sorry, we have a problem ¯\\_(ツ)_/¯
  </p>`);

export default class NoInfoView extends AbstractView {

  get template() {
    return createNoInfoTemplate();
  }
}
