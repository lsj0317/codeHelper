"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Play, Share2 } from "lucide-react";
import type { Category, SnippetItem } from "@/types/snippet";
import { renderTemplate, getDefaultValues, buildShareUrl, parseShareParams } from "@/lib/code-utils";
import { fetchCategories } from "@/lib/supabase";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { CategorySelector } from "@/components/category-selector";
import { SnippetList } from "@/components/snippet-list";
import { InputPanel } from "@/components/input-panel";
import { CodeDisplay } from "@/components/code-display";
import { DescriptionPanel } from "@/components/description-panel";
import { AiPromptPanel } from "@/components/ai-prompt-panel";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

import { PreviewModal } from "@/components/modals/preview-modal";
import { ShareModal } from "@/components/modals/share-modal";
import { PrivacyModal } from "@/components/modals/privacy-modal";
import { UsageModal } from "@/components/modals/usage-modal";

import { SidebarAd } from "@/components/ads/sidebar-ad";
import { InArticleAd } from "@/components/ads/in-article-ad";
import { AnchorAd } from "@/components/ads/anchor-ad";

export function QueryPickApp() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedItem, setSelectedItem] = useState<SnippetItem | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [usageOpen, setUsageOpen] = useState(false);

  // Load data
  useEffect(() => {
    async function load() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);

        // URL 파라미터에서 복원 시도
        const params = new URLSearchParams(window.location.search);
        const restored = parseShareParams(params);

        if (restored.categoryId && cats.find((c) => c.id === restored.categoryId)) {
          setSelectedCategoryId(restored.categoryId);
          const cat = cats.find((c) => c.id === restored.categoryId);
          if (cat && restored.itemId) {
            const item = cat.items.find((i) => i.id === restored.itemId);
            if (item) {
              setSelectedItem(item);
              const defaults = getDefaultValues(item);
              setInputValues({ ...defaults, ...restored.inputValues });
            }
          }
        } else if (cats.length > 0) {
          setSelectedCategoryId(cats[0].id);
          if (cats[0].items.length > 0) {
            const firstItem = cats[0].items[0];
            setSelectedItem(firstItem);
            setInputValues(getDefaultValues(firstItem));
          }
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 현재 카테고리
  const currentCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  // 검색 필터링
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return currentCategory?.items ?? [];
    }
    const query = searchQuery.toLowerCase();
    // 검색 시 전체 카테고리에서 필터링
    return categories.flatMap((cat) =>
      cat.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.template.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, currentCategory, categories]);

  // 카테고리 변경
  const handleCategoryChange = useCallback(
    (catId: string) => {
      setSelectedCategoryId(catId);
      setSearchQuery("");
      setPage(0);
      const cat = categories.find((c) => c.id === catId);
      if (cat && cat.items.length > 0) {
        const firstItem = cat.items[0];
        setSelectedItem(firstItem);
        setInputValues(getDefaultValues(firstItem));
      } else {
        setSelectedItem(null);
        setInputValues({});
      }
    },
    [categories]
  );

  // 아이템 선택
  const handleItemSelect = useCallback((item: SnippetItem) => {
    setSelectedItem(item);
    setInputValues(getDefaultValues(item));
  }, []);

  // 입력값 변경
  const handleInputChange = useCallback((id: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  // 렌더링된 코드
  const renderedJs = useMemo(() => {
    if (!selectedItem) return "";
    return renderTemplate(selectedItem.template, inputValues);
  }, [selectedItem, inputValues]);

  const renderedHtml = useMemo(() => {
    if (!selectedItem) return "";
    return renderTemplate(selectedItem.html_example, inputValues);
  }, [selectedItem, inputValues]);

  // 편집된 코드 상태 (Monaco Editor에서 수정된 코드)
  const [editedJs, setEditedJs] = useState<string | null>(null);
  const [editedHtml, setEditedHtml] = useState<string | null>(null);

  // 입력값이나 선택 아이템 변경 시 편집 상태 초기화
  useEffect(() => {
    setEditedJs(null);
    setEditedHtml(null);
  }, [selectedItem, inputValues]);

  // Preview에 사용할 최종 코드
  const finalJs = editedJs ?? renderedJs;
  const finalHtml = editedHtml ?? renderedHtml;

  const renderedPrompt = useMemo(() => {
    if (!selectedItem) return "";
    return renderTemplate(selectedItem.ai_prompt, inputValues);
  }, [selectedItem, inputValues]);

  const renderedDesc = useMemo(() => {
    if (!selectedItem) return "";
    return renderTemplate(selectedItem.description, inputValues);
  }, [selectedItem, inputValues]);

  // 공유 URL
  const shareUrl = useMemo(() => {
    if (!selectedItem || !selectedCategoryId) return "";
    const base = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
    return buildShareUrl(base, selectedCategoryId, selectedItem.id, inputValues);
  }, [selectedCategoryId, selectedItem, inputValues]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-slate-400 text-lg">{t("app.loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Header onOpenUsageGuide={() => setUsageOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* 좌측 광고 영역 (xl 이상) - Display 160x600 Skyscraper */}
        <aside className="hidden xl:flex w-48 border-r border-slate-200 dark:border-slate-800 p-4 justify-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <SidebarAd
            slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_LEFT || "LEFT_SIDEBAR_SLOT"}
          />
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* 좌측 패널: 검색, 카테고리, 리스트, 입력 */}
            <div className="lg:col-span-5 space-y-4 lg:space-y-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <CategorySelector
                categories={categories}
                selectedId={selectedCategoryId}
                onChange={handleCategoryChange}
              />
              <SnippetList
                items={filteredItems}
                selectedId={selectedItem?.id ?? null}
                onSelect={handleItemSelect}
                page={page}
                onPageChange={setPage}
              />
              <InputPanel
                item={selectedItem}
                values={inputValues}
                onChange={handleInputChange}
              />
            </div>

            {/* 우측 패널: 코드 디스플레이, 설명, 프롬프트, 버튼 */}
            <div className="lg:col-span-7 space-y-4 lg:space-y-6">
              <CodeDisplay
                code={renderedJs}
                language="javascript"
                label="JAVASCRIPT (JQUERY)"
                colorClass="text-blue-600 dark:text-blue-400"
                dotColor="bg-blue-500"
                onCodeChange={setEditedJs}
              />

              {/* 인아티클 광고 - JS코드와 HTML코드 사이 자연스럽게 배치 */}
              <InArticleAd
                slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE || "IN_ARTICLE_SLOT"}
              />

              <CodeDisplay
                code={renderedHtml}
                language="markup"
                label="HTML EXAMPLE"
                colorClass="text-emerald-600 dark:text-emerald-400"
                dotColor="bg-emerald-500"
                onCodeChange={setEditedHtml}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <DescriptionPanel description={renderedDesc} />
                <AiPromptPanel prompt={renderedPrompt} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="py-6 rounded-2xl font-bold text-base"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  {t("app.runPreview")}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="py-6 rounded-2xl font-bold text-base"
                  onClick={() => setShareOpen(true)}
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  {t("app.shareLink")}
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* 우측 광고 영역 (lg 이상) - Display 160x600 Skyscraper */}
        <aside className="hidden lg:flex w-48 border-l border-slate-200 dark:border-slate-800 p-4 justify-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <SidebarAd
            slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_RIGHT || "RIGHT_SIDEBAR_SLOT"}
          />
        </aside>
      </div>

      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />

      {/* 모바일 하단 고정 앵커 광고 (lg 미만에서만 표시) */}
      <AnchorAd
        slot={process.env.NEXT_PUBLIC_AD_SLOT_ANCHOR || "ANCHOR_SLOT"}
      />

      {/* Modals */}
      <PreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        jsCode={finalJs}
        htmlCode={finalHtml}
      />
      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareUrl={shareUrl}
      />
      <PrivacyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <UsageModal open={usageOpen} onOpenChange={setUsageOpen} />
    </div>
  );
}
