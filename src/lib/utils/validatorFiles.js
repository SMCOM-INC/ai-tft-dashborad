// utils/fileValidator.js

/**
 * 파일 유효성 검사를 위한 설정 객체
 * @typedef {Object} FileValidationConfig
 * @property {number} maxCount - 최대 허용 파일 개수
 * @property {number} maxSize - 최대 허용 파일 크기 (bytes)
 * @property {string[]} allowedTypes - 허용된 파일 타입 배열
 */

/**
 * 파일 유효성 검사 결과
 * @typedef {Object} ValidationResult
 * @property {File[]} validFiles - 유효한 파일 목록
 * @property {string} error - 에러 메시지
 */

/**
 * 파일 유효성 검사 함수
 * @param {FileList|File[]} files - 검사할 파일 목록
 * @param {number} currentFiles - 현재 파일 개수
 * @param {Partial<FileValidationConfig>} config - 검사 설정
 * @returns {ValidationResult} 검사 결과
 */
const validateFiles = ({ inputFiles, currentFiles, config = {} }) => {
  const DEFAULT_CONFIG = {
    maxCount: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/'],
  };

  const settings = { ...DEFAULT_CONFIG, ...config };

  const validFiles = [];
  const result = {
    validFiles: [],
    error: '',
  };

  // 남은 슬롯 계산
  const remainingSlots = settings.maxCount - currentFiles.length;
  if (remainingSlots <= 0) {
    result.error = 'countLimit';
    return result;
  }

  // 처리할 파일 개수
  const filesLengthToProcess = Math.min(inputFiles.length, remainingSlots);

  // 파일 유효성 검사
  for (let i = 0; i < filesLengthToProcess; i++) {
    const file = inputFiles[i];

    // 파일 타입 검사
    const isValidType = settings.allowedTypes.some((type) =>
      file.type.startsWith(type),
    );

    if (!isValidType) {
      result.error = 'fileTypeLimit';
      return result;
    }

    // 파일 크기 검사
    if (file.size > settings.maxSize) {
      result.error = 'sizeLimit';
      return result;
    }

    validFiles.push(file);
  }

  result.validFiles = validFiles;

  return result;
};

export default validateFiles;
