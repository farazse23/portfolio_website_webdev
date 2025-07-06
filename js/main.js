document.addEventListener('DOMContentLoaded', function() {
    // Load portfolio data
    loadPortfolioData();
    
    // Set up mobile menu toggle
    setupMobileMenu();
    
    // Set up back to top button
    setupBackToTop();
    
    // Set up current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Animate stats
    animateStats();
    
    // Set up smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('portfolio-theme') || 'default';
    document.body.setAttribute('data-theme', savedTheme);
});

function loadPortfolioData() {
    // Load basic info
    if (localStorage.getItem('portfolio-name')) {
        document.getElementById('user-name-display').textContent = localStorage.getItem('portfolio-name');
        document.getElementById('footer-name').textContent = localStorage.getItem('portfolio-name');
    }
    
    if (localStorage.getItem('portfolio-title')) {
        document.getElementById('user-title-display').textContent = localStorage.getItem('portfolio-title');
    }
    
    if (localStorage.getItem('portfolio-logo')) {
        document.getElementById('header-logo').src = localStorage.getItem('portfolio-logo');
        document.getElementById('footer-logo').src = localStorage.getItem('portfolio-logo');
    }
    
    if (localStorage.getItem('portfolio-hero')) {
        document.querySelector('.hero').style.backgroundImage = `url(${localStorage.getItem('portfolio-hero')})`;
    }
    
    if (localStorage.getItem('portfolio-about')) {
        document.getElementById('about-text-display').textContent = localStorage.getItem('portfolio-about');
    }
    
    if (localStorage.getItem('portfolio-about-image')) {
        document.getElementById('about-image-display').src = localStorage.getItem('portfolio-about-image');
    }
    
    // Load contact info
    if (localStorage.getItem('portfolio-email')) {
        document.getElementById('contact-email').textContent = localStorage.getItem('portfolio-email');
    }
    
    if (localStorage.getItem('portfolio-phone')) {
        document.getElementById('contact-phone').textContent = localStorage.getItem('portfolio-phone');
    }
    
    if (localStorage.getItem('portfolio-address')) {
        document.getElementById('contact-address').textContent = localStorage.getItem('portfolio-address');
    }
    
    // Load skills
    if (localStorage.getItem('portfolio-skills')) {
        const skills = localStorage.getItem('portfolio-skills').split(',');
        const skillsContainer = document.getElementById('skills-display');
        skillsContainer.innerHTML = '';
        
        skills.forEach(skill => {
            if (skill.trim()) {
                const skillElement = document.createElement('div');
                skillElement.className = 'skill-item';
                skillElement.textContent = skill.trim();
                skillsContainer.appendChild(skillElement);
            }
        });
    }
    
    // Load projects
    if (localStorage.getItem('portfolio-projects')) {
        const projects = JSON.parse(localStorage.getItem('portfolio-projects'));
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';
        
        projects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project-card shine';
            
            let imageHTML = '';
            if (localStorage.getItem(`project-${project.id}-image`)) {
                imageHTML = `<div class="project-image"><img src="${localStorage.getItem(`project-${project.id}-image`)}" alt="${project.name}"></div>`;
            } else {
                imageHTML = `<div class="project-image"><img src="https://via.placeholder.com/600x400?text=Project+Image" alt="${project.name}"></div>`;
            }
            
            let demoButton = '';
            if (project.url && project.url !== '#') {
                demoButton = `<a href="${project.url}" target="_blank" class="btn btn-small"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
            }
            
            let codeButton = '';
            if (project.github && project.github !== '#') {
                codeButton = `<a href="${project.github}" target="_blank" class="btn btn-small btn-outline"><i class="fab fa-github"></i> Code</a>`;
            }
            
            projectElement.innerHTML = `
                ${imageHTML}
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p class="project-desc">${project.description}</p>
                    <div class="project-tech">${project.technologies}</div>
                    <div class="project-links">
                        ${demoButton}
                        ${codeButton}
                    </div>
                </div>
            `;
            
            projectsContainer.appendChild(projectElement);
        });
    }
    
    // Load social links
    if (localStorage.getItem('portfolio-github')) {
        const githubLink = localStorage.getItem('portfolio-github') || '#';
        document.getElementById('github-link').href = githubLink;
        document.querySelectorAll('.footer-social a')[0].href = githubLink;
    }
    
    if (localStorage.getItem('portfolio-linkedin')) {
        const linkedinLink = localStorage.getItem('portfolio-linkedin') || '#';
        document.getElementById('linkedin-link').href = linkedinLink;
        document.querySelectorAll('.footer-social a')[1].href = linkedinLink;
    }
    
    if (localStorage.getItem('portfolio-instagram')) {
        const instagramLink = localStorage.getItem('portfolio-instagram') || '#';
        document.getElementById('instagram-link').href = instagramLink;
        document.querySelectorAll('.footer-social a')[2].href = instagramLink;
    }
    
    if (localStorage.getItem('portfolio-facebook')) {
        const facebookLink = localStorage.getItem('portfolio-facebook') || '#';
        document.getElementById('facebook-link').href = facebookLink;
        document.querySelectorAll('.footer-social a')[3].href = facebookLink;
    }
}

function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', function() {
        nav.classList.toggle('active');
        menuToggle.innerHTML = nav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

function setupBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            stat.textContent = Math.floor(current);
            
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            }
        }, 16);
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}