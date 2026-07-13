# DevMentors UI Kit & Design System
## Complete Design Documentation

---

## 🎨 Design Overview

This design system is based on a **dark, modern aesthetic** with teal/cyan accents, inspired by developer tools and modern SaaS products. The design emphasizes:
- Dark mode first
- High contrast for readability
- Animated gradients and subtle interactions
- Dense, information-rich layouts
- Large, bold typography

---

## 🌈 Color System

### Primary Colors
```css
/* Background Colors */
--color-bg-primary: #000000        /* Pure black - main background */
--color-bg-secondary: #0a0a0a      /* Near black - cards */
--color-bg-tertiary: #1a1a1a       /* Dark gray - borders/dividers */

/* Text Colors */
--color-text-primary: #f9f9f9      /* Almost white - headings */
--color-text-secondary: #999999    /* Medium gray - body text */
--color-text-tertiary: #666666     /* Dark gray - muted text */

/* Brand/Accent Colors */
--color-accent-primary: #48BDB8    /* Teal/cyan - primary accent */
--color-accent-light: #5ed4cf      /* Light teal - gradient stops */
--color-accent-dark: #2a2a2a       /* Dark gray - secondary buttons */
```

### Gradient System
```css
/* Hero Gradient */
background: radial-gradient(
    circle at 50% 50%,
    rgba(72, 189, 184, 0.08) 0%,
    transparent 70%
);

/* Text Gradient (Animated) */
background: linear-gradient(
    135deg,
    #48BDB8 0%,
    #5ed4cf 50%,
    #48BDB8 100%
);
background-size: 200% auto;
animation: shimmer 3s linear infinite;

/* Card/Section Gradient */
background: linear-gradient(
    135deg,
    rgba(72, 189, 184, 0.05) 0%,
    transparent 100%
);

/* CTA Hover Gradient */
background: linear-gradient(
    135deg,
    rgba(72, 189, 184, 0.1) 0%,
    transparent 100%
);
```

