let snippetData = null;
let currentItems = []; // 현재 선택된 카테고리의 전체 아이템 목록
let currentPage = 1;
const itemsPerPage = 3;
let selectedItemId = null; // 현재 선택된 아이템 ID

// 전역 변수 노출 (share.js에서 사용)
window.selectedItemId = null;

// [1] 초기 설정
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadData();
    initSearch();
    
    // 기능 실행 버튼 이벤트 연결
    const btnRun = document.getElementById('btn-run');
    if (btnRun) {
        btnRun.addEventListener('click', openPreviewModal);
    }

    // 링크 공유 버튼 이벤트 연결
    const btnShare = document.getElementById('btn-share');
    if (btnShare) {
        btnShare.addEventListener('click', openShareModal);
    }
});

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();

        if (keyword.trim() === "") {
            // 검색어가 없으면 현재 선택된 카테고리의 리스트를 보여줌
            const catId = categorySelect.value;
            const cat = snippetData.categories.find(c => c.id === catId);
            currentItems = cat ? cat.items : [];
            currentPage = 1;
            renderPagedList();
            return;
        }

        // 전체 카테고리에서 키워드가 포함된 아이템 필터링
        const filteredItems = [];
        snippetData.categories.forEach(cat => {
            cat.items.forEach(item => {
                if (item.name.toLowerCase().includes(keyword)) {
                    filteredItems.push(item);
                }
            });
        });

        currentItems = filteredItems;
        currentPage = 1;
        renderPagedList();
    });
}

// [2] 테마 제어
function initTheme() {
    const html = document.documentElement;
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const prismLink = document.getElementById('prism-theme');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            html.classList.add('dark');
            themeIcon.textContent = 'LIGHT';
            localStorage.setItem('theme', 'dark');
            prismLink.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
        } else {
            html.classList.remove('dark');
            themeIcon.textContent = 'DARK';
            localStorage.setItem('theme', 'light');
            prismLink.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css";
        }
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

    toggleBtn.onclick = () => {
        applyTheme(html.classList.contains('dark') ? 'light' : 'dark');
    };
}

// [3] 데이터 로드
async function loadData() {
    try {
        const response = await fetch('data.json');
        snippetData = await response.json();
        renderCategories();
        
        // 데이터 로드 후 URL 파라미터 복원 시도
        restoreFromUrl();
    } catch (e) {
        console.error("Data Load Error:", e);
    }
}

// URL 파라미터 복원 함수
function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const catId = params.get('cat');
    const itemId = params.get('item');
    
    if (catId && itemId) {
        const categorySelect = document.getElementById('category-select');
        categorySelect.value = catId;
        
        // 카테고리 변경 이벤트 트리거와 유사한 로직 실행
        const cat = snippetData.categories.find(c => c.id === catId);
        if (cat) {
            currentItems = cat.items;
            currentPage = 1;
            
            // 해당 아이템이 있는 페이지로 이동 계산
            const itemIndex = currentItems.findIndex(i => i.id === itemId);
            if (itemIndex !== -1) {
                currentPage = Math.floor(itemIndex / itemsPerPage) + 1;
            }
            
            renderPagedList();
            
            const targetItem = currentItems.find(i => i.id === itemId);
            if (targetItem) {
                handleItemClick(targetItem);
                
                // 입력 필드 값 복원
                setTimeout(() => {
                    targetItem.inputs.forEach(input => {
                        const val = params.get(input.id);
                        if (val) {
                            const el = document.getElementById(`field-${input.id}`);
                            if (el) {
                                el.value = val;
                                // 값 변경 후 코드 업데이트 트리거
                                el.dispatchEvent(new Event('input'));
                            }
                        }
                    });
                }, 100); // DOM 생성 대기
            }
        }
    }
}

