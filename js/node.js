const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');
const FontConfig = require('./fontconfig');

const imports = {};

// Provide WASI runtime if node has the arguments
//
// --experimental-wasi-unstable-preview1 --experimental-wasm-bigint
//
// This wires printf() and getenv() in the C code to the operating system.
// Must be built with -DWASI_RUNTIME or else no WASI calls will be made
// (this mode is for the browser).
let wasi;
try {
	const {WASI} = require('wasi');
	wasi = new WASI({args: process.argv, env: process.env});
	imports.wasi_snapshot_preview1 = wasi.wasiImport;
} catch (e) {
	console.log('Not using WASI');
}

const libpath = path.join(__dirname, '..', 'lib.wasm');
module.exports = WebAssembly.instantiate(fs.readFileSync(libpath), imports)
  .then(wasm => {
    if (wasi) wasi.start(wasm.instance);
		return new FontConfig(wasm);
	});
