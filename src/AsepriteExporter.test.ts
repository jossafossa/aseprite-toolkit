import { expect, describe, it, vi } from "vitest";
import { AsepriteExporter } from "./AsepriteExporter";
import { emptyDirSync } from "fs-extra";

vi.mock("sharp", () => ({ default: vi.fn() }));

vi.mock("fs-extra", async () => ({
  copySync: vi.fn(),
  emptyDirSync: vi.fn(),
}));

vi.mock("child_process", async () => ({
  default: {
    exec: vi.fn(),
  },
}));

vi.mock("fs", async () => ({
  default: {
    copyFileSync: vi.fn(),
    existsSync: vi.fn(),
    watchFile: vi.fn(),
    promises: {
      readdir: vi.fn(),
    },
  },
}));

describe("AsepriteExporter", () => {
  it("is defined", () => {
    expect(AsepriteExporter).toBeDefined();
  });

  it("exports", () => {
    const exporter = new AsepriteExporter({
      asePath: "path/to/ase",
      input: "path/to/input",
      outputs: [
        {
          output: ["path/to/output"],
          slices: ["slice"],
        },
      ],
      scale: 2,
      format: "{output}/{slice}.png",
    });

    exporter.export("input.aseprite", [
      {
        output: ["output/"],
      },
    ]);

    expect(emptyDirSync).toHaveBeenCalledWith("./temp/-1984628256");

    // expect(sharp).toHaveBeenCalledWith("path/to/input");
  });
});
