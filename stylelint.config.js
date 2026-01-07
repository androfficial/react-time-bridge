/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: ['stylelint-order'],
  rules: {
    // Order rules
    'order/order': [
      'custom-properties',
      'dollar-variables',
      'at-variables',
      'declarations',
      'rules',
      'at-rules',
    ],

    // Allow Tailwind directives
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'config',
          'theme',
          'custom-variant',
          'utility',
          'source',
          'plugin',
        ],
      },
    ],

    // Allow CSS functions
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'screen'],
      },
    ],

    // Disable rules that conflict with Tailwind
    'import-notation': null,

    // Allow custom properties
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [],
      },
    ],

    // Selector rules
    'selector-class-pattern': null,

    // Value rules
    'value-keyword-case': [
      'lower',
      {
        ignoreFunctions: ['theme'],
        ignoreProperties: ['font-family'],
      },
    ],

    // Declaration rules
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['flex-flow', 'grid-template'],
      },
    ],

    // Color rules
    'color-function-notation': 'modern',
    'alpha-value-notation': 'percentage',

    // Length rules
    'length-zero-no-unit': true,

    // Shorthand rules
    'shorthand-property-no-redundant-values': true,
  },
  ignoreFiles: ['dist/**/*', 'node_modules/**/*'],
};
