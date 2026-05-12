export default class DisplaySize {
  constructor(resizer) {
    this.resizer = resizer;
    this.overlay = resizer.overlay;
    this.img = resizer.img;
    this.options = resizer.options;
    this.requestUpdate = () => resizer.onUpdate();
  }

  onCreate() {
    this.display = document.createElement('div');
    Object.assign(
      this.display.style,
      this.options.displayStyles || {
        position: 'absolute',
        font: '12px/1.0 Arial, Helvetica, sans-serif',
        padding: '4px 8px',
        textAlign: 'center',
        backgroundColor: 'white',
        color: '#333',
        border: '1px solid #777',
        boxSizing: 'border-box',
        opacity: '0.80',
        cursor: 'default',
      },
    );
    this.overlay.appendChild(this.display);
  }

  onDestroy() {
    if (this.display) {
      this.overlay.removeChild(this.display);
    }
  }

  onUpdate() {
    if (this.display && this.img) {
      const size = this.getCurrentSize();
      this.display.innerHTML = size.join(' &times; ');
      if (size[0] > 120 && size[1] > 30) {
        Object.assign(this.display.style, {
          right: '4px',
          bottom: '4px',
          left: 'auto',
        });
      } else if (this.img.style.float === 'right') {
        const displayRect = this.display.getBoundingClientRect();
        Object.assign(this.display.style, {
          right: 'auto',
          bottom: `-${displayRect.height + 4}px`,
          left: `-${displayRect.width + 4}px`,
        });
      } else {
        const displayRect = this.display.getBoundingClientRect();
        Object.assign(this.display.style, {
          right: `-${displayRect.width + 4}px`,
          bottom: `-${displayRect.height + 4}px`,
          left: 'auto',
        });
      }
    }
  }

  getCurrentSize() {
    return [
      this.img.width,
      Math.round(
        (this.img.width / this.img.naturalWidth) * this.img.naturalHeight,
      ),
    ];
  }
}
