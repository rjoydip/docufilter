module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {},
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['PROJ-']
    }
  }
}
