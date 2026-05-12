<script setup>
  import RegularForm from '@views/ParkingView/Regular/RegularForm.vue';

  import {
    usePostBusinessRegular,
    usePostHouseholdRegular,
  } from '@/lib/queries/aptAdmin/aptAdminParkingQueries.js';

  const {
    postHouseholdRegularMutation,
    isPostHouseholdRegularPending,
    isPostHouseholdRegularSuccess,
  } = usePostHouseholdRegular();

  const {
    postBusinessRegularMutation,
    isPostBusinessRegularPending,
    isPostBusinessRegularSuccess,
  } = usePostBusinessRegular();
</script>

<template>
  <RegularForm
    mode="create"
    :household-mutation="postHouseholdRegularMutation"
    :business-mutation="postBusinessRegularMutation"
    :is-household-success="isPostHouseholdRegularSuccess"
    :is-business-success="isPostBusinessRegularSuccess"
    :is-household-pending="isPostHouseholdRegularPending"
    :is-business-pending="isPostBusinessRegularPending"
  />
</template>
