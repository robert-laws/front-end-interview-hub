---
id: "q07-html-accessibility"
questionNumber: 7
title: "HTML Accessibility"
question: "How do you ensure your HTML is accessible (WCAG compliant)? Describe the tools you use and any best practices to avoid WCAG errors."
whatItTests: "Your practical knowledge of web accessibility standards, ability to write inclusive markup, and familiarity with testing tools and WCAG guidelines."
coreExplanation:
  summary: "Accessible HTML means writing markup that can be understood and operated by everyone, including users who rely on screen readers, keyboard navigation, or other assistive technologies. WCAG (Web Content Accessibility Guidelines) provides the standard, organized around four principles: Perceivable, Operable, Understandable, and Robust (POUR)."
  details:
    - heading: "Semantic HTML First"
      content: "The foundation of accessibility is using the right HTML elements for their intended purpose. A <button> for actions, <a> for navigation, <nav> for navigation regions, <main> for primary content, <h1>-<h6> for headings in order. Semantic elements carry implicit ARIA roles that assistive technologies understand without extra markup."
    - heading: "ARIA: When HTML Isn't Enough"
      content: "ARIA (Accessible Rich Internet Applications) attributes fill gaps where native HTML semantics don't exist. Use aria-label for elements without visible text, aria-describedby to link descriptions, aria-live for dynamic content updates, and role attributes for custom widgets. The first rule of ARIA: don't use ARIA if a native HTML element can do the job."
    - heading: "Keyboard Navigation"
      content: "Every interactive element must be reachable and operable with a keyboard. Native elements like <button> and <a> are keyboard-accessible by default. Custom widgets need tabindex, keydown event handlers, and focus management. Focus order should follow a logical reading sequence."
    - heading: "Color and Contrast"
      content: "WCAG requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (Level AA). Don't rely on color alone to convey information—always provide additional visual indicators like icons, underlines, or text labels."
    - heading: "Testing Approaches"
      content: "Accessibility testing should happen at multiple levels: automated tools catch about 30-40% of issues (missing alt text, low contrast, missing labels), manual testing catches interaction problems (keyboard traps, focus order, screen reader announcements), and user testing reveals real-world usability issues."
keyConcepts:
  - term: "WCAG Conformance Levels (A, AA, AAA)"
    explanation: "Level A is the minimum (e.g., all images have alt text). Level AA is the standard most organizations target (e.g., 4.5:1 contrast ratio, resizable text). Level AAA is the highest (e.g., 7:1 contrast ratio, sign language for video). Most legal requirements reference Level AA."
  - term: "Landmark Roles"
    explanation: "HTML5 elements like <header>, <nav>, <main>, <aside>, and <footer> create landmark regions that screen reader users can jump between. They replace the need for role='banner', role='navigation', etc. Every page should have one <main> element."
  - term: "Alt Text Best Practices"
    explanation: "Descriptive alt text should convey the purpose and content of the image. Decorative images use alt='' (empty string). Complex images like charts need longer descriptions via aria-describedby or a linked text description. Never use 'image of' or 'picture of' as prefixes."
  - term: "Focus Management"
    explanation: "When content changes dynamically (modals opening, page sections loading), focus must move to the new content. Use element.focus() to move focus programmatically. Trap focus within modals so Tab doesn't escape to content behind the overlay."
  - term: "aria-live Regions"
    explanation: "Content that updates dynamically (notifications, search results, chat messages) should be wrapped in an aria-live region. aria-live='polite' waits for the user to be idle; aria-live='assertive' interrupts immediately. Use sparingly to avoid overwhelming screen reader users."
  - term: "Skip Navigation Links"
    explanation: "A hidden link at the top of the page that becomes visible on focus, allowing keyboard users to skip past repetitive navigation and jump directly to main content. Should be the first focusable element on the page."
  - term: "Form Accessibility"
    explanation: "Every form input needs a visible <label> connected via the for/id attribute pair. Error messages should be programmatically associated with their inputs using aria-describedby. Required fields should use the required attribute and aria-required='true'."
  - term: "Color Contrast Ratio"
    explanation: "The ratio between foreground and background colors. WCAG AA requires 4.5:1 for normal text and 3:1 for large text (18px+ bold or 24px+ regular). Tools like WebAIM's contrast checker or browser DevTools can measure this."
  - term: "Screen Reader Testing"
    explanation: "VoiceOver (macOS/iOS), NVDA (Windows, free), JAWS (Windows, paid), and TalkBack (Android) are the major screen readers. Testing with at least one is essential. Focus on whether all content is announced, interactions work, and dynamic updates are conveyed."
