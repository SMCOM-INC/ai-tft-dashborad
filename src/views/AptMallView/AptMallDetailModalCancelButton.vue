<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import SpinnerCircle from '@components/common/SpinnerCircle.vue';

  import useDeleteAptMall from '@/lib/queries/aptMall/useDeleteAptMall.js';

  defineProps({
    isCanceled: {
      type: Boolean,
      required: true,
    },
  });

  const { deleteAptMallMutationAsync, isDeleteAptMallPending } =
    useDeleteAptMall();

  const cancelOrder = () => {
    deleteAptMallMutationAsync();
  };
</script>

<template>
  <ButtonBase
    type="button"
    color="destructive-outlined"
    size="md"
    class="flex gap-2"
    :disabled="isCanceled || isDeleteAptMallPending"
    @click="cancelOrder"
  >
    <SpinnerCircle v-if="isDeleteAptMallPending" color="black" />
    <template v-else>취소하기</template>
  </ButtonBase>
</template>
