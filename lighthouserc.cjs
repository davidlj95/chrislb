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
