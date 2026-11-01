import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined, CloseOutlined } from '@ant-design/icons';
import { assetPath } from './assets';

export const welcomeStorageKey = 'anh-portfolio.welcome.v1';
export const welcomeQuote = "Hi, I'm Anh. Welcome to my little corner!";
export const welcomeTiming = { reading: 4800, exit: 380, maximum: 10000 };

export function shouldShowWelcome() {
  if (window.location.hash) return false;
  try { return sessionStorage.getItem(welcomeStorageKey) !== 'seen'; }
  catch { return true; }
}

export default function WelcomeIntro() {
  const [visible, setVisible] = useState(shouldShowWelcome);
  const [ready, setReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [closing, setClosing] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dialogRef = useRef(null);
  const imageRef = useRef(null);
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
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) setReady(true);
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
      {!imageFailed && <div className="welcome-art" aria-hidden="true"><div className="welcome-art-inner"><img ref={imageRef} src={assetPath('welcome/pink-panther.png')} alt="" width="1150" height="1368" loading="eager" fetchPriority="high" onLoad={() => setReady(true)} onError={() => { setImageFailed(true); setReady(true); }}/></div></div>}
      <div className="welcome-speech">
        <h2 id="welcome-title">Hi, I'm Anh.</h2>
        <p id="welcome-description">Welcome to my little corner!</p>
        <Button ref={enterRef} type="primary" size="large" className="welcome-enter" disabled={!ready} onClick={dismiss}>Come on in <ArrowRightOutlined aria-hidden="true"/></Button>
      </div>
    </div>
  </dialog>;
}
