import React, { useEffect, useId, useRef, useState } from 'react';
import { Button } from 'antd';
import { PauseOutlined, CaretRightOutlined, ReloadOutlined } from '@ant-design/icons';
import { numberlinkPuzzle, numberlinkTiming, pathProgress } from './numberlink';

const { size, paths } = numberlinkPuzzle;
const cellSize = 50;
const padding = 18;
const center = value => padding + cellSize * (value + 0.5);
const pathData = cells => cells.map(([x, y], i) => `${i ? 'L' : 'M'}${center(x)},${center(y)}`).join(' ');

export default function NumberlinkAnimation() {
  const figureRef = useRef(null);
  const pathRefs = useRef([]);
  const elapsedRef = useRef(0);
  const completedRef = useRef(-1);
  const titleId = useId();
  const descriptionId = useId();
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');
  const [completed, setCompleted] = useState(() => reducedMotion ? paths.length : 0);
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(figureRef.current);
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible');
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => {
      elapsedRef.current = 0;
      setReducedMotion(media.matches);
    };
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', onMotion);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', onMotion);
    };
  }, []);

  useEffect(() => {
    let frame;
    let lastTimestamp;
    const paint = elapsed => {
      let count = 0;
      paths.forEach((path, index) => {
        const progress = reducedMotion ? 1 : pathProgress(elapsed, index);
        if (progress === 1) count++;
        if (pathRefs.current[index]) pathRefs.current[index].style.strokeDashoffset = String(1 - progress);
      });
      if (completedRef.current !== count) {
        completedRef.current = count;
        setCompleted(count);
      }
    };
    paint(elapsedRef.current);
    if (reducedMotion || !playing || !inView || !pageVisible) return;
    const tick = timestamp => {
      if (lastTimestamp !== undefined) {
        elapsedRef.current = (elapsedRef.current + timestamp - lastTimestamp) % numberlinkTiming.cycleDuration;
      }
      lastTimestamp = timestamp;
      paint(elapsedRef.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, playing, inView, pageVisible, replay]);

  const restart = () => {
    elapsedRef.current = 0;
    setPlaying(true);
    setReplay(value => value + 1);
  };

  return <figure className="numberlink" ref={figureRef} data-completed={completed} data-playing={playing && inView && pageVisible && !reducedMotion}>
    <div className="numberlink-heading"><span>NUMBERLINK</span><span>{size} × {size} · {paths.length} pairs</span></div>
    <svg className="numberlink-board" viewBox="0 0 336 336" role="img" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <title id={titleId}>Numberlink solution walkthrough</title>
      <desc id={descriptionId}>Four pairs of matching numbers are connected on a six by six grid. The paths cover all 36 cells without overlapping. This example comes from the research dataset.</desc>
      <rect x={padding} y={padding} width={cellSize * size} height={cellSize * size} rx="12" fill="#fff" stroke="#e9dfe3"/>
      {Array.from({ length: size - 1 }, (_, i) => {
        const position = padding + cellSize * (i + 1);
        return <path key={i} d={`M${position},${padding}V${padding + cellSize * size}M${padding},${position}H${padding + cellSize * size}`} stroke="#f0e9ec" fill="none"/>;
      })}
      {paths.map((path, index) => <path key={path.number} ref={node => { pathRefs.current[index] = node; }} className="numberlink-path" d={pathData(path.cells)} pathLength="1" fill="none" stroke={path.color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1" style={{ strokeDashoffset: reducedMotion ? 0 : 1 }}/>) }
      {paths.flatMap(path => [path.cells[0], path.cells[path.cells.length - 1]].map(([x, y], index) => <g key={`${path.number}-${index}`}>
        <circle cx={center(x)} cy={center(y)} r="15" fill={path.color} stroke="#fff" strokeWidth="3"/>
        <text x={center(x)} y={center(y)} dy="0.35em" fill="#fff" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif">{path.number}</text>
      </g>))}
    </svg>
    <div className="numberlink-toolbar">
      <span className="numberlink-progress" aria-hidden="true">{completed === paths.length ? 'All pairs connected' : `${completed} of ${paths.length} pairs connected`}</span>
      {!reducedMotion && <div className="numberlink-controls">
        <Button size="small" type="text" icon={playing ? <PauseOutlined/> : <CaretRightOutlined/>} onClick={() => setPlaying(value => !value)} aria-label={`${playing ? 'Pause' : 'Play'} Numberlink animation`}>{playing ? 'Pause' : 'Play'}</Button>
        <Button size="small" type="text" icon={<ReloadOutlined/>} onClick={restart} aria-label="Replay Numberlink animation">Replay</Button>
      </div>}
    </div>
    <figcaption>Match the numbers. Fill every cell without crossing paths.<span>A solution walkthrough from my research dataset.</span></figcaption>
  </figure>;
}
