<div align="center" class="text-center">
<h1>TRANSLATOR-APP</h1>
<p><em>Real-Time Translation, Multiple Languages, Seamless Communication</em></p>

<img alt="last-commit" src="https://img.shields.io/github/last-commit/danilokosam/translator-app?style=flat&amp;logo=git&amp;logoColor=white&amp;color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="repo-top-language" src="https://img.shields.io/github/languages/top/danilokosam/translator-app?style=flat&amp;color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="repo-language-count" src="https://img.shields.io/github/languages/count/danilokosam/translator-app?style=flat&amp;color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="GitHub contributors" src="https://img.shields.io/github/contributors/danilokosam/translator-app?color=0080ff">
<p><em>Built with the tools and technologies:</em></p>
<img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="Vitest" src="https://img.shields.io/badge/Vitest-6E9F18.svg?style=flat&logo=Vitest&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<br>
<img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6.svg?style=flat&logo=CSS3&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="npm" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="FontAwesome" src="https://img.shields.io/badge/Font_Awesome-528DD7.svg?style=flat&logo=fontawesome&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="Testing Library" src="https://img.shields.io/badge/Testing_Library-E33332.svg?style=flat&logo=testing-library&logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
</div>

## Introduction
Translator App is a modern real-time translation application built with React and Vite, featuring instant text translation between multiple languages. The application provides a seamless user experience with advanced features like debounced input, text-to-speech functionality, and comprehensive testing coverage.

## What are we looking for with this project?
We seek to create a powerful and user-friendly translation tool that leverages modern web technologies to provide instant, accurate translations with an intuitive interface. The project demonstrates best practices in React development, including custom hooks, performance optimization, and comprehensive testing.

## Features
- **Real-time translation** between 90+ languages
- **Debounced input** to optimize API calls and performance
- **Text-to-speech** functionality for pronunciation assistance
- **Copy to clipboard** for easy text sharing
- **Language exchange** with one-click swap functionality
- **Responsive design** that works on all devices
- **Error handling** with user-friendly messages
- **Loading states** for better user experience
- **Comprehensive testing** with Vitest and Testing Library

## Main Technologies
This project was developed using a robust set of modern, in-demand technologies, chosen for their efficiency, performance, and developer experience:
- **React**: For building a dynamic and efficient user interface with hooks and modern patterns.
- **Vite**: For rapid and optimized frontend development with hot module replacement.
- **JavaScript (ES6+)**: Modern JavaScript features for clean and maintainable code.
- **CSS3**: Custom styling with modern CSS features and responsive design.
- **MyMemory Translation API**: For reliable and accurate text translation services.

### Development & Testing:
- **ESLint**: Linting tool that helps maintain code quality, identify problematic patterns, and ensure consistent coding standards.
- **Vitest**: Fast and lightweight testing framework designed for Vite projects.
- **@testing-library/react**: Simple and complete testing utilities for React components.
- **@testing-library/jest-dom**: Custom Jest matchers for testing DOM elements.
- **jsdom**: JavaScript implementation of web standards for testing in Node.js environment.

### Additional Tools:
- **Font Awesome**: Professional icon library for UI elements and actions.
- **Web Speech API**: Native browser API for text-to-speech functionality.
- **Clipboard API**: Native browser API for copy-to-clipboard features.
- **npm**: Node.js package manager for dependency management and project scripts.
- **Git**: Distributed version control system for tracking changes and collaboration.
- **GitHub**: Cloud-based platform for hosting Git repositories and project management.

## Project Structure Overview

### Root
- `README.md`: Comprehensive project documentation.
- `package.json`: Project dependencies, scripts, and configuration.
- `vite.config.js`: Vite build tool configuration with testing setup.
- `eslint.config.js`: ESLint configuration for code quality.
- `vitest.setup.js`: Vitest testing environment setup.

### public/
- `vite.svg`: Application favicon and branding assets.

### src/
- `main.jsx`: Application entry point and React DOM rendering.
- `App.jsx`: Main application component and routing setup.
- `App.css`, `index.css`: Global styles and component-specific styling.

#### components/
- `Translator.jsx`: Main translator component with text input, translation display, and controls.
- `LanguageSelector.jsx`: Reusable language selection component with action icons.

#### hooks/
- `useTranslator.js`: Custom hook managing translation state, API calls, and language exchange.
- `useDebounce.js`: Performance optimization hook for delaying API calls.
- `useThrottle.js`: Rate limiting hook for preventing excessive function calls.

#### utils/
- `languaje.js`: Language codes and names mapping for 90+ supported languages.

#### tests/
- `Translator.test.jsx`: Comprehensive tests for main translator component.
- `LanguageSelector.test.jsx`: Unit tests for language selector component.
- `useTranslator.test.js`: Hook testing for translation logic and state management.
- `useDebounce.test.js`: Performance hook testing and timing validation.
- `useThrottle.test.js`: Rate limiting hook testing and behavior verification.

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/danilokosam/translator-app.git
   cd translator-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm run test
   # or for watch mode
   npm run test:watch
   # or for coverage report
   npm run test:coverage
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint for code quality checks
- `npm run test`: Run all tests once
- `npm run test:watch`: Run tests in watch mode for development
- `npm run test:coverage`: Generate test coverage report

## API Integration

The application uses the **MyMemory Translation API** for text translation services:
- **Endpoint**: `https://api.mymemory.translated.net/get`
- **Free tier**: Up to 1000 requests per day
- **Supported languages**: 90+ language pairs
- **Response format**: JSON with translated text and metadata

## Performance Optimizations

- **Debounced input**: Reduces API calls by waiting for user to stop typing
- **Throttled functions**: Prevents excessive function calls for better performance
- **Lazy loading**: Components and resources loaded as needed
- **Memoized callbacks**: Prevents unnecessary re-renders in child components
- **Error boundaries**: Graceful error handling without app crashes

## Testing Strategy

The project includes comprehensive testing coverage:
- **Unit tests**: Individual component and hook testing
- **Integration tests**: Component interaction and API integration
- **Performance tests**: Debounce and throttle functionality validation
- **Accessibility tests**: Screen reader and keyboard navigation support
- **Error handling tests**: Edge cases and error scenarios

## Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Required APIs**: Fetch API, Web Speech API, Clipboard API
- **Fallbacks**: Graceful degradation for unsupported features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Changelog

- **July 16, 2025**:  Readme Update
