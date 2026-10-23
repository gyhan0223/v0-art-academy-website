const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(window) {
  const exports = {};
  class Element {
    constructor(link) { this.link = link; }
    closest() { return this.link; }
  }
  const context = { exports, URL, Element, window };
  const source = fs.readFileSync('lib/winter-analytics.ts', 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return { ...exports, Element };
}

test('internal winter links and contact channels are distinct; query values never leak', () => {
  const { getWinterLinkEvent: classify } = load();
  const page = 'https://www.modago.me/guide/jungsi-2027?private=value';
  const link = classify('/winter?private=value', page);
  assert.equal(link.event, 'winter_link_click');
  assert.equal(link.target, '/winter');
  assert.equal(classify('/winter/results', page).target, '/winter/results');
  assert.equal(classify('/winter#consult-form', page).action, 'consult_form');
  assert.equal(classify('/booking/winter', page).action, 'naver_booking');
  const winter = 'https://www.modago.me/winter';
  assert.equal(classify('tel:01012345678', winter).target, 'phone');
  assert.equal(classify('sms:01012345678?body=secret', winter).target, 'sms');
  assert.equal(classify('https://talk.naver.com/secret', winter).target, 'naver_talk');
  assert.equal(classify('tel:01012345678', page), null);
  assert.equal(classify('/winter-other', page), null);
  assert.equal(classify('/diagnosis', page), null);
  assert.equal(classify('https://example.com/winter', page), null);
});

test('reading anchors do not inflate winter link clicks; real contact actions still count', () => {
  const { getWinterLinkEvent: classify } = load();
  const page = 'https://www.modago.me/winter/retake';
  for (const href of ['#causes', '#camp', '#routine', '#consult', '#', '/winter/retake#camp']) {
    assert.equal(classify(href, page), null);
  }
  assert.equal(classify('/winter', page).event, 'winter_link_click');
  assert.equal(classify('/booking/winter', page).event, 'winter_contact_click');
  assert.equal(classify('tel:023383302', page).action, 'phone');
  assert.equal(classify('#consult-form', 'https://www.modago.me/winter').action, 'consult_form');
});

test('nested icon clicks use closest placement and fire only one event', () => {
  const calls = [];
  const window = { location: { href: 'https://www.modago.me/guide/jungsi-2027', pathname: '/guide/jungsi-2027' }, gtag: (...args) => calls.push(args) };
  const api = load(window);
  const anchor = { getAttribute: () => '/winter', closest: () => ({ getAttribute: () => 'jungsi_bottom' }) };
  api.handleWinterClick({ type: 'click', button: 0, target: new api.Element(anchor) });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], 'winter_link_click');
  assert.equal(calls[0][2].placement, 'jungsi_bottom');
  assert.equal(calls[0][2].page_path, '/guide/jungsi-2027');
  api.handleWinterClick({ type: 'auxclick', button: 2, target: new api.Element(anchor) });
  assert.equal(calls.length, 1);
  api.handleWinterClick({ type: 'auxclick', button: 1, target: new api.Element(anchor) });
  assert.equal(calls.length, 2);
});

test('tracking failures, missing analytics and malformed links do not break actions', () => {
  const server = load();
  assert.doesNotThrow(() => server.trackWinter('winter_consult_success'));
  const window = { location: { href: 'https://www.modago.me/winter', pathname: '/winter' } };
  const api = load(window);
  assert.doesNotThrow(() => api.trackWinter('winter_consult_success'));
  window.gtag = () => { throw Error('analytics blocked'); };
  assert.doesNotThrow(() => api.trackWinter('winter_consult_success'));
  const anchor = { getAttribute: () => 'https://[invalid', closest: () => null };
  assert.doesNotThrow(() => api.handleWinterClick({ type: 'click', target: new api.Element(anchor) }));
});
