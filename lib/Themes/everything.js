/**
 * All the logic for the themes
 * Apply, lazy load, change
 */
let vars = {}
export async function GetThemes() {
    const storedThemes = GetLocalyStoredThemes()
    if (storedThemes.length < 1 || (Date.now() - storedThemes.updated) > (1000 * 60 * 60 * 24)) {
        const themeFetch = await fetch(`${process.env.NEXT_PUBLIC_CURRENTURL}/themes.json`)
        const themes = await themeFetch.json()
        window.localStorage.setItem("themes", JSON.stringify({ updated: Date.now(), themes: themes }))
        return themes
    } else {
        return storedThemes.themes
    }
}

export function GetLocalyStoredThemes() {
    const localStorageData = window.localStorage.getItem("themes")
    if (localStorageData === "") {
        return []
    }
    const parsedThemes = JSON.parse(localStorageData)
    return Array.isArray(parsedThemes) ? parsedThemes : []
}

async function applyTheme() {
    const theme = window.localStorage.getItem('theme')
    const themes = await GetThemes()
    if (theme && theme !== 'system') {
        vars = themes.find((item) => item.id === theme)?.data
        const r = document.documentElement.style;
        for (const variable in vars) {
            r.setProperty(variable, vars[variable]);
        }
    }

}

export default function EnableWebsiteThemes() {
    applyTheme()
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            // Theme property has changed, apply the new theme
            const r = document.documentElement.style;
            for (const variable in vars) {
                r.removeProperty(variable);
            }
            applyTheme();
        }
    });
}