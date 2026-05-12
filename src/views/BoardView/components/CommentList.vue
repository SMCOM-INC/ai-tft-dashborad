<script setup>
  import IconChevronLeftGray from '@assets/icons/icon-chevron-left-gray.svg';
  import SkeletonBar from '@components/common/SkeletonBar.vue';
  import CommentInput from '@views/BoardView/components/CommentInput.vue';
  import CommentItem from '@views/BoardView/components/CommentItem.vue';
  import { computed, ref } from 'vue';


  const props = defineProps({
    comments: {
      type: Array,
      required: false,
      default: undefined,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    editable: {
      type: Boolean,
      default: false,
    },
    queryStates: {
      type: Object,
      default: () => ({}),
    },
    editorDomain: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits(['reply', 'edit', 'delete', 'submit']);

  const isCommentListOpen = ref(props.isOpen);

  const handleCommentListOpenButton = () => {
    isCommentListOpen.value = !isCommentListOpen.value;
  };

  const commentCount = computed(() => {
    if (props.comments?.length > 0) {
      let totalComments = props.comments.length;
      props.comments.forEach((comment) => {
        totalComments = totalComments + comment.childCommentList.length;
      });
      return totalComments;
    }
    return 0;
  });
</script>

<template>
  <div v-if="isLoading" class="mb-14 flex w-1/2 flex-col gap-2">
    <SkeletonBar v-for="i in 3" :key="i" />
  </div>
  <div v-else-if="isError" class="flex min-h-20 items-center justify-center">
    <div v-if="isError">
      <span class="text-red-500"
        >댓글 목록을 불러오는 중 오류가 발생했습니다. {{ error }}</span
      >
    </div>
  </div>
  <div v-else class="mb-14 rounded-md border border-dark-100">
    <!-- 헤더 -->
    <button
      type="button"
      :class="`flex w-full items-center gap-1 px-4 py-3 ${
        isCommentListOpen ? 'border-b border-dark-100' : ''
      }`"
      @click="handleCommentListOpenButton"
    >
      <h3 class="text-base font-semibold text-muted-foreground-100">
        댓글 {{ commentCount }}개
      </h3>
      <IconChevronLeftGray
        class="h-4 w-4"
        :class="`${isCommentListOpen ? 'rotate-90' : 'rotate-[270deg]'}`"
        alt="오른쪽 화살표 아이콘"
      />
    </button>

    <!-- 댓글 목록 -->
    <div v-if="isCommentListOpen">
      <div v-if="comments?.length">
        <ul>
          <template v-for="comment in comments" :key="comment.commentUuid">
            <CommentItem
              :comment="comment"
              :editable="editable"
              :is-parent="true"
              :query-states="queryStates"
              :editor-domain="editorDomain"
              @reply="emit('reply', $event)"
              @edit="emit('edit', $event)"
              @delete="emit('delete', $event)"
            />
            <CommentItem
              v-for="childComment in comment.childCommentList"
              :key="childComment.commentUuid"
              :comment="childComment"
              :editable="editable"
              :is-parent="false"
              :query-states="queryStates"
              :editor-domain="editorDomain"
              @delete="$emit('delete', $event)"
              @edit="emit('edit', $event)"
            />
          </template>
        </ul>
        <CommentInput
          v-if="editable"
          :query-states="queryStates.new"
          :editor-domain="editorDomain"
          @submit="emit('submit', $event)"
        />
      </div>
      <p
        v-else
        class="flex min-h-20 items-center justify-center text-muted-foreground-100"
      >
        댓글이 없습니다.
      </p>
      <CommentInput
        v-if="commentCount === 0"
        key="comment-input-2"
        :query-states="queryStates.new"
        :editor-domain="editorDomain"
        @submit="emit('submit', $event)"
      />
    </div>
  </div>
</template>
