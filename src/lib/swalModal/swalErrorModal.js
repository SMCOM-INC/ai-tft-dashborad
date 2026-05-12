import Swal from 'sweetalert2';

const swalErrorModal = async ({
  text = '에러가 발생했습니다. 잠시 후 다시 시도해주세요.',
  html,
  icon = 'error',
  confirmButtonText = '확인',
  callback = null,
} = {}) => {
  Swal.fire({
    text,
    html,
    icon,
    heightAuto: false,
    confirmButtonText,
    confirmButtonColor: '#2563EB',
    customClass: {
      popup: 'z-[9999]',
      container: 'z-[9999]',
      overlay: 'z-[9999]',
    },
  }).then((result) => {
    if (result.isConfirmed && callback) {
      callback();
    }
  });
};

export default swalErrorModal;
