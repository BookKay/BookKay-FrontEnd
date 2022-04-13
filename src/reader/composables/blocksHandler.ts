import {
  BaseTextBlockInterface,
  ParagraphTextBlockInterface,
  HeadingTextBlockInterface,
  ListTextBlockInterface,
  ListItemInterface,
  EmbedImageTextBlockInterface,
  UnsplashImageTextBlockInterface,
} from '../interfaces';

export default function handleBlocks() {
  const convertHTMLToTextBlock = (html: string) => {
    const startingTagEnd = html.indexOf('>');
    const startingTag = html.slice(0, startingTagEnd + 1);

    const closingTagStart = html.lastIndexOf('<');

    //May need tweaks
    const rawText = html.slice(startingTagEnd, closingTagStart);

    const tagName = startingTag.slice(1, -1); //<p> => p

    if (tagName == 'p') {
      const textBlock: ParagraphTextBlockInterface = {
        id: 'temp',
        type: 'paragraph',
        tunes: {},
        data: { text: rawText },
      };

      return textBlock;
    } else if (tagName.startsWith('h')) {
      const level = <1 | 2 | 3 | 4 | 5 | 6>parseInt(tagName.charAt(1));

      const textBlock: HeadingTextBlockInterface = {
        id: 'temp',
        type: 'paragraph',
        tunes: {},
        data: { text: rawText, level: level },
      };

      return textBlock;
    }
  };

  const convertTextBlockToHTML = (textBlock: BaseTextBlockInterface) => {
    let html = '';
    switch (textBlock.type) {
      case 'paragraph':
        html = convertParagraphToHTML(textBlock as ParagraphTextBlockInterface);
        break;
      case 'heading':
        html = convertHeadingToHTML(textBlock as HeadingTextBlockInterface);
        break;
      case 'list':
        html = convertListToHTML(textBlock as ListTextBlockInterface);
        break;
      case 'delimiter':
        html = convertDelimiterToHTML();
        break;
      case 'image':
        if ('unsplash' in textBlock) {
          html = convertImageToHTML(
            textBlock as UnsplashImageTextBlockInterface
          );
        } else {
          html = convertImageToHTML(textBlock as EmbedImageTextBlockInterface);
        }
        break;

      default:
      // code block
    }

    return html;
  };

  const convertParagraphToHTML = (textBlock: ParagraphTextBlockInterface) => {
    const data = textBlock.data;
    const tunes = textBlock.tunes;
    const tag = 'p';

    const text = data['text'];
    const alignment = tunes['alignment']['alignment'];
    const alignment_text = 'text-align: ' + alignment + ';';

    const html = `<${tag} style='${alignment_text}'> ${text} </${tag}>`;

    return html;
  };

  const convertHeadingToHTML = (textBlock: HeadingTextBlockInterface) => {
    const data = textBlock.data;
    const tunes = textBlock.tunes;

    const level = data['level'];
    const tag = `h${level}`;

    const text = data['text'];

    const alignment = tunes['alignment']['alignment'];
    const alignment_text = 'text-align: ' + alignment + ';';

    const html = `<${tag} style='${alignment_text}'> ${text} </${tag}>`;

    return html;
  };

  const convertListToHTML = (textBlock: ListTextBlockInterface) => {
    const data = textBlock.data;
    const items = data['items'];
    const style = data['style'];

    const tag = style == 'unordered' ? 'ul' : 'ol';

    const innerHtml = list2html(items, tag);

    const html = `<${tag}> ${innerHtml} </${tag}>`;

    return html;
  };

  const list2html = (items: ListItemInterface[], tag: 'ul' | 'ol') => {
    let html = '';
    for (const item of items) {
      const children = list2html(item['items'], tag);
      let item_html;

      if (children) {
        item_html = `<li> ${item['content']} <${tag}> ${children} </${tag}> </li>`;
      } else {
        item_html = `<li> ${item['content']} </li>`;
        html = html + ' ' + item_html;
      }
    }

    return html;
  };

  const convertDelimiterToHTML = () => {
    const html = "<div class='delimiter'></div>";

    return html;
  };

  const convertImageToHTML = (
    textBlock: EmbedImageTextBlockInterface | UnsplashImageTextBlockInterface
  ) => {
    const url = textBlock['url'];
    const caption = textBlock['caption'];

    const img = `<img src='${url}' alt='${caption}' />`;

    let credits = '';
    if ('unsplash' in textBlock) {
      const author = textBlock['unsplash']['author'];
      const link = textBlock['unsplash']['profileLink'];
      const unsplash_link =
        'https://unsplash.com/?utm_source=8MeSNDcetPzIRf3mcLc-_6rrHYPaZnbo6ZSLcAIFniI&utm_medium=referral';

      credits = `<div class='img-credits'> by <a href='${link}' target='_blank'> ${author} </a> on <a href='${unsplash_link}' target='_blank'> Unsplash </a> </div>`;
    }
    const img_container = `<div class='img-container'> ${img} ${credits} </div>`;

    const caption_html = `<div class='img-caption'> ${caption} </div>`;

    const img_wrapper = `<div class='img-wrapper'> ${img_container} ${caption_html} </div>`;

    return img_wrapper;
  };

  return { convertTextBlockToHTML };
}
