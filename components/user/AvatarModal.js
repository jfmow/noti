import { Modal, ModalButton, ModalInput } from "@/lib/Modals/Modal";
import compressImage from "@/lib/CompressImg";
import { useState } from "react";
export default function AvatarModal({ close, pb }) {
    const [refreshAvatar, setrefreshAvatar] = useState(false)
    async function setNewAvatar(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const formData = new FormData();
            const compressedBlob = await compressImage(selectedFile); // Maximum file size in KB (100KB in this example)
            const compressedFile = new File([compressedBlob], selectedFile.name, { type: 'image/jpeg' });
            formData.append('avatar', compressedFile);

            try {
                const response = await pb.collection('users').update(pb.authStore.model.id, formData)
                await pb.collection('users').authRefresh();
                setrefreshAvatar(true)
                setTimeout(() => {
                    setrefreshAvatar(false)
                }, 100);
            } catch (error) {
                //console.log(error);
            }
        }
    }

    async function rmAvatar(e) {

        e.preventDefault();

        try {
            const response = await pb.collection('users').update(pb.authStore.model.id, { avatar: null })
            await pb.collection('users').authRefresh();
            setrefreshAvatar(true)
            setTimeout(() => {
                setrefreshAvatar(false)
            }, 100);

        } catch (error) {
            //console.log(error);
        }
    }
    return (
        <Modal close={close} >
            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                {pb.authStore.model.avatar ? (
                    <>
                        {!refreshAvatar && (
                            <img style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '50%' }} src={`${process.env.NEXT_PUBLIC_POCKETURL}/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`} />
                        )}
                    </>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" style={{ width: '64px', height: '64px' }}><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><path d="M10.25,13c0,0.69-0.56,1.25-1.25,1.25S7.75,13.69,7.75,13S8.31,11.75,9,11.75S10.25,12.31,10.25,13z M15,11.75 c-0.69,0-1.25,0.56-1.25,1.25s0.56,1.25,1.25,1.25s1.25-0.56,1.25-1.25S15.69,11.75,15,11.75z M22,12c0,5.52-4.48,10-10,10 S2,17.52,2,12S6.48,2,12,2S22,6.48,22,12z M20,12c0-0.78-0.12-1.53-0.33-2.24C18.97,9.91,18.25,10,17.5,10 c-3.13,0-5.92-1.44-7.76-3.69C8.69,8.87,6.6,10.88,4,11.86C4.01,11.9,4,11.95,4,12c0,4.41,3.59,8,8,8S20,16.41,20,12z" /></g></svg>)}
            </div>
            <ModalInput onChange={(e) => setNewAvatar(e)} type='file' accept="image/*">Select New</ModalInput>
            <ModalButton onClick={(e) => rmAvatar(e)}>Clear current</ModalButton>
        </Modal>
    )
}