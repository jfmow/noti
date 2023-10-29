export function ToastContainer() {
    return (<div id="toast_container">

    </div>)
}

async function toast(text, type, options) {
    let open = true;
    let nodelay = false;

    const toastElement = document.createElement("div");
    const container = document.getElementById("toast_container")
    toastElement.style.zIndex = container.childElementCount + 1
    const toastId = self.crypto.randomUUID()
    toastElement.id = toastId
    window.addEventListener('CustomEvent', (e) => {
        //console.log(e)
        if (e.value === options?.id && e.key === "toastDis") {
            if (open) {
                open = false;
                toastElement.style.animationName = "exit"
                toastElement.classList.add("exit")
                toastElement.addEventListener("animationend", () => {
                    try {
                        container.removeChild(toastElement);
                    } catch { }
                });
            }
        }
    })
    toastElement.classList.add("toast");
    switch (type) {
        case 'info':
            toastElement.classList.add("info");
            toastElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            <p>${text}<p/>
            `
            break;

        case 'success':
            toastElement.classList.add("success");
            toastElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <p>${text}<p/>
            `
            break;
        case 'error':
            toastElement.classList.add("error");
            toastElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <p>${text}<p/>
            `
            break;

        case 'loading':
            toastElement.classList.add("loading")
            toastElement.innerHTML = `
            <div class="spinner center">
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
<div class="spinner-blade"></div>
</div>
<p>${text}<p/>
            `
            break;
        default:
            toastElement.innerHTML = `
            <p>${text}<p/>
            `
            break;
    }
    const toastHeight = toastElement.clientHeight;
    const index = Array.from(container.children).indexOf(toastElement);

    toastElement.style.animationName = "exit"
    toastElement.style.animationDirection = "reverse"

    function removeToast() {
        try {
            container.removeChild(toastElement);

            open = false;
            nodelay = true;

            //get the index of the toast in the toastcontainer

            //get the index of the next item in the toast container
            const nextElementIndex = index + 1;
            //select it
            const nextElement = container.children[nextElementIndex];
            //remove the toast
            //if the nextElement is not there (cause its the last item in the container) do the first thing in the if
            if (!nextElement) {
                document.documentElement.style.setProperty('--margin_toast', toastHeight + 20 + 'px')
                const newNextElement = container.children[index - 1]
                if (!newNextElement) {
                    return
                }
                newNextElement.style.animationName = "shrink-bottom"

            } else {
                document.documentElement.style.setProperty('--margin_toast', toastHeight + 40 + 'px')
                nextElement.style.animationName = "shrink"
            }
        } catch { }
    }

    toastElement.addEventListener("click", () => {
        //set the open to false to prevent the timeout
        open = false;
        toastElement.style.animationName = "exit"
        toastElement.classList.add("exit")
        toastElement.addEventListener("animationend", () => {
            removeToast()
        });

    })
    if (open) {
        container.appendChild(toastElement);
        toastElement.addEventListener("animationend", () => {
            toastElement.style.animationName = ""
            toastElement.style.animationDirection = ""
            toastElement.removeEventListener("animationend", () => {
                toastElement.style.animationName = ""
                toastElement.style.animationDirection = ""
            })
        });



        // Automatically remove the toast after 3 seconds
        if (!nodelay) {
            setTimeout(() => {
                if (open) {
                    toastElement.style.animationName = "exit"
                    toastElement.classList.add("exit")
                    toastElement.addEventListener("animationend", () => {
                        console.log('C')
                        removeToast()
                    });
                }
            }, options?.delay || 3000);
        }

    }
}

//Helpers
/**
 * @typedef {Object} ToastOptions
 * @property {number} [delay] - Time in seconds to set toast timeout.
 * @property {string} [id] - Toast ID used to dismiss the toast message.
 */

/**
 * @typedef {Object} Toaster
 * @property {(text: string, type: string, options?: ToastOptions) => void} toast - !Deprecated! Function to display a toast message. 
 * @property {(toast: any) => void} dismiss - Function to dismiss a toast message.
 * @property {(text: string, options?: ToastOptions) => void} success - Function to display a success toast message.
 * @property {(text: string, options?: ToastOptions) => void} error - Function to display an error toast message.
 * @property {(text: string, options?: ToastOptions) => void} info - Function to display an info toast message.
 * @property {(text: string, options?: ToastOptions) => void} loading - Function to display a loading toast message.
 */

/**
 * @type {Toaster}
 */
export const toaster = {
    /**
     * Displays a toast message.
     * @param {string} text - The text to be displayed in the toast message.
     * @param {string} type - Type of the toast message (e.g., 'success', 'error', 'info', 'loading').
     * @param {ToastOptions} [options] - Additional options for the toast message.
     */
    async toast(text, type, options) {
        toast(text, type, options || {})
    },
    /**
     * Dismisses a toast message.
     * @param {any} toast - The toast message to be dismissed.
     */
    async dismiss(toast) {
        const event2 = new Event('CustomEvent')
        event2.key = "toastDis"
        event2.value = toast
        window.dispatchEvent(event2)
    },
    /**
     * Displays a success toast message.
     * @param {string} text - The text to be displayed in the toast message.
     * @param {ToastOptions} [options] - Additional options for the toast message.
     */
    async success(text, options) {
        toast(text, 'success', options || {})
    },
    /**
    * Displays an error toast message.
    * @param {string} text - The text to be displayed in the toast message.
    * @param {ToastOptions} [options] - Additional options for the toast message.
    */
    async error(text, options) {
        toast(text, 'error', options || {})
    },
    /**
     * Displays an info toast message.
     * @param {string} text - The text to be displayed in the toast message.
     * @param {ToastOptions} [options] - Additional options for the toast message.
     */
    async info(text, options) {
        toast(text, 'info', options || {})
    },
    /**
     * Displays a loading toast message.
     * @param {string} text - The text to be displayed in the toast message.
     * @param {ToastOptions} [options] - Additional options for the toast message.
     */
    async loading(text, options) {
        toast(text, 'loading', options || {})
    },
};
