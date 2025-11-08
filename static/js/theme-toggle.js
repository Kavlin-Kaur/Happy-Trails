// ========================================
// Theme Toggle - Dark/Light Mode
// Happy Trails Theme Manager ✨
// ========================================

class ThemeToggle {
    constructor() {
        this.THEME_KEY = 'happytrails-theme';
        this.DARK_MODE_CLASS = 'dark-mode';
        this.themeButton = document.getElementById('themeToggle');
        this.themeIcon = this.themeButton?.querySelector('.theme-icon');
        this.init();
    }

    init() {
        // Load saved theme preference or default to light mode
        this.loadTheme();

        // Add event listener to theme toggle button
        if (this.themeButton) {
            this.themeButton.addEventListener('click', () => this.toggleTheme());
            // Add keyboard support (Space and Enter keys)
            this.themeButton.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }

        console.log('🌙 Happy Trails Theme Toggle initialized! ✨');
    }

    loadTheme() {
        // Check localStorage for saved preference
        const savedTheme = localStorage.getItem(this.THEME_KEY);

        // Check system preference if no saved preference
        let isDarkMode = savedTheme
            ? savedTheme === 'dark'
            : window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Apply the theme
        this.applyTheme(isDarkMode);

        // Update button icon
        this.updateButtonIcon(isDarkMode);
    }

    toggleTheme() {
        // Get current theme state
        const isDarkMode = document.documentElement.classList.contains(this.DARK_MODE_CLASS);

        // Switch to opposite theme
        this.applyTheme(!isDarkMode);

        // Update button icon
        this.updateButtonIcon(!isDarkMode);

        // Log the action
        console.log(`🎨 Theme switched to ${!isDarkMode ? 'Dark' : 'Light'} Mode! ✨`);
    }

    applyTheme(isDarkMode) {
        if (isDarkMode) {
            document.documentElement.classList.add(this.DARK_MODE_CLASS);
            localStorage.setItem(this.THEME_KEY, 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove(this.DARK_MODE_CLASS);
            localStorage.setItem(this.THEME_KEY, 'light');
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    updateButtonIcon(isDarkMode) {
        if (this.themeIcon) {
            // Show sun icon in dark mode, moon icon in light mode
            this.themeIcon.textContent = isDarkMode ? '☀️' : '🌙';

            // Add animation
            this.themeIcon.style.animation = 'none';
            setTimeout(() => {
                this.themeIcon.style.animation = 'spin-smooth 0.6s ease-in-out';
            }, 10);
        }
    }

    // Public method to force a theme
    setTheme(theme) {
        const isDarkMode = theme === 'dark';
        this.applyTheme(isDarkMode);
        this.updateButtonIcon(isDarkMode);
    }

    // Public method to get current theme
    getCurrentTheme() {
        return document.documentElement.classList.contains(this.DARK_MODE_CLASS) ? 'dark' : 'light';
    }
}

// Initialize theme toggle when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeToggle = new ThemeToggle();
    });
} else {
    window.themeToggle = new ThemeToggle();
}
