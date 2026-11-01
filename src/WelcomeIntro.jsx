import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { assetPath } from './assets';
import TornPaperHole from './TornPaperHole';

export const welcomeStorageKey = 'anh-portfolio.welcome.v6';
export const welcomeQuote = "Hi, I'm Anh. Welcome to my little corner!";
export const welcomeTiming = { artwork: 4800, speech: 700, loadingLimit: 10000, exit: 380 };

export function shouldShowWelcome() {
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
  const [speechVisible, setSpeechVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const dialogRef = useRef(null);
  const imageRef = useRef(null);
  const letteringRef = useRef(null);
  const enterRef = useRef(null);
  const artworkRemainingRef = useRef(welcomeTiming.artwork + 100);
  const dismiss = useCallback(() => {
    if (!speechVisible) return;
    try { sessionStorage.setItem(welcomeStorageKey, 'seen'); } catch { /* Storage may be disabled. */ }
    setClosing(true);
  }, [speechVisible]);
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
    dialog.focus({ preventScroll: true });
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
    if (imageFailed || (ready && reducedMotion)) setSpeechVisible(true);
  }, [imageFailed, ready, reducedMotion]);

  // A failed/blocked image must not leave visitors waiting without an entry button.
  useEffect(() => {
    if (!visible || ready || speechVisible || !pageVisible) return;
    const timer = setTimeout(() => {
      setImageFailed(true);
      setSpeechVisible(true);
    }, welcomeTiming.loadingLimit);
    return () => clearTimeout(timer);
  }, [visible, ready, speechVisible, pageVisible]);

  // The final sparkle normally signals completion. This fallback also covers
  // browsers/extensions that suppress animationend, and pauses with a hidden tab.
  useEffect(() => {
    if (!visible || !ready || speechVisible || !pageVisible || reducedMotion || imageFailed) return;
    const started = performance.now();
    const timer = setTimeout(() => setSpeechVisible(true), artworkRemainingRef.current);
    return () => {
      clearTimeout(timer);
      artworkRemainingRef.current = Math.max(0, artworkRemainingRef.current - (performance.now() - started));
    };
  }, [visible, ready, speechVisible, pageVisible, reducedMotion, imageFailed]);

  useEffect(() => {
    if (visible && speechVisible) enterRef.current?.focus({ preventScroll: true });
  }, [visible, speechVisible]);

  useEffect(() => {
    if (!visible || !closing) return;
    const timer = setTimeout(finish, reducedMotion ? 0 : welcomeTiming.exit);
    return () => clearTimeout(timer);
  }, [visible, closing, reducedMotion, finish]);

  if (!visible) return null;

  const classes = ['welcome-intro', ready && 'is-ready', speechVisible && 'is-speech-visible is-art-complete', closing && 'is-closing', reducedMotion && 'is-reduced', !pageVisible && 'is-away', imageFailed && 'is-image-failed'].filter(Boolean).join(' ');
  return <dialog ref={dialogRef} className={classes} tabIndex={-1} aria-label={speechVisible ? undefined : "Welcome to Anh's portfolio"} aria-labelledby={speechVisible ? 'welcome-title' : undefined} aria-describedby={speechVisible ? 'welcome-description' : 'welcome-progress'} style={{ '--welcome-speech-duration': `${welcomeTiming.speech}ms` }} onCancel={event => event.preventDefault()}>
    {!speechVisible && <p id="welcome-progress" className="welcome-status" role="status">A little hello is on its way.</p>}
    <div className="welcome-stage">
      {!imageFailed && <div className="welcome-art" aria-hidden="true" onAnimationEnd={event => {
        if (ready && !speechVisible && event.animationName === 'welcome-sparkle' && event.target.classList.contains('sparkle-three')) setSpeechVisible(true);
      }}>
        <div className="welcome-art-inner">
          {!letteringFailed && <div className="welcome-hola"><img ref={letteringRef} src={assetPath('welcome/hola-spaced-soft-pink.png')} alt="" width="2172" height="724" loading="eager" fetchPriority="high" onLoad={() => setLetteringReady(true)} onError={() => { setLetteringFailed(true); setLetteringReady(true); }}/></div>}
          <div className="welcome-portal">
            <TornPaperHole/>
            <div className="welcome-portal-viewport"><div className="welcome-emergence-window">
              {/* Clipped copies share one cached image and let the hands wave independently. */}
              <div className="welcome-panther">
                <img className="welcome-panther-body" ref={imageRef} src={assetPath('welcome/pink-panther-soft-pink.png')} alt="" width="1618" height="972" loading="eager" fetchPriority="high" onLoad={() => setPantherReady(true)} onError={() => { setImageFailed(true); setPantherReady(true); setLetteringReady(true); }}/>
                <img className="welcome-panther-hand hand-left" src={assetPath('welcome/pink-panther-soft-pink.png')} alt="" width="1618" height="972"/>
                <img className="welcome-panther-hand hand-right" src={assetPath('welcome/pink-panther-soft-pink.png')} alt="" width="1618" height="972"/>
              </div>
            </div></div>
            <TornPaperHole front/>
          </div>
        </div>
        <div className="welcome-sparkles">{['one', 'two', 'three'].map(position => <svg key={position} className={`welcome-sparkle sparkle-${position}`} viewBox="0 0 24 24"><path d="M12 1 15 9 23 12 15 15 12 23 9 15 1 12 9 9Z"/></svg>)}</div>
      </div>}
      <div className="welcome-speech" aria-hidden={!speechVisible} inert={!speechVisible}>
        <h2 id="welcome-title">Hi, I'm Anh.</h2>
        <p id="welcome-description">Welcome to my little corner!</p>
        <Button ref={enterRef} type="primary" size="large" className="welcome-enter" disabled={!speechVisible} onClick={dismiss}>Come on in <ArrowRightOutlined aria-hidden="true"/></Button>
      </div>
    </div>
  </dialog>;
}
