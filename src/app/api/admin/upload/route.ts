import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/admin-auth";
import type { Category } from "@/types/snippet";
import dataJson from "../../../../../data.json";

export async function POST() {
  // 세션 확인
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  // Supabase 설정 확인
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "Supabase 환경변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인해주세요.",
      },
      { status: 400 }
    );
  }

  // Service Role 클라이언트 (RLS 무시 가능)
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const categories = (dataJson as { categories: Category[] }).categories;

  const results = {
    categories: { inserted: 0, errors: 0 },
    items: { inserted: 0, errors: 0 },
    inputs: { inserted: 0, errors: 0 },
  };

  try {
    // 1단계: 기존 데이터 삭제 (cascade로 인해 categories만 삭제하면 됨)
    const { error: deleteError } = await supabaseAdmin
      .from("categories")
      .delete()
      .neq("id", "");

    if (deleteError) {
      return NextResponse.json(
        { error: `기존 데이터 삭제 실패: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // 2단계: 카테고리 삽입
    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
      const cat = categories[catIdx];

      const { error: catError } = await supabaseAdmin
        .from("categories")
        .insert({
          id: cat.id,
          name: cat.name,
          sort_order: catIdx,
        });

      if (catError) {
        console.error(`카테고리 삽입 실패 [${cat.id}]:`, catError.message);
        results.categories.errors++;
        continue;
      }
      results.categories.inserted++;

      // 3단계: 스니펫 아이템 삽입
      for (let itemIdx = 0; itemIdx < cat.items.length; itemIdx++) {
        const item = cat.items[itemIdx];

        const { error: itemError } = await supabaseAdmin
          .from("snippet_items")
          .insert({
            id: item.id,
            category_id: cat.id,
            name: item.name,
            template: item.template,
            html_example: item.html_example,
            description: item.description,
            ai_prompt: item.ai_prompt,
            sort_order: itemIdx,
          });

        if (itemError) {
          console.error(
            `아이템 삽입 실패 [${cat.id}/${item.id}]:`,
            itemError.message
          );
          results.items.errors++;
          continue;
        }
        results.items.inserted++;

        // 4단계: 인풋 필드 삽입
        for (
          let inputIdx = 0;
          inputIdx < item.inputs.length;
          inputIdx++
        ) {
          const input = item.inputs[inputIdx];

          const { error: inputError } = await supabaseAdmin
            .from("snippet_inputs")
            .insert({
              item_id: item.id,
              category_id: cat.id,
              label: input.label,
              input_id: input.id,
              input_type: input.type,
              default_value: input.default,
              sort_order: inputIdx,
            });

          if (inputError) {
            console.error(
              `인풋 삽입 실패 [${item.id}/${input.id}]:`,
              inputError.message
            );
            results.inputs.errors++;
          } else {
            results.inputs.inserted++;
          }
        }
      }
    }

    const totalErrors =
      results.categories.errors + results.items.errors + results.inputs.errors;

    return NextResponse.json({
      success: totalErrors === 0,
      message:
        totalErrors === 0
          ? "모든 데이터가 성공적으로 업로드되었습니다!"
          : `업로드 완료 (일부 오류 ${totalErrors}건)`,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: `업로드 중 예기치 못한 오류: ${err instanceof Error ? err.message : String(err)}`,
      },
      { status: 500 }
    );
  }
}
