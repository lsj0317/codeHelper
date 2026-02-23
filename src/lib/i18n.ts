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

    // Snippet List
    "snippetList.label": "2. 기능 선택",
    "snippetList.empty": "검색 결과가 없습니다.",

    // Input Panel
    "input.label": "3. 정보 입력",
    "input.placeholder": "기능을 선택해주세요",

    // Code Display
    "code.copied": "코드가 복사되었습니다!",
    "code.copy": "복사",

    // Description Panel
    "description.title": "로직 설명 (How it works)",

    // AI Prompt Panel
    "aiPrompt.title": "AI에게 질문하기 (Prompt)",
    "aiPrompt.copied": "AI 프롬프트가 복사되었습니다!",
    "aiPrompt.copy": "복사",
    "aiPrompt.hint": "* ChatGPT, Gemini, Claude 등에 그대로 붙여넣어 보세요.",

    // Main App
    "app.loading": "로딩 중...",
    "app.runPreview": "기능 실행",
    "app.shareLink": "링크 공유",
    "app.adArea": "광고 영역",

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

    // Snippet List
    "snippetList.label": "2. Select Function",
    "snippetList.empty": "No results found.",

    // Input Panel
    "input.label": "3. Enter Info",
    "input.placeholder": "Please select a function",

    // Code Display
    "code.copied": "Code copied!",
    "code.copy": "Copy",

    // Description Panel
    "description.title": "How it works",

    // AI Prompt Panel
    "aiPrompt.title": "Ask AI (Prompt)",
    "aiPrompt.copied": "AI prompt copied!",
    "aiPrompt.copy": "Copy",
    "aiPrompt.hint": "* Paste this directly into ChatGPT, Gemini, Claude, etc.",

    // Main App
    "app.loading": "Loading...",
    "app.runPreview": "Run Preview",
    "app.shareLink": "Share Link",
    "app.adArea": "Ad Space",

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