// [4] 카테고리 생성
function renderCategories() {
    const select = document.getElementById('category-select');
    snippetData.categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        select.appendChild(opt);
    });

    select.onchange = (e) => {
        const catId = e.target.value;
        const cat = snippetData.categories.find(c => c.id === catId);
        currentItems = cat ? cat.items : [];
        currentPage = 1;
        renderPagedList();
        
        // 카테고리 변경 시 첫 번째 아이템 자동 선택
        if (currentItems.length > 0) {
            handleItemClick(currentItems[0]);
        }
    };
    
    // 초기 로드 시 첫 번째 카테고리 선택 (URL 파라미터가 없을 때만)
    if (!window.location.search) {
        const firstCat = snippetData.categories[0];
        currentItems = firstCat.items;
        renderPagedList();
        if (currentItems.length > 0) handleItemClick(currentItems[0]);
    }
}

// [5] 페이징 처리된 리스트 렌더링
function renderPagedList() {
    const container = document.getElementById('item-list');
    container.innerHTML = '';

    if (currentItems.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 p-2">검색 결과가 없습니다.</p>';
        renderPaginationControls(0);
        return;
    }

    // 페이징 계산
    const totalPages = Math.ceil(currentItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToShow = currentItems.slice(startIndex, endIndex);

    itemsToShow.forEach(item => {
        const btn = document.createElement('button');
        
        // 기본 스타일 vs 선택된 스타일
        if (item.id === selectedItemId) {
            btn.className = "w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold border border-blue-600 bg-blue-600 text-white transition";
        } else {
            btn.className = "w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold border border-blue-200 bg-blue-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:border-blue-500 transition";
        }
        
        btn.textContent = item.name;
        btn.onclick = () => handleItemClick(item);
        container.appendChild(btn);
    });

    renderPaginationControls(totalPages);
}

// 페이징 컨트롤 렌더링
function renderPaginationControls(totalPages) {
    // 기존 페이징 컨트롤 제거 (부모 요소의 마지막 자식 확인)
    const parent = document.getElementById('item-list').parentElement;
    const existingNav = parent.querySelector('nav');
    if (existingNav) existingNav.remove();

    if (totalPages <= 1) return;

    const nav = document.createElement('nav');
    nav.className = "flex justify-center items-center gap-2 mt-4";
    
    // 이전 버튼
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = "&lt;";
    prevBtn.className = `w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`;
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderPagedList();
        }
    };
    nav.appendChild(prevBtn);

    // 페이지 번호
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = `w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${i === currentPage ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`;
        pageBtn.onclick = () => {
            currentPage = i;
            renderPagedList();
        };
        nav.appendChild(pageBtn);
    }

    // 다음 버튼
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = "&gt;";
    nextBtn.className = `w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`;
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPagedList();
        }
    };
    nav.appendChild(nextBtn);

    parent.appendChild(nav);
}

// 아이템 클릭 핸들러
function handleItemClick(item) {
    selectedItemId = item.id;
    window.selectedItemId = item.id; // 전역 변수 업데이트
    renderPagedList(); // 스타일 업데이트를 위해 리스트 다시 렌더링
    renderInputs(item);
}

// [6] 입력 필드 생성
function renderInputs(item) {
    const container = document.getElementById('input-container');
    container.innerHTML = `<h3 class="font-black text-sm mb-5 text-blue-600 dark:text-blue-400 flex items-center gap-2"><span class="w-1.5 h-4 bg-blue-600 rounded-full"></span> ${item.name} 설정</h3>`;

    item.inputs.forEach(input => {
        const div = document.createElement('div');
        div.className = "mb-4";
        div.innerHTML = `
            <label class="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tighter">${input.label}</label>
            <input type="${input.type}" id="field-${input.id}" value="${input.default || ''}"
            class="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
        `;
        container.appendChild(div);

        document.getElementById(`field-${input.id}`).oninput = () => updateCode(item.id);
    });
    updateCode(item.id);
}

