document.addEventListener('DOMContentLoaded', function() {
    // Load existing data if available
    loadExistingData();
    
    // Set up sidebar navigation
    setupSidebarNavigation();
    
    // Set up file upload previews
    setupFileUpload('logo-upload', 'logo-preview', 'portfolio-logo');
    setupFileUpload('hero-upload', 'hero-preview', 'portfolio-hero');
    setupFileUpload('about-upload', 'about-preview', 'portfolio-about-image');
    
    // Projects functionality
    document.getElementById('add-project').addEventListener('click', addProject);
    
    // Save all data
    document.getElementById('save-all').addEventListener('click', saveAllData);
    
    // Set up theme selection
    setupThemeSelection();
});

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.admin-sidebar a');
    const adminSections = document.querySelectorAll('.admin-section');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            sidebarLinks.forEach(l => l.classList.remove('active'));
            adminSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).classList.add('active');
        });
    });
}

function setupFileUpload(inputId, previewId, storageKey) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    input.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            if (file.size > 2_000_000) { // 2MB limit
                alert("Please use images under 2MB for better performance");
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                localStorage.setItem(storageKey, e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });
    
    // Show existing image if available
    if (localStorage.getItem(storageKey)) {
        preview.src = localStorage.getItem(storageKey);
        preview.style.display = 'block';
    }
}

function addProject() {
    const projectId = Date.now();
    const projectsList = document.getElementById('projects-list');
    
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project-item';
    projectDiv.setAttribute('data-id', projectId);
    projectDiv.innerHTML = `
        <h3>New Project</h3>
        <div class="form-group">
            <label>Project Name</label>
            <input type="text" class="project-name" placeholder="My Awesome Project">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="project-desc" placeholder="Describe your project..."></textarea>
        </div>
        <div class="form-group">
            <label>Technologies Used</label>
            <input type="text" class="project-tech" placeholder="HTML, CSS, JavaScript">
        </div>
        <div class="form-group">
            <label>Project URL (Live Demo)</label>
            <input type="url" class="project-url" placeholder="https://example.com">
        </div>
        <div class="form-group">
            <label>GitHub Repository URL</label>
            <input type="url" class="project-github" placeholder="https://github.com/username/project">
        </div>
        <div class="form-group">
            <label>Project Image</label>
            <input type="file" class="project-image" accept="image/*">
            <div class="file-preview-container">
                <img class="project-preview file-preview" src="" alt="Project Preview">
            </div>
        </div>
        <div class="project-controls">
            <button class="remove-project"><i class="fas fa-trash"></i> Remove Project</button>
        </div>
    `;
    
    projectsList.appendChild(projectDiv);
    
    // Setup image upload for this project
    const fileInput = projectDiv.querySelector('.project-image');
    const preview = projectDiv.querySelector('.project-preview');
    
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            if (file.size > 2_000_000) { // 2MB limit
                alert("Please use images under 2MB for better performance");
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                localStorage.setItem(`project-${projectId}-image`, e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });
    
    // Setup remove button
    projectDiv.querySelector('.remove-project').addEventListener('click', function() {
        if (confirm('Are you sure you want to remove this project?')) {
            projectsList.removeChild(projectDiv);
            localStorage.removeItem(`project-${projectId}-image`);
        }
    });
}

function saveAllData() {
    // Save basic info
    localStorage.setItem('portfolio-name', document.getElementById('user-name').value || 'Your Name');
    localStorage.setItem('portfolio-title', document.getElementById('user-title').value || 'Your Profession');
    localStorage.setItem('portfolio-about', document.getElementById('about-text').value || 'Tell something about yourself...');
    localStorage.setItem('portfolio-skills', document.getElementById('user-skills').value || 'HTML, CSS, JavaScript');
    localStorage.setItem('portfolio-email', document.getElementById('user-email').value || 'your.email@example.com');
    localStorage.setItem('portfolio-phone', document.getElementById('user-phone').value || '');
    localStorage.setItem('portfolio-address', document.getElementById('user-address').value || '');
    
    // Save social links
    localStorage.setItem('portfolio-github', document.getElementById('github-link').value || '#');
    localStorage.setItem('portfolio-linkedin', document.getElementById('linkedin-link').value || '#');
    localStorage.setItem('portfolio-instagram', document.getElementById('instagram-link').value || '#');
    localStorage.setItem('portfolio-facebook', document.getElementById('facebook-link').value || '#');
    
    // Save projects
    const projects = [];
    document.querySelectorAll('.project-item').forEach(project => {
        const id = project.getAttribute('data-id');
        projects.push({
            id: id,
            name: project.querySelector('.project-name').value || 'Project Name',
            description: project.querySelector('.project-desc').value || 'Project description',
            technologies: project.querySelector('.project-tech').value || 'Technologies used',
            url: project.querySelector('.project-url').value || '#',
            github: project.querySelector('.project-github').value || '#',
            hasImage: localStorage.getItem(`project-${id}-image`) !== null
        });
    });
    
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
    
    // Show success message
    showSuccessMessage('All changes saved successfully!');
}

