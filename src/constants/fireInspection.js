import { FILTER_ALL } from '@/constants/common.js';

export const FIRE_INSPECTION_TAB_LIST = [
  { name: '세대별 현황 관리', key: 'household' },
  { name: '점검 목록', key: 'list' },
];

// //////////////////////////////////////////
// //////////////// 점검 목록 ////////////////
// //////////////////////////////////////////

export const FIRE_INSPECTION_LIST_TABLE_COLUMNS = [
  { name: '점검 제목', key: 'title' },
  { name: '점검 기간', key: 'period' },
  { name: '진행 상태', key: 'status' },
  { name: '점검 대상 세대', key: 'targetHouseholdCount' },
  { name: '점검률', key: 'submissionRate' },
  { name: '', key: 'action' },
];

// 점검 진행 상태
export const FIRE_INSPECTION_PROGRESS_STATE_KEY = {
  BEFORE_START: 'BEFORE_START',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const FIRE_INSPECTION_PROGRESS_STATE_LABEL = {
  [FIRE_INSPECTION_PROGRESS_STATE_KEY.BEFORE_START]: '시작전',
  [FIRE_INSPECTION_PROGRESS_STATE_KEY.IN_PROGRESS]: '진행중',
  [FIRE_INSPECTION_PROGRESS_STATE_KEY.COMPLETED]: '종료',
};

// //////////////////////////////////////////
// ///////////// 세대별 현황 관리 /////////////
// //////////////////////////////////////////

export const FIRE_INSPECTION_SUBMIT_STATE_KEY = {
  SUBMITTED: 'SUBMITTED',
  NOT_SUBMITTED: 'NOT_SUBMITTED',
};

export const FIRE_INSPECTION_SUBMIT_STATE_LABEL = {
  [FIRE_INSPECTION_SUBMIT_STATE_KEY.SUBMITTED]: '제출완료',
  [FIRE_INSPECTION_SUBMIT_STATE_KEY.NOT_SUBMITTED]: '미제출',
};

export const FIRE_INSPECTION_HOUSEHOLD_SEARCH_INPUT_LIST = [
  { key: 'DONG', label: '동' },
  { key: 'HO', label: '호' },
  { key: 'DONG_HO', label: '동-호' },
];

export const FIRE_INSPECTION_HOUSEHOLD_TABLE_COLUMNS = [
  { name: '동', key: 'dong' },
  { name: '호', key: 'ho' },
  { name: '구분', key: 'submissionType' },
  { name: '점검자', key: 'inspector' },
  { name: '연락처', key: 'inspectorPhone' },
  { name: '제출여부', key: 'submissionStatus' },
  { name: '제출일시', key: 'submissionDateTime' },
  { name: '정상', key: 'normalCount' },
  { name: '불량', key: 'defectiveCount' },
  { name: '해당없음', key: 'notApplicableCount' },
  { name: '', key: 'action' },
];

export const FIRE_INSPECTION_HOUSEHOLD_FILTER = {
  filterName: '제출여부',
  filterKey: 'submissionStatus',
  list: [
    FILTER_ALL,
    {
      key: FIRE_INSPECTION_SUBMIT_STATE_KEY.SUBMITTED,
      label: FIRE_INSPECTION_SUBMIT_STATE_LABEL.SUBMITTED,
    },
    {
      key: FIRE_INSPECTION_SUBMIT_STATE_KEY.NOT_SUBMITTED,
      label: FIRE_INSPECTION_SUBMIT_STATE_LABEL.NOT_SUBMITTED,
    },
  ],
};

export const FIRE_INSPECTION_STATE_BADGE_KEY = {
  ...FIRE_INSPECTION_SUBMIT_STATE_KEY,
  ...FIRE_INSPECTION_PROGRESS_STATE_KEY,
};

export const FIRE_INSPECTION_STATE_BADGE_LABEL = {
  ...FIRE_INSPECTION_SUBMIT_STATE_LABEL,
  ...FIRE_INSPECTION_PROGRESS_STATE_LABEL,
};

// ///////////////////////////////////////////////
// ////////////////// 수기 등록 ///////////////////
// ///////////////////////////////////////////////

// 점검 결과 옵션
export const FIRE_INSPECTION_RESULT_KEY = {
  NORMAL: 'NORMAL',
  DEFECTIVE: 'DEFECTIVE',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};

export const FIRE_INSPECTION_RESULT_LABEL = {
  [FIRE_INSPECTION_RESULT_KEY.NORMAL]: '정상',
  [FIRE_INSPECTION_RESULT_KEY.DEFECTIVE]: '불량',
  [FIRE_INSPECTION_RESULT_KEY.NOT_APPLICABLE]: '해당없음',
};

export const FIRE_INSPECTION_RESULT_OPTIONS = [
  {
    key: FIRE_INSPECTION_RESULT_KEY.NORMAL,
    label: FIRE_INSPECTION_RESULT_LABEL[FIRE_INSPECTION_RESULT_KEY.NORMAL],
  },
  {
    key: FIRE_INSPECTION_RESULT_KEY.DEFECTIVE,
    label: FIRE_INSPECTION_RESULT_LABEL[FIRE_INSPECTION_RESULT_KEY.DEFECTIVE],
  },
  {
    key: FIRE_INSPECTION_RESULT_KEY.NOT_APPLICABLE,
    label:
      FIRE_INSPECTION_RESULT_LABEL[FIRE_INSPECTION_RESULT_KEY.NOT_APPLICABLE],
  },
];

// 점검자 구분
export const FIRE_INSPECTION_INSPECTOR_TYPE_KEY = {
  HOUSEHOLD_HEAD: 'HOUSEHOLD_HEAD',
  HOUSEHOLD_MEMBER: 'HOUSEHOLD_MEMBER',
};

export const FIRE_INSPECTION_INSPECTOR_TYPE_LABEL = {
  [FIRE_INSPECTION_INSPECTOR_TYPE_KEY.HOUSEHOLD_HEAD]: '세대주',
  [FIRE_INSPECTION_INSPECTOR_TYPE_KEY.HOUSEHOLD_MEMBER]: '세대원',
};

export const FIRE_INSPECTION_INSPECTOR_TYPE_OPTIONS = [
  {
    key: FIRE_INSPECTION_INSPECTOR_TYPE_KEY.HOUSEHOLD_HEAD,
    label:
      FIRE_INSPECTION_INSPECTOR_TYPE_LABEL[
        FIRE_INSPECTION_INSPECTOR_TYPE_KEY.HOUSEHOLD_HEAD
      ],
  },
  {
    key: FIRE_INSPECTION_INSPECTOR_TYPE_KEY.HOUSEHOLD_MEMBER,
    label:
      FIRE_INSPECTION_INSPECTOR_TYPE_LABEL[
        FIRE_INSPECTION_INSPECTOR_TYPE_KEY.HOUSEHOLD_MEMBER
      ],
  },
];

// 구분
export const FIRE_INSPECTION_SUBMISSION_TYPE_KEY = {
  APT_ADMIN: 'APT_ADMIN',
  RESIDENT: 'RESIDENT',
};

export const FIRE_INSPECTION_SUBMISSION_TYPE_LABEL = {
  [FIRE_INSPECTION_SUBMISSION_TYPE_KEY.APT_ADMIN]: '관리사무소',
  [FIRE_INSPECTION_SUBMISSION_TYPE_KEY.RESIDENT]: '입주민',
};

export const FIRE_INSPECTION_SUBMISSION_TYPES = [
  {
    key: FIRE_INSPECTION_SUBMISSION_TYPE_KEY.APT_ADMIN,
    label:
      FIRE_INSPECTION_SUBMISSION_TYPE_LABEL[
        FIRE_INSPECTION_SUBMISSION_TYPE_KEY.APT_ADMIN
      ],
  },
  {
    key: FIRE_INSPECTION_SUBMISSION_TYPE_KEY.RESIDENT,
    label:
      FIRE_INSPECTION_SUBMISSION_TYPE_LABEL[
        FIRE_INSPECTION_SUBMISSION_TYPE_KEY.RESIDENT
      ],
  },
];

// ///////////////////////////////////////////////
// ///////////// 소방 자가 점검 문항표 템플릿 /////////////
// //////////////////////////////////////////////

export const FIELD_LABELS = {
  submissionType: '구분',
  inspector: '점검자',
  inspectorPhone: '연락처',
  submissionDateTime: '점검일',
  inspectionQuestions: '점검 결과',
};

export const FIRE_INSPECTION_QUESTION_TEMPLATE = {
  templateId: 'FIRE_INSPECTION_V1',
  version: 1,
  title: '소방시설 점검',
  sections: [
    {
      sectionId: 'FIRE_EQUIPMENT',
      title: '소화설비',
      groups: [
        {
          groupId: 'EXTINGUISHER',
          title: '소화기',
          questions: [
            {
              questionId: 'EXTINGUISHER_01',
              label: '손쉽게 사용할 수 있는 장소에 설치 여부',
            },
            {
              questionId: 'EXTINGUISHER_02',
              label: '용기 변형·손상·부식 여부',
            },
            {
              questionId: 'EXTINGUISHER_03',
              label: '안전핀 체결 여부',
            },
            {
              questionId: 'EXTINGUISHER_04',
              label: '지시압력계 정상 여부',
            },
            {
              questionId: 'EXTINGUISHER_05',
              label: '수동식 분말소화기 내용연수(10년) 적정 여부',
            },
          ],
        },
        {
          groupId: 'AUTO_EXTINGUISHER',
          title: '자동확산 소화기',
          questions: [
            {
              questionId: 'AUTO_EXTINGUISHER_01',
              label: '설치상태 및 외형의 변형·손상·부식 여부',
            },
            {
              questionId: 'AUTO_EXTINGUISHER_02',
              label: '지시압력계의 정상 여부',
            },
          ],
        },
        {
          groupId: 'PARKING_EXTINGUISHER',
          title: '주거용 주방자동 소화장치',
          questions: [
            {
              questionId: 'PARKING_EXTINGUISHER_01',
              label: '소화약제용기 지시압력계의 정상 여부',
            },
            {
              questionId: 'PARKING_EXTINGUISHER_02',
              label: '수신부의 전원표시등 정상 점등 여부',
            },
          ],
        },
        {
          groupId: 'SPRINKLER',
          title: '스프링클러',
          questions: [
            {
              questionId: 'SPRINKLER_01',
              label: '헤드 변형·손상·부식 유무',
            },
          ],
        },
      ],
    },
    {
      sectionId: 'ALARM_EQUIPMENT',
      title: '경보설비',
      groups: [
        {
          groupId: 'AUTO_FIRE_ALARM',
          title: '자동화재 탐지설비',
          questions: [
            {
              questionId: 'AUTO_FIRE_ALARM_01',
              label: '감지기 변형·손상·탈락 여부',
            },
          ],
        },
        {
          groupId: 'GAS_ALARM',
          title: '가스누설 경보기',
          questions: [
            {
              questionId: 'GAS_ALARM_01',
              label: '전원스위치 정상 점등 여부',
            },
          ],
        },
      ],
    },
    {
      sectionId: 'EVACUATION_EQUIPMENT',
      title: '피난설비',
      groups: [
        {
          groupId: 'DESCENDING_LIFE_LINE',
          title: '완강기',
          questions: [
            {
              questionId: 'DESCENDING_LIFE_LINE_01',
              label: '피난기구 위치 적정성 여부',
            },
            {
              questionId: 'DESCENDING_LIFE_LINE_02',
              label: '완강기 외형의 변형·손상·부식 여부',
            },
            {
              questionId: 'DESCENDING_LIFE_LINE_03',
              label: '설치 여부 및 장애물로 인한 피난 지장 여부',
            },
          ],
        },
        {
          groupId: 'EVACUATION_LADDER',
          title: '피난구용 내림식 사다리',
          questions: [
            {
              questionId: 'EVACUATION_LADDER_01',
              label: '피난기구 위치 표시 및 사용방법 표시 유무',
            },
            {
              questionId: 'EVACUATION_LADDER_02',
              label: '설치 여부 및 장애물로 인한 피난 지장 여부',
            },
          ],
        },
      ],
    },
    {
      sectionId: 'OTHER_EQUIPMENT',
      title: '기타설비',
      groups: [
        {
          groupId: 'EVACUATION_SPACE',
          title: '대피공간',
          questions: [
            {
              questionId: 'EVACUATION_SPACE_01',
              label: '방화문(방화구획)의 적정 여부',
            },
            {
              questionId: 'EVACUATION_SPACE_02',
              label: '적치물(쌓아놓은 물건)로 인한 피난 장애 여부',
            },
          ],
        },
        {
          groupId: 'LIGHTWEIGHT_PARTITION',
          title: '경량칸막이',
          questions: [
            {
              questionId: 'LIGHTWEIGHT_PARTITION_01',
              label: '정보를 포함한 표시 부착 여부',
            },
            {
              questionId: 'LIGHTWEIGHT_PARTITION_02',
              label: '적치물(쌓아놓은 물건)로 인한 피난 장애 여부',
            },
          ],
        },
      ],
    },
  ],
};
