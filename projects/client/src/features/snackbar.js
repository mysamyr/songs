import { Snackbar as SnackbarComponent } from '../components';

class Snackbar {
  constructor() {
    this.timer = null;
    this.component = null;
    this.messages = [];
    this.TIME_TO_HIDE = 300 * 1000;
  }

  _startTimer() {
    this.timer = setTimeout(() => this._closeHandler(), this.TIME_TO_HIDE);
  }

  _clearTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  _showMessage(msg) {
    const component = SnackbarComponent({
      msg,
      onClose: () => this._closeHandler(),
    });

    component.addEventListener('mouseleave', () => this._startTimer());
    component.addEventListener('mouseenter', () => this._clearTimer());
    component.addEventListener('touchend', () => this._startTimer());
    component.addEventListener('touchstart', () => this._clearTimer());

    this._startTimer();
    document.body.appendChild(component);
    this.component = component;
  }

  _closeHandler() {
    this.messages.shift();
    this.component.remove();
    this.component = null;
    this._clearTimer();

    if (this.messages.length) {
      this._showMessage(this.messages[0]);
    }
  }

  displayMsg(msg) {
    this.messages.push(msg);
    if (!this.component) {
      this._showMessage(msg);
    }
  }
}

export default new Snackbar();
