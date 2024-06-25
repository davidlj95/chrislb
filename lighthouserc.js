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
        'http://localhost/404/',
        'http://localhost/about/',
        'http://localhost/projects/chiasma/',
      ],
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        //👇 Didn't appear til main bundle was >500kb. Then, Lighthouse wants source maps
        // If we optimize, we can probably turn this back on. 500kb for main bundle is a bit too much
        // ~Now we're below 500kb, enabling it again by leaving it commented in case it's bigger~
        'valid-source-maps': 'off',
        // 👇 Probably Swiper.js 😭
        // Just happens on project detail page tho, when many swipers there
        // Maybe a grid would solve it
        'non-composited-animations': 'warn',
        'bf-cache': 'warn',
        'csp-xss': 'warn',
        'unused-javascript': 'warn',
      },
    },
  },
}
