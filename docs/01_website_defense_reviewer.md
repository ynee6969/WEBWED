# Vows & Veil Website Defense Reviewer

## Project Inspection Summary

`Vows & Veil` is a static multi-page wedding planning website built with semantic HTML, a single shared CSS file, and vanilla JavaScript for enhancement. The pages are `index.html`, `about.html`, `services.html`, `venues.html`, `gallery.html`, and `contact.html`. Styling uses a luxury editorial theme with warm neutrals, soft gold accents, clay-like shadows, and script/serif/sans-serif font pairing from Google Fonts. Media includes JPG image cards, an MP4 hero video, an SVG brand mark, and a Google Maps embed on the contact page. The contact form posts to a serverless `/api/contact` handler that uses Nodemailer.

### What the codebase does well

The site already shows a strong visual identity, consistent spacing, clear card patterns, and responsive grids. It uses `loading="lazy"` for images, labels for form fields, a skip link, reduced-motion support, and a gallery lightbox with keyboard controls. The visual language feels coherent across pages and matches the wedding-planning concept.

### Weak points an instructor may notice

The navigation shell is injected by JavaScript, so the site has no static `<nav>` fallback if scripts fail. The Services page links to `index.html#budget-calculator`, but the homepage does not currently contain that `id`, so the anchor is broken. There is also one inline style in `services.html` that should be moved into CSS. A few modifier classes in the HTML, such as `hero--landing`, `skip-link--global`, and `gallery-grid--albums`, do not have matching CSS rules, which may look inconsistent during source inspection. The stylesheet also repeats the `@media (max-width: 1200px)` breakpoint, which is not wrong, but it is a good cleanup question.

## Table of Contents

1. Fix the broken budget anchor
2. Remove the inline spacing style in Services
3. Explain the JS-generated shell and navigation
4. Defend the skip link and focus handling
5. Explain the hero video and reduced-motion behavior
6. Stack the hero correctly on smaller screens
7. Explain the layered background and overlay system
8. Defend the design tokens in `:root`
9. Explain the typography hierarchy
10. Explain `overflow: clip` and content containment

## Defense Questions and Live Coding Scenarios

### 1. Fix the broken budget anchor

**Instructor Question/Task:** The Services page has a button that points to `index.html#budget-calculator`, but the homepage does not have that target. How would you fix it live?

**Expected Student Answer:** I would add `id="budget-calculator"` to the budget section on the homepage, then test the link again so it scrolls directly to that section.

**Technical Explanation:** Fragment links only work when the destination element has a matching `id`. Without it, the browser cannot jump to the calculator section.

**Step-by-step Solution:** Add the id to the budget section. Keep the section as the visible anchor target. Optionally add `scroll-margin-top` so the sticky top bar does not cover the section title.

**Sample HTML:**
```html
<section class="section" id="budget-calculator">
```

**Sample CSS:**
```css
#budget-calculator {
  scroll-margin-top: 110px;
}
```

**Why the solution works:** The browser now has a valid anchor target, and the section stays readable when jumped to from another page.

**Common student mistakes:** Adding the id to the wrong element, using a class instead of an id, or forgetting to test the link after editing.

**Alternative solutions:** Link to a dedicated calculator page, or add a button inside the hero that scrolls to the calculator on the same page.

**Possible follow-up questions from instructor:** Why does the link fail now? Why is `scroll-margin-top` useful with a sticky header?

### 2. Remove the inline spacing style in Services

**Instructor Question/Task:** There is inline styling on the Services page. Clean it up and keep the same spacing.

**Expected Student Answer:** I would replace the inline style with a reusable CSS class so the spacing stays consistent and easier to maintain.

**Technical Explanation:** Inline styles increase specificity and make layout changes harder to manage across pages.

**Step-by-step Solution:** Create a utility class for top spacing. Apply it to the button group. Remove the inline `style` attribute from the HTML.

**Sample HTML:**
```html
<div class="button-group button-group--spaced">
  <a class="button button--primary" href="index.html#budget-calculator">Use the Budget Tool</a>
</div>
```

**Sample CSS:**
```css
.button-group--spaced {
  margin-top: 1rem;
}
```

**Why the solution works:** The spacing becomes reusable, cleaner, and easier to override in responsive layouts.

**Common student mistakes:** Keeping the inline style because it is "faster", or creating a one-off class that is never reused.

**Alternative solutions:** Add spacing to the parent story card, or use a shared utility like `.mt-16`.

**Possible follow-up questions from instructor:** Why are inline styles discouraged? What is the specificity impact?

### 3. Explain the JS-generated shell and navigation

**Instructor Question/Task:** Your sidebar, top bar, and footer are not written directly in the HTML files. Explain why and how this works.

**Expected Student Answer:** The main content is written in HTML, then JavaScript injects the shared navigation shell so every page uses the same layout and active-state logic.

**Technical Explanation:** The script reads `data-page`, builds the sidebar and top bar from shared config objects, and inserts the shell around the page content. This reduces duplication but depends on JavaScript.

**Step-by-step Solution:** Keep the content pages focused on page-specific sections. Use the shared config in `js/script.js`. Make sure the body has the correct `data-page` value on each page.

**Sample HTML:**
```html
<body class="page" data-page="services">
  <div class="site-shell" data-shell-root>
    <main class="page-main" id="main-content" data-main></main>
  </div>
</body>
```

**Sample CSS:**
```css
.site-content {
  margin-left: calc(var(--sidebar-width) + 0.9rem);
}
```

**Why the solution works:** Shared shell code keeps the navigation consistent while the CSS controls the layout around that injected structure.

**Common student mistakes:** Forgetting the `data-page` value, breaking the shell by moving `main` outside the shell root, or assuming the page still has a static `<nav>`.

**Alternative solutions:** Put the shell directly in each HTML file, or use server-side templating instead of client-side injection.

**Possible follow-up questions from instructor:** What happens if JavaScript is disabled? Why did you choose this structure instead of duplicating HTML?

### 4. Defend the skip link and focus handling

**Instructor Question/Task:** Why do you have a skip link, and how does it help accessibility?

**Expected Student Answer:** It lets keyboard users jump straight to the main content instead of tabbing through the navigation shell every time.

**Technical Explanation:** The skip link becomes visible on focus, and the main landmark has the `id` target. This supports keyboard and assistive technology users.

**Step-by-step Solution:** Keep a skip link at the top of the document. Point it to `#main-content`. Style it so it is hidden until focused.

**Sample HTML:**
```html
<a class="skip-link" href="#main-content">Skip to content</a>
<main id="main-content"></main>
```

**Sample CSS:**
```css
.skip-link {
  transform: translateY(-180%);
}

.skip-link:focus {
  transform: translateY(0);
}
```

**Why the solution works:** Keyboard users get a fast path into the page, and the link remains visually unobtrusive until needed.

**Common student mistakes:** Hiding the link with `display: none`, forgetting the destination id, or making it visible only on hover.

**Alternative solutions:** Add a "Skip to main" link and a "Skip to navigation" link if the page becomes larger.

**Possible follow-up questions from instructor:** Why use `:focus` here instead of only `:hover`? What should happen when the user tabs onto it?

### 5. Explain the hero video and reduced-motion behavior

**Instructor Question/Task:** The homepage hero uses a video background. Explain how you made it accessible and how it reacts to reduced-motion users.

**Expected Student Answer:** The video is muted, autoplaying, looping, and has a poster image. If the user prefers reduced motion, the script pauses the video.

**Technical Explanation:** The video is decorative, so the HTML uses `muted`, `autoplay`, `loop`, and `playsinline`. The script checks `prefers-reduced-motion` and pauses the media.

**Step-by-step Solution:** Keep the poster image in the HTML. Keep the video muted by default. Add controls to pause and mute. Respect reduced-motion preferences.

**Sample HTML:**
```html
<video autoplay muted loop playsinline poster="assets/images/hero-poster.svg">
  <source src="assets/videos/14574021_1920_1080_25fps.mp4" type="video/mp4" />
</video>
```

**Sample CSS:**
```css
.hero__video {
  object-fit: cover;
}
```

**Why the solution works:** The hero stays visually rich without forcing motion or audio on users who do not want it.

**Common student mistakes:** Leaving the video unmuted, forgetting the poster, or ignoring reduced-motion preferences.

