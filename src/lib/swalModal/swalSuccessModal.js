import Swal from 'sweetalert2';

const swalSuccessModal = ({
  title,
  text,
  html,
  icon = 'success',
  confirmButtonText = '확인',
  callback = null,
}) => {
  Swal.fire({
    title,
    text,
    html,
    icon,
    heightAuto: false,
    confirmButtonText,
    confirmButtonColor: '#2563EB',
  }).then((result) => {
    if (result.isConfirmed && callback) {
      callback();
    }
  });
};

export default swalSuccessModal;
