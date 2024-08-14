import { useEffect, useState } from "react";
import { Button } from "..";
import { GetThemes } from "@/lib/Themes";

export default function ThemesList() {
    const [themes, setThemes] = useState([])

    useEffect(() => {
        GetThemes().then((res) => setThemes(res))
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
        <div className="grid p-1 gap-4">
            <div className="">
                <h3 className="text-sm w-full mb-1">Themes</h3>
            </div>
            {themes.map((theme) => (
                <div key={theme.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={theme.color} style={{ color: theme.color }} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10" /></svg>
                        <span className="font-medium text-sm text-zinc-600 flex items-center">{theme.display_name}</span>
                    </div>
                    <Button onClick={() => updateTheme(theme.id)}>Select</Button>
                </div>
            ))}

        </div>
    )
}