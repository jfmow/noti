import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    MotionValue
} from "framer-motion";
import styles from '@/styles/Paralax.module.css'

function useParallax(value, distance) {
    return useTransform(value, [0, 1], [-distance, distance]);
}

function Image({ id, desc }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref });
    const y = useParallax(scrollYProgress, 320);

    return (
        <section className={styles.section}>
            <div ref={ref}>
                <img className={styles.img} src={`/${id}.png`} alt="A cool feature image" />
            </div>
            <motion.h2 style={{ y }}>{`${desc}`}</motion.h2>
        </section>
    );
}

export default function App() {

    return (
        <>
            <Image id={'feature2'} desc={'Easy to use ui with 3rd party tools for more support'} />
        </>
    );
}
