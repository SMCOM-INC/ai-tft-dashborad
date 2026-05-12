export default class Resize {
  constructor(resizer) {
    this.resizer = resizer;
    this.currentImg = null;
    this.handles = [];
  }

  onCreate() {
    this.createHandles();
  }

  onDestroy() {
    this.removeHandles();
  }

  createHandles() {
    const handlePositions = [
      { left: '0%', top: '0%', cursor: 'nw-resize' },
      { left: '100%', top: '0%', cursor: 'ne-resize' },
      { left: '100%', top: '100%', cursor: 'se-resize' },
      { left: '0%', top: '100%', cursor: 'sw-resize' },
    ];

    handlePositions.forEach((pos) => {
      const handle = document.createElement('div');
      Object.assign(handle.style, {
        position: 'absolute',
        height: '12px',
        width: '12px',
        backgroundColor: 'white',
        border: '1px solid #777',
        boxSizing: 'border-box',
        opacity: '0.80',
        cursor: pos.cursor,
        left: pos.left,
        top: pos.top,
        transform: 'translate(-50%, -50%)',
      });
      handle.addEventListener('mousedown', this.handleMousedown.bind(this));
      this.handles.push(handle);
      this.resizer.overlay.appendChild(handle);
    });
  }

  removeHandles() {
    this.handles.forEach((handle) => {
      handle.removeEventListener('mousedown', this.handleMousedown);
      if (this.resizer.overlay && this.resizer.overlay.contains(handle)) {
        this.resizer.overlay.removeChild(handle);
      }
    });
    this.handles = [];
  }

  handleMousedown(event) {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = this.resizer.img.width;
    const startHeight = this.resizer.img.height;

    const mousemove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newWidth = startWidth + deltaX;
      const newHeight = startHeight + deltaY;

      this.resizer.img.width = newWidth;
      this.resizer.img.height = newHeight;
      this.resizer.onUpdate();
    };

    const mouseup = () => {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
    };

    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
  }
}
