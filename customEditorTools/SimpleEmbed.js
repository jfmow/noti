import PocketBase from "pocketbase";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false)
import { toaster } from "@/components/toast";
import { createRoot } from 'react-dom/client';
import MyPdfViewer from "./pdfViewer";

export default class SimpleIframe {
  static get toolbox() {
    return {
      title: "PDF",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path style="stroke: none;" d="M0 0h24v24H0V0z" fill="none"/><path style="stroke: none;"  d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>',
    };
  }

  constructor({ data, config, readOnly }) {
    this.data = data;
    this.wrapper = undefined;
    this.config = config || {};
    this.readOnly = readOnly
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("simple-image");
    try {
      if (this.data.url) {
        if (url.endsWith(".docx") || url.endsWith(".docx/")) {
          return toaster.error('File type not supported please reupload as a pdf!');
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

    } else {
      return
    }

  }

  async _createImage(fileId) {

    const container = document.createElement("div")
    container.setAttribute("level", "root-container")
    container.dataset.fileId = fileId
    container.setAttribute("fileId", fileId)
    this.wrapper.appendChild(container);
    const root = createRoot(container); // createRoot(container!) if you use TypeScript
    let fileUrl
    const record = await pb.collection('files').getOne(fileId, { expand: 'page' }); // Use the fileId to retrieve the record
    if (!record.expand.page.shared) {
      const fileToken = await pb.files.getToken();
      fileUrl = pb.files.getUrl(record, record.file_data, { 'token': fileToken });
    } else {
      fileUrl = pb.files.getUrl(record, record.file_data);
    }
    root.render(<MyPdfViewer fileId={fileId} url={fileUrl} />);
  }

  removed() {
    if (this.data.fileId) {
      async function removeImg(file) {
        await pb.collection('files').delete(file);
      }
      removeImg(this.data.fileId)
    }
  }

  save(blockContent) {
    try {
      const container = blockContent.querySelector('[level="root-container"]')
      let fileId = container.dataset.fileId; // Retrieve the fileId attribute

      if (fileId === "" || fileId === undefined) {
        fileId = container.getAttribute("fileId")
      }

      return {
        fileId: fileId // Include the fileId in the saved data
      };
    } catch (err) {
      console.warn(err)
    }
  }

  static get isReadOnlySupported() {
    return true;
  }
}