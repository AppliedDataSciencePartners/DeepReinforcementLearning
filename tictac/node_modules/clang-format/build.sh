#!/bin/sh

TARGET="$(dirname $0)/bin"
LINUX_HOST=wurstbrot.mtv.corp.google.com
LINUX_HOST=mops.muc.corp.google.com
echo Building to $TARGET

set -e

pushd ~/lsrc/llvm/tools/clang
echo Updating clang
git co master && git pull
popd

pushd ~/lsrc/llvm
echo Updating LLVM
git co master && git pull
popd

mkdir -p ~/lsrc/llvm/build.release
pushd ~/lsrc/llvm/build.release

echo === Building based on r$(git log -n 1 | grep 'git-svn-id' | sed -e 's|.*@\([0-9]*\).*|\1|') ...
cmake -G Ninja -DCMAKE_BUILD_TYPE=Release ..
ninja clang-format
popd

cp ~/lsrc/llvm/build.release/bin/clang-format $TARGET/darwin_x64/clang-format
cp ~/lsrc/llvm/tools/clang/tools/clang-format/git-clang-format $TARGET/
echo New release copied.

ssh $LINUX_HOST << EOF
  echo Building on $LINUX_HOST
  set -e
  pushd ~/src/llvm/tools/clang
  echo Updating clang
  git co master && git pull
  popd

  pushd ~/src/llvm
  echo Updating LLVM
  git co master && git pull
  popd

  mkdir -p ~/src/llvm/build.release
  pushd ~/src/llvm/build.release
  echo === Building based on r\$(git log -n 1 | grep 'git-svn-id' | sed -e 's|.*@\([0-9]*\).*|\1|') ...
  cmake -G Ninja -DCMAKE_BUILD_TYPE=Release -DLLVM_BUILD_STATIC=true ..
  ninja clang-format
  popd
EOF

scp $LINUX_HOST:src/llvm/build.release/bin/clang-format $TARGET/linux_x64/clang-format

echo All done.
