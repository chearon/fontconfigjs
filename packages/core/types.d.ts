declare class CoverageClass {
  done(): void;
  has(c: string): boolean;
}

declare class FontConfigCssMatchClass {
  file: string;
  index: number;
  family: string;
  weight: string;
  width: string;
  style: string;
}

declare class FontConfigMatchClass {
  file: string;
  index: number;
  family: string;
  weight: number;
  width: number;
  slant: number;
  toCssMatch(): FontConfigCssMatchClass;
}

declare class CascadeClass {
  public matches: FontConfigMatchClass[];
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
  list(): FontConfigMatchClass[];
  sort(fontspec: FontConfigInit.FontSpec, options?: FontConfigInit.Options): CascadeClass;
}

declare namespace FontConfigInit {
  type FontSpec = {
    family: string | string[],
    weight?: number | string,
    width?: number | string,
    slant?: number | string,
    /** alias for slant */
    style?: number | string,
    lang?: string | string[],
    coverage?: string[]
  }

  type Options = {
    coverage?: number[]
  }

  type FontConfig = FontConfigClass;

  type Coverage = CoverageClass;

  type FontConfigMatch = FontConfigMatchClass;

  type FontConfigCssMatch = FontConfigCssMatchClass;

  type Cascade = CascadeClass;
}

declare const FontConfigInit: Promise<typeof FontConfigClass>;

export = FontConfigInit;