function setupThemeSelection() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const currentTheme = localStorage.getItem('portfolio-theme') || 'default';
    
    // Set active theme
    document.body.setAttribute('data-theme', currentTheme);
    
    themeOptions.forEach(option => {
        if (option.dataset.theme === currentTheme) {
            option.classList.add('active');
        }
        
        option.addEventListener('click', function() {
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Set theme
            const selectedTheme = this.dataset.theme;
            document.body.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('portfolio-theme', selectedTheme);
        });
    });
}

function loadExistingData() {
    // Load basic info
    if (localStorage.getItem('portfolio-name')) {
        document.getElementById('user-name').value = localStorage.getItem('portfolio-name');
    }
    if (localStorage.getItem('portfolio-title')) {
        document.getElementById('user-title').value = localStorage.getItem('portfolio-title');
    }
    if (localStorage.getItem('portfolio-about')) {
        document.getElementById('about-text').value = localStorage.getItem('portfolio-about');
    }
    if (localStorage.getItem('portfolio-skills')) {
        document.getElementById('user-skills').value = localStorage.getItem('portfolio-skills');
    }
    if (localStorage.getItem('portfolio-email')) {
        document.getElementById('user-email').value = localStorage.getItem('portfolio-email');
    }
    if (localStorage.getItem('portfolio-phone')) {
        document.getElementById('user-phone').value = localStorage.getItem('portfolio-phone');
    }
    if (localStorage.getItem('portfolio-address')) {
        document.getElementById('user-address').value = localStorage.getItem('portfolio-address');
    }
    
    // Load social links
    if (localStorage.getItem('portfolio-github')) {
        const github = localStorage.getItem('portfolio-github');
        document.getElementById('github-link').value = github !== '#' ? github : '';
    }
    if (localStorage.getItem('portfolio-linkedin')) {
        const linkedin = localStorage.getItem('portfolio-linkedin');
        document.getElementById('linkedin-link').value = linkedin !== '#' ? linkedin : '';
    }
    if (localStorage.getItem('portfolio-instagram')) {
        const instagram = localStorage.getItem('portfolio-instagram');
        document.getElementById('instagram-link').value = instagram !== '#' ? instagram : '';
    }
    if (localStorage.getItem('portfolio-facebook')) {
        const facebook = localStorage.getItem('portfolio-facebook');
        document.getElementById('facebook-link').value = facebook !== '#' ? facebook : '';
    }
    
    // Load projects if any
    if (localStorage.getItem('portfolio-projects')) {
        const projects = JSON.parse(localStorage.getItem('portfolio-projects'));
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';
        
        projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project-item';
            projectDiv.setAttribute('data-id', project.id);
            projectDiv.innerHTML = `
                <h3>${project.name}</h3>
                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" class="project-name" value="${project.name}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="project-desc">${project.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Technologies Used</label>
                    <input type="text" class="project-tech" value="${project.technologies}">
                </div>
                <div class="form-group">
                    <label>Project URL (Live Demo)</label>
                    <input type="url" class="project-url" value="${project.url}">
                </div>
                <div class="form-group">
                    <label>GitHub Repository URL</label>
                    <input type="url" class="project-github" value="${project.github}">
                </div>
                <div class="form-group">
                    <label>Project Image</label>
                    <input type="file" class="project-image" accept="image/*">
                    <div class="file-preview-container">
                        <img class="project-preview file-preview" src="${project.hasImage ? localStorage.getItem(`project-${project.id}-image`) : ''}" alt="Project Preview" style="display: ${project.hasImage ? 'block' : 'none'}">
                    </div>
                </div>
                <div class="project-controls">
                    <button class="remove-project"><i class="fas fa-trash"></i> Remove Project</button>
                </div>
            `;
            
            projectsList.appendChild(projectDiv);
            
            // Setup image upload for this project
            const fileInput = projectDiv.querySelector('.project-image');
            const preview = projectDiv.querySelector('.project-preview');
            
            fileInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    if (file.size > 2_000_000) { // 2MB limit
                        alert("Please use images under 2MB for better performance");
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                        localStorage.setItem(`project-${project.id}-image`, e.target.result);
                    }
                    reader.readAsDataURL(file);
                }
            });
            
            // Setup remove button
            projectDiv.querySelector('.remove-project').addEventListener('click', function() {
                if (confirm('Are you sure you want to remove this project?')) {
                    projectsList.removeChild(projectDiv);
                    localStorage.removeItem(`project-${project.id}-image`);
                }
            });
        });
    }
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}