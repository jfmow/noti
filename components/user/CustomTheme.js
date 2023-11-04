import { AlternateButton, ModalButton, ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";
import styles from '@/styles/Themepicker.module.css'
import { useEffect, useState } from "react";
export default function CustomThemePicker({ close }) {
    const [items, setItems] = useState([
        [
            "--background",
            "#f9f9f9"
        ],
        [
            "--editor_text",
            "#000"
        ],
        [
            "--boxshadow_primary",
            "#e0e0e0"
        ],
        [
            "--page_list_item_hover",
            "#d8d8d8"
        ],
        [
            "--page_list_item_active",
            "#00000029"
        ],
        [
            "--page_list_item_icons_background_hover",
            "#c4c4c4"
        ],
        [
            "--page_list_item_hover_drag",
            "#ff7777"
        ],
        [
            "--page_list_item_icons",
            "#00000099"
        ],
        [
            "--page_list_item_fillcolor",
            "#00000099"
        ],
        [
            "--create_new_page_btn_text",
            "#fff"
        ],
        [
            "--modal_text_color",
            "#000"
        ],
        [
            "--popup_background",
            "#ffffff"
        ],
        [
            "--modal_button_text",
            "#707684"
        ],
        [
            "--modal_close_button_hover",
            "#000000"
        ],
        [
            "--modal_color-3-42429cc0",
            "#fff"
        ],
        [
            "--popup_button_bg",
            "#eaeaea"
        ],
        [
            "--popup_button_bg_hover",
            "#000000"
        ],
        [
            "--modal_button_text_hover",
            "#fff"
        ],
        [
            "--modal_button_bxshdw_hover",
            "#e2e2e2"
        ],
        [
            "--userinfo_section_bordertop",
            "#b8b8b8"
        ],
        [
            "--user_option_text",
            "#464646"
        ]
    ])
    function arrayToVars(array) {
        const vars = {};

        for (const [key, value] of array) {
            vars[key] = value;
        }

        return vars;
    }
    useEffect(() => {
        if (window.localStorage.getItem('Custom_theme')) {
            console.log(JSON.parse(window.localStorage.getItem('Custom_theme')))
            setItems(Object.entries(JSON.parse(window.localStorage.getItem('Custom_theme')).data))
        }
    }, [])
    useEffect(() => {

        const newTheme = arrayToVars(items)
        const r = document.documentElement.style;
        for (const variable in newTheme) {
            r.setProperty(variable, newTheme[variable]);
        }
    }, [items])

    function saveTheme() {
        const newTheme = arrayToVars(items)
        window.localStorage.setItem('Custom_theme', JSON.stringify({ 'enabled': true, 'data': newTheme }))
    }

    return (
        <>

            <ModalContainer events={close} noblur={true}>
                <ModalForm>
                    <ModalTitle>Custom theme picker</ModalTitle>
                    <div className={styles.container}>
                        <h3>Hover names for more info</h3>
                        {items.map((item, index) => (
                            <div className={styles.coloritem}>
                                <span title={item[2]}>{item[0].replace('--', '').toUpperCase()}</span>
                                <span><input className={styles.colorpicker} type="color" value={item[1]} onChange={(e) => {
                                    const updatedItems = [...items];
                                    const indexToUpdate = updatedItems.findIndex((i) => i[0] === item[0]);
                                    if (indexToUpdate !== -1) {
                                        updatedItems[indexToUpdate][1] = e.target.value;
                                        setItems(updatedItems);
                                    }
                                }} /></span>
                            </div>
                        ))}
                    </div>
                    <AlternateButton click={() => saveTheme()}>Save</AlternateButton>
                    <span className={styles.reftext}>Refrence items</span>
                    <AlternateButton>Modal Button</AlternateButton>
                    <span>Look at the page for the rest as you change them :)</span>
                </ModalForm>
            </ModalContainer>

        </>
    )
}