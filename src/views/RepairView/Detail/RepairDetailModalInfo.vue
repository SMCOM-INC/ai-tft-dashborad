<script setup>
  import TableInfoBaseNew from '@components/common/TableInfoBaseNew.vue';
  import RepairStatusChip from '@views/RepairView/RepairStatusChip.vue';

  import { REPAIR_DETAIL_INFO_CELL_COLUMN } from '@/constants/repair.js';
  import formatContact from '@/lib/utils/formatContact.js';

  defineProps({
    repairDetail: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  });

  // 필드 값 렌더링
  const renderFieldValue = (key, value) => {
    if (!key) return '-';

    if (key === 'phone' || key === 'emergencyPhone') {
      return formatContact(value) || '-';
    }

    return value || '-';
  };
</script>

<template>
  <section class="relative flex flex-col gap-2 pt-5">
    <h2
      class="select-none text-[15px] font-semibold leading-5 text-muted-foreground-100"
    >
      접수정보
    </h2>
    <TableInfoBaseNew
      :table-headers="REPAIR_DETAIL_INFO_CELL_COLUMN"
      table-padding="px-6 py-4"
      table-head-class="w-40"
    >
      <template #cell="{ cell }">
        <template v-if="cell.key === 'state'">
          <RepairStatusChip :state="repairDetail[cell.key]" />
        </template>
        <template v-else>{{
          renderFieldValue(cell.key, repairDetail[cell.key])
        }}</template>
      </template>
    </TableInfoBaseNew>
  </section>
</template>
