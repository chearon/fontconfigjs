const fontkit = require('fontkit');
const FcConstants = require('./constants');

const FcResultMatch = 0;
const FcResultNoMatch = 1;
const FcResultTypeMismatch = 2;
const FcResultNoId = 3;
const FcResultOutOfMemory = 4;

const FC_FAMILY_OBJECT          = 1;
const FC_FAMILYLANG_OBJECT      = 2;
const FC_STYLE_OBJECT           = 3;
const FC_STYLELANG_OBJECT       = 4;
const FC_FULLNAME_OBJECT        = 5;
const FC_FULLNAMELANG_OBJECT    = 6;
const FC_SLANT_OBJECT           = 7;
const FC_WEIGHT_OBJECT          = 8;
const FC_WIDTH_OBJECT           = 9;
const FC_SIZE_OBJECT            = 10;
const FC_ASPECT_OBJECT          = 11;
const FC_PIXEL_OBJECT_SIZE      = 12;
const FC_SPACING_OBJECT         = 13;
const FC_FOUNDRY_OBJECT         = 14;
const FC_ANTIALIAS_OBJECT       = 15;
const FC_HINT_OBJECT_STYLE      = 16;
const FC_HINTING_OBJECT         = 17;
const FC_VERTICAL_OBJECT_LAYOUT = 18;
const FC_AUTOHINT_OBJECT        = 19;
const FC_GLOBAL_OBJECT_ADVANCE  = 20;
const FC_FILE_OBJECT            = 21;
const FC_INDEX_OBJECT           = 22;
const FC_RASTERIZER_OBJECT      = 23;
const FC_OUTLINE_OBJECT         = 24;
const FC_SCALABLE_OBJECT        = 25;
const FC_DPI_OBJECT             = 26;
const FC_RGBA_OBJECT            = 27;
const FC_SCALE_OBJECT           = 28;
const FC_MINSPACE_OBJECT        = 29;
const FC_CHARWIDTH_OBJECT       = 30;
const FC_CHAR_OBJECT_HEIGHT     = 31;
const FC_MATRIX_OBJECT          = 32;
const FC_CHARSET_OBJECT         = 33;
const FC_LANG_OBJECT            = 34;
const FC_FONTVERSION_OBJECT     = 35;
const FC_CAPABILITY_OBJECT      = 36;
const FC_FONTFORMAT_OBJECT      = 37;
const FC_EMBOLDEN_OBJECT        = 38;
const FC_EMBEDDED_OBJECT_BITMAP = 39;
const FC_DECORATIVE_OBJECT      = 40;
const FC_LCD_OBJECT_FILTER      = 41;
const FC_NAMELANG_OBJECT        = 42;
const FC_FONT_OBJECT_FEATURES   = 43;
const FC_PRGNAME_OBJECT         = 44;
const FC_HASH_OBJECT            = 45;
const FC_POSTSCRIPT_OBJECT_NAME = 46;
const FC_COLOR_OBJECT           = 47;
const FC_SYMBOL_OBJECT          = 48;
const FC_FONT_OBJECT_VARIATIONS = 49;
const FC_VARIABLE_OBJECT        = 50;
const FC_FONT_OBJECT_HAS_HINT   = 51;

const Os2WidthToFcWidth = {
  1: FcConstants.FC_WIDTH_ULTRACONDENSED,
  2: FcConstants.FC_WIDTH_EXTRACONDENSED,
  3: FcConstants.FC_WIDTH_CONDENSED,
  4: FcConstants.FC_WIDTH_SEMICONDENSED,
  5: FcConstants.FC_WIDTH_NORMAL,
  6: FcConstants.FC_WIDTH_SEMIEXPANDED,
  7: FcConstants.FC_WIDTH_EXPANDED,
  8: FcConstants.FC_WIDTH_EXTRAEXPANDED,
  9: FcConstants.FC_WIDTH_ULTRAEXPANDED
};

