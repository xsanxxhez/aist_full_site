

  // Инициализация GSAP анимаций
  document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления элементов при скролле
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.hero-title span, .hero-subtitle, .hero-cta').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top 80%'
        }
      });
    });

    gsap.utils.toArray('.feature-card').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.6,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%'
        }
      });
    });

    // Анимация счетчиков
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      const count = +counter.innerText;
      const increment = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCounter, 1);
      } else {
        counter.innerText = target;
      }

      function updateCounter() {
        const count = +counter.innerText;
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(updateCounter, 1);
        } else {
          counter.innerText = target;
        }
      }

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        onEnter: updateCounter
      });
    });
  });

// Замените particles.js в script.js
document.addEventListener('DOMContentLoaded', function() {
  const rainContainer = document.createElement('div');
  rainContainer.className = 'digital-rain';
  document.body.prepend(rainContainer);
