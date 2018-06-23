[![Build Status](https://travis-ci.org/angular/clang-format.svg?branch=master)](https://travis-ci.org/angular/clang-format)

# clang-format
node.js module which wraps the native clang-format executable.

## From the command-line:

    $ npm install -g clang-format
    $ clang-format -help

If your platform isn't yet supported, you can create the native binary from
the latest upstream clang sources, make sure it is stripped and optimized
(should be about 1.4MB as of mid-2015) and send a pull request to add it.

## Checking formatting

Ensuring that changes to your code are properly formatted is an important part
of your development workflow. We recommend using a git pre-commit hook. You can
configure this as follows:

1. add a `precommit` script to your package.json file:

    ```js
    "scripts": {
        "precommit": "check-clang-format"
    }
    ```

    By default, the user gets an error instructing them to run
    `./node_modules/.bin/git-clang-format`. You may find it more ergonomic to set
    up a package.json script, eg.
    `"scripts": { "format": "git-clang-format" }`

    In this case, add a second argument to the "precommit" script, giving the
    error you'd like to print for users, eg.

    `"precommit": "check-clang-format \"yarn format\""`

2. Add a devDependency on the `husky` package, which will add a
  `.git/hooks/pre-commit` script, which in turn triggers the `precommit`
  package.json script to run whenever someone adds a commit in this repository:

    ```sh
    $ yarn add -D husky
    ```

    or

    ```sh
    npm install --save-dev husky
    ```

> Why do this in a pre-commit hook? For one thing, it's faster to run
  `clang-format` only on the changed files, especially as the repository grows.
  Also, this lets you upgrade `clang-format` or change your settings without
  needing to re-format the entire repository, while still enforcing that later
  changes follow the new style.

## Globbing files

    $ clang-format --glob=folder/**/*.js

This will run `clang-format` once per file result, and show the total
formatted files at the end.
See [node-glob](https://github.com/isaacs/node-glob) for globbing semantics.

## Compiling clang-format

For Linux, compile a statically linked MinSizeRel build:

    cmake -G Ninja -DCMAKE_BUILD_TYPE=MinSizeRel -DLLVM_BUILD_STATIC=true ..
    ninja clang-format

For Mac OS X, static linking is not required.

## Windows

Windows snapshot builds to include in the release can be found at the
[LLVM website](http://llvm.org/builds/).

Configure with:

    cmake -G "Visual Studio 12" -DCMAKE_BUILD_TYPE=MinSizeRel ..

In the generated Visual Studio project, search for the `clang-format` binary in
the Solution Explorer window, right click and choose Build.
