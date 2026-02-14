---
id: "q09-code-documentation"
questionNumber: 9
title: "Code Documentation"
question: "How do you document your code or communicate changes for team members?"
whatItTests: "Your communication skills as a developer, understanding that code is read far more than it is written, and your ability to maintain documentation practices that scale with a team."
coreExplanation:
  summary: "Code documentation encompasses everything from inline comments and function signatures to pull request descriptions, commit messages, and architectural decision records. Effective documentation communicates the 'why' behind decisions, not just the 'what.' The best documentation lives as close to the code as possible, stays up to date through automation, and serves different audiences at different levels of detail."
  details:
    - heading: "Inline Comments: When and When Not"
      content: "Good inline comments explain why something is done, not what is done. If your code needs a comment explaining what it does, the code itself may need to be clearer—better variable names, smaller functions, or simpler logic. Comments are appropriate for explaining workarounds, business logic that is not obvious from the code, performance trade-offs, and links to relevant issues or specifications."
    - heading: "JSDoc and Type-Level Documentation"
      content: "JSDoc annotations provide structured documentation for functions, classes, and modules. They describe parameters, return types, exceptions, and usage examples. In TypeScript projects, types themselves serve as living documentation, but JSDoc still adds value for describing behavior, edge cases, and constraints that types cannot express. IDE integration means JSDoc appears in autocomplete tooltips, giving developers context without leaving their editor."
    - heading: "Commit Messages and Conventional Commits"
      content: "Commit messages are documentation that developers use every day when reading git log, bisecting bugs, or reviewing history. The Conventional Commits standard (feat:, fix:, docs:, refactor:, etc.) adds structure that enables automated changelog generation and semantic versioning. A good commit message has a concise subject line, a blank line, and a body that explains the motivation and context for the change."
    - heading: "Pull Request Descriptions"
      content: "Pull requests are where documentation meets collaboration. A well-written PR description explains what changed, why it changed, how to test it, and any trade-offs made. Screenshots or recordings for UI changes, links to related issues, and deployment notes help reviewers give better feedback faster. PR templates can enforce consistency across a team."
    - heading: "Architecture Decision Records (ADRs)"
      content: "ADRs are short documents that capture the context, decision, and consequences of significant technical choices. They answer questions like: why did we choose this database? Why did we structure the API this way? ADRs prevent teams from relitigating settled decisions and help new team members understand the reasoning behind the current architecture."
    - heading: "Component Documentation with Storybook"
      content: "For front-end component libraries, Storybook provides interactive documentation that shows components in all their states and variations. Unlike static docs, Storybook lets developers and designers see and interact with components in isolation. It serves as a living style guide that stays in sync with the actual code because it renders the real components."
keyConcepts:
  - term: "Self-Documenting Code"
    explanation: "Code that communicates its intent through clear naming, small focused functions, and logical structure. Meaningful variable names like remainingAttempts instead of n, descriptive function names like calculateShippingCost instead of calc, and well-organized modules reduce the need for comments. Self-documenting code is the first layer of documentation."
  - term: "Conventional Commits"
    explanation: "A specification for commit messages that adds a structured prefix: feat: for new features, fix: for bug fixes, docs: for documentation, refactor: for code restructuring, test: for adding tests, and chore: for maintenance tasks. Tools like commitlint enforce the convention, and semantic-release can automate versioning based on commit types."
  - term: "Architecture Decision Records (ADRs)"
    explanation: "Lightweight documents stored alongside code (often in a docs/decisions/ directory) that record the context, decision, and consequences of significant architectural choices. The format typically includes Title, Status, Context, Decision, and Consequences. They create an institutional memory that survives team turnover."
  - term: "JSDoc"
    explanation: "A documentation standard for JavaScript that uses structured comments (/** */) to describe function parameters (@param), return values (@returns), types (@type), exceptions (@throws), and examples (@example). JSDoc powers IDE IntelliSense, can generate HTML documentation sites, and works alongside TypeScript for additional type checking."
  - term: "README-Driven Development"
    explanation: "An approach where you write the README before writing the code. By explaining what a module does, how to install it, and how to use it before implementing it, you design the API from the consumer's perspective. This often results in simpler, more intuitive interfaces because you experience the developer experience before the implementation constrains it."
  - term: "Code Reviews as Documentation"
    explanation: "Pull request reviews create a searchable record of design discussions, trade-off analysis, and team decisions. When someone asks why code is written a certain way, the PR history often contains the answer. Tagging PRs with labels and writing thorough review comments creates a valuable knowledge base."
  - term: "Living Documentation"
    explanation: "Documentation that is automatically generated from or verified against the actual code, ensuring it cannot drift out of sync. TypeScript types, Storybook stories, auto-generated API docs from JSDoc, and test descriptions all serve as living documentation because they break when the code changes."