**Alternative solutions:** Replace the video with a still image on mobile, or use a CSS-only background if performance becomes an issue.

**Possible follow-up questions from instructor:** Why is `muted` required for autoplay? Why use a poster image?

### 6. Stack the hero correctly on smaller screens

**Instructor Question/Task:** The hero has two columns on desktop. How do you make it stack on tablet and mobile?

**Expected Student Answer:** I would change the hero grid to one column below the breakpoint so the copy comes first and the panel sits underneath it.

**Technical Explanation:** The desktop layout uses CSS Grid. At `max-width: 1200px`, the grid switches to one column for better readability and less horizontal pressure.

**Step-by-step Solution:** Keep the desktop grid. Add a breakpoint. Reset the panel alignment so it does not push off-screen.

**Sample HTML:**
```html
<div class="hero__content">
  <div class="hero__copy"></div>
  <aside class="hero__panel"></aside>
</div>
```

**Sample CSS:**
```css
@media (max-width: 1200px) {
  .hero__content {
    grid-template-columns: 1fr;
  }
}
```

**Why the solution works:** The content becomes linear and easier to read on smaller devices.

**Common student mistakes:** Forgetting to reset `justify-self`, keeping a fixed width on the panel, or stacking too late.

**Alternative solutions:** Use Flexbox for the hero, or hide the panel on very small screens if the page becomes too dense.

**Possible follow-up questions from instructor:** Why choose Grid for the hero instead of Flexbox? What happens to the panel alignment after stacking?

### 7. Explain the layered background and overlay system

**Instructor Question/Task:** Your site background uses multiple gradients and a fixed pseudo-element. Why not use a flat color?

**Expected Student Answer:** The layered background gives the site a softer, premium look that matches the wedding-planning theme.

**Technical Explanation:** The body background combines radial gradients and a vertical gradient. The `body::before` layer adds subtle light spots without affecting layout.

**Step-by-step Solution:** Build the atmosphere using background layers. Keep decorative effects separated from content. Use `pointer-events: none` so the overlay never blocks interaction.

**Sample HTML:**
```html
<body class="page">
  <main></main>
</body>
```

**Sample CSS:**
```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
}
```

**Why the solution works:** Decoration stays in the background, while the content remains readable and clickable.

**Common student mistakes:** Putting the decoration on a real content element, using too much contrast, or letting the overlay intercept clicks.

**Alternative solutions:** Use a single subtle gradient, or move the decoration into a hero-only background if the full-page effect feels heavy.

**Possible follow-up questions from instructor:** Why use pseudo-elements instead of extra HTML? What does `pointer-events: none` prevent?

### 8. Defend the design tokens in `:root`

**Instructor Question/Task:** Why did you store colors, radii, shadows, and fonts in CSS variables?

**Expected Student Answer:** So the site has a consistent design system and so one change can update the whole website.

**Technical Explanation:** Tokens in `:root` let the project reuse palette values, typography, and spacing-related styling without repeating hard-coded numbers.

**Step-by-step Solution:** Define theme tokens once. Reference them across buttons, cards, forms, and headings. Update the variables when the brand changes.

**Sample HTML:**
```html
<section class="feature-card"></section>
```

**Sample CSS:**
```css
:root {
  --accent-deep: #8e674c;
  --radius-lg: 28px;
  --font-display: "Cormorant Garamond", Georgia, serif;
}
```

**Why the solution works:** The design stays visually consistent and is easier to maintain or restyle.

**Common student mistakes:** Hard-coding colors in random selectors or defining too many one-off values.

**Alternative solutions:** Use utility classes for repeated values, or split tokens into separate layers for colors, typography, and spacing.

**Possible follow-up questions from instructor:** What is the difference between a design token and a normal CSS variable? Why choose variables over repeated constants?

### 9. Explain the typography hierarchy

**Instructor Question/Task:** Why does the website use three font families instead of one?

**Expected Student Answer:** The script font adds elegance, the serif font gives the headings a formal editorial feel, and the sans-serif font keeps the body text readable.

**Technical Explanation:** The site uses `Allura` for signature-style headings, `Cormorant Garamond` for display copy, and `Manrope` for body text and UI controls.

**Step-by-step Solution:** Assign a specific role to each font family. Use the script font sparingly. Keep the body font as the most readable layer.

**Sample HTML:**
```html
<h1 class="hero__title">From dream to "I do," beautifully handled.</h1>
```

**Sample CSS:**
```css
.hero__title {
  font-family: var(--font-script);
}
```

**Why the solution works:** The hierarchy feels intentional and the important headings stand out without making the page hard to read.

**Common student mistakes:** Using decorative fonts for long paragraphs, overusing the script font, or mixing too many unrelated typefaces.

**Alternative solutions:** Use only one serif family plus one sans-serif family if the design needs to feel more minimal.

**Possible follow-up questions from instructor:** Why should body copy avoid script fonts? How do you keep the design elegant but readable?

### 10. Explain `overflow: clip` and content containment

**Instructor Question/Task:** Why do you use `overflow: clip` on the main content area?

**Expected Student Answer:** It prevents decorative layers and scaled media from creating unwanted scrollbars or visual spillover.

**Technical Explanation:** `overflow: clip` is useful when the layout contains large backgrounds, zooming media, or edge effects that should stay visually contained.

**Step-by-step Solution:** Identify the element that may overflow. Clip the overflow where the visual effect is supposed to end. Keep interactive content outside that clipped boundary when possible.

**Sample HTML:**
```html
<main class="page-main"></main>
```

**Sample CSS:**
```css
main {
  overflow: clip;
}
```

**Why the solution works:** The page keeps a clean edge and avoids accidental horizontal scrolling caused by decorative or scaled elements.

**Common student mistakes:** Applying clipping to the wrong element, which can hide necessary content, or using it when `overflow: hidden` would be more appropriate.

**Alternative solutions:** Use `overflow-x: hidden` for specific horizontal issues, or move the decorative effect to a nested wrapper.

**Possible follow-up questions from instructor:** How is `overflow: clip` different from `overflow: hidden`? When would you avoid using it?

### 11. Explain the auto-fit grid used for card sections

**Instructor Question/Task:** The homepage, venues page, and services page all use grids that automatically wrap cards. Why did you choose `repeat(auto-fit, minmax(...))`?

**Expected Student Answer:** It lets the cards fill available space and collapse into fewer columns naturally on smaller screens without writing many breakpoints.

**Technical Explanation:** `auto-fit` makes the grid responsive to available width, while `minmax()` protects each card from shrinking too far.

**Step-by-step Solution:** Define a card grid. Give each card a sensible minimum width. Let the browser decide how many columns fit.

**Sample HTML:**
```html
<div class="venue-grid">
  <article class="venue-card"></article>
</div>
```

**Sample CSS:**
```css
.venue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
```

**Why the solution works:** The layout adapts smoothly from desktop to tablet to phone without hard-coded column counts.

**Common student mistakes:** Using a fixed `grid-template-columns: 4fr 4fr 4fr`, forgetting a minimum width, or making cards too narrow to read.

**Alternative solutions:** Use Flexbox with wrapping, or switch to a single-column layout earlier for stricter editorial control.

**Possible follow-up questions from instructor:** What is the difference between `auto-fit` and `auto-fill`? Why is `minmax` important here?

### 12. Compare Flexbox and Grid in this project

**Instructor Question/Task:** Where did you use Flexbox, and where did you use Grid?

**Expected Student Answer:** Grid is used for section layouts and card systems, while Flexbox is used for horizontal alignment like the top bar, button groups, and form controls.

**Technical Explanation:** Grid is better for two-dimensional layout, while Flexbox is better for one-direction alignment and spacing.

**Step-by-step Solution:** Use Grid for page structure. Use Flexbox for toolbar alignment, inline button rows, and navigation items.

**Sample HTML:**
```html
<div class="button-group">
  <a class="button button--primary">Plan Your Wedding</a>
</div>
```

**Sample CSS:**
```css
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}
```

**Why the solution works:** Each layout tool is used where it is strongest, which keeps the code easier to reason about.

**Common student mistakes:** Using Grid for everything, or using Flexbox for complex two-dimensional arrangements that need rows and columns.

**Alternative solutions:** Use Grid for the button area if you need exact alignment, or Flexbox for card rows if the section is simple.

**Possible follow-up questions from instructor:** Why not use Grid for the button group? Why not use Flexbox for the card sections?

