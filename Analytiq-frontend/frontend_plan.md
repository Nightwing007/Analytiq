# Analytiq Frontend Plan

This document details the implementation plan for the **Analytiq frontend**, based on the main project plan. The frontend is a React application that provides authentication, site management, dashboard analytics, and real-time updates.

---

## UI Design Theme - Dark Electric Blue Tech

### Color Palette
#### Primary Colors
- **Background Dark**: `#0A0A0F` - Main page background
- **Background Secondary**: `#121218` - Card backgrounds, secondary containers
- **Background Elevated**: `#1A1A24` - Modal backgrounds, dropdowns, elevated elements

#### Electric Blue Accent Colors
- **Electric Blue Primary**: `#00D4FF` - Primary buttons, links, active states
- **Electric Blue Secondary**: `#0099CC` - Secondary buttons, borders, hover states
- **Electric Blue Dark**: `#006B99` - Pressed states, darker accents
- **Electric Blue Light**: `#33DDFF` - Highlights, focus states, data visualization accents

#### Text Colors
- **Text Primary**: `#FFFFFF` - Main headings, primary text
- **Text Secondary**: `#B8BCC8` - Secondary text, descriptions
- **Text Muted**: `#6B7280` - Placeholder text, disabled states
- **Text Electric**: `#00D4FF` - Links, interactive text elements

#### Status Colors
- **Success**: `#10B981` - Success states, positive metrics
- **Warning**: `#F59E0B` - Warning states, caution indicators
- **Error**: `#EF4444` - Error states, negative metrics
- **Info**: `#3B82F6` - Information states, neutral indicators

#### Border & Divider Colors
- **Border Primary**: `#2A2A35` - Main borders, card outlines
- **Border Secondary**: `#1F1F28` - Subtle dividers, separators
- **Border Electric**: `#00D4FF` - Active borders, focus states

### Typography System
#### Font Families
- **Primary Font**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Monospace Font**: `'JetBrains Mono', 'Fira Code', 'Monaco', monospace` (for code snippets)

#### Font Weights
- **Light**: 300 - Large display text
- **Regular**: 400 - Body text, descriptions
- **Medium**: 500 - Subheadings, important text
- **Semibold**: 600 - Card titles, button text
- **Bold**: 700 - Main headings, emphasis

#### Font Sizes
- **Display**: `3rem` (48px) - Hero headings
- **H1**: `2.25rem` (36px) - Page titles
- **H2**: `1.875rem` (30px) - Section headings
- **H3**: `1.5rem` (24px) - Card titles
- **H4**: `1.25rem` (20px) - Subheadings
- **Body Large**: `1.125rem` (18px) - Important body text
- **Body**: `1rem` (16px) - Standard body text
- **Body Small**: `0.875rem` (14px) - Captions, metadata
- **Caption**: `0.75rem` (12px) - Small labels, timestamps

### Design System Rules

#### Border Radius
- **Small**: `6px` - Buttons, input fields, small cards
- **Medium**: `8px` - Standard cards, containers
- **Large**: `12px` - Large cards, modals
- **XLarge**: `16px` - Hero sections, major containers

#### Spacing System (Tailwind-like)
- **xs**: `4px` - Tight spacing
- **sm**: `8px` - Small spacing
- **md**: `16px` - Standard spacing
- **lg**: `24px` - Large spacing
- **xl**: `32px` - Extra large spacing
- **2xl**: `48px` - Section spacing
- **3xl**: `64px` - Major section spacing

#### Component Design Rules

##### Buttons
- **Universal Design**: All buttons use transparent backgrounds with matching text and border colors
- **Primary Button**: Transparent background, electric blue (`#00D4FF`) text and border, small border radius
- **Secondary Button**: Transparent background, secondary text (`#B8BCC8`) and border, small border radius
- **Success Button**: Transparent background, success (`#10B981`) text and border, small border radius
- **Danger Button**: Transparent background, error (`#EF4444`) text and border, small border radius
- **Ghost Button**: Transparent background, text color matches context, no border
- **Default State**: Clean transparent button with solid border (2px) and matching text color
- **Hover Animation**: Animated running border effect - border segments travel around the button perimeter and fade out
- **Active States**: Slight scale transform (0.96) with continued animation
- **Disabled States**: Muted colors, reduced opacity (0.4), no animations
- **Animation Details**:
  - Border segments of 20px length travel clockwise around button perimeter
  - Animation duration: 1.2s infinite linear
  - Segments fade in at start, fade out at end of each edge
  - Uses CSS pseudo-elements and keyframe animations
  - Smooth transitions for all state changes (300ms ease-in-out)

##### Cards
- **Background**: Background Secondary (`#121218`)
- **Border**: 1px solid Border Primary (`#2A2A35`)
- **Border Radius**: Medium (8px)
- **Padding**: md to lg depending on content
- **Hover State**: Border changes to Border Electric (`#00D4FF`)
- **No shadows**: Use solid borders and color changes for depth

##### Input Fields
- **Background**: Background Elevated (`#1A1A24`)
- **Border**: 1px solid Border Primary (`#2A2A35`)
- **Border Radius**: Small (6px)
- **Text Color**: Text Primary (`#FFFFFF`)
- **Placeholder**: Text Muted (`#6B7280`)
- **Focus State**: Border changes to Electric Blue Primary (`#00D4FF`)
- **Error State**: Border changes to Error color (`#EF4444`)

