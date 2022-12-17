import FontConfigCtor from './fontconfig.js';
import {Buffer} from 'buffer';

export default async function (fetchUrl) {
  const array = await fetch(fetchUrl).then(res => res.arrayBuffer());
  const FontConfig = FontConfigCtor(await WebAssembly.instantiate(array, {}))
  return class BrowserFontConfig extends FontConfig {
    async loadBuffer(filename) {
      const ab = await fetch(filename).then(res => res.arrayBuffer());
      return Buffer.from(ab);
    }
  };
}
