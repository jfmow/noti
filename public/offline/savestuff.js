let lastTyped = Date.now();
      let saving = false;
      let timer;

      window.addEventListener("keydown", debounce(typed, 500));

      function typed() {
        lastTyped = Date.now();
        clearTimeout(timer);
        timer = setTimeout(save, 500);
        document.getElementById('savedstate').innerText = 'Un-saved'
      }

      async function save() {
        saving = true;
        document.getElementById('savedstate').innerText = 'Saving...'
        const data2 = await editor.save();
        localStorage.setItem("Offlinesave", JSON.stringify(data2));
        localStorage.setItem('Offlinetime', 'true')
        console.log(JSON.parse(localStorage.getItem("Offlinesave")));
        saving = false;
        document.getElementById('savedstate').innerText = 'Saved'
      }

      function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        };
      }