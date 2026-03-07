import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'status-ready': '#6B7280',
        'status-in-dev': '#F59E0B',
        'status-review': '#8B5CF6',
        'status-done': '#10B981',
      },
    },
  },
} satisfies Config
