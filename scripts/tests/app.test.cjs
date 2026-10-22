
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("Student Management app renders its dashboard and sample records", () => {
  const appPath = path.join(
    __dirname,
    "../../artifacts/student-management/app.js"
  );

  const source = fs.readFileSync(appPath, "utf8");

  const appElement = {
    innerHTML: "",
    addEventListener() {},
  };

  const storage = new Map();

  const context = {
    console,
    Date,
    Intl,
    URLSearchParams,
    FormData: class {},
    Blob,
    URL,
    setTimeout,
    clearTimeout,
    location: {
      pathname: "/",
      search: "",
    },
    history: {
      pushState() {},
      replaceState() {},
    },
    localStorage: {
      getItem(key) {
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
    },
    document: {
      documentElement: {
        classList: {
          toggle() {},
        },
      },
      querySelector(selector) {
        if (selector === "#app") return appElement;
        return null;
      },
      addEventListener() {},
    },
    window: {
      addEventListener() {},
    },
  };

  vm.runInNewContext(source, context, {
    filename: "app.js",
  });

  assert.match(appElement.innerHTML, /Campus Desk/);
  assert.match(appElement.innerHTML, /Total students/);
  assert.match(appElement.innerHTML, /Aarav Sharma/);
  assert.match(appElement.innerHTML, /Students by department/);
});
