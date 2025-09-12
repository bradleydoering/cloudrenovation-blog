/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: 'var(--coral)',
        'coral-light': 'var(--coral-light)',
        'coral-dark': 'var(--coral-dark)',
        navy: 'var(--navy)',
        'navy-light': 'var(--navy-light)',
        'navy-dark': 'var(--navy-dark)',
        cloudwhite: 'var(--cloudwhite)',
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--tw-prose-body)',
            lineHeight: '1.75',
            '> *': {
              marginTop: '1.75em',
              marginBottom: '1.75em',
            },
            h1: {
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '0.8888889em',
              lineHeight: '1.1111111',
            },
            h2: {
              fontSize: '1.5em',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3333333',
            },
            h3: {
              fontSize: '1.25em',
              marginTop: '1.6em',
              marginBottom: '0.6em',
              lineHeight: '1.6',
            },
            p: {
              fontSize: '1.125em',
              lineHeight: '1.7777778',
            },
            blockquote: {
              fontWeight: '400',
              fontStyle: 'italic',
              color: 'var(--tw-prose-quotes)',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              paddingLeft: '1em',
            },
            code: {
              color: 'var(--tw-prose-code)',
              fontWeight: '600',
              fontSize: '0.875em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              color: 'var(--tw-prose-pre-code)',
              backgroundColor: 'var(--tw-prose-pre-bg)',
              overflowX: 'auto',
              fontWeight: '400',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '1.7142857em',
              marginBottom: '1.7142857em',
              borderRadius: '0.375rem',
              paddingTop: '0.8571429em',
              paddingRight: '1.1428571em',
              paddingBottom: '0.8571429em',
              paddingLeft: '1.1428571em',
            },
          },
        },
        lg: {
          css: {
            fontSize: '1.125rem',
            lineHeight: '1.7777778',
            p: {
              marginTop: '1.3333333em',
              marginBottom: '1.3333333em',
            },
            '[class~="lead"]': {
              fontSize: '1.2222222em',
              lineHeight: '1.4545455',
              marginTop: '1.0909091em',
              marginBottom: '1.0909091em',
            },
            blockquote: {
              marginTop: '1.6666667em',
              marginBottom: '1.6666667em',
              paddingLeft: '1em',
            },
            h1: {
              fontSize: '2.6666667em',
              marginTop: '0',
              marginBottom: '0.8333333em',
              lineHeight: '1',
            },
            h2: {
              fontSize: '1.6666667em',
              marginTop: '1.8666667em',
              marginBottom: '1.0666667em',
              lineHeight: '1.3333333',
            },
            h3: {
              fontSize: '1.3333333em',
              marginTop: '1.6666667em',
              marginBottom: '0.6666667em',
              lineHeight: '1.5',
            },
            h4: {
              marginTop: '1.7777778em',
              marginBottom: '0.4444444em',
              lineHeight: '1.5555556',
            },
            img: {
              marginTop: '1.7777778em',
              marginBottom: '1.7777778em',
            },
            video: {
              marginTop: '1.7777778em',
              marginBottom: '1.7777778em',
            },
            figure: {
              marginTop: '1.7777778em',
              marginBottom: '1.7777778em',
            },
            'figure > *': {
              marginTop: '0',
              marginBottom: '0',
            },
            figcaption: {
              fontSize: '0.8888889em',
              lineHeight: '1.5',
              marginTop: '1em',
            },
            code: {
              fontSize: '0.8888889em',
            },
            h2: {
              fontSize: '1.6666667em',
              marginTop: '1.8666667em',
              marginBottom: '1.0666667em',
              lineHeight: '1.3333333',
            },
            pre: {
              fontSize: '0.8888889em',
              lineHeight: '1.75',
              marginTop: '2em',
              marginBottom: '2em',
              borderRadius: '0.375rem',
              paddingTop: '1em',
              paddingRight: '1.5em',
              paddingBottom: '1em',
              paddingLeft: '1.5em',
            },
            ol: {
              marginTop: '1.3333333em',
              marginBottom: '1.3333333em',
            },
            ul: {
              marginTop: '1.3333333em',
              marginBottom: '1.3333333em',
            },
            li: {
              marginTop: '0.6666667em',
              marginBottom: '0.6666667em',
            },
            'ol > li': {
              paddingLeft: '1.6666667em',
            },
            'ul > li': {
              paddingLeft: '1.6666667em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}