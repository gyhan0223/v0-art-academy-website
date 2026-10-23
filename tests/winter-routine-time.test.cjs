const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} };
  cache.set(file, module);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('require', 'module', 'exports', source)(
    id => id.startsWith('@/') ? load(`${id.slice(2)}.ts`) : require(id),
    module,
    module.exports,
  );
  return module.exports;
}

const { countCampDays, getGrade11WinterTime } = load('lib/grade11-winter-time.ts');
const { WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE, durationOf } = load('lib/winter-schedule.ts');

test('camp dates include both endpoints across months, leap days and years', () => {
  assert.equal(countCampDays('2027-01-04', '2027-02-26'), 54);
  assert.equal(countCampDays('2027-01-04', '2027-01-04'), 1);
  assert.equal(countCampDays('2028-02-28', '2028-03-01'), 3);
  assert.equal(countCampDays('2027-12-31', '2028-01-01'), 2);
  assert.throws(() => countCampDays('2027-02-26', '2027-01-04'), RangeError);
  assert.throws(() => countCampDays('invalid', '2027-02-26'), RangeError);
});

test('published routine totals agree with both daily schedules and the full 24 hours', () => {
  const time = getGrade11WinterTime();
  assert.equal(time.days, 54);
  assert.equal(time.dailyHours, 16);
  assert.equal(time.totalHours, 864);
  assert.equal(time.sleepHours + time.dailyHours, 24);
  for (const schedule of [WEEKDAY_SCHEDULE, WEEKEND_SCHEDULE]) {
    assert.equal(time.dayStart, schedule[0].start);
    assert.equal(time.dayEnd, schedule[schedule.length - 1].end);
    assert.equal(schedule.reduce((sum, block) => sum + durationOf(block), 0), time.dailyHours * 60);
  }
});
