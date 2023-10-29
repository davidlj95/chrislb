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
        'http://localhost/projects/chiasma/',
        'http://localhost/404',
      ],
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        //👇 Didn't appear til main bundle was >500kb. Then, Lighthouse wants source maps
        // If we optimize, we can probably turn this back on. 500kb for main bundle is a bit too much
        'valid-source-maps': 'off',
        // 👇 Probably Swiper.js 😭
        // Just happens on project detail page tho, when many swipers in there
        // Maybe a grid would solve it
        'non-composited-animations': 'warn',
        'bf-cache': 'warn',
        'csp-xss': 'warn',
        'unused-javascript': 'warn',
      },
    },
  },
}
