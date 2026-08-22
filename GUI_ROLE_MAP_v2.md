# OH MY ZINE HOME GUI / ROLE MAP v2

## コンセプト
Webから開く1枚の架空アプリケーション `OH_MY_ZINE.EXE`。
デスクトップOSやStart Menuは作らない。

## 設計順
**役割 → サイズ → 配置 → 状態 → 奥行き → 色 → Aqua装飾**

## 現在のHOME分類
- `OH_MY_ZINE.EXE` = Main Window / Depth 3
- HOME / FASHION / MAGAZINE / ABOUT = Navigation Tabs
- FEATURE / RANDOM PICKS = Content Panel / Depth 2
- MAGAZINE COLLECTION = Widget Panel / Depth 2
- PHOTO CABINET = Media Panel / Depth 2
- CONTINUE READING = Primary Action / 32px
- ABOUT US / READ REVIEWS = Secondary Action / 32px
- SHUFFLE / Info / × / photo arrows = Toolbar Control / 24px
- DELETE / Close = Destructive role; geometryは同じで色だけ赤
- FASHION / MUSIC / CULTURE = Status Label / 24px
- ABOUT THIS ZINE = Status Label
- MY PHOTO CABINET = App/File Label / 紫の四角ラベル
- footer = Status Bar / 28px

## 今回の重要変更
1. FEATURE_01.HTML にあった押せない `_ □ ×` を `ARTICLE VIEW` に変更。
2. 同じ役割のButtonはdesktopで32pxに統一。
3. 小さいTool Buttonは24px。
4. PrimaryだけAquaを強める。サイズで不必要に差を付けない。
5. Status / File Labelは押せるButtonに見せない。
6. Main Window > Panel > Control の順で影を強くする。
7. 左上光源を全Controlで共通化。
8. Normal / Hover / Pressed / Focus / Disabled / Selectedを区別。
9. Focusは全体で同じAqua outline。
10. モバイルでは主要Actionを44pxにしてタッチしやすくする。

## 導入
ZIP内の構造のまま上書き。
`index.html` は `CSS/home-gui-system.css` を `finishing.css` の後に読み込む。
既存 `index.css` と `home.js` は変更不要。
