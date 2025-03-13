const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat')

const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const _import = require('eslint-plugin-import')
const mocha = require('eslint-plugin-mocha')
const jsxA11Y = require('eslint-plugin-jsx-a11y')
const globals = require('globals')
const babelParser = require('@babel/eslint-parser')
const js = require('@eslint/js')

const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

module.exports = [
  {
    ignores: ['**/public/', '**/node_modules/'],
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:jsx-a11y/recommended',
      'plugin:prettier/recommended',
      'plugin:import/recommended',
      'prettier'
    )
  ),
  {
    files: ['**/*.jsx', '**/*.js'],
    plugins: {
      react,
      'react-hooks': fixupPluginRules(reactHooks),
      import: fixupPluginRules(_import),
      mocha,
      'jsx-a11y': fixupPluginRules(jsxA11Y),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: babelParser,
      ecmaVersion: 6,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      'import/extensions': ['.js', '.jsx'],

      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      'no-async-promise-executor': 'off',
      'no-case-declarations': 'off',
      'no-prototype-builtins': 'off',

      'no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
        },
      ],

      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'node/no-deprecated-api': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react/prefer-stateless-function': 'off',
      'react/no-multi-comp': 'off',
      'react/forbid-prop-types': 'off',
      'react/jsx-boolean-value': ['error', 'always'],
      'react/jsx-one-expression-per-line': 'off',
      'object-curly-newline': 'off',
      'no-else-return': 'off',
      'arrow-body-style': 'off',
      'dot-notation': 'error',
      'mocha/no-exclusive-tests': 'error',

      'import/newline-after-import': [
        'error',
        {
          count: 1,
        },
      ],

      'eol-last': 'error',

      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
        },
      ],

      'no-undef': 'error',

      'no-console': [
        'error',
        {
          allow: ['assert'],
        },
      ],

      'import/order': [
        'error',
        {
          groups: [['builtin', 'external']],
          'newlines-between': 'always-and-inside-groups',
        },
      ],

      'no-duplicate-imports': 'error',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',

      'no-restricted-imports': [
        'error',
        {
          name: '@faker-js/faker',
          message:
            'Use the pseudo-random `faker` from `test/sandbox/utils/random.js`',
        },
        {
          name: 'json-schema-faker',
          message:
            'Use the pseudo-random `jsf` from `test/sandbox/utils/random.js`',
        },
      ],
    },
  },
  {
    files: ['**/**.test.{js,jsx}'],

    languageOptions: {
      globals: {
        ...globals.mocha,
        ...globals.browser,
        JSDOM: true,
        formMacros: true,
        expect: true,
        proxyquire: true,
        sinon: true,
        nock: true,
        rootPath: true,
        globalReq: true,
        globalRes: true,
      },
    },

    rules: {
      'no-unused-expressions': 0,
    },
  },
  {
    files: ['/test/sandbox/*'],
    languageOptions: {
      globals: {
        ...globals.node,
        Sandbox: true,
        state: true,
        _: true,
      },

      parser: babelParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'no-var': 0,
      'func-names': 0,
      'global-require': 0,
    },
  },
  {
    files: [
      '**/*.cy.jsx',
      '**/*-spec.js',
      'test/**/**/support/*.js',
      'test/unit/**/*.js',
      'test/sandbox/routes/**/*.js',
      'test/**/cypress/**/**/*.js',
    ],
    rules: {
      'no-undef': 'off',
    },
  },
]
