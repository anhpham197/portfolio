import test from 'node:test';
import assert from 'node:assert/strict';
import { getActiveSection } from '../src/useActiveSection.js';

const sections = [
  { id: 'experience', top: 800 },
  { id: 'expertise', top: 2000 },
  { id: 'education', top: 3000 },
  { id: 'about', top: 4300 },
  { id: 'contact', top: 5200 },
];
const page = { viewportHeight: 900, documentHeight: 5550, offset: 120 };

test('Contact stays selected at the page bottom even when it cannot reach the header', () => {
  assert.equal(getActiveSection(sections, { ...page, scrollY: 4650 }), 'contact');
  assert.equal(getActiveSection(sections, { ...page, viewportHeight: 1200, scrollY: 4350 }), 'contact');
});

test('ordinary scrolling follows the section below the header and leaves the hero unselected', () => {
  assert.equal(getActiveSection(sections, { ...page, scrollY: 0 }), '');
  assert.equal(getActiveSection(sections, { ...page, scrollY: 1900 }), 'expertise');
  assert.equal(getActiveSection(sections, { ...page, scrollY: 4500 }), 'about');
});

test('bottom detection allows fractional pixels without switching Contact on too early', () => {
  assert.equal(getActiveSection(sections, { ...page, scrollY: 4648.5 }), 'contact');
  assert.equal(getActiveSection(sections, { ...page, scrollY: 4640 }), 'about');
});

test('anchor offsets and a taller Contact section activate their actual target', () => {
  assert.equal(getActiveSection(sections, { ...page, offset: 108, scrollY: 2900 }), 'education');
  assert.equal(getActiveSection(sections, { ...page, documentHeight: 7000, scrollY: 5100 }), 'contact');
});

test('missing sections and a short unscrolled page do not force the last item active', () => {
  assert.equal(getActiveSection([], { ...page, scrollY: 0 }), '');
  assert.equal(getActiveSection(sections, { ...page, viewportHeight: 6000, scrollY: 0 }), '');
});
