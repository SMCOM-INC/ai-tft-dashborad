import swalWarningModal from '@/lib/swalModal/swalWarningModal.js';

/**
 * 댓글/답글 내용 검증 함수
 *
 * 댓글이나 답글을 등록/수정할 때 내용(텍스트)과 이미지 중 최소 하나는 있어야 한다는 규칙을 검증합니다.
 * 둘 다 없으면 경고 메시지를 표시하고 false를 반환합니다.
 *
 * @param {Object} params - 검증 파라미터
 * @param {string} params.content - 댓글/답글 텍스트 내용
 * @param {Object|null} params.uploadedImage - 업로드된 이미지 객체 (fileUuid, url, fileName 포함)
 * @param {string} params.type - 검증 타입 ('comment' | 'reply') - 에러 메시지 구분용
 * @returns {boolean} - 검증 통과 시 true, 실패 시 false
 */
export const validateCommentContent = ({
  content,
  uploadedImage,
  type = 'comment',
}) => {
  // content를 trim하여 공백만 있는 경우를 제외
  const contentText = content?.trim();

  // 유효한 텍스트 내용이 있는지 확인
  const hasContent = contentText && contentText.length > 0;

  // 업로드된 이미지가 있는지 확인 (null이나 undefined가 아닌 경우)
  const hasImage = uploadedImage !== null && uploadedImage !== undefined;

  // 내용과 이미지 둘 다 없으면 검증 실패
  if (!hasContent && !hasImage) {
    // 타입에 따라 다른 에러 메시지 표시
    const messageMap = {
      comment: '댓글 내용 또는 이미지 중 하나는 필수입니다.',
      reply: '답글 내용 또는 이미지 중 하나는 필수입니다.',
    };

    // SweetAlert로 경고 메시지 표시
    swalWarningModal({
      text: messageMap[type] || messageMap.comment,
    });

    return false;
  }

  // 검증 통과
  return true;
};
