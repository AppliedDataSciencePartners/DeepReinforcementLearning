#!/usr/bin/env node
/**
 * @fileoverview This script provides the glue to run git-clang-format as a pre-
 * commit hook.
 *
 * It checks that your git configuration is correct, and wraps the
 * git-clang-format program by simply exiting with non-zero exit code if any
 * changes are not already formatted correctly.
 *
 * To install it, see the instructions in the README.md.
 */

const spawn = require('child_process').spawnSync;
const path = require('path');

function checkGitConfig() {
  const spawn_opts = {encoding: 'utf-8', stdio: ['pipe', 'pipe', 'inherit']};
  const binary =
      spawn('git', ['config', '--get', 'clangFormat.binary'], spawn_opts)
          .stdout.trim();
  const style =
      spawn('git', ['config', '--get', 'clangFormat.style'], spawn_opts)
          .stdout.trim();
  var gitConfigWrong = false;

  if (binary !== 'node_modules/.bin/clang-format') {
    console.error(`
      ERROR: Found git config --get clangFormat.binary = "${binary}"
      This can result in running a different version of clang-format than your
      co-workers, leading to inconsistent formatting.`);
    gitConfigWrong = true;
  }
  if (style !== 'file') {
    console.error(`
      ERROR: Found git config --get clangFormat.style = "${style}"
      The style should be set so that the settings in .clang-format are used.`);
    gitConfigWrong = true;
  }
  if (gitConfigWrong) {
    console.error(`
      ERROR: You need to configure git-clang-format:
      $ git config clangFormat.binary node_modules/.bin/clang-format
      $ git config clangFormat.style file`);
    return 2;
  }
  return 0;
}

function main(args) {
  try {
    var clangFormatPath = path.dirname(require.resolve('clang-format'));
    var configCheck = checkGitConfig();

    if (configCheck !== 0) return configCheck;
  } catch (e) {
    // When running the git-clang-format on ourselves, it's located in a
    // different place
    var clangFormatPath = '.';
    // And we don't run the configCheck, because the clang-format binary is also
    // in a different place
  }

  const gitClangFormatPath = path.join(clangFormatPath, 'bin/git-clang-format');
  const result = spawn(gitClangFormatPath, ['--diff'], {encoding: 'utf-8'});

  if (result.error) {
    console.error('Error running git-clang-format:', result.error);
    return 2;
  }

  const clangFormatOutput = result.stdout.trim();
  if (clangFormatOutput !== ('no modified files to format') &&
      clangFormatOutput !== ('clang-format did not modify any files')) {
    console.error(clangFormatOutput);
    const fixCmd = args[0] || './node_modules/.bin/git-clang-format';
    console.error(`
      ERROR: please run ${fixCmd} to format changes in your commit`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
