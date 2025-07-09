// 确保页面内容在加载后显示
document.addEventListener('DOMContentLoaded', function() {
    // 设置超时，确保所有内容加载后显示
    setTimeout(function() {
        // 移除加载动画
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        // 强制显示主要内容
        document.body.style.visibility = 'visible';
        document.body.style.opacity = '1';
        
        const header = document.getElementById('home');
        const sections = document.querySelectorAll('section');
        
        if (header) {
            header.style.visibility = 'visible';
            header.style.opacity = '1';
            header.style.zIndex = '10';
            header.style.position = 'relative';
        }
        
        sections.forEach(section => {
            section.style.visibility = 'visible';
            section.style.opacity = '1';
            section.style.zIndex = '10';
            section.style.position = 'relative';
        });
        
        // 调整Three.js场景的z-index
        const bgCanvas = document.getElementById('bg-canvas');
        if (bgCanvas) {
            bgCanvas.style.zIndex = '-12';
        }
        
        // 初始化AOS动画
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: false,
            mirror: false
        });
        
        // 移除自定义光标（如果存在）
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.display = 'none';
        }
        
        // 初始化技能进度条
        initSkillBars();
        
        // 初始化Three.js场景
        initThreeScene();
        
        // 初始化Particles.js
        initParticles();
        
        // 设置回到顶部按钮
        setupBackToTop();
        
        // 设置联系表单
        setupContactForm();
        
        // 设置导航链接滚动
        setupSmoothScroll();
        
        // 初始化作品集筛选功能
        initPortfolioFilters();
        
        // 设置导航栏滚动效果
        setupNavbarScroll();
    }, 1000);
});

// 初始化技能进度条
function initSkillBars() {
    const progressBars = document.querySelectorAll('.progress-line span');
    
    progressBars.forEach(bar => {
        const percent = bar.getAttribute('data-percent');
        bar.style.width = percent;
        
        // 添加CSS变量以供动画使用
        bar.style.setProperty('--percent', percent);
        
        // 添加观察者，当元素进入视口时触发动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    bar.style.transform = 'scaleX(' + (parseInt(percent) / 100) + ')';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(bar.parentElement);
    });
}

// 初始化Particles.js
function initParticles() {
    // 检查particles.js是否已加载
    if (window.particlesJS) {
        particlesJS('particles-container', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#64ffda"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#64ffda",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": false,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    }
                }
            },
            "retina_detect": true
        });
    } else {
        console.error("Particles.js not loaded");
    }
}

// 设置回到顶部按钮
function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    // 滚动时显示/隐藏按钮
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // 点击返回顶部
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 主题切换功能已移除

// Three.js场景初始化
function initThreeScene() {
    // 检查Three.js是否已加载
    if (typeof THREE === 'undefined') {
        console.error("Three.js not loaded");
        return;
    }
    
    // 获取容器元素并设置正确的z-index
    const container = document.getElementById('bg-canvas');
    if (!container) return;
    
    // 确保Three.js场景不覆盖内容
    container.style.zIndex = '-12';
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    
    // 创建场景
    const scene = new THREE.Scene();
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // 添加环境光和方向光
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x64ffda, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // 创建几何体
    const particles = new THREE.Group();
    scene.add(particles);
    
    // 创建星星粒子
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0x64ffda,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    particles.add(stars);
    
    // 动画循环
    const animate = () => {
        requestAnimationFrame(animate);
        
        // 旋转粒子系统
        particles.rotation.x += 0.0003;
        particles.rotation.y += 0.0002;
        
        // 渲染场景
        renderer.render(scene, camera);
    };
    
    // 窗口大小变化时调整
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // 开始动画
    animate();
}

