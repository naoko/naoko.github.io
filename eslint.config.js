import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['assets/js/main.js'],
    ignores: ['assets/js/plugins/**', 'assets/js/vendor/**', 'assets/js/_main.js', 'assets/js/scripts.min.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        IntersectionObserver: 'readonly',
        
        // Service Worker globals
        self: 'readonly',
        caches: 'readonly',
        clients: 'readonly',
        registration: 'readonly'
      }
    },
    rules: {
      // Best Practices
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Style
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      
      // ES6+
      'arrow-spacing': 'error',
      'no-duplicate-imports': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error'
    }
  }
];