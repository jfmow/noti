export const toaster = {
    async dismiss(toast) {
        const event2 = new Event('CustomEvent')
        event2.key = "toastDis"
        event2.value = toast
        window.dispatchEvent(event2)
    },
    async toast(text, type, options) {
        let open = true;
        let nodelay = false;

        const toastElement = document.createElement("div");
        window.addEventListener('CustomEvent', (e) => {
            //console.log(e)
            if (e.value === options?.id && e.key === "toastDis") {
                if (open) {
                    open = false;
                    toastElement.style.animationName = "exit";
                    toastElement.addEventListener("animationend", () => {
                        try {
                            document.body.removeChild(toastElement);
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
        toastElement.style.animationName = "exit"
        toastElement.style.animationDirection = "reverse"
        toastElement.addEventListener("click", () => {
            open = false
            toastElement.style.animationName = "exit"
            toastElement.addEventListener("animationend", () => {
                document.body.removeChild(toastElement);
            });

        })
        if (open) {
            document.body.appendChild(toastElement);
            toastElement.addEventListener("animationend", () => {
                toastElement.style.animationName = ""
                toastElement.style.animationDirection = ""
            });
            toastElement.removeEventListener("animationend", () => {
                toastElement.style.animationName = ""
            })


            // Automatically remove the toast after 3 seconds
            if (!nodelay) {
                setTimeout(() => {
                    if (open) {
                        toastElement.style.animationName = "exit"
                        toastElement.addEventListener("animationend", () => {
                            document.body.removeChild(toastElement);
                        });
                    }
                }, options?.delay || 3000);
            }

        }
    }

};
