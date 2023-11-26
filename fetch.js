function sleep(msec) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

function toKanjiId(str) {
  const hex = str.codePointAt(0).toString(16);
  return ("00000" + hex).slice(-5);
}

function getSingleKanjiInfoFromIPA(kanji) {
  return new Promise((resolve) => {
    const kanjiId = toKanjiId(kanji);
    fetch("https://mojikiban.ipa.go.jp/mji/q?UCS=0x" + kanjiId)
      .then((response) => response.json())
      .then((data) => resolve([kanji, data]));
  });
}

async function getKanjiInfoFromIPA() {
  const kanjiInfo = {};
  for (const kanjis of gradeByKanjis) {
    for (const kanji of kanjis) {
      await getSingleKanjiInfoFromIPA(kanji).then((res) => {
        kanjiInfo[kanji] = res;
      });
      await sleep(2000);
    }
  }
  return kanjiInfo;
}

getKanjiInfoFromIPA().then((kanjiInfo) => {
  const json = JSON.stringify(kanjiInfo, null, "\t");
  Deno.writeTextFileSync("mojikiban.json", json);
});
