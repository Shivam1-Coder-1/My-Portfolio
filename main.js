// Performance optimization
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => lazyLoadObserver.observe(img));
    }

    // Mobile Navigation
    const menuBtn = document.createElement('div');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '☰';
    menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    document.querySelector('.header').appendChild(menuBtn);

    const navbar = document.querySelector('.navbar');
    menuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuBtn.innerHTML = navbar.classList.contains('active') ? '✕' : '☰';
        menuBtn.setAttribute('aria-expanded', navbar.classList.contains('active'));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuBtn.contains(e.target)) {
            navbar.classList.remove('active');
            menuBtn.innerHTML = '☰';
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Update URL hash without scrolling
                history.pushState(null, null, this.getAttribute('href'));
                // Close mobile menu after clicking a link
                navbar.classList.remove('active');
                menuBtn.innerHTML = '☰';
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Add scroll event listener for header
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        // Clear the timeout if it exists
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        // Use requestAnimationFrame for better performance
        scrollTimeout = window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('scroll-up');
                return;
            }
            
            if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
                // Scroll Down
                header.classList.remove('scroll-up');
                header.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
                // Scroll Up
                header.classList.remove('scroll-down');
                header.classList.add('scroll-up');
            }
            lastScroll = currentScroll;
        });
    });

    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('Active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('Active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(highlightNavigation);
    });

    // Education Timeline Animation
    const timelineContainers = document.querySelectorAll('.container');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    timelineContainers.forEach(container => {
        timelineObserver.observe(container);
    });
});
