module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      // Temporarily disable until an issue gets resolved
      // https://github.com/GoogleChrome/lighthouse/issues/16513
      numberOfRuns: 0,
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
            'uses-responsive-images': ['error', { maxLength: 2 }],
          },
        },
        // Non-project detail
        {
          matchingUrlPattern: '^((?!\\/projects\\/.+).)*$',
          assertions: {},
        },
        // Project detail
        {
          matchingUrlPattern: '.+\/projects\/.+',
          assertions: {},
        },
      ],
    },
  },
}
