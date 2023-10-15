import React, { useEffect, useState, useRef } from "react";
import styles from '@/styles/MeshGradient.module.css';
import { PopUpCardsGlobalButton } from "@/lib/Pop-Cards/PopUpCard";
import { gradient } from "@/components/editor/Menu/gradient";
import compressImage from "@/lib/CompressImg";

export default function Gradient({ setArticleHeader, page, pb }) {
    const canvasRef = useRef(null);
    const [colors, setColors] = useState([
        "#eb75b6",
        "#ddf3ff",
        "#6e3deb",
        "#c92f3c",
    ]);

    useEffect(() => {
        const randVal = Math.floor(Math.random() * 1000);
        gradient.initGradient("#gradient-canvas", colors);
        gradient.changePosition(randVal);
    }, []);

    const handleColorChange = (index, value) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);
    };

    async function getCanvas() {
        const canvasEl = document.getElementById("gradient-canvas");
        const width = 1920
        const height = 1080
        //@ts-ignore
        canvasEl.width = width;
        //@ts-ignore
        canvasEl.height = height;

        gradient.setCanvasSize(width, height, false);
        gradient.reGenerateCanvas();
        setTimeout(() => { }, 100);
        const canvas = canvasRef.current;
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve);
        });
        const compressedBlob = await compressImage(blob, 200); // Maximum file size in KB (200KB in this example)
        const file = new File([compressedBlob], 'generated-gradient.png', { type: blob.type });
        const reader = new FileReader();
        reader.onload = () => {
            setArticleHeader(reader.result);
        };
        reader.readAsDataURL(file);
        let formData = new FormData()
        formData.append("header_img", file)
        formData.append("unsplash", "")
        const record = await pb.collection('pages').update(page, formData);
    }

    return (
        <div className={styles.container}>
            <div className={styles.canvas}>
                <canvas id="gradient-canvas" ref={canvasRef} />
            </div>
            <div className={styles.coloroptions}>
                {colors.map((color, index) => (
                    <div className={styles.colorpickerwrapper} key={index}>
                        <div className={styles.colorpicker}>
                            <input type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.coloroptions}>
                <PopUpCardsGlobalButton click={() => {
                    gradient.changeGradientColors(colors);
                    gradient.changePosition(Math.floor(Math.random() * 1000));
                }}>Randomize</PopUpCardsGlobalButton>
                <PopUpCardsGlobalButton click={() => getCanvas()}>Set</PopUpCardsGlobalButton>
            </div>
        </div>
    );
}
