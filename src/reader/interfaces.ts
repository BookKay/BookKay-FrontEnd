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

export type ComponentType = 'front_matters' | 'chapters' | 'back_matters';
