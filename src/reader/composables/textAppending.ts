import { reactive, readonly } from 'vue';

interface Tag {
  openingTag: string;
  closingTag: string;
}

export default function textAppending() {
  const appendToLastPage = (word: string, tags = <Tag[]>[]) => {
    const page = <HTMLElement>document.getElementsByClassName('page-text')[0]; // gets the fake page
    let pageText = page.innerHTML; // gets the text from the last page
    const originalText = pageText;

    if (tags.length > 0) {
      const lastTag = tags[tags.length - 1]['closingTag'];
      let lastTagCount = 1;

      for (let i = 0; i < tags.length - 1; i++) {
        const tag = tags[i];
        if (tag['closingTag'] == lastTag) {
          lastTagCount++;
        }
      }

      const lastOccurance = nthLastIndexOf(pageText, lastTag, lastTagCount);

      if (lastOccurance != -1) {
        const suffix = pageText.slice(lastOccurance);
        pageText = pageText.slice(0, lastOccurance);
        pageText = pageText + word + ' ' + suffix;
      } else {
        //In case words are being added on the next blank page.
        //This ensures tags are being followed.

        for (let i = tags.length - 1; i >= 0; i--) {
          const tag = tags[i];
          let toAdd = pageText;

          if (i == tags.length - 1) {
            toAdd = pageText + word;
          }

          pageText = tag['openingTag'] + toAdd + tag['closingTag'];
        }
      }

      page.innerHTML = pageText;
    } else {
      page.innerHTML += word + ' '; // saves the text of the last page
    }
    if (checkOverflow(page)) {
      // checks if the page overflows (more words than space)
      page.innerHTML = ''; //resets the page-text
      return originalText; // returns false because page is full
    } else {
      return ''; // returns true because word was successfully filled in the page
    }
  };

  const nthLastIndexOf = (
    string: string,
    searchString: string,
    n: number
  ): number => {
    if (string === null) {
      return -1;
    }
    if (!n || isNaN(n) || n <= 1) {
      return string.lastIndexOf(searchString);
    }
    n--;

    return string.lastIndexOf(
      searchString,
      nthLastIndexOf(string, searchString, n) - 1
    );
  };

  const checkOverflow = (el: HTMLElement) => {
    const curOverflow = el.style.overflow;

    if (!curOverflow || curOverflow === 'visible') el.style.overflow = 'hidden';

    const isOverflowing =
      el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

    el.style.overflow = curOverflow;

    return isOverflowing;
  };

  return {
    appendToLastPage,
  };
}
