// 미리보기 기능 모듈

function openPreviewModal() {
    const modal = document.getElementById('preview-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    runPreview();
}

function closePreviewModal() {
    const modal = document.getElementById('preview-modal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Iframe 초기화 (메모리 누수 방지)
    const iframe = document.getElementById('preview-frame');
    iframe.src = 'about:blank';
}

function runPreview() {
    const jsCode = document.getElementById('code-display').textContent;
    const htmlCode = document.getElementById('html-display').textContent;
    const iframe = document.getElementById('preview-frame');
    
    // Iframe 내부 문서 객체 가져오기
    const doc = iframe.contentWindow.document;
    
    // 기본 템플릿 작성
    const content = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <!-- Tailwind CSS -->
            <script src="https://cdn.tailwindcss.com"></script>
            <!-- jQuery -->
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            <!-- SweetAlert2 (필요 시) -->
            <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
            <!-- Day.js (필요 시) -->
            <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
            <!-- Lodash (필요 시) -->
            <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
            
            <style>
                body { padding: 20px; font-family: sans-serif; }
                /* 미리보기 전용 스타일 */
                input[type="text"], input[type="password"], textarea {
                    border: 1px solid #ccc;
                    padding: 8px;
                    border-radius: 4px;
                    width: 100%;
                    max-width: 300px;
                    margin-bottom: 10px;
                    display: block;
                }
                button {
                    background-color: #3b82f6;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                }
                button:hover { background-color: #2563eb; }
                table { border-collapse: collapse; width: 100%; max-width: 500px; margin-top: 10px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f3f4f6; }
            </style>
        </head>
        <body>
            <div id="preview-content">
                ${htmlCode}
            </div>

            <script>
                // DOM 로드 후 실행
                $(document).ready(function() {
                    try {
                        ${jsCode}
                    } catch (e) {
                        console.error("Preview Error:", e);
                        alert("코드 실행 중 오류가 발생했습니다: " + e.message);
                    }
                });
            </script>
        </body>
        </html>
    `;
    
    doc.open();
    doc.write(content);
    doc.close();
}

// 모달 바깥 클릭 시 닫기 (preview 모달 전용)
window.addEventListener('click', (e) => {
    const previewModal = document.getElementById('preview-modal');
    if (e.target === previewModal) closePreviewModal();
});
