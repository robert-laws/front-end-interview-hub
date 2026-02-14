---
id: "q14-production-bug"
questionNumber: 14
title: "Production Bug Debugging"
question: "You deploy code to production and a user reports a bug, but you cannot reproduce it on your local machine. What do you do?"
whatItTests: "Your systematic debugging approach, understanding of environment differences, ability to gather diagnostic information, and familiarity with production monitoring and debugging tools."
coreExplanation:
  summary: "When a bug appears in production but not locally, the issue almost always stems from an environment difference. Systematic debugging starts with gathering detailed information from the user, checking monitoring and logging tools for error data, identifying what differs between environments, and narrowing the scope until the root cause is found. This process requires both technical skill and structured problem-solving."
  details:
    - heading: "Gather Information from the User"
      content: "The first step is collecting as much context as possible. What browser and version are they using? What operating system? What screen size and resolution? What steps did they take to trigger the bug? Did they provide a screenshot or screen recording? Is it consistently reproducible on their end, or intermittent? Can other users reproduce it? The answers to these questions immediately narrow the search space."
    - heading: "Check Monitoring and Error Tracking"
      content: "Production monitoring tools like Sentry, LogRocket, Datadog, or New Relic capture errors with full context: stack traces, browser information, user actions leading to the error, network requests, and console output. Check these tools first, as they often reveal the exact error, the specific browser or device, and the sequence of actions that triggered it. If you do not have monitoring in place, this bug is the reason to implement it."
    - heading: "Identify Environment Differences"
      content: "The most common categories of difference between local and production are: browser version and engine (Chrome vs Safari vs Firefox), operating system (macOS vs Windows vs iOS), screen size and pixel density, network conditions (speed, latency, offline transitions), API endpoints and response timing, cached assets (stale CSS/JS), authentication state, data differences (edge cases in production data), and third-party scripts (analytics, ads, chat widgets)."
    - heading: "Reproduction Strategies"
      content: "Try to reproduce locally by matching the user's exact environment. Use browser developer tools to emulate their device and screen size. Throttle network speed to simulate their connection. Test in the same browser version (BrowserStack or Sauce Labs provide access to specific browser versions). Check if the production build differs from your local dev build by testing against the actual built assets."
    - heading: "Staged Rollouts and Feature Flags"
      content: "Once the bug is identified and fixed, deploy the fix safely using feature flags or staged rollouts. Feature flags let you enable the fix for a subset of users first and monitor for regressions before rolling out to everyone. This is especially important when the original bug could not be reproduced locally, as the fix itself carries some risk of unintended side effects."
keyConcepts:
  - term: "Error Tracking (Sentry)"
    explanation: "Sentry captures unhandled exceptions and errors in production with full stack traces, browser metadata, breadcrumbs (a trail of user actions before the error), and release tracking. It groups similar errors, tracks error frequency, and can be integrated with source maps to show original code locations instead of minified bundle references."
  - term: "Session Replay (LogRocket)"
    explanation: "Session replay tools record user sessions as video-like reproductions, capturing DOM changes, network requests, console output, and user interactions. When a user reports a bug, you can watch exactly what they did and what happened. This eliminates the guesswork of trying to reproduce unclear bug reports."
  - term: "Feature Flags"
    explanation: "Feature flags are conditional checks in code that enable or disable functionality without deploying new code. They allow gradual rollouts (enable for 5% of users, then 25%, then 100%), instant rollbacks (disable the flag instead of redeploying), and A/B testing. Services like LaunchDarkly, Unleash, or simple JSON configuration files provide feature flag infrastructure."
  - term: "Source Maps"
    explanation: "Source maps are files that map minified, bundled production code back to the original source. When an error occurs in production, the stack trace references minified code (app.js:1:45392). Source maps translate this back to the actual file, line, and column in your source code. Upload source maps to your error tracking tool for readable stack traces."
  - term: "Browser DevTools Remote Debugging"
    explanation: "Chrome and Safari support remote debugging of mobile devices connected via USB. This lets you inspect elements, view console output, debug JavaScript, and monitor network requests on the actual device experiencing the bug. Chrome's chrome://inspect page and Safari's Develop menu provide the connection interface."
  - term: "Cache Busting"
    explanation: "A common cause of production-only bugs is users running stale cached assets. Cache busting appends a hash or version to file names (app.a1b2c3.js) so browsers download new versions when code changes. If a user's browser caches old JavaScript but receives new HTML or API responses, the mismatch can cause errors."
  - term: "Race Conditions"
    explanation: "Bugs that depend on timing are notoriously hard to reproduce locally because local environments are typically faster. Race conditions occur when code assumes a specific execution order that is not guaranteed: two API calls returning in a different order, a DOM element not yet rendered when JavaScript accesses it, or a WebSocket message arriving before initialization completes."
  - term: "Cross-Browser Compatibility"
    explanation: "Different browsers implement web standards differently. Safari has notable differences in date parsing, flexbox gap support (older versions), and Web API availability. Firefox handles CSS grid subgrid differently. Edge cases in CSS rendering, JavaScript API support, and event handling can cause bugs that only appear in specific browsers. Always check caniuse.com for feature support."
