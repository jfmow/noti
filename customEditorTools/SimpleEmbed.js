import PocketBase from "pocketbase";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)
import styles from "@/styles/Create.module.css";

export default class SimpleIframe {
    static get toolbox() {
      return {
        title: "Embed",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path style="stroke: none;" d="M0 0h24v24H0V0z" fill="none"/><path style="stroke: none;"  d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>',
      };
    }
  
    constructor({ data, config }) {
      this.data = data;
      this.wrapper = undefined;
      this.config = config || {};
    }
  
    render() {
      this.wrapper = document.createElement("div");
      this.wrapper.classList.add("simple-image");
      try {
        if (this.data.url) {
          if (url.endsWith(".docx") || url.endsWith(".docx/")) {
            return toast.error('File type not supported please reupload as a pdf!');
          }
        }
      } catch (err) {
        return
      }
  
      if (this.data && this.data.fileId) {
        //const originalUrl = decodeURIComponent(this.data.url).replace(
        //  /&amp;/g,
        //  "&"
        //);
        this._createImage(this.data.fileId);
        return this.wrapper;
      }
  
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.style.display = "none"; // Set the input display to hidden
      fileInput.addEventListener("change", this._handleFileSelection.bind(this));
  
      const uploadBtn = document.createElement("button");
      uploadBtn.textContent = "Upload File";
      uploadBtn.classList.add("cdx-button");
      uploadBtn.style.width = '100%'; // Add a class for styling the button
  
      try {
        fileInput.click(); //open immediately
      } catch (err) {
        console.warn(err)
      }
      uploadBtn.addEventListener("click", () => fileInput.click());
  
      this.wrapper.appendChild(uploadBtn);
      this.wrapper.appendChild(fileInput);
  
      return this.wrapper;
    }
  
    async _handleFileSelection(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
  
      const fileInput = this.wrapper.querySelector('input[type="file"]');
      const uploadBtn = this.wrapper.querySelector("button");
  
      fileInput.disabled = true;
      uploadBtn.disabled = true;
      const data2 = await this.config.storeFile.uploadFile(file)
  
      fileInput.disabled = false;
      uploadBtn.disabled = false;
      if (data2.success === 1) {
        await this._createImage(
          data2.file.recid // Pass the fileId as an argument
        );
        this.config.saveData.saveAll()
      } else {
        return
      }
  
    }
  
    async _createImage(fileId) {
      const iframe = document.createElement("iframe");
      iframe.classList.add(styles.embedIframe);
      iframe.style.width = "100%";
      iframe.style.height = "70vh";
      iframe.style.border = "none";
      iframe.style.borderRadius = "5px";
      
      iframe.src = `${process.env.NEXT_PUBLIC_CURRENTURL}/page/pdf/${fileId}`;
      iframe.setAttribute('fileId', fileId); // Set the fileId as an attribute of the iframe
  
      this.wrapper.innerHTML = "";
      this.wrapper.appendChild(iframe);
      const popOutBTN = document.createElement("button");
      popOutBTN.classList.add(styles.popOutbtn)
      popOutBTN.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z"/></svg>`
      popOutBTN.addEventListener("click", () => {
        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=600,left=10,top=10`;
        open(`${process.env.NEXT_PUBLIC_CURRENTURL}/page/pdf/${fileId}`, `SaveMyNotes popup`, params);
      })
      this.wrapper.appendChild(popOutBTN)
    }
  
    save(blockContent) {
      try {
        const iframe = blockContent.querySelector("iframe");
        const fileId = iframe.getAttribute('fileId'); // Retrieve the fileId attribute
  
        return {
          fileId: fileId // Include the fileId in the saved data
        };
      } catch (err) {
        console.warn(err)
      }
    }
  }