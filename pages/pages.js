import MyComponent from "@/components/Item";
import Loader from "@/components/Loader";
import PocketBase from 'pocketbase'
import { useEffect, useState } from "react";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
export default function TestPg({page}){
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        async function authUpdate() {
          try {
            const authData = await pb.collection('users').authRefresh();
            if (pb.authStore.isValid == false) {
              pb.authStore.clear();
              return window.location.replace("/auth/login");
            }
            if (authData.record.disabled) {
              pb.authStore.clear()
              return window.location.replace('/u/disabled')
            }
            setIsLoading(false)
            
          } catch (error) {
            pb.authStore.clear();
            //console.log(error)
            return window.location.replace('/auth/login');
          }

        }
        authUpdate()
      }, []);
      if(isLoading){
        return <Loader/>
      }
    return(
        <MyComponent currPage={page}/>
    )
}
  