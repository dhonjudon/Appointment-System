# Swastha Sewa - Doctor Appointment System

A modern, premium landing page for a Doctor Appointment System built with React, TypeScript, and Tailwind CSS.

## 🎨 Design Overview

The landing page features a clean, healthcare-focused design with soft green color scheme and modern UI patterns perfect for a telemedicine application.

### Color Palette

- **Primary**: Soft Green (#16a34a)
- **Hover**: Dark Green (#15803d)
- **Background**: Green gradient (green-50 to white)
- **Text**: Dark Gray (#1f2937)
- **Cards**: White with soft shadows

## 📱 Features

### Sections Included

1. **Responsive Navbar**
   - Logo: "Swastha Sewa"
   - Navigation Menu (Home, Doctors, Appointments, About)
   - Login Button

2. **Hero Section**
   - Main headline: "Book Your Doctor Appointment Online"
   - Descriptive text
   - Search bar with location icon
   - Call-to-action button
   - Healthcare professional image

3. **Features Section**
   - "Find Doctors Easily"
   - "Instant Booking"
   - "Secure Records"
   - Each with icons and descriptions

4. **Featured Doctors Section**
   - Grid layout (responsive: 4 cols desktop, scales down)
   - Doctor cards with:
     - Profile image
     - Name and specialty
     - Consultation price
     - "Book Appointment" button

5. **Call-to-Action Section**
   - "Start Your Health Journey Today" heading
   - "Get Started" button
   - Green gradient background

6. **Footer**
   - Copyright information
   - Tagline

## 🛠️ Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library

## 📦 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Development server will run at: `http://localhost:5173/`

## 🎯 Project Structure

```
src/
├── components/
│   └── LandingPage.tsx      # Main landing page component
├── App.tsx                   # App component
├── App.css                   # App styles
├── index.css                 # Tailwind CSS directives
├── main.tsx                  # React entry point
└── vite-env.d.ts            # Vite type definitions

tailwind.config.js            # Tailwind configuration
postcss.config.js             # PostCSS configuration
```

## ✨ Design Details

- **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktops
- **Smooth Animations**: Hover effects and transitions (duration-200)
- **Premium Look**: Rounded corners (rounded-2xl), soft shadows, generous spacing
- **Accessibility**: Semantic HTML, proper contrast ratios
- **No External UI Libraries**: Pure Tailwind CSS and Lucide icons

## 🚀 Usage

The landing page is ready to use as a starting point for a full appointment system. You can:

1. Customize colors in `tailwind.config.js`
2. Update doctor data in the component's `doctors` array
3. Add real API calls to replace sample data
4. Implement actual appointment booking logic
5. Add authentication system

## 📝 Customization

### Update Colors

Edit custom colors in `tailwind.config.js`:

```javascript
colors: {
  'primary': '#16a34a',
  'primary-dark': '#15803d',
}
```

### Add Real Data

Replace the sample doctors array with data from your backend API.

### Add Navigation

Link the navbar items to actual pages or sections.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For any issues or questions about the landing page design and functionality, refer to the documentation or create an issue.

---

**Built with ❤️ for healthcare professionals**
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
