module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage',
      url: ['http://localhost/'],
    },
    collect: {
      staticDistDir: process.env.CI ? '.' : 'dist/chrislb/browser',
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'meta-description': 'warn',
        'bf-cache': 'warn',
        'csp-xss': 'warn',
        'unused-javascript': 'warn',
        'uses-responsive-images': 'warn',
      },
    },
  },
}
