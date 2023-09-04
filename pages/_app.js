import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { register } from 'next-offline/runtime';
import { useEffect, useState } from 'react';
export default function App({ Component, pageProps }) {

  useEffect(() => {
    //register('https://beta.jamesmowat.com/service-worker.js')
    register(`${process.env.NEXT_PUBLIC_CURRENTURL}/service-worker-min.js`)
  }, [])


  useEffect(() => {
    let vars = {}

    function applyTheme() {
      const theme = window.localStorage.getItem('theme')
      const customTheme = window.localStorage.getItem('Custom_theme')
      if (JSON.parse(customTheme)?.enabled) {
        vars = JSON.parse(customTheme).data
      } else {
        switch (theme) {
          case 'purple':
            vars = {
              '--background': '#373544',
              '--big_button_background': '#f2f2f2',
              '--big_button_border': '#d5d5d5',
              '--big_button_border_hover_alt': '#a8a8a8',
              '--big_button_text': '#7d7d7d',
              '--editor_text': '#fff',
              '--desktophidemenu_bg': '#4b4860',
              '--desktophidemenu_bg_hover': '#676286',
              '--boxshadow_primary': '#2a283487',
              '--page_list_item_hover': '#48445e',
              '--page_list_item_active': '#00000029',
              '--page_list_item_icons_background_hover': '#524f68',
              '--page_list_item_hover_drag': '#ff7777',
              '--create_new_page_btn_text': '#929292',
              '--page_list_item_icons': '#ffffffa8',
              '--page_list_item_fillcolor': '#ffffffa8',
              '--modal_color-23-7309aa07_NOTUSED': '#464457',
              '--modal_text_color': '#fff',
              '--modal_button_svg': '#cdcdcd',
              '--modal_background': '#32303e',
              '--modal_color-25-1133eaba_NOTUSED': '#373544',
              '--modal_button_text': '#cdcdcd',
              '--modal_color-26-3e9fea21_NOTUSED': '#47435f',
              '--modal_color-19-8243e20a': '#ff2d2d',
              '--modal_color-28-8fb448ab_NOTUSED': '#d3d3d3',
              '--modal_close_button_hover': '#c3c3c3',
              '--modal_color-3-42429cc0': '#373544',
              '--modal_button_bg': '#4b4764',
              '--modal_button_border': 'none',
              '--modal_button_bg_hover': '#272537',
              '--modal_button_text_hover': '#fff',
              '--modal_button_bxshdw_hover': 'none',
              '--userinfo_section_bordertop': '#403e4f',
              '--user_option_text': '#c8c8c8'
            }
            break;
          case 'navy blue':
            vars = {
              '--background': '#353b44',
              '--big_button_background': '#353535',
              '--big_button_border': '#4f4f4f',
              '--big_button_border_hover_alt': '#2d2d2d',
              '--big_button_text': '#707684',
              '--editor_text': '#fff',
              '--desktophidemenu_bg': '#464646',
              '--desktophidemenu_bg_hover': '#040404',
              '--boxshadow_primary': '#2f343c',
              '--page_list_item_hover': '#000000',
              '--page_list_item_active': '#0000001a',
              '--page_list_item_icons_background_hover': '#282828',
              '--page_list_item_hover_drag': '#ff7777',
              '--create_new_page_btn_text': '#fff',
              '--page_list_item_icons': '#ffffff99',
              '--page_list_item_fillcolor': '#ffffff99',
              '--modal_color-23-7309aa07_NOTUSED': '#464457',
              '--modal_text_color': '#fff',
              '--modal_background': '#414b59',
              '--modal_color-25-1133eaba_NOTUSED': '#373544',
              '--modal_button_text': '#707684',
              '--modal_color-26-3e9fea21_NOTUSED': '#47435f',
              '--modal_color-19-8243e20a': '#ff2d2d',
              '--modal_color-28-8fb448ab_NOTUSED': '#d3d3d3',
              '--modal_close_button_hover': '#ebebeb',
              '--modal_button_bg': '#353b44',
              '--modal_button_border': 'none',
              '--modal_button_bg_hover': '#282d34',
              '--modal_button_text_hover': '#fff',
              '--modal_button_bxshdw_hover': '#2d333a',
              '--editor_text': '#fff',
              '--userinfo_section_bordertop': '#404753',
            }
            break;
          case 'pro pink':
            vars = {
              '--background': '#e3abdb',
              '--big_button_background': '#d06ec2',
              '--big_button_border': '#000',
              '--big_button_border_hover_alt': '#2d2d2d',
              '--big_button_text': '#ffffff',
              '--editor_text': '#fff',
              '--desktophidemenu_bg': '#464646',
              '--desktophidemenu_bg_hover': '#040404',
              '--boxshadow_primary': '#e0a7d8',
              '--page_list_item_hover': '#ee9de2',
              '--page_list_item_active': '#0000001a',
              '--page_list_item_icons_background_hover': '#e095d5',
              '--page_list_item_hover_drag': '#ff7777',
              '--create_new_page_btn_text': '#fff',
              '--page_list_item_icons': '#ffffffcf',
              '--page_list_item_fillcolor': '#ffffffcf',
              '--modal_color-23-7309aa07_NOTUSED': '#464457',
              '--modal_text_color': '#fff',
              '--modal_background': '#d09bc9',
              '--modal_color-25-1133eaba_NOTUSED': '#373544',
              '--modal_button_text': '#ffffff',
              '--modal_color-26-3e9fea21_NOTUSED': '#47435f',
              '--modal_color-19-8243e20a': '#ff2d2d',
              '--modal_color-28-8fb448ab_NOTUSED': '#d3d3d3',
              '--modal_close_button_hover': '#ebebeb',
              '--modal_button_bg': '#d06ec2',
              '--modal_button_border': 'none',
              '--modal_button_bg_hover': '#b461a8',
              '--modal_button_text_hover': '#ffffff',
              '--modal_button_bxshdw_hover': '#2d333a00',
              '--modal_button_svg': '#fff',
              '--modal_color-3-42429cc0': '#e3abdb',
              '--user_option_text': '#fffceb',
              '--userinfo_section_bordertop': '#af63a4'
            }
            break;
          case 'relax orange':
            vars = {
              '--background': '#e69973',
              '--big_button_background': '#d87c4f',
              '--big_button_border': '#d18966',
              '--big_button_border_hover_alt': '#2d2d2d',
              '--big_button_text': '#ffffff',
              '--editor_text': '#fff',
              '--desktophidemenu_bg': '#464646',
              '--desktophidemenu_bg_hover': '#040404',
              '--boxshadow_primary': '#d18b68',
              '--page_list_item_hover': '#be744f',
              '--page_list_item_active': '#0000001a',
              '--page_list_item_icons_background_hover': '#ab6745',
              '--page_list_item_hover_drag': '#ff7777',
              '--create_new_page_btn_text': '#fff',
              '--page_list_item_icons': '#ffffffcf',
              '--page_list_item_fillcolor': '#ffffffcf',
              '--modal_color-23-7309aa07_NOTUSED': '#464457',
              '--modal_text_color': '#fff',
              '--modal_background': '#eb9a72',
              '--modal_color-25-1133eaba_NOTUSED': '#373544',
              '--modal_button_text': '#ffffff',
              '--modal_color-26-3e9fea21_NOTUSED': '#47435f',
              '--modal_color-19-8243e20a': '#ff2d2d',
              '--modal_color-28-8fb448ab_NOTUSED': '#d3d3d3',
              '--modal_close_button_hover': '#ebebeb',
              '--modal_button_bg': '#d87c4f',
              '--modal_color-3-42429cc0': '#a1684c',
              '--modal_button_border': 'none',
              '--modal_button_bg_hover': '#d67445',
              '--modal_button_svg': '#fff',
              '--modal_button_text_hover': '#dedede',
              '--modal_button_bxshdw_hover': '#2d333a00',
              '--user_option_text': '#fffceb',
              '--userinfo_section_bordertop': '#c8815e',
              '--editor_text': '#fff',
              '--userinfo_section_bordertop': '#d58e6b',
            }
            break;
          case 'pro dark':
            vars = {
              '--background': '#000000',
              '--big_button_background': '#0c0c0c',
              '--big_button_border': '#000000',
              '--big_button_border_hover_alt': '#2d2d2d',
              '--big_button_text': '#7d7d7d',
              '--editor_text': '#fff',
              '--desktophidemenu_bg': '#464646',
              '--desktophidemenu_bg_hover': '#040404',
              '--boxshadow_primary': '#080808',
              '--page_list_item_hover': '#2b2b2b',
              '--page_list_item_active': '#0000001a',
              '--page_list_item_icons_background_hover': '#383838',
              '--page_list_item_hover_drag': '#ff7777',
              '--create_new_page_btn_text': '#fff',
              '--page_list_item_icons': '#ffffff99',
              '--page_list_item_fillcolor': '#ffffff99',
              '--modal_color-23-7309aa07_NOTUSED': '#464457',
              '--modal_text_color': '#fff',
              '--modal_background': '#111111',
              '--modal_color-25-1133eaba_NOTUSED': '#373544',
              '--modal_button_text': '#707684',
              '--modal_color-26-3e9fea21_NOTUSED': '#47435f',
              '--modal_color-19-8243e20a': '#ff2d2d',
              '--modal_color-28-8fb448ab_NOTUSED': '#d3d3d3',
              '--modal_close_button_hover': '#ebebeb',
              '--modal_button_bg': '#292929',
              '--modal_button_border': 'none',
              '--modal_button_bg_hover': '#2b2b2b',
              '--modal_button_text_hover': '#fff',
              '--modal_button_bxshdw_hover': '#000000',
              '--editor_text': '#fff',
              '--userinfo_section_bordertop': '#141414',
            }
            break;
          case 'mid light':
            vars = {
              '--background': '#f9f9f9',
              '--big_button_background': '#f2f2f2',
              '--big_button_border': '#d5d5d5',
              '--big_button_border_hover_alt': '#a8a8a8',
              '--big_button_text': '#7d7d7d',
              '--editor_text': '#000',
              '--desktophidemenu_bg': '#ffffff',
              '--desktophidemenu_bg_hover': '#c0c0c0',
              '--boxshadow_primary': '#f3f3f39e',
              '--page_list_item_hover': '#d8d8d8',
              '--page_list_item_active': '#00000029',
              '--page_list_item_icons_background_hover': '#c4c4c4',
              '--page_list_item_hover_drag': '#ff7777',
              '--create_new_page_btn_text': '#929292',
              '--page_list_item_icons': '#00000099',
              '--page_list_item_fillcolor': '#00000099',
              '--modal_color-23-7309aa07_NOTUSED': '#464457',
              '--modal_text_color': '#000',
              '--modal_button_svg': '#707684',
              '--modal_background': '#ffffff',
              '--modal_color-25-1133eaba_NOTUSED': '#373544',
              '--modal_button_text': '#707684',
              '--modal_color-26-3e9fea21_NOTUSED': '#47435f',
              '--modal_color-19-8243e20a': '#ff2d2d',
              '--modal_color-28-8fb448ab_NOTUSED': '#d3d3d3',
              '--modal_close_button_hover': '#000000',
              '--modal_color-3-42429cc0': '#fff',
              '--modal_button_bg': '#eaeaea',
              '--modal_button_border': 'none',
              '--modal_button_bg_hover': '#000000',
              '--modal_button_text_hover': '#fff',
              '--modal_button_bxshdw_hover': '#e2e2e2',
              '--userinfo_section_bordertop': '#b8b8b8',
              '--user_option_text': '#464646'
            }
            break;
          default:
            break;
        }
      }
      const r = document.documentElement.style;
      for (const variable in vars) {
        r.setProperty(variable, vars[variable]);
      }
    }
    applyTheme();

    // Listen for changes in local storage
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
  })

  return (
    <>
      <ToastContainer position="top-center" theme='dark' />
      <Component {...pageProps} />
    </>
  )
}
