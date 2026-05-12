import Swal from 'sweetalert2';

const swalConfirmModal = ({
  title,
  text,
  icon = 'question',
  confirmButtonText = '확인',
  cancelButtonText = '취소',
  callback = null,
}) => {
  Swal.fire({
    title,
    text,
    icon,
    heightAuto: false,
    showCancelButton: true,
    confirmButtonText,
    confirmButtonColor: '#2563EB',
    cancelButtonText,
  }).then((result) => {
    if (result.isConfirmed && callback) {
      callback();
    }
  });
};

export default swalConfirmModal;
