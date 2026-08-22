# OH MY ZINE GUI DESIGN SYSTEM v1.0

## 0. コンセプト

**Webから入る、架空のパソコン。**

OH MY ZINEは普通のWebサイトではなく、ブラウザ越しに起動する架空のデスクトップ環境として設計する。

ベースの思想は2000年代前半のGUI、特に **Apple Aquaの透明感・ゼリー感・立体感・光沢** から強く影響を受ける。ただしAquaそのものを再現するのではなく、OH MY ZINE独自の雑誌・VHS・犬・Web広告・デスクトップペットなどを混ぜた架空OSとして再構成する。

目標：
- 触った瞬間に「パソコンっぽい」と感じる
- どの画面も同じOSの中に見える
- 遊び心は強いが、操作は迷わない
- 2000年代感があるが、Windows/Macのコピーにはしない

## 1. 世界観の階層

UIは必ず以下の5階層で考える。

1. **DESKTOP** — 壁紙、カーソル、ショートカット、デスクトップペット、謎広告、常駐物
2. **WINDOW** — タイトルバー、最小化、最大化、閉じる、ウィンドウ枠
3. **APPLICATION** — FASHION / MAGAZINE COLLECTION / ABOUT / ARTICLE / PHOTO CABINET
4. **CONTROL** — ボタン、タブ、入力欄、ラベル、チェックボックス、スクロールバー
5. **SYSTEM FEEDBACK** — Hover / Pressed / Selected / Disabled / Loading / Error / Dialog

**同じ役割のものは、同じ見た目・同じ動作にする。**

## 2. デザイン原則

### RULE 01 — 「全部同じ」ではなく「同じ役割は同じ」
- `READ REVIEWS` → Action Button
- `ABOUT US` → Action Button
- `FASHION / MUSIC / CULTURE` → Status / Category Label
- `MY PHOTO CABINET` → App / File Label

### RULE 02 — 光源は左上
- 上・左 = 明るい
- 下・右 = 暗い
- Pressed = ハイライト減少 + 1px沈む

### RULE 03 — 色には意味を持たせる
- Aqua Blue = 選択、主要操作、情報
- Graphite = OSの基本素材
- Green = 成功 / ONLINE
- Yellow = 注意 / NEW
- Red = DELETE / CLOSE / ERROR
- Pink = OH MY ZINE固有アクセント

### RULE 04 — 4pxグリッド
- 4px = 微調整
- 8px = 小さい間隔
- 12px = UI内部
- 16px = パネル余白
- 24px = セクション
- 32px = 大きな区切り

### RULE 05 — UIは必ず状態を持つ
Normal / Hover / Pressed / Focus / Disabled を用意する。

## 3. OH MY ZINEのAqua解釈

### 使う
- 透明感
- 上半分の白い光沢
- ガラス / ゼリーのような丸み
- 青〜シアンの選択色
- グラファイト・シルバーの筐体感
- 柔らかいドロップシャドウ
- 押したときに沈む物理感

### やりすぎない
- 全要素を透明ガラスにしない
- すべてのボタンを丸いゼリーボタンにしない
- レインボーカラーを大量に使わない
- Mac OS XのUIをそのままコピーしない

**Aquaの素材感 + 2000年代Webのチープさ** が核。

## 4. カラーパレット

### System Neutrals
- `--omz-desktop-gray: #cccccc`
- `--omz-graphite-900: #25292d`
- `--omz-graphite-700: #59636a`
- `--omz-graphite-500: #8d9aa1`
- `--omz-silver-300: #d7e0e4`
- `--omz-silver-100: #f4f8fa`
- `--omz-white: #ffffff`

### Aqua
- `--omz-aqua-700: #247ca8`
- `--omz-aqua-500: #49a9d0`
- `--omz-aqua-300: #9bd8ec`
- `--omz-aqua-100: #e8f8ff`

### Semantic
- `--omz-success: #5aa66a`
- `--omz-warning: #e7c64a`
- `--omz-danger: #cf5c68`
- `--omz-pink: #e58abd`

## 5. タイポグラフィ

### UI Font
`"Lucida Grande", "Segoe UI", Tahoma, Arial, sans-serif`

### System / File Font
`"Courier New", monospace`

