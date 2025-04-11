module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      numberOfRuns: 3,
      staticDistDir: process.env.CI ? '.' : 'dist/chrislb/browser',
      url: [
        'http://localhost/',
        'http://localhost/about/',
        'http://localhost/projects/chiasma/',
      ],
    },
    assert: {
      assertMatrix: [
        // All pages
        {
          matchingUrlPattern: '.*',
          preset: 'lighthouse:no-pwa',
          assertions: {
            'uses-responsive-images': 'off',
            'total-byte-weight': 'off',
          },
        },
        // Non-project detail
        {
          matchingUrlPattern: '^((?!\\/projects\\/.+).)*$',
          assertions: {
            'uses-responsive-images': ['error', { maxLength: 1 }],
            'total-byte-weight': 'error',
          },
        },
        // Project detail
        {
          matchingUrlPattern: '.+\/projects\/.+',
          assertions: {
            'uses-responsive-images': ['error', { maxLength: 5 }],
            'total-byte-weight': 'warn',
          },
        },
      ],
    },
  },
}
