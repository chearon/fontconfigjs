# fontconfigjs

This is essentially a stripped-down version of FontConfig compiled to WebAssembly with a Javascript API that works in nodejs and the browser.

The FontConfig source tree is mostly intact for ease of merging with future versions. 

## How?

```javascript
const FontConfig = await require('fontconfig');

FontConfig.addFont('/Library/Fonts/Comic Sans MS.ttf');
FontConfig.addFont('/Library/Fonts/Futura.ttc');
FontConfig.addFont('/Library/Fonts/GillSans.ttc');

FontConfig.sort({
  family: 'Gill Sans',
  weight: FontConfig.FC_WEIGHT_LIGHT
});

// returns this:
[
  { file: '/Library/Fonts/GillSans.ttc', index: 7 },
  { file: '/Library/Fonts/GillSans.ttc', index: 6 },
  { file: '/Library/Fonts/Comic Sans MS.ttf', index: 0 },
  { file: '/Library/Fonts/Futura.ttc', index: 2 }
]
```

Unlike the full FontConfig library, it does not read configuration files for font lookup rules or font search directories. The part of FontConfig for adding and querying fonts (the matching module) is exposed instead, which the Javascript wrapper makes calls to. At some point support for FontConfig [rules and aliases](https://www.freedesktop.org/software/fontconfig/fontconfig-user.html) (the configuration module) could be added. I don't expect it to be very useful since consumers of this library are typically adding and selecting fonts on their own, rather than users doing it.

Instead of using [FreeType](http://freetype.org) to read fonts, [fontkit](https://github.com/foliojs/fontkit) is used.

## API

### `FontConfig.sort(pattern)`

Returns the best possible cascade list of fonts based on a description (with later fonts suited to use when previous fonts don't have proper coverage).

The pattern object passed to `FontConfig.sort` looks like:

- `family` (string) (required)
- `weight` (number)
- `width` (number)
- `slant` (number)

For more details on the individual values, continue below.

#### Weights

- `FontConfig.FC_WEIGHT_THIN`
- `FontConfig.FC_WEIGHT_EXTRALIGHT`
- `FontConfig.FC_WEIGHT_ULTRALIGHT`
- `FontConfig.FC_WEIGHT_LIGHT`
- `FontConfig.FC_WEIGHT_DEMILIGHT`
- `FontConfig.FC_WEIGHT_SEMILIGHT`
- `FontConfig.FC_WEIGHT_BOOK`
- `FontConfig.FC_WEIGHT_REGULAR`
- `FontConfig.FC_WEIGHT_NORMAL`
- `FontConfig.FC_WEIGHT_MEDIUM`
- `FontConfig.FC_WEIGHT_DEMIBOLD`
- `FontConfig.FC_WEIGHT_SEMIBOLD`
- `FontConfig.FC_WEIGHT_BOLD`
- `FontConfig.FC_WEIGHT_EXTRABOLD`
- `FontConfig.FC_WEIGHT_ULTRABOLD`
- `FontConfig.FC_WEIGHT_BLACK`
- `FontConfig.FC_WEIGHT_HEAVY`
- `FontConfig.FC_WEIGHT_EXTRABLACK`
- `FontConfig.FC_WEIGHT_ULTRABLACK`

#### Widths

- `FontConfig.FC_WIDTH_ULTRACONDENSED`
- `FontConfig.FC_WIDTH_EXTRACONDENSED`
- `FontConfig.FC_WIDTH_CONDENSED`
- `FontConfig.FC_WIDTH_SEMICONDENSED`
- `FontConfig.FC_WIDTH_NORMAL`
- `FontConfig.FC_WIDTH_SEMIEXPANDED`
- `FontConfig.FC_WIDTH_EXPANDED`
- `FontConfig.FC_WIDTH_EXTRAEXPANDED`
- `FontConfig.FC_WIDTH_ULTRAEXPANDED`

#### Slants

- `FontConfig.FC_SLANT_ROMAN`
- `FontConfig.FC_SLANT_ITALIC`
- `FontConfig.FC_SLANT_OBLIQUE`

## Enabling debugging

Thanks to [WASI](https://wasi.dev), you can set the environment variable [`FC_DEBUG`](https://www.freedesktop.org/software/fontconfig/fontconfig-user.html)<sup>1</sup> just like regular font config. This will print information to stdout, but only if

1. You built with `-DWASI_RUNTIME` (see below)
2. You're using nodejs 13.3.0 or newer
3. You run nodejs with `--experimental-wasi-unstable-preview1 --experimental-wasm-bigint`

The WASM distributed in NPM is not built with debugging calls, though there are probably WASI runtimes available for web browsers.

<sup>1</sup>As of node 13.10 this doesn't seem to be implemented yet, so you have to manually edit `src/fcdbg.c` until it's fixed.

## Building the C parts

These instructions are for macOS, but they should be similar for Linux. The steps are familiar to anyone who has done cross-compilation before, but the first few are WebAssembly-specific.

1. `LLVM_PATH=/usr/local/Cellar/llvm/9.0.0/bin`. or somewhere else appropriate. You do need a recent version of LLVM that supports WebAssembly.
2. `git clone git@github.com:chearon/wasi-libc.git`. The upstream version builds with symbols that introduce runtime dependencies.
3. `cd wasi-libc`
4. `make WASM_CC=$LLVM_PATH/clang WASM_AR=$LLVM_PATH/llvm-ar WASM_NM=$LLVM_PATH/llvm-nm`
5. `WASI_SYSROOT=$(pwd)/sysroot`
6. Download [`wasi-sdk` builtins](https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-8/libclang_rt.builtins-wasm32-wasi-8.0.tar.gz) and copy `libclang_rt.builtins-wasm32.a` to `/usr/local/Cellar/llvm/9.0.0/lib/clang/9.0.0/lib/wasi/` (or wherever you installed your compiler in step 1).
7. `export LIBTOOLIZE=glibtoolize` (these next 3 steps might be macOS-specific)
8. `export GETTEXTIZE=/usr/local/opt/gettext/bin/gettextize`
9. `export AUTOPOINT=/usr/local/opt/gettext/bin/autopoint`
10. `export CC=$LLVM_PATH/clang`
11. `export CFLAGS=-target wasm32-wasi --sysroot=$WASI_SYSROOT` (for debugging, you can also add `-DWASI_RUNTIME` to see FontConfig logging)
12. `export AR=$LLVM_PATH/llvm-ar`
13. `export RANLIB=$LLVM_PATH/llvm-ranlib`
14. Patch config.sub: `grep -q -F -- '-wasi' config.sub || sed -i -e 's/-nacl\*)/-nacl*|-wasi)/' config.sub` (thank you so much, [Frank Denis](https://00f.net/2019/04/07/compiling-to-webassembly-with-llvm-and-clang/))
15. `./autogen.sh --host=wasm32-wasi`
16. `make`
17. `$LLVM_PATH/wasm-ld  -L$WASI_SYSROOT/lib/wasm32-wasi --no-entry --export-all -lc --whole-archive src/.libs/libfontconfig.a -o ../lib.wasm`
