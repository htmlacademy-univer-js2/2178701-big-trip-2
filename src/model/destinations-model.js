import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  #destinations = [];

  constructor(destinationsApiService) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  init = async () => {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  };

  get destinations() {
    return this.#destinations;
  }
}