codeExamples:
  - title: "Error Logging Setup with Sentry"
    language: "javascript"
    code: |
      import * as Sentry from '@sentry/browser';

      Sentry.init({
        dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
        release: process.env.COMMIT_SHA,
        environment: process.env.NODE_ENV,

        // Capture 10% of transactions for performance monitoring
        tracesSampleRate: 0.1,

        // Filter out known non-actionable errors
        ignoreErrors: [
          'ResizeObserver loop limit exceeded',
          'Non-Error promise rejection captured',
        ],

        beforeSend(event) {
          // Scrub sensitive data before sending
          if (event.request?.cookies) {
            delete event.request.cookies;
          }
          return event;
        },
      });

      // Add user context when authenticated
      function setUserContext(user) {
        Sentry.setUser({
          id: user.id,
          email: user.email,
        });
      }

      // Add breadcrumbs for custom actions
      function trackAction(action, data) {
        Sentry.addBreadcrumb({
          category: 'user-action',
          message: action,
          data,
          level: 'info',
        });
      }
    description: "A production error logging setup using Sentry. It initializes with release tracking (tied to the commit SHA), filters non-actionable errors, scrubs sensitive data, and provides functions to add user context and custom breadcrumbs. When an error occurs, Sentry captures the full context including the trail of user actions."
  - title: "Feature Flag Implementation Pattern"
    language: "javascript"
    code: |
      class FeatureFlags {
        constructor() {
          this.flags = {};
          this.overrides = this.loadOverrides();
        }

        async initialize() {
          try {
            const response = await fetch('/api/feature-flags');
            this.flags = await response.json();
          } catch (error) {
            console.warn('Failed to load feature flags, using defaults');
            this.flags = {};
          }
        }

        isEnabled(flagName, defaultValue = false) {
          // Local overrides take priority (for debugging)
          if (this.overrides.hasOwnProperty(flagName)) {
            return this.overrides[flagName];
          }
          return this.flags[flagName] ?? defaultValue;
        }

        loadOverrides() {
          try {
            const stored = localStorage.getItem('ff_overrides');
            return stored ? JSON.parse(stored) : {};
          } catch {
            return {};
          }
        }

        // Allow developers to override flags locally
        setOverride(flagName, value) {
          this.overrides[flagName] = value;
          localStorage.setItem('ff_overrides', JSON.stringify(this.overrides));
        }
      }

      // Usage
      const flags = new FeatureFlags();
      await flags.initialize();

      if (flags.isEnabled('new-checkout-flow')) {
        renderNewCheckout();
      } else {
        renderLegacyCheckout();
      }
    description: "A feature flag client that fetches flags from an API and supports local overrides for developer debugging. Flags control which code paths execute, enabling gradual rollouts and instant rollbacks. The localStorage override mechanism lets developers test both code paths without modifying the server."
  - title: "Environment Detection and Diagnostic Logging"
    language: "javascript"
    code: |
      function collectDiagnostics() {
        return {
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
          },
          connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt,
          } : 'Not available',
          memory: navigator.deviceMemory
            ? `${navigator.deviceMemory} GB`
            : 'Not available',
          cookiesEnabled: navigator.cookieEnabled,
          localStorage: (() => {
            try {
              localStorage.setItem('test', 'test');
              localStorage.removeItem('test');
              return true;
            } catch {
              return false;
            }
          })(),
          serviceWorker: 'serviceWorker' in navigator,
          online: navigator.onLine,
        };
      }

      // Attach diagnostics to error reports
      window.addEventListener('error', (event) => {
        const diagnostics = collectDiagnostics();
        console.error('Unhandled error with context:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          diagnostics,
        });
      });
    description: "A diagnostic collection function that gathers environment details when an error occurs: viewport size, device pixel ratio, network connection quality, available memory, and browser capabilities. This information is invaluable when debugging environment-specific bugs because it reveals exactly how the user's environment differs from development."
