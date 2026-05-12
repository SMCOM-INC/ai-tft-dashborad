import * as Sentry from '@sentry/vue';

const sentryApiError = (error) => {
  const { status } = error;
  const { baseURL } = error.config;
  const path = error.config?.url?.split('?')[0];
  const replacedPath = path.replace(
    /\/([0-9]+|[0-9a-fA-F-]{8,})(?=\/|$)/g,
    '/{params}',
  );
  const name = `[${status} Error] - ${baseURL}${replacedPath}`;

  // Error 객체 생성 (커스텀 이름으로)
  const sentryError = new Error(error.message);
  sentryError.name = name;

  // Sentry로 전송
  Sentry.captureException(sentryError);
};

export default sentryApiError;
