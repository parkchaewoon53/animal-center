document.addEventListener('DOMContentLoaded', function() {
    const accordionButtons = document.querySelectorAll('.accordion-button');

    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const accordionItem = button.parentElement.parentElement;
            const accordionCollapse = accordionItem.querySelector('.accordion-collapse');

            // 모든 아코디언 내용 닫기
            document.querySelectorAll('.accordion-collapse').forEach(item => {
                if (item !== accordionCollapse) {
                    item.style.maxHeight = null;
                }
            });

            // 현재 아코디언 내용 토글
            if (accordionCollapse.style.maxHeight) {
                accordionCollapse.style.maxHeight = null;
            } else {
                accordionCollapse.style.maxHeight = accordionCollapse.scrollHeight + 'px';
            }

            // 모든 버튼에서 'active' 클래스 제거
            accordionButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.backgroundColor = ''; // 기존 배경색 제거
            });

            // 클릭된 버튼에 'active' 클래스 추가 및 배경색 적용
            button.classList.add('active');
            button.style.backgroundColor = '#1bc094'; // 원하는 배경색 직접 적용
        });
    });
});