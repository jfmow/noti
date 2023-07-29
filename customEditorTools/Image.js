import PocketBase from "pocketbase";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)
import styles from "@/styles/Create.module.css";

export default class Image {
  static get toolbox() {
    return {
      title: "Image",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"></rect><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.7778 9.33331H13.7867"></path></svg>',
    };
  }

  constructor({ data, config, }) {
    this.data = data;
    this.wrapper = undefined;
    this.config = config || {};
    this.currpage = config.currPage
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("simple-image");

    if (this.data.file?.url) {
      function extractStringFromURL(url) {
        const regex = /\/([^/]+)\/[^/]+$/;
        const match = url.match(regex);
        if (match) {
          return match[1];
        } else {
          return null; // or you can return an error message or handle the case differently
        }
      }

      // Example usage:
      const url = this.data.file.url
      const extractedString = extractStringFromURL(url);
      this._createImage(extractedString);
      return this.wrapper;
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
    uploadBtn.textContent = "Upload image";
    uploadBtn.classList.add("cdx-button");
    uploadBtn.style.width = "100%";

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
    const iframe = document.createElement("img");
    iframe.classList.add(styles.embedIframe);
    iframe.style.width = "100%";
    iframe.style.maxHeight = "50vh";
    iframe.style.objectFit = 'contain';
    iframe.style.borderRadius = "5px";
    const fileToken = await pb.files.getToken();
    // retrieve an example protected file url (will be valid ~5min)

    const record = await pb.collection('imgs').getOne(fileId); // Use the fileId to retrieve the record
    if (record.page === "") {
      await pb.collection("imgs").update(fileId, { "page": this.currpage })
    }
    const url = pb.files.getUrl(record, record.file_data, { 'token': fileToken });

    iframe.src = url;
    iframe.setAttribute('fileId', fileId); // Set the fileId as an attribute of the iframe

    this.wrapper.innerHTML = "";
    this.wrapper.appendChild(iframe);
  }

  static get pasteConfig() {
    return {
      /**
       * Paste HTML into Editor
       */

      /**
       * Drag n drop file from into the Editor
       */
      files: {
        mimeTypes: ['image/*'],
      },
    };
  }


  async onPaste(event) {
    switch (event.type) {
      // ... case 'tag'
      // ... case 'file'
      case 'file':
        const file = event.detail.file;
        const data2 = await this.config.storeFile.uploadFile(file)

        if (data2.success === 1) {
          await this._createImage(
            data2.file.recid // Pass the fileId as an argument
          )
        } else {
          return
        }
        break;
    }
  }



  save(blockContent) {
    try {
      const iframe = blockContent.querySelector("img");
      const fileId = iframe.getAttribute('fileId'); // Retrieve the fileId attribute

      return {
        fileId: fileId // Include the fileId in the saved data
      };
    } catch (err) {
      //console.log(err)
    }
  }
}