### Color Usage Guidelines
- **Background**: Pure black (#000) for main sections
- **Cards**: Near-black (#0a0a0a) with #1a1a1a borders
- **Primary CTAs**: Teal (#48BDB8) with black text
- **Secondary CTAs**: Transparent with teal border
- **Text**: High contrast - #f9f9f9 on black
- **Accents**: Teal for interactive elements, hover states

---

## 📐 Typography System

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
```

### Type Scale

#### Display (Hero Headlines)
```css
font-size: 96px;           /* Desktop */
font-size: 64px;           /* Tablet */
font-size: 48px;           /* Mobile */
line-height: 1.1;
font-weight: 700;
letter-spacing: -0.03em;   /* Tight tracking */
```

#### Heading 1 (Section Headers)
```css
font-size: 56px;           /* Desktop */
font-size: 42px;           /* Mobile */
line-height: 1.1;
font-weight: 700;
margin-bottom: 16px;
```

#### Heading 2 (Sub-sections)
```css
font-size: 48px;
line-height: 1.2;
font-weight: 700;
margin-bottom: 20px;
```

#### Heading 3 (Card Titles)
```css
font-size: 20-24px;
line-height: 1.3;
font-weight: 600;
margin-bottom: 10-12px;
```

#### Heading 4 (Small Headings)
```css
font-size: 20px;
line-height: 1.3;
font-weight: 600;
```

#### Body Large (Subtitles)
```css
font-size: 24px;           /* Hero subtitle */
font-size: 18px;           /* Section descriptions */
line-height: 1.6-1.7;
color: #999999;
```

#### Body (Standard Text)
```css
font-size: 14-16px;
line-height: 1.5-1.6;
color: #999999;
```

#### Body Small (Meta, Labels)
```css
font-size: 11-14px;
line-height: 1.4;
font-weight: 600;          /* Labels */
color: #666666;
```

### Typography Rules
1. **Use tight letter-spacing** (-0.03em) for large headlines
2. **High contrast**: White/near-white on black
3. **Secondary text**: Always #999 or #666
4. **Bold weights**: 600-700 for headings
5. **Generous line-height**: 1.5+ for readability

---

## 📏 Spacing & Layout

### Spacing Scale (Consistent 4px base)
```css
--space-xs: 8px;
--space-sm: 12px;
--space-md: 16px;
--space-lg: 20px;
--space-xl: 24px;
--space-2xl: 32px;
--space-3xl: 40px;
--space-4xl: 48px;
--space-5xl: 60px;
--space-6xl: 80px;
--space-7xl: 120px;
```

### Section Spacing
```css
/* Between major sections */
padding: 120px 40px;       /* Desktop */
padding: 80px 20px;        /* Mobile */

/* Section internal */
margin-bottom: 60px;       /* Desktop */
margin-bottom: 40px;       /* Mobile */
```

### Container Widths
```css
--container-sm: 700px;     /* Newsletter, forms */
--container-md: 900px;     /* Hero content */
--container-lg: 1200px;    /* Courses, stats */
--container-xl: 1400px;    /* Wide sections */
```

### Grid Spacing
```css
/* Dense grid (courses) */
gap: 20px;

/* Spacious grid (stats) */
gap: 40-48px;

/* Flex groups */
gap: 12px (small badges)
gap: 16px (buttons)
gap: 32px (nav, footer)
```

---

## 🧩 Component Library

### 1. Navigation Bar

#### Desktop Navigation
```css
position: absolute;
top: 0;
padding: 32px 40px;
display: flex;
justify-content: space-between;
align-items: center;
```

#### Nav Links
```css
color: #999999;
font-size: 15px;
transition: color 0.2s;

/* Hover */
color: #48BDB8;
```

#### Nav CTA Button
```css
background: #48BDB8;
color: #000000;
padding: 10px 24px;
border-radius: 10px;
font-size: 14px;
font-weight: 600;
transition: transform 0.2s;

/* Hover */
transform: translateY(-2px);
```

---

### 2. Buttons

#### Primary Button
```css
padding: 20px 48px;
background: #48BDB8;
color: #000000;
border-radius: 12px;
font-weight: 600;
font-size: 18px;
transition: transform 0.2s, box-shadow 0.2s;

/* Hover */
transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(72, 189, 184, 0.3);
```

#### Secondary Button
```css
padding: 20px 48px;
background: transparent;
color: #f9f9f9;
border: 2px solid #2a2a2a;
border-radius: 12px;
font-weight: 600;
font-size: 18px;
transition: border-color 0.2s;

/* Hover */
border-color: #48BDB8;
```

#### Submit Button
```css
width: 100%;
padding: 20px;
background: #48BDB8;
color: #000000;
border: none;
border-radius: 12px;
font-size: 18px;
font-weight: 600;
cursor: pointer;
transition: transform 0.2s;

/* Hover */
transform: translateY(-2px);
```

---

### 3. Cards

#### Course Card
```css
background: #0a0a0a;
border: 1px solid #1a1a1a;
border-radius: 16px;
overflow: hidden;
transition: all 0.3s;
cursor: pointer;

/* Hover */
border-color: #48BDB8;
transform: translateY(-4px);
```

**Card Structure**:
```
- Card Image (160px height)
- Card Content (padding: 24px)
  - Meta Badges (small pills)
  - Title (h3, 20px)
  - Description (14px, #999)
  - Link (teal, 14px, arrow)
```

#### Newsletter Card
```css
background: #0a0a0a;
border: 2px solid #1a1a1a;
border-radius: 24px;
padding: 60px;
text-align: center;
```

#### Stats Card
```css
background: linear-gradient(
    135deg,
    rgba(72, 189, 184, 0.05) 0%,
    transparent 100%
);
border-radius: 24px;
border: 1px solid #1a1a1a;
padding: 60px 40px;
```

---

### 4. Badges & Pills

#### Hero Badge
```css
display: inline-block;
background: rgba(72, 189, 184, 0.1);
border: 1px solid rgba(72, 189, 184, 0.3);
color: #48BDB8;
padding: 10px 24px;
border-radius: 24px;
font-size: 15px;
font-weight: 600;
```

#### Meta Badge (Course Info)
```css
font-size: 11px;
padding: 4px 10px;
border-radius: 8px;
font-weight: 600;
background: rgba(255, 255, 255, 0.05);
color: #999999;
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

### 5. Forms

#### Form Group
```css
margin-bottom: 20px;
text-align: left;
```

#### Form Label
```css
display: block;
margin-bottom: 10px;
font-size: 14px;
color: #999999;
font-weight: 600;
```

#### Form Input
```css
width: 100%;
padding: 18px 24px;
background: #000000;
border: 2px solid #2a2a2a;
border-radius: 12px;
color: #f9f9f9;
font-size: 16px;
transition: border-color 0.2s;

/* Focus */
outline: none;
border-color: #48BDB8;
```

---

### 6. Social Proof & Stats

#### Proof Number
```css
font-size: 36-48px;
font-weight: 700;
color: #48BDB8;
margin-bottom: 8px;
```

#### Proof Label
```css
font-size: 14px;
color: #666666;
line-height: 1.4;
```

#### Social Proof Group
```css
display: flex;
gap: 48px;
justify-content: center;
text-align: center;
```

---

### 7. Links

#### Card Link
```css
color: #48BDB8;
text-decoration: none;
font-size: 14px;
font-weight: 600;
display: inline-flex;
align-items: center;
gap: 6px;
```

#### Footer Link
```css
color: #666666;
text-decoration: none;
font-size: 14px;
transition: color 0.2s;

/* Hover */
color: #48BDB8;
```

---

### 8. Icons & Emojis

#### Hero Emoji
```css
font-size: 72px;
margin-bottom: 24px;
animation: wave 2s ease-in-out infinite;

@keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
}
```

#### Section Emoji
```css
font-size: 80px;
margin-bottom: 32px;
```

#### Benefit Icon
```css
font-size: 36px;
flex-shrink: 0;
```

#### Social Icon
```css
width: 40px;
height: 40px;
background: #0a0a0a;
border: 1px solid #1a1a1a;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
color: #999999;
font-size: 18px;
transition: all 0.2s;

/* Hover */
border-color: #48BDB8;
color: #48BDB8;
```

---

## ✨ Animations & Interactions

### Shimmer Animation (Gradient Text)
```css
@keyframes shimmer {
    to {
        background-position: 200% center;
    }
}

/* Apply to gradient text */
background-size: 200% auto;
animation: shimmer 3s linear infinite;
```

### Wave Animation (Hero Emoji)
```css
@keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
}

animation: wave 2s ease-in-out infinite;
```

### Bounce Animation (Scroll Indicator)
```css
@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

animation: bounce 2s infinite;
```

### Hover Transforms
```css
/* Buttons */
transform: translateY(-2px);  /* Small buttons */
transform: translateY(-4px);  /* Large buttons */

/* Cards */
transform: translateY(-4px);
```

### Transition Timing
```css
transition: all 0.2s;          /* Fast - buttons, links */
transition: all 0.3s;          /* Medium - cards */
transition: border-color 0.2s; /* Specific properties */
transition: transform 0.2s, box-shadow 0.2s; /* Multiple */
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Desktop (default) */
@media (min-width: 1024px) { /* ... */ }

/* Tablet */
@media (max-width: 1024px) { /* ... */ }

/* Mobile */
@media (max-width: 768px) { /* ... */ }
```

### Mobile Adaptations

#### Typography
```css
/* Hero title */
96px → 64px → 48px

/* Section headers */
56px → 42px → 36px

/* Subtitles */
24px → 18px

/* Body */
Remains 14-16px
```

#### Layout
```css
/* Grid columns */
3 columns → 2 columns → 1 column

/* Padding */
padding: 120px 40px → 80px 20px

/* Navigation */
Hide nav links on mobile (< 768px)
Show logo + hamburger menu
```

#### Spacing
```css
/* Section gaps */
gap: 60px → 40px → 24px

/* Stats grid */
gap: 48px → 32px

/* CTA groups */
flex-direction: row → column
```

---

## 🎯 Layout Patterns

### Hero Section (Fullscreen)
```css
min-height: 100vh;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
text-align: center;
padding: 40px;
position: relative;
background: radial-gradient(...);
```

### Dense Grid (Courses)
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 20px;

/* Responsive */
@media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 768px) {
    grid-template-columns: 1fr;
}
```

### Stats Grid
```css
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 40px;
text-align: center;

/* Responsive */
@media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 768px) {
    grid-template-columns: 1fr;
}
```

---

## ♿ Accessibility

### Color Contrast
- **Text on black**: #f9f9f9 (WCAG AAA)
- **Secondary text**: #999 (WCAG AA for large text)
- **Teal on black**: #48BDB8 (WCAG AA)
- **Teal on white/light**: Use darker shade

### Focus States
```css
input:focus {
    outline: none;
    border-color: #48BDB8;
    /* Add visible focus indicator */
}

button:focus-visible {
    outline: 2px solid #48BDB8;
    outline-offset: 2px;
}
```

### Interactive Elements
- Minimum touch target: 44x44px ✓
- Clear hover states ✓
- Keyboard navigable ✓
- Semantic HTML ✓

---

## 🚀 Performance

### CSS Optimization
- Use `transform` instead of `top/left` for animations
- Use `will-change` sparingly for animated elements
- Minimize repaints with `transform` and `opacity`

### Font Loading
```css
/* Use system fonts - no external loading */
font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
```

### Image Optimization
- Course images: 640x360px (16:9 aspect ratio)
- Lazy load below-fold images
- Use WebP format with fallbacks

---

## 📦 Component Usage Examples

### Hero Section Template
```html
<section class="hero-section">
    <nav class="nav">...</nav>
    <div class="hero-content">
        <div class="hero-emoji">👋</div>
        <span class="hero-badge">Badge text</span>
        <h1>Title with <span class="gradient-text">gradient</span></h1>
        <p class="subtitle">Description</p>
        <div class="cta-group">
            <a href="#" class="cta-primary">Primary</a>
            <a href="#" class="cta-secondary">Secondary</a>
        </div>
        <div class="social-proof">...</div>
    </div>
    <div class="scroll-indicator">↓</div>
</section>
```

### Course Card Template
```html
<div class="course-card">
    <img src="..." class="card-image">
    <div class="card-content">
        <div class="course-meta">
            <span class="meta-badge">24h</span>
            <span class="meta-badge">Regular+</span>
            <span class="meta-badge">290+ uczestników</span>
        </div>
        <h3>Course Title</h3>
        <p>Description text...</p>
        <a href="#" class="card-link">Zobacz szczegóły →</a>
    </div>
</div>
```

---

## 🎨 Design Principles

1. **Dark First**: Design for dark mode as primary
2. **High Contrast**: Ensure readability with strong contrast
3. **Bold Typography**: Large, confident type for impact
4. **Teal Accent**: Use teal sparingly for maximum impact
5. **Dense Layouts**: Information-rich, minimal whitespace
6. **Subtle Animations**: Enhance, don't distract
7. **Developer Aesthetic**: Technical, modern, precise

---

## 📋 Checklist for New Components

- [ ] Uses design system colors
- [ ] Typography follows scale
- [ ] Spacing uses 4px grid
- [ ] Border radius: 12px (buttons), 16-24px (cards)
- [ ] Hover states defined
- [ ] Focus states accessible
- [ ] Responsive behavior tested
- [ ] Animations are 0.2-0.3s
- [ ] High contrast maintained
- [ ] Touch targets 44px minimum

---

## 🔗 Resources

- **Figma File**: [Link to design file]
- **Code Repository**: [GitHub link]
- **Live Demo**: [Demo URL]
- **Component Library**: See UI_COMPONENTS_DEMO.html

---

**Version**: 1.0
**Last Updated**: 2025-11-03
**Maintained by**: DevMentors Design Team
