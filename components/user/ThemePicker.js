import { PopUpCardDropMenuSection, PopUpCardDropMenuSectionItem } from "@/lib/Pop-Cards/PopDropMenu";
import { useEffect, useState } from "react";

export default function UserHelpModal({ CloseHelp }) {
    //const [themePicker, setThemePicker] = useState(false);
    const [themes, setThemes] = useState([])
    useEffect(() => {
        async function getThemes() {
            const themeFetch = await fetch(`${process.env.NEXT_PUBLIC_CURRENTURL}/themes.json`)
            const themeFile = await themeFetch.json()
            setThemes([...themeFile, { display_name: 'System', id: 'system' }])
        }
        getThemes()
    }, [])

    function disableCustomTheme() {
        try {
            const customTheme = window.localStorage.getItem('Custom_theme')
            window.localStorage.setItem('Custom_theme', JSON.stringify({ 'enabled': false, 'data': JSON.parse(customTheme).data }))
        } catch (err) { }
    }

    function updateTheme(theme) {
        disableCustomTheme();
        window.localStorage.setItem('theme', theme);

        // Create a storage event and dispatch it
        const storageEvent = new Event('storage');
        storageEvent.key = 'theme';
        storageEvent.newValue = theme;
        window.dispatchEvent(storageEvent);
    }

    return (
        <>
            <PopUpCardDropMenuSection>
                {themes.map((theme) => (
                    <PopUpCardDropMenuSectionItem onClick={() => {
                        updateTheme(theme.id)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={theme.color} style={{ color: theme.color }} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10" /></svg>
                        <p>{theme.display_name}</p>
                    </PopUpCardDropMenuSectionItem>
                ))}
            </PopUpCardDropMenuSection>
            {/*<PopUpCardDropMenuSection>
                <PopUpCardDropMenuSectionItem onClick={() => ToggleTabBar()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-top"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /></svg>
                    <p>Show tab bar</p>
                </PopUpCardDropMenuSectionItem>
                </PopUpCardDropMenuSection>*/}
        </>
    )
}
