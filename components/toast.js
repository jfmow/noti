export function ToastContainer({ ...props }) {
    return (
        <div className="suddsy_toaster" {...props}>
            {props.children}
        </div>
    )
}

async function toast(type, text) {
    const id = self.crypto.randomUUID()
    const container = document.body.querySelector(".suddsy_toaster")

    let autoRmToastTimeOut

    const toastElement = document.createElement('div')
    toastElement.classList.add('suddsy_toast')
    toastElement.classList.add(type)
    toastElement.innerHTML = Svgs(type)

    const textElement = document.createElement('span')
    textElement.innerText = text

    toastElement.appendChild(textElement)
    container.appendChild(toastElement)

    function animateInToast() {
        const toastSlideIn = [
            { transform: "translateX(100%)" },
            { transform: "translateX(0)" },
        ];
        const toastSlideInTiming = {
            duration: 500,
            iterations: 1,
            fill: 'both',
            easing: "ease-in-out"
        };


        toastElement.animate(toastSlideIn, toastSlideInTiming);
    }

    function removeToast() {
        //Animates the toast out the viewport and then removes it from the dom

        //Stops the autoremove timeout from running acidentialy
        clearTimeout(autoRmToastTimeOut)
        const toastSlide = [
            { transform: "translateX(0)" },
            { transform: "translateX(200%)" },
        ];
        const toastShrink = [
            { height: 0, marginTop: toastElement.getBoundingClientRect().height + 'px', padding: 0 },
            { height: 0, marginTop: -10 + 'px', padding: 0 },
        ];

        const toastSlideTiming = {
            duration: 700,
            iterations: 1,
            fill: 'both',
            easing: "ease-in-out"
        };
        const toastShrinkTiming = {
            duration: 1000,
            iterations: 1,
            fill: 'both',
            easing: "ease-in-out"
        };


        toastElement.animate(toastSlide, toastSlideTiming);
        //Waits for animation
        setTimeout(() => {
            toastElement.animate(toastShrink, toastShrinkTiming);
            //Waits for animation
            setTimeout(() => {
                toastElement.remove()
            }, 2000)
        }, toastSlideTiming.duration + 10)
    }

    function handleEvents(e) {
        //Function to handle events
        if (e.detail?.toast_id === id) {
            switch (e.detail.type) {
                case 'dismiss':
                    removeToast()
                    break;
                case 'update':
                    textElement.innerText = e.detail.data.text
                    e.detail.data?.type && toastElement.classList.remove(type);
                    e.detail.data?.type && toastElement.classList.add(e.detail.data?.type);
                    toastElement.innerHTML = Svgs(e.detail.data?.type || type)
                    toastElement.appendChild(textElement)
                    if (e.detail.data?.type && e.detail.data?.type !== "loading") {
                        autoRmToastTimeOut = setTimeout(() => {
                            removeToast()
                        }, 5000)
                    } else if (e.detail.data?.type && e.detail.data?.type === "loading") {
                        clearTimeout(autoRmToastTimeOut)
                    }
                default:
                    break;
            }
        }
    }
    // Dispatch the custom event
    animateInToast()

    container.addEventListener(`toastEvent`, handleEvents)
    if (type !== 'loading') {
        toastElement.addEventListener('click', removeToast)
        autoRmToastTimeOut = setTimeout(() => {
            removeToast()
        }, 5000)
    }


    return id

}

export const toaster = {
    async info(text) {
        return toast("info", text)
    },
    async error(text) {
        return toast("error", text)
    },
    async success(text) {
        return toast("success", text)
    },
    async loading(text) {
        return toast("loading", text)
    },
    async dismiss(toast) {
        const dismissToastEvent = new CustomEvent(`toastEvent`, {
            detail: {
                toast_id: toast,
                type: 'dismiss',
            }
        });
        document.body.querySelector(".suddsy_toaster").dispatchEvent(dismissToastEvent);
    },
    async update(toast, text, type = "") {
        const updateToastEvent = new CustomEvent(`toastEvent`, {
            detail: {
                toast_id: toast,
                type: 'update',
                data: { text: text, type: type }
            }
        });
        document.body.querySelector(".suddsy_toaster").dispatchEvent(updateToastEvent);
    }
}



function Svgs(type) {
    switch (type) {
        case 'info':
            return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        `
        case 'error':
            return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            `
        case 'success':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>`
        case 'loading':
            return `<img width='16' height='16' src='/loading.gif'/>`
        default:
            return ``
    }
}