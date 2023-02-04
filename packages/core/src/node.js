import createFontConfig from './fontconfig.js';
import fs from 'fs';

const libpath = new URL('../lib.wasm', import.meta.url);
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
  const WASI = await import('wasi');
  wasi = new WASI({args: process.argv, env: process.env});
  imports.wasi_snapshot_preview1 = wasi.wasiImport;
} catch (e) { /* not using WASI */ }

const wasm = await WebAssembly.instantiate(fs.readFileSync(libpath), imports);

if (wasi) wasi.initialize(wasm.instance);

export default async function () {
  return createFontConfig(wasm);
}