### 13. Explain the responsive navigation drawer

**Instructor Question/Task:** Show how the sidebar becomes a mobile navigation drawer instead of staying pinned on the left.

**Expected Student Answer:** On desktop the sidebar is fixed, but on mobile it slides off-canvas and opens with a toggle button and backdrop.

**Technical Explanation:** The CSS changes the sidebar width and transform at `max-width: 1024px`. The body class `sidebar-mobile-open` slides the sidebar into view.

**Step-by-step Solution:** Keep the desktop sidebar fixed. Hide it off-canvas on mobile. Toggle a body class to open and close it.

**Sample HTML:**
```html
<button class="sidebar-toggle" type="button" aria-controls="site-sidebar"></button>
<aside class="sidebar" id="site-sidebar"></aside>
```

**Sample CSS:**
```css
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(calc(-100% - 1rem));
  }

  body.sidebar-mobile-open .sidebar {
    transform: translateX(0);
  }
}
```

**Why the solution works:** The navigation stays accessible on small screens without taking up the whole viewport.

**Common student mistakes:** Forgetting the backdrop, not updating body margin on mobile, or leaving the drawer open with no close path.

**Alternative solutions:** Use a full-screen modal nav on mobile, or convert the sidebar into a top navigation bar.

**Possible follow-up questions from instructor:** How does the drawer close? What happens if the viewport is resized while the drawer is open?

### 14. Explain `aria-current="page"` in the active nav link

**Instructor Question/Task:** Why do you add `aria-current="page"` to the current navigation item?

**Expected Student Answer:** It tells assistive technology which page is active and also helps visually distinguish the current link.

**Technical Explanation:** The server-side or client-side nav builder compares the current page id and adds `aria-current` to the matching link.

**Step-by-step Solution:** Mark the active page in the generated nav markup. Style the active state with background and shadow differences.

**Sample HTML:**
```html
<a class="sidebar-link" href="services.html" aria-current="page">Services</a>
```

**Sample CSS:**
```css
.sidebar-link[aria-current="page"] {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 240, 231, 0.92));
}
```

**Why the solution works:** Users can immediately tell where they are in the site, and screen readers get the same information.

**Common student mistakes:** Using only color to show the active state, or forgetting to update the active link when a new page is added.

**Alternative solutions:** Add an icon or border accent to the current page, or use a separate pill style for the active state.

**Possible follow-up questions from instructor:** Why is `aria-current` better than just changing the text color? What other values can it use?

### 15. Defend the focus-visible patterns

**Instructor Question/Task:** Show how keyboard users can see where focus is on this site.

**Expected Student Answer:** The site uses a consistent `:focus-visible` outline so keyboard users can see the current element without changing the mouse hover style.

**Technical Explanation:** `:focus-visible` avoids showing focus rings for every mouse click while still giving clear keyboard feedback.

**Step-by-step Solution:** Define a global focus ring. Let controls inherit it. Make sure it has enough contrast against the warm background.

**Sample HTML:**
```html
<a class="button button--primary" href="contact.html">Plan Your Wedding</a>
```

**Sample CSS:**
```css
:focus-visible {
  outline: 3px solid rgba(185, 149, 115, 0.52);
  outline-offset: 3px;
}
```

**Why the solution works:** The site remains visually calm for mouse users but still fully usable for keyboard navigation.

**Common student mistakes:** Removing outlines entirely, styling only hover states, or using a focus ring with too little contrast.

**Alternative solutions:** Add component-specific focus rings if the global ring does not fit a certain element.

**Possible follow-up questions from instructor:** Why not use `:focus` everywhere? How does `:focus-visible` help usability?

### 16. Explain lazy loading and image reveal behavior

**Instructor Question/Task:** Why do the images use `loading="lazy"`, and what does the fade-in effect do?

**Expected Student Answer:** Lazy loading delays off-screen images, and the fade-in makes them appear smoothly once they are ready.

**Technical Explanation:** The HTML marks non-critical images as lazy. The script adds `is-loaded` after the image finishes loading, which triggers the CSS transition.

**Step-by-step Solution:** Add `loading="lazy"` to gallery and card images. Use a load listener. Fade opacity and scale into place.

**Sample HTML:**
```html
<img src="assets/images/gallery/reception-1.jpg" loading="lazy" alt="Elegant wedding reception setup" />
```

**Sample CSS:**
```css
img[loading="lazy"] {
  opacity: 0;
  transform: scale(1.02);
}

img.is-loaded {
  opacity: 1;
  transform: none;
}
```

**Why the solution works:** The page feels lighter at first load, and the visual transition makes the interface feel polished.

**Common student mistakes:** Lazy-loading the hero image, forgetting fallback handling when an image fails, or making the transition too dramatic.

**Alternative solutions:** Use a skeleton placeholder, or skip the reveal on images that are above the fold.

**Possible follow-up questions from instructor:** Why should the hero image/video behave differently from gallery thumbnails?

### 17. Explain the reveal animation and reduced-motion fallback

**Instructor Question/Task:** The sections fade in as you scroll. How did you build that effect, and how do you protect users who prefer reduced motion?

**Expected Student Answer:** The script adds `is-visible` when a section enters the viewport, and reduced-motion users get the content immediately without animation.

**Technical Explanation:** `IntersectionObserver` watches elements with the `reveal` class. The CSS transitions opacity and position, but the reduced-motion media query disables the motion.

**Step-by-step Solution:** Mark sections as revealable. Observe them in JavaScript. Remove motion for reduced-motion users.

**Sample HTML:**
```html
<article class="testimonial-card reveal"></article>
```

**Sample CSS:**
```css
.reveal {
  opacity: 0;
  transform: translateY(22px);
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}
```

**Why the solution works:** The page gains subtle motion without making the content harder to use or read.

**Common student mistakes:** Animating too much, forgetting the fallback when `IntersectionObserver` is not supported, or ignoring accessibility preferences.

**Alternative solutions:** Use a simpler opacity-only fade, or skip animation entirely on lower-end devices.

**Possible follow-up questions from instructor:** Why not animate every element? What happens if the browser does not support `IntersectionObserver`?

### 18. Improve the venue card hover zoom

**Instructor Question/Task:** The venue cards zoom their images slightly on hover. Explain why and how you keep it clean.

**Expected Student Answer:** The hover zoom adds a bit of life to the card without changing layout. It is clipped by the image wrapper so it does not break the grid.

**Technical Explanation:** The image is inside an overflow-hidden container. The transform only scales the photo, not the card itself.

**Step-by-step Solution:** Keep the card wrapper fixed. Scale only the image. Use a short transition so the effect feels subtle.

**Sample HTML:**
```html
<article class="venue-card">
  <div class="venue-card__image"><img src="..." alt="" /></div>
</article>
```

**Sample CSS:**
```css
.venue-card:hover .venue-card__image img {
  transform: scale(1.04);
}
```

**Why the solution works:** The card feels interactive while the overall layout stays stable.

**Common student mistakes:** Scaling the entire card, using too much zoom, or forgetting `overflow: hidden`.

**Alternative solutions:** Add a color overlay or a slight shadow lift instead of zooming the image.

**Possible follow-up questions from instructor:** Why is the image wrapper important? How do you avoid layout shift on hover?

### 19. Explain the decorative page hero panel

**Instructor Question/Task:** The page hero has a decorative circle in the corner. How is that built?

**Expected Student Answer:** It uses a pseudo-element so the decoration stays separate from the actual content.

**Technical Explanation:** The hero panel is `position: relative`, and `::after` places the soft radial accent in the background.

**Step-by-step Solution:** Position the hero panel relative. Add a pseudo-element. Keep all real text above it with a higher stacking context.

**Sample HTML:**
```html
<article class="page-hero__panel">
  <h1>We plan weddings with equal parts taste and structure.</h1>
</article>
```

**Sample CSS:**
```css
.page-hero__panel::after {
  content: "";
  position: absolute;
  width: 240px;
  aspect-ratio: 1;
}
```

**Why the solution works:** The decoration looks intentional without adding extra markup or interfering with content.

**Common student mistakes:** Forgetting `position: relative`, putting the accent above the text, or using a decoration that is too strong.

**Alternative solutions:** Use a background image or a full-bleed gradient instead of a pseudo-element.

