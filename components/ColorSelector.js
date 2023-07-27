import { ModalContainer, ModalForm, ModalTitle } from '@/lib/Modal';
import React from 'react';
import { useState } from 'react';

const colors = [
    '#FF00001a', // Red with opacity 1a

    '#00FF001a', // Green with opacity 1a

    '#0000FF1a', // Blue with opacity 1a

    '#FFFF001a', // Yellow with opacity 1a

    '#FF00FF1a', // Magenta with opacity 1a

    '#00FFFF1a', // Cyan with opacity 1a

    '#FFA5001a', // Orange with opacity 1a

    '#8000801a', // Purple with opacity 1a

    '#FFC0CB1a', // Pink with opacity 1a

    '#8080801a', // Gray with opacity 1a

    '#FFFFFF1a', // White with opacity 1a

    '#0000001a',

    '#60ff491a',

    '#49abff1a',


    '#60ff491a', // Light green with opacity 1a

    '#49abff1a', // Light blue with opacity 1a

    '#FF14931a', // Deep pink with opacity 1a

    '#0080001a', // Dark green with opacity 1a

    '#7B68EE1a', // Medium slate blue with opacity 1a

    '#FF45001a', // Orange red with opacity 1a

    '#1E90FF1a', // Dodger blue with opacity 1a

    '#BA55D31a', // Medium orchid with opacity 1a

    '#A9A9A91a', // Dark gray with opacity 1a

    '#FAEBD71a', // Antique white with opacity 1a

    '#8B45131a', // Saddle brown with opacity 1a

    '#EE82EE1a', // Violet with opacity 1a

    '#CD853F1a', // Peru with opacity 1a

    '#FF63471a', // Tomato with opacity 1a

    '#00CED11a', // Dark turquoise with opacity 1a

    '#4682B41a', // Sea green with opacity 1a

    '#FF7F501a', // Coral with opacity 1a

    '#48D1CC1a', // Medium turquoise with opacity 1a

    '#DAA5201a', // Goldenrod with opacity 1a

    '#2E8B571a', // Sea green (2) with opacity 1a

    '#FF69B41a', // Hot pink with opacity 1a

    '#DC143C1a', // Crimson with opacity 1a

];


const ColorSelector = ({ onSelectColor, page, close }) => {
    const [colorsWithBackground, setColorsWithBackground] = useState([]);

    // Function to generate random backgrounds for the colors
    const generateRandomBackgrounds = () => {
        const updatedColors = colors.map((color) => {
          const width = 32 + Math.random() * 41;
          const bg = color;
          const linbg = `linear-gradient(45deg, ${color} ${width}%, var(--background) ${100 - width}%)`;
          return {
            color: color,
            background: bg,
            linearbg: linbg
          };
        });
        setColorsWithBackground(updatedColors);
      };
      

    // Initial generation of random backgrounds when the component mounts
    useState(() => {
        generateRandomBackgrounds();
    }, []);

    return (
        <ModalContainer events={close} noblur>
            <ModalForm>
                <ModalTitle>Select page item color</ModalTitle>

                <div style={{ maxHeight: '50vh', overflowY: 'scroll', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    {colorsWithBackground.map((colorObj, index) => {
                        return (
                            <>
                                <div
                                    key={index + 'norm'}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: colorObj.background,
                                        margin: '10px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => onSelectColor(colorObj.background, page)}
                                />
                                <div
                                    key={index + 'lin'}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        background: colorObj.linearbg,
                                        margin: '10px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => onSelectColor(colorObj.linearbg, page)}
                                />
                            </>
                        );
                    })}
                </div>
                <button className='cdx-button' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}} type='button' onClick={generateRandomBackgrounds}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><g><path d="M6,13c0-1.65,0.67-3.15,1.76-4.24L6.34,7.34C4.9,8.79,4,10.79,4,13c0,4.08,3.05,7.44,7,7.93v-2.02 C8.17,18.43,6,15.97,6,13z M20,13c0-4.42-3.58-8-8-8c-0.06,0-0.12,0.01-0.18,0.01l1.09-1.09L11.5,2.5L8,6l3.5,3.5l1.41-1.41 l-1.08-1.08C11.89,7.01,11.95,7,12,7c3.31,0,6,2.69,6,6c0,2.97-2.17,5.43-5,5.91v2.02C16.95,20.44,20,17.08,20,13z" /></g></g></svg>Refresh gradients</button>

            </ModalForm>
        </ModalContainer>
    );
};

export default ColorSelector;
