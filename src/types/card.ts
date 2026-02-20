export type CardTemplate = 'quote' | 'qa' | 'image-text';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:5';
export type GlassMode = 'light' | 'dark';
export type ExportFormat = 'png' | 'jpg';
export type ImagePosition = 'left' | 'right' | 'top';
export type ImageShape = 'rect' | 'square' | 'circle';

export interface CardIcon {
  name: string;
  x: number;
  y: number;
}

export interface CardState {
  template: CardTemplate;
  aspectRatio: AspectRatio;
  glassMode: GlassMode;
  gradientIndex: number;
  backgroundImage: string | null;
  cardImage: string | null;
  quoteText: string;
  quoteAuthor: string;
  questionText: string;
  answerText: string;
  imageTitle: string;
  imageDescription: string;
  selectedIcon: string | null;
  fontFamily: string;
  imagePosition: ImagePosition;
  imageShape: ImageShape;
  brandName: string;
}
