import Swal from 'sweetalert2';

const swalWarningModal = async ({
  title,
  text,
  html,
  confirmButtonText = '확인',
  confirmButtonColor = '#64748b',
  showCancelButton = false,
  cancelButtonText = '취소',
  callback = null,
}) => {
  return Swal.fire({
    title,
    text,
    html,
    icon: 'warning',
    heightAuto: false,
    confirmButtonText,
    confirmButtonColor,
    showCancelButton,
    cancelButtonText,
  }).then((result) => {
    if (result.isConfirmed && callback) {
      callback();
    }
    return result;
  });
};

export default swalWarningModal;
