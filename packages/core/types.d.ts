declare class CoverageClass {
  done();
  has(c: string): boolean;
}

declare class CascadeClass {
  public matches: {file: string, index: number}[];
  public coverage: CoverageClass;
}

declare class FontConfigClass {
  static FC_WEIGHT_THIN: number;
  static FC_WEIGHT_EXTRALIGHT: number;
  static FC_WEIGHT_ULTRALIGHT: number;
  static FC_WEIGHT_LIGHT: number;
  static FC_WEIGHT_DEMILIGHT: number;
  static FC_WEIGHT_SEMILIGHT: number;
  static FC_WEIGHT_BOOK: number;
  static FC_WEIGHT_REGULAR: number;
  static FC_WEIGHT_NORMAL: number;
  static FC_WEIGHT_MEDIUM: number;
  static FC_WEIGHT_DEMIBOLD: number;
  static FC_WEIGHT_SEMIBOLD: number;
  static FC_WEIGHT_BOLD: number;
  static FC_WEIGHT_EXTRABOLD: number;
  static FC_WEIGHT_ULTRABOLD: number;
  static FC_WEIGHT_BLACK: number;
  static FC_WEIGHT_HEAVY: number;
  static FC_WEIGHT_EXTRABLACK: number;
  static FC_WEIGHT_ULTRABLACK: number;

  static FC_WIDTH_ULTRACONDENSED: number;
  static FC_WIDTH_EXTRACONDENSED: number;
  static FC_WIDTH_CONDENSED: number;
  static FC_WIDTH_SEMICONDENSED: number;
  static FC_WIDTH_NORMAL: number;
  static FC_WIDTH_SEMIEXPANDED: number;
  static FC_WIDTH_EXPANDED: number;
  static FC_WIDTH_EXTRAEXPANDED: number;
  static FC_WIDTH_ULTRAEXPANDED: number;

  static FC_SLANT_ROMAN: number;
  static FC_SLANT_ITALIC: number;
  static FC_SLANT_OBLIQUE: number;

  addFont(filename: string): Promise<undefined>;
  sort(fontspec: FontConfigInit.FontSpec, options?: FontConfigInit.Options): CascadeClass;
}

declare namespace FontConfigInit {
  type FontSpec = {
    family: string,
    weight?: number,
    width?: number,
    slant?: number,
    lang?: string | string[],
    coverage?: string[]
  }

  type Options = {
    coverage?: number[]
  }

  type FontConfig = FontConfigClass;

  type Coverage = CoverageClass;

  type Cascade = CascadeClass;
}

declare const FontConfigInit: Promise<typeof FontConfigClass>;

export = FontConfigInit;
