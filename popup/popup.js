document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup script loaded!');
    
    // 모든 이미지 요소 가져오기
    const images = Array.from(document.querySelectorAll("img"));
    console.log('Found images:', images.length);
    
    // 이미지 클릭 이벤트 처리
    images.forEach(img => {
        img.addEventListener("click", () => {
            console.log('Image clicked:', img.src);
            
            // 기존 선택 제거
            document.querySelectorAll('.cat-option').forEach(el => {
                el.classList.remove('selected');
            });
            
            // 새 선택 추가
            const option = img.closest('.cat-option');
            option.classList.add('selected');
            
            // 이미지 파일명 추출
            const fileName = img.src.split('/').pop();
            const fullImagePath = chrome.runtime.getURL(`images/${fileName}`);
            console.log('Full image path:', fullImagePath);
            
            // 이미지 경로 저장
            chrome.storage.local.set({ image: fullImagePath }, function() {
                console.log('Image saved:', fullImagePath);
                
                // 현재 탭에 배경 적용 (새로고침 없이)
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0] && !tabs[0].url.startsWith('chrome://')) {
                        chrome.scripting.executeScript({
                            target: {tabId: tabs[0].id},
                            function: function(imagePath) {
                                // 파일명에서 픽셀 크기 추출
                                let pixelSize = '200px';
                                if (imagePath.includes('16.png')) {
                                    pixelSize = '16px';
                                } else if (imagePath.includes('32.png')) {
                                    pixelSize = '32px';
                                } else if (imagePath.includes('48.png')) {
                                    pixelSize = '48px';
                                } else if (imagePath.includes('128.png')) {
                                    pixelSize = '128px';
                                }
                                
                                // 배경 이미지 설정
                                document.body.style.backgroundImage = `url(${imagePath})`;
                                document.body.style.backgroundSize = pixelSize;
                                document.body.style.backgroundRepeat = "repeat";
                                console.log('Catify: Background applied directly:', imagePath, pixelSize);
                            },
                            args: [fullImagePath]
                        });
                    }
                });
            });
        });
    });
    
    // 저장된 이미지 불러오기
    chrome.storage.local.get(['image'], function(result) {
        console.log('Loaded saved image:', result.image);
        if (result.image) {
            const savedImageSrc = result.image;
            const matchingImg = Array.from(document.querySelectorAll('.cat-option img')).find(img => 
                img.src === savedImageSrc || savedImageSrc.includes(img.src.split('/').pop())
            );
            
            if (matchingImg) {
                matchingImg.closest('.cat-option').classList.add('selected');
            }
        }
    });
});