**Possible follow-up questions from instructor:** Why choose a pseudo-element over another HTML element? How does z-index keep the text readable?

### 20. Explain the gallery filter chips

**Instructor Question/Task:** How do the gallery filters work, and why did you choose button elements instead of links?

**Expected Student Answer:** The chips filter albums on the page, and buttons are correct because they change the current view instead of navigating to a new page.

**Technical Explanation:** Each filter button updates `aria-pressed` and hides or shows `.gallery-item` elements based on category.

**Step-by-step Solution:** Use buttons for each filter. Toggle an active class. Hide the non-matching album cards.

**Sample HTML:**
```html
<button class="filter-chip is-active" type="button" data-gallery-filter="ceremony">Ceremony</button>
```

**Sample CSS:**
```css
.filter-chip.is-active {
  background: rgba(239, 227, 216, 0.72);
  color: var(--text);
}
```

**Why the solution works:** Buttons match the interaction model, and the active state is visible for both visual and assistive technology users.

**Common student mistakes:** Using anchors for a local filtering action, forgetting `aria-pressed`, or hiding items in a way that breaks keyboard flow.

**Alternative solutions:** Add tabs with a tablist pattern, or move filters to a dropdown on very small screens.

**Possible follow-up questions from instructor:** Why do buttons make more sense than links here? How do you keep the active filter obvious?

### 21. Explain the gallery lightbox structure

**Instructor Question/Task:** Show how the gallery opens a lightbox and how you would explain that structure in a defense.

**Expected Student Answer:** The visible album card is a button that opens a modal overlay. The modal contains the image, title, caption, controls, and navigation buttons.

**Technical Explanation:** The lightbox uses a hidden dialog element that becomes visible only after a trigger click. The CSS gives it a fixed fullscreen overlay and the JavaScript fills in the image data.

**Step-by-step Solution:** Use a modal container. Keep the dialog separate from the page flow. Update the image and caption when the user opens a new album item.

**Sample HTML:**
```html
<div class="lightbox" data-lightbox hidden>
  <div class="lightbox__dialog" role="dialog" aria-modal="true"></div>
</div>
```

**Sample CSS:**
```css
.lightbox {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
}
```

**Why the solution works:** The viewer behaves like a proper overlay, stays on top of the page, and keeps gallery browsing focused.

**Common student mistakes:** Using a lightbox that is not hidden at first, forgetting `aria-modal`, or making the overlay too dark to read.

**Alternative solutions:** Replace the modal with a separate gallery detail page or a browser-native dialog element.

**Possible follow-up questions from instructor:** Why is the overlay fixed? How do you close it with the keyboard?

### 22. Explain the hidden gallery source buttons

**Instructor Question/Task:** Why did you place extra buttons inside a visually hidden wrapper in the gallery cards?

**Expected Student Answer:** They store the image set for each album so the lightbox can read a list of sources without hard-coding the data into JavaScript.

**Technical Explanation:** The hidden buttons act like data carriers. The script reads their `data-src`, `data-title`, `data-caption`, and `data-alt` values when the album is opened.

**Step-by-step Solution:** Put the album data inside the card. Hide it visually but keep it in the DOM. Read it when the trigger button is clicked.

**Sample HTML:**
```html
<div class="visually-hidden">
  <button type="button" data-gallery-source data-src="assets/images/gallery/reception-2.jpg"></button>
</div>
```

**Sample CSS:**
```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

**Why the solution works:** The album data stays close to the card that owns it and the lightbox can reuse the same pattern for every set.

**Common student mistakes:** Displaying the hidden data block by accident, storing the wrong image order, or relying on the visible thumbnail only.

**Alternative solutions:** Move the album data into a JSON structure in JavaScript or into `data-*` attributes on the trigger element.

**Possible follow-up questions from instructor:** Why is this approach convenient for your current codebase? What would you change in a larger project?

### 23. Explain the zoom and fullscreen controls in the lightbox

**Instructor Question/Task:** The lightbox has zoom and fullscreen buttons. How would you explain them if asked live?

**Expected Student Answer:** Zoom lets the user inspect details, and fullscreen gives a better view for image-heavy browsing.

**Technical Explanation:** The zoom button toggles an `is-zoomed` class, while the fullscreen button uses the browser fullscreen API on the image viewport.

**Step-by-step Solution:** Provide separate controls for zoom and fullscreen. Make the zoom state visible with `aria-pressed`. Keep the controls large enough for touch interaction.

**Sample HTML:**
```html
<button class="lightbox__button" type="button" data-lightbox-zoom aria-pressed="false">Zoom</button>
```

**Sample CSS:**
```css
.lightbox.is-zoomed .lightbox__stage img {
  transform: scale(1.7);
}
```

**Why the solution works:** Users can inspect the image more closely without leaving the gallery context.

**Common student mistakes:** Making the zoom too extreme, forgetting to reset zoom when the image changes, or not labeling the controls clearly.

**Alternative solutions:** Use only fullscreen if zoom is too much, or replace fullscreen with a larger inline detail view.

**Possible follow-up questions from instructor:** Why does the zoom reset on every new image? What should happen after exiting fullscreen?

### 24. Fix a z-index conflict between the sidebar and the lightbox

**Instructor Question/Task:** If the sidebar and the gallery overlay ever overlap, how do you debug the stacking order?

**Expected Student Answer:** I would check the stacking contexts and make sure the lightbox stays above the sidebar with a higher z-index.

**Technical Explanation:** The sidebar is fixed at a lower z-index than the fullscreen lightbox. The body class also locks scrolling when the overlay is open.

**Step-by-step Solution:** Compare the z-index values. Keep overlay components above navigation shells. Test the open states together.

**Sample HTML:**
```html
<div class="lightbox" data-lightbox hidden></div>
<aside class="sidebar"></aside>
```

**Sample CSS:**
```css
.sidebar { z-index: 40; }
.lightbox { z-index: 90; }
```

**Why the solution works:** The gallery viewer remains the top-most interactive layer and navigation does not block it.

**Common student mistakes:** Setting the z-index on an element without a position, or forgetting that transform and opacity can create new stacking contexts.

**Alternative solutions:** Move the sidebar behind the overlay with a body state class or render the lightbox in a portal-like root.

**Possible follow-up questions from instructor:** What creates a stacking context? Why is the overlay higher than the sidebar?

### 25. Explain the contact form accessibility pattern

**Instructor Question/Task:** What makes the contact form accessible, and how would you explain the structure?

**Expected Student Answer:** Every input has a label, the form has clear grouping, and the status message can announce success or errors.

**Technical Explanation:** The form uses native form elements, a `role="status"` message, and visible labels. The structure supports both keyboard users and browser validation.

**Step-by-step Solution:** Keep each label tied to an input with `for` and `id`. Use field groups for layout. Provide a live status area below the button.

**Sample HTML:**
```html
<div class="field">
  <label for="email">Email address</label>
  <input id="email" name="email" type="email" required />
