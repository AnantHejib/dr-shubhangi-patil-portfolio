/**
 * Dr. Shubhangi R. Patil-Solanki Portfolio - Rich Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Management (Light / Dark mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      themeIconSun.style.display = 'none';
      themeIconMoon.style.display = 'block';
    } else {
      themeIconSun.style.display = 'block';
      themeIconMoon.style.display = 'none';
    }
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode`);
    });
  }

  // ==========================================
  // 2. Interactive Background Neural Canvas
  // ==========================================
  const canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 24), 55);
    const maxDistance = 140;
    let mouse = { x: -1000, y: -1000, radius: 150 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse avoidance/attraction subtle response
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }

      draw() {
        const isDark = htmlRoot.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(99, 140, 255, 0.7)' : 'rgba(37, 99, 235, 0.6)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateNeuralMesh() {
      ctx.clearRect(0, 0, width, height);
      const isDark = htmlRoot.getAttribute('data-theme') !== 'light';

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.35 : 0.22);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark ? `rgba(99, 102, 241, ${alpha})` : `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateNeuralMesh);
    }

    animateNeuralMesh();
  }

  // ==========================================
  // 3. Stat Counter Animation on Scroll
  // ==========================================
  const counterElements = document.querySelectorAll('.counter-num');
  let countersAnimated = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeOutQuad * target);
        counter.textContent = currentVal < 10 && target < 10 ? '0' + currentVal : currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target < 10 ? '0' + target : target;
        }
      }
      requestAnimationFrame(updateCounter);
    });
  }

  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersAnimated) {
        countersAnimated = true;
        runCounters();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(heroSection);
  }

  // ==========================================
  // 4. Mobile Navigation Drawer
  // ==========================================
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileNavToggle && navLinks) {
    mobileNavToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 5. Active Nav Tracking
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(section => navObserver.observe(section));

  // ==========================================
  // 6. Scroll Progress & Floating Back-To-Top
  // ==========================================
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const progressCircle = document.getElementById('progressRingCircle');
  const circumference = 2 * Math.PI * 22; // ~138.23

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference}`;
  }

  window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPos = window.scrollY;
    const progress = Math.min(Math.max(scrollPos / (scrollTotal || 1), 0), 1);

    if (progressCircle) {
      progressCircle.style.strokeDashoffset = circumference - progress * circumference;
    }

    if (scrollTopBtn) {
      if (scrollPos > 320) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 7. Intellectual Property Filter
  // ==========================================
  const ipTabs = document.querySelectorAll('.ip-tab-btn');
  const ipCards = document.querySelectorAll('.ip-card');

  ipTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ipTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      ipCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Patent Detail Expanders
  document.querySelectorAll('.patent-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const detail = document.getElementById(targetId);
      if (detail) {
        const isExpanded = detail.classList.toggle('expanded');
        btn.setAttribute('aria-expanded', isExpanded);
        btn.querySelector('span').textContent = isExpanded ? '− Hide Specifications' : '+ Technical Specifications';
      }
    });
  });

  // ==========================================
  // 8. Publications Filter, Live Search & Counter
  // ==========================================
  const pubTabs = document.querySelectorAll('.pub-tab-btn');
  const pubSearchInput = document.getElementById('pubSearchInput');
  const pubCards = document.querySelectorAll('.publication-card');
  const pubList = document.getElementById('publicationsList');
  const pubCounterStrip = document.getElementById('pubCounterStrip');

  let activePubCategory = 'all';
  let searchQuery = '';

  // Store original titles and link targets for unhighlighting
  const originalTitleData = new Map();
  pubCards.forEach(card => {
    const linkEl = card.querySelector('.pub-paper-title a');
    const titleEl = card.querySelector('.pub-paper-title');
    if (linkEl) {
      originalTitleData.set(card, {
        text: linkEl.textContent.trim(),
        href: linkEl.getAttribute('href'),
        hasLink: true
      });
    } else if (titleEl) {
      originalTitleData.set(card, {
        text: titleEl.textContent.trim(),
        href: '',
        hasLink: false
      });
    }
  });

  function filterPublications() {
    let visibleCount = 0;

    pubCards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const data = originalTitleData.get(card);
      const rawText = data ? data.text : '';
      const titleEl = card.querySelector('.pub-paper-title');
      const textContent = card.textContent.toLowerCase();

      const matchesCategory = (activePubCategory === 'all') || categories.includes(activePubCategory);
      const matchesSearch = !searchQuery || keywords.includes(searchQuery) || textContent.includes(searchQuery) || rawText.toLowerCase().includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;

        // Highlight matching terms in title while preserving clickable link
        if (titleEl && data) {
          const iconSvg = `<svg class="external-link-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
          if (searchQuery) {
            const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            const highlighted = data.text.replace(regex, '<mark class="search-highlight">$1</mark>');
            if (data.hasLink) {
              titleEl.innerHTML = `<a href="${data.href}" target="_blank" rel="noopener noreferrer">${highlighted} ${iconSvg}</a>`;
            } else {
              titleEl.innerHTML = highlighted;
            }
          } else {
            if (data.hasLink) {
              titleEl.innerHTML = `<a href="${data.href}" target="_blank" rel="noopener noreferrer">${data.text} ${iconSvg}</a>`;
            } else {
              titleEl.textContent = data.text;
            }
          }
        }
      } else {
        card.style.display = 'none';
      }
    });

    // Update Counter
    if (pubCounterStrip) {
      pubCounterStrip.textContent = `Showing ${visibleCount} of ${pubCards.length} publications`;
    }

    // Empty state handling
    let emptyMsg = document.getElementById('emptyPubMessage');
    if (visibleCount === 0) {
      if (!emptyMsg) {
        emptyMsg = document.createElement('div');
        emptyMsg.id = 'emptyPubMessage';
        emptyMsg.className = 'glass-card';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '2.5rem';
        emptyMsg.innerHTML = `
          <h4 style="font-size: 1.15rem; margin-bottom: 0.5rem;">No publications found</h4>
          <p style="color: var(--text-secondary);">Try adjusting your search terms or selecting another category.</p>
        `;
        pubList.appendChild(emptyMsg);
      }
    } else if (emptyMsg) {
      emptyMsg.remove();
    }
  }

  pubTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pubTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activePubCategory = tab.getAttribute('data-filter');
      filterPublications();
    });
  });

  if (pubSearchInput) {
    pubSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterPublications();
    });
  }

  // ==========================================
  // 9. Citation Generator Modal
  // ==========================================
  const citationModal = document.getElementById('citationModal');
  const citationText = document.getElementById('citationText');
  const copyCitationBtn = document.getElementById('copyCitationBtn');
  let currentCitationData = null;
  let activeCitationFormat = 'bibtex';

  function generateCitation(data, format) {
    const authors = data.authors || 'Patil, S.';
    const title = data.title || 'Untitled Research Work';
    const journal = data.journal || 'Journal of Engineering';
    const year = data.year || '2023';
    const doi = data.doi || '';

    if (format === 'bibtex') {
      const citeKey = `patil${year}${title.split(' ')[0].toLowerCase()}`;
      return `@article{${citeKey},
  author    = {${authors}},
  title     = {${title}},
  journal   = {${journal}},
  year      = {${year}}${doi ? `,\n  doi       = {${doi}}` : ''}
}`;
    } else if (format === 'apa') {
      return `${authors} (${year}). ${title}. ${journal}.${doi ? ` https://doi.org/${doi}` : ''}`;
    } else if (format === 'mla') {
      return `${authors}. "${title}." ${journal}, ${year}.${doi ? ` DOI: ${doi}.` : ''}`;
    }
  }

  document.querySelectorAll('.pub-cite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.publication-card');
      const title = card.querySelector('.pub-paper-title')?.textContent || '';
      const authors = card.querySelector('.pub-authors')?.textContent.trim() || '';
      const journal = card.querySelector('.pub-venue-badge')?.textContent.trim() || '';
      const year = card.querySelector('.pub-year-badge')?.textContent.trim() || '';
      const doiLink = card.querySelector('.pub-doi-link')?.getAttribute('href') || '';
      const doi = doiLink.replace('https://doi.org/', '').replace('https://www.doi.org/', '');

      currentCitationData = { title, authors, journal, year, doi };
      citationText.textContent = generateCitation(currentCitationData, activeCitationFormat);
      citationModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('.citation-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.citation-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCitationFormat = tab.getAttribute('data-format');
      if (currentCitationData) {
        citationText.textContent = generateCitation(currentCitationData, activeCitationFormat);
      }
    });
  });

  const closeCitationModalBtn = document.getElementById('closeCitationModalBtn');
  if (closeCitationModalBtn) {
    closeCitationModalBtn.addEventListener('click', () => {
      citationModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (copyCitationBtn) {
    copyCitationBtn.addEventListener('click', () => {
      if (citationText) {
        navigator.clipboard.writeText(citationText.textContent).then(() => {
          showToast('Citation copied in ' + activeCitationFormat.toUpperCase() + ' format!');
        });
      }
    });
  }

  // ==========================================
  // 10. Modals (ACM Certificate & Poster)
  // ==========================================
  function setupModal(modalId, openBtnIds, closeBtnId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    openBtnIds.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      }
    });

    const closeBtn = document.getElementById(closeBtnId);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  setupModal('acmModal', ['openAcmCertBtn'], 'closeAcmModalBtn');
  setupModal('posterModal', ['openPosterModalBtn', 'viewPosterBtn'], 'closePosterModalBtn');

  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
        modal.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

  // ==========================================
  // 11. Clipboard Copy Actions
  // ==========================================
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('solanki.shubhangi@gmail.com').then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        showToast('Email: solanki.shubhangi@gmail.com');
      });
    });
  }

  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('+919921272469').then(() => {
        showToast('Phone number copied to clipboard!');
      }).catch(() => {
        showToast('Phone: +91 9921272469');
      });
    });
  }

  // ==========================================
  // 12. Interactive 3D Card Tilt Effect
  // ==========================================
  document.querySelectorAll('.tilt-element').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ==========================================
  // 13. Contact Form Submission
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      const mailtoUrl = `mailto:solanki.shubhangi@gmail.com?subject=${encodeURIComponent(subject || 'Academic Inquiry')}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      
      showToast('Opening email client for Dr. Shubhangi Patil...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);

      contactForm.reset();
    });
  }

  // ==========================================
  // 14. Toast Notification Engine
  // ==========================================
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-emerald); flex-shrink: 0;">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
