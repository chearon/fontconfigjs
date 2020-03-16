# fontconfigjs

This is essentially a stripped-down version of FontConfig compiled to WebAssembly with a Javascript API that works in nodejs and the browser.

The FontConfig source tree is mostly intact for ease of merging with future versions. 

## How?

```javascript
const FontConfig = await require('fontconfig');

FontConfig.addFont('/Library/Fonts/Comic Sans MS.ttf');
FontConfig.addFont('/Library/Fonts/Futura.ttc');
FontConfig.addFont('/Library/Fonts/GillSans.ttc');

FontConfig.sort({family: "Gill Sans"});

// returns this:
[
  { file: '/Library/Fonts/GillSans.ttc', index: 2 },
  { file: '/Library/Fonts/GillSans.ttc', index: 7 },
  { file: '/Library/Fonts/GillSans.ttc', index: 6 },
  { file: '/Library/Fonts/Futura.ttc', index: 4 },
  { file: '/Library/Fonts/Futura.ttc', index: 2 },
  { file: '/Library/Fonts/Comic Sans MS.ttf', index: 0 }
]
```

Unlike the full FontConfig library, it does not read configuration files for font lookup rules or font search directories. The FontConfig APIs for adding fonts and querying fonts are exposed instead, which the Javascript wrapper makes calls to.

Instead of using [FreeType](http://freetype.org) to read fonts, [fontkit](https://github.com/foliojs/fontkit) is used.

## Building the C parts

These instructions are for macOS, but they should be similar for Linux. The steps are familiar to anyone who has done cross-compilation before, but the first few are WebAssembly-specific.

1. `LLVM_PATH=/usr/local/Cellar/llvm/9.0.0/bin`. or somewhere else appropriate. You do need a recent version of LLVM that supports WebAssembly.
2. `git clone git@github.com:chearon/wasi-libc.git`. The upstream version builds with symbols that introduce runtime dependencies.
3. `cd wasi-libc`
4. `make WASM_CC=$LLVM_PATH/clang WASM_AR=$LLVM_PATH/llvm-ar WASM_NM=$LLVM_PATH/llvm-nm`
5. `WASI_SYSROOT=$(pwd)/sysroot
6. Download [`wasi-sdk` builtins](https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-8/libclang_rt.builtins-wasm32-wasi-8.0.tar.gz) and copy `libclang_rt.builtins-wasm32.a` to `/usr/local/Cellar/llvm/9.0.0/lib/clang/9.0.0/lib/wasi/` (or wherever you installed your compiler in step 1).
7. `export LIBTOOLIZE=glibtoolize` (these next 3 steps might be macOS-specific)
8. `export GETTEXTIZE=/usr/local/opt/gettext/bin/gettextize`
9. `export AUTOPOINT=/usr/local/opt/gettext/bin/autopoint`
10. `export CC=$LLVM_PATH/clang`
11. `export CFLAGS=-target wasm32-wasi --sysroot=$WASI_SYSROOT` (for debugging, you can also add -DWASI_RUNTIME` to see FontConfig logging)
12. `export AR=$LLVM_PATH/llvm-ar`
13. `export RANLIB=$LLVM_PATH/llvm-ranlib`
14. Patch config.sub: `grep -q -F -- '-wasi' config.sub || sed -i -e 's/-nacl\*)/-nacl*|-wasi)/' config.sub` (thank you so much, [Frank Denis](https://00f.net/2019/04/07/compiling-to-webassembly-with-llvm-and-clang/))
15. `./autogen.sh --host=wasm32-wasi`
16. `make`
17. `$LLVM_PATH/wasm-ld  -L$WASI_SYSROOT/lib/wasm32-wasi --no-entry --export-all -lc --whole-archive src/.libs/libfontconfig.a -o ../lib.wasm`
