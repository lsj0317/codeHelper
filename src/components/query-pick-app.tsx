"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Play, Share2, Layers, MousePointer, Download } from "lucide-react";
import type { Category, SnippetItem } from "@/types/snippet";
import { renderTemplate, getDefaultValues, buildShareUrl, parseShareParams } from "@/lib/code-utils";
import { fetchCategories } from "@/lib/supabase";
import { getFavorites, toggleFavorite, getRecent, addRecent } from "@/lib/favorites";
import { mergeComboCode, COMBO_MAX_ITEMS } from "@/lib/combo-utils";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchBar } from "@/components/search-bar";
import { CategorySelector, FAVORITES_CATEGORY_ID, RECENT_CATEGORY_ID } from "@/components/category-selector";
import { SnippetList } from "@/components/snippet-list";
import { ComboBuilder } from "@/components/combo-builder";
import { InputPanel } from "@/components/input-panel";
import { CodeDisplay } from "@/components/code-display";
import { DescriptionPanel } from "@/components/description-panel";
import { AiPromptPanel } from "@/components/ai-prompt-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/language-provider";
import { useToast } from "@/components/ui/toast";

import { PreviewModal } from "@/components/modals/preview-modal";
import { ShareModal } from "@/components/modals/share-modal";
import { ExportModal } from "@/components/modals/export-modal";
import { PrivacyModal } from "@/components/modals/privacy-modal";
import { UsageModal } from "@/components/modals/usage-modal";

import { SidebarAd } from "@/components/ads/sidebar-ad";
import { InArticleAd } from "@/components/ads/in-article-ad";
import { AnchorAd } from "@/components/ads/anchor-ad";

