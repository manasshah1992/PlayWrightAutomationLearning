# PlayWright Automation Learning - AI Coding Instructions

## Project Overview
This is a Playwright e-commerce automation test suite demonstrating multiple testing frameworks and patterns. Tests target `https://rahulshettyacademy.com/client/` (a demo e-commerce app) and verify end-to-end workflows including login, product search, cart management, and order placement.

**Key Supported Testing Patterns:**
- Pure Playwright E2E tests with direct page interaction
- Page Object Model (POM) for maintainability
- API-first testing (API calls + browser verification)
- BDD/Cucumber with Gherkin feature files
- Parallel language support: JavaScript (CommonJS) and TypeScript

## Architecture

### Test Organization

```
tests/                      # Playwright spec files (.spec.js, .spec.ts)
├── LoginWithE2E.spec.js          # Direct page interaction tests
├── LoginWithE2EAPI.spec.js       # API-driven tests with browser verification
├── LoginWithE2EPageObject.spec.js # Tests using POM layer
└── demo.js                        # Standalone test examples

PageObjects/                # JavaScript class-based page objects (CommonJS)
└── LoginPage.js, DashBoardPage.js, CartPage.js, etc.

PageObjects_ts/             # TypeScript versions of same POM classes
└── LoginPage.ts, DashBoardPage.ts, etc.

features/                   # Cucumber/Gherkin feature files
├── Ecommerce.feature       # BDD scenarios
└── step_definitions/steps.js    # Glue code mapping Gherkin to POM classes

utils/                      # JavaScript utilities
└── APIUtils.js             # Authentication & order API helpers
```

### Critical Data Flow

**E2E Test Pattern (Playwright → Page → Assertions):**
```
test → page.goto() → locators (CSS/XPath) → actions (click, fill) → expectations
```

**API-First Pattern (API → Browser):**
```
beforeAll: APIUtils.createOrder() → stores token & orderId
test: page.addInitScript() injects token to localStorage → page.goto() → verification
```

**BDD Pattern (Cucumber → Page Objects):**
```
Feature file (Gherkin) → Step definitions → Create Page Object instance → Invoke POM methods
```

## Key Patterns & Conventions

### 1. Page Object Model
- **JavaScript**: Class constructor receives `page` parameter, stores as `this.page`
- **TypeScript**: Explicit `Locator` and `Page` type imports from `@playwright/test`
- **Method naming**: POM methods are domain-specific (e.g., `searchProductAddToCart`, `fillandVerifyCheckoutDetails`)
- **Selector storage**: Locators defined in constructor as instance properties

**Example (JS):**
```javascript
class LoginPage {
    constructor(page) {
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
        this.signInButton = page.locator("[type='submit']");
        this.page = page;
    }
    async validLogin(username, password) {
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}
```

### 2. Locator Strategy
- **CSS selectors preferred** for most elements: `"#userEmail"`, `"[type='submit']"`, `".card-body"`
- **Attribute + text matchers** for flexible selection: `"[routerlink*='cart']"` (partial match), `"text=Add To Cart"` (exact text)
- **Chaining**: `products.nth(i).locator("b")` for nested element access
- **Waiters**: `waitForLoadState('networkidle')` for navigation, `locator().waitFor()` for element visibility

### 3. Test Tags & Filtering
Tests use Playwright tags for categorization:
- `@Regression` - full regression suite
- `@Smoke` - critical smoke tests
- `@API` - API-focused tests
- `@cucumber` - BDD/Cucumber tests

**Run by tag:**
```bash
npm run Regression    # runs @Regression tests
npm run smokeTest     # runs @Smoke tests
npm run API           # runs @API tests
npm run cucumber      # runs Cucumber tests
```

### 4. API Testing Pattern
`APIUtils` class manages authentication and order creation:
```javascript
const apiUtils = new APIUtils(apiContext, {userEmail: "...", userPassword: "..."});
const response = await apiUtils.createOrder(orderPayload);
// response = {token: "...", orderId: "..."}
```

**Token Injection Pattern**: Bypass login UI by injecting token to localStorage:
```javascript
await page.addInitScript(value => {
    window.localStorage.setItem("token", value);
}, response.token);
```

### 5. Timeout Management
- **Test-level**: 50,000ms (explicit in `playwright.config.js`)
- **Assertion-level**: 5,000ms for `expect()`
- **Cucumber steps**: 100,000ms override when needed (e.g., checkout)
- **Element wait**: `locator().waitFor()` respects assertion timeout

