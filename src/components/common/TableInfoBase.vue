<script setup>
  import decodeUrlToParagraph from '@/lib/utils/decodeUriParagraph.js';

  defineProps({
    title: {
      type: String,
      required: true,
      default: '',
    },
    columnCount: {
      type: Number,
      required: true,
      default: 2,
    },
    cellColumnList: {
      type: Array,
      required: true,
      default: () => [],
    },
    cellData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  });
</script>

<template>
  <div>
    <h2
      class="mb-2.5 text-[15px] font-semibold leading-5 text-muted-foreground-100"
    >
      {{ title }}
    </h2>

    <table class="w-full divide-y divide-dark-100 border text-sm">
      <tbody class="divide-y divide-dark-100 bg-white">
        <template v-if="columnCount === 1">
          <tr v-for="column in cellColumnList" :key="column.key">
            <th
              class="whitespace-nowrap bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
            >
              {{ column.label }}
            </th>
            <td class="px-6 py-4">
              <slot
                :row="cellData[column.key]"
                :column="column.key"
                name="tableData"
              >
                <template v-if="column.type === 'urlDecode'">
                  <div
                    v-if="cellData[column.key]"
                    v-dompurify-html="
                      decodeUrlToParagraph(cellData[column.key])
                    "
                  />
                  <span v-else> - </span>
                </template>
                <span v-else> {{ cellData[column.key] || '-' }} </span>
              </slot>
            </td>
          </tr>
        </template>
        <template v-if="columnCount === 2">
          <template v-for="(column, index) in cellColumnList" :key="column.key">
            <!-- 짝수 인덱스일 때 새로운 행 시작 -->
            <tr v-if="index % 2 === 0">
              <th
                class="bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
              >
                {{ column.label }}
              </th>
              <td class="px-6 py-4">
                <slot
                  :row="cellData[column.key]"
                  :column="column.key"
                  name="tableData"
                >
                  <template v-if="column.type === 'urlDecode'">
                    <div
                      v-dompurify-html="
                        decodeUrlToParagraph(cellData[column.key])
                      "
                    />
                  </template>
                  <span v-else> {{ cellData[column.key] || '-' }} </span>
                </slot>
              </td>

              <!-- 다음 컬럼이 존재하면 같은 행에 추가 -->
              <th
                v-if="cellColumnList[index + 1]"
                class="bg-secondary-100 px-6 py-4 font-medium text-muted-foreground-100"
              >
                {{ cellColumnList[index + 1].label }}
              </th>
              <td v-if="cellColumnList[index + 1]" class="px-6 py-4">
                <slot
                  :row="cellData[cellColumnList[index + 1].key]"
                  :column="cellColumnList[index + 1].key"
                  name="tableData"
                >
                  <template
                    v-if="cellColumnList[index + 1].type === 'urlDecode'"
                  >
                    <div
                      v-dompurify-html="
                        decodeUrlToParagraph(
                          cellData[cellColumnList[index + 1].key],
                        )
                      "
                    />
                  </template>
                  <span v-else>
                    {{ cellData[cellColumnList[index + 1].key] || '-' }}
                  </span>
                </slot>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