// 设置联系表单
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // 创建提交按钮引用
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // 更改按钮状态为加载中
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
        
        try {
            // 发送数据到后端API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // 成功提交表单
                showNotification('感谢您的留言！我们将尽快回复您。', 'success');
                contactForm.reset();
            } else {
                // 提交失败
                showNotification(`提交失败: ${data.message || '请稍后再试'}`, 'error');
            }
        } catch (error) {
            console.error('提交表单时出错:', error);
            showNotification('发生了网络错误，请稍后再试。', 'error');
        } finally {
            // 恢复按钮状态
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// 显示通知消息
function showNotification(message, type = 'info') {
    // 检查是否已存在通知容器
    let notificationContainer = document.querySelector('.notification-container');
    
    // 如果不存在，创建一个
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // 添加通知容器样式
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .notification {
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 280px;
                max-width: 400px;
                transform: translateX(120%);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.success {
                background-color: #64ffda;
                color: #0a192f;
                border-left: 4px solid #2ee6b6;
            }
            
            .notification.error {
                background-color: #ff6464;
                color: white;
                border-left: 4px solid #e62e2e;
            }
            
            .notification.info {
                background-color: #64a0ff;
                color: white;
                border-left: 4px solid #2e64e6;
            }
            
            .notification .close-btn {
                background: transparent;
                border: none;
                color: inherit;
                cursor: pointer;
                font-size: 16px;
                margin-left: 10px;
                opacity: 0.7;
            }
            
            .notification .close-btn:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        ${message}
        <button class="close-btn"><i class="fas fa-times"></i></button>
    `;
    
    // 添加关闭按钮功能
    const closeButton = notification.querySelector('.close-btn');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // 添加到容器并显示
    notificationContainer.appendChild(notification);
    
    // 使用setTimeout确保DOM更新
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3秒后自动关闭
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// 设置平滑滚动
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 只处理锚点链接
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 获取导航栏高度
                    const navbar = document.querySelector('nav');
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    
                    // 滚动到目标位置，考虑导航栏高度
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // 关闭移动端菜单（如果打开的话）
                    const navMenu = document.querySelector('.nav-menu');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        document.querySelector('.mobile-menu-btn').classList.remove('active');
                    }
                }
            }
        });
    });
    
    // 移动端菜单按钮
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// 初始化作品集筛选功能
function initPortfolioFilters() {
    const filters = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filters.length || !portfolioItems.length) return;
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // 移除其他过滤器的活动状态
            filters.forEach(f => f.classList.remove('active'));
            
            // 激活当前过滤器
            this.classList.add('active');
            
            const category = this.getAttribute('data-filter');
            
            // 过滤项目
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || category === itemCategory) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 设置导航栏滚动效果
function setupNavbarScroll() {
    const navbar = document.getElementById('main-nav');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 更新当前激活的导航链接
        updateActiveNavLink();
    });
}

// 更新激活的导航链接
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 获取当前滚动位置
    const scrollPosition = window.scrollY + 100; // 添加一些偏移
    
    // 遍历所有部分，确定当前视图中的部分
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // 更新导航链接
            navLinks.forEach(link => {
                link.classList.remove('active');
                
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// 获取项目数据
async function fetchProjects() {
    try {
        const response = await fetch('/api/projects?featured=true');
        if (!response.ok) {
            throw new Error('获取项目数据失败');
        }
        
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('获取项目数据时出错:', error);
        return [];
    }
}

// 动态渲染项目
async function renderProjects() {
    const projectsContainer = document.querySelector('.projects-grid');
    if (!projectsContainer) return;
    
    try {
        const projects = await fetchProjects();
        
        // 如果没有返回项目，则使用现有的
        if (projects.length === 0) return;
        
        // 清空现有内容
        projectsContainer.innerHTML = '';
        
        // 渲染每个项目
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'card project-card';
            projectCard.setAttribute('data-aos', 'fade-up');
            projectCard.setAttribute('data-aos-delay', (index + 1) * 100);
            
            const featuresHTML = project.features && project.features.length
                ? `<ul class="project-features">
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                  </ul>`
                : '';
                
            const tagsHTML = project.technologies && project.technologies.length
                ? `<div class="tags">
                    ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join(' ')}
                  </div>`
                : '';
                
            projectCard.innerHTML = `
                <div class="project-content">
                    <div class="project-header">
                        <div class="project-icon"><i class="fas fa-${getProjectIcon(project.category)}"></i></div>
                        <h3>${project.title}</h3>
                    </div>
                    <p>${project.description}</p>
                    ${featuresHTML}
                    ${tagsHTML}
                </div>
                <div class="project-links">
                    ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="project-link github"><i class="fab fa-github"></i></a>` : ''}
                    ${project.demoLink ? `<a href="${project.demoLink}" target="_blank" rel="noopener noreferrer" class="project-link external"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
        
    } catch (error) {
        console.error('渲染项目时出错:', error);
    }
}

// 根据项目类别获取图标
function getProjectIcon(category) {
    const icons = {
        'AI': 'robot',
        '全栈': 'layer-group',
        '前端': 'code',
        '后端': 'server',
        '移动应用': 'mobile-alt',
        '其他': 'project-diagram'
    };
    
    return icons[category] || 'project-diagram';
} 