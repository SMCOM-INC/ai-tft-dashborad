export default function registerCustomImageBlot(quill) {
  if (!quill || typeof quill.constructor !== 'function') {
    console.error('Quill instance is not properly initialized or available');
    return;
  }

  const Quill = quill.constructor;
  const ImageBlot = Quill.import('formats/image');

  class CustomImageBlot extends ImageBlot {
    static create(value) {
      const node = super.create(value);
      if (typeof value === 'object') {
        node.setAttribute('src', value.url);
        node.setAttribute('data-uuid', value.uuid);
      }
      return node;
    }

    static value(node) {
      return {
        url: node.getAttribute('src'),
        uuid: node.getAttribute('data-uuid'),
      };
    }
  }

  CustomImageBlot.blotName = 'customImage';
  CustomImageBlot.tagName = 'IMG';

  Quill.register(CustomImageBlot);
}