codeExamples:
  - title: "Good vs. Bad Inline Comments"
    language: "javascript"
    code: |
      // BAD: Comments that describe what the code does
      // Loop through the array
      for (let i = 0; i < items.length; i++) {
        // Check if the item is active
        if (items[i].active) {
          // Add to the result
          result.push(items[i]);
        }
      }

      // GOOD: Comments that explain why
      // Filter to active items only — inactive items are
      // soft-deleted and should not appear in search results.
      // See: https://github.com/org/repo/issues/342
      const visibleItems = items.filter(item => item.active);

      // GOOD: Explaining a workaround
      // Safari does not support the gap property in flexbox
      // below version 14.1. Using margin with a negative
      // wrapper until our browser support policy drops Safari 14.
      const GridWrapper = styled.div`
        margin: -8px;
        > * { margin: 8px; }
      `;
    description: "Bad comments restate the code. Good comments explain business logic, link to related issues, and document workarounds with context about when the workaround can be removed."
  - title: "JSDoc Function Documentation"
    language: "javascript"
    code: |
      /**
       * Calculates the total price for a cart including
       * applicable discounts and tax.
       *
       * Discounts are applied before tax. If multiple
       * discount codes are provided, only the highest
       * value discount is used (they do not stack).
       *
       * @param {CartItem[]} items - Array of cart items
       * @param {string[]} discountCodes - Promotional codes
       * @param {string} taxRegion - ISO 3166-1 region code
       * @returns {{ subtotal: number, discount: number,
       *            tax: number, total: number }}
       * @throws {InvalidRegionError} If taxRegion is not
       *         a supported region
       *
       * @example
       * const result = calculateTotal(
       *   [{ id: '1', price: 29.99, quantity: 2 }],
       *   ['SUMMER20'],
       *   'US-CA'
       * );
       * // { subtotal: 59.98, discount: 12.00,
       * //   tax: 4.32, total: 52.30 }
       */
      function calculateTotal(items, discountCodes, taxRegion) {
        // implementation
      }
    description: "JSDoc documents parameters, return shape, exceptions, and includes a concrete example. The description explains business rules (discounts do not stack) that would be difficult to infer from the code alone."
  - title: "Conventional Commit Messages"
    language: "text"
    code: |
      # BAD: Vague commit messages
      fix stuff
      updates
      WIP
      changes to the form

      # GOOD: Conventional commit format
      feat(cart): add quantity selector to cart items

      Allow users to change item quantities directly in the
      cart view instead of navigating back to the product
      page. Quantities are validated against available stock.

      Closes #234

      ---

      fix(auth): prevent token refresh race condition

      Multiple simultaneous API calls could each trigger a
      token refresh, causing all but the first to fail with
      a 401. Added a mutex so only one refresh occurs and
      other calls wait for the new token.

      Closes #567

      ---

      docs(api): add rate limiting section to API guide

      Documented the new 100 req/min rate limit for
      unauthenticated endpoints added in v2.3.0.
    description: "Conventional commits use a structured prefix (feat, fix, docs, refactor, test, chore) with an optional scope. The subject line is imperative and concise. The body provides context and motivation. Footer references link to issue trackers."
