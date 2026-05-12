export default class CustomImageUploader {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    // Bind methods
    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    // Add event listeners
    this.quill.root.addEventListener('drop', this.handleDrop, false);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
    this.quill.on('text-change', this.handleDelete);

    // Add custom button to toolbar if specified
    if (options.addCustomButton) {
      this.addCustomButton();
    }
  }

  // 순차적 파일 처리
  processFilesSequentially(files) {
    // 현재 커서 위치 저장
    const range = this.quill.getSelection() || { index: 0, length: 0 };
    let insertIndex = range.index;

    // 파일 처리 결과를 저장할 배열
    const promises = [];
    const results = new Array(files.length);

    // 모든 파일 업로드 시작 (병렬 처리)
    files.forEach((file, index) => {
      const promise = this.options
        .upload(file)
        .then((result) => {
          // 결과를 원래 순서에 맞게 저장
          results[index] = result;
          return result;
        })
        .catch((error) => {
          console.error(`Error uploading file at index ${index}:`, error);
          // 에러 발생 시에도 결과 배열의 구조 유지
          results[index] = null;
          return null;
        });

      promises.push(promise);
    });

    // 모든 업로드가 완료되면 결과를 순서대로 처리
    Promise.all(promises)
      .then(() => {
        // null이 아닌 결과만 필터링 (업로드 실패한 파일 제외)
        const successfulResults = results.filter((result) => result !== null);

        // 순서대로 이미지 삽입
        successfulResults.forEach((result) => {
          this.quill.insertEmbed(
            insertIndex,
            'customImage',
            {
              url: result.url,
              uuid: result.uuid || null, // uuid가 없는 경우 null로 설정
            },
            'user',
          );
          insertIndex++; // 다음 이미지를 위해 커서 위치 업데이트
        });

        // 마지막으로 커서 위치 설정
        this.quill.setSelection(insertIndex, 0);
      })
      .catch((error) => {
        console.error('Error processing files sequentially:', error);
      });
  }

  // 파일 추가
  addCustomButton() {
    const toolbar = this.quill.getModule('toolbar');
    toolbar.addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');

      // acceptedExtensions 옵션이 있으면 해당 확장자만 허용
      const extensions = this.options.acceptedExtensions;
      if (extensions && extensions.length > 0) {
        const acceptValue = extensions.map((ext) => `.${ext}`).join(',');
        input.setAttribute('accept', acceptValue);
      } else {
        input.setAttribute('accept', 'image/*');
      }

      input.setAttribute('multiple', 'true');
      input.click();
      input.onchange = () => {
        const files = Array.from(input.files);

        if (files.length > 0) {
          this.processFilesSequentially(files);
        }
      };
    });
  }

  handleDrop(event) {
    event.preventDefault();
    if (
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files.length
    ) {
      this.range = this.quill.getSelection();
      let files = Array.from(event.dataTransfer.files);

      // acceptedExtensions 옵션이 있으면 해당 확장자만 허용
      const extensions = this.options.acceptedExtensions;
      if (extensions && extensions.length > 0) {
        files = files.filter((file) => {
          const ext = file.name.split('.').pop().toLowerCase();
          return extensions.includes(ext);
        });
      }

      if (files.length > 0) {
        this.processFilesSequentially(files);
      }
    }
  }

  handlePaste(event) {
    const clipboard = event.clipboardData || window.clipboardData;

    // IE 11 is .files other browsers are .items
    if (clipboard && (clipboard.items || clipboard.files)) {
      const items = clipboard.items || clipboard.files;

      // acceptedExtensions 옵션이 있으면 해당 확장자만 허용
      const extensions = this.options.acceptedExtensions;
      let imageMimeRegex;
      if (extensions && extensions.length > 0) {
        const pattern = extensions
          .map((ext) => ext.replace('jpg', 'jpe?g'))
          .join('|');
        imageMimeRegex = new RegExp(`^image\\/(${pattern})$`, 'i');
      } else {
        imageMimeRegex = /^image\/(jpe?g|gif|png)$/i;
      }

      for (let i = 0; i < items.length; i++) {
        if (imageMimeRegex.test(items[i].type)) {
          const file = items[i].getAsFile ? items[i].getAsFile() : items[i];

          if (file) {
            this.quill.focus();
            this.range = this.quill.getSelection();
            event.preventDefault();
            setTimeout(() => {
              this.quill.focus();
              this.range = this.quill.getSelection();
              this.readAndUploadFile(file);
            }, 0);
          }
        }
      }
    }
  }

  handleDelete(delta, oldContents, source) {
    if (source === 'user' && delta.ops) {
      delta.ops.forEach((op) => {
        if (op.delete && oldContents) {
          const deletedContent = oldContents.ops.slice(op.delete * -1);
          deletedContent.forEach((content) => {
            if (content.insert && content.insert.image) {
              this.deleteImage(content.insert.image);
            }
          });
        }
      });
    }
  }

  deleteImage(imageUrl) {
    const deleteCallback = this.options.delete;
    if (deleteCallback) {
      deleteCallback(imageUrl).catch((error) => {
        console.error('Image deletion failed:', error);
      });
    }
  }
}
