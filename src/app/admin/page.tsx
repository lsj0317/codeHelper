"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOut,
  Upload,
  Database,
  FolderOpen,
  Code,
  Settings,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  FileJson,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { Category, SnippetData } from "@/types/snippet";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    results?: {
      categories: { inserted: number; errors: number };
      items: { inserted: number; errors: number };
      inputs: { inserted: number; errors: number };
    };
  } | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // data.json 로드
  useEffect(() => {
    async function loadData() {
      try {
        const imported = await import("../../../data.json");
        setData((imported as unknown as SnippetData).categories);
      } catch (err) {
        console.error("data.json 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 통계
  const stats = useMemo(() => {
    const totalItems = data.reduce((sum, cat) => sum + cat.items.length, 0);
    const totalInputs = data.reduce(
      (sum, cat) =>
        sum + cat.items.reduce((s, item) => s + item.inputs.length, 0),
      0
    );
    return {
      categories: data.length,
      items: totalItems,
      inputs: totalInputs,
    };
  }, [data]);

  // 로그아웃
  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
  };

  // 데이터 업로드
  const handleUpload = async () => {
    if (
      !window.confirm(
        "Supabase에 data.json 전체 데이터를 업로드합니다.\n기존 데이터는 삭제되고 새로 덮어씁니다.\n\n계속하시겠습니까?"
      )
    ) {
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST" });
      const result = await res.json();

      if (!res.ok) {
        setUploadResult({
          success: false,
          message: result.error || "업로드에 실패했습니다.",
        });
        return;
      }

      setUploadResult(result);
    } catch {
      setUploadResult({
        success: false,
        message: "서버 연결에 실패했습니다.",
      });
    } finally {
      setUploading(false);
    }
  };

  // 카테고리 토글
  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 아이템 토글
  const toggleItem = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* 헤더 */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image
            src="/images/genJqueryIcon.png"
            alt="QueryPick Logo"
            width={32}
            height={32}
            className="rounded-lg object-cover"
          />
          <div>
            <h1 className="text-lg font-black tracking-tight dark:text-white">
              QueryPick Admin
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="text-slate-500"
          >
            사이트로 이동
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" />
            로그아웃
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-black dark:text-white">
                  {stats.categories}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  카테고리
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Code className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-black dark:text-white">
                  {stats.items}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  스니펫
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-black dark:text-white">
                  {stats.inputs}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  입력 필드
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supabase 업로드 섹션 */}
        <Card>
          <CardHeader className="flex-row items-center gap-3 rounded-t-2xl">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold dark:text-white">
              Supabase 데이터 업로드
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                data.json
              </code>
              의 전체 데이터({stats.categories}개 카테고리, {stats.items}개
              스니펫, {stats.inputs}개 입력 필드)를 Supabase 데이터베이스에
              업로드합니다.
            </p>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-xl text-xs text-amber-700 dark:text-amber-400">
              <strong>주의:</strong> 업로드 시 기존 Supabase 데이터가 모두
              삭제되고 data.json 데이터로 교체됩니다.{" "}
              <code>SUPABASE_SERVICE_ROLE_KEY</code>가 환경변수에 설정되어 있어야
              합니다.
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full sm:w-auto"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Supabase에 전체 데이터 업로드
                </>
              )}
            </Button>

            {/* 업로드 결과 */}
            {uploadResult && (
              <div
                className={`p-4 rounded-xl border ${
                  uploadResult.success
                    ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {uploadResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <span
                    className={`font-bold text-sm ${
                      uploadResult.success
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {uploadResult.message}
                  </span>
                </div>
                {uploadResult.results && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {uploadResult.results.categories.inserted}
                      </p>
                      <p className="text-[10px] text-slate-500">카테고리</p>
                      {uploadResult.results.categories.errors > 0 && (
                        <p className="text-[10px] text-red-500">
                          실패: {uploadResult.results.categories.errors}
                        </p>
                      )}
                    </div>
                    <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {uploadResult.results.items.inserted}
                      </p>
                      <p className="text-[10px] text-slate-500">스니펫</p>
                      {uploadResult.results.items.errors > 0 && (
                        <p className="text-[10px] text-red-500">
                          실패: {uploadResult.results.items.errors}
                        </p>
                      )}
                    </div>
                    <div className="text-center p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {uploadResult.results.inputs.inserted}
                      </p>
                      <p className="text-[10px] text-slate-500">입력 필드</p>
                      {uploadResult.results.inputs.errors > 0 && (
                        <p className="text-[10px] text-red-500">
                          실패: {uploadResult.results.inputs.errors}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* data.json 내용 미리보기 */}
        <Card>
          <CardHeader className="flex-row items-center gap-3 rounded-t-2xl">
            <FileJson className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold dark:text-white">
              data.json 내용 미리보기
            </h2>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto custom-scroll">
            {data.map((category) => (
              <div
                key={category.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
              >
                {/* 카테고리 행 */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-bold text-sm dark:text-white">
                    {category.name}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {category.items.length}개 스니펫
                  </span>
                </button>

                {/* 아이템 목록 */}
                {expandedCategories.has(category.id) && (
                  <div className="border-t border-slate-200 dark:border-slate-700">
                    {category.items.map((item) => {
                      const itemKey = `${category.id}/${item.id}`;
                      return (
                        <div key={item.id}>
                          <button
                            onClick={() => toggleItem(itemKey)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 pl-10 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-left cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                          >
                            {expandedItems.has(itemKey) ? (
                              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                            )}
                            <Code className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-auto">
                              입력 {item.inputs.length}개
                            </span>
                          </button>

                          {/* 아이템 상세 */}
                          {expandedItems.has(itemKey) && (
                            <div className="pl-16 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 space-y-3">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                  ID
                                </span>
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                                  {item.id}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                  입력 필드
                                </span>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {item.inputs.map((input) => (
                                    <span
                                      key={input.id}
                                      className="inline-flex items-center gap-1 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full"
                                    >
                                      <span className="font-bold">
                                        {input.label}
                                      </span>
                                      <span className="text-blue-400">
                                        ({input.type})
                                      </span>
                                      <span className="text-blue-500">
                                        = {input.default}
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                  템플릿 코드 (미리보기)
                                </span>
                                <pre className="mt-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] text-slate-600 dark:text-slate-400 overflow-x-auto font-mono leading-relaxed max-h-32 overflow-y-auto">
                                  {item.template.substring(0, 300)}
                                  {item.template.length > 300 && "..."}
                                </pre>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                  설명
                                </span>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                                  {item.description.substring(0, 200)}
                                  {item.description.length > 200 && "..."}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
