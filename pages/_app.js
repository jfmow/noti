import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { register } from 'next-offline/runtime';
import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';
export default function App({ Component, pageProps }) {

  useEffect(() => {
    //register('https://beta.jamesmowat.com/service-worker.js')
    register(`${process.env.NEXT_PUBLIC_CURRENTURL}/service-worker.js`)
  }, [])

  useEffect(() => {
    var r = document.querySelector(':root');
    var rs = getComputedStyle(r);
    // Alert the value of the --blue variable
    //alert("The value of --blue is: " + rs.getPropertyValue('--background'));
    const theme = window.localStorage.getItem('theme')
    function setCSSVariables() {
      switch (theme) {
        case 'purple':
          const variables = {
            '--main_color': '#00bcd4',
            '--btn_border_radius': '5px',
            '--main_btn_color': '#00bcd4',
            '--main_btn_color_action': '#15cce4',
            '--big_button_border': 'rgba(201, 201, 204, .48)',
            '--big_button_text': '#707684',
            '--big_button_background': '#fff',
            '--big_button_background_hover': '#000',
            '--big_button_border_hover_alt': '#b7b7b7',
            '--background': '#373544',
            '--color-7a5ad9': '#7a5ad9',
            '--color-FFF7EA': '#FFF7EA',
            '--color-e9e9e9': '#312d3f',
            '--color-rgba555347035': 'rgb(255 255 255 / 35%)',
            '--color-rgb228228228': 'rgb(89 89 89)',
            '--color-f4f4f4': '#f4f4f4',
            '--color-19171199': '#ffffff99',
            '--color-rgb245245245': 'rgb(67 60 89)',
            '--color-cecece1a': '#cecece1a',
            '--color-ababab6e': '#ababab6e',
            '--color-rgb515151': 'rgb(51, 51, 51)',
            '--color-767676': '#767676',
            '--color-000': '#000',
            '--color-4e4e4e': '#4e4e4e',
            '--color-526f8f': '#526f8f',
            '--color-191919': '#191919',
            '--color-rgba255255255035': 'rgba(255, 255, 255, 0.35)',
            '--color-242424': '#242424',
            '--color-rgb343434': 'rgb(34, 34, 34)',
            '--color-ffffff99': '#ffffff99',
            '--color-rgb000': 'rgb(0, 0, 0)',
            '--color-0000001a': '#0000001a',
            '--color-2e2e2e6e': '#2e2e2e6e',
            '--color-242424de': '#242424de',
            '--color-ffffffb8': '#ffffffb8',
            '--color-1d1d1d83': '#1d1d1d83',
            '--color-03a9f4': '#03a9f4',
            '--color-hsl2149759': 'hsl(214, 97%, 59%)',
            '--color-fff': '#fff',
            '--color-e8e8eb': '#e8e8eb',
            '--color-rgba13203313': 'rgba(13, 20, 33, .13)',
            '--color-707684': '#707684',
            '--color-rgba20120120448': 'rgba(201, 201, 204, .48)',
            '--color-EFF0F1': '#EFF0F1',
            '--color-388AE5': '#388AE5',
            '--color-rgba561382291': 'rgba(56, 138, 229, .1)',
            '--color-rgba3418625508': 'rgba(34, 186, 255, .08)',
            '--color-rgba716122708': 'rgba(7, 161, 227, .08)',
            '--color-eff2f5': '#eff2f5',
            '--color-E24A4A': '#E24A4A',
            '--color-CE4343': '#CE4343',
            '--color-dedede': '#dedede',
            '--color-rgb52228255': 'rgb(52, 228, 255)',
            '--color-rgb0225255': 'rgb(0, 225, 255)',
            '--color-ffffff': '#ffffff',
            '--color-000000': '#000000',
            '--color-9f86ff': '#9f86ff',
            '--color-8f8f8f': '#8f8f8f',
            '--color-607d8b': '#607d8b',
            '--color-fff': '#fff',
            '--color-b1b1b1': '#b1b1b1',
            '--color-ff6c6c': '#ff6c6c',
            '--color-3bb994': '#3bb994',
            '--color-rgba00005': 'rgba(0, 0, 0, 0.5)',
            '--color-ececec': '#ececec',
            '--color-000': '#000',
            '--color-ffffff57': '#ffffff57',
            '--color-rgb255255255': 'rgb(255, 255, 255)',
            '--color-rgb25521699': 'rgb(255, 216, 99)',
            '--color-0d2342': '#0d2342',
            '--color-00000000': '#00000000',
            '--color-e4e4e4': '#e4e4e4',
            '--color-353535': '#353535',
            '--color-2196F300': '#2196F300',
            '--color-2196F3': '#2196F3',
            '--color-fff0': '#fff0',
            '--color-rgb0rgb000': 'rgb(0, 0, 0)',
            '--color-a9a9a9': '#a9a9a9',
            '--color-ff5555': '#ff5555',
            '--color-0071e2': '#0071e2',
            '--color-rgba00002': 'rgba(0,0,0,0.2)',
            '--color-fff': '#fff',
            '--color-fff0': '#fff0',
            '--color-9E9E9E': '#9E9E9E',
            '--color-607D8B': '#607D8B',
            '--color-0b0b0b': '#0b0b0b',

            '--color-9da5b5': '#9da5b5',
            '--color-191919': '#191919',
            '--color-707684': '#707684',

            '--color': '#fff',


          };
          const r = document.documentElement.style;

          for (const variable in variables) {
            r.setProperty(variable, variables[variable]);
          }
          break;
        case 'blue':
          const variables2 = {
            '--main_color': '#00bcd4',
            '--btn_border_radius': '5px',
            '--main_btn_color': '#00bcd4',
            '--main_btn_color_action': '#15cce4',
            '--big_button_border': 'rgba(201, 201, 204, .48)',
            '--big_button_text': '#707684',
            '--big_button_background': '#fff',
            '--big_button_background_hover': '#000',
            '--big_button_border_hover_alt': '#b7b7b7',
            '--background': '#54b2fa',
            '--color-7a5ad9': '#7a5ad9',
            '--color-FFF7EA': '#FFF7EA',
            '--color-e9e9e9': '#377b84',
            '--color-rgba555347035': 'rgba(55, 53, 47, 0.35)',
            '--color-rgb228228228': 'rgb(119 211 242)',
            '--color-f4f4f4': '#f4f4f4',
            '--color-19171199': '#19171199',
            '--color-rgb245245245': 'rgb(110 205 231)',
            '--color-cecece1a': '#cecece1a',
            '--color-ababab6e': '#ababab6e',
            '--color-rgb515151': 'rgb(51, 51, 51)',
            '--color-767676': '#767676',
            '--color-000': '#000',
            '--color-4e4e4e': '#4e4e4e',
            '--color-526f8f': '#526f8f',
            '--color-191919': '#191919',
            '--color-rgba255255255035': 'rgba(255, 255, 255, 0.35)',
            '--color-242424': '#72baff',
            '--color-rgb343434': 'rgb(34, 34, 34)',
            '--color-ffffff99': '#ffffff99',
            '--color-rgb000': 'rgb(0, 0, 0)',
            '--color-0000001a': '#0000001a',
            '--color-2e2e2e6e': '#2e2e2e6e',
            '--color-242424de': '#242424de',
            '--color-ffffffb8': '#ffffffb8',
            '--color-1d1d1d83': '#1d1d1d83',
            '--color-03a9f4': '#03a9f4',
            '--color-hsl2149759': 'hsl(214, 97%, 59%)',
            '--color-fff': '#fff',
            '--color-e8e8eb': '#e8e8eb',
            '--color-rgba13203313': 'rgba(13, 20, 33, .13)',
            '--color-707684': '#707684',
            '--color-rgba20120120448': 'rgba(201, 201, 204, .48)',
            '--color-EFF0F1': '#EFF0F1',
            '--color-388AE5': '#388AE5',
            '--color-rgba561382291': 'rgba(56, 138, 229, .1)',
            '--color-rgba3418625508': 'rgba(34, 186, 255, .08)',
            '--color-rgba716122708': 'rgba(7, 161, 227, .08)',
            '--color-eff2f5': '#eff2f5',
            '--color-E24A4A': '#E24A4A',
            '--color-CE4343': '#CE4343',
            '--color-dedede': '#dedede',
            '--color-rgb52228255': 'rgb(52, 228, 255)',
            '--color-rgb0225255': 'rgb(0, 225, 255)',
            '--color-ffffff': '#ffffff',
            '--color-000000': '#000000',
            '--color-9f86ff': '#9f86ff',
            '--color-8f8f8f': '#8f8f8f',
            '--color-607d8b': '#607d8b',
            '--color-fff': '#fff',
            '--color-b1b1b1': '#377b84',
            '--color-ff6c6c': '#ff6c6c',
            '--color-3bb994': '#3bb994',
            '--color-rgba00005': 'rgba(0, 0, 0, 0.5)',
            '--color-ececec': '#ececec',
            '--color-000': '#000',
            '--color-ffffff57': '#ffffff57',
            '--color-rgb255255255': 'rgb(255, 255, 255)',
            '--color-rgb25521699': 'rgb(255, 216, 99)',
            '--color-0d2342': '#0d2342',
            '--color-00000000': '#00000000',
            '--color-e4e4e4': '#e4e4e4',
            '--color-353535': '#353535',
            '--color-2196F300': '#2196F300',
            '--color-2196F3': '#2196F3',
            '--color-fff0': '#fff0',
            '--color-rgb0rgb000': 'rgb(0, 0, 0)',
            '--color-a9a9a9': '#a9a9a9',
            '--color-ff5555': '#ff5555',
            '--color-0071e2': '#0071e2',
            '--color-rgba00002': 'rgba(0,0,0,0.2)',
            '--color-fff': '#fff',
            '--color-fff0': '#fff0',
            '--color-9E9E9E': '#9E9E9E',
            '--color-607D8B': '#607D8B',
            '--color-0b0b0b': '#418693',
            '--color-262626': '#262626',
            '--color-9da5b5': '#fff',
            '--color-191919': '#418693',
            '--color-707684': '#707684',
            '--color': '#000',
            '--color-000000': '#000000',
            '--color-ffffff': '#ffffff',
            '--color-9d9d9d': '#9d9d9d',
            '--color-dfdfdf': '#dfdfdf',
            '--color-rgb227227227': 'rgb(227, 227, 227)',
            '--color-8e8e8eb8': '#8e8e8eb8',
            '--color-4f4f4f': '#4f4f4f',
            '--color-333333': '#333333',
            '--color-eb2323': '#eb2323',
            '--color-f63b3b': '#f63b3b',
            '--color-1d926f': '#1d926f',
            '--color-3bb994': '#3bb994',
            '--color-919191': '#919191',
            '--color-1899d6': '#1899d6',
            '--color-1cb0f6': '#1cb0f6',
            '--color-rgba2552552550': 'rgba(255, 255, 255, 0)',
            '--color-rgba20120120448': 'rgba(201,201,204,.48)',
            '--color-e8e8e8': '#e8e8e8',
            '--color-707684': '#fff',
            '--color-ff2d2d': '#ff2d2d',
            '--color-fff': '#fff',
            '--color-000': '#000',
            '--color-50545d': '#50545d',
            '--color-1f1f1f': '#1f1f1f',
            '--color-353535': '#353535',
            '--color-1c1c1c': '#1c1c1c',
            '--color-rgb149149149': 'rgb(149, 149, 149)',
            '--color-d3d3d3': '#d3d3d3'


          };
          const r2 = document.documentElement.style;

          for (const variable in variables2) {
            r2.setProperty(variable, variables2[variable]);
          }
          break;
        default:
          break;
      }

    }

    setCSSVariables();

  })
  return (
    <>
      <ToastContainer position="top-center" theme='dark' />
      <Component {...pageProps} />
    </>
  )
}
