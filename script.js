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
    
    // 添加网格
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // 材质
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x64ffda,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    // 网格
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // 动画
    const animate = () => {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        renderer.render(scene, camera);
    };
    
    animate();
    
    // 窗口大小调整
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
} 

// 设置联系表单
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // 简单验证
        if (!name || !email || !message) {
            alert('请填写必填字段');
            return;
        }
        
        // 在实际环境中，这里会发送数据到服务器
        // 由于这是静态网站，我们模拟一个成功提交
        
        // 清除表单
        contactForm.reset();
        
        // 显示成功信息
        alert('感谢您的留言！我会尽快回复。');
    });
}

// 设置平滑滚动
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            window.scrollTo({
                top: targetSection.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // 关闭移动菜单（如果打开）
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // 设置移动菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
} 

// 初始化作品集筛选功能
function initPortfolioFilters() {
    const portfolioFilters = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!portfolioFilters.length || !portfolioItems.length) return;
    
    // 添加筛选器点击事件
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // 移除所有筛选器上的active类
            portfolioFilters.forEach(f => f.classList.remove('active'));
            
            // 给当前点击的筛选器添加active类
            this.classList.add('active');
            
            // 获取筛选类别
            const category = this.getAttribute('data-filter');
            
            // 筛选作品项目
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                // 如果是"全部"类别或项目类别匹配，则显示项目
                if (category === 'all' || category === itemCategory) {
                    // 使用动画显示项目
                    item.style.opacity = '0';
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 300);
                } else {
                    // 隐藏不匹配的项目
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // 默认显示"全部"类别
    const allFilter = document.querySelector('.portfolio-filter[data-filter="all"]');
    if (allFilter) {
        allFilter.click();
    }
} 

// 设置导航栏滚动效果
function setupNavbarScroll() {
    const navbar = document.getElementById('main-nav');
    if (!navbar) return;
    
    // 监听滚动事件
    window.addEventListener('scroll', () => {
        // 如果滚动超过100px，添加类以改变导航栏样式
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 高亮当前活跃的导航项
        updateActiveNavLink();
    });
    
    // 页面加载时也更新一次
    updateActiveNavLink();
}

// 更新当前活跃的导航链接
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 获取当前滚动位置
    const scrollPosition = window.scrollY + 300; // 添加偏移量以提前高亮
    
    // 查找当前在视口中的部分
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // 移除所有导航链接的活跃状态
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // 添加当前部分对应导航链接的活跃状态
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
} 