let snippetData = null;

// [1] 초기 설정
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadData();
    initSearch();
});

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();

        if (keyword.trim() === "") {
            // 검색어가 없으면 현재 선택된 카테고리의 리스트를 보여줌
            renderItemList(categorySelect.value);
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

        renderFilteredList(filteredItems);
    });
}

// 검색 결과 전용 렌더링 함수
function renderFilteredList(items) {
    const container = document.getElementById('item-list');
    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-400 p-2">검색 결과가 없습니다.</p>';
        return;
    }

    items.forEach(item => {
        const btn = document.createElement('button');
        btn.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold border border-blue-200 bg-blue-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:border-blue-500 transition shadow-sm";
        btn.textContent = item.name;
        btn.onclick = () => renderInputs(item);
        container.appendChild(btn);
    });

    // 첫 번째 검색 결과의 입력창을 자동으로 보여줌
    if (items.length > 0) renderInputs(items[0]);
}

// [2] 테마 제어
function initTheme() {
    const html = document.documentElement;
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            html.classList.add('dark');
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
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
    } catch (e) {
        console.error("Data Load Error:", e);
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

    select.onchange = (e) => renderItemList(e.target.value);
    renderItemList(snippetData.categories[0].id);
}

// [5] 아이템 리스트 생성
function renderItemList(catId) {
    const cat = snippetData.categories.find(c => c.id === catId);
    const container = document.getElementById('item-list');
    container.innerHTML = '';

    cat.items.forEach(item => {
        const btn = document.createElement('button');
        btn.className = "px-3 py-1.5 rounded-lg text-[11px] font-bold border bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 transition shadow-sm";
        btn.textContent = item.name;
        btn.onclick = () => renderInputs(item);
        container.appendChild(btn);
    });
    renderInputs(cat.items[0]);
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

// [7] 코드 실시간 업데이트 (JS + HTML)
function updateCode(itemId) {
    const item = snippetData.categories.flatMap(c => c.items).find(i => i.id === itemId);
    if (!item) return;

    let jsCode = item.template || "";
    let htmlCode = item.html_example || "";

    // 치환 로직
    item.inputs.forEach(input => {
        const el = document.getElementById(`field-${input.id}`);
        if (el) {
            const val = el.value;
            jsCode = jsCode.split(`\${${input.id}}`).join(val);
            const rawVal = val.replace(/[#.]/g, '');
            htmlCode = htmlCode.split(`\${${input.id}_raw}`).join(rawVal);
        }
    });

    const jsDisplay = document.getElementById('code-display');
    const htmlDisplay = document.getElementById('html-display');

    // 1. 먼저 텍스트를 갈아끼웁니다.
    jsDisplay.textContent = jsCode;
    htmlDisplay.textContent = htmlCode;

    // 2. [매우 중요] Prism에게 하이라이트를 다시 적용하라고 강제 명령합니다.
    if (window.Prism) {
        // 기존에 입혀진 하이라이트 데이터를 초기화하고 새로 입힙니다.
        Prism.highlightElement(jsDisplay);
        Prism.highlightElement(htmlDisplay);
    }
}

// [8] 공통 유틸리티
function copyCode(targetId, btnElement) {
    // 1. 텍스트 가져오기
    const displayElement = document.getElementById(targetId);
    if (!displayElement) {
        showToast("❌ 복사할 대상을 찾을 수 없습니다.", "error");
        return;
    }
    const text = displayElement.textContent;

    // 2. 클립보드 복사 실행
    navigator.clipboard.writeText(text).then(() => {
        // [성공 시]
        const type = targetId === 'code-display' ? 'JS' : 'HTML';
        showToast(`✅ ${type} 코드가 복사되었습니다!`, "success");

        // 버튼 텍스트 피드백
        if (btnElement) {
            const originalText = btnElement.textContent;
            btnElement.textContent = "복사 완료!";
            btnElement.classList.replace('bg-blue-600', 'bg-emerald-600');
            btnElement.classList.replace('bg-emerald-600', 'bg-emerald-500');

            setTimeout(() => {
                btnElement.textContent = originalText;
                btnElement.classList.remove('bg-emerald-500');
                // 기존 색상 복구 (JS 버튼인지 HTML 버튼인지에 따라 처리)
                if (targetId === 'code-display') btnElement.classList.add('bg-blue-600');
                else btnElement.classList.add('bg-emerald-600');
            }, 1000);
        }
    }).catch(err => {
        // [실패 시] 오직 실패했을 때만 실행됨
        console.error("복사 실패:", err);
        showToast("❌ 복사에 실패했습니다.", "error");
    });
}

// [9] 토스트 알림 생성 함수
function showToast(message, type = "success") {
    const container = document.getElementById('toast-container');

    // 토스트 요소 생성
    const toast = document.createElement('div');
    toast.className = `animate-slide-up flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl text-white text-sm font-bold transition-all min-w-[280px] justify-center`;

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

// 모달 바깥 클릭 시 닫기 (이전 코드와 병합 시 참고)
window.addEventListener('click', (e) => {
    const privacyModal = document.getElementById('privacy-modal');
    const usageModal = document.getElementById('usage-modal');
    if (e.target === privacyModal) closePrivacyModal();
    if (e.target === usageModal) closeUsageModal();
});

function openUsageModal() { document.getElementById('usage-modal').classList.replace('hidden', 'flex'); }
function closeUsageModal() { document.getElementById('usage-modal').classList.replace('flex', 'hidden'); }