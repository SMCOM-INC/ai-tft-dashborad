<!-- TabBarBase.vue -->
<script setup>
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  import useNavigate from '@/lib/composables/common/useNavigate.js';

  const props = defineProps({
    tabList: { type: Array, required: true },
    tabCounts: { type: Object, required: false, default: () => undefined },
  });

  const route = useRoute();
  const { navigateTo, getCurrentRoutePath } = useNavigate();

  // 탭 인디케이터 스타일
  const tabRefs = ref([]);
  const indicatorStyle = ref({
    width: '0px',
    transform: 'translateX(0px)',
  });

  // 현재 활성화된 탭의 인덱스
  const activeTabIndex = computed(() => {
    const currentPath = getCurrentRoutePath();
    const segments = currentPath.split('/').filter(Boolean);

    return props.tabList.findIndex((tab) => segments.includes(tab.key));
  });

  // 탭 클릭 시 경로 생성
  const generatePath = (key) => {
    // TabBarBase를 포함하는 부모 라우트의 경로 사용 (마지막에서 두 번째)
    const parentRoute = route.matched[route.matched.length - 2];
    if (!parentRoute) return `/${key}`;

    // 동적 세그먼트(:param)를 실제 값으로 치환
    let baseRoute = parentRoute.path;
    Object.keys(route.params).forEach((param) => {
      baseRoute = baseRoute.replace(`:${param}`, route.params[param]);
    });

    return `${baseRoute}/${key}`;
  };

  const handleTabButton = (tabName) => {
    const path = generatePath(tabName);
    navigateTo(path);
  };

  // 활성 탭 인디케이터 위치 업데이트
  const updateIndicator = async () => {
    await nextTick();

    if (activeTabIndex.value === -1 || !tabRefs.value[activeTabIndex.value]) {
      return;
    }

    const activeTab = tabRefs.value[activeTabIndex.value];

    indicatorStyle.value = {
      width: `${activeTab.offsetWidth}px`,
      transform: `translateX(${activeTab.offsetLeft}px)`,
    };
  };

  watch(activeTabIndex, updateIndicator);

  onMounted(() => {
    updateIndicator();
  });
</script>

<template>
  <ol class="relative flex w-fit border-b border-b-dark-100">
    <li v-for="(tab, index) in props.tabList" :key="tab.name">
      <button
        :ref="(element) => (tabRefs[index] = element)"
        type="button"
        :class="`flex min-w-24 select-none items-center justify-center gap-[6px] px-6 py-[6px] text-sm font-medium transition-all duration-300 ${
          activeTabIndex === index
            ? 'text-primary-100'
            : 'hover:text-muted-foreground-200 text-muted-foreground-100'
        }`"
        @click="handleTabButton(tab.key)"
      >
        {{ tab.name }}
        <div
          v-if="props.tabCounts"
          :class="`rounded-full px-1 text-xs transition-colors duration-300 ${
            activeTabIndex === index ? 'bg-primary-20' : 'bg-[#71717A33]'
          }`"
        >
          {{ props.tabCounts[index]?.count }}
        </div>
      </button>
    </li>
    <div
      v-if="activeTabIndex >= 0"
      class="absolute bottom-0 h-[2px] bg-primary-100 transition-all duration-300 ease-out"
      :style="indicatorStyle"
    />
  </ol>
</template>
