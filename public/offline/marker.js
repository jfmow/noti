class Marker {

    static get isInline() {
      return true;
    }
  
    static get sanitize() {
      return {
        mark: {
          class: Marker.CSS,
          style: {
            'background-color': true // Allow the background-color style
          }
        }
      };
    }
  
    static get CSS() {
      return 'cdx-marker';
    };
  
    get state() {
      return this._state;
    }
  
    set state(state) {
      this._state = state;
      this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
    }
  
    constructor({api}) {
      this.api = api;
      this.button = null;
      this._state = false;
  
      this.tag = 'MARK';
      this.class = 'cdx-marker';
    }
  
    render() {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M11.3536 9.31802L12.7678 7.90381C13.5488 7.12276 14.8151 7.12276 15.5962 7.90381C16.3772 8.68486 16.3772 9.95119 15.5962 10.7322L14.182 12.1464M11.3536 9.31802L7.96729 12.7043C7.40889 13.2627 7.02827 13.9739 6.8734 14.7482L6.69798 15.6253C6.55804 16.325 7.17496 16.942 7.87468 16.802L8.75176 16.6266C9.52612 16.4717 10.2373 16.0911 10.7957 15.5327L14.182 12.1464M11.3536 9.31802L14.182 12.1464"></path><line x1="15" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"></line></svg>';
      this.button.classList.add(this.api.styles.inlineToolButton);
  
      return this.button;
    }
  
    surround(range) {
      if (!range) {
        return;
      }
  
      let termWrapper = this.api.selection.findParentTag(this.tag, Marker.CSS);
  
      /**
       * If start or end of selection is in the highlighted block
       */
      if (termWrapper) {
        this.unwrap(termWrapper);
      } else {
        this.wrap(range);
      }
    }
  
    wrap(range) {
      /**
       * Create a wrapper for highlighting
       */
      let marker = document.createElement(this.tag);
  
      marker.classList.add(Marker.CSS);
  
      /**
       * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
       *
       * // range.surroundContents(span);
       */
      marker.appendChild(range.extractContents());
      range.insertNode(marker);
  
      /**
       * Expand (add) selection to highlighted block
       */
      this.api.selection.expandToTag(marker);
    }
  
    unwrap(termWrapper) {
      /**
       * Expand selection to all term-tag
       */
      this.api.selection.expandToTag(termWrapper);
  
      let sel = window.getSelection();
      let range = sel.getRangeAt(0);
  
      let unwrappedContent = range.extractContents();
  
      /**
       * Remove empty term-tag
       */
      termWrapper.parentNode.removeChild(termWrapper);
  
      /**
       * Insert extracted content
       */
      range.insertNode(unwrappedContent);
  
      /**
       * Restore selection
       */
      sel.removeAllRanges();
      sel.addRange(range);
    }
  
  
    checkState() {
      const mark = this.api.selection.findParentTag(this.tag);
  
      this.state = !!mark;
    
      if (this.state) {
        this.showActions(mark);
      } else {
        this.hideActions();
      }
    }
  
    renderActions() {
      this.colorPicker = document.createElement('input');
      this.colorPicker.type = 'color';
      this.colorPicker.value = '#f5f1cc';
      this.colorPicker.hidden = true;
      this.colorPicker.style.border = 'none'
      this.colorPicker.style.background = 'none'
  
      return this.colorPicker;
    }
  
    showActions(mark) {
      const {backgroundColor} = mark.style;
      this.colorPicker.value = backgroundColor ? this.convertToHex(backgroundColor) : '#f5f1cc';
  
      this.colorPicker.onchange = () => {
        mark.style.backgroundColor = this.colorPicker.value;
      };
      this.colorPicker.hidden = false;
    }
  
    hideActions() {
      this.colorPicker.onchange = null;
      this.colorPicker.hidden = true;
    }
  
    convertToHex(color) {
      const rgb = color.match(/(\d+)/g);
  
      let hexr = parseInt(rgb[0]).toString(16);
      let hexg = parseInt(rgb[1]).toString(16);
      let hexb = parseInt(rgb[2]).toString(16);
  
      hexr = hexr.length === 1 ? '0' + hexr : hexr;
      hexg = hexg.length === 1 ? '0' + hexg : hexg;
      hexb = hexb.length === 1 ? '0' + hexb : hexb;
  
      return '#' + hexr + hexg + hexb;
    }
  }