</div>
```

**Sample CSS:**
```css
.field {
  display: grid;
  gap: 0.45rem;
}
```

**Why the solution works:** The form is understandable without relying on placeholder text alone.

**Common student mistakes:** Using placeholders as labels, leaving the success message visually hidden, or forgetting to group fields consistently.

**Alternative solutions:** Use fieldsets and legends for more complex forms, or split the form into steps if it becomes longer.

**Possible follow-up questions from instructor:** Why is `role="status"` used here? What happens if a field is missing its label?

### 26. Explain the built-in validation attributes

**Instructor Question/Task:** Why did you use `type="email"`, `type="date"`, `required`, `min`, and `step` on the form?

**Expected Student Answer:** They let the browser help validate the form before the script runs, which reduces user mistakes.

**Technical Explanation:** Native input types and constraints catch many errors automatically and make the form easier to use on mobile keyboards.

**Step-by-step Solution:** Choose the correct input type. Add `required` to essential fields. Set numeric limits for budget and guest count.

**Sample HTML:**
```html
<input id="budget" name="budget" type="number" min="50000" step="1000" required />
```

**Sample CSS:**
```css
.field input:focus {
  box-shadow: 0 0 0 4px rgba(185, 149, 115, 0.14);
}
```

**Why the solution works:** Native constraints reduce invalid submissions and improve the input experience on touch devices.

**Common student mistakes:** Using the wrong input type, forgetting minimum values, or assuming browser validation replaces all checks.

**Alternative solutions:** Add custom validation messages only when you need more control over copy and timing.

**Possible follow-up questions from instructor:** Why is `type="number"` better than text here? Why still validate on the script side?

### 27. Explain the honeypot anti-spam field

**Instructor Question/Task:** What is the hidden `website` field in the contact form for?

**Expected Student Answer:** It is a honeypot field that traps simple spam bots without bothering real users.

**Technical Explanation:** The field is hidden visually and should stay empty. If it is filled, the backend treats the request as harmless and does not deliver it.

**Step-by-step Solution:** Add a hidden text field. Keep it out of the visual flow. Check it server-side before sending the email.

**Sample HTML:**
```html
<input class="visually-hidden" type="text" name="website" tabindex="-1" autocomplete="off" />
```

**Sample CSS:**
```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
}
```

**Why the solution works:** Basic spam bots often fill every text field, but real users never see or interact with it.

**Common student mistakes:** Hiding the field incorrectly, giving it a visible label, or forgetting to check it in the backend handler.

**Alternative solutions:** Use CAPTCHA, stricter rate limiting, or an email service with built-in spam filtering.

**Possible follow-up questions from instructor:** Why not rely on the honeypot alone? What is the tradeoff with CAPTCHA?

### 28. Explain the live form status message

**Instructor Question/Task:** How does the user know whether the inquiry was sent successfully or not?

**Expected Student Answer:** The status message below the submit button updates with a success or error state after submission.

**Technical Explanation:** The message uses `role="status"` and `aria-live="polite"` so assistive technologies can announce updates without disrupting the page.

**Step-by-step Solution:** Reserve a message area in the form. Update the text after submission. Use success and error colors that match the theme.

**Sample HTML:**
```html
<p class="status-message" role="status" aria-live="polite" data-form-status></p>
```

**Sample CSS:**
```css
.status-message[data-state="success"] {
  color: var(--success);
  background: rgba(219, 239, 226, 0.64);
}
```

**Why the solution works:** Users get direct feedback without needing a page reload.

**Common student mistakes:** Clearing the status too early, using color alone without text, or hiding the message from screen readers.

**Alternative solutions:** Use toast notifications, a redirect to a thank-you page, or inline step confirmation.

**Possible follow-up questions from instructor:** Why use `polite` instead of `assertive`? How do you style the status for both themes?

### 29. Make the budget table responsive

**Instructor Question/Task:** The calculator table has four columns. How do you keep it usable on narrow screens?

**Expected Student Answer:** I would wrap the table in a scroll container and give the table a minimum width so the columns do not crush each other.

**Technical Explanation:** Tables are naturally rigid. A wrapper with `overflow: auto` lets the user scroll horizontally when the screen is too small.

**Step-by-step Solution:** Keep the table semantic. Wrap it in a scrollable container. Preserve readable column sizes.

**Sample HTML:**
```html
<div class="budget-table-wrap">
  <table class="budget-table"></table>
</div>
```

**Sample CSS:**
```css
.budget-table-wrap {
  overflow: auto;
}

.budget-table {
  min-width: 520px;
}
```

**Why the solution works:** The table remains legible instead of collapsing into unreadable columns.

**Common student mistakes:** Trying to force the table into one tiny row, removing semantic table markup, or hiding the overflow without a scroll path.

**Alternative solutions:** Convert the rows into stacked cards on mobile, or show only the most important columns below a breakpoint.

**Possible follow-up questions from instructor:** Why keep the table instead of converting it to divs? What is the downside of horizontal scrolling?

### 30. Explain the semantic page structure

**Instructor Question/Task:** Why do you use `main`, `section`, `article`, `aside`, and `footer` across the pages?

**Expected Student Answer:** The structure helps organize the content logically and makes it easier for users and screen readers to understand the page.

**Technical Explanation:** Each element has a role: `main` holds the unique page content, `section` groups topics, `article` wraps independent cards, and `aside` holds supporting content like the hero panel or sidebar CTA.

**Step-by-step Solution:** Use landmarks for page-wide structure. Use sections for topical groups. Use articles for content blocks that could stand alone.

**Sample HTML:**
```html
<main>
  <section>
    <article></article>
  </section>
</main>
```

**Sample CSS:**
```css
section {
  padding: 2rem 0 4rem;
}
```

**Why the solution works:** Semantic markup improves accessibility, source readability, and future maintenance.

**Common student mistakes:** Putting everything inside generic `div`s, using `article` for purely decorative wrappers, or skipping landmarks entirely.

**Alternative solutions:** Use `div` only when there is no meaningful semantic element available.

**Possible follow-up questions from instructor:** What is the difference between `section` and `article`? Why is `aside` appropriate for the hero panel?

### 31. Explain the about page metrics grid

**Instructor Question/Task:** The About page shows four stat cards. How would you defend the layout choice?

**Expected Student Answer:** The metrics give the page quick proof points and the grid keeps them aligned neatly without feeling cramped.

**Technical Explanation:** The metric cards use a responsive grid with a compact minimum width so they wrap cleanly on smaller screens.

**Step-by-step Solution:** Group the numbers in cards. Place them in a grid. Let the cards collapse into fewer columns on mobile.

**Sample HTML:**
```html
<div class="metric-grid metric-grid--compact">
  <article class="metric-card surface-card"></article>
</div>
```

**Sample CSS:**
```css
.metric-grid--compact {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}
```

**Why the solution works:** The stats stay readable and balanced across different viewport sizes.

**Common student mistakes:** Using a fixed four-column grid, making the text too small, or forgetting to space the cards consistently.

**Alternative solutions:** Replace the stat cards with a simple list if the page needs a quieter look.

**Possible follow-up questions from instructor:** Why include numbers here at all? What information should a stat card prioritize?

### 32. Explain the team cards and role badges

**Instructor Question/Task:** The About page has four team cards with role badges and bullet lists. Why structure them this way?

**Expected Student Answer:** It makes each person easy to scan and separates the role, name, summary, and responsibilities clearly.

**Technical Explanation:** The role badge uses a pill style, the card heading names the person, and the list breaks responsibilities into readable chunks.

**Step-by-step Solution:** Put the role at the top. Follow with the name and short explanation. Use a list for the specific tasks each person handles.

**Sample HTML:**
```html
<article class="team-card">
  <span class="team-card__role">Lead planner</span>
  <h3>Edcel Mae De Vera</h3>
</article>
```

**Sample CSS:**
```css
.team-card__role {
  border-radius: 999px;
  text-transform: uppercase;
}
```

**Why the solution works:** Users can understand each team member quickly without reading a long paragraph.

**Common student mistakes:** Putting too much text in one block, making the role badge look like a button, or forgetting list semantics.

**Alternative solutions:** Use profile cards with photos if the project later adds team portraits.

**Possible follow-up questions from instructor:** Why is a list better than a paragraph here? What do the role badges communicate?

### 33. Explain the testimonial cards and footer hierarchy

**Instructor Question/Task:** How do the testimonial cards stay readable, and why is the footer used inside each one?

**Expected Student Answer:** The cards keep the quote text separated from the client name, and the footer visually marks the attribution.

**Technical Explanation:** The testimonial card uses a heading, a paragraph, and a footer element for the client name and context.

**Step-by-step Solution:** Make the quote content prominent. Keep the attribution at the bottom. Use smaller text for the location or event type.

**Sample HTML:**
```html
<article class="testimonial-card">
  <h3>Calm from start to finish</h3>
  <footer>Camille &amp; Enrique <small>Cathedral ceremony</small></footer>
</article>
```

**Sample CSS:**
```css
.testimonial-card footer {
  margin-top: 0.95rem;
  font-weight: 800;
}
```

**Why the solution works:** The structure separates testimony from attribution and keeps the card easy to scan.

**Common student mistakes:** Putting the citation in the same paragraph as the quote or making the attribution too visually loud.

**Alternative solutions:** Use a blockquote pattern if the instructor wants stricter quotation semantics.

**Possible follow-up questions from instructor:** Should the quote be a `blockquote` instead? Why did you choose the current structure?

### 34. Explain the services package cards and price pills

**Instructor Question/Task:** The Services page shows package cards with a price tag aligned to the top. How would you defend that layout?

**Expected Student Answer:** It keeps the package name, description, and price visible at a glance, which helps couples compare options quickly.

**Technical Explanation:** The card top section uses Flexbox to separate the text block from the price pill while allowing wrapping on smaller screens.

**Step-by-step Solution:** Create a top row for the package title and price. Let the text area grow. Keep the price in a non-breaking pill.

**Sample HTML:**
```html
<div class="package-card__top">
  <span class="package-card__price">PHP 120,000 - 240,000</span>
