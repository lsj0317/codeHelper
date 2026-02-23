import type { SnippetItem } from "@/types/snippet";

/**
 * 템플릿 문자열에서 ${variable} 을 실제 값으로 치환
 */
export function renderTemplate(
  template: string,
  values: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    // ${selector} → 실제 값
    result = result.replace(new RegExp(`\\$\\{${key}\\}`, "g"), value);
    // ${selector_raw} → # 또는 . 제거한 값
    const raw = value.replace(/^[#.]/, "");
    result = result.replace(new RegExp(`\\$\\{${key}_raw\\}`, "g"), raw);
  }
  return result;
}

/**
 * 스니펫의 기본값으로 초기 values 객체 생성
 */
export function getDefaultValues(
  item: SnippetItem
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const input of item.inputs) {
    values[input.id] = input.default;
  }
  return values;
}

/**
 * URL 쿼리 파라미터에서 상태 복원
 */
export function parseShareParams(searchParams: URLSearchParams): {
  categoryId?: string;
  itemId?: string;
  inputValues: Record<string, string>;
} {
  const categoryId = searchParams.get("cat") || undefined;
  const itemId = searchParams.get("item") || undefined;
  const inputValues: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    if (key !== "cat" && key !== "item") {
      inputValues[key] = value;
    }
  });

  return { categoryId, itemId, inputValues };
}

/**
 * 현재 상태를 URL 쿼리 파라미터로 변환
 */
export function buildShareUrl(
  baseUrl: string,
  categoryId: string,
  itemId: string,
  inputValues: Record<string, string>
): string {
  const params = new URLSearchParams();
  params.set("cat", categoryId);
  params.set("item", itemId);
  for (const [key, value] of Object.entries(inputValues)) {
    params.set(key, value);
  }
  return `${baseUrl}?${params.toString()}`;
}