### 6. Browser & Device Configurations
- **Primary config** (`playwright.config.js`): Chromium, headless, screenshots + trace + video on failure
- **Safari config** (`playwright1.config.js`): Webkit browser with iPhone 14 device profile
- **Headless override**: Set `headless: false` in specific config for debugging

## Configuration Files

### playwright.config.js (Default)
```javascript
testDir: './tests',
timeout: 50000,
reporter: 'html',
use: {browserName: 'chromium', headless: true, screenshot: 'on', 
      trace: 'on', video: 'retain-on-failure'}
```

### playwright1.config.js (Safari/Mobile)
```javascript
projects: [{
  name: 'safari',
  use: {browserName: 'webkit', ...devices['iPhone 14']}
}]
```

## Common Development Workflows

### Running Tests Locally
```bash
# By tag
npm run Regression        # All @Regression tests
npm run smokeTest         # All @Smoke tests
npm run API               # All @API tests

# BDD with Cucumber
npm run cucumber          # Feature-driven tests

# Safari mobile
npm run safariNewConfig   # iPhone 14 device

# Playwright CLI (direct)
npx playwright test       # All tests in ./tests
npx playwright test --headed        # Show browser
npx playwright test --debug         # Interactive debug mode
npx playwright test --trace on      # Capture trace for Playwright Inspector
```

### Debugging
1. **Inspector Mode**: `npx playwright test --debug` - step through with UI
2. **Trace Files**: Auto-captured in `allure-results/` - open with `npx playwright show-trace <file>`
3. **Screenshot on Failure**: Auto-saved (Cucumber: `screenshot.png`)
4. **Pause in Test**: Add `await page.pause()` to halt execution interactively

### Adding New Tests
1. **Determine pattern**: E2E (direct page)? API-first? BDD (Cucumber)?
2. **E2E approach**: Create `tests/MyFeature.spec.js`, use page locators directly
3. **POM approach**: Create page object in `PageObjects/MyPage.js`, then reference in test
4. **API+Browser**: Use `APIUtils` in `beforeAll()`, inject token, verify in browser
5. **BDD approach**: Add scenario to `features/*.feature`, implement step definitions in `features/step_definitions/steps.js`

### Test Data
- **Hardcoded credentials**: `manasshah1992@yahoo.com` / `Test@123` (used across tests)
- **Product names**: `"ZARA COAT 3"` (hardcoded in tests)
- **Order payloads**: `{orders: [{country: "India", productOrderedId: "..."}]}`
- Stored in `utils/TestData.json` and `utils_ts/TestData.json` (template format)

## Reporting & Artifacts

### Allure Reports
- **Generation**: Automatic via `allure-playwright` reporter
- **Location**: `allure-report/` directory
- **View locally**: `npx allure open allure-report`
- **Artifacts captured**: Screenshots, video traces, test case details

### HTML Reporter
- Default reporter in `playwright.config.js`
- Access via `npx playwright show-report`

## Dependencies & Versions
- `@playwright/test@^1.60.0` - E2E framework
- `@cucumber/cucumber@^11.3.0` - BDD/Gherkin
- `allure-playwright@^3.8.0` - Reporting
- `typescript@^6.0.3` - TypeScript support (optional)

## Important Notes for AI Agents

### File Organization
- Always check **both** `PageObjects/` (JS) **and** `PageObjects_ts/` (TS) - maintain parallel implementations
- **utils/** → CommonJS, **utils_ts/** → TypeScript
- When modifying a POM method, update BOTH versions if it exists in both directories

### Import/Export Patterns
- **CommonJS (JS files)**: `require()` for imports, `module.exports = {ClassName}`
- **ES6 (TS files)**: `import` and `export class`
- **Cucumber steps**: Always import POM classes before use, instantiate fresh in each step

### Hardcoded Values vs Variables
- Test credentials are intentionally hardcoded (learning project)
- When adding tests, extract magic strings to test-level variables if used in multiple assertions
- Do NOT move credentials to external files without updating all references

### Selectors & Element Interaction
- Prefer precise selectors (IDs, data-attributes) over brittle XPath
- Use `locator().first()` or `.nth()` for multiple matches
- Always check if element needs `waitFor()` before interaction
- Text matching: use exact `"text=..."` or safe patterns like `"[routerlink*='cart']"`

### Test Isolation
- Each test is independent; Cucumber scenarios share page context within scenario but reset between scenarios
- API tokens expire; regenerate in `beforeAll()` hook, not between tests
- Clean up screenshots/traces between test runs to avoid report bloat
