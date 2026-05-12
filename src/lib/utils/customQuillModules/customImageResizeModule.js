import { Quill } from '@vueup/vue-quill';

import DisplaySize from '@/lib/utils/customQuillModules/displaySize.js';
import Resize from '@/lib/utils/customQuillModules/resize.js';

export default class CustomImageResize {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = options;
    this.modules = options.modules || [
      'DisplaySize',
      'Toolbar',
      'Resize',
      'Delete',
    ];
    this.overlay = null;
    this.img = null;
    this.handleClick = this.handleClick.bind(this);
    this.quill.root.addEventListener('click', this.handleClick, false);
    this.parchment = Quill.import('parchment');
  }

  handleClick(evt) {
    if (evt.target && evt.target.tagName === 'IMG') {
      if (this.img === evt.target) {
        return;
      }
      if (this.img) {
        this.hide();
      }
      this.show(evt.target);
    } else if (this.img) {
      this.hide();
    }
  }

  show(img) {
    this.img = img;
    this.showOverlay();
    this.initializeModules();
  }

  showOverlay() {
    if (this.overlay) {
      this.hideOverlay();
    }
    this.quill.setSelection(null);
    this.setUserSelect('none');
    this.overlay = document.createElement('div');
    Object.assign(
      this.overlay.style,
      this.options.overlayStyles || {
        position: 'absolute',
        boxSizing: 'border-box',
        border: '1px dashed #444',
      },
    );
    this.quill.root.parentNode.appendChild(this.overlay);
    this.repositionElements();
  }

  hide() {
    this.hideOverlay();
    this.removeModules();
    if (this.deleteButton) {
      this.deleteButton.removeEventListener('click', this.deleteImage);
      this.deleteButton = null;
    }
    this.img = null;
  }

  hideOverlay() {
    if (!this.overlay) {
      return;
    }
    const parent = this.quill.root.parentNode;
    if (parent && parent.contains(this.overlay)) {
      parent.removeChild(this.overlay);
    }
    this.overlay = null;
    this.setUserSelect('');
  }

  repositionElements() {
    if (!this.overlay || !this.img) {
      return;
    }
    const parent = this.quill.root.parentNode;
    const imgRect = this.img.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
    });
  }

  setUserSelect(value) {
    ['userSelect', 'mozUserSelect', 'webkitUserSelect', 'msUserSelect'].forEach(
      (prop) => {
        this.quill.root.style[prop] = value;
        document.documentElement.style[prop] = value;
      },
    );
  }

  initializeModules() {
    this.removeModules();
    this.modules.forEach((moduleName) => {
      this.addModule(moduleName);
    });
  }

  removeModules() {
    this.modules.forEach((moduleName) => {
      if (this[moduleName]) {
        if (typeof this[moduleName].onDestroy === 'function') {
          this[moduleName].onDestroy();
        }
        delete this[moduleName];
      }
    });
  }

  addModule(name) {
    if (name === 'Delete') {
      this.addDeleteButton();
    } else {
      const ModuleClass = CustomImageResize[name];
      if (ModuleClass) {
        this[name] = new ModuleClass(this);
        if (typeof this[name].onCreate === 'function') {
          this[name].onCreate();
        }
        if (typeof this[name].onUpdate !== 'function') {
          this[name].onUpdate = () => {};
        }
      }
    }
  }

  addDeleteButton() {
    this.deleteButton = document.createElement('div');
    this.deleteButton.className = 'ql-image-delete-button';
    this.deleteButton.innerHTML = 'X';
    this.deleteButton.addEventListener('click', this.deleteImage.bind(this));

    Object.assign(this.deleteButton.style, {
      position: 'absolute',
      top: '-12px',
      right: '-12px',
      backgroundColor: 'white',
      color: 'black',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: 'bold',
      border: '1px solid #ccc',
      zIndex: '1000',
    });

    this.overlay.appendChild(this.deleteButton);
  }

  deleteImage() {
    if (this.img) {
      const uuid = this.img.getAttribute('data-uuid');
      const blot = this.parchment.find(this.img);
      if (blot) {
        const index = this.quill.getIndex(blot);
        this.quill.deleteText(index, 1);

        if (this.options.deleteImage) {
          this.options.deleteImage(this.img.src, uuid);
        }
      }
      this.hide();
    }
  }

  onUpdate() {
    this.repositionElements();
    this.modules.forEach((moduleName) => {
      if (this[moduleName] && typeof this[moduleName].onUpdate === 'function') {
        this[moduleName].onUpdate();
      }
    });
  }
}

CustomImageResize.DisplaySize = DisplaySize;
CustomImageResize.Resize = Resize;