export function QueryPickApp() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedItem, setSelectedItem] = useState<SnippetItem | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Favorites & Recent state
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Combo mode state
  const [comboMode, setComboMode] = useState(false);
  const [comboItems, setComboItems] = useState<SnippetItem[]>([]);
  const [comboInputValues, setComboInputValues] = useState<Record<string, Record<string, string>>>({});

  // Modal states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [usageOpen, setUsageOpen] = useState(false);

  // Load data
  useEffect(() => {
    async function load() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);

        setFavoriteIds(getFavorites());
        setRecentIds(getRecent());

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

  // 전체 아이템 플랫 맵
  const allItems = useMemo(
    () => categories.flatMap((cat) => cat.items),
    [categories]
  );

  // 현재 카테고리
  const currentCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  // 검색 필터링 + 즐겨찾기/최근 사용 처리
  const filteredItems = useMemo(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return categories.flatMap((cat) =>
        cat.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.template.toLowerCase().includes(query)
        )
      );
    }

    if (selectedCategoryId === FAVORITES_CATEGORY_ID) {
      return favoriteIds
        .map((id) => allItems.find((item) => item.id === id))
        .filter((item): item is SnippetItem => item !== undefined);
    }

    if (selectedCategoryId === RECENT_CATEGORY_ID) {
      return recentIds
        .map((id) => allItems.find((item) => item.id === id))
        .filter((item): item is SnippetItem => item !== undefined);
    }

    return currentCategory?.items ?? [];
  }, [searchQuery, selectedCategoryId, currentCategory, categories, allItems, favoriteIds, recentIds]);

  // 빈 메시지
  const emptyMessage = useMemo(() => {
    if (searchQuery.trim()) return undefined;
    if (selectedCategoryId === FAVORITES_CATEGORY_ID) return t("snippetList.favoritesEmpty");
    if (selectedCategoryId === RECENT_CATEGORY_ID) return t("snippetList.recentEmpty");
    return undefined;
  }, [searchQuery, selectedCategoryId, t]);

  // 카테고리 변경
  const handleCategoryChange = useCallback(
    (catId: string) => {
      setSelectedCategoryId(catId);
      setSearchQuery("");
      setPage(0);

      // Combo mode: 카테고리 탐색만, 선택 변경 없음
      if (comboMode) return;

      if (catId === FAVORITES_CATEGORY_ID || catId === RECENT_CATEGORY_ID) {
        setSelectedItem(null);
        setInputValues({});
        return;
      }

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
    [categories, comboMode]
  );

  // 아이템 선택 (단일 모드)
  const handleItemSelect = useCallback((item: SnippetItem) => {
    setSelectedItem(item);
    setInputValues(getDefaultValues(item));
    setRecentIds(addRecent(item.id));
  }, []);

  // ── Combo handlers ──

  const handleComboToggle = useCallback(
    (item: SnippetItem) => {
      setComboItems((prev) => {
        const exists = prev.find((i) => i.id === item.id);
        if (exists) {
          showToast(t("combo.removed"));
          setComboInputValues((vals) => {
            const copy = { ...vals };
            delete copy[item.id];
            return copy;
          });
          return prev.filter((i) => i.id !== item.id);
        }
        if (prev.length >= COMBO_MAX_ITEMS) {
          showToast(t("combo.maxReached").replace("{max}", String(COMBO_MAX_ITEMS)));
          return prev;
        }
        showToast(t("combo.added"));
        setComboInputValues((vals) => ({
          ...vals,
          [item.id]: getDefaultValues(item),
        }));
        return [...prev, item];
      });
    },
    [showToast, t]
  );

  const handleComboRemove = useCallback((itemId: string) => {
    setComboItems((prev) => prev.filter((i) => i.id !== itemId));
    setComboInputValues((vals) => {
      const copy = { ...vals };
      delete copy[itemId];
      return copy;
    });
  }, []);

  const handleComboReorder = useCallback((newItems: SnippetItem[]) => {
    setComboItems(newItems);
  }, []);

  const handleComboClearAll = useCallback(() => {
    setComboItems([]);
    setComboInputValues({});
  }, []);

  const handleComboInputChange = useCallback(
    (itemId: string, inputId: string, value: string) => {
      setComboInputValues((prev) => ({
        ...prev,
        [itemId]: { ...(prev[itemId] ?? {}), [inputId]: value },
      }));
    },
    []
  );

  // 즐겨찾기 토글
  const handleToggleFavorite = useCallback(
    (itemId: string) => {
      const newFavs = toggleFavorite(itemId);
      setFavoriteIds(newFavs);
      if (newFavs.includes(itemId)) {
        showToast(t("snippetList.favoriteAdded"));
      } else {
        showToast(t("snippetList.favoriteRemoved"));
      }
    },
    [showToast, t]
  );

  // 입력값 변경 (단일 모드)
  const handleInputChange = useCallback((id: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  }, []);

  // ── Rendered code ──

  const comboResult = useMemo(() => {
    if (!comboMode || comboItems.length === 0) return null;
    return mergeComboCode(comboItems, comboInputValues);
  }, [comboMode, comboItems, comboInputValues]);

  const renderedJs = useMemo(() => {
    if (comboMode) return comboResult?.js ?? "";
    if (!selectedItem) return "";
    return renderTemplate(selectedItem.template, inputValues);
  }, [comboMode, comboResult, selectedItem, inputValues]);

  const renderedHtml = useMemo(() => {
    if (comboMode) return comboResult?.html ?? "";
    if (!selectedItem) return "";
    return renderTemplate(selectedItem.html_example, inputValues);
  }, [comboMode, comboResult, selectedItem, inputValues]);

  const [editedJs, setEditedJs] = useState<string | null>(null);
  const [editedHtml, setEditedHtml] = useState<string | null>(null);

  useEffect(() => {
    setEditedJs(null);
    setEditedHtml(null);
  }, [selectedItem, inputValues, comboItems, comboInputValues]);

  const finalJs = editedJs ?? renderedJs;
  const finalHtml = editedHtml ?? renderedHtml;

  const renderedPrompt = useMemo(() => {
    if (comboMode) return comboResult?.prompt ?? "";
    if (!selectedItem) return "";
    return renderTemplate(selectedItem.ai_prompt, inputValues);
  }, [comboMode, comboResult, selectedItem, inputValues]);

  const renderedDesc = useMemo(() => {
    if (comboMode) return comboResult?.description ?? "";
    if (!selectedItem) return "";
    return renderTemplate(selectedItem.description, inputValues);
  }, [comboMode, comboResult, selectedItem, inputValues]);

  // 공유 URL
  const shareUrl = useMemo(() => {
    if (comboMode) return "";
    if (!selectedItem || !selectedCategoryId) return "";
    let catId = selectedCategoryId;
    if (catId === FAVORITES_CATEGORY_ID || catId === RECENT_CATEGORY_ID) {
      const originalCat = categories.find((c) =>
        c.items.some((i) => i.id === selectedItem.id)
      );
      catId = originalCat?.id ?? selectedCategoryId;
    }
    const base = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
    return buildShareUrl(base, catId, selectedItem.id, inputValues);
  }, [comboMode, selectedCategoryId, selectedItem, inputValues, categories]);

  const comboSelectedIds = useMemo(
    () => comboItems.map((i) => i.id),
    [comboItems]
  );

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
        {/* 좌측 광고 영역 */}
        <aside className="hidden xl:flex w-48 border-r border-slate-200 dark:border-slate-800 p-4 justify-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <SidebarAd slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_LEFT || "LEFT_SIDEBAR_SLOT"} />
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* 좌측 패널 */}
            <div className="lg:col-span-5 space-y-4 lg:space-y-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <CategorySelector
                categories={categories}
                selectedId={selectedCategoryId}
                onChange={handleCategoryChange}
                favoritesCount={favoriteIds.length}
                recentCount={recentIds.length}
              />

              {/* Mode toggle: Single / Combo */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setComboMode(false)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    !comboMode
                      ? "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                >
                  <MousePointer className="h-3.5 w-3.5" />
                  {t("combo.singleMode")}
                </button>
                <button
                  onClick={() => setComboMode(true)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                    comboMode
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                >
                  <Layers className="h-3.5 w-3.5" />
                  {t("combo.comboMode")}
                  {comboItems.length > 0 && (
                    <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {comboItems.length}
                    </span>
                  )}
                </button>
              </div>

              <SnippetList
                items={filteredItems}
                selectedId={comboMode ? null : (selectedItem?.id ?? null)}
                onSelect={handleItemSelect}
                page={page}
                onPageChange={setPage}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                emptyMessage={emptyMessage}
                comboMode={comboMode}
                comboSelectedIds={comboSelectedIds}
                onComboToggle={handleComboToggle}
              />

              {/* Combo Builder (only in combo mode) */}
              {comboMode && (
                <ComboBuilder
                  items={comboItems}
                  onRemove={handleComboRemove}
                  onReorder={handleComboReorder}
                  onClearAll={handleComboClearAll}
                />
              )}

              <InputPanel
                item={comboMode ? null : selectedItem}
                values={inputValues}
                onChange={handleInputChange}
                comboItems={comboMode ? comboItems : undefined}
                comboValues={comboMode ? comboInputValues : undefined}
                onComboChange={comboMode ? handleComboInputChange : undefined}
              />
            </div>

            {/* 우측 패널 */}
            <div className="lg:col-span-7 space-y-4 lg:space-y-6">
              <CodeDisplay
                code={renderedJs}
                language="javascript"
                label={comboMode && comboItems.length > 1 ? "JAVASCRIPT (COMBO)" : "JAVASCRIPT (JQUERY)"}
                colorClass={comboMode && comboItems.length > 0 ? "text-indigo-600 dark:text-indigo-400" : "text-blue-600 dark:text-blue-400"}
                dotColor={comboMode && comboItems.length > 0 ? "bg-indigo-500" : "bg-blue-500"}
                onCodeChange={setEditedJs}
              />

              <InArticleAd slot={process.env.NEXT_PUBLIC_AD_SLOT_IN_ARTICLE || "IN_ARTICLE_SLOT"} />

              <CodeDisplay
                code={renderedHtml}
                language="markup"
                label={comboMode && comboItems.length > 1 ? "HTML (COMBO)" : "HTML EXAMPLE"}
                colorClass="text-emerald-600 dark:text-emerald-400"
                dotColor="bg-emerald-500"
                onCodeChange={setEditedHtml}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <DescriptionPanel description={renderedDesc} code={renderedJs} />
                <AiPromptPanel prompt={renderedPrompt} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  size="lg"
                  className="py-6 rounded-2xl font-bold text-sm"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Play className="h-4 w-4 mr-1.5" />
                  {t("app.runPreview")}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="py-6 rounded-2xl font-bold text-sm"
                  onClick={() => setShareOpen(true)}
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  {t("app.shareLink")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="py-6 rounded-2xl font-bold text-sm"
                  onClick={() => setExportOpen(true)}
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  {t("export.button")}
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* 우측 광고 영역 */}
        <aside className="hidden lg:flex w-48 border-l border-slate-200 dark:border-slate-800 p-4 justify-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <SidebarAd slot={process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR_RIGHT || "RIGHT_SIDEBAR_SLOT"} />
        </aside>
      </div>

      <Footer onOpenPrivacy={() => setPrivacyOpen(true)} />

      <AnchorAd slot={process.env.NEXT_PUBLIC_AD_SLOT_ANCHOR || "ANCHOR_SLOT"} />

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
      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        jsCode={finalJs}
        htmlCode={finalHtml}
        title={comboMode ? "QueryPick Combo" : (selectedItem?.name ?? "QueryPick Snippet")}
      />
      <PrivacyModal open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <UsageModal open={usageOpen} onOpenChange={setUsageOpen} />
    </div>
  );
}
