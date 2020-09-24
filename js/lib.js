
    const T = option => typeof option;

    const O = arr => Object.fromEntries([arr]);

    const addListener = (elements, action, listener) => {
        elements.forEach(ele => ele.addEventListener(action, listener));
    }

    const iterator = (elements, callback) => {
        elements.forEach((ele, itx) => {
            const fn = callback.bind(ele);
            fn(itx);
        })
    }

    const setter = (elements, prop, options, customFn) => {
      elements.forEach((ele) => {
        for (const key in options) {
          customFn(ele, prop, key, options[key]);
        }
      });
    };

    const callSetter = (elements, prop, data, customFn) => {
        const dataType = T(data[0]); 
        if (dataType === "string") {
          setter(
            elements,
            prop,
            O([data[0], data[1]]), 
            customFn
          );
        } else if (dataType === "object") {
          setter(elements, prop, data[0], customFn);
        }
    } 

    const addEvents = (ele, prop, callback) => {
        ele[prop] = callback;
    }

    const addEventToElements = (elements) => {
        addEvents(elements, "css", (...opts) =>
          callSetter(elements, "style", opts, (ele, prop, key, value) => {
            ele[prop][key] = value;
          })
        );

        addEvents(elements, "html", () => elements[0].innerHTML);
        addEvents(elements, "text", () => elements[0].textContent);

        addEvents(elements, "on", (...opts) =>
          addListener(elements, opts[0], opts[1])
        );

        addEvents(elements, "each", (opts) => {
          iterator(elements, opts);
        });
    }

    const $_ = (...args) => {
        const optionType = T(args[0]); 
        if(optionType === 'function') {
            window.addEventListener("DOMContentLoaded", args[0]);
            return;
        }
        if(optionType === 'string') {
            const elements = document.querySelectorAll(args[0]);
            addEventToElements(elements);
            return elements;
        }else if(optionType === 'object' && args[0] instanceof HTMLElement) {
            const elements = [args[0]];
            addEventToElements(elements);
            return elements;
        }
    }
