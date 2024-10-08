import React from 'react';

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
    return (
        <>
            <div style={{ height: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                {colors.map((color, index) => {
                    return (
                        <>
                            <div
                                key={index + 'norm'}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    background: color,
                                    margin: '10px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => onSelectColor(color, page)}
                            />
                        </>
                    );
                })}
            </div>
        </>
    );
};

export default ColorSelector;
