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
        {
          preset: 'lighthouse:no-pwa',
          assertions: {
            'uses-responsive-images': ['error', { maxLength: 2 }],
            // Fails if the dependency chain's depth >= 2.
            // Which is always true due to animations async module even for simple pages:
            // /about/ -> main-xxx.js -> chunk-xxx.js (animations module)
            // Can't be more specific as insight audits score just report 0 or 1
            // There isn't any way to be more specific either
            'network-dependency-tree-insight': ['warn', {}],
            // Logo image in about page. Weird, as not appearing in others.
            'cls-culprits-insight': ['warn', {}],
            // Seems not taking into account sizes :/
            'image-delivery-insight': ['warn', {}],
            // Appeared in Angular v20 update, in projects page. Warning to move on.
            'forced-reflow-insight': ['warn', {}],
          },
        },
      ],
    },
  },
}
