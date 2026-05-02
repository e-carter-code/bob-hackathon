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
        'app-bg': '#0B1020',
        'app-bg-alt': '#0F172A',
        'panel-bg': '#111827',
        'panel-bg-secondary': '#111C2E',
        'card-bg': '#172033',
        'input-bg': '#0F172A',
        'graph-bg': '#0B1220',
        'border': '#263244',
        'border-soft': '#334155',
        
        // Text colors
        'text-primary': '#E5E7EB',
        'text-strong': '#F8FAFC',
        'text-muted': '#94A3B8',
        'text-subtle': '#64748B',
        'text-disabled': '#475569',
        
        // Accent colors
        'ibm-blue': '#0F62FE',
        'modern-blue': '#2563EB',
        'ai-purple': '#8B5CF6',
        'success-green': '#22C55E',
        'warning-amber': '#F59E0B',
        'error-red': '#EF4444',
        'review-orange': '#F97316',
        'inactive-gray': '#64748B',
      },
    },
  },
  plugins: [],
}

// Made with Bob
