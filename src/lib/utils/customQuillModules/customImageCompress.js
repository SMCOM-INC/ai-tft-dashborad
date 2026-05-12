import registerCustomImageBlot from '@/lib/utils/customQuillModules/imageBlot.js';

export default class CustomImageCompress {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;

    registerCustomImageBlot(this.quill);

    // Defer the setup to ensure all modules are initialized
    setTimeout(() => this.setup(), 0);
  }

  setup() {
    const uploaderModule = this.quill.getModule('customImageUploader');

    if (
      uploaderModule &&
      uploaderModule.options &&
      uploaderModule.options.upload
    ) {
      // Store the original uploader function
      this.originalUpload = uploaderModule.options.upload;

      // Override the upload function
      uploaderModule.options.upload = this.compressAndUpload.bind(this);

      // Override the uploadImage method
      uploaderModule.uploadImage = this.uploadImage.bind(this);

      // Override the handleDrop and handlePaste methods
      uploaderModule.handleDrop = this.handleDrop.bind(this);
      uploaderModule.handlePaste = this.handlePaste.bind(this);
    } else {
      console.warn(
        'CustomImageUploader module not found or not properly configured',
      );
    }
  }

  async compressAndUpload(file) {
    const compressedFile = await this.compressImage(file);
    return this.originalUpload(compressedFile);
  }

  uploadImage(file) {
    const uploadCallback = this.originalUpload;
    if (uploadCallback) {
      this.compressAndUpload(file)
        .then((imageUrl) => {
          this.insertImage(imageUrl);
        })
        .catch((error) => {
          console.error('Image upload failed:', error);
        });
    }
  }

  insertImage(data) {
    const range = this.quill.getSelection();
    const index = range ? range.index : 0;

    // Default image blot
    // this.quill.insertEmbed(range.index, 'image', data.url, 'user');

    // Custom image blot
    this.quill.insertEmbed(
      index,
      'customImage',
      {
        url: data.url,
        uuid: data.uuid,
      },
      'user',
    );

    // Move the cursor after the inserted image
    this.quill.setSelection(index + 1);
  }

  handleDrop(event) {
    event.preventDefault();
    if (
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files.length
    ) {
      this.uploadImage(event.dataTransfer.files[0]);
    }
  }

  handlePaste(event) {
    if (
      event.clipboardData &&
      event.clipboardData.items &&
      event.clipboardData.items.length
    ) {
      const item = event.clipboardData.items[0];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        event.preventDefault();
        setTimeout(() => {
          this.uploadImage(file);
        }, 0);
      }
    }
  }

  compressImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const { maxWidth, maxHeight, quality } = this.options;
          let { width } = img;
          let { height } = img;

          if (width > height) {
            if (width > maxWidth) {
              height = height * (maxWidth / width);
              width = maxWidth;
            }
          } else if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          // Set white background for JPEGs, transparent for PNGs
          if (file.type === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          } else {
            // For PNGs, ensure the canvas is cleared and transparency is preserved
            ctx.clearRect(0, 0, width, height);
          }

          const mimeType = file.type;

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(
                new File([blob], file.name, {
                  type: mimeType,
                  lastModified: Date.now(),
                }),
              );
            },
            mimeType,
            quality,
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
}
