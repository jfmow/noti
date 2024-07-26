import { useEffect, useState } from "react"
import { Button } from "@/components/Settings";
import { Camera, QrCode, SquareAsterisk } from "lucide-react";
import pb from "@/lib/pocketbase";
import { toaster } from "@/components/toast";
import QRCodeComponent from "@/components/QRCode";
import { Modal, ModalContent } from "@/lib/Modals/Modal";
import { Input } from "@/components/UX-Components";
export default function TwoFactorAuth() {
    const [enabled, setOTPState] = useState(false)
    const [twoFaUrl, set2faUrl] = useState("")

    useEffect(() => {
        //Runs every time cause it don't have ,[] deps

        async function get2FAState() {
            const req = await pb.send("/api/collections/users/2fa/state")
            if (req.code !== 200) {
                toaster.error("An error occured getting the 2FA state.")
            } else {
                setOTPState(req.state)
            }

        }

        get2FAState()

    })

    function toggle2FAState() {
        pb.send("/api/collections/users/2fa/toggle", { method: "POST" }).then((successRes) => {
            setOTPState(successRes.state)
            if (successRes.state) {
                set2faUrl(successRes.url)
            } else {
                set2faUrl("")
            }
        }, (errorRes) => {
            toaster.error(errorRes.message || "An error has occured")
        })
    }

    async function handleCopyTextToClipboard(data, e) {
        var dummyInput = document.createElement("div");
        dummyInput.innerText = `${data}`;

        // Append it to the body
        document.body.appendChild(dummyInput);

        // Select and copy the value of the dummy input
        var range = document.createRange();
        range.selectNode(dummyInput);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        // Remove the dummy input from the DOM
        document.body.removeChild(dummyInput);
    }

    function verify2FACode(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const code = formData.get("code")
        if (code.length !== 6) {
            toaster.error("Code must be 6 numbers long")
            return
        }
        pb.send("/api/collections/users/2fa/setup-verify", { method: "POST", body: formData }).then((successRes) => {
            toaster.success("Code verified.")
        }, (errorRes) => {
            toaster.error(errorRes.message || "An error has occured")
        })
    }

    return (
        <div className="grid p-1 gap-4">
            <div className="">
                <h3 className="text-sm w-full mb-1">2FA</h3>
            </div>
            <div className="flex justify-between items-center">
                <div className="grid">
                    <span className="font-medium text-sm text-zinc-600 flex items-center"><SquareAsterisk className="w-4 h-4 mr-1" />Authenticator app</span>

                </div>

                <Button onClick={() => toggle2FAState()}>
                    {enabled ? ("Disable") : ("Enable")}
                </Button>


            </div>
            {twoFaUrl ? (
                <Modal visibleDef={true}>
                    <ModalContent>
                        <div className="grid mb-2">
                            <span className="font-medium text-sm text-zinc-600 flex items-center"><QrCode className="w-4 h-4 mr-1" />Scan to add to authenticator app</span>
                            <p className="text-sm text-gray-500">This can only be viewed now and will not show up again!</p>
                            <p className="text-sm text-gray-500">2FA codes are not required for OAuth sign-ins</p>
                        </div>
                        <div className="flex justify-center items-center py-2">
                            <QRCodeComponent text={twoFaUrl} />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="grid mb-2">
                                <span className="font-medium text-sm text-zinc-600 flex items-center">Or manualy copy setup link</span>
                            </div>
                            <div className="flex flex-nowrap gap-2 items-center justify-center">
                                <Button onClick={(e) => handleCopyTextToClipboard(twoFaUrl, e)}>Copy</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1">
                            <div className="grid mb-2">
                                <span className="font-medium text-sm text-red-600 flex items-center">Verify code</span>
                            </div>
                            <div>
                                <form onSubmit={(e) => verify2FACode(e)} className="flex flex-nowrap gap-2 items-center justify-center">
                                    <Input name="code" placeholder={"Enter authenticator app code: e.g 123456"} />
                                    <Button type="submit">Verify</Button>
                                </form>
                            </div>
                        </div>
                    </ModalContent>
                </Modal>
            ) : null}


        </div>
    )
}