pitfalls:
  - title: "Assuming the user is wrong"
    description: "Dismissing a bug report because you cannot reproduce it locally is a common and costly mistake. Production environments have real-world variables that local development cannot fully simulate. Always treat user-reported bugs as valid until proven otherwise, and invest the effort to understand their specific context."
  - title: "Not having production monitoring in place"
    description: "Without error tracking, session replay, or application performance monitoring, debugging production issues becomes guesswork. Setting up tools like Sentry or LogRocket after a critical bug has already occurred means you are missing the data you need most. Instrument production monitoring before you need it."
  - title: "Deploying the fix without a feature flag"
    description: "If the bug could not be reproduced locally, there is inherent risk that the fix is incomplete or introduces new issues. Deploying the fix behind a feature flag allows gradual rollout and instant rollback. Pushing the fix directly to all users amplifies the risk of the original non-reproducible scenario."
  - title: "Forgetting about cached assets"
    description: "A significant percentage of production-only bugs are caused by users running old cached JavaScript or CSS alongside new HTML or API responses. Before deep-diving into code logic, verify that the user is actually running the latest deployed version by checking asset hashes or version numbers."
  - title: "Not checking third-party scripts"
    description: "Production environments typically include analytics, advertising, chat widgets, A/B testing tools, and consent management platforms that are absent from local development. These scripts can conflict with application code, block rendering, modify the DOM, or introduce race conditions that never appear locally."
caseStudies:
  - title: "The Safari Date Parsing Bug"
    scenario: "After deploying a new event scheduling feature, users on iOS Safari reported that all event dates showed as 'Invalid Date' while the feature worked perfectly in Chrome and Firefox on both desktop and mobile."
    approach: "Checked Sentry and found a cluster of errors from Safari browsers. The stack trace pointed to a Date constructor call. Investigated and discovered that Safari does not parse date strings in the format '2024-01-15 14:30:00' (with a space separator). Safari requires either ISO 8601 format with a T separator ('2024-01-15T14:30:00') or a manually parsed date. The API was returning dates with space separators."
    outcome: "Added a date normalization utility that replaced the space with a T before parsing, and added a unit test specifically for Safari date format handling. The fix was deployed behind a feature flag and verified on BrowserStack across Safari versions before full rollout. Added a cross-browser date parsing test to the CI suite to prevent regression."
  - title: "The Intermittent Checkout Race Condition"
    scenario: "Approximately 3% of users reported that the checkout button would occasionally do nothing when clicked. The team could not reproduce the issue after hundreds of local attempts. The bug had been open for weeks with no progress."
    approach: "Deployed LogRocket session replay and analyzed sessions where the checkout failed. Discovered that the issue occurred when a promotional banner API call resolved slowly (over 2 seconds). The banner response triggered a re-render that unmounted and remounted the checkout component during the window where the user clicked the button, causing the click handler to fire on a stale component reference."
    outcome: "Refactored the checkout component to decouple it from the banner rendering cycle using React.memo and a stable callback reference with useCallback. Added network throttling to the integration test suite to simulate slow API responses. The 3% failure rate dropped to zero after deployment."
furtherReading:
  - title: "Sentry Documentation"
    url: "https://docs.sentry.io/"
  - title: "Chrome DevTools - Remote Debugging"
    url: "https://developer.chrome.com/docs/devtools/remote-debugging/"
  - title: "LogRocket Documentation"
    url: "https://docs.logrocket.com/"
  - title: "Feature Flags Best Practices - Martin Fowler"
    url: "https://martinfowler.com/articles/feature-toggles.html"
  - title: "Can I Use - Browser Support Tables"
    url: "https://caniuse.com/"
---

## The Systematic Approach

Production-only bugs are among the most challenging issues in front-end development, but they are solvable with a systematic approach. The fundamental insight is that if a bug exists in production but not locally, something is different between the two environments. Your job is to methodically identify what that difference is. Start with the most common culprits: browser and device differences, cached assets, network conditions, and data variations. Most production-only bugs fall into one of these categories.

## The Value of Production Observability

The most effective debugging happens before a user ever reports the issue. Production observability tools like error tracking, performance monitoring, and session replay form a safety net that catches problems early and provides the context needed to diagnose them quickly. When a user reports a bug, the first question should not be "how do I reproduce this?" but rather "what do my monitoring tools already show me?" A well-instrumented application often has the answer waiting in its dashboards.

## Building Resilient Deployment Practices

The best way to handle production bugs is to minimize their blast radius. Feature flags allow you to deploy code to production without activating it for all users. Staged rollouts let you expose changes to a small percentage of traffic first and monitor for errors before increasing the percentage. Canary deployments run the new version alongside the old one and route a fraction of traffic to the canary. These practices transform a deployment from a binary, all-or-nothing event into a gradual, reversible process.

## Learning from Each Incident

Every production bug that could not be reproduced locally represents a gap in your development and testing process. After resolving the issue, conduct a brief retrospective: what environment difference caused the bug, and how can you detect similar issues earlier? This might mean adding cross-browser testing to CI, implementing network throttling in integration tests, testing with production-like data volumes, or adding specific device emulation to your QA process. Each incident makes your development pipeline more robust if you take the time to learn from it.
