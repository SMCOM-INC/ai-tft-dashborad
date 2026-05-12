import useNavigate from '@/lib/composables/common/useNavigate.js';
import { useUserInfoStore } from '@/stores/auth.js';

const useWallPadContent = () => {
  const { userInfo } = useUserInfoStore();
  const { getCurrentRoutePath } = useNavigate();
  const contentList = userInfo?.contentList || [];

  const [, , carType] = getCurrentRoutePath().split('/');

  let hasWallPadUI = false;

  // 월패드 : 샘물 연동
  const hasParkingWallPadAlarm = contentList?.find(
    (item) => item.name === '차량세대통보',
  );

  // 월패드 : 외부 업체 연동(정기차량만)
  const hasParkingExternalWallPadAlarmRegular = contentList?.find(
    (item) => item.name === '외부월패드(정기차량)',
  );

  // 월패드 : 외부 업체 연동
  const hasParkingExternalWallPadAlarm = contentList?.find(
    (item) =>
      item.name === '외부월패드' && !hasParkingExternalWallPadAlarmRegular,
  );

  // 모든 차량 유형: '차량세대통보' 또는 '외부월패드' 서비스가 있으면, 월패드 UI 표시
  if (hasParkingWallPadAlarm || hasParkingExternalWallPadAlarm) {
    hasWallPadUI = true;
  }

  // 정기차량만: '외부월패드(정기차량)' 서비스가 있으면, 월패드 UI 표시
  else if (carType === 'regular' && hasParkingExternalWallPadAlarmRegular) {
    hasWallPadUI = true;
  }

  // 그 외 월패드 UI 숨김

  return { hasWallPadUI };
};

export default useWallPadContent;