</div>
```

**Sample CSS:**
```css
.package-card__top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
```

**Why the solution works:** The card presents important pricing information without breaking the hierarchy of the content.

**Common student mistakes:** Letting the price wrap awkwardly, making it too small, or placing it far away from the package title.

**Alternative solutions:** Move the price below the title if the layout becomes too tight on mobile.

**Possible follow-up questions from instructor:** Why is the price given a pill shape? What happens when the text wraps?

### 35. Explain the venue cards and metadata pills

**Instructor Question/Task:** Why do the venue cards include short metadata pills like guest count and weather notes?

**Expected Student Answer:** They let users compare venues quickly without reading the full paragraph on every card.

**Technical Explanation:** The pills provide scannable facts and the image area stays visually strong because the body content remains compact.

**Step-by-step Solution:** Keep the venue image at the top. Add a short summary. Finish with metadata pills that represent practical decisions.

**Sample HTML:**
```html
<div class="venue-card__meta">
  <span class="pill">120 to 180 guests</span>
  <span class="pill">Rain plan required</span>
</div>
```

**Sample CSS:**
```css
.pill {
  border-radius: 999px;
  background: rgba(239, 227, 216, 0.56);
}
```

**Why the solution works:** The user gets quick logistical information at the exact point where they are comparing options.

**Common student mistakes:** Making the pills too verbose, using them for redundant text, or stacking too many tags on one card.

**Alternative solutions:** Replace the pills with icons and labels if the design shifts toward a more minimal style.

**Possible follow-up questions from instructor:** What makes a good venue comparison card? How do these pills help decision-making?

### 36. Explain the homepage editorial cards

**Instructor Question/Task:** The homepage has three editorial cards with images and short copy. Why use this structure?

**Expected Student Answer:** It breaks the wedding experience into ceremony, reception, and details so the message is easy to understand.

**Technical Explanation:** Each card combines a cropped image and a short content block, which keeps the homepage elegant and quick to scan.

**Step-by-step Solution:** Use a consistent image ratio. Keep the copy short. Match the card title to the section label so the structure feels deliberate.

**Sample HTML:**
```html
<article class="editorial-card">
  <div class="editorial-card__image"><img src="..." alt="..." /></div>
</article>
```

**Sample CSS:**
```css
.editorial-card__image {
  aspect-ratio: 1 / 0.95;
  overflow: hidden;
}
```

**Why the solution works:** The cards feel like a curated editorial set instead of a random image gallery.

**Common student mistakes:** Letting the images use inconsistent aspect ratios or writing too much text in each card.

**Alternative solutions:** Make the cards larger and reduce the number of images if you want a more minimal homepage.

**Possible follow-up questions from instructor:** Why did you separate ceremony, reception, and details? What makes the card layout feel premium?

### 37. Explain the signature banner CTA section

**Instructor Question/Task:** The bottom call-to-action banner appears on multiple pages. What is its role?

**Expected Student Answer:** It gives the user one final decision point and keeps the messaging consistent across the site.

**Technical Explanation:** The signature banner reuses a strong heading, short copy, and two buttons so the closing area feels intentional and unified.

**Step-by-step Solution:** Make the message short and persuasive. Keep the buttons obvious. Use the same card styling as the rest of the site for consistency.

**Sample HTML:**
```html
<div class="signature-banner">
  <h2>Your wedding can feel elevated and easy at the same time.</h2>
</div>
```

**Sample CSS:**
```css
.signature-banner {
  border-radius: 36px;
  box-shadow: var(--clay-shadow), var(--clay-inset);
}
```

**Why the solution works:** The closing section gives the user a final path to contact or services without feeling abrupt.

**Common student mistakes:** Making the CTA too wordy, using too many buttons, or letting the banner visually compete with the hero.

**Alternative solutions:** Use a smaller footer CTA or a simple text link if the page needs less emphasis.

**Possible follow-up questions from instructor:** Why repeat the CTA on multiple pages? When should a CTA be stronger or softer?

### 38. Explain the external social links

**Instructor Question/Task:** Why do the social links use `target="_blank"` and `rel="noreferrer"`?

**Expected Student Answer:** They open in a new tab so the user does not leave the site, and `rel="noreferrer"` is a safety practice for external links.

**Technical Explanation:** The contact page is intentionally keeping the main inquiry page available while linking to outside social platforms.

**Step-by-step Solution:** Use clear anchor text. Add the target and rel attributes. Keep the link styles visually consistent with the rest of the contact page.

**Sample HTML:**
```html
<a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
```

**Sample CSS:**
```css
.social-list a {
  border-radius: 999px;
  box-shadow: var(--clay-inset);
}
```

**Why the solution works:** The user can inspect social channels without losing context on the main website.

**Common student mistakes:** Forgetting `rel`, making the links too small, or styling them so they look like plain text.

**Alternative solutions:** Open the links in the same tab if the presentation prefers a simpler navigation model.

**Possible follow-up questions from instructor:** Why not make them buttons? Why is external-link behavior important to mention?

### 39. Explain the embedded Google Map

**Instructor Question/Task:** Why did you include an embedded map on the contact page?

**Expected Student Answer:** It helps users quickly understand where the studio is based and makes the contact page more useful.

**Technical Explanation:** The iframe is labeled with a descriptive title and lazy-loaded so it does not slow the initial page load.

**Step-by-step Solution:** Use a short, descriptive title. Keep the iframe in a framed card. Make sure the map height is stable.

**Sample HTML:**
```html
<iframe
  src="https://www.google.com/maps?q=Bonifacio%20Global%20City%2C%20Taguig&z=14&output=embed"
  title="Map showing Bonifacio Global City in Taguig"
  loading="lazy"></iframe>
```

**Sample CSS:**
```css
.map-card iframe {
  width: 100%;
  min-height: 360px;
}
```

**Why the solution works:** The map is informative but still behaves like a contained contact detail rather than a disruptive embed.

**Common student mistakes:** Leaving the iframe untitled, letting it collapse in height, or making it dominate the page.

**Alternative solutions:** Replace the map with a simple address block if the panel wants a lighter page.

**Possible follow-up questions from instructor:** Why is a title important on an iframe? When would you avoid embedding a map?

### 40. Identify the naming consistency issues in the codebase

**Instructor Question/Task:** What class names or modifiers look inconsistent or unused in the current codebase?

**Expected Student Answer:** Some HTML modifiers like `hero--landing`, `skip-link--global`, and `gallery-grid--albums` do not have matching CSS rules, so they do not add visible styling right now.

**Technical Explanation:** These classes do not break the site, but they can confuse reviewers because the markup suggests a modifier system that is only partially implemented.

**Step-by-step Solution:** Keep only the modifier classes that are actually used. Add CSS for any intentional modifiers. Remove or rename classes that do not serve a purpose.

**Sample HTML:**
```html
<section class="hero reveal">
```

**Sample CSS:**
```css
/* Add a real modifier only when it changes styling */
.hero--landing {
  min-height: 100svh;
}
```

**Why the solution works:** The source becomes easier to read and the intent behind each class is clearer.

**Common student mistakes:** Leaving empty modifier classes around, creating names that never receive styles, or making the naming system inconsistent across pages.

**Alternative solutions:** Keep the classes if they are planned hooks for future work, but be ready to explain that clearly.

**Possible follow-up questions from instructor:** Why not remove these classes? How do you decide when a modifier class is worth keeping?

### 41. Clean up the repeated 1200px media query

**Instructor Question/Task:** I noticed two separate `@media (max-width: 1200px)` blocks. Would you keep them or merge them?

**Expected Student Answer:** I would usually merge related rules if they affect the same area, because it keeps the breakpoint easier to maintain.

**Technical Explanation:** The current file is valid CSS, but duplicate breakpoint blocks can hide related layout logic in different places.

**Step-by-step Solution:** Group breakpoint changes by feature or by breakpoint. Move the related hero and showcase rules together if they belong to the same responsive behavior.

**Sample HTML:**
```html
<div class="showcase-card__grid">
  <img src="..." alt="" />
