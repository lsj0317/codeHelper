/**
 * 코드 내보내기 유틸리티
 * - 파일 다운로드 (.js / .html)
 * - CodePen / JSFiddle 열기
 * - GitHub Gist 저장
 */

// ── File Download ──

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJs(code: string, filename = "snippet.js") {
  downloadBlob(code, filename, "text/javascript;charset=utf-8");
}

export function downloadHtml(jsCode: string, htmlCode: string, filename = "snippet.html") {
  const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QueryPick Snippet</title>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"><\/script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; }
  </style>
</head>
<body>
${htmlCode}

<script>
$(function() {
${jsCode.split("\n").map((l) => "  " + l).join("\n")}
});
<\/script>
</body>
</html>`;
  downloadBlob(fullHtml, filename, "text/html;charset=utf-8");
}

// ── CodePen ──

export function openInCodePen(jsCode: string, htmlCode: string, title = "QueryPick Snippet") {
  const data = JSON.stringify({
    title,
    html: htmlCode,
    js: jsCode,
    js_external: "https://code.jquery.com/jquery-3.7.1.min.js",
    editors: "101", // HTML open, CSS closed, JS open
  });

  const form = document.createElement("form");
  form.action = "https://codepen.io/pen/define";
  form.method = "POST";
  form.target = "_blank";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "data";
  input.value = data;

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

// ── JSFiddle ──

export function openInJSFiddle(jsCode: string, htmlCode: string, title = "QueryPick Snippet") {
  const form = document.createElement("form");
  form.action = "https://jsfiddle.net/api/post/library/pure/";
  form.method = "POST";
  form.target = "_blank";

  const fields: Record<string, string> = {
    title,
    html: htmlCode,
    js: jsCode,
    resources: "https://code.jquery.com/jquery-3.7.1.min.js",
    wrap: "l", // onLoad
  };

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

// ── GitHub Gist ──

const GIST_TOKEN_KEY = "querypick_gist_token";

export function getGistToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(GIST_TOKEN_KEY) ?? "";
}

export function saveGistToken(token: string) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(GIST_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(GIST_TOKEN_KEY);
  }
}

export async function createGist(
  jsCode: string,
  htmlCode: string,
  token: string,
  title = "QueryPick Snippet"
): Promise<string> {
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: title,
      public: false,
      files: {
        "snippet.js": { content: jsCode || "// empty" },
        "snippet.html": { content: htmlCode || "<!-- empty -->" },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }

  const data = await res.json();
  return data.html_url as string;
}
