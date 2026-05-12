import { computed } from 'vue';

import { CONTENT_TYPES } from '@/constants/common.js';
import {
  LNB_APT_ADMIN_LIST,
  LNB_STORE_ADMIN_LIST,
} from '@/constants/layout.js';
import { useTokenStore } from '@/stores/auth.js';

const isDevelopment = import.meta.env.MODE !== 'production';

const useLNBMenuList = (aptDetail) => {
  const { token } = useTokenStore();

  // 서버 contentList에 해당 id의 콘텐츠가 있는지 확인
  const isServerContentMatch = (id) =>
    aptDetail.value?.contentList?.some(
      (content) => content.name.trim() === CONTENT_TYPES[id],
    );

  const hasStoreContent = computed(() => {
    const contentList = aptDetail.value?.contentList;

    if (!contentList) return false;

    const storeTypes = ['상가', '상가(출차미제어)'];

    return contentList.some((content) =>
      storeTypes.some((type) => content.name.trim() === type),
    );
  });

  // fixedList: 서버 콘텐츠와 무관하게 항상 표시할 섹션/아이템 id 목록
  const LNB_LIST = computed(() => {
    switch (token.userRole) {
      case 'master':
      case 'apt_admin':
        return {
          fixedList: ['dashboard', 'apt', 'member', 'boardNotice'],
          list: hasStoreContent.value
            ? [LNB_APT_ADMIN_LIST, LNB_STORE_ADMIN_LIST]
            : [LNB_APT_ADMIN_LIST],
        };
      case 'store_admin':
        return {
          fixedList: ['parking'],
          list: [LNB_STORE_ADMIN_LIST],
        };
      default:
        return {};
    }
  });

  // role별 LNB 목록을 서버 콘텐츠 기준으로 필터링
  const filteredLNBList = computed(() => {
    const { fixedList: FIXED_MENUS_IDS, list: LIST_BY_USER_ROLE } =
      LNB_LIST.value;

    if (!FIXED_MENUS_IDS || !LIST_BY_USER_ROLE) return [];

    const baseList = LIST_BY_USER_ROLE.flat();

    // fixedList에 포함된 id인지 확인 (서버 콘텐츠와 무관하게 항상 표시)
    const isFixedContent = (id) => FIXED_MENUS_IDS.includes(id);

    // Step 1: 섹션 필터링
    const filterSection = baseList.filter((section) => {
      // fixedList에 있는 섹션은 무조건 표시
      if (isFixedContent(section.id)) return true;

      // 섹션 자체의 id가 서버 콘텐츠와 일치하면 표시 (ex. parking, repair 등)
      const sectionIdMatch = section.id && isServerContentMatch(section.id);

      // 하위 아이템 중 fixedList에 있거나 서버 콘텐츠와 일치하는 것이 있으면 섹션 표시
      // (ex. board 섹션은 boardNotice가 fixedList에 있어서 항상 포함)
      const hasMatchingListItems = section.list?.some(
        (item) => isFixedContent(item.id) || isServerContentMatch(item.id),
      );

      return sectionIdMatch || hasMatchingListItems;
    });

    // 2단계: 각 섹션의 하위 아이템 필터링
    const filterList = filterSection.map((section) => {
      const newSection = { ...section };

      // fixedList 섹션은 하위 아이템 필터링 생략 (전체 표시)
      const isSectionFixed = isFixedContent(section.id);

      //  아이템이 id 를 갖고 있는지 여부
      const hasListItemsWithId = section.list?.some((item) => item.id);

      // 아이템 id 있는 것만 서버 또는 fixed 에 따라 처리
      if (hasListItemsWithId && !isSectionFixed) {
        newSection.list = section.list?.filter((item) => {
          // 게시판 관리 설정, 블랙리스트 : 소통 또는 민원 콘텐츠가 있을 때만 표시
          if (item.id === 'boardSettings' || item.id === 'boardBlackList') {
            return (
              isServerContentMatch('boardCommunity') ||
              isServerContentMatch('boardComplaints')
            );
          }

          return isServerContentMatch(item.id) || isFixedContent(item.id);
        });
      }

      return newSection;
    });

    // Step 3: 운영 환경에서는 mode: 'dev' 항목 추가 제거
    const filterDevMode = (menuList) =>
      menuList
        .filter((section) => section.mode !== 'dev')
        .map((section) => ({
          ...section,
          list: section.list.filter((item) => item.mode !== 'dev'),
        }));

    return isDevelopment ? filterList : filterDevMode(filterList);
  });

  const shouldShowSetting = (section) => {
    if (!section.hasSetting) return false;

    // 게시판 설정은 소통 또는 민원 콘텐츠가 있을 때만 표시
    if (section.id === 'board') {
      return (
        isServerContentMatch('boardCommunity') ||
        isServerContentMatch('boardComplaints')
      );
    }

    return true;
  };

  return { filteredLNBList, shouldShowSetting };
};

export default useLNBMenuList;