codeExamples:
  - title: "Semantic HTML Structure"
    language: "html"
    code: |
      <body>
        <a href="#main-content" class="skip-link">
          Skip to main content
        </a>
        <header>
          <nav aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </header>
        <main id="main-content">
          <h1>Page Title</h1>
          <article>
            <h2>Article Title</h2>
            <p>Content goes here...</p>
          </article>
        </main>
        <footer>
          <p>&copy; 2024 Company Name</p>
        </footer>
      </body>
    description: "A properly structured page with skip link, landmark elements, logical heading order, and semantic structure. Screen readers can navigate between landmarks and headings."
  - title: "Accessible Form"
    language: "html"
    code: |
      <form>
        <div>
          <label for="email">Email address</label>
          <input
            id="email"
            type="email"
            required
            aria-required="true"
            aria-describedby="email-hint email-error"
          >
          <p id="email-hint" class="hint">
            We'll never share your email.
          </p>
          <p id="email-error" class="error" role="alert" hidden>
            Please enter a valid email address.
          </p>
        </div>
        <button type="submit">Subscribe</button>
      </form>
    description: "Label connected to input via for/id. Hint and error messages linked with aria-describedby. Error uses role='alert' for screen reader announcement. Required field is marked with both the required attribute and aria-required."
  - title: "Accessible Modal Dialog"
    language: "html"
    code: |
      <dialog id="confirm-dialog"
              aria-labelledby="dialog-title"
              aria-describedby="dialog-desc">
        <h2 id="dialog-title">Confirm Action</h2>
        <p id="dialog-desc">
          Are you sure you want to delete this item?
        </p>
        <div class="dialog-actions">
          <button type="button" autofocus>Cancel</button>
          <button type="button" class="danger">Delete</button>
        </div>
      </dialog>
    description: "The native <dialog> element handles focus trapping and Escape key automatically. aria-labelledby and aria-describedby provide context. The Cancel button has autofocus for a safe default action."
  - title: "Accessible Image Examples"
    language: "html"
    code: |
      <!-- Informative image -->
      <img src="chart.png"
           alt="Bar chart showing sales increased 40% in Q4 2024">

      <!-- Decorative image -->
      <img src="divider.svg" alt="">

      <!-- Complex image with long description -->
      <figure>
        <img src="architecture.png"
             alt="System architecture diagram"
             aria-describedby="arch-desc">
        <figcaption id="arch-desc">
          The system uses a three-tier architecture: a React
          front end communicates with a Node.js API layer,
          which connects to a PostgreSQL database.
        </figcaption>
      </figure>
    description: "Three patterns: informative alt text that describes the content's meaning, empty alt for decorative images, and aria-describedby for complex images that need longer descriptions."
pitfalls:
  - title: "Using div and span for everything"
    description: "Divs and spans have no semantic meaning. A <div onclick> is not a button—it lacks keyboard support, focus indication, and an implicit role. Use native HTML elements first (<button>, <a>, <input>, <nav>)."
  - title: "Adding ARIA to elements that already have semantics"
    description: "Writing <button role='button'> or <nav role='navigation'> is redundant. Native elements already carry these roles. Adding unnecessary ARIA can actually cause issues with some screen readers."
  - title: "Relying solely on automated testing"
    description: "Automated tools catch only about 30-40% of accessibility issues. They can detect missing alt text and low contrast, but cannot evaluate whether alt text is meaningful, whether focus order is logical, or whether custom widgets are usable."
  - title: "Hiding content from screen readers with display: none"
    description: "display: none and visibility: hidden hide content from everyone, including screen readers. If you want content hidden visually but available to screen readers, use a .sr-only CSS class (position: absolute, clip, overflow: hidden)."
  - title: "Missing focus styles"
    description: "Removing outline: none without a replacement makes it impossible for keyboard users to see where focus is. Always provide visible focus indicators, ideally using :focus-visible to avoid showing focus on mouse clicks."
caseStudies:
  - title: "Retrofitting Accessibility on an E-Commerce Site"
    scenario: "An e-commerce site received a legal complaint about accessibility. An audit revealed 47 WCAG AA violations, mainly missing form labels, insufficient contrast, and keyboard traps in the product carousel."
    approach: "Prioritized fixes by impact: added form labels first (highest user impact), fixed color contrast ratios, replaced the custom carousel with one that supports keyboard navigation, and added skip links and landmark regions."
    outcome: "All 47 violations resolved in two sprints. Customer support tickets from users with disabilities dropped 80%. The team integrated axe-core into CI to prevent regressions."
  - title: "Building an Accessible Design System"
    scenario: "A company needed a shared component library that met WCAG AA across all products. Different teams were independently solving accessibility problems with inconsistent approaches."
    approach: "Built the design system with accessibility as a foundational requirement, not an afterthought. Every component included keyboard interaction specs, ARIA patterns from WAI-ARIA Authoring Practices, and automated tests using jest-axe."
    outcome: "Teams adopted the library and WCAG violations in new features dropped to near zero. The ARIA pattern documentation became a training resource for new developers."
furtherReading:
  - title: "WebAIM - Web Accessibility In Mind"
    url: "https://webaim.org/"
  - title: "WCAG 2.1 Quick Reference"
    url: "https://www.w3.org/WAI/WCAG21/quickref/"
  - title: "WAI-ARIA Authoring Practices"
    url: "https://www.w3.org/WAI/ARIA/apg/"
  - title: "The A11Y Project"
    url: "https://www.a11yproject.com/"
  - title: "axe DevTools Browser Extension"
    url: "https://www.deque.com/axe/browser-extensions/"
---

## The POUR Principles

WCAG is organized around four principles, forming the acronym POUR:

**Perceivable:** Information must be presentable in ways all users can perceive. This means providing text alternatives for images, captions for video, sufficient color contrast, and resizable text.

**Operable:** Interface components must be usable by everyone. This means full keyboard operability, enough time to read content, no seizure-inducing content, and clear navigation.

**Understandable:** Information and operation must be understandable. This means readable text, predictable navigation, and helpful error messages.

**Robust:** Content must work with current and future technologies. This means valid HTML, proper ARIA usage, and compatibility with assistive technologies.

## Accessibility Testing Workflow

A practical approach to accessibility testing in your development workflow:

1. **During development:** Use browser DevTools (Accessibility panel in Chrome) to check the accessibility tree, contrast ratios, and ARIA properties as you code.

2. **In CI/CD:** Run axe-core or pa11y as automated tests. These catch roughly 30-40% of WCAG violations automatically.

3. **Before release:** Do manual keyboard testing (Tab through the entire page), screen reader testing (at least VoiceOver or NVDA), and zoom testing (200% zoom).

4. **Periodically:** Run a full audit using tools like Lighthouse, WAVE, or a professional accessibility auditor.
