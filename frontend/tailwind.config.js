/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark IBM Enterprise Command Center palette
        /** #01091E === rgb(1 9 30) — avoids legacy #0B1020 / rgb(11 16 32) */
        'app-bg': '#01091E',
        'app-bg-alt': '#0F172A',
        'panel-bg': '#111827',
        'panel-bg-secondary': '#111C2E',
        'card-bg': '#172033',
        'input-bg': '#0F172A',
        'graph-bg': '#01091E',
        'border': '#263244',
        'border-soft': '#334155',
        
        // Text colors
        'text-primary': '#E5E7EB',
        'text-strong': '#F8FAFC',
        'text-muted': '#94A3B8',
        'text-subtle': '#64748B',
        'text-disabled': '#475569',
        
        // Accent colors (IBM anchor — use sparingly on dark)
        'ibm-blue': '#0F62FE',
        'modern-blue': '#2563EB',
        'ai-purple': '#8B5CF6',

        /** Live accents: default to light blue (cyan/sky); mint reserved for gradients with primary buttons */
        'live-cyan': '#22D3EE',
        'live-sky': '#7DD3FC',
        'live-rose': '#FB7185',
        'live-mint': '#4ADE80',
        'live-violet': '#C084FC',
        'live-peach': '#FDBA74',
        'success-green': '#22C55E',
        'error-red': '#EF4444',
        'review-orange': '#F97316',
        'inactive-gray': '#64748B',
      },
    },
  },
  plugins: [],
}

// Made with Bob
