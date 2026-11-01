import test from 'node:test';
import assert from 'node:assert/strict';
import { numberlinkPuzzle } from '../src/numberlink.js';

test('the animated research puzzle connects every clue pair and covers the board without crossings', () => {
  const { size, clues, paths } = numberlinkPuzzle;
  const visited = new Set();
  const labels = new Set();
  for (const { number, cells } of paths) {
    assert.ok(!labels.has(number), 'Every number has exactly one path');
    labels.add(number);
    const endpoints = [cells[0], cells.at(-1)];
    for (const [x, y] of endpoints) assert.equal(clues[y][x], number);
    for (let i = 0; i < cells.length; i++) {
      const [x, y] = cells[i];
      assert.ok(x >= 0 && x < size && y >= 0 && y < size, 'Paths stay on the board');
      assert.ok(!visited.has(`${x},${y}`), 'Paths never overlap or revisit cells');
      visited.add(`${x},${y}`);
      if (i) assert.equal(Math.abs(x - cells[i - 1][0]) + Math.abs(y - cells[i - 1][1]), 1, 'Each step joins neighboring cells');
      if (i > 0 && i < cells.length - 1) assert.equal(clues[y][x], 0, 'Paths cannot pass through another clue');
    }
  }
  for (const number of labels) assert.equal(clues.flat().filter(value => value === number).length, 2);
  assert.deepEqual(new Set(clues.flat().filter(Boolean)), labels);
  assert.equal(visited.size, size * size, 'Every cell is covered by a path');
});
