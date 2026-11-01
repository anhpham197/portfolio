import { useEffect, useState } from 'react';

export function getActiveSection(sections, { scrollY, viewportHeight, documentHeight, offset = 120 }) {
  if (!sections.length) return '';
  const last = sections[sections.length - 1];
  // The final section may be too short to reach the activation line above it.
  if (documentHeight > viewportHeight && scrollY + viewportHeight >= documentHeight - 2 && last.top < scrollY + viewportHeight) return last.id;
  let active = '';
  for (const section of sections) {
    if (section.top > scrollY + offset) break;
    active = section.id;
  }
  return active;
}

export default function useActiveSection(sectionIds) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    let frame = 0;
    let settleTimer;
    let destination = null;

    const update = () => {
      frame = 0;
      if (destination !== null) return;
      const scrollY = window.scrollY;
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
      const anchorPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      setActive(getActiveSection(sections.map(section => ({ id: section.id, top: section.getBoundingClientRect().top + scrollY })), {
        scrollY,
        viewportHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight,
        offset: Math.max(headerHeight + 24, anchorPadding + 8),
      }));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const settle = () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => { destination = null; schedule(); }, 160);
    };
    const select = id => {
      destination = id;
      setActive(id);
      settle();
    };
    const onScroll = () => {
      if (destination !== null) settle();
      schedule();
    };
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (!id || sectionIds.includes(id)) select(id);
      else { destination = null; schedule(); }
    };
    const onAnchorClick = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || (link.target && link.target !== '_self')) return;
      const id = link.getAttribute('href').slice(1);
      if (!id || sectionIds.includes(id)) select(id);
    };
    const onResize = () => { destination = null; schedule(); };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('hashchange', onHashChange);
    document.addEventListener('click', onAnchorClick);
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    const main = document.querySelector('main');
    if (main) resizeObserver?.observe(main);
    if (window.location.hash) onHashChange();
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('hashchange', onHashChange);
      document.removeEventListener('click', onAnchorClick);
    };
  }, [sectionIds]);

  return active;
}
