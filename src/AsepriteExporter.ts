import { copyFileSync, existsSync, watchFile, promises } from "fs";
import { copySync, emptyDirSync } from "fs-extra";
import { exec } from "child_process";
import sharp from "sharp";
import path from "path";

type AsepriteExporterProps = {
  asePath: string;
  input: string;
  outputs: any[];
  autoEmpty?: boolean;
  format?: string;
  scale?: number;
  args?: string;
};

type Output = {
  output: string[];
  slices?: string[];
};

export class AsepriteExporter {
  #tempFolder = "./temp";
  #asePath: string;
  #input: string;
  #outputs: any[];
  #autoEmpty: boolean;
  #format: string;
  #scale: number;
  #args: string;

  constructor({
    asePath,
    input,
    outputs,
    autoEmpty,
    format = "{output}/{slice}.png",
    scale = 1,
    args = "",
  }: AsepriteExporterProps) {
    this.#asePath = asePath;
    this.#input = input;
    this.#outputs = outputs;
    this.#autoEmpty = autoEmpty || false;
    this.#format = format;
    this.#scale = scale;
    this.#args = args;
  }

  #insertVariables(format: string, variables: Record<string, string>) {
    for (let key in variables) {
      format = format.replace(`{${key}}`, variables[key]);
    }
    return format;
  }

  #log(message: string) {
    console.log(`[Aseprite Exporter] ${message}`);
  }

  #exec(command: string) {
    return new Promise((resolve) => {
      this.#log(`Executing: ${command}`);
      exec(command, (_error, stdout, _stderr) => {
        resolve(stdout);
      });
    });
  }

  async #discardEmpty(directory: string) {
    const files = await promises.readdir(directory);
    const pngFiles = files.filter((file) => path.extname(file) === ".png");

    await Promise.all(
      pngFiles.map(async (file) => {
        const filePath = path.join(directory, file);
        const { channels } = await sharp(filePath).metadata();
        const buffer = await sharp(filePath).raw().toBuffer();

        if (!channels) return;

        if (buffer.every((val, i) => (i % channels === 3 ? val === 0 : true))) {
          await promises.unlink(filePath);
          this.#log(`Removed empty image: ${file}`);
        }
      })
    );

    return `Processed ${pngFiles.length} PNG files.`;
  }

  #getHash(string: string) {
    return string.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
  }

  #simpleExport(input: string, output: string) {
    return new Promise((resolve) => {
      emptyDirSync(output);

      const format = this.#format;
      const outputFormat = this.#insertVariables(format, { output });

      this.#exec(
        `"${this.#asePath}" -b --ignore-layer "guides" ${this.#args} ${input} --scale ${this.#scale} --save-as ${outputFormat} --color-mode indexed --ignore-empty`
      ).then(() => {
        resolve(true);
      });
    });
  }

  #move(from: string, to: string) {
    copySync(from, to);
  }

  #moveSlices(from: string, to: string, slices: string[]) {
    for (let slice of slices) {
      const slicePath = `${from}/${slice}.png`;
      const sliceOutput = `${to}/${slice}.png`;

      if (!existsSync(slicePath)) continue;

      copyFileSync(slicePath, sliceOutput);
    }
  }

  async export(input: string, outputs: Output[]) {
    const tempOutput = `${this.#tempFolder}/${this.#getHash(input)}`;

    await this.#simpleExport(input, tempOutput);

    await this.#discardEmpty(tempOutput);

    for (const { output, slices = false } of outputs) {
      for (let folder of output) {
        if (this.#autoEmpty) emptyDirSync(folder);

        if (slices) {
          this.#moveSlices(tempOutput, folder, slices);
          this.#log(`Slices: ${folder}`);
        } else {
          this.#move(tempOutput, folder);
          this.#log(`Slices: ${folder}`);
        }
      }
    }
  }

  watch(path: string, callback: () => void) {
    watchFile(path, () => {
      callback();
    });
  }

  init() {
    this.watch(this.#input, () => {
      this.#log(`File changed: ${this.#input}`);
      this.export(this.#input, this.#outputs);
    });

    this.export(this.#input, this.#outputs);
  }
}
