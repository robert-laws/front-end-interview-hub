---
id: "q06-debugging-broken-site"
questionNumber: 6
title: "Debugging a Broken Site"
question: "What are your first steps to debug a website if it breaks during an update?"
whatItTests: "Your systematic approach to diagnosing production issues, familiarity with browser DevTools and version control debugging tools, ability to prioritize and triage under pressure, and communication skills when coordinating with a team during an incident."
coreExplanation:
  summary: "When a website breaks after an update, a systematic debugging approach prevents wasted time and panicked guessing. The process starts with immediate triage—identifying what broke and how severe it is—then moves to isolating the cause through DevTools, version control, and environment analysis. Effective debugging also requires clear communication and a rollback strategy."
  details:
    - heading: "Immediate Triage: Check the Console and Network"
      content: "Open the browser DevTools console first. JavaScript errors are the most common cause of broken functionality after an update. Look for uncaught exceptions, failed module imports, or deprecation warnings that became errors. Then check the Network tab for failed requests—a broken API endpoint, a missing asset, or a CORS error can take down an entire page."
    - heading: "Version Control: Identify What Changed"
      content: "Use git log to see recent commits and git diff to compare the current state with the last known working version. If the breaking change is not obvious, git bisect automates a binary search through commit history to find the exact commit that introduced the regression. This is one of the most powerful and underused debugging tools available."
    - heading: "Rollback Strategy"
      content: "If the break is severe and affecting users, rolling back to the last known good deployment is often the right first step. Fix forward is appropriate for minor issues, but a production outage demands immediate mitigation. Every team should have a documented rollback procedure—whether it is reverting a Git commit, redeploying a previous container image, or switching a feature flag."
    - heading: "Checking Dependencies and Environment"
      content: "Updates to dependencies are a frequent source of breaks. A new version of a library may introduce breaking changes, a lockfile conflict may pull in an unexpected version, or an environment variable may be missing in production. Compare package-lock.json or yarn.lock across commits, and verify that all environment variables are correctly set in the deployment environment."
    - heading: "Communication with the Team"
      content: "Debugging under pressure is a team activity. Notify stakeholders immediately when a production issue is identified. Post updates in the team's incident channel. If you identify the cause but the fix is complex, communicate the trade-off between a quick rollback and a proper fix. Clear communication during an incident builds trust and prevents duplicated effort."
keyConcepts:
  - term: "Console Error Triage"
    explanation: "The browser console displays JavaScript errors with stack traces that point to the exact file and line where the error occurred. Look for TypeError (accessing properties on undefined), SyntaxError (malformed code, often from bad transpilation), and ReferenceError (using a variable that does not exist). These are the most common errors after an update."
  - term: "Network Tab Analysis"
    explanation: "The DevTools Network tab shows all HTTP requests, their status codes, timing, and response bodies. Filter for failed requests (4xx and 5xx status codes). A 404 indicates a missing resource. A 500 indicates a server error. A CORS error means the server is not sending the correct access-control headers for a cross-origin request."
  - term: "git bisect"
    explanation: "A binary search tool built into Git that finds the commit that introduced a bug. You mark a known good commit and a known bad commit, and Git checks out the midpoint for you to test. This halves the search space with each step, finding the breaking commit in O(log n) steps instead of checking every commit linearly."
  - term: "git diff and git log"
    explanation: "git log --oneline shows recent commits in a compact format. git diff HEAD~5..HEAD shows all changes in the last five commits. git diff --name-only shows which files changed. These commands help you quickly understand the scope of recent changes and narrow your investigation to the most likely culprits."
  - term: "Rollback vs Fix Forward"
    explanation: "Rolling back reverts the deployment to a previous working version, immediately mitigating the user impact. Fixing forward means deploying a new fix on top of the broken code. Roll back when the issue is severe and the fix is not obvious. Fix forward when the issue is minor and the fix is quick and well understood."
  - term: "Environment Parity"
    explanation: "Differences between development, staging, and production environments are a common source of bugs that appear only in production. Environment variables, API endpoints, database seeds, CDN configurations, and feature flags can all differ across environments. Always verify environment-specific settings when debugging a production-only issue."
  - term: "Feature Flags"
    explanation: "Feature flags allow new functionality to be deployed but disabled in production. If a feature breaks the site, toggling its flag off immediately mitigates the issue without a full rollback. Feature flags are a key part of safe deployment strategies and provide a fast escape hatch during incidents."
  - term: "Source Maps"
    explanation: "Source maps connect minified production JavaScript and CSS back to the original source code. Without source maps, error stack traces point to unreadable minified files. With them, you can debug production errors as if you were reading the original source. Ensure source maps are generated during your build and are accessible (either publicly or via authenticated access)."
