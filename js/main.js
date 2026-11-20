/**
 * TransEase (透镜) 官网核心交互脚本
 */

document.addEventListener('DOMContentLoaded', () => {
  initInteractiveLens();
  initFAQ();
  initMobileMenu();
  initReservationForm();
});

/**
 * 核心特性：交互式随动透镜模拟器
 */
function initInteractiveLens() {
  const stage = document.getElementById('demoStage');
  const lens = document.getElementById('simLens');
  const origEl = document.getElementById('lensOriginal');
  const transEl = document.getElementById('lensTranslated');

  if (!stage || !lens || !origEl || !transEl) return;

  // 预设不同热区的内容映射
  const snippets = [
    {
      targetId: 'simHeading',
      orig: "DeepSeek-V3 Architecture: Multi-Head Latent Attention and Mixture-of-Experts",
      trans: "DeepSeek-V3 架构演进：多头潜在注意力机制与大规模专家混合架构深度解析"
    },
    {
      targetId: 'simParagraph1',
      orig: "TransEase seamlessly captures and decodes visual framebuffers directly from macOS Display Services without introducing rendering latency.",
      trans: "透镜（TransEase）直接从 macOS 渲染显示服务中捕获帧缓冲并实时解码，全过程零渲染等待，实现真正的无感原位呈现。"
    },
    {
      targetId: 'simCodeBlock',
      orig: "func renderHoverLens(at point: CGPoint) -> NSPanel",
      trans: "函数：在指定光标坐标处动态渲染随动毛玻璃透镜面板（原生 AppKit 无缝穿透）"
    },
    {
      targetId: 'simParagraph2',
      orig: "No copy-pasting required. Simply hover your cursor for 0.18s, and the meaning naturally emerges in place.",
      trans: "告别繁琐的复制与粘贴。只需鼠标悬停停顿 0.18 秒，母语译文在原始位置自然显现。"
    }
  ];

  let isHovering = false;
  let targetX = 120;
  let targetY = 140;
  let currentX = 120;
  let currentY = 140;

  // 绑定内部热区的动态文本变换
  snippets.forEach(item => {
    const el = document.getElementById(item.targetId);
    if (el) {
      el.addEventListener('mouseenter', () => {
        origEl.textContent = item.orig;
        transEl.textContent = item.trans;
      });
    }
  });

  // 监听在 stage 内的光标平滑跟随
  stage.addEventListener('mouseenter', () => {
    isHovering = true;
    lens.style.opacity = '1';
  });

  stage.addEventListener('mouseleave', () => {
    isHovering = false;
    // 回到默认居中位置
    targetX = 60;
    targetY = 120;
  });

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 黄金比例偏移，透镜保持在光标右下，遇右/下边界自适应翻转
    const lensWidth = lens.offsetWidth || 440;
    const lensHeight = lens.offsetHeight || 190;

    let posX = x + 18;
    let posY = y + 18;

    if (posX + lensWidth > rect.width - 20) {
      posX = x - lensWidth - 18;
    }
    if (posY + lensHeight > rect.height - 20) {
      posY = y - lensHeight - 18;
    }

    targetX = Math.max(10, Math.min(posX, rect.width - lensWidth - 10));
    targetY = Math.max(10, Math.min(posY, rect.height - lensHeight - 10));
  });

  // 阻尼缓动循环 (Spring animation)
  function animate() {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;

    lens.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0)`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/**
 * FAQ 展开收起手风琴
 */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // 关闭其他
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // 切换当前
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 移动端抽屉菜单
 */
function initMobileMenu() {
  const toggle = document.getElementById('mobileNavToggle');
  const nav = document.getElementById('siteNav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('nav-open');
  });
}

/**
 * 移动端与全平台内测预约表单
 */
function initReservationForm() {
  const form = document.getElementById('reserveForm');
  const statusEl = document.getElementById('reserveStatus');

  if (!form || !statusEl) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const email = input ? input.value.trim() : '';

    if (!email || !email.includes('@')) {
      statusEl.textContent = '请输入有效的邮箱地址';
      statusEl.style.color = '#f87171';
      return;
    }

    // 本地持久化或记录
    try {
      const list = JSON.parse(localStorage.getItem('transease_reservations') || '[]');
      if (!list.includes(email)) {
        list.push(email);
        localStorage.setItem('transease_reservations', JSON.stringify(list));
      }
    } catch (_) {}

    input.value = '';
    statusEl.textContent = '✓ 预约成功！当 iOS / Android / Windows 测试版发布时，我们将通过邮件第一时间邀请您体验。';
    statusEl.style.color = '#38bdf8';
  });
}