`FEATURE_01.HTML` / `OH_MY_ZINE.EXE` / `VISITOR 000359` などに使用。

### Editorial Font
記事タイトル・本文は読みやすさを優先し、GUIフォントとは分離してよい。

## 6. Radius

種類は原則4つだけ。
- Window: `10px`
- Panel: `6px`
- Small UI: `4px`
- Aqua Button: `999px`

## 7. Shadow / Depth

- LEVEL 0 / Flat — テキスト、ラベル
- LEVEL 1 / Control — ボタン、入力欄 `0 1px 2px rgba(30,45,55,.25)`
- LEVEL 2 / Panel — カード `0 3px 8px rgba(30,45,55,.20)`
- LEVEL 3 / Window — アプリ本体 `0 12px 28px rgba(20,30,38,.26)`

影の強さで階層を示す。

## 8. コンポーネント

### WINDOW
- 全アプリ共通のタイトルバー・境界線・操作ボタン
- アプリごとの差はタイトル、アイコン、内部コンテンツに限定

### TITLE BAR
- 高さ 28〜32px
- Aqua BlueまたはGraphite
- 上端に白いハイライト
- アプリ名は左、操作ボタンは右

### ACTION BUTTON
例: CONTINUE READING / READ REVIEWS / ABOUT US / OPEN COLLECTION
- 高さ 28〜34px
- 白〜シアンの光沢
- Pressed時に1px沈む

### CATEGORY / STATUS LABEL
例: FASHION / MUSIC / CULTURE / ARTICLE / REVIEWED
- ボタンより平坦
- クリック可能に見せすぎない

### APP / FILE LABEL
例: MY PHOTO CABINET / FEATURE_01.HTML / RANDOM_PICKS.HTML
- 通常ボタンと区別
- 小さめ角丸
- Courierまたはシステムフォント

### TAB
HOME / FASHION / MAGAZINE COLLECTION / ABOUT
- Navigation専用
- 非選択 = Silver / Graphite
- 選択 = Aqua

### INPUT / SEARCH
- 凹んで見える
- 白背景 + inset shadow
- focus時にAqua outline

### DIALOG
DELETE / 保存 / 初回起動 / エラー / 確認に限定。

## 9. HOMEの役割分け
- `FASHION / MUSIC / CULTURE` → Status Label
- `CONTINUE READING` → Primary Action
- `MY PHOTO CABINET` → App Label
- `ABOUT US` → Secondary Action
- `READ REVIEWS` → Secondary Action
- `FEATURE_01.HTML` → Window/File Title
- `RANDOM_PICKS.HTML` → Window/File Title
- Desktop Pet → Desktop Object / Ad
- X Banner → External Shortcut / Ad

## 10. 遊びと操作の境界

### 遊んでいい
犬、デスクトップペット、VHS、謎広告、Visitor Counter、Fake Error、Cookie、起動音、壁紙、スクリーンセーバー。

### 絶対に分かりやすく
HOME、BACK、SEARCH、CLOSE、記事を読む、次の記事、MAGAZINE COLLECTION。

**「何かわからないけど押したい」は遊び。**
**「記事を読みたいのに押す場所が分からない」は失敗。**

## 11. 禁止事項
- 同じ役割のボタンに別々の光源を使う
- 影の方向を要素ごとに変える
- クリックできないものを強いボタン風にする
- 1ページだけ別OSのようなUIにする
- 無意味な色追加
- Aquaの光沢を全要素に付ける
- Windows XP / Mac OS XのロゴやUIをそのままコピーする

## 12. 完成イメージ

**「2002〜2008年頃に存在したかもしれない、雑誌好きが自作した架空PC」**

構成比の目安:
- Apple Aqua / Desktop GUI: 45%
- Windows / 2000s PC UI: 20%
- 2000年代Web: 15%
- OH MY ZINE独自要素: 20%

犬、雑誌、VHS、変な広告、ファッション、ブログが全部「このパソコンに入っているソフト」として存在する。

## 13. 最優先で直す順番
1. Window / Titlebar
2. Button
3. Tab
4. Label
5. Panel
6. Input
7. Dialog
8. Icon
9. Animation
10. Desktop gimmick

まず1〜5を統一してから、遊びを増やす。
