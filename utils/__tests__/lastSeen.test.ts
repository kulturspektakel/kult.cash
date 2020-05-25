import {parseUserAgent} from '../lastSeen';

describe('parseUserAgent', () => {
  it('parses a valid user-agent', () => {
    // @ts-ignore
    const {id, version} = parseUserAgent({
      headers: {
        ['user-agent']: 'AA:BB:CC/123',
      },
    });
    expect(id).toBe('AA:BB:CC');
    expect(version).toBe(123);
  });

  it('returns null for missing user-agent', () => {
    // @ts-ignore
    const {id, version} = parseUserAgent({
      headers: {},
    });
    expect(id).toBe(null);
    expect(version).toBe(null);
  });
});
