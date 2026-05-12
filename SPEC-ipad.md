# 4x — iPad対応 追加タスク

## 目的
iPadでの利用を想定した最小限の改修。家族間シェアでの実用性を担保する。

## タスク

### 1. ファイル名のリネーム
- `4x.html` → `index.html`
- URLが短くなる（`/4x/` で開ける）

### 2. PWAマニフェスト追加
`manifest.webmanifest` を新規作成し、`index.html` の `<head>` で参照。
- name: "4x Player"
- short_name: "4x"
- display: "standalone"
- orientation: "any"
- theme_color: "#0c0c0c"
- background_color: "#0c0c0c"
- icons: 192px / 512px のSVG（単色 #d4a76a で "4×" の文字をmonospace表示）

「ホーム画面に追加」後、Safariのアドレスバーなしで起動できるようにする。

### 3. 最小Service Worker
`sw.js` を新規作成し、`index.html` と `manifest.webmanifest` のみをキャッシュ。
- オフライン起動を可能にする
- 音源ファイルはキャッシュしない（容量爆発防止）
- 更新検知時は自動でskipWaiting

### 4. バックグラウンド再生対策
Media Session APIを実装：
```js
navigator.mediaSession.setActionHandler('play', ...);
navigator.mediaSession.setActionHandler('pause', ...);
navigator.mediaSession.setActionHandler('previoustrack', ...);
navigator.mediaSession.setActionHandler('nexttrack', ...);
navigator.mediaSession.metadata = new MediaMetadata({ title, artist: '4x Player' });
```
コントロールセンター・ロック画面からの操作を可能にする。

### 5. iPad UIの微調整
- ドロップゾーンの文言を「タップしてファイルを選択 / ドロップ」に変更（iPadではドラッグ操作が直感的でないため）
- ボタンのタップ領域を最低44px確保（Apple HIG準拠）
- `touch-action: manipulation` でダブルタップズーム抑制
- スライダーのthumbサイズをタッチ用に16pxへ拡大

### 6. iOS Safari固有の対応
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<meta name="apple-mobile-web-app-title" content="4x">`
- `<link rel="apple-touch-icon" href="...">` （180x180）

### 7. ファイル受け取り強化（任意）
Web Share Target API（PWAインストール後、他アプリから「共有」で4xに音源を渡せる）。
manifest.webmanifest に `share_target` を追加。
- iOS Safariは2026年時点で未対応の可能性あり → 実装しても動かない場合は削除

## 受け入れ基準
- [ ] iPad Safariで開ける
- [ ] 「ホーム画面に追加」後、フルスクリーンで起動する
- [ ] 機内モードでも起動する（音源は別途必要）
- [ ] ロック画面に再生コントロールが表示される
- [ ] 4×再生中に画面ロックしても再生継続する
- [ ] ボタン・スライダーが指で操作しやすい

## 想定しないこと
- Android対応の最適化（家族で使うのがiPadなら不要）
- iCloud Drive連携（複雑度が跳ね上がる）
- ファイル永続化
