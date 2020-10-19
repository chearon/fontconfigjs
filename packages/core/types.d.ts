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

declare class FontConfig {
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

  addFont(filename: string): Promise<undefined>
  sort(fontspec: FontSpec, options?: Options): void
}

declare const fc: Promise<typeof FontConfig>;
export = fc;
