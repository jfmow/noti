import { ModalContainer, ModalForm, ModalTitle } from "@/lib/Modal";
import Link from 'next/link'
export default function UserHelpModal({ CloseHelp }) {
    return (
        <>
            <ModalContainer events={CloseHelp}>
                <ModalForm>
                    <ModalTitle>Help</ModalTitle>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        <div>
                            <h4><Link href='/auth/terms-and-conditions'>Terms & Conditions</Link></h4>
                            <h4><Link href='/auth/privacy-policy'>Privacy policy</Link></h4>
                            <h4><Link href='/auth/disclamer'>Beta Disclamer</Link></h4>
                            <h4><Link href='https://dev.jamesmowat.com'>Dev Blog</Link></h4>
                        </div>
                        <div>
                            <h6>Version: beta</h6>
                            <h6>Creator: James M</h6>
                            <h6>Cost: free</h6>
                        </div>
                    </div>
                </ModalForm>
            </ModalContainer>
        </>
    )
}