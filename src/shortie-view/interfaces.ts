export type ComponentTypeInterface =
  | 'front_matters'
  | 'chapters'
  | 'back_matters';

export interface BookJSON {
  title: string;
  description: string;
  front_cover: string;
  back_cover: string;
  front_matters: Component[];
  chapters: Component[];
  text: BaseTextBlockInterface[];
  back_matters: Component[];
}

interface Component {
  title: string;
  text: BaseTextBlockInterface[];
}

////////
interface TextBlockMetaInterface {
  index: number;
  header: string;
  state: TextBlockStateInterface;
}

export type TextBlockStateInterface = 'notShown' | 'showing' | 'shown';

export interface BaseTextBlockInterface {
  id: string;
  type: 'paragraph' | 'heading' | 'list' | 'delimiter';
  tunes: { [x: string]: any };
  meta: TextBlockMetaInterface;
}

export interface ParagraphTextBlockInterface extends BaseTextBlockInterface {
  data: {
    text: string;
  };
}

export interface HeadingTextBlockInterface extends BaseTextBlockInterface {
  data: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface ListTextBlockInterface extends BaseTextBlockInterface {
  data: {
    items: ListItemInterface[];
    style: 'ordered' | 'unordered';
  };
}

export interface ListItemInterface {
  content: string;
  items: ListItemInterface[];
}

export interface EmbedImageTextBlockInterface extends BaseTextBlockInterface {
  url: string;
  caption: string;
  withBorder: boolean;
  withBackground: boolean;
  stretched: boolean;
}

export interface UnsplashImageTextBlockInterface
  extends BaseTextBlockInterface {
  url: string;
  caption: string;
  withBorder: boolean;
  withBackground: boolean;
  stretched: boolean;
  unsplash: {
    author: string;
    profileLink: string;
  };
}
