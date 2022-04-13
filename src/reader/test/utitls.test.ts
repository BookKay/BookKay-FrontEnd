import { getNextWordContainingLetter } from '../composables/utils';

describe('getNextWordContainingLetter', () => {
  const text = `<p style="text-align: center"> Hello my friends! <img src="./img.jpg" alt="Main Image"/> My name is <b> Kevin </b>. 
    I am an eighteen years old student who loves programming and entrepreneurship.
    I, with help from my friends, built a website called BookKay.
    </p>`;

  it.todo('can function as index of with startIndex of 0', () => {
    expect(getNextWordContainingLetter(text, '>', 1)).toBe(text.indexOf('>'));
  });
});
