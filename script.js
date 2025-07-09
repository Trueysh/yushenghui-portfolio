// 确保页面内容在加载后显示
document.addEventListener('DOMContentLoaded', function() {
    // 设置超时，确保所有内容加载后显示
    setTimeout(function() {
        // 移除加载动画
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
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

// 主题切换功能已移除

// 修改Three.js场景初始化，确保不覆盖内容
function initThreeScene() {
    // 获取容器元素并设置正确的z-index
    const container = document.getElementById('bg-canvas');
    if (!container) return;
    
    // 确保Three.js场景不覆盖内容
    container.style.zIndex = '-12';
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    
    // 以下是原始的Three.js初始化代码
    // ... 原有代码 ...
} 