</div>
```

**Sample CSS:**
```css
@media (max-width: 1200px) {
  .hero__content {
    grid-template-columns: 1fr;
  }

  .showcase-card__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

**Why the solution works:** The breakpoint becomes easier to scan during live edits and the responsive behavior is grouped more logically.

**Common student mistakes:** Moving one rule and forgetting the other, or creating too many tiny media query blocks with no clear organization.

**Alternative solutions:** Keep separate blocks if the file is intentionally organized by component, but explain that structure clearly.

**Possible follow-up questions from instructor:** Is duplicate breakpoint code wrong? How do you decide between grouping by breakpoint and grouping by component?

### 42. Explain the sidebar collapsed state on desktop

**Instructor Question/Task:** How does the desktop sidebar collapse and remember its state?

**Expected Student Answer:** The body gets a `sidebar-collapsed` class and the script stores that preference in localStorage.

**Technical Explanation:** The CSS shrinks the sidebar width and shifts the site content margin. On reload, the script reads the saved state and restores it.

**Step-by-step Solution:** Toggle a body class. Store the setting. Hide the expanded sidebar content when collapsed.

**Sample HTML:**
```html
<body class="page" data-page="home">
```

**Sample CSS:**
```css
body.sidebar-collapsed .sidebar {
  width: var(--sidebar-collapsed);
}
```

**Why the solution works:** Users keep their preferred navigation density, which is a nice usability detail for a multipage site.

**Common student mistakes:** Applying the collapsed state on mobile, forgetting to restore the content visibility, or making the expanded panel unusable.

**Alternative solutions:** Remove the collapsed mode entirely and keep one persistent desktop sidebar if simplicity is preferred.

**Possible follow-up questions from instructor:** Why use localStorage here? What happens if storage is blocked?

### 43. Explain the full-width page content wrapper

**Instructor Question/Task:** Why does `.page-main > :not(.hero)` get a different width rule from the hero?

**Expected Student Answer:** The hero is meant to be full-bleed inside its own rounded frame, while the rest of the sections stay within a centered content width.

**Technical Explanation:** The selector keeps most sections constrained to the design container but allows the hero to use its own full presentation.

**Step-by-step Solution:** Let the hero handle its own sizing. Give the remaining sections a shared max width and automatic centering.

**Sample HTML:**
```html
<main class="page-main">
  <section class="hero"></section>
  <section class="section"></section>
</main>
```

**Sample CSS:**
```css
.page-main > :not(.hero) {
  width: min(100%, 1260px);
  margin-inline: auto;
}
```

**Why the solution works:** The page gets a strong opening section and a calmer content rhythm below it.

**Common student mistakes:** Applying the same width rule to the hero, which can make it feel cramped, or forgetting to center the remaining sections.

**Alternative solutions:** Wrap all non-hero content in a dedicated container element instead of using a child selector.

**Possible follow-up questions from instructor:** Why use a selector like this instead of a wrapper div? What would happen if the hero also got the same width cap?

### 44. Explain the mobile spacing adjustments

**Instructor Question/Task:** What do you change in the 760px and 580px breakpoints to keep the page comfortable on phones?

**Expected Student Answer:** I reduce the side padding, shrink large headings, and stack dense control groups so the layout breathes on smaller screens.

**Technical Explanation:** The mobile breakpoints adjust padding, border radius, hero sizing, form grids, and control alignment.

**Step-by-step Solution:** Tighten the horizontal padding. Reduce oversized typography. Stack multi-control rows into a single column where necessary.

**Sample HTML:**
```html
<div class="hero__controls">
  <button class="hero-control">Pause video</button>
</div>
```

**Sample CSS:**
```css
@media (max-width: 580px) {
  .hero__controls {
    flex-direction: column;
  }
}
```

**Why the solution works:** The site avoids cramped controls and keeps touch targets large enough to use comfortably.

**Common student mistakes:** Forgetting to adjust padding, leaving button rows too wide, or shrinking text until it becomes hard to read.

**Alternative solutions:** Use larger breakpoints or a more aggressive stacked layout if the content density increases.

**Possible follow-up questions from instructor:** Why are there two nearby mobile breakpoints instead of one? Which parts of the page need the most spacing control?

### 45. Explain the difference between buttons and links on this site

**Instructor Question/Task:** Why are some actions buttons and some links, and how do you defend that choice?

**Expected Student Answer:** Links go to a new page or section, while buttons trigger an action like opening the lightbox, filtering albums, or collapsing the sidebar.

**Technical Explanation:** The HTML uses semantic controls so each element matches its behavior, which helps accessibility and keeps the code understandable.

**Step-by-step Solution:** Use anchors for navigation. Use buttons for on-page actions. Keep the visual style similar so the difference is semantic, not just cosmetic.

**Sample HTML:**
```html
<a class="button button--primary" href="contact.html">Plan Your Wedding</a>
<button class="filter-chip" type="button">Ceremony</button>
```

**Sample CSS:**
```css
.button,
.filter-chip {
  border-radius: 999px;
}
```

**Why the solution works:** The browser and assistive technologies understand the interaction model correctly.

**Common student mistakes:** Using buttons for navigation or links for actions that do not actually navigate.

**Alternative solutions:** Convert some button-like actions into `<a>` tags only if they truly lead somewhere.

**Possible follow-up questions from instructor:** Why does a modal opener need to be a button? When should a link look like a button?

### 46. Debug horizontal overflow on the calculator and hero

**Instructor Question/Task:** If a small screen gets a horizontal scrollbar, where would you look first?

**Expected Student Answer:** I would inspect the hero, the calculator table, and any fixed-width wrappers or long content that may be wider than the viewport.

**Technical Explanation:** The calculator table intentionally uses a minimum width, and the hero panel or buttons can also overflow if widths are not reset correctly.

**Step-by-step Solution:** Check the offending element in dev tools. Look for `min-width`, large padding, or a flex child refusing to shrink. Use responsive wrappers where needed.

**Sample HTML:**
```html
<div class="budget-table-wrap">
  <table class="budget-table"></table>
</div>
```

**Sample CSS:**
```css
.budget-table-wrap {
  overflow: auto;
}
```

**Why the solution works:** The table can scroll in its own container instead of stretching the whole page.

**Common student mistakes:** Hiding the overflow on the body, which masks the bug instead of solving it, or reducing the table width so far that it becomes unreadable.

**Alternative solutions:** Stack the table rows into cards, or remove the nonessential columns at small widths.

**Possible follow-up questions from instructor:** How do you find the element causing overflow? Why is body-level overflow hiding usually a bad fix?

### 47. Explain `object-fit: cover` and image aspect ratios

**Instructor Question/Task:** Why do the gallery, venue, and editorial images use fixed aspect-ratio containers?

**Expected Student Answer:** It keeps the cards aligned and makes the images crop consistently without distortion.

**Technical Explanation:** The wrapper defines the shape, and `object-fit: cover` lets the image fill that shape while keeping its proportions.

**Step-by-step Solution:** Set the aspect ratio on the image container. Place the image inside. Let the image crop instead of stretching.

**Sample HTML:**
```html
<div class="venue-card__image">
  <img src="assets/images/venues/beach-venue.jpg" alt="Beach wedding venue" />
</div>
```

**Sample CSS:**
```css
.venue-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**Why the solution works:** The cards stay visually consistent and the page feels organized instead of uneven.

**Common student mistakes:** Using the image without a shaped wrapper, stretching the image with explicit width and height, or forgetting the crop effect.

**Alternative solutions:** Use `object-position` to shift the focal point, or choose a gallery layout that accepts more varied image proportions.

**Possible follow-up questions from instructor:** What is the difference between `cover` and `contain`? Why does the wrapper matter?

### 48. Explain CSS specificity and shared card styles

**Instructor Question/Task:** Many cards share the same styling. How do you prevent the CSS from becoming messy?

**Expected Student Answer:** I use shared component classes for the common card structure and add small modifier classes only when a section needs a different surface or spacing.

**Technical Explanation:** The stylesheet combines general card rules with section-specific variants like `surface-card--soft` and `calculator-card--intro`.

**Step-by-step Solution:** Define the base card style first. Add only the differences later. Avoid repeating the same padding, shadow, and border declarations everywhere.

**Sample HTML:**
```html
<article class="feature-card surface-card--soft"></article>
```

**Sample CSS:**
```css
.feature-card,
.venue-card,
.testimonial-card {
  border-radius: var(--radius-lg);
}
```

**Why the solution works:** The design remains consistent and easier to maintain.

**Common student mistakes:** Overusing highly specific selectors, duplicating entire card blocks, or overriding styles in ways that are hard to undo.

**Alternative solutions:** Use utility classes for repeated spacing, or split the CSS into component files if the project grows.

**Possible follow-up questions from instructor:** What is the danger of over-specific selectors? Why is reusable styling important in a defense?

### 49. Explain the lack of a static navigation fallback

**Instructor Question/Task:** What happens if JavaScript fails and how would you respond in a defense?

**Expected Student Answer:** The page content still loads, but the sidebar, top bar, and footer shell are missing because they are injected by JavaScript.

**Technical Explanation:** The current architecture is progressive enhancement for content, but the shared navigation is still script-dependent. That is a valid tradeoff, but it should be acknowledged.

**Step-by-step Solution:** Explain the current limitation honestly. Mention that a static fallback nav or server-rendered shell would be the next improvement.

**Sample HTML:**
```html
<div class="site-shell" data-shell-root>
  <main id="main-content" data-main></main>
</div>
```

**Sample CSS:**
```css
.site-shell {
  min-height: 100vh;
}
```

**Why the solution works:** The page body still has content, but the shared navigation enhancement depends on the script running.

**Common student mistakes:** Pretending the limitation does not exist, or claiming the site is fully static when part of the shell is generated dynamically.

**Alternative solutions:** Write the shell into each HTML file, or use a templating system so the navigation exists without JavaScript.

**Possible follow-up questions from instructor:** How would you add a no-JS fallback? Why might the current approach still be acceptable for a school project?

### 50. Explain how to defend the project's architecture under pressure

**Instructor Question/Task:** If the panel challenges the codebase, what is the core defense of this project?

**Expected Student Answer:** The project is intentionally built around a calm luxury wedding brand, and every layout choice supports clarity, readability, and guided action.

**Technical Explanation:** The site balances emotional presentation and practical navigation with semantic HTML, a reusable CSS system, responsive grids, and targeted enhancements for the gallery, calculator, and contact flow.

**Step-by-step Solution:** Return to the design goal. Explain the layout system. Point to the user journey from inspiration to inquiry. Admit tradeoffs honestly when they exist.

**Sample HTML:**
```html
<main id="main-content">
  <section class="section"></section>
</main>
```

**Sample CSS:**
```css
.section {
  padding: 2rem 0 4rem;
}
```

**Why the solution works:** It keeps the discussion focused on real implementation choices instead of vague style preferences.

**Common student mistakes:** Getting defensive, overexplaining minor details, or losing the thread of the user experience.

**Alternative solutions:** If needed, explain the next iteration plan: stronger no-JS fallback, cleaner anchor targets, and smaller CSS repetition.

**Possible follow-up questions from instructor:** Why is this website valuable? What would you improve next if you had more time?

## Rapid Fire Oral Questions

1. Why did you use a skip link on every page?
2. What is the purpose of `data-page` in the body tag?
3. Why is the navigation shell created with JavaScript instead of duplicated in HTML?
4. What is the difference between `article` and `section`?
5. Why is the hero video muted by default?
6. What does `prefers-reduced-motion` protect users from?
7. Why are the homepage cards built with Grid?
8. Why is Flexbox better for the button group?
9. What does `repeat(auto-fit, minmax(...))` do?
10. Why do the venue cards have aspect-ratio wrappers?
11. What is the purpose of `object-fit: cover`?
12. Why are gallery cards buttons instead of anchors?
13. What does `aria-current="page"` tell assistive tech?
14. Why is `aria-pressed` used on the gallery filters?
15. What is the purpose of the lightbox overlay?
16. Why is the lightbox hidden by default?
17. Why did you add a honeypot field to the contact form?
18. Why are form labels more reliable than placeholders?
19. Why is the budget table wrapped in a scroll container?
20. Why should the services link to `#budget-calculator` be fixed?
21. What is the advantage of CSS variables in `:root`?
22. Why use a script font sparingly?
23. What does `scroll-margin-top` help with?
24. Why does the sidebar collapse on desktop?
25. Why does the sidebar become a drawer on mobile?
26. What is the purpose of the backdrop button?
27. Why do the social links open in a new tab?
28. Why is the map iframe lazy-loaded?
29. Why do some cards reuse the same base style?
30. What would you improve first if you had one more day?

## Most Important HTML Concepts to Memorize

1. Semantic landmarks: `main`, `header`, `nav`, `section`, `article`, `aside`, and `footer`.
2. Accessible forms with `label`, `id`, `required`, and correct input types.
3. Buttons vs links and when each one should be used.
4. `alt` text for images and meaningful media descriptions.
5. `aria-current`, `aria-pressed`, `aria-live`, and `aria-modal`.
6. `hidden`, `loading="lazy"`, and `playsinline`.
7. `iframe` titles and other embedded content labels.
8. Fragment links and matching ids.
9. `data-*` attributes for structured hooks.
10. The difference between visible content and assistive-only content.

## Most Important CSS Concepts to Memorize

1. CSS custom properties in `:root`.
2. Grid layouts with `repeat(auto-fit, minmax(...))`.
3. Flexbox for alignment and spacing.
4. Responsive breakpoints at `1200px`, `1024px`, `760px`, and `580px`.
5. `object-fit: cover` for consistent image cards.
6. `position: fixed`, `sticky`, and `relative`.
7. `z-index` and stacking contexts.
8. `overflow: auto`, `hidden`, and `clip`.
9. `:focus-visible` and visible keyboard states.
10. `prefers-reduced-motion` for accessibility.

## Most Common Live Coding Tasks

1. Add a missing section id for an anchor link.
2. Convert an inline style into a reusable class.
3. Stack a two-column layout on mobile.
4. Increase spacing in a cramped section.
5. Rework a grid so cards stay readable.
6. Add a hover effect without causing layout shift.
7. Fix image cropping with a wrapper and `object-fit`.
8. Improve button and link semantics.
9. Add or adjust a focus style.
10. Fix an overflow issue on small screens.
11. Make a modal or drawer behave correctly.
12. Clean up repeated CSS rules.

## Emergency Debugging Checklist

1. Check whether the HTML target actually exists.
2. Confirm the correct `id`, class, or `data-*` hook.
3. Inspect the layout in dev tools for overflow or fixed widths.
4. Test the page at desktop, tablet, and mobile widths.
5. Verify that hover-only designs still work with keyboard focus.
6. Look for repeated or conflicting media queries.
7. Check z-index order if an overlay disappears behind content.
8. Confirm images have a wrapper and `object-fit` when needed.
9. Test the page with reduced motion turned on.
10. Reload after a change if JavaScript injects the shell or state.

## Common Instructor Traps

1. Asking why a link goes nowhere because the target id is missing.
2. Asking why a button is used when a link would be more semantic, or vice versa.
3. Asking you to explain a layout rule that only works on desktop.
4. Asking what breaks if JavaScript is disabled.
5. Asking why the site uses multiple fonts.
6. Asking why the page does not use a framework.
7. Asking why the lightbox or nav is controlled by buttons.
8. Asking about specificity when a shared class seems not to update.
9. Asking why a section scrolls under the sticky top bar.
10. Asking how you would improve the site if it needed a future version.

## Defense Survival Tips

1. Always answer with the project goal first, then the technical detail.
2. If you make a small mistake, fix it calmly and continue.
3. Keep your explanations tied to the actual page in front of you.
4. Mention tradeoffs honestly instead of pretending everything is perfect.
5. Use the visual result to support your explanation.
6. When unsure, fall back to semantic HTML, reusable CSS, and responsive layout logic.
7. Be ready to show the change live in the editor instead of only describing it.
8. If the instructor asks for a redesign, keep the site's luxury wedding tone intact.

## Confidence Tips During Live Coding

1. Say what you are changing before you type.
2. Make one edit at a time so the panel can follow.
3. Refresh or recheck the page after each meaningful change.
4. Keep your syntax simple during the defense.
5. Use the same naming pattern already present in the project.
6. If you get nervous, return to the sentence: "This change improves clarity and responsiveness."
