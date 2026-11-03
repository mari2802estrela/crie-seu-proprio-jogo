import { describe, it, expect } from "vitest";
import { levelOf } from "@/components/game/Game";

describe("níveis por fase", () => {
  it("cada 3 perguntas formam um nível, a 10ª é o desafio final", () => {
    expect([0, 1, 2].map(levelOf)).toEqual([1, 1, 1]);
    expect([3, 4, 5].map(levelOf)).toEqual([2, 2, 2]);
    expect([6, 7, 8].map(levelOf)).toEqual([3, 3, 3]);
    expect(levelOf(9)).toBe(4);
  });
});
