// A small Python highlighter for the demo editor (the real page uses Monaco).
const KW = /\b(def|return|for|in|if|else|elif|import|from|as|with|try|except|raise|not|and|or|is|None|True|False|lambda|while|class|pass)\b/;
const RULES = [["tk-com", /#[^\n]*/], ["tk-str", /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/],
  ["tk-kw", KW], ["tk-num", /\b\d+(?:\.\d+)?\b/], ["tk-self", /\bqbash\b/], ["tk-fn", /\b[a-z_][a-z0-9_]*(?=\()/]];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function highlight(code) {
  let out = "", rest = code;
  while (rest.length) {
    let best = null;
    for (const [cls, re] of RULES) {
      const m = re.exec(rest);
      if (m && (!best || m.index < best.index)) best = { index: m.index, text: m[0], cls };
    }
    if (!best) { out += esc(rest); break; }
    out += esc(rest.slice(0, best.index)) + `<span class="${best.cls}">${esc(best.text)}</span>`;
    rest = rest.slice(best.index + best.text.length);
  }
  return out + "\n";
}
