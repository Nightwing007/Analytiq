/**
 * ThemeContext.js - Theme and Design System Context
 * 
 * PRIMARY RESPONSIBILITIES:
 * - Provide global theme configuration
 * - Manage color palette and design tokens
 * - Handle responsive design utilities
 * - Provide animation and transition settings
 * - Support theme customization and user preferences
 * 
 * THEME CONFIGURATION:
 * ```javascript
 * const theme = {
 *   colors: {
 *     primary: '#261FB3',      // Primary brand color
 *     primaryDark: '#161179',  // Darker brand shade
 *     background: '#0C0950',   // Page background
 *     text: '#FBE4D6',         // Text and borders
 *     white: '#FFFFFF',        // Pure white
 *     gray: {
 *       100: '#F5F5F5',
 *       200: '#E5E5E5',
 *       300: '#D1D5DB',
 *       400: '#9CA3AF',
 *       500: '#6B7280',
 *       600: '#4B5563',
 *       700: '#374151',
 *       800: '#1F2937',
 *       900: '#111827'
 *     },
 *     success: '#10B981',
 *     warning: '#F59E0B',
 *     error: '#EF4444',
 *     info: '#3B82F6'
 *   },
 *   
 *   spacing: {
 *     xs: '0.25rem',   // 4px
 *     sm: '0.5rem',    // 8px
 *     md: '1rem',      // 16px
 *     lg: '1.5rem',    // 24px
 *     xl: '2rem',      // 32px
 *     xxl: '3rem'      // 48px
 *   },
 *   
 *   borderRadius: {
 *     none: '0',
 *     sm: '2px',       // Very small radius as per design
 *     md: '4px',       // Small radius for buttons/cards
 *     lg: '6px',       // Larger elements
 *     full: '9999px'   // Pills and circles
 *   },
 *   
 *   shadows: {
 *     none: 'none',    // No shadows per design requirements
 *     subtle: '0 1px 2px rgba(0, 0, 0, 0.05)', // Minimal if needed
 *   },
 *   
 *   borders: {
 *     thin: '1px solid',
 *     thick: '2px solid',  // Thick borders per design
 *     thicker: '3px solid'
 *   },
 *   
 *   typography: {
 *     fontFamily: {
 *       sans: ['Inter', 'system-ui', 'sans-serif'],
 *       mono: ['Monaco', 'Menlo', 'monospace']
 *     },
 *     fontSize: {
 *       xs: '0.75rem',
 *       sm: '0.875rem',
 *       base: '1rem',
 *       lg: '1.125rem',
 *       xl: '1.25rem',
 *       '2xl': '1.5rem',
 *       '3xl': '1.875rem',
 *       '4xl': '2.25rem'
 *     },
 *     fontWeight: {
 *       normal: '400',
 *       medium: '500',
 *       semibold: '600',
 *       bold: '700'
 *     }
 *   },
 *   
 *   breakpoints: {
 *     sm: '640px',
 *     md: '768px',
 *     lg: '1024px',
 *     xl: '1280px',
 *     xxl: '1536px'
 *   },
 *   
 *   animations: {
 *     duration: {
 *       fast: '150ms',
 *       normal: '300ms',
 *       slow: '500ms'
 *     },
 *     easing: {
 *       default: 'cubic-bezier(0.4, 0, 0.2, 1)',
 *       in: 'cubic-bezier(0.4, 0, 1, 1)',
 *       out: 'cubic-bezier(0, 0, 0.2, 1)',
 *       inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
 *     }
 *   }
 * };
 * ```
 * 
 * CONTEXT INTERFACE:
 * ```javascript
 * const {
 *   theme,           // Complete theme object
 *   colors,          // Color palette
 *   spacing,         // Spacing scale
 *   breakpoints,     // Responsive breakpoints
 *   isDarkMode,      // Dark mode state (if implemented)
 *   toggleDarkMode,  // Toggle dark mode
 *   isMobile,        // Mobile device detection
 *   isTablet,        // Tablet device detection
 *   isDesktop        // Desktop device detection
 * } = useTheme();
 * ```
 * 
 * RESPONSIVE UTILITIES:
 * - Screen size detection and state
 * - Breakpoint utilities
 * - Mobile-first design helpers
 * - Dynamic viewport sizing
 * 
 * DESIGN SYSTEM COMPLIANCE:
 * - Solid colors, no gradients
 * - Thick borders throughout
 * - Minimal border radius
 * - No shadows or neon effects
 * - 2D aesthetic with depth through color
 * 
 * ANIMATION CONFIGURATION:
 * - 2D scroll responsive animations
 * - Interactive loading animations
 * - Hover effects for charts and graphs
 * - Transition timings and easings
 * 
 * ACCESSIBILITY:
 * - High contrast ratios
 * - Focus indicators
 * - Reduced motion preferences
 * - Screen reader support
 * 
 * CUSTOMIZATION:
 * - User preference storage
 * - Theme switching capabilities
 * - Custom color schemes
 * - Accessibility overrides
 */