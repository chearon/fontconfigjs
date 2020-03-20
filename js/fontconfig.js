const fontkit = require('fontkit');

const FC_WEIGHT_THIN        = 0;
const FC_WEIGHT_EXTRALIGHT  = 40;
const FC_WEIGHT_ULTRALIGHT  = FC_WEIGHT_EXTRALIGHT;
const FC_WEIGHT_LIGHT       = 50;
const FC_WEIGHT_DEMILIGHT   = 55;
const FC_WEIGHT_SEMILIGHT   = FC_WEIGHT_DEMILIGHT;
const FC_WEIGHT_BOOK        = 75;
const FC_WEIGHT_REGULAR     = 80;
const FC_WEIGHT_NORMAL      = FC_WEIGHT_REGULAR;
const FC_WEIGHT_MEDIUM      = 100;
const FC_WEIGHT_DEMIBOLD    = 180;
const FC_WEIGHT_SEMIBOLD    = FC_WEIGHT_DEMIBOLD;
const FC_WEIGHT_BOLD        = 200;
const FC_WEIGHT_EXTRABOLD   = 205;
const FC_WEIGHT_ULTRABOLD   = FC_WEIGHT_EXTRABOLD;
const FC_WEIGHT_BLACK       = 210;
const FC_WEIGHT_HEAVY       = FC_WEIGHT_BLACK;
const FC_WEIGHT_EXTRABLACK  = 215;
const FC_WEIGHT_ULTRABLACK  = FC_WEIGHT_EXTRABLACK;

const FC_SLANT_ROMAN   = 0;
const FC_SLANT_ITALIC  = 100;
const FC_SLANT_OBLIQUE = 110;

const FC_WIDTH_ULTRACONDENSED = 50;
const FC_WIDTH_EXTRACONDENSED = 63;
const FC_WIDTH_CONDENSED      = 75;
const FC_WIDTH_SEMICONDENSED  = 87;
const FC_WIDTH_NORMAL         = 100;
const FC_WIDTH_SEMIEXPANDED   = 113;
const FC_WIDTH_EXPANDED       = 125;
const FC_WIDTH_EXTRAEXPANDED  = 150;
const FC_WIDTH_ULTRAEXPANDED  = 200;

const FC_OBJECT_FAMILY          = 1;
const FC_OBJECT_FAMILYLANG      = 2;
const FC_OBJECT_STYLE           = 3;
const FC_OBJECT_STYLELANG       = 4;
const FC_OBJECT_FULLNAME        = 5;
const FC_OBJECT_FULLNAMELANG    = 6;
const FC_OBJECT_SLANT           = 7;
const FC_OBJECT_WEIGHT          = 8;
const FC_OBJECT_WIDTH           = 9;
const FC_OBJECT_SIZE            = 10;
const FC_OBJECT_ASPECT          = 11;
const FC_OBJECT_PIXEL_SIZE      = 12;
const FC_OBJECT_SPACING         = 13;
const FC_OBJECT_FOUNDRY         = 14;
const FC_OBJECT_ANTIALIAS       = 15;
const FC_OBJECT_HINT_STYLE      = 16;
const FC_OBJECT_HINTING         = 17;
const FC_OBJECT_VERTICAL_LAYOUT = 18;
const FC_OBJECT_AUTOHINT        = 19;
const FC_OBJECT_GLOBAL_ADVANCE  = 20;
const FC_OBJECT_FILE            = 21;
const FC_OBJECT_INDEX           = 22;
const FC_OBJECT_RASTERIZER      = 23;
const FC_OBJECT_OUTLINE         = 24;
const FC_OBJECT_SCALABLE        = 25;
const FC_OBJECT_DPI             = 26;
const FC_OBJECT_RGBA            = 27;
const FC_OBJECT_SCALE           = 28;
const FC_OBJECT_MINSPACE        = 29;
const FC_OBJECT_CHARWIDTH       = 30;
const FC_OBJECT_CHAR_HEIGHT     = 31;
const FC_OBJECT_MATRIX          = 32;
const FC_OBJECT_CHARSET         = 33;
const FC_OBJECT_LANG            = 34;
const FC_OBJECT_FONTVERSION     = 35;
const FC_OBJECT_CAPABILITY      = 36;
const FC_OBJECT_FONTFORMAT      = 37;
const FC_OBJECT_EMBOLDEN        = 38;
const FC_OBJECT_EMBEDDED_BITMAP = 39;
const FC_OBJECT_DECORATIVE      = 40;
const FC_OBJECT_LCD_FILTER      = 41;
const FC_OBJECT_NAMELANG        = 42;
const FC_OBJECT_FONT_FEATURES   = 43;
const FC_OBJECT_PRGNAME         = 44;
const FC_OBJECT_HASH            = 45;
const FC_OBJECT_POSTSCRIPT_NAME = 46;
const FC_OBJECT_COLOR           = 47;
const FC_OBJECT_SYMBOL          = 48;
const FC_OBJECT_FONT_VARIATIONS = 49;
const FC_OBJECT_VARIABLE        = 50;
const FC_OBJECT_FONT_HAS_HINT   = 51;

