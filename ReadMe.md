***当ReadMeの記述は一部最新版に準じない可能性があります***
# &gt;&gt;Anyget（仮） ReadMe  
## このツールについて  
[小説家になろう](https://syosetu.com/)等の小説投稿サイトにおける、いわゆる「架空掲示板」ジャンル作品の創作に対する支援ツールです。「架空掲示板」の他にも雛型の連続によって描かれる小説、つまり  
  
- チャットノベル  
- 架空Twitter  
- [ハーメルン](https://syosetu.org/)の特殊タグ多用小説  
  
などの執筆も効率化できます。  
### 「架空掲示板」ジャンルとは？  
その名の通り、「架空の世界における匿名掲示板」を舞台として物語を展開する小説ジャンルです。  
「匿名掲示板」という一般的なファンタジーには中々出てこないような概念が前提となっていることから、どちらかと言えばSFジャンルに多いです。  

## 推奨環境
- Google Chrome
## 用語  
### パネル  
AnygetのUIは、4枚のパネルによって構成されています。デフォルトで中央に配置されているパネルが**メインパネル**、その他のパネルが**サブパネル**です。  
パネルはレイアウト上、下記の3つの列に分けられています。  
- サブパネル1枚の列  
- メインパネル1枚の列  
- サブパネル2枚の列  
  
これらの列はメインパネルの「設定」メニューから並び替えが可能です。  
サブパネルの機能は、パネル上部の文字列をクリックしてプルダウンメニューから選択することで変更できます。  
  
## サブパネルの機能  
### テンプレートパネル  
本ツールにおける重要存在である**テンプレート**の設定を行うパネルです。上のテキストボックスにテンプレート用の文字列を入力して「**変更**」ボタンをクリックして下のフォームに反映することで、テンプレートの変更が可能です。  
  
#### テンプレートとは？  
レスの雛形です。例えば簡易的な匿名掲示板のテンプレートなら、  
  
```  
(番号)：(名前)　[(メールアドレス)]  
(本文)  
```  
  
という風に表現できるでしょう。この場合、`()`で囲まれた内容が可変部であることが何となく想像がつくと思います。Anygetではこれを厳密化して、テンプレートの**構文**を定義しています。  
  
#### テンプレートの構文  
テンプレートは基本的に**変数**と**地の文**によって構成されます。変数はレスを入力する際に可変部分としてテキストボックスの形を取り、それに対し地の文は不変部分です。  
変数は**名称**を**特殊記号**で挟むことによって宣言されます。名称はそのまま、ツール内での**変数名**として使用されます。新しい変数を宣言することはできても、既存の変数の名称を変更することは<u>今のところは</u>できません。  
以下に構文の具体的な仕様を記します。  
  
---  
  
- `$`特殊記号……名称を挟むことで**一行変数**を宣言します  
- `|`特殊記号……名称を挟むことで**複数行変数**を宣言します
- `%`特殊記号……名称を挟むことで**ラベル**を宣言します
- `\`特殊記号……文字の前に置くことで一切の特殊記号を**エスケープ**可能です。`\`そのものをエスケープしたいときは`\\`とします  
- `//`特殊記号……行頭に置くことでその行を**コメントアウト**します。

---  
  
例えば、このようなテンプレートを設定して「変更」ボタンを押したとします：  
  
```  
$number$：$\$to\\$ (12 minutes ago)  
|\\to\$|  
```  
  
この時、下のボックスのテンプレートは次のように表示され、  
  
![picture 3](images/20f1ce591ed3571e51d49bab4fef02376aa7e5e17e2a0559db8acfda8a560f96.png)    
  
  
メインパネル「レスの追加」モード下部の入力欄は次のように書き換えられます。  
  
![picture 4](images/4b1f2b426328c804b185503fffce1aa856ec79feb93ac2767face2bdda2d04d3.png)    
  
  
#### テンプレートのハイライト  
上の例でも確認できますが、テンプレートパネルの下部には簡易なハイライトの機能が付いています。  
トークンによって色が決められており、具体的には下記のようになっています。  
  
- 一行変数……#FF0000
- 複数行変数……#0000FF
- ラベル……#FFFF00
- エスケープ記号とその対象……#00FF00
- 地の文……テーマ依存  
  
#### テンプレートの切り替え  
テンプレートパネル下部の入力欄を操作することで、使用するテンプレートを切り替えることができます。  
テンプレートは一つのセーブファイル内に**複数個**混在させることが可能です。  
  
### 変数の詳細設定パネル  
変数の詳細設定パネルは、テンプレートパネルで宣言した変数について詳細な設定を行うパネルです。上部のリストから変数を選択したうえで下部に入力を行うことで設定が可能です。設定によっては使える変数の種類が限られる場合があります。  
#### 増加幅  
**両方可**  
「レス番」などの変数向けの設定です。「投稿の追加」ボタンを押すたびに、設定された値が入力欄の変数に**加算**されます。マイナスの値を設定すれば減算も可能です。**数字**[^1]にしか加算は行われません。  
#### 巻き戻し
**両方可**  
「増加幅」設定の追加オプションです。チェックを入れることで、「増加幅」の基本的な効果に加え、レスを削除するたびに、「増加幅」に設定された値が入力欄の変数から**減算**されます。
#### アンカー  
**一行変数限定**  
チェックボックスをオンにしたうえでテキストボックスに文字列を入力することで**アンカー**を設定できます。  
これは「特定の変数の直前に置くことでリンクを作ったりツールチップを表示したりできる」というもので、メインパネル「プレビュー」モードと「簡易プレビュー」パネル限定で使用できます。  
例えば変数`number`のアンカーに`>>`を設定すればレス番呼び出しが可能になりますし、変数`id`のアンカーに`id:`を設定すれば「id:KW2jqwoi君自演バレバレですよｗ」といったレスを挟んだ際具体的にどんなことをしているか確認できます。  
本文中に10000個以上存在するアンカーは弾かれます。  
#### 固定する  
**両方可**  
設定した変数は、レスの削除や並び替えの影響を受けず、その場に**固定され続け**ます。「ここにレスを挿入したいが、そうするトレス番がずれてしまう」という状況には、レス番に該当する変数を固定することで対処が可能です。  
#### 入力候補 
**一行変数限定** 
設定すると、「変数特定値メモ」で観測した値に基づいてテキストボックスフォーカス時に**入力候補**を表示します。  
「変数特定値メモ」が更新されなければ、候補の内容も更新されません。  
  
### ランダム文字列生成パネル  
IDやトリップなどに使用するランダムな文字列を自動生成するツールです。チェックボックスやテキストボックスに設定値を入力すると、それらの更新に呼応して生成した文字列が改行区切りで下のテキストエリアに表示されます。
#### 生成に関する設定  
##### 「A-Z」  
文字列の候補に大文字アルファベット（`ABCDEFGHIJKLMNOPQRSTUVWXYZ`）を追加します。  
##### 「a-z」  
文字列の候補に小文字アルファベット（`abcdefghijklmnopqrstuvwxyz`）を追加します。  
##### 「0-9」  
文字列の候補に数字（`0123456789`）を追加します。  
##### 「記号」  
文字列の候補に半角記号（``!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~``）を追加します。  
  
##### 「半角空白」  
文字列の候補に半角空白（` `）を追加します。  
  
##### 「自由入力」  
チェックを入れた上で**テキストボックスに入力した文字**を文字列の候補に追加します。重複は弾かれます。  
  
##### 「○文字」  
生成する文字列の長さを設定します。入力が無い場合1文字になります。  
##### 「○個」  
生成する文字列の個数を設定します。一つ一つは改行で区切られてテキストボックスに出力されます。入力が無い場合1個になります。  
#### 代入ツール  
ランダム文字列生成ツールで生成した値をそのまま何かしらの変数に**代入**できます。「上から●番目以降の変数■に代入」と言った風に行います。  
代入ツールはテキストボックスから入力値を取ってきてそれを**改行で分割**したうえで一つずつ代入するため、改行交じりの文字列は正常に代入できません。  
  
### 簡易プレビューパネル  
サブパネルに設定することで、編集中の小説を簡易的にプレビューすることが可能です。アンカーも動作します。ただし、アンカーをクリックしても簡易プレビューパネル内の対応メッセージには飛びません。  
基本的にメインパネル「プレビュー」モード（後述）と同じですが、軽量化のため一部アルゴリズムが違います。  
その関係で、時折挙動が不安定です。

### テキストメモパネル
メモを取るためのパネルです。大きな`+`ボタンでメモを追加し、`^`ボタンで上に移動、`v`ボタンで下に移動、小さな`+`ボタンで文字列を大きく、`-`ボタンで文字列を小さくできます。

### 変数特定値メモパネル
選択した変数における**特定の値**についてメモを取るためのパネルです。例えばSNSを舞台にした小説を書くとして、このパネルでユーザー名を格納する変数を選択すれば、登場するキャラクターについて資料を残しておくことが可能です。  
処理の関係でリロードは自動で行われないことに注意してください。パネル下部のリロードボタンをクリックすることで、本文に存在する変数がすべて集計され、特定値の一覧となって表示されます。

### メッセージ仮置き場パネル
メインパネル「レスの追加」モードからここにレスをドラッグすることで、レスを**一時的に保持**するためのパネルです。  
レスは、パネルそのものにドロップした場合最下部、パネル内のレスにドロップした場合その一つ下に挿入されます。

### ラベルの詳細設定パネル
テンプレートにおいて宣言したラベルについて、設定を行うことができるパネルです。まず上部のリストからラベルを選択した後、更に「監視対象とする変数を選択」メニューからラベルと紐づける変数を選択します。  
#### もし～なら～ でなければ～
監視対象の変数の値が1つ目のテキストボックスの内容であった時、ラベルの内容は2つ目のテキストボックスの値になり、そうでなければ3つめのテキストボックスの値になります。

#### クリックで増加
設定することで、ラベルをクリックした際に対象変数の値が設定した数だけ増加するようになります。
値が数値として解釈できない場合、これは無効化されます。

## メインパネルの機能  
上部のタブを切り替えることで、メインパネルの**モード**を変更することができます。タブメニュー自体は左右のボタンによってスクロールが可能です。  
### 「レスの追加」モード  
基本的に、ユーザーはこのモードを軸に小説を執筆していくことになります。  
  
#### 基本的構造  
このモードにおいて、編集は名前通り「**レス（投稿）の追加**」という形で行われます。パネルの下部に存在する**入力欄**が選択中のテンプレートに応じて変化するので、そこに投稿の内容を入力したうえで「**投稿を追加**」ボタンをクリックすることでレスの追加が可能です。レスは上部ブロックにボックスという形で追加・反映されます。一つ一つのレスは独立しています。  
また、「投稿を追加」ボタンの横には**個数設定ボックス**が存在し、レスの追加はこの中に入力した数の分だけ行われます。  
このモードを選択した状態で`Ctrl+F`ショートカットキーを入力することで、**検索ボックス**が利用可能です。
  
#### レスそのものの構造  
##### テキストボックス  
前述の一行変数・複数行変数をテンプレートとして解釈して生成される入力欄です。一行変数のテキストボックスは`<div>`要素で囲まれた`<input>`要素であり、複数行変数のテキストボックスは`<textarea>`要素です。  
テキストボックスに入力した文字列が、そのまま掲示板小説の内容になります。  

##### チェックボックス
クリックすることで、後述の**レスの選択**を行うことが可能です。
##### 固定ボタン  
削除/編集したくないレスを**固定**するボタンです。レス自体とそれが持つテキストボックス群はすべて保護され、一切の編集や削除を受け付けなくなります。  
固定ボタンをもう1度押すと、固定は解除されます。  
##### 削除ボタン  
マウスオーバー時に出現します。クリックすることでレスを**削除**できます。  
「削除ボタンを押すとレス番が削除されてしまい、ズレが発生する」という場合は、「固定する」設定を行えばズレが発生しません。  
##### テンプレート入力欄  
マウスオーバー時に出現するプルダウンメニューです。選択入力することで、レスのテンプレートを入力内容を番号として持つ物に変更できます。  
#### レスの選択
レスの左上に存在するチェックボックスの操作、またはレスそのもののクリックにより、対象のレスを**選択**することができます。
レスその物のクリックによる選択は、修飾キーの組み合わせによって異なる挙動をします。
##### 修飾キーと挙動の対応

- **クリック**：
  - 自分が選択されており、かつ自分以外に選択されたレスが存在しない場合：
    - 自分を非選択状態にする。
  - でなければ：
    - 他のレスを全て非選択状態にした後、自分を選択状態にする。
- **Ctrl+クリック**：
  - 自分が選択されており、かつ自分以外に選択されたレスが存在しない場合：
    - 自分を非選択状態にする。
  - でなければ：
    - 自分を選択状態にする。
- **Shift+クリック**：
  - 自分を選択する。
  - また、自分より上に選択状態のレスが存在する場合：
    - 最も近い自分より上の選択状態のレスから自分の間に挟まったレスを、すべて選択状態にする。
  - また、自分より下に選択状態のレスが存在する場合：
    - 最も近い自分より下の選択状態のレスから自分の間に挟まったレスを、すべて選択状態にする。
- **Ctrl+Shift+クリック**：
  - 自分を選択状態にする。

##### 選択すると何が起こるのか？
- 以下のアクションの影響が、選択済みのレス**すべて**に影響するようになります：
  - レスの削除
  - 使用テンプレートの変更
  - レスの固定状態の反転
- 選択状態のレスを**ドラッグ**することで、並び替えができるようになります
#### 検索ボックス
『レスの追加」モードで`Ctrl+F`キーを押すことで表示されるボックスです。  
変数の値を検索、置換することが可能です。  
検索はマッチした文字列のうち一つに**フォーカス**する形で行われます。操作によりフォーカス対象の文字列を切り換えたり、内容を変更したりすることができます。

##### 検索欄
検索実行時に参照される検索ワードを入力するスペースです。  
検索ボックス表示時、自動的にフォーカスされるようになっています。  
横に存在するチェックボックスをオンにすることで、**正規表現**を使用して検索できます。  
検索時は、変数内のマッチした文字列がハイライトされるようになっています。
##### `↑`ボタン
クリックすることで検索を行い、フォーカス中のマッチした文字列からひとつ前のマッチした文字列へと移動します。  
検索欄にフォーカスしながら`Shift+Enter`キーで同じ動作が可能です。
##### `↓`ボタン
クリックすることで検索を行い、フォーカス中のマッチした文字列からひとつ後のマッチした文字列へと移動します。  
検索欄にフォーカスしながら`Enter`キーで同じ動作が可能です。

##### `×`ボタン
クリックすると検索ボックスを閉じます。
##### 折りたたみボタン
クリックすることで、置換欄を表示するかどうかを切り換えるボタンです。  
##### 置換欄
置換実行時に参照される置換ワードを入力するスペースです。

##### `単`ボタン
クリックすることで、フォーカス中のマッチした文字列を置換欄に入力した文字列に置換します。  
置換欄にフォーカスしながら`Enter`キーで同じ動作が可能です。

##### `全`ボタン
クリックすることで、マッチした文字列を**すべて**置換欄に入力した文字列に置換します。  
置換欄にフォーカスしながら`Ctrl+Alt+Enter`キーで同じ動作が可能です。
  
### 「プレビュー」モード  
執筆した掲示板を閲覧（プレビュー）できます。「レスの追加」モードではレス内の変数は単なる文字列ではなくテキストボックスであることによって若干の違和感がありますが、このモードではすべてが同一の書体で表現されます。  
「アンカー」設定を行うことによってアンカーを追加できます。  
  
### 「プレーンテキスト」モード  
執筆した掲示板をプレーンテキストとしてテキストボックスに表示します。テキストボックスを編集しても元データには影響しません。目安として、テキストボックス内の文字数を数える機能が付いています。  
#### レス間文字列の設定  
レスとレスの間の『区切り文字』を設定する機能です。デフォルトでは`\n`（改行）が入力されており、これを編集することで様々な設定が可能です。例えばこれを`\n\n`にすればより見やすくなるでしょうし、`\n---\n`などにすれば、水平線のようなものを描けるでしょう。  
#### 置換  
「from」欄に対象、「to」欄に結果を入力したうえで「置換」ボタンを押すことでテキストボックス内の文字列を**置換**できます。  
前述のとおりテキストボックスを編集しても元データには影響しないため、あくまでも微調整のためのものとなります。  
`.*`チェックボックスをオンにすれば正規表現で置換できます。  
#### コピー  
テキストボックス内の全文字列をクリップボードにコピーします。  
  
### 「セーブ/ロード」モード  
テキストボックスにタイトルを入力したうえで**セーブボタン**を押すことで`.json`ファイル形式によるセーブが可能です。  
セーブファイルをアップロードして**ロードボタン**を押すことでロードが可能です。  
**最後のセッションからロード**ボタンは、&gt;&gt;Anygetを閉じる際にブラウザに自動保存されるデータからロードを行います。  
**テンプレートのみセーブ**ボタンは、編集したレスの内容を閲覧せず、テンプレートの情報と設定の情報のみで保存します。  
**設定のみセーブ**ボタンは、編集したレスの内容やテンプレートの情報を閲覧せず、設定の情報のみで保存します。
  
### 「設定」モード  
変数の詳細設定パネルが個々の変数について設定を行うのに対し、このモードでは作品全体について設定します。  
上部の「設定の検索」欄に単語を入力することで、その文字列を含む設定のみを表示します。  
設定の一覧については、[こちら](./Settings.md)を参照してください。
  
### 「置換する」モード  
掲示板の内容を正規表現を使用して置換できます。  
#### 「変数を選択」部分  
置換対象となる変数にチェックを入れます。『全選択』ボタンで全ての変数がチェックされ、『反転』ボタンで反転されます。  
#### 各種設定部分  
チェックボックスによる設定を行います。設定は基本的に正規表現の各種フラグと結びついており、置換結果に影響します。  
- 「`.`に改行をマッチ」……Javascript正規表現における`s`フラグをオンにします。  
- 「マルチライン」……Javascript正規表現における`m`フラグをオンにします。  
- 「大文字・小文字無視」……Javascript正規表現における`i`フラグをオンにします。  
- 「全置換」……Javascript正規表現における`g`フラグをオンにし、さらにそれぞれのレス内のすべての変数を置換対象にします。  
  

### 「エクスポート」モード

#### 「datファイル」モード
作成した架空掲示板を、2ch専用ブラウザ等で開ける`.dat`ファイルにエクスポートするモードです。テキストボックスに**テンプレートパネルと同じ記法で**パラメータを入力した後に「datファイルを生成」ボタンを押すことでダウンロードが始まります。パラメータは以下の通りです。  
  
- **スレッドタイトル**……スレッドのタイトルを指定するパラメータです。省略した場合は「UNKNOWN」になります。ファイル名にも使用されます。このパラメータだけは特殊で、テンプレート記法を**使わず**プレーンテキストとして入力します。  
- **名前**……各投稿の"名前"に相当する部分を指定するパラメータです。トリップの処理機能は付いていません。  
- **メールアドレス**……各投稿の"メールアドレス"に相当する部分を指定するパラメータです。  
- **日付・IDなど**……各投稿の"日付"、"ID"等に相当する部分を指定するパラメータです。  
- **本文**……各投稿の"本文"に相当する部分を指定するパラメータです。唯一、途中で改行を挟んでもそれが無視されないパラメータです。  

### 「インポート」モード
- 未実装
  
  
[^1]:より具体的に言えば、`\-?[0-9]+(\.[0-9]+)?`の正規表現にマッチする文字列
