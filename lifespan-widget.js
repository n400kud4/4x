// ===== 残り寿命 Widget — Scriptable =====
// https://scriptable.app
//
// 使い方:
//   1. Scriptable アプリをインストール
//   2. このスクリプトを新規スクリプトとして貼り付け
//   3. 下記の BIRTH_DATE と GENDER を自分の情報に変更して保存
//   4. ホーム画面を長押し → ウィジェット追加 → Scriptable → このスクリプトを選択
//   5. Small / Medium / Large の各サイズに対応

const BIRTH_DATE = "1990-01-01"; // 生年月日 (YYYY-MM-DD)
const GENDER     = "male";       // "male" = 男性 / "female" = 女性

// 厚生労働省 令和5年(2023)簡易生命表
const EXP = { male: 81.09, female: 87.14 };

const birth    = new Date(BIRTH_DATE + "T00:00:00");
const lifeYrs  = EXP[GENDER];
const deathMs  = birth.getTime() + lifeYrs * 365.25 * 24 * 3600 * 1000;
const now      = Date.now();
const rem      = Math.max(0, deathMs - now);
const totalMs  = deathMs - birth.getTime();
const pct      = (now - birth.getTime()) / totalMs * 100;

const s    = rem / 1000;
const yrs  = s / (365.25 * 24 * 3600);
const days = Math.floor(s / 86400);
const hrs  = Math.floor((s % 86400) / 3600);
const mins = Math.floor((s % 3600) / 60);
const secs = Math.floor(s % 60);

const C = {
  bg:     new Color("#0c0c0c"),
  fg:     new Color("#e8e6e1"),
  dim:    new Color("#6a6864"),
  accent: new Color("#d4a76a"),
};
const F = {
  tiny:   Font.systemFont(9),
  small:  Font.systemFont(11),
  mid:    Font.systemFont(14),
  large:  Font.systemFont(20),
  bigBold: Font.boldSystemFont(48),
  hugeBold: Font.boldSystemFont(66),
};

const w = new ListWidget();
w.backgroundColor = C.bg;

const size = config.widgetFamily || "medium";

if (size === "small") {
  w.setPadding(14, 14, 14, 14);

  const lbl = w.addText("残り寿命");
  lbl.font = F.tiny;
  lbl.textColor = C.dim;
  w.addSpacer(8);

  const bigN = w.addText(yrs.toFixed(1));
  bigN.font = F.hugeBold;
  bigN.textColor = C.accent;
  bigN.minimumScaleFactor = 0.4;

  const bigU = w.addText("年");
  bigU.font = F.small;
  bigU.textColor = C.dim;
  w.addSpacer(6);

  const daysT = w.addText(days.toLocaleString() + " 日");
  daysT.font = F.mid;
  daysT.textColor = C.fg;
  w.addSpacer();

  const pctT = w.addText(pct.toFixed(1) + "% 消費");
  pctT.font = F.tiny;
  pctT.textColor = C.dim;

} else if (size === "medium") {
  w.setPadding(14, 16, 14, 16);

  // header row
  const hdr = w.addStack();
  const hLbl = hdr.addText("残り寿命");
  hLbl.font = F.tiny;
  hLbl.textColor = C.dim;
  hdr.addSpacer();
  const hPct = hdr.addText(pct.toFixed(2) + "% 消費");
  hPct.font = F.tiny;
  hPct.textColor = C.dim;
  w.addSpacer(8);

  // big years
  const bigRow = w.addStack();
  bigRow.centerAlignContent();
  const bigN = bigRow.addText(yrs.toFixed(1));
  bigN.font = F.bigBold;
  bigN.textColor = C.accent;
  bigRow.addSpacer(5);
  const bigU = bigRow.addText("年");
  bigU.font = F.mid;
  bigU.textColor = C.dim;
  w.addSpacer(10);

  // detail row
  const det = w.addStack();
  det.spacing = 14;

  const addCell = (val, unit) => {
    const col = det.addStack();
    col.layoutVertically();
    const v = col.addText(val);
    v.font = Font.systemFont(15);
    v.textColor = C.fg;
    const u = col.addText(unit);
    u.font = Font.systemFont(9);
    u.textColor = C.dim;
  };

  addCell(days.toLocaleString(), "日");
  addCell(String(hrs).padStart(2, "0"), "時間");
  addCell(String(mins).padStart(2, "0"), "分");
  addCell(String(secs).padStart(2, "0"), "秒");

} else {
  // large
  w.setPadding(16, 18, 16, 18);

  const lbl = w.addText("残り寿命");
  lbl.font = F.small;
  lbl.textColor = C.dim;
  w.addSpacer(10);

  const bigN = w.addText(yrs.toFixed(2));
  bigN.font = Font.boldSystemFont(72);
  bigN.textColor = C.accent;
  bigN.minimumScaleFactor = 0.5;

  const bigU = w.addText("年");
  bigU.font = F.mid;
  bigU.textColor = C.dim;
  w.addSpacer(14);

  const addRow = (val, unit) => {
    const row = w.addStack();
    row.centerAlignContent();
    const v = row.addText(val);
    v.font = F.large;
    v.textColor = C.fg;
    row.addSpacer(8);
    const u = row.addText(unit);
    u.font = Font.systemFont(11);
    u.textColor = C.dim;
    w.addSpacer(4);
  };

  addRow(days.toLocaleString(), "日");
  addRow(
    String(hrs).padStart(2,"0") + ":" +
    String(mins).padStart(2,"0") + ":" +
    String(secs).padStart(2,"0"),
    "時:分:秒"
  );

  w.addSpacer();

  const pctT = w.addText(pct.toFixed(3) + "% 消費済み");
  pctT.font = Font.systemFont(11);
  pctT.textColor = C.dim;

  const gLabel = GENDER === "male" ? "男性" : "女性";
  const expT = w.addText("平均寿命 " + lifeYrs + "年（" + gLabel + "）");
  expT.font = Font.systemFont(10);
  expT.textColor = C.dim;
}

Script.setWidget(w);
Script.complete();
