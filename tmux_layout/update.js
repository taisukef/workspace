const path = "./";
const files = [];
for await (const f of Deno.readDir(path)) {
  if (!f.isDirectory && f.name.endsWith(".code-workspace")) {
    const json = JSON.parse(await Deno.readTextFile(path + f.name));
    const name = f.name.substring(0, f.name.indexOf("."));
    files.push({ name, path: json.folders[0].path });
  }
}
//console.log(files);

const fnsh = "./tmux_layout/personal.sh";
const sh = await Deno.readTextFile(fnsh);

const sh2 = sh.replace(/WORKSPACE_COUNT=(\d+)/, "WORKSPACE_COUNT=" + files.length);
const sh3 = sh2.replace(/WORKSPACE_NAME=\([^\)]+\)/, "WORKSPACE_NAME=(\n" + files.map(f => "  " + f.name).join("\n") + "\n)\n");
const sh4 = sh3.replace(/WORKSPACE_PATH=\([^\)]+\)/, "WORKSPACE_PATH=(\n" + files.map(f => "  " + f.path).join("\n") + "\n)\n");
//console.log(sh4, files);
await Deno.writeTextFile(fnsh, sh4);
