const fs = require("fs");
const autoVariableScss = "src/styles/_variables/_auto-variables.scss";
const config = require("../package.json").config;
// 書き込むデータ準備
const data = `
// このファイルは自動生成されています。
// このファイルを編集したい場合は、task/create-scss-val.jsを編集してから再度bulidしてください。
$breakpoint-md: ${config.breakpoints.md}px;
`;

// 書き込み
fs.writeFile(autoVariableScss, data, (err) => {
  if (err) throw err;
  console.log('_auto-variables.scssファイルを作成しました。');
});