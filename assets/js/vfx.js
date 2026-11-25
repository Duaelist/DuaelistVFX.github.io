(function () {
  'use strict';
  var root = document.documentElement;
  var toggle = document.querySelector('[data-anim-toggle]');
  var KEY = 'vfx-animation';
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var videos = [].slice.call(document.querySelectorAll('.panel__media video'));
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  var ticking = false;
  
  videos.forEach(function (v) {
    v.addEventListener('playing', function () { v.classList.add('is-playing'); });
    v.addEventListener('pause', function () { v.classList.remove('is-playing'); });
  });

  // Parallax: each panel's media drifts slightly against the scroll while ANIMATION is ON.
  function parallax() {
    ticking = false;
    var on = root.getAttribute('data-animation') === 'on' && !reduced;
    panels.forEach(function (p) {
      var media = p.querySelector('.panel__media');
      if (!media) return;
      if (!on) { media.style.transform = ''; return; }
      var r = p.getBoundingClientRect();
      var offset = (r.top + r.height / 2 - window.innerHeight / 2) * 0.08;
      media.style.transform = 'translate3d(0,' + (-offset).toFixed(1) + 'px,0)';
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(parallax); }
  }

  function apply(on) {
    root.setAttribute('data-animation', on ? 'on' : 'off');
    if (toggle) {
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      toggle.textContent = toggle.getAttribute(on ? 'data-label-on' : 'data-label-off');
    }
    videos.forEach(function (v) {
      if (on) {
        if (!v.getAttribute('src') && v.getAttribute('data-src')) v.setAttribute('src', v.getAttribute('data-src'));
        var p = v.play();
        if (p && p.catch) p.catch(function () { });
      } else {
        v.pause();
      }
    });
    parallax();
  }

  var saved = false;
  try { saved = localStorage.getItem(KEY) === 'on'; } catch (e) { }
  apply(saved);

  if (toggle) {
    toggle.addEventListener('click', function () {
      var on = root.getAttribute('data-animation') !== 'on';
      try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) { }
      apply(on);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
