import React, { useEffect, useRef, useState } from 'react';

interface TableScrollSliderProps {
  /** The horizontally-scrolling element this slider drives. */
  targetRef: React.RefObject<HTMLElement>;
  /** Re-measure when this changes (e.g. the visible column set). */
  deps?: unknown;
}

/**
 * A horizontal scrollbar pinned to the bottom of the viewport, driving a wide
 * table that would otherwise only be scrollable from its own bottom edge —
 * off-screen whenever the list is taller than the window.
 *
 * It is a proxy scroller rather than a range input on purpose: the browser
 * gives us a real draggable thumb, keyboard support and correct thumb sizing
 * for free, and the two elements simply mirror each other's scrollLeft.
 */
const TableScrollSlider: React.FC<TableScrollSliderProps> = ({ targetRef, deps }) => {
  const proxyRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const measure = () => {
      const proxy = proxyRef.current;
      /* Size the proxy's content so its max scroll equals the target's. The
         two viewports differ by a few pixels (the card border, a gutter), and
         without this correction the slider bottoms out before the table has
         reached its last column. */
      const gutter = proxy ? proxy.clientWidth - target.clientWidth : 0;
      setScrollWidth(target.scrollWidth + gutter);
      setOverflows(target.scrollWidth > target.clientWidth + 1);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(target);
    if (target.firstElementChild) observer.observe(target.firstElementChild);

    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
    /* `overflows` is a dependency so the pass that first mounts the proxy is
       followed by a second measure — the initial one runs with proxyRef still
       null and so cannot compute the gutter correction. */
  }, [targetRef, deps, overflows]);

  useEffect(() => {
    const target = targetRef.current;
    const proxy = proxyRef.current;
    if (!target || !proxy) return;

    /* The echo terminates on its own: mirroring writes only when the two
       differ, so the partner's resulting scroll event finds them equal and
       writes nothing back. No lock and no timer — a flag cleared by the echo
       would strand whenever the mirror lands on an identical scrollLeft and
       fires no event at all. */
    const mirror = (from: HTMLElement, to: HTMLElement) => () => {
      if (Math.round(to.scrollLeft) !== Math.round(from.scrollLeft)) {
        to.scrollLeft = from.scrollLeft;
      }
    };

    const onTarget = mirror(target, proxy);
    const onProxy = mirror(proxy, target);

    target.addEventListener('scroll', onTarget, { passive: true });
    proxy.addEventListener('scroll', onProxy, { passive: true });

    proxy.scrollLeft = target.scrollLeft;

    return () => {
      target.removeEventListener('scroll', onTarget);
      proxy.removeEventListener('scroll', onProxy);
    };
  }, [targetRef, overflows]);

  if (!overflows) return null;

  return (
    <div className="sticky bottom-0 z-30 -mx-6 px-6 pb-1 pt-1 bg-surface-page/95 backdrop-blur-sm border-t border-surface-line">
      <div
        ref={proxyRef}
        className="overflow-x-auto overflow-y-hidden h-3 rounded"
        aria-label="Scroll table horizontally"
      >
        <div style={{ width: scrollWidth, height: 1 }} />
      </div>
    </div>
  );
};

export default TableScrollSlider;
