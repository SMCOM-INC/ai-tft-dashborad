export const ID_REGEX = /^[a-zA-Z0-9-]{4,41}$/;

export const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#^*~])[a-zA-Z0-9!@#^*~]{8,20}$/;

export const PHONE_REGEX =
  /^(010|011|016|017|018|019|02|031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064|070)\d{7,8}$/;

export const PHONE_HYPHEN_REGEX =
  /^((010|011|016|017|018|019|02|031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064|070)-\d{3,4}-\d{4}|1\d{3}-\d{4})$/;

export const MOBILE_PHONE_HYPHEN_REGEX = /^01[016789]-\d{3,4}-\d{4}$/;

export const PHONE_REGEX_LENGTH = /^\d{10,11}$/;

export const NUMBER_PASSWORD_REGEX = /^\d+$/;

export const DATE_REGEX = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

export const DATE_TIME_REGEX =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]) (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

export const HH_MM_REGEX = /^\d{2}:\d{2}$/;

export const IP_ADDRESS_REGEX =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export const CAR_NUM_REGEX =
  /^(\d{2,3}[가-힣]\d{4}|[가-힣]{2}\d{2}[가-힣]\d{4}|[가-힣]{2}\d{3}-\d{3})$/;

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const DONG_HO_REGEX = /^[가-힣a-zA-Z0-9]+-\d+$/;

// 다른 문자열과 공백 허용. 공백만은 안됨
export const STRING_TRIM_REGEX = /^(?!\s+$).+$/;

// 숫자만
export const NUMBER_REGEX = /^[0-9]+$/;

// 한글, 영문(대소문자)만
export const KOREAN_ENGLISH_REGEX = /^[가-힣a-zA-Z\s]+$/;

// 한글, 영문(대소문자), 숫자만
export const KOREAN_ENGLISH_NUMBER_REGEX = /^[가-힣a-zA-Z0-9]+$/;

// 계좌번호
export const ACCOUNT_REGEX = /^[0-9]+(-[0-9]+)*$/;
