<script setup>
  import ButtonBase from '@components/common/ButtonBase.vue';
  import InputBase from '@components/common/InputBase.vue';
  import LabelBase from '@components/common/LabelBase.vue';
  import SpinnerWhiteView from '@components/common/SpinnerWhiteView.vue';
  import TextError from '@components/common/TextError.vue';
  import { useForm } from 'vee-validate';

  import { ERROR_MESSAGES } from '@/constants/common.js';
  import usePostLogin from '@/lib/queries/auth/usePostLogin.js';

  const {
    postLoginMutation,
    isPostLoginPending,
    isPostLoginError,
    postLoginError,
  } = usePostLogin();

  const { defineField, handleSubmit } = useForm();

  const [id] = defineField('id');
  const [password] = defineField('password');

  const onSubmit = handleSubmit(async (submitValues) => {
    postLoginMutation({
      id: submitValues.id,
      password: submitValues.password,
    });
  });
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <div
      class="w-[410px] rounded-md border border-dark-100 bg-background-100 p-6"
    >
      <div class="mb-9 flex flex-col items-center gap-2">
        <img
          src="/logo-full.png"
          alt="아파트먼트 로고 이미지"
          class="w-[108px]"
        />
        <h1
          class="text-center text-2xl font-semibold leading-8 tracking-[-2.5%]"
        >
          관리자
        </h1>
      </div>
      <form id="loginForm" class="flex flex-col" @submit="onSubmit">
        <LabelBase label-for="userId" label-text="관리자 ID" class="mb-6">
          <InputBase
            id="userId"
            v-model="id"
            type="text"
            required
            name="userId"
            placeholder="아이디를 입력해주세요."
            :max-length="41"
            autocomplete="off"
            class="px-3 py-1 shadow-sm"
          />
        </LabelBase>
        <LabelBase label-for="userPassword" label-text="비밀번호">
          <InputBase
            id="userPassword"
            v-model="password"
            type="password"
            required
            name="userPassword"
            placeholder="비밀번호를 입력해주세요."
            autocomplete="off"
            :max-length="20"
            class="px-3 py-1 shadow-sm"
          />
        </LabelBase>
        <div
          class="relative flex h-[92px] w-full flex-col justify-between gap-3"
        >
          <TextError v-if="isPostLoginError">
            {{ ERROR_MESSAGES[postLoginError?.data?.error?.errorCode] }}
          </TextError>
          <ButtonBase
            form="loginForm"
            type="submit"
            color="primary"
            custom-class="absolute bottom-0 w-full"
            :disabled="isPostLoginPending"
          >
            <div
              v-if="isPostLoginPending"
              class="flex items-center justify-center gap-2"
            >
              <span>로그인 중..</span>
              <SpinnerWhiteView />
            </div>
            <div v-else class="w-full">로그인</div>
          </ButtonBase>
        </div>
      </form>
    </div>
  </div>
</template>