const FcResultMatch = 0;
const FcResultNoMatch = 1;
const FcResultTypeMismatch = 2;
const FcResultNoId = 3;
const FcResultOutOfMemory = 4;

const Os2WidthToFcWidth = {
  1: FC_WIDTH_ULTRACONDENSED,
  2: FC_WIDTH_EXTRACONDENSED,
  3: FC_WIDTH_CONDENSED,
  4: FC_WIDTH_SEMICONDENSED,
  5: FC_WIDTH_NORMAL,
  6: FC_WIDTH_SEMIEXPANDED,
  7: FC_WIDTH_EXPANDED,
  8: FC_WIDTH_EXTRAEXPANDED,
  9: FC_WIDTH_ULTRAEXPANDED
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
  if (strContainsIgnoreCase(s, 'thin')) return FC_WEIGHT_THIN;
  if (strContainsIgnoreCase(s, 'extralight')) return FC_WEIGHT_EXTRALIGHT;
  if (strContainsIgnoreCase(s, 'ultralight')) return FC_WEIGHT_ULTRALIGHT;
  if (strContainsIgnoreCase(s, 'demilight')) return FC_WEIGHT_DEMILIGHT;
  if (strContainsIgnoreCase(s, 'semilight')) return FC_WEIGHT_SEMILIGHT;
  if (strContainsIgnoreCase(s, 'light')) return FC_WEIGHT_LIGHT;
  if (strContainsIgnoreCase(s, 'book')) return FC_WEIGHT_BOOK;
  if (strContainsIgnoreCase(s, 'regular')) return FC_WEIGHT_REGULAR;
  if (strContainsIgnoreCase(s, 'normal')) return FC_WEIGHT_NORMAL;
  if (strContainsIgnoreCase(s, 'medium')) return FC_WEIGHT_MEDIUM;
  if (strContainsIgnoreCase(s, 'demibold')) return FC_WEIGHT_DEMIBOLD;
  if (strContainsIgnoreCase(s, 'demi')) return FC_WEIGHT_DEMIBOLD;
  if (strContainsIgnoreCase(s, 'semibold')) return FC_WEIGHT_SEMIBOLD;
  if (strContainsIgnoreCase(s, 'extrabold')) return FC_WEIGHT_EXTRABOLD;
  if (strContainsIgnoreCase(s, 'superbold')) return FC_WEIGHT_EXTRABOLD;
  if (strContainsIgnoreCase(s, 'ultrabold')) return FC_WEIGHT_EXTRABOLD;
  if (strContainsIgnoreCase(s, 'bold')) return FC_WEIGHT_BOLD;
  if (strContainsIgnoreCase(s, 'ultrablack')) return FC_WEIGHT_EXTRABLACK;
  if (strContainsIgnoreCase(s, 'superblack')) return FC_WEIGHT_EXTRABLACK;
  if (strContainsIgnoreCase(s, 'extrablack')) return FC_WEIGHT_EXTRABLACK;
  // TODO ultra?
  if (strContainsIgnoreCase(s, 'black')) return FC_WEIGHT_BLACK;
  if (strContainsIgnoreCase(s, 'heavy')) return FC_WEIGHT_HEAVY;
  return -1;
}

// See FcContainsWidth in fcfreetype.c
function containsWidth(s) {
  if (strContainsIgnoreCase(s, 'ultracondensed')) return FC_WIDTH_ULTRACONDENSED;
  if (strContainsIgnoreCase(s, 'extracondensed')) return FC_WIDTH_EXTRACONDENSED;
  if (strContainsIgnoreCase(s, 'semicondensed')) return FC_WIDTH_SEMICONDENSED;
  if (strContainsIgnoreCase(s, 'condensed')) return FC_WIDTH_CONDENSED;
  if (strContainsIgnoreCase(s, 'normal')) return FC_WIDTH_NORMAL;
  if (strContainsIgnoreCase(s, 'semiexpanded')) return FC_WIDTH_SEMIEXPANDED;
  if (strContainsIgnoreCase(s, 'ultraexpanded')) return FC_WIDTH_ULTRAEXPANDED;
  if (strContainsIgnoreCase(s, 'expanded')) return FC_WIDTH_EXPANDED;
  return -1;
}