##### Data Visualization
- **Chart Backgrounds**: Background Secondary (`#121218`)
- **Grid Lines**: Border Secondary (`#1F1F28`)
- **Data Colors**: Use Electric Blue variations and accent colors
- **Hover Effects**: Color brightness increase, no shadows
- **Animation**: Smooth transitions (300ms ease-in-out)

#### Animation Guidelines
- **Transition Duration**: 300ms for most interactions
- **Easing**: `ease-in-out` for smooth feel
- **Hover Animations**: Color changes, subtle scale transforms
- **Loading Animations**: Electric blue pulsing, rotating spinners
- **Page Transitions**: Slide animations, fade effects
- **Chart Animations**: Staggered entry animations, smooth data updates

#### Layout Principles
- **Container Max Width**: 1280px for main content
- **Grid System**: 12-column grid with consistent gutters
- **Responsive Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px  
  - Desktop: > 1024px
- **Whitespace**: Generous spacing between sections
- **Visual Hierarchy**: Clear distinction between different content levels

#### Interactive States
- **Default**: Base colors as defined
- **Hover**: Lighter shade or electric blue tint
- **Active/Pressed**: Darker shade, slight scale (0.98)
- **Focus**: Electric blue outline (2px), slight glow effect
- **Disabled**: Reduced opacity (0.6), desaturated colors
- **Loading**: Electric blue pulsing animation

#### Logo Usage
- **Main Logo**: `src/assets/Logo.png`
- **Favicon**: `src/assets/Favicon.png`
- **Logo Variations**: White version for dark backgrounds, electric blue accent version
- **Minimum Size**: 24px height for smallest usage
- **Clear Space**: Minimum padding equal to logo height on all sides

### Design Implementation Notes
- **No Shadows**: Use solid borders and color variations for depth perception
- **Solid Colors**: Avoid gradients, use flat color approach
- **High Contrast**: Ensure WCAG AA compliance for text readability
- **Tech Aesthetic**: Clean lines, geometric shapes, data-focused design
- **Performance**: Optimize animations for 60fps, use CSS transforms
- **Consistency**: Maintain strict adherence to color palette and spacing system

---

## 1. Core Responsibilities

- **Authentication:** Signup and login forms, JWT handling.
- **Site Management:** Add, list, and delete websites; display snippet for integration.
- **Dashboard:** Visualize analytics (charts, tables) for each site.
- **Real-time Updates:** Listen for WebSocket messages and update dashboard live.
- **User Experience:** Responsive, modern UI for desktop and mobile.

---

## 2. File Structure

```
frontend/
  src/
    App.jsx
    pages/
      Landing.jsx      # Landing/marketing page
      Auth.jsx         # Signup/Login
      Manage.jsx       # Manage websites
      Dash.jsx         # Dashboard per site
    components/
      API.js           # API client (fetch/axios with JWT)
      Chart.jsx        # Chart wrapper (Recharts/visx)
      SnippetView.jsx  # Shows JS snippet for site
      TimeRangePicker.jsx
      WebsocketManager.jsx
  package.json
  Dockerfile
```

---

## 3. Implementation Phases

### Phase A: Core Pages & Routing

- [ ] Set up React app (Vite or CRA).
- [ ] Implement routing for `/`, `/auth`, `/manage`, `/dash/:siteId`.
- [ ] Create `Landing.jsx` with CTA to login/signup.
- [ ] Create `Auth.jsx` with signup/login forms.

### Phase B: Site Management

- [ ] Implement `Manage.jsx`:
  - List all user sites (API: `/api/sites`).
  - Add site form (API: `POST /api/sites`).
  - Delete site action.
  - Show snippet (with site_id and site_key) using `SnippetView.jsx`.

### Phase C: Dashboard

- [ ] Implement `Dash.jsx`:
  - Fetch and display aggregated report (API: `/api/sites/{site_id}/report`).
  - Charts: visitors timeseries, pageviews, top pages, traffic sources, OS, browsers.
  - Use `Chart.jsx` (wrap Recharts or visx).
  - Time range picker for filtering data.
  - Table for top pages.

### Phase D: Real-time & WebSocket

- [ ] Implement `WebsocketManager.jsx`:
  - Connect to `/ws/sites/{site_id}`.
  - Listen for metric updates and update dashboard state.
  - Show real-time indicator.

### Phase E: UX & Polish

- [ ] Responsive design (mobile/desktop).
- [ ] Error handling and loading states.
- [ ] JWT storage (localStorage) and auto-refresh.
- [ ] Copy-to-clipboard for snippet.
- [ ] Export/download buttons for reports.

---

## 4. Component Details

- **API.js:** Handles all API requests, attaches JWT, manages login state.
- **Chart.jsx:** Generic chart component, wraps chosen chart library.
- **SnippetView.jsx:** Displays the JS snippet with correct site credentials.
- **TimeRangePicker.jsx:** Allows user to select date range for dashboard.
- **WebsocketManager.jsx:** Handles WebSocket connection and message dispatch.

---

## 5. Security & Best Practices

- Store JWT securely (localStorage or httpOnly cookie).
- Never expose site keys except in snippet view.
- Validate all user input.
- Handle API errors gracefully.
- Use HTTPS for all API and WebSocket connections.

---

## 6. Testing & Deployment

- Unit tests for components and API client.
- Dockerfile for frontend build.
- Environment variables for API base URL.

---

## 7. References

- See `plan.md` for canonical JSON schemas and endpoint specs.
- Use provided example event and report JSON for mock data and UI development.

---