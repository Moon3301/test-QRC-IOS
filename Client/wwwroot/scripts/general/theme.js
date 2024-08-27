function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null || localStorageTheme !== undefined) {
        return localStorageTheme;
    }

    if (systemSettingDark.matches) {
        return "dark";
    }

    return "light";
}

/**
* Utility function to update the button text and aria-label.
*/
function updateToggler({ href, isDark }) {
    const icon = isDark ? "icon-sun" : "icon-moon";
    href.querySelector("i").className = icon;
}

/**
* Utility function to update the theme setting on the html tag
*/
function updateThemeOnHtml({ theme }) {
    document.querySelector("html").setAttribute("theme", theme);
}


/**
* On page load:
*/

/**
* 1. Grab what we need from the DOM and system settings on page load
*/
const toggler = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
* 2. Work out the current site settings
*/
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

/**
* 3. Update the theme setting and button text accoridng to current settings
*/
updateToggler({ href: toggler, isDark: currentThemeSetting === "dark" });
updateThemeOnHtml({ theme: currentThemeSetting });

/**
* 4. Add an event listener to toggle the theme
*/
toggler.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    updateToggler({ href: toggler, isDark: newTheme === "dark" });
    updateThemeOnHtml({ theme: newTheme });

    currentThemeSetting = newTheme;
}); 