if (typeof TextEncoder === 'undefined') { //nodejs
  const {TextEncoder, TextDecoder} = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// See FcStrContainsIgnoreCase in fcstr.c
function strContainsIgnoreCase(s1, s2) {
  return s1.replace(/ /g, '').toLowerCase().indexOf(s2) > -1;
}

// See FcContainsWeight in fcfreetype.c
function containsWeight(s) {
  if (strContainsIgnoreCase(s, 'thin')) return FcConstants.FC_WEIGHT_THIN;
  if (strContainsIgnoreCase(s, 'extralight')) return FcConstants.FC_WEIGHT_EXTRALIGHT;
  if (strContainsIgnoreCase(s, 'ultralight')) return FcConstants.FC_WEIGHT_ULTRALIGHT;
  if (strContainsIgnoreCase(s, 'demilight')) return FcConstants.FC_WEIGHT_DEMILIGHT;
  if (strContainsIgnoreCase(s, 'semilight')) return FcConstants.FC_WEIGHT_SEMILIGHT;
  if (strContainsIgnoreCase(s, 'light')) return FcConstants.FC_WEIGHT_LIGHT;
  if (strContainsIgnoreCase(s, 'book')) return FcConstants.FC_WEIGHT_BOOK;
  if (strContainsIgnoreCase(s, 'regular')) return FcConstants.FC_WEIGHT_REGULAR;
  if (strContainsIgnoreCase(s, 'normal')) return FcConstants.FC_WEIGHT_NORMAL;
  if (strContainsIgnoreCase(s, 'medium')) return FcConstants.FC_WEIGHT_MEDIUM;
  if (strContainsIgnoreCase(s, 'demibold')) return FcConstants.FC_WEIGHT_DEMIBOLD;
  if (strContainsIgnoreCase(s, 'demi')) return FcConstants.FC_WEIGHT_DEMIBOLD;
  if (strContainsIgnoreCase(s, 'semibold')) return FcConstants.FC_WEIGHT_SEMIBOLD;
  if (strContainsIgnoreCase(s, 'extrabold')) return FcConstants.FC_WEIGHT_EXTRABOLD;
  if (strContainsIgnoreCase(s, 'superbold')) return FcConstants.FC_WEIGHT_EXTRABOLD;
  if (strContainsIgnoreCase(s, 'ultrabold')) return FcConstants.FC_WEIGHT_EXTRABOLD;
  if (strContainsIgnoreCase(s, 'bold')) return FcConstants.FC_WEIGHT_BOLD;
  if (strContainsIgnoreCase(s, 'ultrablack')) return FcConstants.FC_WEIGHT_EXTRABLACK;
  if (strContainsIgnoreCase(s, 'superblack')) return FcConstants.FC_WEIGHT_EXTRABLACK;
  if (strContainsIgnoreCase(s, 'extrablack')) return FcConstants.FC_WEIGHT_EXTRABLACK;
  // TODO ultra?
  if (strContainsIgnoreCase(s, 'black')) return FcConstants.FC_WEIGHT_BLACK;
  if (strContainsIgnoreCase(s, 'heavy')) return FcConstants.FC_WEIGHT_HEAVY;
  return -1;
}

// See FcContainsWidth in fcfreetype.c
function containsWidth(s) {
  if (strContainsIgnoreCase(s, 'ultracondensed')) return FcConstants.FC_WIDTH_ULTRACONDENSED;
  if (strContainsIgnoreCase(s, 'extracondensed')) return FcConstants.FC_WIDTH_EXTRACONDENSED;
  if (strContainsIgnoreCase(s, 'semicondensed')) return FcConstants.FC_WIDTH_SEMICONDENSED;
  if (strContainsIgnoreCase(s, 'condensed')) return FcConstants.FC_WIDTH_CONDENSED;
  if (strContainsIgnoreCase(s, 'normal')) return FcConstants.FC_WIDTH_NORMAL;
  if (strContainsIgnoreCase(s, 'semiexpanded')) return FcConstants.FC_WIDTH_SEMIEXPANDED;
  if (strContainsIgnoreCase(s, 'ultraexpanded')) return FcConstants.FC_WIDTH_ULTRAEXPANDED;
  if (strContainsIgnoreCase(s, 'expanded')) return FcConstants.FC_WIDTH_EXPANDED;
  return -1;
}

// See FcContainsSlant in fcfreetype.c
function containsSlant(s) {
  if (strContainsIgnoreCase(s, 'italic')) return FcConstants.FC_SLANT_ITALIC;
  if (strContainsIgnoreCase(s, 'kursiv')) return FcConstants.FC_SLANT_ITALIC;
  if (strContainsIgnoreCase(s, 'oblique')) return FcConstants.FC_SLANT_OBLIQUE;
  return -1;
}

// See FcContainsDecorative in fcfreetype.c
function containsDecorative(s) {
  if (strContainsIgnoreCase(s, 'shadow')) return true;
  if (strContainsIgnoreCase(s, 'caps')) return true;
  if (strContainsIgnoreCase(s, 'antiqua')) return true;
  if (strContainsIgnoreCase(s, 'romansc')) return true;
  if (strContainsIgnoreCase(s, 'embosed')) return true;
  if (strContainsIgnoreCase(s, 'dunhill')) return true;
  return false;
}

// returns the 4 Han languages FontConfig looks for
// (search for exclusiveLang in src/freetype.c to find equivalent code)
function getExclusiveLang([codePageRange1]) {
  const bits17to20 = codePageRange1 & 0x1E0000;
  if (codePageRange1 & 1 << 17 === bits17to20) return 'ja';
  if (codePageRange1 & 1 << 18 === bits17to20) return 'zh-cn';
  if (codePageRange1 & 1 << 19 === bits17to20) return 'ko';
  if (codePageRange1 & 1 << 20 === bits17to20) return 'zh-tw';
}

module.exports = function (wasm) {
  const {
    FcConfigCreate,
    FcPatternCreate,
    FcPatternObjectAddString,
    FcPatternObjectGetString,
    FcPatternObjectAddCharSet,
    FcPatternObjectAddLangSet,
    FcPatternObjectAddDouble,
    FcPatternObjectAddBool,
    FcPatternObjectAddInteger,
    FcPatternObjectGetInteger,
    FcConfigSubstitute,
    FcDefaultSubstitute,
    FcFontSort,
    FcFontSetDestroy,
    FcInitDebug,
    FcConfigAddFile,
    FcCharSetAddChar,
    FcCharSetCreate,
    FcCharSetDestroy,
    FcCharSetHasChar,
    FcLangSetCreate,
    FcLangSetAdd,
    FcLangSetDestroy,
    FcFreeTypeLangSet, // TODO naming here... it doesn't use FT at all
    FcWeightFromOpenTypeDouble,
    malloc,
    free,
    memory
  } = wasm.instance.exports;

  FcInitDebug();

  // A 'register' re-used often for pointer sharing
  const u32p = malloc(4);

  function buf() {
    return memory.buffer;
  }

  function smalloc(str) {
    const utf8 = new TextEncoder().encode(str);
    const ptr = malloc(utf8.length + 1);
    const a = new Uint8Array(buf(), ptr, utf8.length + 1);
    for (let i = 0; i < utf8.length; ++i) a[i] = utf8[i];
    a[utf8.length] = 0;
    return ptr;
  }

  class Coverage {
    constructor(cset) {
      this.cset = cset;
    }

    done() {
      this.isDone = true;
      free(this.cset);
    }

    has(c) {
      if (this.isDone) throw new Error('done() was called');
      return FcCharSetHasChar(this.cset, c);
    }
  }

  class Cascade {
    constructor(matches, coverage) {
      this.matches = matches;
      this.coverage = coverage;
    }
  }

  class FontConfig extends FcConstants {
    constructor() {
      super();
      this._cfg = FcConfigCreate();
    }

    async addFont(filename) {
      const sfilename = smalloc(filename);
      let raw;

      // Will throw if the file is invalid/unsupported/doesn't exist
      try {
        const buf = await this.loadBuffer(filename);
        raw = fontkit.create(buf);
      } catch (e) {
        free(sfilename);
        throw e;
      }

      const jsfonts = raw.fonts ? raw.fonts : [raw];

      for (const [index, jsfont] of jsfonts.entries()) {
        const fnt = FcPatternCreate();

        // Family
        if ('fontFamily' in jsfont.name.records) {
          for (const [lang, text] of Object.entries(jsfont.name.records.fontFamily)) {
            const pt = smalloc(text.toString());
            const pl = smalloc(lang.toString());
            FcPatternObjectAddString(fnt, FC_FAMILY_OBJECT, pt);
            FcPatternObjectAddString(fnt, FC_FAMILYLANG_OBJECT, pl);
            free(pt);
            free(pl);
          }
        }

        // Fullname
        if ('fullName' in jsfont.name.records) {
          for (const [lang, text] of Object.entries(jsfont.name.records.fullName)) {
            const pt = smalloc(text.toString());
            const pl = smalloc(lang.toString());
            FcPatternObjectAddString(fnt, FC_FULLNAME_OBJECT, pt);
            FcPatternObjectAddString(fnt, FC_FULLNAMELANG_OBJECT, pl);
            free(pt);
            free(pl);
          }
        }

        // Style
        if ('fontSubfamily' in jsfont.name.records) {
          for (const [lang, text] of Object.entries(jsfont.name.records.fontSubfamily)) {
            const pt = smalloc(text.toString());
            const pl = smalloc(lang.toString());
            FcPatternObjectAddString(fnt, FC_STYLE_OBJECT, pt);
            FcPatternObjectAddString(fnt, FC_STYLELANG_OBJECT, pl);
            free(pt);
            free(pl);
          }
        }

        // Charset
        const cset = FcCharSetCreate();
        let characterSet;

        // Not all fonts have cmap, fontkit can throw an error here
        try { characterSet = jsfont.characterSet; } catch (e) {}

        if (characterSet) {
          for (const c of jsfont.characterSet) FcCharSetAddChar(cset, c);
          FcPatternObjectAddCharSet(fnt, FC_CHARSET_OBJECT, cset);
        }

        // Langset
        const exclusiveLang = getExclusiveLang(jsfont['OS/2'].codePageRange);
        const exclusiveLangPtr = exclusiveLang ? smalloc(exclusiveLang) : 0;
        const lset = FcFreeTypeLangSet(cset, exclusiveLangPtr);
        FcPatternObjectAddLangSet(fnt, FC_LANG_OBJECT, lset);
        FcLangSetDestroy(lset);
        FcCharSetDestroy(cset);
        if (exclusiveLangPtr) free(exclusiveLangPtr);

        // Weight, width from tables
        let weight = FcWeightFromOpenTypeDouble(jsfont['OS/2'].usWeightClass);
        let width = Os2WidthToFcWidth[jsfont['OS/2'].usWidthClass] || -1;
        let slant = -1;
        let decorative = false;

        for (let i = 0; FcPatternObjectGetString(fnt, FC_STYLE_OBJECT, i, u32p) === FcResultMatch; ++i) {
          const sptr = new Uint32Array(buf(), u32p, 1)[0];
          const sraw = new Uint8Array(buf(), sptr);
          const utf8 = new Uint8Array(buf(), sptr, sraw.indexOf(0));
          const style = new TextDecoder().decode(utf8);

          if (weight < 0) weight = containsWeight(style);
          if (width < 0) width = containsWidth(style);
          if (slant < 0) slant = containsSlant(style);
          if (!decorative) decorative = containsDecorative(style);
        }

        // Guarantee slant, final lowest priority values
        if (slant < 0) {
          slant = FcConstants.FC_SLANT_ROMAN;
          if (jsfont['OS/2'].fsSelection.italic) {
            slant = FcConstants.FC_SLANT_ITALIC;
          }
        }

        // Guarantee weight, final lowest priority values
        if (weight < 0) {
          weight = FcConstants.FC_WEIGHT_MEDIUM;
          if (jsfont['OS/2'].fsSelection.bold) {
            weight = FcConstants.FC_WEIGHT_BOLD;
          }
        }

        // Guarantee width
        if (width < 0) width = FcConstants.FC_WIDTH_NORMAL;

        // TODO if no family name, use filename
        // TODO if no fullname, use family name, style name

        // Apply
        FcPatternObjectAddString(fnt, FC_FILE_OBJECT, sfilename);
        FcPatternObjectAddDouble(fnt, FC_WEIGHT_OBJECT, weight);
        FcPatternObjectAddDouble(fnt, FC_WIDTH_OBJECT, width);
        FcPatternObjectAddDouble(fnt, FC_SLANT_OBJECT, slant);
        FcPatternObjectAddBool(fnt, FC_DECORATIVE_OBJECT, decorative);
        FcPatternObjectAddInteger(fnt, FC_INDEX_OBJECT, index);

        // Finish configuration and add the file
        FcConfigSubstitute(this._cfg, fnt, 0 /*FcMatchPattern*/);
        FcDefaultSubstitute(fnt);
        FcConfigAddFile(this._cfg, fnt);
      }

      free(sfilename);
    }

    sort(fontspec, options) {
      const pat = FcPatternCreate();
      const matches = [];

      if (typeof fontspec !== 'object' || typeof fontspec.family !== 'string') {
        throw new Error('Pass an object with at least {family: string}');
      }

      const familyPtr = smalloc(fontspec.family);
      FcPatternObjectAddString(pat, FC_FAMILY_OBJECT, familyPtr);
      free(familyPtr);

      if ('weight' in fontspec) {
        FcPatternObjectAddDouble(pat, FC_WEIGHT_OBJECT, fontspec.weight);
      }

      if ('width' in fontspec) {
        FcPatternObjectAddInteger(pat, FC_WIDTH_OBJECT, fontspec.width);
      }

      if ('slant' in fontspec) {
        FcPatternObjectAddInteger(pat, FC_SLANT_OBJECT, fontspec.slant);
      }

      if ('coverage' in fontspec) {
        const cset = FcCharSetCreate();
        for (const c of fontspec.coverage) FcCharSetAddChar(cset, c);
        FcPatternObjectAddCharSet(pat, FC_CHARSET_OBJECT, cset);
        FcCharSetDestroy(cset);
      }

      if ('lang' in fontspec) {
        const lset = FcLangSetCreate();

        if (Array.isArray(fontspec.lang)) {
          for (const lang of fontspec.lang) {
            const langPtr = smalloc(lang);
            FcLangSetAdd(lset, langPtr);
            free(langPtr);
          }
        } else {
          const langPtr = smalloc(fontspec.lang);
          FcLangSetAdd(lset, langPtr);
          free(langPtr);
        }

        FcPatternObjectAddLangSet(pat, FC_LANG_OBJECT, lset);
        FcLangSetDestroy(lset);
      }

      FcConfigSubstitute(this._cfg, pat, 1 /*FcMatchPattern*/);
      FcDefaultSubstitute(pat);

      const cspPtr = options.coverage ? malloc(4) : 0;
      const set = FcFontSort(this._cfg, pat, 1, cspPtr, u32p);
      const result = new Uint32Array(buf(), u32p, 1)[0];

      if (result !== FcResultMatch) throw new Error('FcResult: ' + result);

      const [nfont,, fontsPtrPtr] = new Uint32Array(buf(), set, 3);

      for (let i = 0; i < nfont; ++i) {
        const fontsPtr = new Uint32Array(buf(), fontsPtrPtr + i * 4, 1)[0];
        if (FcPatternObjectGetString(fontsPtr, FC_FILE_OBJECT, 0, u32p) === FcResultMatch) {
          const filePtr = new Uint32Array(buf(), u32p, 1)[0];
          const unsized = new Uint8Array(buf(), filePtr);
          const utf8 = new Uint8Array(buf(), filePtr, unsized.indexOf(0));
          const file = new TextDecoder().decode(utf8);

          if (FcPatternObjectGetInteger(fontsPtr, FC_INDEX_OBJECT, 0, u32p) === FcResultMatch) {
            const index = new Uint32Array(buf(), u32p, 1)[0];
            matches.push({file, index});
          } else {
            throw new Error('Font without an index?');
          }
        } else {
          throw new Error('Font without a filename?');
        }
      }

      const csp = cspPtr ? new Uint32Array(buf(), cspPtr, 1)[0] : 0;
      if (cspPtr) free(cspPtr);

      FcFontSetDestroy(set);

      return new Cascade(matches, csp ? new Coverage(csp) : null);
    }
  }

  return FontConfig;
}
