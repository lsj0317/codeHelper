export interface SnippetInput {
  label: string;
  id: string;
  type: "text" | "number";
  default: string;
}

export interface SnippetItem {
  id: string;
  name: string;
  inputs: SnippetInput[];
  template: string;
  html_example: string;
  description: string;
  ai_prompt: string;
}

export interface Category {
  id: string;
  name: string;
  items: SnippetItem[];
}

export interface SnippetData {
  categories: Category[];
}
