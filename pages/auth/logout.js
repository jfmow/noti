import Loader from "@/components/Loader";
import pb from "@/lib/pocketbase";
import { useEffect } from "react";

export default function ForceLogout() {
    useEffect(() => {
        pb.authStore.clear()
        window.location.replace("/")
    }, [])
    return (
        <Loader />
    )
}