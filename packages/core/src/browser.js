const FontConfig = require('./fontconfig');
const Buffer = require('buffer').Buffer;

// TODO let 'em specify from where
module.exports = function (fetchUrl) {
  return fetch(fetchUrl)
    .then(res => res.arrayBuffer())
    .then(buf => WebAssembly.instantiate(buf, {}))
    .then(FontConfig)
    .then(FontConfig => {
      return class BrowserFontConfig extends FontConfig {
        async loadBuffer(filename) {
          const ab = await fetch(filename).then(res => res.arrayBuffer());
          return Buffer.from(ab);
        }
      };
    });
};
