import React, { useEffect, useState, useRef } from "react";
import { PopUpCardsGlobalButton } from "@/lib/Pop-Cards/Popup";
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
        <div className="w-full h-[300px] overflow-hidden relative flex flex-col items-center justify-center">
            <div className="w-[300px]">
                <canvas className="w-full shadow-lg rounded" id="gradient-canvas" ref={canvasRef} />
            </div>
            <div className="flex gap-2 items-center justify-center my-4">
                {colors.map((color, index) => (
                    <div className="flex justify-center items-center shadow bg-zinc-50 w-[40px] h-[30px] rounded border border-2 border-zinc-100 mx-1" key={index}>
                        <div className="relative overflow-hidden w-[40px] h-[40px] rounded">
                            <input className="absolute right-[-8px] top-[-8px] w-[56px] h-[56px] border-none" type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 items-center justify-center">
                <PopUpCardsGlobalButton click={() => {
                    gradient.changeGradientColors(colors);
                    gradient.changePosition(Math.floor(Math.random() * 1000));
                }}>Randomize</PopUpCardsGlobalButton>
                <PopUpCardsGlobalButton click={() => getCanvas()}>Set</PopUpCardsGlobalButton>
            </div>
        </div>
    );
}
