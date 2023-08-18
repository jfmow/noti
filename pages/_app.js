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
    const theme = window.localStorage.getItem('theme')
    let vars = {}
    switch (theme) {
      case 'purple':
        vars = {
          '--background': '#373544',
          '--big_button_background': '#353535',
          '--big_button_border': '#4f4f4f',
          '--big_button_border_hover_alt': '#2d2d2d',
          '--big_button_text': '#707684',
          '--create_text_color': '#fff',
          '--desktophidemenu_bg': '#464646',
          '--desktophidemenu_bg_hover': '#040404',
          '--root_boxshadow': '#1d1d1d',
          '--itemoption_hover': '#000000',
          '--itemoption_active': '#0000001a',
          '--btn1_hover': '#282828',
          '--itemoption_hover_drag': '#ff7777',
          '--createpage_txt': '#3d3d3d',
          '--itemoption_textcolor': '#ffffff99',
          '--itemoption_fillcolor': '#ffffff99',
          '--modal_color-23-7309aa07': '#464457',
          '--modal_color-0-c42e25a8': '#fff',
          '--modal_color-1-ea5ca4f1': '#373544',
          '--modal_color-25-1133eaba': '#373544',
          '--modal_color-18-c8f98051': '#707684',
          '--modal_color-26-3e9fea21': '#47435f',
          '--modal_color-19-8243e20a': '#ff2d2d',
          '--modal_color-28-8fb448ab': '#d3d3d3',
          '--modal_color-7-0c0f90f8': '#ebebeb',
          '--modal_button_bg': '#423f59',
          '--modal_button_border': 'none',
          '--modal_button_bg_hover': '#373544',
          '--modal_button_text_hover': '#fff',
          '--modal_button_bxshdw_hover': '#46425e'
        }
        break;
      case 'navy blue':
        vars = {
          '--background': '#353b44',
          '--big_button_background': '#353535',
          '--big_button_border': '#4f4f4f',
          '--big_button_border_hover_alt': '#2d2d2d',
          '--big_button_text': '#707684',
          '--create_text_color': '#fff',
          '--desktophidemenu_bg': '#464646',
          '--desktophidemenu_bg_hover': '#040404',
          '--root_boxshadow': '#2f343c',
          '--itemoption_hover': '#000000',
          '--itemoption_active': '#0000001a',
          '--btn1_hover': '#282828',
          '--itemoption_hover_drag': '#ff7777',
          '--createpage_txt': '#fff',
          '--itemoption_textcolor': '#ffffff99',
          '--itemoption_fillcolor': '#ffffff99',
          '--modal_color-23-7309aa07': '#464457',
          '--modal_color-0-c42e25a8': '#fff',
          '--modal_color-1-ea5ca4f1': '#414b59',
          '--modal_color-25-1133eaba': '#373544',
          '--modal_color-18-c8f98051': '#707684',
          '--modal_color-26-3e9fea21': '#47435f',
          '--modal_color-19-8243e20a': '#ff2d2d',
          '--modal_color-28-8fb448ab': '#d3d3d3',
          '--modal_color-7-0c0f90f8': '#ebebeb',
          '--modal_button_bg': '#353b44',
          '--modal_button_border': 'none',
          '--modal_button_bg_hover': '#282d34',
          '--modal_button_text_hover': '#fff',
          '--modal_button_bxshdw_hover': '#2d333a'
        }
        break;
      case 'pro pink':
        vars = {
          '--background': '#693f60',
          '--big_button_background': '#693f60',
          '--big_button_border': '#848484',
          '--big_button_border_hover_alt': '#2d2d2d',
          '--big_button_text': '#ffffff',
          '--create_text_color': '#fff',
          '--desktophidemenu_bg': '#464646',
          '--desktophidemenu_bg_hover': '#040404',
          '--root_boxshadow': '#57334f',
          '--itemoption_hover': '#8c5480',
          '--itemoption_active': '#ffd7fe1a',
          '--btn1_hover': '#713e66',
          '--itemoption_hover_drag': '#ff7777',
          '--createpage_txt': '#3d3d3d',
          '--itemoption_textcolor': '#fffffffa',
          '--itemoption_fillcolor': '#fffffffa',
          '--modal_color-23-7309aa07': '#464457',
          '--modal_color-0-c42e25a8': '#fff',
          '--modal_color-1-ea5ca4f1': '#844f79',
          '--modal_color-25-1133eaba': '#373544',
          '--modal_color-18-c8f98051': '#ffffff',
          '--modal_color-26-3e9fea21': '#47435f',
          '--modal_color-19-8243e20a': '#ff2d2d',
          '--modal_color-28-8fb448ab': '#d3d3d3',
          '--modal_color-7-0c0f90f8': '#ebebeb',
          '--modal_button_bg': '#693f60',
          '--modal_button_border': 'none',
          '--modal_button_bg_hover': '#56314d',
          '--modal_button_text_hover': '#fff',
          '--modal_button_bxshdw_hover': '#81467400',
          '--modal_color-22-a09b1904': '#fff'
        }
        break;
      case 'relax orange':
        vars = {
          '--background': '#e69973',
'--big_button_background': '#d87c4f',
'--big_button_border': '#d18966',
'--big_button_border_hover_alt': '#2d2d2d',
'--big_button_text': '#ffffff',
'--create_text_color': '#fff',
'--desktophidemenu_bg': '#464646',
'--desktophidemenu_bg_hover': '#040404',
'--root_boxshadow': '#d18b68',
'--itemoption_hover': '#be744f',
'--itemoption_active': '#0000001a',
'--btn1_hover': '#ab6745',
'--itemoption_hover_drag': '#ff7777',
'--createpage_txt': '#fff',
'--itemoption_textcolor': '#ffffffcf',
'--itemoption_fillcolor': '#ffffffcf',
'--modal_color-23-7309aa07': '#464457',
'--modal_color-0-c42e25a8': '#fff',
'--modal_color-1-ea5ca4f1': '#eb9a72',
'--modal_color-25-1133eaba': '#373544',
'--modal_color-18-c8f98051': '#ffffff',
'--modal_color-26-3e9fea21': '#47435f',
'--modal_color-19-8243e20a': '#ff2d2d',
'--modal_color-28-8fb448ab': '#d3d3d3',
'--modal_color-7-0c0f90f8': '#ebebeb',
'--modal_button_bg': '#d87c4f',
'--modal_color-3-42429cc0': '#a1684c',
'--modal_button_border': 'none',
'--modal_button_bg_hover': '#d67445',
'--modal_color-22-a09b1904': '#fff',
'--modal_button_text_hover': '#dedede',
'--modal_button_bxshdw_hover': '#2d333a00',
'--user_option_text': '#fffceb',
'--useroption_border_color': '#c8815e'
        }
        break;
      default:
        break;
    }
    const r = document.documentElement.style;

    for (const variable in vars) {
      r.setProperty(variable, vars[variable]);
    }
  })

  return (
    <>
      <ToastContainer position="top-center" theme='dark' />
      <Component {...pageProps} />
    </>
  )
}
