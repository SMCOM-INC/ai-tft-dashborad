import { computed, ref, watch } from 'vue';

const useExcelUploader = ({
  mutationAsyncFunction,
  mutationData,
  isMutationPending,
  isMutationSuccess,
  isMutationError,
  mutationError,
}) => {
  const loadedFile = ref(undefined);
  const errorText = ref(undefined);
  const errorCode = ref(undefined);
  const errorData = ref(undefined);
  const successCount = ref(undefined);

  const isBefore = computed(
    () =>
      loadedFile.value === undefined &&
      errorText.value === undefined &&
      !isMutationPending.value &&
      !isMutationSuccess.value,
  );
  const isError = computed(
    () => loadedFile.value !== undefined && errorText.value !== undefined,
  );
  const isUploading = computed(
    () => isMutationPending.value && !isMutationSuccess.value,
  );
  const isSuccess = computed(
    () =>
      !!loadedFile.value &&
      !errorText.value &&
      !isMutationPending.value &&
      isMutationSuccess.value,
  );

  const handleFile = async (event) => {
    const file = event.target.files[0];
    const MAXIMUM_FILE_SIZE = 5 * 1024 * 1024;
    const EXCEL_EXTENSIONS = ['xls', 'xlsx', 'xlsm', 'xlsb'];

    const isExcelFile = (filename) => {
      return EXCEL_EXTENSIONS.some((ext) =>
        filename.toLowerCase().endsWith(`.${ext}`),
      );
    };

    if (!file) return;

    // 업로드 중, 에러시 파일 정보 표기를 위한 변수
    loadedFile.value = file;

    // 파일 크기 체크 (5MB)
    if (loadedFile.value.size > MAXIMUM_FILE_SIZE) {
      errorText.value = '파일 크기는 5MB를 초과할 수 없습니다.';
      return;
    }

    // 확장자 체크
    if (!isExcelFile(loadedFile.value.name)) {
      errorText.value = 'Excel 파일만 업로드 가능합니다.';
      return;
    }

    await mutationAsyncFunction({ file });
  };

  const deleteFile = () => {
    loadedFile.value = undefined;
    errorText.value = undefined;
  };

  watch(isMutationError, (newValue) => {
    if (!newValue) return;

    const error = mutationError.value?.data?.error;
    errorCode.value = error.errorCode;
    errorText.value = error.message;

    const { data } = error;
    if (!data) return;

    switch (errorCode.value) {
      case 'EXCEL_MANDATORY_FIELD_EMPTY':
        if (data.includes('2행')) {
          errorText.value =
            '업로드 된 참여자가 0명입니다. 엑셀에 참여자 정보를 입력해주세요.';
        } else {
          errorText.value = '빈 행이 있습니다. 확인해주세요.';
          errorData.value = data;
        }

        break;
      case 'DUPLICATE_EXCEL_PHONE':
        errorData.value = [...new Set(data)].join(', ');
        break;
      default:
        break;
    }
  });

  watch(isMutationSuccess, (newValue) => {
    if (!newValue) {
      return;
    }

    successCount.value = mutationData.value.data.success;
  });

  return {
    loadedFile,
    errorText,
    errorData,
    successCount,
    isBefore,
    isError,
    isUploading,
    isSuccess,
    handleFile,
    deleteFile,
  };
};

export default useExcelUploader;
