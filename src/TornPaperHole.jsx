import React, { useId } from 'react';

// Separate back and front rims let the character rise behind the torn paper.
export default function TornPaperHole({ front = false }) {
  const id = useId();
  return <svg className={`welcome-hole ${front ? 'welcome-hole-front' : 'welcome-hole-back'}`} viewBox="0 0 400 200" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-paper`} x1="0" y1="0" x2=".8" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#fffdfd"/><stop offset="1" stopColor="#f1dce7"/></linearGradient>
      <radialGradient id={`${id}-depth`}><stop stopColor="#18141e"/><stop offset="1" stopColor="#583044"/></radialGradient>
    </defs>
    {front ? <>
      <path d="M38 111 70 119 91 107 121 129 145 114 176 132 200 119 226 132 253 115 281 128 306 110 333 122 358 108 340 132 357 163 316 156 303 188 270 171 242 193 218 170 187 191 167 168 128 185 112 160 73 175 75 144 38 141 58 123Z" fill={`url(#${id}-paper)`} stroke="#8e6575" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="m70 119 5 25 16-37m30 22 7 56 17-71m31 18 11 59 13-72m26 13 16 61 11-78m28 13 22 60 3-78m27 12 24 41-17-31" fill="none" stroke="#d2aabb" strokeWidth="2" strokeLinejoin="round"/>
    </> : <>
      <path d="M54 86 23 67 54 60 37 30 85 43 99 14 128 37 156 8 176 35 204 18 222 40 254 20 269 51 310 35 313 65 353 59 338 91 379 112 340 132 357 163 316 156 303 188 270 171 242 193 218 170 187 191 167 168 128 185 112 160 73 175 75 144 38 141 58 114 22 100Z" fill={`url(#${id}-paper)`} stroke="#8e6575" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M60 99 75 79 112 69 151 57 184 62 217 55 248 69 286 72 320 91 336 111 312 128 276 142 239 145 203 151 164 143 129 147 91 129 67 119Z" fill={`url(#${id}-depth)`} stroke="#6d4356" strokeWidth="2"/>
      <path d="m54 60 21 19 10-36m43-6 23 20 5-49m48 10 13 37 37-35m56 15-24 37 27-7m25 26-18 0 33-32M54 86l21-7m263 12-2 20" fill="none" stroke="#d2aabb" strokeWidth="2" strokeLinejoin="round"/>
    </>}
  </svg>;
}
