// A solved example of input/6x6 120.in from the owner's research dataset.
// https://github.com/anhpham197/SAT-Encoding-for-Numberlink/blob/master/input/6x6%20120.in
// Coordinates are [column, row]. This is a solution walkthrough, not a live SAT solver.
export const numberlinkPuzzle = {
  size: 6,
  clues: [
    [1, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 3, 4],
    [0, 0, 0, 3, 0, 2],
    [0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 0, 0],
  ],
  paths: [
    { number: 1, color: '#a41034', cells: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[5,4],[5,3]] },
    { number: 2, color: '#237f83', cells: [[2,1],[2,2],[2,3],[3,3],[4,3],[4,2],[5,2]] },
    { number: 3, color: '#ac741c', cells: [[4,1],[3,1],[3,2]] },
    { number: 4, color: '#7561a3', cells: [[5,1],[5,0],[4,0],[3,0],[2,0],[1,0],[1,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4]] },
  ],
};

export const numberlinkTiming = {
  leadIn: 500,
  pathDuration: 1100,
  pathInterval: 1250,
  cycleDuration: 7600,
};

export function pathProgress(elapsed, index) {
  const start = numberlinkTiming.leadIn + index * numberlinkTiming.pathInterval;
  return Math.min(1, Math.max(0, (elapsed - start) / numberlinkTiming.pathDuration));
}
