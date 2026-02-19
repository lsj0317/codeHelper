// 공유 기능 모듈

function openShareModal() {
    const modal = document.getElementById('share-modal');
    const urlInput = document.getElementById('share-url');
    
    // 현재 상태를 기반으로 공유 URL 생성
    const shareUrl = generateShareUrl();
    urlInput.value = shareUrl;
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeShareModal() {
    const modal = document.getElementById('share-modal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function generateShareUrl() {
    const categorySelect = document.getElementById('category-select');
    const currentCatId = categorySelect.value;
    
    // 현재 선택된 아이템 ID 찾기 (main.js의 selectedItemId 변수 활용 필요하지만, 여기서는 DOM에서 유추)
    // main.js에서 selectedItemId를 전역으로 접근 가능하게 하거나, DOM 상태로 확인
    // 여기서는 DOM의 'bg-blue-600' 클래스를 가진 버튼을 찾아 아이템 이름을 통해 역추적하거나,
    // main.js와 상태를 공유하는 것이 가장 좋음.
    // 간편하게 main.js의 전역 변수 selectedItemId를 참조한다고 가정 (window 객체에 할당 필요)
    
    const itemId = window.selectedItemId;
    
    if (!currentCatId || !itemId) {
        return window.location.href;
    }
    
    const params = new URLSearchParams();
    params.set('cat', currentCatId);
    params.set('item', itemId);
    
    // 입력 필드 값들 수집
    const inputs = document.querySelectorAll('#input-container input');
    inputs.forEach(input => {
        const key = input.id.replace('field-', '');
        params.set(key, input.value);
    });
    
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

function copyShareUrl() {
    const urlInput = document.getElementById('share-url');
    urlInput.select();
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(urlInput.value).then(() => {
            showToast("링크가 복사되었습니다!");
        });
    } else {
        document.execCommand("copy");
        showToast("링크가 복사되었습니다!");
    }
}

// 카카오톡 공유 (실제 동작하려면 Kakao SDK 초기화 및 키 발급 필요)
// 여기서는 기능 예시로 alert 처리
function shareToKakao() {
    // 실제 구현 시: Kakao.Link.sendDefault(...)
    alert("카카오톡 공유 기능은 API 키 설정이 필요합니다.\n현재는 링크 복사 기능을 이용해주세요.");
}

// 모달 바깥 클릭 시 닫기
window.addEventListener('click', (e) => {
    const shareModal = document.getElementById('share-modal');
    if (e.target === shareModal) closeShareModal();
});
