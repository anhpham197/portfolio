import React, { useEffect, useState } from 'react';

export const welcomeCopy = { title: "Hi, I'm Anh.", description: 'Welcome to my little corner!' };
export const typingInterval = 40;

function TypedLine({ tag: Tag, id, text, count, cursor }) {
  return <Tag id={id} className="welcome-type-line">
    {/* Reserve the final layout and expose the complete text to assistive tech. */}
    <span className="welcome-status welcome-type-accessible">{text}</span>
    <span className="welcome-type-reserve" aria-hidden="true">{text}</span>
    <span className="welcome-type-visible" aria-hidden="true">{text.slice(0, count)}{cursor && <i className="welcome-type-caret"/>}</span>
  </Tag>;
}

export default function WelcomeTypewriter({ active, paused, reducedMotion, onComplete }) {
  const [characters, setCharacters] = useState(0);
  const titleLength = welcomeCopy.title.length;
  const total = titleLength + welcomeCopy.description.length;
  const displayed = active && reducedMotion ? total : characters;

  useEffect(() => {
    if (!active) return;
    if (reducedMotion) { setCharacters(total); return; }
    if (paused || characters >= total) return;
    if (characters === 0) { setCharacters(1); return; }
    const timer = setTimeout(() => setCharacters(count => Math.min(count + 1, total)), typingInterval);
    return () => clearTimeout(timer);
  }, [active, paused, reducedMotion, characters, total]);

  useEffect(() => {
    if (active && displayed >= total) onComplete?.();
  }, [active, displayed, total, onComplete]);

  const typing = active && !reducedMotion && displayed < total;
  return <>
    <TypedLine tag="h2" id="welcome-title" text={welcomeCopy.title} count={Math.min(displayed, titleLength)} cursor={typing && displayed < titleLength}/>
    <TypedLine tag="p" id="welcome-description" text={welcomeCopy.description} count={Math.max(0, displayed - titleLength)} cursor={typing && displayed >= titleLength}/>
  </>;
}