// [7] 코드 실시간 업데이트 (JS + HTML + 설명 + 프롬프트)
function updateCode(itemId) {
    const item = snippetData.categories.flatMap(c => c.items).find(i => i.id === itemId);
    if (!item) return;

    let jsCode = item.template || "";
    let htmlCode = item.html_example || "";
    let desc = item.description || "설명이 없습니다.";
    let prompt = item.ai_prompt || "AI 프롬프트가 없습니다.";

    // 치환 로직
    item.inputs.forEach(input => {
        const el = document.getElementById(`field-${input.id}`);
        if (el) {
            const val = el.value;
            jsCode = jsCode.split(`\${${input.id}}`).join(val);
            const rawVal = val.replace(/[#.]/g, '');
            htmlCode = htmlCode.split(`\${${input.id}_raw}`).join(rawVal);
            
            // 설명과 프롬프트에도 변수 치환 적용
            desc = desc.split(`\${${input.id}}`).join(val);
            prompt = prompt.split(`\${${input.id}}`).join(val);
        }
    });

    const jsDisplay = document.getElementById('code-display');
    const htmlDisplay = document.getElementById('html-display');
    const descDisplay = document.getElementById('desc-display');
    const promptDisplay = document.getElementById('prompt-display');

    // 1. 텍스트 업데이트
    jsDisplay.textContent = jsCode;
    htmlDisplay.textContent = htmlCode;
    
    // 설명은 줄바꿈 처리를 위해 HTML로 변환 (마크다운 스타일)
    descDisplay.innerHTML = desc.replace(/\n/g, '<br>');
    promptDisplay.textContent = prompt;

    // 2. Prism 하이라이트 적용
    if (window.Prism) {
        Prism.highlightElement(jsDisplay);
        Prism.highlightElement(htmlDisplay);
    }
}

// [8] 공통 유틸리티
function copyCode(targetId, btnElement) {
    // 1. 텍스트 가져오기
    const displayElement = document.getElementById(targetId);
    if (!displayElement) {
        showToast("복사할 대상을 찾을 수 없습니다.", "error");
        return;
    }
    const text = displayElement.textContent;

    // 2. 클립보드 복사 실행
    navigator.clipboard.writeText(text).then(() => {
        // [성공 시]
        let type = '코드';
        if (targetId === 'code-display') type = 'JS 코드';
        else if (targetId === 'html-display') type = 'HTML 코드';
        else if (targetId === 'prompt-display') type = 'AI 프롬프트';
        
        showToast(`${type}가 복사되었습니다!`, "success");

        // 버튼 텍스트 피드백
        if (btnElement) {
            const originalText = btnElement.textContent;
            const originalClass = btnElement.className;
            
            btnElement.textContent = "완료!";
            // 기존 클래스에서 배경색만 변경 (Tailwind)
            btnElement.classList.remove('bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'hover:bg-blue-500', 'hover:bg-emerald-500', 'hover:bg-purple-500');
            btnElement.classList.add('bg-green-500', 'hover:bg-green-600');

            setTimeout(() => {
                btnElement.textContent = originalText;
                btnElement.className = originalClass; // 원래 클래스로 복구
            }, 1000);
        }
    }).catch(err => {
        // [실패 시]
        console.error("복사 실패:", err);
        showToast("복사에 실패했습니다.", "error");
    });
}

// [9] 토스트 알림 생성 함수
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');

    // 토스트 요소 생성
    const toast = document.createElement('div');
    toast.className = `animate-slide-up flex items-center gap-3 px-6 py-3 rounded-2xl text-white text-sm font-bold transition-all min-w-[280px] justify-center`;

    // 타입에 따른 색상 변경
    if (type === "success") {
        toast.classList.add('bg-slate-900', 'dark:bg-blue-600', 'border', 'border-slate-700');
    } else {
        toast.classList.add('bg-red-500');
    }

    toast.textContent = message;

    // 컨테이너에 추가
    container.appendChild(toast);

    // 2.5초 후 제거
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 2500);
}

function openPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 모달 바깥 클릭 시 닫기
window.addEventListener('click', (e) => {
    const privacyModal = document.getElementById('privacy-modal');
    const usageModal = document.getElementById('usage-modal');
    if (e.target === privacyModal) closePrivacyModal();
    if (e.target === usageModal) closeUsageModal();
});

function openUsageModal() { document.getElementById('usage-modal').classList.replace('hidden', 'flex'); }
function closeUsageModal() { document.getElementById('usage-modal').classList.replace('flex', 'hidden'); }