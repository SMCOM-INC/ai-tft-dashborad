import { ref } from 'vue';

import { usePostBoardFile } from '@/lib/queries/board/usePostBoardFile.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import validatorFiles from '@/lib/utils/validatorFiles.js';

export const useCommentImageUpload = (editorDomain) => {
  const uploadedImage = ref(null);
  const { postBoardFileMutationAsync, isPending: isUploading } =
    usePostBoardFile();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 유효성 검사
    const validatedFiles = validatorFiles({
      inputFiles: [file],
      currentFiles: [],
      config: {
        maxCount: 1,
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/'],
      },
    });

    if (validatedFiles.validFiles.length === 0) {
      swalErrorModal({
        text: '유효하지 않은 이미지 파일입니다. (최대 10MB, 이미지 파일만 가능)',
      });
      return;
    }

    try {
      const response = await postBoardFileMutationAsync({
        editorDomain,
        file,
      });

      uploadedImage.value = {
        fileUuid: response.data.success.uuid,
        url: response.data.success.url,
        fileName: response.data.success.fileName,
      };

      // input 초기화
      event.target.value = '';
    } catch (error) {
      swalErrorModal({
        text: '이미지 업로드에 실패했습니다.',
      });
    }
  };

  const removeImage = () => {
    uploadedImage.value = null;
  };

  const setImage = (image) => {
    uploadedImage.value = image;
  };

  return {
    uploadedImage,
    isUploading,
    handleFileChange,
    removeImage,
    setImage,
  };
};
