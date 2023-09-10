import Loader from "@/components/Loader";
import Router from "next/router";
import { useEffect } from "react";

function NotionEditor() {
    useEffect(() => {
        Router.push('/preview/notepreviewpage')
    }, [])
    return (<>
        <Loader />
    </>)
}

export default NotionEditor;


