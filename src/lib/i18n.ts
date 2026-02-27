export type Locale = "ko" | "en";

export const translations = {
  ko: {
    // Header
    "header.usage": "사용법",

    // Search
    "search.label": "스니펫 검색",
    "search.placeholder": "키워드를 입력하세요 (예: 클릭, 날짜, 폼...)",

    // Category
    "category.label": "1. 카테고리 선택",
    "category.favorites": "즐겨찾기",
    "category.recent": "최근 사용",

    // Snippet List
    "snippetList.label": "2. 기능 선택",
    "snippetList.empty": "검색 결과가 없습니다.",
    "snippetList.favoritesEmpty": "즐겨찾기한 스니펫이 없습니다.\n스니펫 옆 ☆ 를 눌러 추가하세요.",
    "snippetList.recentEmpty": "최근 사용한 스니펫이 없습니다.",
    "snippetList.favoriteAdded": "즐겨찾기에 추가했습니다.",
    "snippetList.favoriteRemoved": "즐겨찾기에서 제거했습니다.",

    // Input Panel
    "input.label": "3. 정보 입력",
    "input.placeholder": "기능을 선택해주세요",

    // Code Display
    "code.copied": "코드가 복사되었습니다!",
    "code.copy": "복사",
    "code.editMode": "편집",
    "code.viewMode": "보기",
    "code.modified": "수정됨",
    "code.reset": "초기화",
    "code.resetTooltip": "원래 코드로 초기화",

    // Description Panel
    "description.title": "로직 설명 (How it works)",

    // Tutorial
    "tutorial.title": "단계별 코드 학습",
    "tutorial.textMode": "텍스트",
    "tutorial.tutorialMode": "단계별 학습",
    "tutorial.stepOf": "Step {current} / {total}",
    "tutorial.lineRange": "Lines {start}~{end}",
    "tutorial.prev": "이전",
    "tutorial.next": "다음",
    "tutorial.restart": "처음으로",
    "tutorial.keyHint": "← → 방향키로 이동",

    // AI Prompt Panel
    "aiPrompt.title": "AI에게 질문하기 (Prompt)",
    "aiPrompt.copied": "AI 프롬프트가 복사되었습니다!",
    "aiPrompt.copy": "복사",
    "aiPrompt.hint": "* ChatGPT, Gemini, Claude 등에 그대로 붙여넣어 보세요.",

    // Combo
    "combo.singleMode": "단일",
    "combo.comboMode": "조합",
    "combo.builderLabel": "조합 목록",
    "combo.clearAll": "전체 삭제",
    "combo.emptyHint": "스니펫 목록에서 기능을 선택하여 조합하세요.",
    "combo.maxReached": "최대 {max}개까지 조합할 수 있습니다.",
    "combo.added": "조합에 추가했습니다.",
    "combo.removed": "조합에서 제거했습니다.",

    // Export
    "export.title": "코드 내보내기",
    "export.description": "코드를 다양한 형태로 내보낼 수 있습니다",
    "export.downloadLabel": "파일 다운로드",
    "export.file": "파일",
    "export.onlineLabel": "온라인 에디터에서 열기",
    "export.downloadStarted": "다운로드가 시작되었습니다!",
    "export.gistTokenPlaceholder": "GitHub Personal Access Token",
    "export.gistHint": "* Settings → Developer settings → Personal access tokens → 'gist' 권한으로 생성하세요. 토큰은 브라우저에 저장됩니다.",
    "export.gistCreate": "Gist 생성",
    "export.gistLoading": "생성 중...",
    "export.gistCreated": "Gist가 생성되었습니다!",
    "export.gistFailed": "Gist 생성 실패",
    "export.gistTokenRequired": "GitHub 토큰을 입력해주세요.",
    "export.button": "내보내기",

    // Main App
    "app.loading": "로딩 중...",
    "app.runPreview": "기능 실행",
    "app.shareLink": "링크 공유",
    "app.adArea": "광고 영역",
    "app.adClose": "광고 닫기",

    // Preview Modal
    "preview.title": "기능 미리보기 (Preview)",
    "preview.description": "코드 실행 미리보기 화면입니다",
    "preview.iframeTitle": "코드 미리보기",
    "preview.note": "* 실제 동작 환경과 동일하게 시뮬레이션 됩니다.",
    "preview.close": "닫기",

    // Share Modal
    "share.title": "링크 공유하기",
    "share.description": "현재 스니펫 설정을 공유할 수 있는 링크입니다",
    "share.label": "공유 링크",
    "share.copy": "복사",
    "share.kakao": "💬 카카오톡으로 공유하기",
    "share.kakaoPending": "카카오톡 공유 기능은 준비 중입니다.",
    "share.copied": "공유 링크가 복사되었습니다!",

    // Privacy Modal
    "privacy.title": "개인정보처리방침",
    "privacy.description": "QueryPick 개인정보처리방침",
    "privacy.item1.title": "1. 수집하는 항목:",
    "privacy.item1.text":
      "본 사이트는 별도의 회원가입 없이 이용 가능하며, 개인을 식별할 수 있는 정보를 수집하지 않습니다.",
    "privacy.item2.title": "2. 쿠키(Cookie) 사용:",
    "privacy.item2.text":
      "본 사이트는 구글 애드센스 광고를 송출하며, 구글은 사용자의 브라우저에 쿠키를 저장하여 방문 기록을 분석하고 맞춤형 광고를 제공할 수 있습니다.",
    "privacy.item3.title": "3. 광고 관련 제어:",
    "privacy.item3.text":
      "사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으며, 구글 광고 설정 페이지에서 맞춤형 광고 수신 여부를 결정할 수 있습니다.",
    "privacy.item4.title": "4. 외부 링크:",
    "privacy.item4.text":
      "본 사이트에 포함된 광고나 링크는 제3자의 웹사이트로 연결될 수 있으며, 해당 사이트의 개인정보처리방침은 본 사이트와 무관합니다.",
    "privacy.close": "닫기",

    // Usage Modal
    "usage.title": "사용법 가이드",
    "usage.description": "QueryPick 사용법 안내",
    "usage.step1.title": "1. 검색 및 선택:",
    "usage.step1.text":
      "상단 검색창에서 키워드를 입력하거나, 카테고리와 기능을 직접 선택하세요.",
    "usage.step2.title": "2. 정보 입력:",
    "usage.step2.text":
      "선택자(ID/Class)나 함수명 등을 입력하면, 우측의 코드가 실시간으로 자동 완성됩니다.",
    "usage.step3.title": "3. 코드 복사:",
    "usage.step3.text":
      "완성된 JS/HTML 코드를 복사하여 프로젝트에 바로 붙여넣으세요.",
    "usage.step4.title": "4. 학습 및 응용:",
    "usage.step4.text":
      "하단의 '로직 설명'을 통해 원리를 이해하고, 'AI 프롬프트'를 복사해 챗GPT 등에게 더 심화된 질문을 해보세요.",
    "usage.confirm": "이해했습니다",

    // Footer
    "footer.privacy": "개인정보처리방침",
  },
  en: {
    // Header
    "header.usage": "Guide",

    // Search
    "search.label": "Search Snippets",
    "search.placeholder": "Enter keywords (e.g., click, date, form...)",

    // Category
    "category.label": "1. Select Category",
    "category.favorites": "Favorites",
    "category.recent": "Recent",

    // Snippet List
    "snippetList.label": "2. Select Function",
    "snippetList.empty": "No results found.",
    "snippetList.favoritesEmpty": "No favorites yet.\nTap the ☆ icon to add snippets.",
    "snippetList.recentEmpty": "No recently used snippets.",
    "snippetList.favoriteAdded": "Added to favorites.",
    "snippetList.favoriteRemoved": "Removed from favorites.",

    // Input Panel
    "input.label": "3. Enter Info",
    "input.placeholder": "Please select a function",

    // Code Display
    "code.copied": "Code copied!",
    "code.copy": "Copy",
    "code.editMode": "Edit",
    "code.viewMode": "View",
    "code.modified": "modified",
    "code.reset": "Reset",
    "code.resetTooltip": "Reset to original code",

    // Description Panel
    "description.title": "How it works",

    // Tutorial
    "tutorial.title": "Step-by-Step Code Tutorial",
    "tutorial.textMode": "Text",
    "tutorial.tutorialMode": "Step-by-Step",
    "tutorial.stepOf": "Step {current} / {total}",
    "tutorial.lineRange": "Lines {start}~{end}",
    "tutorial.prev": "Prev",
    "tutorial.next": "Next",
    "tutorial.restart": "Restart",
    "tutorial.keyHint": "Use ← → arrow keys to navigate",

    // AI Prompt Panel
    "aiPrompt.title": "Ask AI (Prompt)",
    "aiPrompt.copied": "AI prompt copied!",
    "aiPrompt.copy": "Copy",
    "aiPrompt.hint": "* Paste this directly into ChatGPT, Gemini, Claude, etc.",

    // Combo
    "combo.singleMode": "Single",
    "combo.comboMode": "Combo",
    "combo.builderLabel": "Combo List",
    "combo.clearAll": "Clear all",
    "combo.emptyHint": "Select snippets from the list to combine them.",
    "combo.maxReached": "Maximum {max} snippets can be combined.",
    "combo.added": "Added to combo.",
    "combo.removed": "Removed from combo.",

    // Export
    "export.title": "Export Code",
    "export.description": "Export your code in various formats",
    "export.downloadLabel": "File Download",
    "export.file": "file",
    "export.onlineLabel": "Open in Online Editor",
    "export.downloadStarted": "Download started!",
    "export.gistTokenPlaceholder": "GitHub Personal Access Token",
    "export.gistHint": "* Go to Settings → Developer settings → Personal access tokens and create one with 'gist' scope. Token is saved in your browser.",
    "export.gistCreate": "Create Gist",
    "export.gistLoading": "Creating...",
    "export.gistCreated": "Gist created!",
    "export.gistFailed": "Gist creation failed",
    "export.gistTokenRequired": "Please enter a GitHub token.",
    "export.button": "Export",

    // Main App
    "app.loading": "Loading...",
    "app.runPreview": "Run Preview",
    "app.shareLink": "Share Link",
    "app.adArea": "Ad Space",
    "app.adClose": "Close ad",

    // Preview Modal
    "preview.title": "Preview",
    "preview.description": "Code execution preview",
    "preview.iframeTitle": "Code Preview",
    "preview.note": "* Simulated in the same environment as production.",
    "preview.close": "Close",

    // Share Modal
    "share.title": "Share Link",
    "share.description": "Share a link to the current snippet configuration",
    "share.label": "Share URL",
    "share.copy": "Copy",
    "share.kakao": "💬 Share via KakaoTalk",
    "share.kakaoPending": "KakaoTalk sharing is coming soon.",
    "share.copied": "Share link copied!",

    // Privacy Modal
    "privacy.title": "Privacy Policy",
    "privacy.description": "QueryPick Privacy Policy",
    "privacy.item1.title": "1. Information Collected:",
    "privacy.item1.text":
      "This site can be used without registration and does not collect personally identifiable information.",
    "privacy.item2.title": "2. Cookie Usage:",
    "privacy.item2.text":
      "This site serves Google AdSense ads. Google may store cookies in your browser to analyze visit history and provide personalized advertising.",
    "privacy.item3.title": "3. Ad Controls:",
    "privacy.item3.text":
      "You can refuse cookie storage through your browser settings and configure personalized ad preferences on the Google Ads settings page.",
    "privacy.item4.title": "4. External Links:",
    "privacy.item4.text":
      "Ads or links on this site may redirect to third-party websites whose privacy policies are independent of this site.",
    "privacy.close": "Close",

    // Usage Modal
    "usage.title": "Usage Guide",
    "usage.description": "How to use QueryPick",
    "usage.step1.title": "1. Search & Select:",
    "usage.step1.text":
      "Enter keywords in the search bar above, or directly select a category and function.",
    "usage.step2.title": "2. Enter Info:",
    "usage.step2.text":
      "Enter selectors (ID/Class) or function names, and the code on the right will auto-complete in real time.",
    "usage.step3.title": "3. Copy Code:",
    "usage.step3.text":
      "Copy the generated JS/HTML code and paste it directly into your project.",
    "usage.step4.title": "4. Learn & Apply:",
    "usage.step4.text":
      "Understand the logic through 'How it works', and copy the 'AI Prompt' to ask ChatGPT for deeper insights.",
    "usage.confirm": "Got it",

    // Footer
    "footer.privacy": "Privacy Policy",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["ko"];
