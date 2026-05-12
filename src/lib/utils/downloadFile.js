import { useUserInfoStore } from '@/stores/auth.js';

const downloadFile = ({ data, type, fileName }) => {
  const { userInfo } = useUserInfoStore();
  const url = URL.createObjectURL(new Blob([data]));
  let fileNameValue = '';

  if (fileName) {
    fileNameValue = `${userInfo.aptName}_${fileName}.${type}`;
  } else {
    fileNameValue = `${userInfo.aptName}_다운로드 파일.${type}`;
  }

  const link = Object.assign(document.createElement('a'), {
    href: url,
    download: fileNameValue,
    style: 'display: none',
  });

  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
};

export default downloadFile;
