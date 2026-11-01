import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined, CloseOutlined } from '@ant-design/icons';
import { assetPath } from './assets';

export const welcomeStorageKey = 'anh-portfolio.welcome.v3';
export const welcomeQuote = "Hi, I'm Anh. Welcome to my little corner!";
export const welcomeTiming = { reading: 4800, exit: 380, maximum: 10000 };

export function shouldShowWelcome() {
  if (window.location.hash) return false;
  try { return sessionStorage.getItem(welcomeStorageKey) !== 'seen'; }
  catch { return true; }
}

export default function WelcomeIntro() {
  const [visible, setVisible] = useState(shouldShowWelcome);
  const [pantherReady, setPantherReady] = useState(false);
  const [letteringReady, setLetteringReady] = useState(false);
  const [letteringFailed, setLetteringFailed] = useState(false);
  const ready = pantherReady && letteringReady;
  const [imageFailed, setImageFailed] = useState(false);
  const [closing, setClosing] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dialogRef = useRef(null);
  const imageRef = useRef(null);
  const letteringRef = useRef(null);
  const enterRef = useRef(null);
  const skipRef = useRef(null);
  const dismiss = useCallback(() => setClosing(true), []);
  const finish = useCallback(() => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setVisible(false);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    if (!visible) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    skipRef.current?.focus({ preventScroll: true });
    try { sessionStorage.setItem(welcomeStorageKey, 'seen'); } catch { /* Storage may be disabled. */ }
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) setPantherReady(true);
    if (letteringRef.current?.complete && letteringRef.current.naturalWidth > 0) setLetteringReady(true);
    return () => {
      if (dialog.open) dialog.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [visible]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(media.matches);
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible');
    media.addEventListener('change', onMotion);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      media.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!visible || !ready || closing) return;
    enterRef.current?.focus({ preventScroll: true });
  }, [visible, ready, closing]);

  useEffect(() => {
    if (!visible || !ready || closing || !pageVisible || !autoAdvance) return;
    const timer = setTimeout(dismiss, welcomeTiming.reading);
    return () => clearTimeout(timer);
  }, [visible, ready, closing, pageVisible, autoAdvance, dismiss]);

  useEffect(() => {
    if (!visible || closing || !pageVisible || !autoAdvance) return;
    const timer = setTimeout(dismiss, welcomeTiming.maximum);
    return () => clearTimeout(timer);
  }, [visible, closing, pageVisible, autoAdvance, dismiss]);

  useEffect(() => {
    if (!visible || !closing) return;
    const timer = setTimeout(finish, reducedMotion ? 0 : welcomeTiming.exit);
    return () => clearTimeout(timer);
  }, [visible, closing, reducedMotion, finish]);

  if (!visible) return null;

  const classes = ['welcome-intro', ready && 'is-ready', closing && 'is-closing', reducedMotion && 'is-reduced', !pageVisible && 'is-away', imageFailed && 'is-image-failed'].filter(Boolean).join(' ');
  return <dialog ref={dialogRef} className={classes} aria-labelledby="welcome-title" aria-describedby="welcome-description" aria-busy={!ready} onCancel={event => { event.preventDefault(); dismiss(); }} onKeyDown={() => setAutoAdvance(false)}>
    <Button ref={skipRef} type="text" className="welcome-skip" onClick={dismiss} aria-label="Skip welcome intro">Skip intro <CloseOutlined aria-hidden="true"/></Button>
    <div className="welcome-stage">
      {!imageFailed && <div className="welcome-art" aria-hidden="true">
        <div className="welcome-art-inner">
          {!letteringFailed && <div className="welcome-hola"><img ref={letteringRef} src={assetPath('welcome/hola-lettering.png')} alt="" width="2081" height="755" loading="eager" fetchPriority="high" onLoad={() => setLetteringReady(true)} onError={() => { setLetteringFailed(true); setLetteringReady(true); }}/></div>}
          {/* Clipped copies share one cached image and let the hands wave independently. */}
          <div className="welcome-panther">
            <img className="welcome-panther-body" ref={imageRef} src={assetPath('welcome/pink-panther-hola.png')} alt="" width="1618" height="972" loading="eager" fetchPriority="high" onLoad={() => setPantherReady(true)} onError={() => { setImageFailed(true); setPantherReady(true); setLetteringReady(true); }}/>
            <img className="welcome-panther-hand hand-left" src={assetPath('welcome/pink-panther-hola.png')} alt="" width="1618" height="972"/>
            <img className="welcome-panther-hand hand-right" src={assetPath('welcome/pink-panther-hola.png')} alt="" width="1618" height="972"/>
          </div>
        </div>
        <div className="welcome-sparkles">{['one', 'two', 'three'].map(position => <svg key={position} className={`welcome-sparkle sparkle-${position}`} viewBox="0 0 24 24"><path d="M12 1 15 9 23 12 15 15 12 23 9 15 1 12 9 9Z"/></svg>)}</div>
      </div>}
      <div className="welcome-speech">
        <h2 id="welcome-title">Hi, I'm Anh.</h2>
        <p id="welcome-description">Welcome to my little corner!</p>
        <Button ref={enterRef} type="primary" size="large" className="welcome-enter" disabled={!ready} onClick={dismiss}>Come on in <ArrowRightOutlined aria-hidden="true"/></Button>
      </div>
    </div>
  </dialog>;
}
