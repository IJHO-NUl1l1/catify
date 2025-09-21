// 이 파일은 웹 페이지에 직접 주입되는 스크립트입니다.
console.log('Catify content script loaded!');

// 페이지에 고양이 배경을 설정하는 함수
function applyCatBackground() {
    // chrome:// URL에서는 실행하지 않도록 합니다.
    if (window.location.href.startsWith('chrome://') || 
        window.location.href.startsWith('edge://') || 
        window.location.href.startsWith('about:') || 
        window.location.href.startsWith('chrome-extension://')) {
        console.log('Catify: Protected browser page detected. Content script will not run.');
        return;
    }
    
    console.log('Catify: Applying background to page');
    
    // 저장된 이미지 가져오기
    chrome.storage.local.get(["image"], function(result) {
        console.log('Catify: Retrieved stored image:', result.image);
        if (result.image) {
            // 파일명에서 픽셀 크기 추출
            let pixelSize = '200px';
            if (result.image.includes('16.png')) {
                pixelSize = '16px';
            } else if (result.image.includes('32.png')) {
                pixelSize = '32px';
            } else if (result.image.includes('48.png')) {
                pixelSize = '48px';
            } else if (result.image.includes('128.png')) {
                pixelSize = '128px';
            }
            
            console.log('Catify: Setting background with size:', pixelSize);
            
            // 배경 이미지 설정
            document.body.style.backgroundImage = `url(${result.image})`;
            document.body.style.backgroundSize = pixelSize;
            document.body.style.backgroundRepeat = "repeat";
            
            // 디버깅용 이미지 표시
            console.log('Catify: Background image URL:', result.image);
            
            // 이미지 로딩 테스트
            const testImg = new Image();
            testImg.onload = function() {
                console.log('Catify: Image loaded successfully!');
            };
            testImg.onerror = function() {
                console.error('Catify: Failed to load image:', result.image);
            };
            testImg.src = result.image;
        } else {
            console.log('Catify: No image found in storage');
        }
    });
}

// 페이지 로드 완료 후 배경 적용
if (document.readyState === 'complete') {
    applyCatBackground();
} else {
    window.addEventListener('load', applyCatBackground);
}
