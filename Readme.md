# Create a JQuery like library in vanilla javascript

Library in vanilla javascript, works on jQuey like syntax. Instead of $ [jQuery object] this one uses $_ [can use $ also but for differentiation used $_]. 

Please note: Library has only a few methods to handle the below test case.

## Test Case:

```js
   $_(() => { // jQuery document ready equivalent
    console.log('This is from Dom Content loaded');

    $_('h1').css('color', 'red'); // jQuery css()
    $_('h2').css({'color': 'green', 'text-decoration': 'underline'});


    console.log($_('h1').html()); // jQuery html()
    console.log($_('h2').text());  // jQuery text()

    $_('#btnAlert').on('click', () => alert('Hai From Button')); // jQuey on()

    $_('ul>li').each(function (itx){ // jQuery each()
        if(itx%2 === 0) {
            $_(this).css('color', 'red');
        }
    })
});
```

## How it is created

1. Create a function that accepts an argument 
        ``
        const $_ = (...args) => {

        }
        ``

2. Get the type of the argument
    ``
        const optionType = T(args[0])`
    ``

3. If the argument is function then the jQuery document ready scenario is handled. Argument function is attached to DOMContentLoaded event of window 
        ``
        if(optionType === 'function') {
            window.addEventListener("DOMContentLoaded", args[0]);
            return;
        }
        ``
4. If argument is string then use it as a selector [example $('#mainId'), $('.classname'), $(div), $(ul>li))] for document.querySelectorAll() 
       ``
        if(optionType === 'string') {
            const elements = document.querySelectorAll(args[0]);
            return elements;
        }
        ``
    In the selected node list returned from the query selector methods are added

5. If argument is an html element object then jQuery(this) is handled
       ``
        if(optionType === 'object' && args[0] instanceof HTMLElement) {
            const elements = [args[0]];
            return elements;
        }
        ``
    Element object is added to an array so that methods can be added to it

6. For the selected element of argument type string and HtmlElement object methods like css, html, text, each, on are added 

### Code for the library function is given below

```js
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
```