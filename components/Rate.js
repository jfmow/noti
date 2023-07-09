import { AlternateButton, ModalContainer, ModalForm, ModalInput, ModalTitle } from "@/lib/Modal";
import { useState } from "react";
import styles from '@/styles/Single/Rate.module.css'
import { motion, AnimatePresence } from "framer-motion";

import PocketBase from 'pocketbase';
import { toast } from "react-toastify";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)

export default function Rateus() {
    const [open, SetOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, SetComment] = useState('')
    const stars = [{ "rating": 1, "index": 1 }, { "rating": 2, "index": 2 }, { "rating": 3, "index": 3 }, { "rating": 4, "index": 4 }, { "rating": 5, "index": 5 }]

    async function SubmitReview() {
        SetOpen(false)
        const toastload = toast.loading("Sending...")
        const data = {
            "comments": comment,
            "rating": rating,
            "user": pb.authStore.model.id
        };
        try {
            await pb.collection('reviews').create(data);
            toast.update(toastload, { render: "Thank you for the review", type: "success", isLoading: false })
            return setTimeout(() => {
                toast.done(toastload)
            }, 1500);
        } catch (err) {
            return toast.update(toastload, { render: `${err.data.message} (You can only submit 1 review per account)`, type: "error", isLoading: false })
        }
    }


    return (
        <>
            <div className={styles.buttons}>
                <div className={styles.openbtn} onClick={() => SetOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" /><path d="M10.06 5H5.82l.66-3.18c.08-.37-.04-.75-.3-1.02C5.74.36 5.03.36 4.6.8l-4 4c-.39.37-.6.88-.6 1.41V12c0 1.1.9 2 2 2h5.92c.8 0 1.52-.48 1.84-1.21l2.14-5C12.46 6.47 11.49 5 10.06 5zM22 10h-5.92c-.8 0-1.52.48-1.84 1.21l-2.14 5c-.56 1.32.4 2.79 1.84 2.79h4.24l-.66 3.18c-.08.37.04.75.3 1.02.44.44 1.15.44 1.58 0l4-4c.38-.38.59-.88.59-1.41V12c.01-1.1-.89-2-1.99-2z" /></svg>
                </div>
                <ReportBug />

            </div>
            {open && (
                <ModalContainer events={() => SetOpen(false)}>
                    <ModalForm>
                        <ModalTitle>Rate us</ModalTitle>
                        <AnimatePresence wait>
                            <div className={styles.stars}>
                                {stars.map((star) => {
                                    return (
                                        <motion.div
                                            className={styles.star}
                                            key={star.index}
                                            onClick={() => setRating(star.rating)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {rating >= star.rating ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><path d="M0 0h24v24H0V0z" fill="none" /><path d="M0 0h24v24H0V0z" fill="none" /></g><g><path d="m12 17.27 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z" /></g></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19.65 9.04l-4.84-.42-1.89-4.45c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5 4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.73 3.67-3.18c.67-.58.32-1.68-.56-1.75zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" /></svg>

                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <ModalInput chngevent={SetComment} place={'Further comments...'} />
                            <AlternateButton click={SubmitReview}>Send</AlternateButton>

                        </AnimatePresence>
                    </ModalForm>
                </ModalContainer>
            )}
        </>
    )
}


function ReportBug() {
    const [bugmenu, SetBugMenu] = useState(false)
    const [bug, SetBug] = useState('')
    async function CreateReport() {
        if (!bug) {
            return
        }
        SetBugMenu(false)
        const data = {
            "bug": bug,
            "user": pb.authStore.model.id
        };
        const toastload = toast.loading("Sending...")
        try {
            await pb.collection('bug_reports').create(data);
            toast.update(toastload, { render: "Thank you for the report", type: "success", isLoading: false })
            return setTimeout(() => {
                toast.done(toastload)
            }, 1500);
        } catch (err) {
            return toast.update(toastload, { render: `${err.data.message}`, type: "error", isLoading: false })
        }
    }

    return (
        <>
            <div onClick={() => SetBugMenu(true)} title="Report bug" className={styles.bug}>
                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24" /><rect fill="none" height="24" width="24" /></g><g><g><path d="M21,14L21,14c0-0.55-0.45-1-1-1h-2.07c-0.05-0.39-0.12-0.77-0.22-1.14l1.72-0.99c0.48-0.28,0.64-0.89,0.37-1.37l0,0 c-0.28-0.48-0.89-0.64-1.37-0.37L16.92,10c-0.28-0.48-0.62-0.91-0.99-1.29C15.97,8.48,16,8.25,16,8c0-0.8-0.24-1.55-0.65-2.18 l0.94-0.94c0.39-0.39,0.39-1.02,0-1.41l0,0c-0.39-0.39-1.02-0.39-1.41,0l-1.02,1.02c-1.68-0.89-3.1-0.33-3.73,0L9.12,3.46 c-0.39-0.39-1.02-0.39-1.41,0l0,0c-0.39,0.39-0.39,1.02,0,1.41l0.94,0.94C8.24,6.45,8,7.2,8,8c0,0.25,0.03,0.48,0.07,0.72 C7.7,9.1,7.36,9.53,7.08,10L5.57,9.13C5.09,8.86,4.48,9.02,4.21,9.5l0,0c-0.28,0.48-0.11,1.09,0.37,1.37l1.72,0.99 c-0.1,0.37-0.17,0.75-0.22,1.14H4c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h2.07c0.05,0.39,0.12,0.77,0.22,1.14l-1.72,0.99 c-0.48,0.28-0.64,0.89-0.37,1.37l0,0c0.28,0.48,0.89,0.64,1.37,0.37L7.08,18c1.08,1.81,2.88,3,4.92,3s3.84-1.19,4.92-3l1.51,0.87 c0.48,0.28,1.09,0.11,1.37-0.37l0,0c0.28-0.48,0.11-1.09-0.37-1.37l-1.72-0.99c0.1-0.37,0.17-0.75,0.22-1.14H20 C20.55,15,21,14.55,21,14z M12,17L12,17c-0.55,0-1-0.45-1-1v-4c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v4C13,16.55,12.55,17,12,17z" /></g></g></svg>
            </div>
            {bugmenu && (
                <>
                    <ModalContainer events={() => SetBugMenu(false)}>
                        <ModalForm>
                            <ModalTitle>Report bug</ModalTitle>
                            <ModalInput chngevent={SetBug} place={'Enter report here...'} />
                            <AlternateButton click={CreateReport}>Send</AlternateButton>
                        </ModalForm>
                    </ModalContainer>
                </>
            )}
        </>
    )
}