# Book Controller Sample

拡張機能のサンプルです。
拡張機能の仕様は近いうちに変更される可能性が大いにあります。

## チュートリアル

### 準備

1. 空のリポジトリを作成し、そのリポジトリの中に移動します。
2. `git init`を実行します。
   - `git`コマンドを使用するには[Git](https://git-scm.com/)のインストールが必要です。
   - Git については<https://git-scm.com/book/ja/v2>を参照してください。
   - `git init`については<https://git-scm.com/docs/git-init/ja>を参照してください。
3. `npm init`を実行します。
   - `npm`コマンドを使用するには[Node.js](https://nodejs.org/ja/)のインストールが必要です。
   - npm については<https://docs.npmjs.com/>を参照してください。
   - `npm init`については<https://docs.npmjs.com/cli/v9/commands/npm-init>を参照してください。
4. `npm install --save-dev typescript`を実行して TypeScript をインストールします。
5. `npm install --save-dev webpack`を実行して Webpack をインストールします。
6. `npx webpack init`
   1. 「Which of the following JS solutions do you want to use?」に`TypeScript`を選択します。
   2. 「Do you want to use webpack-dev-server?」に`n`を選択します。
   3. 「Do you want to simplify the creation of HTML files for your bundle?」に`n`を選択します。
   4. 「Do you want to add PWA support?」に`n`を選択します。
   5. 「Which of the following CSS solutions do you want to use?」に`none`を選択します。
   6. 「Do you like to install prettier to format generated configuration?」は自由に選択してください。
   7. 「Pick a package manager」は`npm`を選択します。
   8. 「Overwrite package.json?」に`y`を選択します。
   9. 「Overwrite README.md?」は自由に選択してください。
7. `tsconfig.json`に以下の内容を追加します。
   ```diff
   {
     "compilerOptions": {
   +   "outDir": "./dist",
       "allowSyntheticDefaultImports": true,
       "noImplicitAny": true,
       "module": "es6",
   +   "target": "es6",
       "allowJs": true,
     },
     "files": ["src/index.ts"]
   }
   ```
8. `webpack.config.js`に以下の内容を追加します。

   ```diff
   const config = {
       entry: './src/index.ts',
       output: {
           path: path.resolve(__dirname, 'dist'),
       },
       plugins: [
           // Add your plugins here
           // Learn more about plugins from https://webpack.js.org/configuration/plugins/
       ],
       module: {
           rules: [
               {
                   test: /\.(ts|tsx)$/i,
                   loader: 'ts-loader',
                   exclude: ['/node_modules/'],
               },
               {
                   test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                   type: 'asset',
               },

               // Add your rules for custom modules here
               // Learn more about loaders from https://webpack.js.org/loaders/
           ],
       },
       resolve: {
           extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
       },
   +   target: "node",
   };
   ```

9. `node dist/main.js`

### 拡張機能の作成

例えば以下のような形式の辞書を作成したいとしましょう。

```tsv
skurla	他動詞	書く
skurlaver	名詞	画家
slaxers	自動詞	(-'sは-'cに-'sciについて)感謝する
slaxers	他動詞	(-'sは-'iに関してelに対してvelganによって)お礼をする
xace	間投詞	ありがとう
```

タブ区切りで、以下のような形式になっています。

```txt
単語   品詞    意味
```

このような TSV 形式のファイルを読み込む`TsvController`を作成してみましょう。
まず`npm install --save otamashelf-extension`を実行して、`otamashelf-extension`をインストールします。
`RemoteBookController`を継承することで、`otamashelf-extension`の機能を簡単に利用できます。
`RemoteBookController`を継承するには以下のメソッドを実装する必要があります。

```ts
export default class TsvController extends RemoteBookController {
  properties(): Promise<BookControllerProperties>;
  createPage(templateId: string): Promise<string>;
  deletePage(id: string): Promise<boolean>;
  readPage(id: string): Promise<PageCard>;
  readPages(ids: string[]): Promise<PageCard[]>;
  updatePage(word: PageCard): Promise<string>;
  readSearchModes(): Promise<string[]>;
  readSearchIndexes(searchModeId: string): Promise<SearchCard[]>;
  readTemplates(): Promise<TemplateProperties[]>;
  onClick(script: string, id: number): Promise<PageCard>;
  newBook(path: string): Promise<BookController>;
  load(path: string): Promise<BookController>;
  save(path: string): Promise<BookController>;
}
```

それでは`src/index.ts` に以下の内容を追加します。

```ts
import * as fs from "node:fs";
import RemoteBookController from "otamashelf-extension/dist/RemoteBookController";

export default class TsvController extends RemoteBookController {
  // 拡張機能の情報を返すメソッド
  public async properties(): Promise<BookControllerProperties> {
    return {
      // 拡張機能の名前
      name: "Sample Controller",
      // 拡張機能のID
      // このIDは、全世界で一意でなければなりません。
      // 例えば、GitHubのユーザー名と拡張機能の名前を組み合わせると良いでしょう。
      id: "@skytomo221/sample-controller",
      // 拡張機能のバージョン
      version: "0.1.0",
      // 拡張機能の種類
      // 今回は辞書の操作をする拡張機能を作成するので、"book-controller"を指定します。
      type: "book-controller",
      // 拡張機能の作者
      author: "skytomo221",
      // ファイルを読み込むかフォルダを読み込むかを指定します。
      // 今回はTSVファイルを読み込むので、"file"を指定します。
      format: "file",
      // ファイルの種類を指定します。
      filters: [
        {
          // ファイル形式の名前
          name: "カスタム形式",
          // ファイルの拡張子
          extensions: ["tsv"],
        },
      ],
    };
  }
}
```

`RemoteBookController`を基に`TsvController`を作成します。

まず、辞書の読み込みと保存を実装します。

```ts
// 単語の情報を表す型（「レコード」とします）
type Record = {
  id: string; // 単語の識別子
  word: string; // 単語
  pos: string; // 品詞
  meaning: string; // 意味
};

export default class TsvController extends RemoteBookController {
  // 保存する辞書
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

  // 辞書の読み込みをするときに呼ばれるメソッド
  public async load(path: string): Promise<BookController> {
    ...
  }

  // 辞書の保存をするときに呼ばれるメソッド
  public async save(path: string): Promise<BookController> {
    ...
  }
}
```

上のようなメソッドを実装する必要があります。

`load`メソッドは、辞書の読み込みをするときに呼ばれるメソッドです。
実際に実装してみましょう。

```ts
  /*
   * 辞書の読み込みをするときに呼ばれるメソッド
   * @param path 読み込むファイルのパス
   */
  public async load(path: string): Promise<BookController> {
    this.dictionary = fs
      .readFileSync(path) // ファイルを読み込み、
      .toString() // バイナリデータを文字列に変換し、
      .split("\n") // 改行で区切って、
      .map((line) => { // 行ごとに単語をレコードとして辞書に追加します。
        // IDを作成します
        let newId: string | undefined = Math.random().toString(36).slice(-8);
        // IDが重複したら、もう一度生成します
        while (this.dictionary.some((record) => record.id === newId)) {
          console.log("newId", newId);
          newId = Math.random().toString(36).slice(-8);
        }
        // 単語の情報を作成します
        const record = line.split("\t");
        return {
          id: newId,
          word: record[0],
          pos: record[1],
          meaning: record[2],
        };
      });
    return this;
  }
```

`save`メソッドは、辞書の保存をするときに呼ばれるメソッドです。
実際に実装してみましょう。

```ts
  /*
   * 辞書の保存をするときに呼ばれるメソッド
   * @param path 保存するファイルのパス
   */
  public async save(path: string): Promise<BookController> {
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    fs.writeFileSync( // ファイルに保存します
      path, // 第1引数に保存するファイルのパス
      this.dictionary // 第2引数に保存する内容
        .map((record) => `${record.word}\t${record.pos}\t${record.meaning}`) // 単語の情報をタブ区切りの文字列に変換し、
        .join("\n") // 改行で結合します。
    );
    return this;
  }
```

次にレコード（`Record`）を`IndexCard`及び`PageCard`に変換するメソッドを作ってみましょう。

```ts
interface IndexCard {
  id: string;
  title: string;
}
```

`IndexCard`は上のようなインターフェースです。
`IndexCard`は、辞書の単語を表す最低限のカードです。
単語リストを表示するときに使います。
`Record`を`IndexCard`に変換するメソッドを作ってみましょう。

```ts
  protected static toIndexCard(record: Record): IndexCard {
    return {
      id: record.id,
      title: record.word,
    };
  }
```

`PageCard`は下のようなインターフェースです。
`PageCard`は、辞書の単語をページとして表示するための情報を含むカードです。

```ts
import { Json } from "fp-ts/Json";

interface PageCard {
  [key: string]: Json;
  id: string;
  title: string;
}
```

`IndexCard`に`[key: string]: Json;`を追加した感じですね。
`[key: string]: Json;`の部分は依存する`LayoutBuilder`の実装によって変わります。
今回はとりあえず`OtmLayoutBuilder`に依存するため、OTM JSON の単語形式に合わせます。
具体的には下のようなインターフェースになります。

```ts
type Word = {
  entry: Entry;
  translations: Translation[];
  tags: string[];
  contents: Content[];
  variations: Variation[];
  relations: Relation[];
};

type Entry = {
  id: number;
  form: string;
};

type Translation = {
  title: string;
  forms: string[];
};

type Content = {
  title: string;
  text: string;
  markdown?: string;
};

type Variation = {
  title: string;
  form: string;
};

type Relation = {
  title: string;
  entry: Entry;
};
```

それでは`Record`を`PageCard`に変換するメソッドを作ってみましょう。
`IndexCard`は、辞書の単語を表す最低限のカードです。
単語リストを表示するときに使います。

```ts
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
```

……よく分からない人はよく分からないままでいいです。
とりあえずこういうものだと認識してください。

単語を作成するときは`createPage`メソッドを呼び出します。

```ts
  public async createPage(templateId: string): Promise<string> {
    // 辞書が読み込まれていない場合はエラーを投げます
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    // 単語のIDを作成します
    let newId: string | undefined = undefined;
    // 既に存在するIDと被らないようにします
    while (!(newId && this.dictionary.find((record) => record.id === newId))) {
      newId = Math.random().toString(36).slice(-8);
    }
    // 空の単語を追加します
    this.dictionary.push({
      id: newId,
      word: "",
      pos: "",
      meaning: "",
    });
    return newId.toString();
  }
```

「単語を作成するときは`createPage`メソッドを呼び出される」と言いましたが、
実は例文を作成するときにも`createPage`メソッドを呼び出されます。
単語を作成するのか、例文を作成するのかは`templateId`で判断します。
例えば、単語を作成するときは`new-word`、例文を作成するときは`new-example`という`templateId`を渡すことができます。
この`templateId`のリストは`readTemplates`メソッドで定義することができます。

```ts
  public async readTemplates(): Promise<TemplateProperties[]> {
    // 辞書が読み込まれていない場合はエラーを投げます
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
```

`deletePage`メソッドは、単語を削除するときに呼び出されます。

```ts
  public async deletePage(id: string): Promise<boolean> {
    // 辞書が読み込まれていない場合はエラーを投げます
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    // 単語を削除します
    this.dictionary = this.dictionary.filter((record) => record.id !== id);
    // 単語を削除したのでtrueを返します
    return true;
  }
```

`readPage`メソッドは、特定の単語を読み出すときに呼び出されます。

```ts
  public async readPage(id: string): Promise<PageCard> {
    // 辞書が読み込まれていない場合はエラーを投げます
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    // 単語を探します
    const word = this.dictionary.find((record) => record.id === id);
    // 単語が見つからなかった場合はエラーを投げます
    if (!word) {
      throw new Error("card not found");
    }
    // 単語をWordCardに変換して返します
    return TsvController.toWordCard(word);
  }
```

`readPages`メソッドは、単語リストを読み出すときに呼び出されます。

```ts
  public async readPages(ids: string[]): Promise<PageCard[]> {
    // 辞書が読み込まれていない場合はエラーを投げます
    if (this.dictionary === undefined) {
      throw new Error("dictionary is undefined");
    }
    // 単語のリストをWordCard[]に変換して返します
    return this.dictionary
      .filter((word) => ids.includes(word.id))
      .map((word) => TsvController.toWordCard(word));
  }
```

`updatePage`メソッドは、単語を更新するときに呼び出されます。

```ts
  public async updatePage(word: PageCard): Promise<string> {
    // 辞書が読み込まれていない場合はエラーを投げます
    if (this.dictionary === undefined) {
      throw new Error("otm is undefined");
    }
    // 単語を更新します
    this.dictionary.map((record) =>
      record.id === word.id
        // 該当の単語だけ単語をすり替えて更新します
        ? {
            ...record,
            id: word.id,
            word: word.title,
          }
        // 該当の単語なら単語を更新しません
        : record
    );
    return word.id;
  }
```

次に検索するためのメソッドを実装します。
`readSearchModes`メソッドは、検索モードのリストを返します。
今回は「単語」と「和訳」で検索できるようにしたいので、
`["単語", "和訳"]`を返すようにします。

```ts
public async readSearchModes(): Promise<string[]> {
  // 検索モードの一覧を配列にして返します
  return ["単語", "和訳"];
}
```

`readSearchIndexes`メソッドは、与えられた検索モードに対して検索対象を返す必要があります。

例えば「単語」モードを与えられた場合は、以下のように単語のリストを返します。

```ts
[
  {
    id: "1",
    targets: ["skurla"],
  },
  {
    id: "2",
    targets: ["skurlaver"],
  },
  {
    id: "3",
    targets: ["slaxers"],
  },
  {
    id: "4",
    targets: ["slaxers"],
  },
  {
    id: "5",
    targets: ["xace"],
  },
];
```

例えば「和訳」モードを与えられた場合は、以下のように単語のリストを返します。

```ts
[
  {
    id: "1",
    targets: ["書く"],
  },
  {
    id: "2",
    targets: ["画家"],
  },
  {
    id: "3",
    targets: ["感謝する"],
  },
  {
    id: "4",
    targets: ["お礼をする"],
  },
  {
    id: "5",
    targets: ["ありがとう"],
  },
];
```

```ts
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
        // 正規表現で先頭の括弧を取り除きます
        targets: [record.meaning.match(/(\(.*\))?(.*)/)[2]],
      }));
    default:
      return [];
  }
}
```

最後に`onClick`メソッドを実装します。
`onClick`メソッドは、単語カードをクリックしたときに呼び出されます。
今回は実装しないので、メソッドが呼び出されたら`not implemented`というエラーを投げるようにします。

```ts
public async onClick(script: string, id: number): Promise<PageCard> {
  throw new Error("not implemented");
}
```

`TsvController`を拡張機能として起動するために、以下の行を追加します。

```ts
new TsvController().activate(Number(process.argv[2]));
```

完成したら、`index.ts`を保存します。
完成形は[こちら](src/index.ts)です。

`npm run build`を実行して、`dist`ディレクトリに`main.js`が生成されていることを確認します。

`node dist/main.js ポート番号`を実行して、拡張機能を起動させることができます。

### 拡張機能を登録する

それでは拡張機能を登録しましょう。
Otamajakushi Bookshelf直下に`extensions`ディレクトリを作成し、
`tsv-extension`ディレクトリを作成します。
その中に`main.js`をコピーします。
また、`activate.json`を作成して、以下の内容を入力します。

```json
{
    "win32": "node \"${__dirname}\\main.js\" ${portNumber}",
    "darwin": "node \"${__dirname}/main.js\" ${portNumber}",
    "linux": "node \"${__dirname}/main.js\" ${portNumber}"
}
```

Otamajakushi Bookshelfは`extensions`ディレクトリにある`activate.json`を読み込み、
OSに応じたコマンドを実行します。
今回は`activate.json`に`node dist/index.js ${portNumber}`を記述しています。
`${portNumber}`は、Otamajakushi Bookshelfが拡張機能に渡すポート番号です。
ポート番号はランダムに割り当てられるので、拡張機能側で受け取る必要があります。
`${__dirname}`は、`activate.json`があるディレクトリのパスを表します。

`activate.json`を保存したら、Otamajakushi Bookshelfを起動しましょう。
すでに起動している場合は再起動してください。

うまくいきましたか？
