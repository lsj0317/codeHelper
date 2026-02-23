import { createClient } from "@supabase/supabase-js";
import type { Category } from "@/types/snippet";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function fetchCategories(): Promise<Category[]> {
  // Supabase가 설정된 경우 DB에서 가져오기
  if (supabase) {
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (catError || !categories) {
      console.error("카테고리 로드 실패:", catError);
      return fetchFromJson();
    }

    const { data: items, error: itemError } = await supabase
      .from("snippet_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (itemError || !items) {
      console.error("스니펫 로드 실패:", itemError);
      return fetchFromJson();
    }

    const { data: inputs, error: inputError } = await supabase
      .from("snippet_inputs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (inputError || !inputs) {
      console.error("인풋 로드 실패:", inputError);
      return fetchFromJson();
    }

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      items: items
        .filter((item) => item.category_id === cat.id)
        .map((item) => ({
          id: item.id,
          name: item.name,
          inputs: inputs
            .filter((input) => input.item_id === item.id)
            .map((input) => ({
              label: input.label,
              id: input.input_id,
              type: input.input_type as "text" | "number",
              default: input.default_value,
            })),
          template: item.template,
          html_example: item.html_example,
          description: item.description,
          ai_prompt: item.ai_prompt,
        })),
    }));
  }

  // Supabase 미설정 시 JSON fallback
  return fetchFromJson();
}

async function fetchFromJson(): Promise<Category[]> {
  const { default: data } = await import("../../data.json");
  return (data as { categories: Category[] }).categories;
}