codeExamples:
  - title: "Git Commands for Debugging a Regression"
    language: "bash"
    code: |
      # Step 1: See what changed recently
      git log --oneline -20

      # Step 2: See which files changed in the last commit
      git diff HEAD~1 --name-only

      # Step 3: See the full diff of recent changes
      git diff HEAD~3..HEAD

      # Step 4: Use git bisect to find the breaking commit
      git bisect start
      git bisect bad                  # Current commit is broken
      git bisect good v2.4.0          # This tag was working

      # Git checks out the midpoint. Test the site, then:
      git bisect good                 # If this commit works
      # or
      git bisect bad                  # If this commit is broken

      # Repeat until git identifies the first bad commit
      # When done:
      git bisect reset                # Return to original branch

      # Step 5: Examine the breaking commit in detail
      git show <commit-hash>

      # Step 6: Check for dependency changes
      git diff HEAD~1 -- package-lock.json
    description: "A complete git debugging workflow. Start by reviewing recent history, then narrow down with bisect. The bisect command is especially valuable when the cause is not obvious from reading the diff—it finds the exact commit through systematic binary search."
  - title: "Console Error Debugging Checklist"
    language: "javascript"
    code: |
      // Common post-update errors and what they mean

      // 1. TypeError: Cannot read properties of undefined
      //    Cause: An API response shape changed, or a variable
      //    is not initialized before access.
      //    Fix: Check the API response, add null checks.

      // 2. SyntaxError: Unexpected token '<'
      //    Cause: A JavaScript file is returning HTML (often a
      //    404 page). Check the Network tab for the failing request.
      //    Fix: Verify the file path and deployment configuration.

      // 3. ChunkLoadError: Loading chunk X failed
      //    Cause: Code splitting produced chunks with content-hashed
      //    filenames, but the old HTML still references deleted chunks.
      //    Fix: Clear CDN cache, ensure HTML is not cached aggressively.

      // 4. Module not found: Cannot resolve 'package-name'
      //    Cause: A dependency was removed or renamed in the update.
      //    Fix: Check package.json changes, run npm install.

      // 5. CORS error: No 'Access-Control-Allow-Origin' header
      //    Cause: An API URL changed, or CORS headers were removed.
      //    Fix: Verify API endpoint URLs and server CORS configuration.

      // Quick diagnostic script for the browser console:
      (function debugCheck() {
        console.group('Quick Diagnostics');

        // Check for failed resources
        const failedResources = performance.getEntriesByType('resource')
          .filter(r => r.transferSize === 0 && r.decodedBodySize === 0);
        console.log('Failed resources:', failedResources.map(r => r.name));

        // Check for unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
          console.error('Unhandled rejection:', e.reason);
        });

        // Check service worker status
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(regs => {
            console.log('Service workers:', regs.length);
            regs.forEach(r => console.log(' -', r.scope, r.active?.state));
          });
        }

        console.groupEnd();
      })();
    description: "A reference guide for the most common post-update JavaScript errors and their causes. The diagnostic script at the bottom can be pasted into the browser console to quickly check for failed resources, unhandled rejections, and stale service workers."
  - title: "Dependency Debugging"
    language: "bash"
    code: |
      # Check what changed in dependencies
      git diff HEAD~1 -- package.json | head -40

      # See the full lockfile diff (can be large)
      git diff HEAD~1 --stat -- package-lock.json

      # List outdated packages
      npm outdated

      # Check for known vulnerabilities
      npm audit

      # Reinstall from a clean state
      rm -rf node_modules
      npm ci   # Uses lockfile exactly, unlike npm install

      # If using a monorepo, check workspace dependencies
      npm ls react           # Check which version of react is resolved
      npm ls --all | grep "UNMET"  # Find unmet peer dependencies
    description: "Commands for investigating dependency-related issues. npm ci is preferred over npm install for production builds because it installs exactly what the lockfile specifies, avoiding unexpected version resolution. The npm ls commands help diagnose version conflicts in complex dependency trees."
