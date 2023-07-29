import styles from "@/styles/Create.module.css";

export default class SimpleIframeWebpage {
    static get toolbox() {
      return {
        title: "Embed webage",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect style="stroke: none;" fill="none" height="24" width="24"/><rect style="stroke: none;" fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g/><path style="stroke: none;" d="M20,4H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M4,9h10.5v3.5H4V9z M4,14.5 h10.5V18L4,18V14.5z M20,18l-3.5,0V9H20V18z"/></g></svg>',
      };
    }
  
    constructor({ data, config }) {
      this.data = data;
      this.wrapper = undefined;
      this.config = config || {};
    }
  
    render() {
      this.wrapper = document.createElement("div");
      const inputContainer = document.createElement('div')
  
      inputContainer.style.display = 'grid';
      inputContainer.style.gridTemplateColumns = '4fr 1fr';
      inputContainer.style.gap = '10px';
      inputContainer.style.padding = '10px 0px 10px 0'
  
      if (this.data && this.data.src) {
        //const originalUrl = decodeURIComponent(this.data.url).replace(
        //  /&amp;/g,
        //  "&"
        //);
        this._createIframe(this.data.src);
        return this.wrapper;
      }
  
  
      const fileInput = document.createElement("span");
      fileInput.contentEditable = true;
      fileInput.classList.add('cdx-input')
      fileInput.style.width = '100%';
  
      const uploadBtn = document.createElement("button");
      uploadBtn.textContent = "Save link";
      uploadBtn.classList.add("cdx-button");
      uploadBtn.style.width = '100%'; // Add a class for styling the button
  
      try {
        fileInput.click(); //open immediately
      } catch (err) {
        console.warn(err)
      }
      uploadBtn.addEventListener("click", () => this._createIframe(fileInput.innerText));
  
      this.wrapper.appendChild(inputContainer);
      inputContainer.appendChild(fileInput);
      inputContainer.appendChild(uploadBtn)
  
      return this.wrapper;
    }
  
    async _createIframe(src) {
      const iframe = document.createElement("iframe");
      iframe.classList.add(styles.embedIframe);
      iframe.style.width = "100%";
      iframe.style.height = "85vh";
      iframe.style.border = "2px solid #fff";
      iframe.style.borderRadius = "10px";
      iframe.src = src;
      iframe.sandbox = 'allow-scripts allow-same-origin';
  
      this.wrapper.innerHTML = "";
      this.wrapper.appendChild(iframe);
      const popOutBTN = document.createElement("button");
      popOutBTN.classList.add(styles.popOutbtn)
      popOutBTN.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z"/></svg>`
      popOutBTN.addEventListener("click", () => {
        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=600,left=10,top=10`;
        open(`${src}`, `SaveMyNotes popup`, params);
      })
      this.wrapper.appendChild(popOutBTN)
    }

    static get isReadOnlySupported() {
      return true;
  }
  
    static get pasteConfig() {
      return {
        // ... tags
        // ... files
        patterns: {
          image: /^https:\/\/\S+/i
        }
      };
    }
  
  
    onPaste(event) {
      switch (event.type) {
        // ... case 'tag'
        // ... case 'file'
        case 'pattern':
          const src = event.detail.data;
          this._createIframe(src);
          break;
      }
    }
  
    save(blockContent) {
      try {
        const iframe = blockContent.querySelector("iframe");
        const src = iframe.getAttribute('src'); // Retrieve the urlFull attribute
  
        return {
          src: src // Include the urlFull in the saved data
        };
      } catch (err) {
        console.warn(err)
      }
    }
  }