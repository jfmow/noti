import Loader from "@/components/Loader";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Demo() {
    const router = useRouter()
    useEffect(() => {
        router.replace("/page?edit=previewwelcome0&demo=1&side=false")
    }, [])
    return (
        <Loader />
    )
}