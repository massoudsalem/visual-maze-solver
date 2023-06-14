//TODO: implement dijkstra finding all shortest paths
import { DELAY } from "../constants";
import { Pair, make2dArray } from ".";
import { PriorityQueue } from 'datastructures-js';

async function sleep(time = DELAY) {
  await new Promise((r) => setTimeout(r, time));
}


export async function getShortestPathDijkstra(
  start: Pair,
  end: Pair,
  blocks: boolean[][],
  size: number
) {
  // console.log('dijkstra');

  const isSafe = (x: number, y: number) =>
    x < size && y < size && x >= 0 && y >= 0 && !blocks[x][y];

  const setBoxColor = (i: number, j: number, color = "yellow") => {
    if (
      (start.first != i || start.second != j) &&
      (end.first != i || end.second != j)
    )
      document.getElementById(`c-${i}-${j}`)!.style.backgroundColor = color;
  };

  function getNeighbors(p: Pair): Pair[] {
    const neighbors: Pair[] = [];
    const dx = [0, 0, 1, -1];
    const dy = [1, -1, 0, 0];

    for (let i = 0; i < 4; i++) {
      const x = p.first + dx[i];
      const y = p.second + dy[i];

      if (isSafe(x, y)) {
        neighbors.push(new Pair(x, y));
      }
    }

    return neighbors;
  }

  async function dijkstra(start: Pair, end: Pair) {
    const distance = make2dArray<number>(size, Infinity);
    const visited = make2dArray<boolean>(size, false);
    const prev = make2dArray<Pair | null>(size, null);

    distance[start.first][start.second] = 0;

    // // console.log(distance);


    let isSolvable = false;


    distance[start.first][start.second] = 0;

    const q = new PriorityQueue<Pair>(
      (a: Pair, b: Pair) => distance[a.first][a.second] - distance[b.first][b.second]
    ) as PriorityQueue<Pair>;
    q.push(start);

    while (q.size() > 0) {
      // add some delay
      await sleep();

      const p = q.front();
      // console.log(p);
      q.pop();

      if (visited[p.first][p.second]) {
        continue;
      }

      visited[p.first][p.second] = true;
      // console.log(`Visiting point (${p.first}, ${p.second})`);

      setBoxColor(p.first, p.second);

      if (p.first === end.first && p.second === end.second) {
        // console.log("Found end point!");
        isSolvable = true;
        break;
      }

      const neighbors = getNeighbors(p);
      for (const neighbor of neighbors) {
        const alt = distance[p.first][p.second] + 1;
        if (alt < distance[neighbor.first][neighbor.second]) {
          distance[neighbor.first][neighbor.second] = alt;
          prev[neighbor.first][neighbor.second] = p;
          q.push(neighbor);
        }
      }
    }

    if (isSolvable) {
      // console.log(distance);
      const path: Pair[] = [];
      let current: Pair | null = end;
      while (current !== null) {
        path.unshift(current);
        current = prev[current.first][current.second];
      }
      // console.log(path);
      return path;
    }

    return null;
  }

  return await dijkstra(start, end);
}
