import _ from 'lodash';
import { computed, ref } from 'vue';

import { BOARD_EDITOR_CONTENT_TYPE } from '@/constants/board.js';
import usePostBoardFile from '@/lib/queries/board/usePostBoardFile.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import swalWarningModal from '@/lib/swalModal/swalWarningModal.js';
import formatFileSize from '@/lib/utils/formatFileSize.js';

// 파일 업로드 관련 상수 정의
const MAX_FILES = 5; // 최대 파일 개수
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 최대 파일 크기 (10MB)
const ALLOWED_EXTENSIONS = [
  // 허용되는 파일 확장자 목록
  'jpg',
  'jpeg',
  'png',
  'gif',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'zip',
  'rar',
];

/**
 * 파일 업로드 기능을 제공하는 컴포저블
 * @param {number} maxFiles - 최대 허용 파일 개수 (기본값: 5)
 * @param {string[]} allowedExtensions - 허용할 파일 확장자 목록 (기본값: ALLOWED_EXTENSIONS)
 * @returns {Object} 파일 업로드 관련 상태와 메서드들
 */
export function useFileUpload(
  maxFiles = MAX_FILES,
  allowedExtensions = ALLOWED_EXTENSIONS,
) {
  // ============================================
  // 1. 반응형 상태 정의
  // ============================================

  // 새로 선택한 파일들의 정보 (이름, 크기, UUID 등)
  const selectedFilesRef = ref([]);

  // 기존에 업로드된 파일들 (수정 모드에서 사용)
  const existingFilesRef = ref([]);

  // 업로드 중인 파일들의 상태
  const uploadingFilesRef = ref([]);

  // 파일 업로드 훅
  const { postBoardFileMutationAsync, isBoardFilePending } = usePostBoardFile();

  // ============================================
  // 2. 계산된 속성 (computed)
  // ============================================

  // 전체 파일 개수 (새 파일 + 기존 파일)
  const totalFileCount = computed(
    () => selectedFilesRef.value.length + existingFilesRef.value.length,
  );

  // 추가로 파일을 더 선택할 수 있는지 여부
  const canAddMoreFiles = computed(() => totalFileCount.value < maxFiles);

  // 남은 파일 업로드 가능 개수
  const remainingFileSlots = computed(() =>
    Math.max(0, maxFiles - totalFileCount.value),
  );

  // ============================================
  // 3. 파일 유효성 검사 함수들
  // ============================================

  /**
   * 파일 확장자 검증
   * @param {string} fileName - 파일명
   * @returns {boolean} 허용된 확장자인지 여부
   */
  const validateFileExtension = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension && allowedExtensions.includes(extension);
  };

  /**
   * 파일 크기 검증
   * @param {number} fileSize - 파일 크기 (bytes)
   * @returns {boolean} 허용된 크기인지 여부
   */
  const validateFileSize = (fileSize) => {
    return fileSize <= MAX_FILE_SIZE;
  };

  /**
   * 중복 파일 확인
   * @param {File} file - 확인할 파일
   * @returns {boolean} 중복 여부
   */
  const isDuplicateFile = (file) => {
    return selectedFilesRef.value.some(
      (existingFile) =>
        existingFile.name === file.name &&
        existingFile.originalSize === file.size,
    );
  };

  // ============================================
  // 4. 파일 선택 처리
  // ============================================

  /**
   * 파일 선택 이벤트 핸들러
   * - input[type="file"]의 change 이벤트에서 호출
   * - 선택된 파일들을 검증하고 유효한 파일만 즉시 업로드
   * @param {Event} event - 파일 선택 이벤트
   */
  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    // 파일 개수 제한 확인
    if (totalFileCount.value + files.length > maxFiles) {
      swalWarningModal({
        title: '파일 개수 초과',
        text: `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다. (현재: ${totalFileCount.value}개)`,
      });
      event.target.value = ''; // input 초기화
      return;
    }

    // 각 파일에 대해 유효성 검사 수행
    const validationResults = files.map((file) => {
      // 유효성 검사 결과 객체 생성
      const result = { file, isValid: true, reason: null };

      // 1. 중복 파일 확인
      if (isDuplicateFile(file)) {
        result.isValid = false;
        result.reason = '이미 추가된 파일입니다.';
        return result;
      }

      // 2. 파일 확장자 확인
      if (!validateFileExtension(file.name)) {
        result.isValid = false;
        result.reason = `지원하지 않는 파일 형식입니다. (허용: ${allowedExtensions.join(', ')})`;
        return result;
      }

      // 3. 파일 크기 확인
      if (!validateFileSize(file.size)) {
        result.isValid = false;
        result.reason = `파일 크기가 ${formatFileSize(MAX_FILE_SIZE)}를 초과합니다.`;
        return result;
      }

      return result;
    });

    // lodash partition을 사용하여 유효한 파일과 무효한 파일 분리
    const [validResults, invalidResults] = _.partition(
      validationResults,
      'isValid',
    );

    // 무효한 파일이 있으면 에러 메시지 표시
    if (invalidResults.length > 0) {
      const errorMessage = invalidResults
        .map(({ file, reason }) => `• ${file.name} : ${reason}`)
        .join('\n');

      swalErrorModal({
        title: '파일 업로드 오류',
        html: `다음 파일들을 업로드할 수 없습니다: <br/> <br/> ${errorMessage}`,
      });
    }

    // 유효한 파일들을 즉시 업로드
    const uploadPromises = _.map(validResults, async ({ file }) => {
      try {
        // 업로드 중 상태 추가
        uploadingFilesRef.value.push(file.name);

        // 파일 업로드 API 호출
        const response = await postBoardFileMutationAsync({
          editorDomain: BOARD_EDITOR_CONTENT_TYPE.APARTMENT_NOTICE,
          file,
        });

        // 업로드 성공 시 파일 정보 저장
        if (response.data?.success) {
          selectedFilesRef.value.push({
            name: file.name,
            size: formatFileSize(file.size),
            originalSize: file.size,
            type: file.type,
            uuid: response.data.success.uuid,
            url: response.data.success.url,
            file, // 원본 File 객체 (FormData 전송용)
          });
        }
      } catch (error) {
        swalErrorModal({
          title: '업로드 실패',
          text: `${file.name} 파일 업로드에 실패했습니다.`,
        });
      } finally {
        // 업로드 중 상태 제거
        const index = uploadingFilesRef.value.indexOf(file.name);
        if (index > -1) {
          uploadingFilesRef.value.splice(index, 1);
        }
      }
    });

    // 모든 업로드를 병렬로 처리
    await Promise.all(uploadPromises);

    // 입력 필드 초기화 (같은 파일 재선택 가능하도록)
    event.target.value = '';
  };

  // ============================================
  // 5. 파일 제거 처리
  // ============================================

  /**
   * 새로 선택한 파일 제거
   * @param {number} index - 제거할 파일의 인덱스
   */
  const handleRemoveNewFile = (index) => {
    if (index >= 0 && index < selectedFilesRef.value.length) {
      selectedFilesRef.value.splice(index, 1);
    }
  };

  /**
   * 기존 파일 삭제 (수정 모드)
   * - UI에서만 제거 (실제 삭제는 allFileUuids에 포함되지 않으면 서버에서 처리)
   * @param {string} fileUuid - 삭제할 파일의 UUID
   */
  const handleDeleteExistingFile = (fileUuid) => {
    if (!fileUuid) return;

    const fileIndex = existingFilesRef.value.findIndex(
      (file) => file.fileUuid === fileUuid,
    );

    if (fileIndex !== -1) {
      // UI에서만 제거
      existingFilesRef.value.splice(fileIndex, 1);
    }
  };

  // ============================================
  // 6. 유틸리티 함수들
  // ============================================

  /**
   * 기존 파일 목록 설정 (수정 모드에서 사용)
   * @param {Array} files - 기존 파일 목록
   */
  const setExistingFiles = (files) => {
    if (Array.isArray(files)) {
      existingFilesRef.value = [...files];
    }
  };

  /**
   * 모든 파일 관련 상태 초기화
   */
  const resetFiles = () => {
    selectedFilesRef.value = [];
    existingFilesRef.value = [];
  };

  /**
   * 파일 유효성 검사 관련 정보 요약
   * @returns {Object} 파일 제한 정보
   */
  const getFileValidationSummary = () => ({
    maxFiles, // 최대 파일 개수
    maxFileSize: MAX_FILE_SIZE, // 최대 파일 크기 (bytes)
    maxFileSizeFormatted: formatFileSize(MAX_FILE_SIZE), // 포맷된 크기 (예: "10MB")
    allowedExtensions: ALLOWED_EXTENSIONS, // 허용 확장자 목록
    currentFileCount: totalFileCount.value, // 현재 파일 개수
    remainingSlots: remainingFileSlots.value, // 남은 슬롯
    canAddMore: canAddMoreFiles.value, // 추가 가능 여부
  });

  // ============================================
  // 7. 외부로 노출할 인터페이스
  // ============================================
  return {
    // 반응형 참조
    selectedFilesRef,
    existingFilesRef,
    uploadingFilesRef,

    // 계산된 속성
    totalFileCount,
    canAddMoreFiles,
    remainingFileSlots,

    // 현재 모든 파일의 UUID 배열 (새 파일 + 기존 파일)
    allFileUuids: computed(() => {
      const newFileUuids = selectedFilesRef.value
        .map((file) => file.uuid)
        .filter(Boolean);

      const existingFileUuids = existingFilesRef.value
        .map((file) => file.fileUuid)
        .filter((uuid) => uuid && !uuid.startsWith('existing-file-')); // 임시 UUID 제외

      return [...newFileUuids, ...existingFileUuids];
    }),

    // 현재 모든 파일의 File 객체 배열 (FormData 전송용)
    allFileObjects: computed(() => {
      return selectedFilesRef.value.map((file) => file.file).filter(Boolean);
    }),

    // 업로드 상태
    isBoardFilePending,

    // 메서드
    handleFileChange,
    handleRemoveNewFile,
    handleDeleteExistingFile,
    setExistingFiles,
    resetFiles,
    getFileValidationSummary,

    // 외부에서 사용할 수 있는 유효성 검사 메서드
    validateFileExtension,
    validateFileSize,
    isDuplicateFile,
  };
}
