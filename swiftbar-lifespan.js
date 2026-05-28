#!/usr/bin/env node
// <swiftbar.title>残り寿命</swiftbar.title>
// <swiftbar.version>1.0</swiftbar.version>
// <swiftbar.desc>Remaining lifespan countdown in the macOS menu bar</swiftbar.desc>
// <swiftbar.refreshTime>60</swiftbar.refreshTime>
//
// ===== SwiftBar プラグイン =====
// https://swiftbar.app
//
// セットアップ:
//   1. SwiftBar をインストール (https://swiftbar.app)
//   2. このファイルを「lifespan.1m.js」にリネームして Plugin フォルダに配置
//      ファイル名の「1m」が更新間隔（毎分）を意味する
//   3. BIRTH_DATE と GENDER を自分の情報に変更
//   4. ターミナルで: chmod +x lifespan.1m.js
//   5. SwiftBar からプラグインを読み込む

const BIRTH_DATE = "1990-01-01"; // 生年月日 (YYYY-MM-DD)
const GENDER     = "male";       // "male" = 男性 / "female" = 女性

// 厚生労働省 令和5年(2023)簡易生命表
const EXP = { male: 81.09, female: 87.14 };

const birth   = new Date(BIRTH_DATE + "T00:00:00");
const lifeYrs = EXP[GENDER];
const deathMs = birth.getTime() + lifeYrs * 365.25 * 24 * 3600 * 1000;
const now     = Date.now();
const rem     = Math.max(0, deathMs - now);
const totalMs = deathMs - birth.getTime();
const pct     = (now - birth.getTime()) / totalMs * 100;

const s    = rem / 1000;
const yrs  = s / (365.25 * 24 * 3600);
const days = Math.floor(s / 86400);
const hrs  = Math.floor((s % 86400) / 3600);
const mins = Math.floor((s % 3600) / 60);
const secs = Math.floor(s % 60);

const gLabel = GENDER === "male" ? "男性" : "女性";
const pad2 = n => String(n).padStart(2, "0");

// メニューバー表示（1行目）
console.log(`⏳ ${yrs.toFixed(1)}年`);

// ドロップダウン
console.log("---");
console.log(`残り寿命 | size=13`);
console.log("---");
console.log(`${days.toLocaleString()} 日 | size=16`);
console.log(`${pad2(hrs)}:${pad2(mins)}:${pad2(secs)} 時:分:秒 | size=14`);
console.log("---");
console.log(`消費済み: ${pct.toFixed(3)}% | size=11 color=#6a6864`);
console.log(`平均寿命: ${lifeYrs}年（${gLabel}）| size=11 color=#6a6864`);
console.log(`誕生日: ${BIRTH_DATE} | size=11 color=#6a6864`);
