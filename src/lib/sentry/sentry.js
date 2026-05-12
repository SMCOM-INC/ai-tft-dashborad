import * as Sentry from '@sentry/vue';

export const initSentry = ({ app, router }) => {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    // 환경 설정
    environment: import.meta.env.MODE,
    // 기본 PII(개인식별정보, 예: IP 주소 등) 전송 허용
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(), // 사용자의 브라우저에서 일어나는 일을 비디오와 같이 재현
      Sentry.reportingObserverIntegration(), // 브라우저의 ReportingObserver API(예: CSS 오류, 리소스 로드 실패 등)로 잡히는 리포트 오류
      Sentry.zodErrorsIntegration(), // Zod 검증 오류
      Sentry.captureConsoleIntegration({ levels: ['error'] }), // 콘솔 호출을 감지
    ],
    tracePropagationTargets: ['*'],
    tracesSampleRate: 1.0, // 모든 트랜잭션의 100%를 캡처
    enableLogs: true,
    replaysSessionSampleRate: 0.1, // 샘플링 비율을 10%로 설정. 개발 중에는 100%로 변경하고 프로덕션에서는 더 낮은 비율로 샘플링하는 것을 권장
    replaysOnErrorSampleRate: 1.0, // 에러가 발생한 세션의 샘플링 비율을 100%로 설정
    ignoreErrors: [/ResizeObserver loop limit exceeded/i],
  });
};
