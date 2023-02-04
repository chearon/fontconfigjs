import createFontConfig from './fontconfig.js';

export default async function (fetchUrl) {
  const array = await fetch(fetchUrl).then(res => res.arrayBuffer());
  return createFontConfig(await WebAssembly.instantiate(array, {}))
}