// See FcContainsSlant in fcfreetype.c
function containsSlant(s) {
  if (strContainsIgnoreCase(s, 'italic')) return FC_SLANT_ITALIC;
  if (strContainsIgnoreCase(s, 'kursiv')) return FC_SLANT_ITALIC;
  if (strContainsIgnoreCase(s, 'oblique')) return FC_SLANT_OBLIQUE;
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
    FcFreeTypeLangSet, // TODO naming here... it doesn't use FT at all
    FcLangSetDestroy,
    FcWeightFromOpenTypeDouble,
    malloc,
    free,
    memory
  } = wasm.instance.exports;

  FcInitDebug();

  const cfg = FcConfigCreate();

  // A "register" re-used often for pointer sharing
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

  function addFont(filename) {
    const sfilename = smalloc(filename);
    const raw = fontkit.openSync(filename);
    const jsfonts = raw.fonts ? raw.fonts : [raw];

    for (const [index, jsfont] of jsfonts.entries()) {
      const fnt = FcPatternCreate();

      // Family
      if ("fontFamily" in jsfont.name.records) {
        for (const [lang, text] of Object.entries(jsfont.name.records.fontFamily)) {
          const pt = smalloc(text.toString());
          const pl = smalloc(lang.toString());
          FcPatternObjectAddString(fnt, FC_OBJECT_FAMILY, pt);
          FcPatternObjectAddString(fnt, FC_OBJECT_FAMILYLANG, pl);
          free(pt);
          free(pl);
        }
      }

      // Fullname
      if ("fullName" in jsfont.name.records) {
        for (const [lang, text] of Object.entries(jsfont.name.records.fullName)) {
          const pt = smalloc(text.toString());
          const pl = smalloc(lang.toString());
          FcPatternObjectAddString(fnt, FC_OBJECT_FULLNAME, pt);
          FcPatternObjectAddString(fnt, FC_OBJECT_FULLNAMELANG, pl);
          free(pt);
          free(pl);
        }
      }

      // Style
      if ("fontSubfamily" in jsfont.name.records) {
        for (const [lang, text] of Object.entries(jsfont.name.records.fontSubfamily)) {
          const pt = smalloc(text.toString());
          const pl = smalloc(lang.toString());
          FcPatternObjectAddString(fnt, FC_OBJECT_STYLE, pt);
          FcPatternObjectAddString(fnt, FC_OBJECT_STYLELANG, pl);
          free(pt);
          free(pl);
        }
      }

      // Charset
      const cset = FcCharSetCreate();
      for (const c of jsfont.characterSet) FcCharSetAddChar(cset, c);
      FcPatternObjectAddCharSet(fnt, FC_OBJECT_CHARSET, cset);
      FcCharSetDestroy(cset);

      // Lang - TODO support OS/2.codePageRange? 2nd arg to FcFreeTypeLangSet
      const lset = FcFreeTypeLangSet(cset, 0);
      FcPatternObjectAddLangSet(fnt, FC_OBJECT_LANG, lset);
      FcLangSetDestroy(lset);

      // Weight, width from tables
      let weight = FcWeightFromOpenTypeDouble(jsfont['OS/2'].usWeightClass);
      let width = Os2WidthToFcWidth[jsfont['OS/2'].usWidthClass] || -1;
      let slant = -1;
      let decorative = false;

      for (let i = 0; FcPatternObjectGetString(fnt, FC_OBJECT_STYLE, i, u32p) === FcResultMatch; ++i) {
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
        slant = FC_SLANT_ROMAN;
        if (jsfont['OS/2'].fsSelection.italic) {
          slant = FC_SLANT_ITALIC;
        }
      }

      // Guarantee weight, final lowest priority values
      if (weight < 0) {
        weight = FC_WEIGHT_MEDIUM;
        if (jsfont['OS/2'].fsSelection.bold) {
          weight = FC_WEIGHT_BOLD;
        }
      }

      // Guarantee width
      if (width < 0) width = FC_WIDTH_NORMAL;

      // TODO if no family name, use filename
      // TODO if no fullname, use family name, style name

      // Apply
      FcPatternObjectAddString(fnt, FC_OBJECT_FILE, sfilename);
      FcPatternObjectAddDouble(fnt, FC_OBJECT_WEIGHT, weight);
      FcPatternObjectAddDouble(fnt, FC_OBJECT_WIDTH, width);
      FcPatternObjectAddDouble(fnt, FC_OBJECT_SLANT, slant);
      FcPatternObjectAddBool(fnt, FC_OBJECT_DECORATIVE, decorative);
      FcPatternObjectAddInteger(fnt, FC_OBJECT_INDEX, index);

      // Finish configuration and add the file
      FcConfigSubstitute(cfg, fnt, 0 /*FcMatchPattern*/);
      FcDefaultSubstitute(fnt);
      FcConfigAddFile(cfg, fnt);
    }

    free(sfilename);
  }

  function sort(fontspec) {
    const pat = FcPatternCreate();
    const matches = [];

    if (typeof fontspec !== "object" || typeof fontspec.family !== "string") {
      throw new Error("Pass an object with at least {family: string}");
    }

    const familyPtr = smalloc(fontspec.family);
    FcPatternObjectAddString(pat, FC_OBJECT_FAMILY, familyPtr);
    free(familyPtr);

    if ("weight" in fontspec) {
      FcPatternObjectAddDouble(pat, FC_OBJECT_WEIGHT, fontspec.weight);
    }

    const setPtr = FcFontSort(cfg, pat, 1, 0 /* TODO pass/return CSP ptr */, u32p);
    const result = new Uint32Array(buf(), u32p, 1)[0];

    if (result !== FcResultMatch) throw new Error("FcResult: " + result);

    const [nfont,, fontsPtrPtr] = new Uint32Array(buf(), setPtr, 3);

    for (let i = 0; i < nfont; ++i) {
      const fontsPtr = new Uint32Array(buf(), fontsPtrPtr + i * 4, 1)[0];
      if (FcPatternObjectGetString(fontsPtr, FC_OBJECT_FILE, 0, u32p) === FcResultMatch) {
        const filePtr = new Uint32Array(buf(), u32p, 1)[0];
        const unsized = new Uint8Array(buf(), filePtr);
        const utf8 = new Uint8Array(buf(), filePtr, unsized.indexOf(0));
        const file = new TextDecoder().decode(utf8);

        if (FcPatternObjectGetInteger(fontsPtr, FC_OBJECT_INDEX, 0, u32p) === FcResultMatch) {
          const index = new Uint32Array(buf(), u32p, 1)[0];
          matches.push({file, index});
        } else {
          throw new Error("Font without an index?");
        }
      } else {
        throw new Error("Font without a filename?");
      }
    }

    FcFontSetDestroy(setPtr);

    return matches;
  }

  return {
    addFont,
    sort,

    FC_WEIGHT_THIN,
    FC_WEIGHT_EXTRALIGHT,
    FC_WEIGHT_ULTRALIGHT,
    FC_WEIGHT_LIGHT,
    FC_WEIGHT_DEMILIGHT,
    FC_WEIGHT_SEMILIGHT,
    FC_WEIGHT_BOOK,
    FC_WEIGHT_REGULAR,
    FC_WEIGHT_NORMAL,
    FC_WEIGHT_MEDIUM,
    FC_WEIGHT_DEMIBOLD,
    FC_WEIGHT_SEMIBOLD,
    FC_WEIGHT_BOLD,
    FC_WEIGHT_EXTRABOLD,
    FC_WEIGHT_ULTRABOLD,
    FC_WEIGHT_BLACK,
    FC_WEIGHT_HEAVY,
    FC_WEIGHT_EXTRABLACK,
    FC_WEIGHT_ULTRABLACK,

    FC_SLANT_ROMAN,
    FC_SLANT_ITALIC,
    FC_SLANT_OBLIQUE,

    FC_WIDTH_ULTRACONDENSED,
    FC_WIDTH_EXTRACONDENSED,
    FC_WIDTH_CONDENSED,
    FC_WIDTH_SEMICONDENSED,
    FC_WIDTH_NORMAL,
    FC_WIDTH_SEMIEXPANDED,
    FC_WIDTH_EXPANDED,
    FC_WIDTH_EXTRAEXPANDED,
    FC_WIDTH_ULTRAEXPANDED
  };
}
