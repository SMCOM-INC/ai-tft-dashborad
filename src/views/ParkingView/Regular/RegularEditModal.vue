<script setup>
  import RegularForm from '@views/ParkingView/Regular/RegularForm.vue';

  import {
    usePatchBusinessRegularCar,
    usePatchHouseholdRegularCar,
  } from '@/lib/queries/aptAdmin/aptAdminParkingQueries.js';

  defineProps({
    initialInfo: {
      type: Object,
      required: true,
    },
  });

  const {
    patchHouseholdRegularCarMutation,
    isPatchHouseholdRegularCarPending,
    isPatchHouseholdRegularCarSuccess,
  } = usePatchHouseholdRegularCar();

  const {
    patchBusinessRegularCarMutation,
    isPatchBusinessRegularCarPending,
    isPatchBusinessRegularCarSuccess,
  } = usePatchBusinessRegularCar();
</script>

<template>
  <RegularForm
    mode="edit"
    :initial-info="initialInfo"
    :household-mutation="patchHouseholdRegularCarMutation"
    :business-mutation="patchBusinessRegularCarMutation"
    :is-household-success="isPatchHouseholdRegularCarSuccess"
    :is-business-success="isPatchBusinessRegularCarSuccess"
    :is-household-pending="isPatchHouseholdRegularCarPending"
    :is-business-pending="isPatchBusinessRegularCarPending"
  />
</template>
