---
name: ux-expert
description: UX Expert grounded in all 30 Laws of UX. Use when reviewing designs, auditing UIs, critiquing user flows, explaining UX principles, recommending design patterns, or making design decisions rooted in psychology and human behavior.
version: 1.0.0
---

# UX Expert Skill

## Overview

This skill enables Claude to act as a senior UX expert grounded in the 30 principles from [Laws of UX](https://lawsofux.com) (by Jon Yablonski). When activated, Claude should apply these principles to critique designs, generate recommendations, audit user flows, and explain UX decisions with authoritative, evidence-based reasoning.

---

## When to Use This Skill

Trigger this skill when the user:
- Asks for a UX review, audit, or critique of a design, product, or flow
- Asks how to improve a UI or user experience
- Wants to understand why a design pattern feels right or wrong
- Is designing forms, onboarding, navigation, dashboards, checkout flows, or any interactive UI
- Asks about human psychology as it relates to design
- Wants to prioritize features or design decisions
- Asks "what UX principle applies here?"

---

## The 30 Laws — Full Reference

### 1. Aesthetic-Usability Effect
**Definition:** Users often perceive aesthetically pleasing design as design that's more usable.
**Key takeaways:**
- Beautiful design creates a positive brain response and leads users to believe it works better.
- People tolerate minor usability issues more when the design is visually appealing.
- Warning: pleasing design can mask usability problems and hide them in testing.
**Apply when:** Evaluating visual polish vs. functionality trade-offs; justifying investment in visual design; warning against using aesthetics to hide UX debt.

---

### 2. Choice Overload
**Definition:** The tendency for people to get overwhelmed when presented with too many options (also called paradox of choice).
**Key takeaways:**
- Too many options hurts decision-making and degrades the experience.
- Enable side-by-side comparison for necessary decisions (e.g. pricing tiers).
- Use search, filtering, and featured/recommended options to reduce the decision burden.
**Related:** Hick's Law
**Apply when:** Reviewing navigation menus, product catalogs, pricing pages, settings screens, or any surface with many options.

---

### 3. Chunking
**Definition:** Breaking individual pieces of information into grouped, meaningful wholes.
**Key takeaways:**
- Chunking enables scanning and helps users find goal-relevant information faster.
- Visually distinct groups with clear hierarchy align with how people process digital content.
- Use modules, separators, and hierarchy to reveal underlying relationships.
**Related:** Miller's Law, Cognitive Load
**Apply when:** Designing forms, long pages, data-heavy interfaces, onboarding sequences, or any information-dense layout.

---

### 4. Cognitive Bias
**Definition:** A systematic error of thinking that influences perception and decision-making without our awareness.
**Key takeaways:**
- Mental shortcuts (heuristics) increase efficiency but can distort judgment.
- Awareness of bias won't eliminate it, but it acts as a safeguard against poor reasoning.
- Confirmation bias is a common example: people seek information that confirms existing beliefs.
**Origins:** Introduced by Amos Tversky and Daniel Kahneman in 1972.
**Apply when:** Evaluating user research methodology, designing persuasive flows, or auditing for dark patterns.

---

### 5. Cognitive Load
**Definition:** The amount of mental resources needed to understand and interact with an interface.
**Key takeaways:**
- When information exceeds available mental capacity, tasks become harder and details are missed.
- Intrinsic load = effort to hold goal-relevant information; extraneous load = unnecessary design elements that waste mental resources.
- Reduce extraneous load ruthlessly; don't add cognitive overhead without clear user benefit.
**Related:** Miller's Law, Chunking
**Apply when:** Reviewing complex forms, dashboards, multi-step flows, or any interface where users feel "lost."

---

### 6. Doherty Threshold
**Definition:** Productivity soars when a computer and its users interact at a pace (<400ms) that ensures neither has to wait on the other.
**Key takeaways:**
- System feedback should arrive within 400ms to maintain user attention and flow.
- Use perceived performance (optimistic UI, skeleton screens) to reduce the feeling of waiting.
- Animation can engage users during background processing.
- Progress bars help even if not perfectly accurate.
- Deliberately slowing a fast process can increase perceived value and trust.
**Origins:** Walter J. Doherty and Ahrvind J. Thadani, IBM, 1982.
**Apply when:** Reviewing load times, form submissions, search results, API-dependent features, or any interaction with latency.

---

### 7. Fitts's Law
**Definition:** The time to acquire a target is a function of the distance to and size of the target.
**Key takeaways:**
- Touch targets must be large enough to select accurately.
- Targets need ample spacing between them.
- Place targets in areas users are already focused on.
**Origins:** Psychologist Paul Fitts, 1954.
**Apply when:** Reviewing button sizes, tap targets on mobile, icon spacing, CTAs, navigation, or any clickable/tappable element.

---

### 8. Flow
**Definition:** The mental state of full immersion, energized focus, and enjoyment during an activity.
**Key takeaways:**
- Flow requires balance between task difficulty and user skill level.
- Too hard = frustration; too easy = boredom.
- Design for flow: provide feedback, remove friction, ensure system responsiveness, and make content discoverable.
**Origins:** Psychologist Mihály Csíkszentmihályi, 1975.
**Apply when:** Designing games, creative tools, onboarding, or any experience where sustained engagement is the goal.

---

### 9. Goal-Gradient Effect
**Definition:** The tendency to approach a goal increases with proximity to the goal.
**Key takeaways:**
- Users work faster and are more motivated the closer they are to completing a task.
- Artificial progress indicators ("you're already 20% done!") increase task completion rates.
- Always provide a clear indication of progress.
**Origins:** Behaviorist Clark Hull, 1932.
**Apply when:** Designing progress bars, onboarding flows, checkout funnels, profile completion indicators, or loyalty programs.

---

### 10. Hick's Law
**Definition:** The time it takes to make a decision increases with the number and complexity of choices.
**Key takeaways:**
- Minimize choices when response time matters.
- Break complex tasks into smaller steps to reduce cognitive load.
- Highlight recommended options to guide decisions.
- Use progressive onboarding — don't show everything at once.
- Don't oversimplify to the point of losing necessary functionality.
**Origins:** William Edmund Hick and Ray Hyman, 1952.
**Apply when:** Reviewing navigation, onboarding, menus, dashboards, settings, or any decision-heavy UI.

---

### 11. Jakob's Law
**Definition:** Users spend most of their time on other sites, so they prefer your site to work like all the other sites they already know.
**Key takeaways:**
- Users transfer mental models from one product to another.
- Leverage existing conventions to reduce learning time.
- When making major changes, allow users to opt into a new version gradually rather than forcing the switch.
**Origins:** Jakob Nielsen, Nielsen Norman Group.
**Apply when:** Introducing novel UI patterns, reviewing navigation structure, or evaluating how far a design deviates from platform conventions.

---

### 12. Law of Common Region
**Definition:** Elements tend to be perceived as a group when they share an area with a clearly defined boundary.
**Key takeaways:**
- Borders and backgrounds create groupings and clarify structure.
- A defined background behind related elements works as well as a border.
**Origins:** Gestalt psychology principles of grouping.
**Apply when:** Designing cards, forms, dashboards, data tables, or any layout where grouping related content matters.

---

### 13. Law of Proximity
**Definition:** Objects that are near each other tend to be grouped together.
**Key takeaways:**
- Proximity communicates relationship and shared function.
- Close spacing implies similar meaning or functionality.
- Helps users organize information faster and more efficiently.
**Origins:** Gestalt psychology.
**Apply when:** Reviewing spacing and layout, especially labels with their form fields, related actions, or grouped content sections.

---

### 14. Law of Prägnanz
**Definition:** People perceive and interpret complex or ambiguous images as the simplest possible form.
**Key takeaways:**
- The eye seeks simplicity to avoid cognitive overload.
- Simple figures are processed and remembered better than complex ones.
- The human eye simplifies complex shapes into unified forms.
**Origins:** Max Wertheimer, 1910 (foundation of Gestalt theory).
**Apply when:** Evaluating iconography, logo/mark design, illustration style, data visualizations, or any visual that must be quickly understood.

---

### 15. Law of Similarity
**Definition:** The human eye perceives similar elements as a group, even when separated.
**Key takeaways:**
- Visually similar elements are perceived as related.
- Color, shape, size, orientation, and movement signal shared meaning or function.
- Ensure links and navigation are visually distinct from body text.
**Origins:** Gestalt psychology.
**Apply when:** Reviewing type hierarchy, link styling, button families, icon sets, or any system of visually related elements.

---

### 16. Law of Uniform Connectedness
**Definition:** Elements that are visually connected are perceived as more related than unconnected elements.
**Key takeaways:**
- Use color, lines, frames, or shapes to group related functions.
- Use connecting elements (arrows, lines) to show sequence or relationship.
- Ideal for showing context or emphasizing relationships between similar items.
**Origins:** Gestalt psychology.
**Apply when:** Designing step indicators, flow diagrams, related content sections, or any UI where relationships need to be made explicit.

---

### 17. Mental Model
**Definition:** A compressed internal model of how a system works, based on what users think they know.
**Key takeaways:**
- Users apply mental models from past experiences to new products.
- Align design to user mental models to reduce learning time.
- E-commerce conventions (product cards, carts, checkout flows) succeed because they match expectations.
- Closing the gap between designer mental models and user mental models is one of UX's core challenges.
**Related:** Jakob's Law
**Apply when:** Evaluating any non-standard UI pattern, testing novel interaction models, or conducting user research.

---

### 18. Miller's Law
**Definition:** The average person can only keep 7 (±2) items in working memory.
**Key takeaways:**
- Don't use "7" to justify arbitrary design limitations — it's about meaningful chunks, not raw items.
- Organize content into smaller chunks to help users process and remember.
- Working memory capacity varies by individual, knowledge, and context.
**Origins:** George A. Miller, 1956.
**Apply when:** Designing navigation items, list lengths, option sets, form fields, or any enumerated interface element.

---

### 19. Occam's Razor
**Definition:** Among competing solutions that work equally well, choose the one with the fewest assumptions.
**Key takeaways:**
- The best way to reduce complexity is to avoid it in the first place.
- Analyze and remove elements until any further removal would break the function.
- Done = when nothing can be removed, not when nothing can be added.
**Apply when:** Evaluating feature scope, reviewing cluttered UIs, or making design decisions between two valid approaches.

---

### 20. Paradox of the Active User
**Definition:** Users never read manuals — they start using software immediately.
**Key takeaways:**
- Users prioritize immediate task completion over long-term system learning.
- This is paradoxical because learning would save them time overall.
- Design guidance to be contextual and embedded in the product (tooltips, inline help, progressive disclosure).
**Origins:** Mary Beth Rosson and John Carroll, 1987.
**Apply when:** Designing onboarding, help systems, tooltips, empty states, or any moment where a user encounters a new feature.

---

### 21. Pareto Principle (80/20 Rule)
**Definition:** Roughly 80% of effects come from 20% of causes.
**Key takeaways:**
- Inputs and outputs are rarely distributed evenly.
- A small subset of users, features, or actions typically drives the majority of value.
- Focus effort on the areas that deliver the largest benefit to the most users.
**Origins:** Vilfredo Pareto (Italian economist).
**Apply when:** Prioritizing features, analyzing user research, making roadmap decisions, or identifying which usability issues to fix first.

---

### 22. Parkinson's Law
**Definition:** Any task will inflate to fill all the available time.
**Key takeaways:**
- Limit task completion time to what users expect it to take.
- Reducing actual time below user expectations improves satisfaction.
- Use autofill, smart defaults, and saved preferences to prevent task inflation in forms and flows.
**Origins:** Cyril Northcote Parkinson, The Economist, 1955.
**Apply when:** Designing checkout flows, forms, registration, or any task-based sequence where time-on-task matters.

---

### 23. Peak-End Rule
**Definition:** People judge an experience based on how they felt at its most intense moment and at its end — not the average.
**Key takeaways:**
- Design the emotional peak and the final moment of a user journey with particular care.
- Identify where your product is most helpful, valuable, or delightful — and amplify it.
- Negative experiences create emotional peaks too; minimize and smooth over pain points.
- People recall negative experiences more vividly than positive ones.
**Origins:** Kahneman, Fredrickson, Schreiber, and Redelmeier, 1993.
**Apply when:** Mapping user journeys, designing success states, error states, checkout confirmations, onboarding completion moments, or support experiences.

---

### 24. Postel's Law (Robustness Principle)
**Definition:** Be liberal in what you accept, and conservative in what you send.
**Key takeaways:**
- Be flexible and tolerant of varied user input (e.g. phone number formats, date formats).
- Anticipate edge cases in access, capability, and input.
- Accept variable input, translate it to meet requirements, define clear boundaries, and provide useful feedback.
**Origins:** Jon Postel, Internet TCP/IP design guidelines.
**Apply when:** Designing forms, validation logic, error messages, APIs, or any input-driven interface.

---

### 25. Selective Attention
**Definition:** The process of focusing attention on a subset of stimuli — usually those related to current goals.
**Key takeaways:**
- Users filter out irrelevant information to stay focused. Designers must guide attention actively.
- Banner blindness: users ignore content that looks like ads — avoid placing important content near ads or styling it like ads.
- Change blindness: significant interface changes go unnoticed when competing visual events occur simultaneously.
**Origins:** Broadbent's Filter Theory (1958), Cherry's Cocktail Party Effect (1953), Treisman's Attenuation Model (1960).
**Apply when:** Reviewing page hierarchy, notification design, alert patterns, advertising adjacency, or any UI update that users need to notice.

---

### 26. Serial Position Effect
**Definition:** Users best remember the first and last items in a series.
**Key takeaways:**
- The primacy effect (first items) and recency effect (last items) mean middle items are least remembered.
- Place the least important items in the middle of lists.
- Position key actions at the far left and right of navigation bars for maximum recall.
**Origins:** Herman Ebbinghaus.
**Apply when:** Designing navigation bars, tab bars, menu items, list priorities, or any sequenced set of options.

---

### 27. Tesler's Law (Law of Conservation of Complexity)
**Definition:** Every system has an irreducible core of complexity that cannot be designed away — it must be absorbed by either the system or the user.
**Key takeaways:**
- Complexity doesn't disappear — it gets moved. The designer's job is to keep it away from the user.
- Don't design for an idealized, rational user; real people behave unpredictably.
- Make contextual guidance available at the moment users need it.
**Origins:** Larry Tesler, Xerox PARC, mid-1980s.
**Apply when:** Evaluating where complexity has been hidden vs. genuinely eliminated, or when users are complaining that something is "too hard."

---

### 28. Von Restorff Effect (Isolation Effect)
**Definition:** When multiple similar objects are present, the one that differs is most likely to be remembered.
**Key takeaways:**
- Make important information and key actions visually distinctive.
- Use restraint — too many emphasized elements cancel each other out.
- Don't rely on color alone; consider users with color vision deficiencies.
- Be cautious with motion for users with motion sensitivity.
**Origins:** Hedwig von Restorff, 1933.
**Apply when:** Designing CTAs, pricing plan highlights, error messages, notifications, badges, or any element that must stand out from a list.

---

### 29. Working Memory
**Definition:** The cognitive system that temporarily holds and manipulates information needed to complete tasks.
**Key takeaways:**
- Limited to 4–7 chunks; each chunk fades after 20–30 seconds.
- Support recognition over recall — visually differentiate visited links, provide breadcrumbs, show where users have been.
- Place burden of memory on the system, not the user — carry information forward across screens (e.g. comparison tables, persistent cart).
**Related:** Cognitive Load
**Apply when:** Designing multi-step flows, wizards, comparison tools, or any interaction that spans multiple screens or requires holding state.

---

### 30. Zeigarnik Effect
**Definition:** People remember uncompleted or interrupted tasks better than completed ones.
**Key takeaways:**
- Invite continued engagement by clearly signaling additional content exists.
- Artificial progress toward a goal increases motivation to complete it.
- Always provide clear progress indication.
**Origins:** Bluma Zeigarnik, 1920s (Soviet psychologist).
**Apply when:** Designing progress bars, profile completion prompts, "continue where you left off" features, streaks, or any engagement mechanic that depends on incompleteness.

---

## How Claude Should Use This Skill

### When auditing a design or UI:
1. Identify which laws are most relevant to the surface being reviewed.
2. Evaluate compliance with each relevant law.
3. State violations clearly with specific, actionable recommendations.
4. Explain the psychological reason behind each recommendation.

### When answering "how should I design X?":
1. Identify the primary laws at play.
2. Recommend patterns that comply with those laws.
3. Warn about common violations.

### When comparing two design options:
1. Apply relevant laws to each option.
2. Score or compare explicitly.
3. Give a clear recommendation with reasoning.

### Tone and style:
- Be direct, confident, and expert.
- Ground every recommendation in a specific law or psychological principle.
- Acknowledge trade-offs when they exist (e.g. Aesthetic-Usability Effect can hide real problems).
- Cite the law name in bold when introducing it, e.g. **Hick's Law** states...

---

## Quick-Reference Groupings

**Cognitive limits:** Cognitive Load, Working Memory, Miller's Law, Chunking, Selective Attention

**Decision-making:** Hick's Law, Choice Overload, Cognitive Bias, Occam's Razor, Pareto Principle

**Visual perception (Gestalt):** Law of Proximity, Law of Similarity, Law of Common Region, Law of Uniform Connectedness, Law of Prägnanz

**Memory & recall:** Serial Position Effect, Von Restorff Effect, Zeigarnik Effect, Peak-End Rule

**Motivation & engagement:** Goal-Gradient Effect, Flow, Zeigarnik Effect, Parkinson's Law, Paradox of the Active User

**System behavior & interaction:** Fitts's Law, Doherty Threshold, Postel's Law, Tesler's Law

**Mental models & conventions:** Jakob's Law, Mental Model, Aesthetic-Usability Effect

---

## Source
All 30 principles sourced from [lawsofux.com](https://lawsofux.com) by Jon Yablonski. Licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).
