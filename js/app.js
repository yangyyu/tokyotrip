/**
 * 東京旅行網頁 - 互動邏輯
 * 提供行程卡片展開/收合、平滑滾動等功能
 */

document.addEventListener('DOMContentLoaded', () => {
  initDayCards();
  initBottomNav();
  initSmoothScroll();
});

/**
 * 初始化每日行程卡片的展開/收合功能
 */
function initDayCards() {
  const dayCards = document.querySelectorAll('.day-card');
  
  dayCards.forEach((card, index) => {
    const header = card.querySelector('.day-card__header');
    
    // 預設展開第一張卡片
    if (index === 0) {
      card.classList.add('is-open');
    }
    
    header.addEventListener('click', () => {
      // 切換當前卡片狀態
      card.classList.toggle('is-open');
      
      // 更新無障礙屬性
      const isOpen = card.classList.contains('is-open');
      header.setAttribute('aria-expanded', isOpen);
    });
    
    // 設置初始無障礙屬性
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    header.setAttribute('tabindex', '0');
    
    // 支援鍵盤操作
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-open');
      }
    });
  });
}

/**
 * 初始化底部導航的當前狀態
 */
function initBottomNav() {
  const navLinks = document.querySelectorAll('.bottom-nav__link');
  
  // 監聽滾動事件，更新當前導航項目
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const dayId = entry.target.id;
        
        navLinks.forEach((link) => {
          link.classList.remove('is-active');
          if (link.getAttribute('href') === `#${dayId}`) {
            link.classList.add('is-active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });
  
  // 觀察所有日期區塊
  document.querySelectorAll('.day-card').forEach((card) => {
    observer.observe(card);
  });
  
  // 點擊導航項目時添加動態效果
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      navLinks.forEach((l) => l.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });
}

/**
 * 初始化平滑滾動功能
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = anchor.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // 計算目標位置，考慮固定 header 高度
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 16;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // 自動展開目標卡片
        const targetCard = targetElement.closest('.day-card') || targetElement;
        if (targetCard.classList.contains('day-card')) {
          targetCard.classList.add('is-open');
        }
      }
    });
  });
}
