import { mapLimit } from './map-limit';

const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 1));

describe('mapLimit', () => {
  it('maps every item and preserves input order', async () => {
    const result = await mapLimit([1, 2, 3, 4, 5], 2, async (n) => {
      await tick();
      return n * 10;
    });

    expect(result).toEqual([10, 20, 30, 40, 50]);
  });

  it('never runs more than `limit` calls in flight', async () => {
    let inFlight = 0;
    let maxInFlight = 0;

    await mapLimit([1, 2, 3, 4, 5, 6], 2, async (n) => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await tick();
      inFlight -= 1;
      return n;
    });

    expect(maxInFlight).toBeLessThanOrEqual(2);
    expect(maxInFlight).toBeGreaterThan(1);
  });

  it('returns an empty array without calling fn', async () => {
    const fn = jest.fn();

    const result = await mapLimit([], 3, fn);

    expect(result).toEqual([]);
    expect(fn).not.toHaveBeenCalled();
  });

  it('handles a limit larger than the item count', async () => {
    const result = await mapLimit(['a', 'b'], 10, (s) =>
      Promise.resolve(s.toUpperCase()),
    );

    expect(result).toEqual(['A', 'B']);
  });
});
