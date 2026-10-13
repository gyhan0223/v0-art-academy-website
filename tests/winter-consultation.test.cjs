const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

function compile(path, dependencies = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => dependencies[name],
    Date,
    AbortSignal,
    console: { error() {} },
    ...globals,
  });
  return exports;
}
const helper = compile("lib/winter-consultation.ts");
const input = {
  name: "테스트 학부모",
  grade: "예비 고3",
  phone: "010-0000-0000",
  university: "",
};
function route(
  fetch,
  env = {
    CONSULT_WEBHOOK_URL: "https://example.invalid/mock",
    CONSULT_WEBHOOK_TOKEN: "test-only",
  },
) {
  return compile(
    "app/api/consult/route.ts",
    {
      "@/lib/winter-consultation": helper,
      "next/server": {
        NextResponse: { json: (body, options) => Response.json(body, options) },
      },
    },
    { fetch, process: { env } },
  );
}
const request = (data) =>
  new Request("http://localhost/api/consult", {
    method: "POST",
    body: JSON.stringify(data),
  });

test("concern, preferred time and target university are optional; legacy requests still work", () => {
  const parsed = helper.parseConsultationInput(input);
  assert.equal(parsed.concern, "");
  assert.equal(parsed.contactTime, "any");
  assert.equal(parsed.phone, "01000000000");
  assert.equal(
    helper.parseConsultationInput({
      ...input,
      concern: "life",
      contactTime: "evening",
    }).concern,
    "life",
  );
});
test("invalid fields and forged concern/time values are rejected", () => {
  for (const invalid of [
    { name: " " },
    { grade: "고4" },
    { phone: "0212345678" },
    { name: {} },
    { university: [] },
    { concern: "forged" },
    { contactTime: "forged" },
  ]) {
    assert.equal(helper.parseConsultationInput({ ...input, ...invalid }), null);
  }
});
test("new context reaches both structured fields and the existing sheet/email field", () => {
  const data = helper.parseConsultationInput({
    ...input,
    concern: "study",
    contactTime: "afternoon",
    university: "홍익대",
  });
  const payload = helper.consultationPayload(data, "test-only");
  assert.equal(payload.universityName, "홍익대");
  assert.equal(payload.phone, "010-0000-0000");
  assert.equal(payload.concernLabel, "학과 성적과 공부 습관");
  assert.match(payload.university, /학과 성적과 공부 습관/);
  assert.match(payload.university, /오후/);
  assert.match(payload.university, /확정 예약 아님/);
});
test("API forwards context and succeeds only on explicit webhook acknowledgement", async () => {
  let delivered;
  const api = route(async (_url, options) => {
    delivered = JSON.parse(options.body);
    return Response.json({ ok: true });
  });
  const response = await api.POST(
    request({ ...input, concern: "life", contactTime: "evening" }),
  );
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(delivered.concern, "life");
  assert.match(delivered.university, /기숙 생활과 안전/);
});
test("HTTP 200 with webhook ok:false is not a successful consultation", async () => {
  const response = await route(async () =>
    Response.json({ ok: false, error: "unauthorized" }),
  ).POST(request(input));
  assert.equal(response.status, 502);
  assert.equal((await response.json()).ok, false);
});
test("non-JSON response and network failure are visible as failures", async () => {
  for (const fetch of [
    async () => new Response("<html>login</html>"),
    async () => {
      throw Error("timeout");
    },
  ]) {
    assert.equal((await route(fetch).POST(request(input))).status, 502);
  }
});
test("missing destination never returns fake success or calls an external service", async () => {
  let called = false;
  const api = route(
    async () => {
      called = true;
    },
    { NODE_ENV: "development" },
  );
  assert.equal((await api.POST(request(input))).status, 500);
  assert.equal(called, false);
});
test("malformed JSON and invalid form do not reach the webhook", async () => {
  let called = false;
  const api = route(async () => {
    called = true;
  });
  assert.equal(
    (
      await api.POST(
        new Request("http://localhost/api/consult", {
          method: "POST",
          body: "{",
        }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await api.POST(request({ ...input, concern: "invalid" }))).status,
    400,
  );
  assert.equal(called, false);
});
