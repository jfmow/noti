import { useEffect } from "react";
import { useRouter } from "next/router";
export default function redirect(){
    const router = useRouter()
    useEffect(()=>{
        router.push('/page/firstopen')
    },[])
}