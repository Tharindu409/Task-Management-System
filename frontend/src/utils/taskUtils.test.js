import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isOverdue, paginate } from './taskUtils.js';

describe('task utilities', () => {
  it('marks unfinished tasks before today as overdue', () => {
    const now = new Date('2026-07-21T12:00:00Z');
    assert.equal(isOverdue({ status: 'Pending', due_date: '2026-07-20T12:00:00Z' }, now), true);
    assert.equal(isOverdue({ status: 'Completed', due_date: '2026-07-20T12:00:00Z' }, now), false);
  });

  it('returns a bounded page and total page count', () => {
    const result = paginate(['a', 'b', 'c', 'd', 'e'], 2, 2);
    assert.deepEqual(result, { items: ['c', 'd'], page: 2, totalPages: 3 });
    assert.equal(paginate(['a'], 9, 2).page, 1);
  });
});
