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
        SimpleTodo: {
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
    data: localStorage.getItem('Offlinesave') ? JSON.parse(localStorage.getItem("Offlinesave")) : { "time": 1688257618252, "blocks": [{ "id": "fSS7EY0VOi", "type": "paragraph", "data": { "text": "" } }], "version": "2.27.2" },
});

document.getElementById('restbtn').addEventListener('click', () => {
    localStorage.removeItem('Offlinesave')
    editor.clear()
})

document.getElementById('closepopup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none'
})
