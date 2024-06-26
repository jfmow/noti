import { DropDownItem, DropDownSection } from "@/lib/Pop-Cards/DropDown";
import { GetThemes } from "@/lib/Themes";
import { useEffect, useState } from "react";

export default function ThemePickerPopup() {
    const [themes, setThemes] = useState([1, 2, 3, 4, 5, 6, 7])
    useEffect(() => {
        GetThemes().then((res) => {
            setThemes(res)
        })
    }, [])

    function updateTheme(theme) {
        window.localStorage.setItem('theme', theme);

        // Create a storage event and dispatch it
        const storageEvent = new Event('storage');
        storageEvent.key = 'theme';
        storageEvent.newValue = theme;
        window.dispatchEvent(storageEvent);
    }

    return (
        <>
            <DropDownSection>
                {themes.map((theme) => (
                    <DropDownItem onClick={() => {
                        updateTheme(theme.id)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={theme.color} style={{ color: theme.color }} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10" /></svg>
                        <p>{theme.display_name}</p>
                    </DropDownItem>
                ))}
            </DropDownSection>
        </>
    )
}
