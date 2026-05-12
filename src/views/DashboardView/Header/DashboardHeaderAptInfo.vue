<script setup>
  import OverlayBlur from '@components/common/OverlayBlur.vue';
  import SkeletonBase from '@components/common/SkeletonBase.vue';
  import { computed } from 'vue';

  import { DASHBOARD_HEADER_APT_INFO } from '@/constants/dashboard.js';
  import useCheckParkingService from '@/lib/composables/dashboard/useCheckParkingService.js';
  import useGetDashboardAptInfo from '@/lib/queries/dashboard/useGetDashboardAptInfo.js';
  import { useUserInfoStore } from '@/stores/auth.js';

  const { userInfo } = useUserInfoStore();
  const { hasParkingService } = useCheckParkingService();

  const {
    dashboardAptInfo,
    isDashboardAptInfoLoading,
    isDashboardAptInfoError,
  } = useGetDashboardAptInfo();

  // regularCars 오버레이 표시 여부
  const showRegularCarsOverlay = computed(() => {
    return !hasParkingService.value || isDashboardAptInfoError.value;
  });
</script>

<template>
  <!-- 아파트 정보 -->
  <div class="space-y-2.5">
    <p class="pretendard-24Bold">
      {{ userInfo.aptName }}
    </p>

    <ul class="flex items-center gap-3">
      <template
        v-for="(item, index) in DASHBOARD_HEADER_APT_INFO"
        :key="item.key"
      >
        <template v-if="item.key === 'regularCount'">
          <SkeletonBase
            v-if="isDashboardAptInfoLoading"
            class="h-6 w-32 rounded"
          />

          <li
            v-else
            class="relative flex items-center gap-[6px] pretendard-16Medium"
          >
            <component
              :is="item.icon"
              v-if="item.icon"
              class="h-4 w-4 text-defaults-secondary-icon-secondary"
            />
            <span
              class="whitespace-nowrap text-defaults-secondary-text-secondary"
            >
              {{ item.label }}
            </span>
            <span class="text-defaults-primary-text-primary">
              {{
                isDashboardAptInfoError
                  ? '조회 실패'
                  : dashboardAptInfo?.[item.key]?.toLocaleString() || '-'
              }}
            </span>

            <!-- 오버레이 -->
            <OverlayBlur
              v-if="showRegularCarsOverlay"
              blur="backdrop-blur-sm"
              class="-inset-6 z-10"
            />
          </li>
        </template>

        <li v-else class="flex items-center gap-[6px] pretendard-16Medium">
          <component
            :is="item.icon"
            v-if="item.icon"
            class="h-4 w-4 text-defaults-secondary-icon-secondary"
          />
          <span
            class="whitespace-nowrap text-defaults-secondary-text-secondary"
          >
            {{ item.label }}
          </span>
          <span class="text-defaults-primary-text-primary">
            {{ userInfo[item.key]?.toLocaleString() }}
          </span>
        </li>

        <!-- Divider -->
        <div
          v-if="index < DASHBOARD_HEADER_APT_INFO.length - 1"
          class="h-[17px] w-0 border-l border-defaults-primary-border-primary"
        ></div>
      </template>
    </ul>
  </div>
</template>
