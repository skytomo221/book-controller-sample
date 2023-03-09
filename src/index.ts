import * as fs from "node:fs";
import BookController from "otamashelf-extension/dist/BookController";
import RemoteBookController from "otamashelf-extension/dist/RemoteBookController";
import TemplateProperties from "otamashelf-extension/dist/TemplateProperties";
import { BookControllerProperties } from "otamashelf-extension/dist/ExtensionProperties";
import { PageCard } from "otamashelf-extension/dist/PageCard";
import { SearchCard } from "otamashelf-extension/dist/SearchCard";
import { IndexCard } from "otamashelf-extension/dist/IndexCard";

type Record = {
  id: string;
  word: string;
  pos: string;
  meaning: string;
};

export default class TsvController extends RemoteBookController {
  private dictionary: Record[] = [];

  public async properties(): Promise<BookControllerProperties> {
    return {
      name: "Sample Controller",
      id: "@skytomo221/sample-controller",
      version: "0.1.0",
      type: "book-controller",
      author: "skytomo221",
      format: "file",
      filters: [
        {
          name: "カスタム形式",
          extensions: ["tsv"],
        },
      ],
    };
  }

  protected static toWordCard(record: Record): PageCard {
    return {
      id: record.id,
      title: record.word,
      entry: {
        id: parseInt(record.id, 36),
        form: record.word,
      },
      translations: [
        {
          title: record.pos,
          forms: [record.meaning],
        },
      ],
      tags: [],
      contents: [],
      variations: [],
      relations: [],
    };
  }

  protected static toIndexCard(record: Record): IndexCard {
    return {
      id: record.id,
      title: record.word,
    };
  }

  public async createPage(): Promise<string> {
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    let newId: string | undefined = undefined;
    while (!(newId && this.dictionary.find((record) => record.id === newId))) {
      newId = Math.random().toString(36).slice(-8);
    }
    this.dictionary.push({
      id: newId,
      word: "",
      pos: "",
      meaning: "",
    });
    return newId.toString();
  }

  public async deletePage(id: string): Promise<boolean> {
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    this.dictionary = this.dictionary.filter((record) => record.id !== id);
    return true;
  }

  public async readPage(id: string): Promise<PageCard> {
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    const word = this.dictionary.find((record) => record.id === id);
    if (!word) {
      throw new Error("card not found");
    }
    return TsvController.toWordCard(word);
  }

  public async readPages(ids: string[]): Promise<PageCard[]> {
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    return this.dictionary
      .filter((word) => ids.includes(word.id))
      .map((word) => TsvController.toWordCard(word));
  }

  public async readTemplates(): Promise<TemplateProperties[]> {
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    return [
      {
        id: "new-word",
        name: "新しく単語を作成する",
      },
    ];
  }

  public async updatePage(word: PageCard): Promise<string> {
    if (this.dictionary === undefined) {
      throw new Error("otm is undefined");
    }
    this.dictionary.map((record) =>
      record.id === word.id
        ? {
            ...record,
            id: word.id,
            word: word.title,
          }
        : record
    );
    return word.id;
  }

  public async readSearchModes(): Promise<string[]> {
    return ["単語", "和訳"];
  }

  public async readSearchIndexes(searchModeId: string): Promise<SearchCard[]> {
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    switch (searchModeId) {
      case "単語":
        return this.dictionary.map((record) => ({
          id: record.id,
          targets: [record.word],
        }));
      case "和訳":
        return this.dictionary.map((record) => ({
          id: record.id,
          targets: [record.meaning],
        }));
      default:
        return [];
    }
  }

  public async onClick(script: string, id: number): Promise<PageCard> {
    throw new Error("not implemented");
  }

  public async newBook(path: string): Promise<BookController> {
    this.dictionary = [];
    await this.save(path);
    return this;
  }

  public async load(path: string): Promise<BookController> {
    this.dictionary = fs
      .readFileSync(path)
      .toString()
      .split("\n")
      .map((line) => {
        let newId: string | undefined = Math.random().toString(36).slice(-8);
        while (this.dictionary.some((record) => record.id === newId)) {
          console.log("newId", newId);
          newId = Math.random().toString(36).slice(-8);
        }
        const record = line.split("\t");
        return {
          id: newId,
          word: record[0],
          pos: record[1],
          meaning: record[2],
        };
      });
    console.log(this.dictionary);
    return this;
  }

  public async save(path: string): Promise<BookController> {
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    fs.writeFileSync(
      path,
      this.dictionary
        .map((record) => `${record.word}\t${record.pos}\t${record.meaning}`)
        .join("\n")
    );
    return this;
  }
}

new TsvController().activate(Number(process.argv[2]));
