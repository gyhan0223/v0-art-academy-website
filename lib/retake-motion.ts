/** Content stays visible; intersection only starts a one-time 24px upward movement. */
export function initRetakeMotion(root: Element | null) {
  if (!root) return () => {};
  const action = root.querySelector<HTMLElement>('.rt-mobile-action[data-show-after]');
  const checkpoint = action?.dataset.showAfter;
  const section = checkpoint ? root.querySelector(`#${checkpoint}`) : null;
  const updateAction = () => {
    if (action && section) action.classList.toggle('rt-action-ready', section.getBoundingClientRect().top <= window.innerHeight * 0.65);
  };
  if (section) {
    updateAction();
    window.addEventListener('scroll', updateAction, { passive: true });
    window.addEventListener('resize', updateAction);
  }
  const cleanAction = () => {
    window.removeEventListener('scroll', updateAction);
    window.removeEventListener('resize', updateAction);
    action?.classList.remove('rt-action-ready');
  };
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return cleanAction;
  const selectors = '.rt-hero-copy > *, .rt-plan-visual, .rt-section-heading, .rt-centered, .rt-case-layout > *, .rt-concern, .rt-method-row, .rt-report-layout > *, .rt-day, .rt-eight-weeks, .rt-life-clock, .rt-life-flow > *, .rt-camp-layout > *, .rt-consult-layout > *';
  const elements = Array.from(root.querySelectorAll<HTMLElement>(selectors));
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('rt-reveal', 'rt-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.2 });
  for (const element of elements) {
    observer.observe(element);
  }
  return () => {
    cleanAction();
    observer.disconnect();
    for (const element of elements) element.classList.remove('rt-reveal', 'rt-visible');
  };
}