pitfalls:
  - title: "Making changes without understanding the cause"
    description: "The pressure of a production incident tempts developers to try random fixes—commenting out code, reverting files one at a time, or adding try-catch blocks around everything. This wastes time and can introduce new bugs. Always diagnose before you fix. Five minutes of investigation often saves an hour of trial and error."
  - title: "Forgetting to check for cached assets"
    description: "A common reason styles or scripts appear broken after deployment is that the browser or CDN is serving stale cached files. If the HTML references new JavaScript chunk filenames but the CDN still serves old chunks, you get ChunkLoadError. Verify cache headers, check CDN invalidation, and test in an incognito window to rule out browser cache."
  - title: "Not verifying the fix in the same environment"
    description: "A fix that works in local development may not work in production if the environments differ. Always verify your fix in the environment where the bug was observed, whether that means deploying to a staging server, testing against production APIs, or using environment-specific configuration."
  - title: "Skipping the rollback when the fix is unclear"
    description: "Developer pride sometimes prevents rolling back. If users are experiencing a broken site and you do not have a clear fix within a short timeframe, roll back first and debug at your own pace. A five-minute rollback followed by a thoughtful fix is better than a ninety-minute outage while you hunt for the cause."
  - title: "Not communicating status updates during the incident"
    description: "Silently debugging a production issue while stakeholders, support teams, and other developers wonder what is happening erodes trust. Post regular updates in your team's incident channel, even if the update is 'still investigating, no root cause identified yet.' Structured communication reduces the chaos of an incident."
caseStudies:
  - title: "Diagnosing a Post-Deployment White Screen"
    scenario: "After a routine Friday deployment, the main marketing site rendered a blank white page for all users. The deployment included 12 commits from four developers, making it unclear which change caused the failure."
    approach: "Opened DevTools console and found a SyntaxError: Unexpected token '<' in the main JavaScript bundle. The Network tab showed the JS file returning a 404 HTML page. Checked the build output and found that the bundler had changed chunk filenames, but the CDN was serving a cached index.html that referenced the old filenames. Invalidated the CDN cache for index.html and the site recovered. Then used git bisect to identify that a Webpack configuration change had altered the chunk naming strategy without updating the cache invalidation rules."
    outcome: "The site was restored within 8 minutes of the report. The root cause—a missing CDN cache invalidation for the HTML entry point—was fixed in the CI/CD pipeline to prevent recurrence. The team added a post-deployment smoke test that verified the main JavaScript bundle loaded successfully."
  - title: "Tracking Down a Regression with git bisect"
    scenario: "A form validation feature that had worked for months suddenly started rejecting all valid inputs after a sprint's worth of deployments. The team could not identify the responsible commit from code review alone because the change was subtle."
    approach: "Ran git bisect with a simple test script that submitted a valid form entry and checked the response. Bisect narrowed the cause to a commit that updated a date-parsing library from version 2.x to 3.x. The new version changed how it handled timezone offsets, causing date validation to reject dates formatted in the user's local timezone."
    outcome: "Pinned the date-parsing library to the previous version as an immediate fix, then updated the validation logic to handle the new timezone behavior correctly. Added a regression test that validated dates in multiple timezones. The entire debugging process took 25 minutes thanks to git bisect, compared to the estimated hours it would have taken to review all 47 commits manually."
furtherReading:
  - title: "Git Documentation: git bisect"
    url: "https://git-scm.com/docs/git-bisect"
  - title: "Chrome DevTools: Console Overview"
    url: "https://developer.chrome.com/docs/devtools/console/"
  - title: "Chrome DevTools: Network Reference"
    url: "https://developer.chrome.com/docs/devtools/network/reference/"
  - title: "web.dev: Debugging JavaScript"
    url: "https://web.dev/articles/debug-javascript"
  - title: "Atlassian: Incident Management Best Practices"
    url: "https://www.atlassian.com/incident-management/handbook"
---

## The Mindset of Effective Debugging

Debugging a broken production site tests your composure as much as your technical skills. The best debuggers resist the urge to immediately start changing code. Instead, they observe first: what error messages are appearing, what network requests are failing, what changed between the working state and the broken state. This observational discipline is what separates a five-minute fix from an hour of frustrated guessing.

## Building a Debugging Toolkit

Every front-end developer should be fluent with the browser DevTools console, network panel, and sources panel. Beyond that, Git provides powerful tools that many developers underuse. The git bisect command can isolate a regression across hundreds of commits in minutes. The git stash command lets you temporarily save work in progress to test against a clean state. The git diff command with file filters helps you focus on the most likely changed files. Investing time in learning these tools pays dividends every time something breaks.

## Environment Awareness

A significant percentage of production bugs stem from environment differences rather than code bugs. The code works perfectly in development because the API points to a local server, the environment variables are loaded from a .env file, and the CDN cache is not a factor. In production, any of these assumptions can be wrong. When debugging, always ask: is this a code problem or an environment problem? Checking environment variables, API endpoint URLs, CDN cache headers, and feature flag states often reveals the issue faster than reading code diffs.

## Post-Incident Learning

After resolving an incident, the most valuable step is the retrospective. What broke, why did it break, how did we detect it, how long did it take to resolve, and what can we do to prevent it from happening again? This might mean adding a smoke test to the deployment pipeline, improving monitoring alerts, creating a runbook for common failure modes, or adjusting the code review process to catch risky changes. Teams that learn from incidents become progressively more resilient over time.
