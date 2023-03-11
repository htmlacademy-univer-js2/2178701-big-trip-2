import { render, RenderPosition } from '../render.js';
import SortView from '../view/sort.js';
import ListPointsView from '../view/list-points.js';
import PointView from '../view/point.js';
import NewPointView from '../view/new-point.js';
import EditPointView from '../view/edit-point.js';

export default class Trip {
  constructor({container}){
    this.component = new ListPointsView();
    this.container = container;
  }

  init() {
    render(new SortView, this.container, RenderPosition.BEFOREEND);
    render (this.component, this.container);
    render (new NewPointView, this.component.getElement(), RenderPosition.BEFOREEND);
    render (new EditPointView, this.component.getElement(), RenderPosition.BEFOREEND);

    for (let i = 0; i < 3; i++){
      render (new PointView, this.component.getElement(), RenderPosition.BEFOREEND);
    }
  }
}
