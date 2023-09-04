import { useState, useEffect } from "react";
import PocketBase from 'pocketbase';
import Loader from "@/components/Loader";
import Router from "next/router";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
export default function Draw() {
    useEffect(() => {
        async function createNewDrawPad() {
            try {
                const data = {
                    "owner": pb.authStore.model.id
                };

                const record = await pb.collection('drawing_pads').create(data);
                Router.push(`/draw/${record.id}`)
            } catch {
                Router.push('/auth/login')
            }
        }
        createNewDrawPad()
    }, [])
    return (<Loader />)
}

