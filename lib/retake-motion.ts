/** Content stays visible; intersection only starts a one-time 24px upward movement. */
export function initRetakeMotion(root: Element | null) {
  if (!root || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
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
    observer.disconnect();
    for (const element of elements) element.classList.remove('rt-reveal', 'rt-visible');
  };
}
