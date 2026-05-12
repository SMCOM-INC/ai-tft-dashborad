import { ref } from 'vue';

const useUploadProgress = () => {
  const progressPercent = ref(0);

  const createUploadProgressHandler = () => ({
    onUploadProgress: (event) => {
      if (event.total) {
        progressPercent.value = Math.round((event.loaded * 100) / event.total);
      }
    },
    onSuccess: () => {
      progressPercent.value = 100;
    },
    onError: () => {
      progressPercent.value = 0;
    },
  });

  return {
    progressPercent,
    createUploadProgressHandler,
  };
};

export default useUploadProgress;
