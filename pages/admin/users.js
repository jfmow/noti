import Head from "next/head";
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase'
import { Database, GlassWater, Home, LogOut, MoreHorizontal, Trash, UploadCloud } from "lucide-react";
import { DropDown, DropDownContainer, DropDownItem, DropDownSection, DropDownSectionTitle, DropDownTrigger } from "@/lib/Pop-Cards/DropDown";
import { Modal, ModalContent, ModalTrigger } from "@/lib/Modals/Modal";
import { Input, Link, SubmitButton } from "@/components/UX-Components";
import Loader from "@/components/Loader";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
pb.autoCancellation(false)


export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setIsLoading] = useState(true)

    useEffect(() => {
        const r = document.documentElement.style;
        r.setProperty("--popupBackground", "#ffffff")
        r.setProperty("--popupButtonBg", "#eaeaea")
        r.setProperty("--modalTextColor", "#000")
        async function authUpdate() {
            try {
                const authData = await pb.collection('admins').authRefresh();
                if (!pb.authStore.isValid) {
                    pb.authStore.clear();
                    return window.location.replace("/admin/login");
                }
            } catch (error) {
                pb.authStore.clear();
                return window.location.replace('/admin/login');
            }
        }
        authUpdate()

        async function GetUsers() {
            var page = 1
            const urlParams = new URLSearchParams(window.location.search)
            page = urlParams.has("page") && urlParams.get("page") >= 1 ? urlParams.get("page") : 1
            const resultList = await pb.collection('users_admins').getList(page, 50, { sort: "-created" });
            setUsers(prevItems => {
                const idSet = new Set(prevItems.map(item => item.id)); // Create a set of existing IDs
                const uniqueItems = resultList.items.filter(item => !idSet.has(item.id)); // Filter out items with duplicate IDs
                return [...prevItems, ...uniqueItems]; // Add unique items to the previous items array
            });
            setIsLoading(false)
        }
        GetUsers()

    }, [])

    async function GetAUsersFlags(user) {
        const record = await pb.collection('user_flags').getFirstListItem(`user="${user}" && collection="_pb_users_auth_"`);
        setUsers(prevItems => {
            const items = prevItems.map((item) => {
                if (item.id === user) {
                    return { ...item, quota: record.quota, uploadSize: record.maxUploadSize }
                } else {
                    return item
                }
            })
            return items
        })
        return record.quota
    }

    async function UpdateFlags(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        try {
            if (formData.has("quota")) {
                formData.set("quota", formData.get("quota") / 0.00000095367432)
            }
            if (formData.has("maxUploadSize")) {
                formData.set("maxUploadSize", formData.get("maxUploadSize") / 0.00000095367432)
            }
            const record = await pb.send("/api/collections/users/flags/update", { method: "POST", body: formData })
            setUsers(prevItems => {
                const items = prevItems.map((item) => {
                    if (item.id === formData.get("user")) {
                        return { ...item, quota: record.quota, uploadSize: record.maxUploadSize }
                    } else {
                        return item
                    }
                })
                return items
            })
        } catch {

        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <Head>
                <title>Users</title>
            </Head>
            <div className="w-full h-screen bg-zinc-50 text-zinc-800 relative flex items-center justify-center">
                <div className="grid grid-cols-1 max-w-full w-fit bg-zinc-50 shadow rounded p-4 overflow-y-scroll">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center rounded-lg p-4 text-md">
                        <div className="font-semibold sm:visible hidden">
                            ID
                        </div>
                        <div className="">
                            Email
                        </div>
                        <div className="sm:visible hidden">
                            Created
                        </div>
                        <div className="sm:visible hidden">
                            Updated
                        </div>
                        <div className="w-full text-right">
                            Options
                        </div>


                    </div>
                    <div className="">
                        {users.map((user) => (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-center bg-zinc-100 shadow-sm rounded-lg p-4 text-md mt-2">
                                    <div className="font-semibold sm:visible hidden">
                                        {user.id}
                                    </div>
                                    <div>
                                        {user.email}
                                    </div>
                                    <div className="sm:visible hidden">
                                        {new Date(user.created).toLocaleDateString([], { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
                                    </div>
                                    <div className="sm:visible hidden">
                                        {new Date(user.updated).toLocaleDateString([], { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })}
                                    </div>
                                    <div className="flex items-center justify-end w-full">
                                        <DropDownContainer>
                                            <DropDownTrigger>
                                                <div className="w-full flex align-center justify-end cursor-pointer" onClick={() => GetAUsersFlags(user.id)}>
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </div>
                                            </DropDownTrigger>
                                            <DropDown>
                                                <DropDownSectionTitle>
                                                    Options
                                                </DropDownSectionTitle>
                                                <DropDownSection>
                                                    <Modal>
                                                        <ModalTrigger>
                                                            <DropDownItem>
                                                                <GlassWater /> Change storage quota
                                                            </DropDownItem>
                                                        </ModalTrigger>
                                                        <ModalContent>
                                                            <form onSubmit={UpdateFlags}>
                                                                <div className="w-full text-md my-1">
                                                                    Current quota: <span className="font-semibold text-rose-600 px-2">{Math.floor(user.quota * 0.00000095367432)}</span> MB
                                                                </div>
                                                                <div className="w-full text-md my-1 mb-3">
                                                                    <span className="inline-flex items-center justify-between w-full font-semibold">New quota: <span className="text-sm font-normal text-gray-400">MB only</span></span>
                                                                    <div className="flex w-full items-center justify-between">
                                                                        <Input type="number" name="quota" placeholder={Math.floor(user.quota * 0.00000095367432) + " MB"} />
                                                                    </div>
                                                                    <input hidden value={user.id} name="user" />
                                                                </div>
                                                                <SubmitButton type="submit">Save</SubmitButton>
                                                            </form>
                                                        </ModalContent>
                                                    </Modal>
                                                    <DropDownItem>

                                                        <Modal>
                                                            <ModalTrigger>
                                                                <DropDownItem>
                                                                    <UploadCloud /> Change max upload size
                                                                </DropDownItem>
                                                            </ModalTrigger>
                                                            <ModalContent>
                                                                <form onSubmit={UpdateFlags}>
                                                                    <div className="w-full text-md my-1">
                                                                        Current upload limit: <span className="font-semibold text-rose-600 px-2">{Math.floor(user.uploadSize * 0.00000095367432)}</span> MB
                                                                    </div>
                                                                    <div className="w-full text-md my-1 mb-3">
                                                                        <span className="inline-flex items-center justify-between w-full font-semibold">New quota: <span className="text-sm font-normal text-gray-400">MB only</span></span>
                                                                        <div className="flex w-full items-center justify-between">
                                                                            <Input type="number" name="maxUploadSize" placeholder={Math.floor(user.uploadSize * 0.00000095367432) + " MB"} />
                                                                        </div>
                                                                        <input hidden value={user.id} name="user" />
                                                                    </div>
                                                                    <SubmitButton type="submit">Save</SubmitButton>
                                                                </form>
                                                            </ModalContent>
                                                        </Modal>
                                                    </DropDownItem>
                                                </DropDownSection>
                                            </DropDown>
                                        </DropDownContainer>

                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>

                <div className="absolute z-[3] bottom-4 left-0 right-0 flex items-center justify-center">
                    <div className="p-2 flex items-center justify-center rounded-2xl shadow-xl border gap-1">
                        <Link className="hover:bg-zinc-300 p-2 rounded" href="/auth/login">
                            <LogOut className="w-4 h-4" />
                        </Link>
                        <Link className="hover:bg-zinc-300 p-2 rounded" href="/admin">
                            <Home className="w-4 h-4" />
                        </Link>
                        <Link className="hover:bg-zinc-300 p-2 rounded" href={process.env.NEXT_PUBLIC_POCKETURL + "/_"}>
                            <Database className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}