import { describe, expect, it } from 'vitest';
import { getItem, setItem } from '@/helpers/localStorage';

describe('Local storage helper functions', () => {
  it('Nonhash', () => {
    setItem('user', {
      id: 1,
      name: 'John Doe',
    });
    expect(getItem('user')).toEqual({
      id: 1,
      name: 'John Doe',
    });
  });
  it('Hash but same user agent', () => {
    setItem(
      'user',
      {
        id: 1,
        name: 'John Doe',
      },
      true,
    );
    expect(getItem('user')).toEqual({
      id: 1,
      name: 'John Doe',
    });
  });
});
