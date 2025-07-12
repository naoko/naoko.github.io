// Modern ES6+ replacement for jQuery functionality

// Mobile menu toggle
function initMobileMenu() {
  const closeMenuButton = document.querySelector('.close-menu');
  const aboutButton = document.querySelector('.about');
  const closeAboutButton = document.querySelector('.close-about');
  const menu = document.querySelector('.menu');
  const links = document.querySelector('.links');
  const aboutModal = document.getElementById('about');

  if (closeMenuButton && menu && links) {
    closeMenuButton.addEventListener('click', () => {
      menu.classList.toggle('disabled');
      links.classList.toggle('enabled');
    });
  }

  if (aboutButton && aboutModal) {
    aboutButton.addEventListener('click', () => {
      aboutModal.style.display = 'block';
    });
  }

  if (closeAboutButton && aboutModal) {
    closeAboutButton.addEventListener('click', () => {
      aboutModal.style.display = '';
    });
  }
}

// Responsive video embeds (FitVids replacement)
function initResponsiveVideos() {
  const articles = document.querySelectorAll('article');

  articles.forEach(article => {
    const videos = article.querySelectorAll(
      'iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="dailymotion"]'
    );

    videos.forEach(video => {
      const wrapper = document.createElement('div');
      wrapper.className = 'video-wrapper';
      video.parentNode.insertBefore(wrapper, video);
      wrapper.appendChild(video);
    });
  });
}

// Modern lightbox functionality
function initLightbox() {
  const imageLinks = document.querySelectorAll(
    'a[href$=".jpg"], a[href$=".jpeg"], a[href$=".JPG"], a[href$=".png"], a[href$=".gif"], a[href$=".webp"]'
  );

  imageLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showLightbox(link.href, link.querySelector('img')?.alt || '');
    });
  });
}

function showLightbox(imageSrc, altText) {
  // Create lightbox overlay
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox-container">
      <img src="${imageSrc}" alt="${altText}" class="lightbox-image">
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Close lightbox on click
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
      closeLightbox(overlay);
    }
  });

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeLightbox(overlay);
    }
  });
}

function closeLightbox(overlay) {
  overlay.remove();
  document.body.style.overflow = '';
}

// Lazy loading for images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// Progressive enhancement for search
function initSearch() {
  const searchInput = document.querySelector('#search-input');
  const searchResults = document.querySelector('#search-results');

  if (searchInput && searchResults) {
    let searchData = [];

    // Load search data
    fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        searchData = data;
      })
      .catch(() => {
        console.log('Search functionality not available');
      });

    // Search functionality
    searchInput.addEventListener(
      'input',
      debounce(e => {
        const query = e.target.value.trim().toLowerCase();

        if (query.length < 2) {
          searchResults.innerHTML = '';
          return;
        }

        const results = searchData
          .filter(
            item =>
              item.title.toLowerCase().includes(query) ||
              item.content.toLowerCase().includes(query)
          )
          .slice(0, 10);

        displaySearchResults(results, searchResults);
      }, 300)
    );
  }
}

function displaySearchResults(results, container) {
  if (results.length === 0) {
    container.innerHTML = '<p>No results found</p>';
    return;
  }

  container.innerHTML = results
    .map(
      result => `
    <article class="search-result">
      <h3><a href="${result.url}">${result.title}</a></h3>
      <p>${result.excerpt}</p>
    </article>
  `
    )
    .join('');
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.querySelector('#theme-toggle');

  if (themeToggle) {
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initResponsiveVideos();
  initLightbox();
  initLazyLoading();
  initSearch();
  initThemeToggle();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(() => console.log('Service Worker registration failed'));
  });
}
