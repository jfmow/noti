import styles from '@/styles/Single/PlainLoader.module.css'
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      className={styles.loadercontainer}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8 }} // Increased duration to 1.5 seconds
    >
      <svg className={styles.load1} viewBox="25 25 50 50">
        <circle className={styles.load2} r="20" cy="50" cx="50"></circle>
      </svg>
    </motion.div>
  )
}
