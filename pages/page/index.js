import { useEffect } from "react";
import Router from "next/router";
import PocketBase from 'pocketbase'
import Loader from "@/components/Loader";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
export default function redirect() {

    useEffect(() => {
        async function GetLatestPage() {
            try {
                const urlParams = new URLSearchParams(window.location.search)
                try {
                    const latestPage = await pb.collection("pages").getFirstListItem("", { sort: "-updated" })
                    Router.push(`/page/${latestPage.id}${urlParams.size >= 1 ? `?${urlParams.toString()}` : ""}`)
                } catch (err) {
                    if (err.data.code === 404) {
                        const req = await pb.send("/api/collections/users/account/create-empty-page")
                        Router.push(`/page/${req.id}`)
                    }
                }
            } catch {
                Router.push("/auth/login")
            }


        }
        GetLatestPage()
    }, [])

    return (
        <Loader />
    )
}