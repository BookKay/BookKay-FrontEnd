interface Attribute {
  id?: string;
  class?: string[];
  [key: string]: any;
}

export const getOpeningTag = (tagName: string, attributes = <Attribute>{}) => {
  let openingTag = '<' + tagName;
  for (const attribute in attributes) {
    openingTag =
      openingTag + ' ' + attribute + "='" + attributes[attribute] + "'";
  }
  openingTag = openingTag + '>';

  return openingTag;
};

export const getClosingTag = (tagName: string) => {
  return '</' + tagName + '>';
};

export const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
