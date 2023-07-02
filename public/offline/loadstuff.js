if (!localStorage.getItem("Offlinesave")) {
    localStorage.setItem("Offlinesave", null);
  }
  const editor = new EditorJS({
    autofocus: true,
    tools: {
      header: {
        class: Header,
        inlineToolbar: true,
      },
      list: {
        class: List,
        inlineToolbar: true,
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
      },
      table: Table,
      todo: {
        class: SimpleTodo,
        config: {
          saveData: {
            saveAll() {
              async function save() {
                const data2 = await editor.save();
                localStorage.setItem("Offlinesave", JSON.stringify(data2));
                localStorage.setItem('Offlinetime', 'true')
                console.log(
                  JSON.parse(localStorage.getItem("Offlinesave"))
                );
              }
              return save();
            },
          },
        },
      },
    },
    placeholder: "Enter some text...",
    data: JSON.parse(localStorage.getItem("Offlinesave")),
  });