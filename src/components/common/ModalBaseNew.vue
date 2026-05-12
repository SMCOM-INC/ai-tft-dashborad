<script setup></script>

<template>
  <Teleport to="body">
    <div
      class="fixed left-[0px] top-[0px] z-[1000] flex h-screen w-screen items-center justify-center bg-defaults-primary-background-dimmed p-5"
    >
      <div
        class="absolute min-w-[30px] rounded-md bg-defaults-primary-background-primary"
        @click.stop
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
