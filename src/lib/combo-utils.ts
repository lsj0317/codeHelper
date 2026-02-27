import type { SnippetItem } from "@/types/snippet";
import { renderTemplate } from "@/lib/code-utils";

export const COMBO_MAX_ITEMS = 5;

export interface ComboResult {
  js: string;
  html: string;
  description: string;
  prompt: string;
}

/**
 * Merge multiple snippets into a single combined code output.
 * Each snippet's code is rendered with its own input values,
 * then concatenated with section dividers.
 */
export function mergeComboCode(
  items: SnippetItem[],
  valuesMap: Record<string, Record<string, string>>
): ComboResult {
  if (items.length === 0) {
    return { js: "", html: "", description: "", prompt: "" };
  }

  if (items.length === 1) {
    const item = items[0];
    const vals = valuesMap[item.id] ?? {};
    return {
      js: renderTemplate(item.template, vals),
      html: renderTemplate(item.html_example, vals),
      description: renderTemplate(item.description, vals),
      prompt: renderTemplate(item.ai_prompt, vals),
    };
  }

  const jsParts: string[] = [];
  const htmlParts: string[] = [];
  const descParts: string[] = [];
  const promptParts: string[] = [];

  items.forEach((item, i) => {
    const num = i + 1;
    const vals = valuesMap[item.id] ?? {};

    // JS
    const js = renderTemplate(item.template, vals);
    jsParts.push(
      `// ${"═".repeat(3)} [${num}] ${item.name} ${"═".repeat(3)}`,
      js
    );

    // HTML
    const html = renderTemplate(item.html_example, vals);
    htmlParts.push(
      `<!-- [${num}] ${item.name} -->`,
      html
    );

    // Description
    const desc = renderTemplate(item.description, vals);
    descParts.push(`[${num}] ${item.name}`, desc);

    // Prompt
    const prompt = renderTemplate(item.ai_prompt, vals);
    promptParts.push(`[${num}] ${item.name}`, prompt);
  });

  return {
    js: jsParts.join("\n\n"),
    html: htmlParts.join("\n\n"),
    description: descParts.join("\n\n"),
    prompt: promptParts.join("\n\n"),
  };
}
