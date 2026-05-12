<script setup>
  defineProps({
    tableHeaders: {
      type: Array,
      required: true,
      default: () => [],
    },
    tablePadding: {
      type: String,
      required: false,
      default: 'px-6 py-4',
    },
    tableHeadClass: {
      type: String,
      required: false,
      default: 'w-28',
    },
  });

  const gridColsMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };
</script>

<template>
  <div class="w-full rounded-md border border-defaults-primary-border-primary">
    <table class="w-full">
      <tbody>
        <template v-for="(row, rowIndex) in tableHeaders" :key="rowIndex">
          <tr
            v-if="row.length > 0"
            :class="`grid ${gridColsMap[row.length] || 'grid-cols-1'} ${
              rowIndex === tableHeaders.length - 1
                ? ''
                : 'border-b border-b-defaults-primary-border-primary'
            }`"
          >
            <div v-for="(cell, cellIndex) in row" :key="cell.key">
              <th
                :class="`bg-defaults-secondary-background-secondary text-left text-defaults-secondary-text-secondary pretendard-14Regular
                ${tableHeadClass} 
                ${tablePadding}
                ${rowIndex === 0 ? 'rounded-tl-md' : ''} 
                ${rowIndex === tableHeaders.length - 1 && cellIndex === 0 ? 'rounded-bl-md' : ''}`"
              >
                {{ cell.label }}
              </th>
              <td
                :class="`${tablePadding} ${
                  rowIndex === tableHeaders.length - 1 &&
                  cellIndex === row.length - 1
                    ? 'rounded-br-md'
                    : ''
                }`"
              >
                <slot name="cell" :cell="cell" />
              </td>
            </div>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
