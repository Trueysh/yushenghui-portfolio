// 确保页面内容在加载后显示
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM已加载完成，准备初始化...");
    
    // 检查必要的库是否已加载
    const checkLibraries = () => {
        const threeJsLoaded = typeof THREE !== 'undefined';
        const particlesJsLoaded = typeof particlesJS !== 'undefined';
        const aosLoaded = typeof AOS !== 'undefined';
        
        console.log("库加载状态检查:", {
            "Three.js": threeJsLoaded ? "已加载" : "未加载",
            "Particles.js": particlesJsLoaded ? "已加载" : "未加载",
            "AOS": aosLoaded ? "已加载" : "未加载"
        });
        
        if (!threeJsLoaded || !particlesJsLoaded || !aosLoaded) {
            console.log("等待库加载完成...");
            setTimeout(checkLibraries, 500);
            return;
        }
        
        initializePage();
    };
    
    // 初始化页面
    const initializePage = () => {
        console.log("开始初始化页面...");
        
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
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: false,
                    mirror: false
                });
            }
            
            // 移除自定义光标（如果存在）
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                cursor.style.display = 'none';
            }
            
            // 初始化各功能模块
            console.log("初始化技能进度条...");
            initSkillBars();
            
            console.log("初始化Three.js场景...");
            initThreeScene();
            
            console.log("初始化Particles.js...");
            initParticles();
            
            console.log("设置回到顶部按钮...");
            setupBackToTop();
            
            console.log("设置联系表单...");
            setupContactForm();
            
            console.log("设置导航链接滚动...");
            setupSmoothScroll();
            
            console.log("初始化作品集筛选功能...");
            initPortfolioFilters();
            
            console.log("设置导航栏滚动效果...");
            setupNavbarScroll();
            
            console.log("页面初始化完成!");
        }, 1000);
    };
    
    // 开始检查库是否加载
    checkLibraries();
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
    if (typeof particlesJS !== 'undefined') {
        console.log("正在初始化Particles.js...");
        
        // 检查容器元素是否存在
        const container = document.getElementById('particles-container');
        if (!container) {
            console.error("Particles.js容器元素未找到!");
            return;
        }
        
        try {
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
            console.log("Particles.js初始化成功!");
        } catch (error) {
            console.error("Particles.js初始化失败:", error);
        }
    } else {
        console.error("Particles.js未加载! 请检查脚本引用.");
        
        // 尝试动态加载particles.js
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
        script.onload = function() {
            console.log("Particles.js已动态加载，正在初始化...");
            setTimeout(initParticles, 500); // 重新尝试初始化
        };
        script.onerror = function() {
            console.error("无法动态加载Particles.js!");
        };
        document.head.appendChild(script);
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
    
    // 获取容器元素
    const container = document.getElementById('bg-canvas');
    if (!container) {
        console.error("Three.js container not found");
        return;
    }
    
    // 确保Three.js场景不覆盖内容
    container.style.zIndex = '-12';
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    
    // 创建场景
    const scene = new THREE.Scene();
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    
    // 创建渲染器并明确设置为WebGL
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        canvas: document.createElement('canvas')
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0a192f, 0.3); // 设置背景色为深蓝色，透明度0.3
    
    // 将渲染器的canvas添加到容器中
    container.innerHTML = ''; // 清空容器
    container.appendChild(renderer.domElement);
    
    // 创建星星粒子系统
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0x64ffda,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
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
    scene.add(stars);
    
    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // 添加平行光
    const directionalLight = new THREE.DirectionalLight(0x64ffda, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // 处理窗口大小变化
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // 动画循环
    const animate = () => {
        requestAnimationFrame(animate);
        
        // 旋转星星
        stars.rotation.x += 0.0005;
        stars.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    };
    
    // 启动动画
    animate();
    
    // 返回场景对象以便外部访问
    return { scene, camera, renderer };
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