pitfalls:
  - title: "Writing comments that restate the code"
    description: "Comments like '// increment counter' above counter++ add noise without value. They must be maintained alongside the code and often fall out of sync. Reserve comments for explaining intent, business rules, and non-obvious decisions."
  - title: "Letting documentation drift from reality"
    description: "Outdated documentation is worse than no documentation because it actively misleads. Mitigate drift by keeping docs close to code (JSDoc over wiki pages), automating generation where possible (TypeDoc, Storybook), and including doc updates as part of the definition of done in code reviews."
  - title: "Over-documenting obvious code"
    description: "Excessive documentation clutters the codebase and trains developers to ignore comments. If every line has a comment, the important explanations get lost in the noise. Focus documentation on the surprising, complex, or business-critical parts."
  - title: "Writing PR descriptions after the fact"
    description: "Developers who write PR descriptions as an afterthought often produce vague summaries. Writing the PR description first—explaining what you intend to change and why—can clarify your thinking and produce more focused changesets."
  - title: "Skipping ADRs for significant decisions"
    description: "Without ADRs, teams repeatedly revisit the same architectural debates because no one remembers the original reasoning. When a key team member leaves, institutional knowledge disappears with them. ADRs take minutes to write but save hours of future discussion."
caseStudies:
  - title: "Implementing a Documentation Culture on a Growing Team"
    scenario: "A team that grew from 4 to 15 developers found that onboarding was taking longer, the same questions were asked repeatedly, and developers frequently duplicated work because they did not know a utility already existed."
    approach: "They introduced four practices: PR templates requiring a description, test plan, and screenshots for UI changes; Conventional Commits enforced by a pre-commit hook; Storybook for all shared UI components; and a lightweight ADR process for any decision affecting more than one team."
    outcome: "Onboarding time dropped from three weeks to one. PR review quality improved because reviewers had context before reading code. The Storybook became the primary reference for designers and QA. Six months of ADRs gave new hires a clear picture of why the architecture was structured the way it was."
  - title: "Migrating from Wiki Documentation to Docs-as-Code"
    scenario: "A team maintained their technical documentation in a wiki that was frequently out of date. Developers updated code but forgot to update the wiki, and there was no review process for documentation changes."
    approach: "They moved all technical documentation into the repository alongside the code. Docs were written in Markdown, reviewed in PRs alongside code changes, and deployed automatically. API documentation was generated from JSDoc annotations. The wiki was retired and redirected to the new docs site."
    outcome: "Documentation accuracy improved dramatically because docs and code changed in the same PR. The review process caught errors and ensured clarity. New developers contributed to documentation more readily because it used familiar tools (Git, Markdown, PRs) rather than a separate wiki system."
furtherReading:
  - title: "Conventional Commits Specification"
    url: "https://www.conventionalcommits.org/"
  - title: "JSDoc Documentation"
    url: "https://jsdoc.app/"
  - title: "Storybook - UI Component Workshop"
    url: "https://storybook.js.org/"
  - title: "Architecture Decision Records (ADR) on GitHub"
    url: "https://adr.github.io/"
  - title: "How to Write a Git Commit Message - Chris Beams"
    url: "https://cbea.ms/git-commit/"
---

## Documentation as Communication

Code documentation is fundamentally about communication, not compliance. When interviewers ask about your documentation practices, they are assessing whether you understand that software development is a team sport. The code you write today will be read, maintained, and extended by someone else tomorrow, and that someone might be you six months from now with no memory of why you wrote it that way. Every documentation practice—from a well-named variable to an Architecture Decision Record—is an act of empathy toward future readers.

## The Documentation Pyramid

Think of documentation as a pyramid with layers serving different audiences at different levels of detail. At the base, self-documenting code with clear names and small functions serves developers reading individual lines. Above that, JSDoc annotations and inline comments explain the why behind specific decisions. Pull request descriptions and commit messages document the evolution of the codebase over time. At the top, ADRs and README files provide the architectural context that ties everything together. Each layer supports the ones above it, and no single layer is sufficient on its own.

## Automation Keeps Documentation Honest

The biggest enemy of documentation is staleness. The moment documentation drifts from the code it describes, it becomes dangerous rather than helpful. The most effective teams combat drift through automation: TypeScript types serve as documentation that the compiler enforces, Storybook stories render real components so they break visibly when props change, JSDoc generates API reference sites as part of the build process, and Conventional Commits feed into automated changelogs. The goal is to make accurate documentation the path of least resistance.

## Documentation in the Interview

When answering this question in an interview, provide specific examples from your experience. Mention the tools you use (JSDoc, Storybook, ADR templates), the conventions your team follows (Conventional Commits, PR templates), and most importantly, the impact these practices have had. A strong answer connects documentation to real outcomes: faster onboarding, fewer repeated questions, better code reviews, and fewer bugs caused by misunderstood intent.
