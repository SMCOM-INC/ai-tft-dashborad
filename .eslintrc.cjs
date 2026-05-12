require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    // @see https://github.com/vuejs/eslint-plugin-vue
    'plugin:vue/vue3-recommended',
    // @see https://github.com/vuejs/eslint-config-airbnb/tree/main/packages/eslint-config-airbnb#readme
    '@vue/eslint-config-airbnb',
    // ESLint에서의 포매팅 검사를 비활성화
    '@vue/eslint-config-prettier/skip-formatting',
    // @see https://github.com/import-js/eslint-plugin-import
    'plugin:import/recommended',
  ],
  plugins: ['import'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // 증가연산자 사용금지 끄기
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    // 할당연산자 사용금지
    'operator-assignment': ['error', 'never'],
    // 빈 return 제한 끄기
    'no-useless-return': 'off',
    // 항상 반환문 return 값 지정 끄기
    'consistent-return': 'off',
    // /////////////////////////////////////////////////////////////////////////
    // `vue/vue3-recommended`: Overwrites
    // @see https://eslint.vuejs.org/rules/
    // /////////////////////////////////////////////////////////////////////////
    // emit 정의하고 사용
    'vue/require-explicit-emits': [
      'error',
      {
        allowProps: false,
      },
    ],
    // props type 정의
    'vue/require-prop-types': 'error',
    // 컴포넌트 name 정의시 PascalCase 사용
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    // v-html 대신, 직접 tag 작성 또는 컴포넌트 import
    'vue/no-v-html': 'error',

    // /////////////////////////////////////////////////////////////////////////
    // `vue/vue3-recommended`: Optional (uncategorized) Rules
    // @see https://eslint.vuejs.org/rules/#uncategorized
    // /////////////////////////////////////////////////////////////////////////
    // script, template, style 순서
    'vue/block-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    // vue composition api 사용 여부
    'vue/component-api-style': ['error', ['script-setup', 'composition']],
    // event 이름 사용시 camelCase 사용
    'vue/custom-event-name-casing': ['error', 'camelCase'],
    // defineEmits type 지정
    'vue/define-emits-declaration': ['error', 'type-literal'],
    // defineEmits, defineProps 사용 순서 지정
    'vue/define-macros-order': [
      'error',
      {
        order: ['defineProps', 'defineEmits'],
      },
    ],
    // style 속성 지정
    'vue/enforce-style-attribute': ['error', { allow: ['scoped'] }],
    // import 되지 않은 컴포넌트 금지
    'vue/no-undef-components': 'error',
    // 선언되지 않은 변수 사용 금지
    'vue/no-undef-properties': 'error',
    // 사용하지 않는 emit 써두는 것 금지
    'vue/no-unused-emit-declarations': 'error',
    // 사용하지 않는 props 써두는 것 금지
    'vue/no-unused-properties': 'error',
    // 사용하지 않는 ref 써두는 것 금지
    'vue/no-unused-refs': 'error',
    // v-if 와 v-for 같이 사용 금지
    'vue/no-use-v-else-with-v-for': 'error',
    // v-text 대신 {{ }} 사용
    'vue/no-v-text': 'error',
    // ref 사용시 타입 지정
    'vue/require-typed-ref': 'error',
    // v-for 문에서 in 만 사용
    'vue/v-for-delimiter-style': ['error', 'in'],
    // v-if 에서 key 사용
    'vue/v-if-else-key': 'error',

    // /////////////////////////////////////////////////////////////////////////
    // `vue/vue3-recommended`: Extension Rules
    //  @see https://eslint.vuejs.org/rules/#extension-rules
    // /////////////////////////////////////////////////////////////////////////
    // 값 비교시 일치연산자(=== 이거나 !==)만 사용
    'vue/eqeqeq': 'error',
    // production에서 콘솔 사용 금지
    'vue/no-console': 'warn',
    // 'vue/no-console': import.meta.env.VITE_BASE_URL === 'production' ? 'warn' : 'off',

    // /////////////////////////////////////////////////////////////////////////
    // eslint-plugin-vuejs-accessibility : Overwrites
    // @see https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/
    // /////////////////////////////////////////////////////////////////////////
    // input 사용시 무조건 label 사용 끄기
    'vuejs-accessibility/form-control-has-label': 'off',
    // click 이벤트에 무조건 key 이벤트 사용 끄기
    'vuejs-accessibility/click-events-have-key-events': 'off',

    // /////////////////////////////////////////////////////////////////////////
    // `import/recommended`
    // @see https://github.com/import-js/eslint-plugin-import
    // /////////////////////////////////////////////////////////////////////////
    // import : 빈 블럭으로 가져오기 금지
    'import/no-empty-named-blocks': 'error',
    // export : var, let 금지
    'import/no-mutable-exports': 'error',
    // import : 가져온 모듈을 선택자로 사용 금지
    'import/no-named-as-default-member': 'error',
    // import : require, define 사용 금지
    'import/no-amd': 'error',
    // export : default export 선호 끄기
    'import/prefer-default-export': 'off',
    // 로컬 파일시스템의 모듈로 확인될 수 있는지 확인 끔
    'import/no-unresolved': 'off',
    // import 확장자 사용
    'import/extensions': ['error', 'ignorePackages', { vue: 'always' }],
    // import 상대경로 금지
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['.*'],
            message: '상대경로 import는 사용할 수 없습니다. alias(@views, @components 등)를 사용하세요.',
          },
          {
            group: ['@/views*'],
            message: '@/views 대신 @views를 사용하세요.',
          },
          {
            group: ['@/components*'],
            message: '@/components 대신 @components를 사용하세요.',
          },
          {
            group: ['@/assets*'],
            message: '@/assets 대신 @assets를 사용하세요.',
          },
        ],
      },
    ],
    // import 순서
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        // 오름차순 정렬, 대소문자 구분 하지 않음
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
    // import 정렬
    'sort-imports': [
      'error',
      {
        // 대문자 무시
        ignoreCase: true,
        // 변수나 함수의 순서가 import 정렬에 영향을 미치지 않음
        ignoreDeclarationSort: true,
        // 멤버 정렬 무시
        ignoreMemberSort: false,
        // 그룹화
        allowSeparatedGroups: true,
      },
    ],
  },
};
