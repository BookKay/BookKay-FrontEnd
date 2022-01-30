export interface DOMInterface {
  contents: string[] | Content[] | DOMInterface[];
  attributes: Attribute;
  type: string;
}

export interface Content {
  type: string;
}

export interface Attribute {
  id?: string;
  class?: string[];
  [key: string]: any;
}

export type ComponentTypeInterface =
  | 'front_matters'
  | 'chapters'
  | 'back_matters';

export interface NavigationInterface {
  type: 'book' | 'front_matter' | 'chapter' | 'text' | 'back_matter';
  data: string;
  page: number;
  active: boolean;
}
