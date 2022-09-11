const base = [
  './features/**/*.feature',
  '--publish-quiet',
  `--format '@serenity-js/cucumber'`,
  '--require features/stepdefs/**/*.js',
].join(' ');

const generate = [base, `--format snippets:new.ts`].join(' ');

const debug = [base, `--tags @debug`].join(' ');

module.exports = {
  default: base,
  generate: generate,
  debug: debug,
};
