
class SimpleTodo {
  static get toolbox() {
    return {
      title: "Todo",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><rect fill="none" height="24" width="24"/><g><path d="M22,8c0-0.55-0.45-1-1-1h-7c-0.55,0-1,0.45-1,1s0.45,1,1,1h7C21.55,9,22,8.55,22,8z M13,16c0,0.55,0.45,1,1,1h7 c0.55,0,1-0.45,1-1c0-0.55-0.45-1-1-1h-7C13.45,15,13,15.45,13,16z M10.47,4.63c0.39,0.39,0.39,1.02,0,1.41l-4.23,4.25 c-0.39,0.39-1.02,0.39-1.42,0L2.7,8.16c-0.39-0.39-0.39-1.02,0-1.41c0.39-0.39,1.02-0.39,1.41,0l1.42,1.42l3.54-3.54 C9.45,4.25,10.09,4.25,10.47,4.63z M10.48,12.64c0.39,0.39,0.39,1.02,0,1.41l-4.23,4.25c-0.39,0.39-1.02,0.39-1.42,0L2.7,16.16 c-0.39-0.39-0.39-1.02,0-1.41s1.02-0.39,1.41,0l1.42,1.42l3.54-3.54C9.45,12.25,10.09,12.25,10.48,12.64L10.48,12.64z"/></g></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {
      items: []
    };
    this.wrapper = undefined;
    this.config = config;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add('todo_container');

    const list = document.createElement("ul");
    list.classList.add('todolist');

    if (this.data && this.data.items) {
      this.data.items.forEach((item, index) => {
        const listItem = document.createElement("li");

        const label = document.createElement("label");
        label.classList.add('todocontainer');

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.checked;

        const checkmark = document.createElement("div");
        checkmark.classList.add('todocheckmark');

        label.appendChild(checkbox);
        label.appendChild(checkmark);

        listItem.appendChild(label);

        const content = document.createElement("span");
        content.textContent = item.content;
        content.contentEditable = true; // Make the content editable

        content.addEventListener("input", () => {
          item.content = content.textContent;
        });

        listItem.appendChild(content);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add('tododeletebtn')
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" ><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>`
        deleteButton.addEventListener("click", () => {
          this.data.items.splice(index, 1);
          listItem.remove();
        });
        checkbox.addEventListener("change", () => {
          item.checked = checkbox.checked;
          if (item.checked) {
            listItem.appendChild(deleteButton);
          } else {
            listItem.removeChild(deleteButton);
          }


        });
        if (item.checked) {
          listItem.appendChild(deleteButton);
        }


        list.appendChild(listItem);
      });
    } else {
      this.data = { items: [] };
    }

    const addItemInput = document.createElement("input");
    addItemInput.type = "text";
    addItemInput.placeholder = "+ Add an item";
    addItemInput.classList.add('todoiteminput');
    addItemInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && addItemInput.value.trim() !== "") {
        const newItem = {
          content: addItemInput.value.trim(),
          checked: false
        };
        this.data.items.push(newItem);

        const listItem = document.createElement("li");

        const label = document.createElement("label");
        label.classList.add('todocontainer');

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const checkmark = document.createElement("div");
        checkmark.classList.add('todocheckmark');

        label.appendChild(checkbox);
        label.appendChild(checkmark);

        listItem.appendChild(label);

        const content = document.createElement("span");
        content.textContent = newItem.content;
        content.contentEditable = true; // Make the content editable

        content.addEventListener("input", () => {
          newItem.content = content.textContent;
        });

        listItem.appendChild(content);



        checkbox.addEventListener("change", () => {
          newItem.checked = checkbox.checked;


        });

        list.appendChild(listItem);


        addItemInput.value = "";
      }
    });

    this.wrapper.appendChild(list);
    this.wrapper.appendChild(addItemInput);

    return this.wrapper;
  }


  save() {
    return this.data;
  }
}