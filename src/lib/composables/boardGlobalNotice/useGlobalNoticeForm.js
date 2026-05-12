import _ from 'lodash';
import { useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';

import { useFileUpload } from '@/lib/composables/common/useFileUpload.js';
import useGetMasterAptList from '@/lib/queries/apt/useGetMasterAptList.js';
import swalConfirmModal from '@/lib/swalModal/swalConfirmModal.js';
import swalErrorModal from '@/lib/swalModal/swalErrorModal.js';
import decodeUrl from '@/lib/utils/decodeUrl.js';
import {
  globalNoticeFormCreationSchema,
  globalNoticeFormUpdateSchema,
} from '@/schemas/board.js';

export function useGlobalNoticeForm(props, emit) {
  // ============================================
  // 1. 상수 및 초기 상태
  // ============================================
  const MAX_FILES = 5;

  // 전체 아파트 목록 가져오기
  const fetchParams = computed(() => ({
    pageable: {
      page: 0,
      size: 9999,
      sort: '',
      direction: '',
    },
    searchParams: {
      keyword: '',
      contentUuidList: [],
    },
  }));

  const { aptTableList } = useGetMasterAptList(fetchParams);

  const getInitialFormValues = () => ({
    categoryUuid: '',
    title: '',
    content: '',
    apartmantNoticeType: 'RESIDENT_ALL_NOTICE',
    selectedApartments: [],
    selectedServices: [], // 서비스 선택 초기값 추가
    pushFlag: props.mode === 'create' ? true : undefined,
    thumbnailImage: null, // 썸네일 이미지
  });

  // ============================================
  // 2. 반응형 상태 관리
  // ============================================
  const uploadedImageUuids = ref([]); // 에디터에 업로드된 이미지 uuid 리스트

  // ============================================
  // 3. 파일 업로드 설정
  // ============================================
  const {
    selectedFilesRef, // 새로 선택한 파일 목록
    existingFilesRef, // 기존 파일 목록 (수정 모드)
    totalFileCount, // 전체 파일 개수
    uploadingFilesRef, // 업로드 중인 파일들
    isBoardFilePending, // 업로드 중 상태
    allFileUuids, // 현재 모든 파일의 UUID 배열
    handleFileChange, // 파일 선택 핸들러
    handleRemoveNewFile, // 새 파일 제거
    handleDeleteExistingFile, // 기존 파일 삭제
    setExistingFiles, // 기존 파일 설정
  } = useFileUpload(MAX_FILES);

  // ============================================
  // 4. 폼 유효성 검사 설정
  // ============================================
  const validationSchema = computed(() =>
    props.mode === 'create'
      ? globalNoticeFormCreationSchema
      : globalNoticeFormUpdateSchema,
  );

  const {
    errors,
    handleSubmit,
    resetForm,
    validate,
    values,
    // setValues,
  } = useForm({
    validationSchema,
    initialValues: getInitialFormValues(),
  });

  // ============================================
  // 5. 콘텐츠 처리 함수들
  // ============================================

  // 에디터 이미지 업로드 처리
  const handleUploadedImages = (imageUuids) => {
    uploadedImageUuids.value = imageUuids || [];
  };

  const createPayloadFormData = (data) => {
    const payloadData = {
      categoryUuid: data.categoryUuid,
      apartmantNoticeType: data.apartmantNoticeType,
      title: data.title,
      // Delta 객체를 JSON 문자열로 변환
      content: _.isString(data.content)
        ? data.content
        : JSON.stringify(data.content),
    };

    // 썸네일 이미지 처리 - UUID만 전송
    if (_.has(data, 'thumbnailImage.uuid') && data.thumbnailImage.uuid) {
      payloadData.thumbnailFileUuid = data.thumbnailImage.uuid;
    }

    // 파일 업로드 처리 - 현재 모든 파일의 UUID 배열로 전송
    if (!_.isEmpty(allFileUuids.value)) {
      payloadData.uploadFileUuidList = _.clone(allFileUuids.value);
    }

    // 에디터 이미지 UUID 처리 - contentFileUuidList
    if (!_.isEmpty(uploadedImageUuids.value)) {
      payloadData.contentFileUuidList = _.clone(uploadedImageUuids.value);
    }

    // apartmantNoticeType에 따른 처리
    const isAllNotice = data.apartmantNoticeType.includes('ALL_NOTICE');

    if (isAllNotice) {
      // 전체 선택
      // - blackListAptUuidList: 제외할 아파트 단지들
      payloadData.blackListAptUuidList = !_.isEmpty(data.selectedApartments)
        ? _.map(data.selectedApartments, 'aptUuid')
        : [];

      // - contentUuidList: 선택한 서비스들만
      payloadData.contentUuidList = !_.isEmpty(data.selectedServices)
        ? _.clone(data.selectedServices)
        : [];

      // - whiteList는 빈 배열
      payloadData.whiteListAptUuidList = [];
    } else {
      // 개별 선택 (INDIVIDUAL_NOTICE)
      // - whiteListAptUuidList: 포함할 아파트 단지들
      payloadData.whiteListAptUuidList = !_.isEmpty(data.selectedApartments)
        ? _.map(data.selectedApartments, 'aptUuid')
        : [];

      // - blackList는 빈 배열
      payloadData.blackListAptUuidList = [];

      // - contentUuidList는 보내지 않음 (개별 선택 시)
    }

    return payloadData;
  };

  // ============================================
  // 6. 폼 제출 로직
  // ============================================
  const validateBeforeSubmit = async () => {
    // 수정 모드에서 파일 개수 유효성 검사
    if (props.mode === 'edit' && totalFileCount.value > MAX_FILES) {
      swalErrorModal({
        title: '첨부 파일 수 초과',
        text: `첨부된 파일의 총 수가 ${MAX_FILES}개를 초과할 수 없습니다.`,
      });
      return false;
    }

    // 폼 필드 유효성 검사
    const { valid, errors: validationErrors } = await validate();

    if (!valid) {
      const firstError = _.first(_.values(validationErrors));
      swalErrorModal({
        title: '입력 오류',
        text: firstError || '입력값을 확인해주세요.',
      });
      return false;
    }

    return true;
  };

  const showSubmitConfirmation = () => {
    const message =
      props.mode === 'create'
        ? '전체 공지사항을 등록하시겠습니까?'
        : '전체 공지사항을 수정하시겠습니까?';

    return new Promise((resolve) => {
      swalConfirmModal({
        title: message,
        confirmButtonText: props.mode === 'create' ? '등록' : '수정',
        callback: () => resolve(true),
      });
    });
  };

  // 제출 에러 처리 함수
  const handleSubmitError = async (error) => {
    console.error('폼 제출 오류:', error);
    await swalErrorModal({
      title: '오류 발생',
      text: '양식 제출 중 오류가 발생했습니다. 다시 시도해주세요.',
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // 제출 전 유효성 검사
      if (!(await validateBeforeSubmit())) return;

      // 확인 다이얼로그 표시
      if (!(await showSubmitConfirmation())) return;

      // 폼 데이터 처리 및 이벤트 발생
      const submitData = createPayloadFormData(data);

      emit('submit', submitData);
    } catch (error) {
      await handleSubmitError(error);
    }
  });

  // ============================================
  // 7. 계산된 속성들
  // ============================================
  const hasChanges = computed(() => {
    const initialValues = getInitialFormValues();
    const currentFormValues = _.pick(values, _.keys(initialValues));

    const hasFormChanges = !_.isEqual(currentFormValues, initialValues);
    const hasFileChanges = !_.isEmpty(selectedFilesRef.value);

    return hasFormChanges || hasFileChanges;
  });

  // ============================================
  // 8. 초기화 및 데이터 로딩
  // ============================================
  const initializeFormData = async (data) => {
    try {
      // API 응답에서 아파트 선택 정보 변환
      let selectedApartments = [];

      // apartmantNoticeType에 따라 화이트리스트 또는 블랙리스트를 selectedApartments로 설정
      const apartmantNoticeType = _.get(
        data,
        'apartmantNoticeType',
        'RESIDENT_ALL_NOTICE',
      );
      const isAllNotice = apartmantNoticeType.includes('ALL_NOTICE');

      // UUID 배열 가져오기
      let uuidList = [];
      if (isAllNotice) {
        // 전체 선택 모드: blackListAptUuidList
        uuidList = _.get(data, 'blackListAptUuidList', []);
      } else {
        // 개별 선택 모드: whiteListAptUuidList
        uuidList = _.get(data, 'whiteListAptUuidList', []);
      }

      // UUID를 실제 아파트 정보와 매칭
      if (!_.isEmpty(uuidList) && aptTableList.value?.content) {
        selectedApartments = _.compact(
          _.map(uuidList, (aptUuid) => {
            const apartment = _.find(aptTableList.value.content, {
              uuid: aptUuid,
            });
            if (apartment) {
              return {
                aptUuid: apartment.uuid,
                aptName: apartment.name,
                address: apartment.address || '',
              };
            }
            return null;
          }),
        );
      }

      // 서비스 선택 정보 변환
      const selectedServices = _.get(data, 'contentUuidList', []);

      // 썸네일 이미지 처리
      let thumbnailImage = null;
      if (_.get(data, 'thumbnailFilePath')) {
        const thumbnailPath = _.get(data, 'thumbnailFilePath');
        thumbnailImage = {
          url: thumbnailPath, // 전체 URL로 변환
          uuid: '',
          file: null,
        };
      }

      // content 파싱 및 Delta 형식 확인
      const content = _.get(data, 'content', '');

      // 기본 폼 값 설정
      const initialValues = {
        categoryUuid: _.get(data, 'categoryUuid') || '',
        title: decodeUrl(_.get(data, 'title', '')),
        content,
        apartmantNoticeType,
        selectedApartments,
        selectedServices,
        thumbnailImage,
      };
      console.log('[DEBUG] initialValues >> ', initialValues);

      // 기존 파일 설정 (uploadFileList 사용)
      const uploadFileList = _.get(data, 'uploadFileList', []);
      if (!_.isEmpty(uploadFileList)) {
        const processedFiles = _.map(uploadFileList, (file) => ({
          name: decodeUrl(file.fileName),
          fileUrl: file.filePath,
          fileUuid: file.uuid, // 실제 UUID 사용
          fileSize: file.fileSize,
        }));
        setExistingFiles(processedFiles);
      }

      resetForm({ values: initialValues });
      // setValues(initialValues);
    } catch (error) {
      console.error('폼 데이터 초기화 실패:', error);
    }
  };

  // ============================================
  // 9. Watch
  // ============================================

  watch(
    () => props.initialData,
    (newData) => {
      if (!_.isEmpty(newData)) {
        initializeFormData(newData);
      }
    },
    { immediate: true, deep: true },
  );

  // 아파트 목록이 로드된 후 초기 데이터 다시 설정
  watch(
    () => aptTableList.value,
    (newAptList) => {
      if (!_.isEmpty(newAptList?.content) && !_.isNull(props.initialData)) {
        initializeFormData(props.initialData);
      }
    },
    { immediate: true },
  );

  // ============================================
  // 10. 반환 값들
  // ============================================
  return {
    // 폼 상태
    formValuesReactive: values, // useForm의 values를 직접 노출
    // 파일 업로드 상태
    selectedFilesRef,
    existingFilesRef,
    uploadingFilesRef, // 업로드 중인 파일들
    isBoardFilePending, // 업로드 중 상태
    // 이미지 업로드 상태
    uploadedImageUuids, // 에디터에서 emit으로 전달받은 uuid 리스트
    // 폼 유효성 검사
    errors,
    // 이벤트 핸들러
    handleFileChange,
    handleRemoveNewFile,
    handleDeleteExistingFile,
    handleUploadedImages, // GlobalNoticeContentSection에서 emit으로 전달받음
    onSubmit,
    // 계산된 속성들
    hasChanges,
  };
}
