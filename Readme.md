# Create a JQuery like library in vanilla javascript

Vanilla javascript library that works on jQuey like syntax. Instead of $ function of jQuery this one uses $_ [can use $ also but for differentiation used $_]. 

Please note: Library has only a few methods to handle the below test case.

## Test Case [File: js/index.js]

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

## Implementation of sample library

1. Create a function that accepts an argument 

```js
        const $_ = (argument) => {

        }; 
```

2. Get the type of the argument

```js
        const getArgumentType = option => typeof option;

        const $_ = (argument) => {
                const argumentType = getArgumentType(argument); 

        };
```

3. If the argument is function then the jQuery document ready scenario is handled. Argument function is attached to DOMContentLoaded event of window 

```js
        const $_ = (argument) => {
                const argumentType = getArgumentType(argument); 
                if(argumentType === 'function') {
                        window.addEventListener("DOMContentLoaded", argument);
                        return;
                }
        };

```

4. If argument is string then use it as a selector [example $('#mainId'), $('.classname'), $(div), $(ul>li))] for document.querySelectorAll()

```js
        const $_ = (argument) => {
                const argumentType = getArgumentType(argument); 
                if(argumentType === 'function') {
                        ...
                }
                if(argumentType === 'string') {
                        const elements = document.querySelectorAll(argument);
                        return elements;
                }
        };

```

5. If argument is an html element object then jQuery(this) is handled

```js
        const $_ = (argument) => {
                const argumentType = getArgumentType(argument); 
                if(argumentType === 'function') {
                        ...
                }
                if(argumentType === 'string') {
                        ...
                }
                if(argumentType === 'object' && argument instanceof HTMLElement) {
                        const elements = [argument];
                        return elements;
                }
        };

```

    Element object is added to an array so that methods can be added to it

6. Methods like css, html, text, each, on are added to the NodeList\array retuned from argument type string\object

```js

        const addEventToElements = (elements) => {
                addEvents(elements, "css", (...opts) =>
                        setPropertyCustomLogic(elements, "style", opts, (ele, prop, key, value) => {
                        ele[prop][key] = value;
                        })
                );

                addEvents(elements, "html", () => elements[0].innerHTML);
                addEvents(elements, "text", () => elements[0].textContent);

                addEvents(elements, "on", (...opts) =>
                        addListener(elements, opts[0], opts[1])
                );

                addEvents(elements, "each", (opts) => {
                        invokeCallbackForElements(elements, opts);
                });
        };
        const $_ = (argument) => {
                ...
                if(argumentType === 'string') {
                        ...
                        addEventToElements(elements);
                        ...
                }else if(argumentType === 'object' && argument instanceof HTMLElement) {
                        ...
                        addEventToElements(elements);
                        ...
                }
        };

```

addEventToElements method is used to add all the events mentioned in the test case so that can be used in selected element. This method make use of few helper function. All the code is given belwo

### library function code [File js/lib.js]

```js
    const getArgumentType = option => typeof option;

    const createObjectFromArray = arr => Object.fromEntries([arr]);

    const addListener = (elements, action, listener) => {
        elements.forEach(ele => ele.addEventListener(action, listener));
    };

    const invokeCallbackForElements = (elements, callback) => {
        elements.forEach((ele, itx) => {
            const fn = callback.bind(ele);
            fn(itx);
        });
    };

    const setPropertyCustomLogicForElements = (elements, prop, options, customFn) => {
      elements.forEach((ele) => {
        for (const key in options) {
          customFn(ele, prop, key, options[key]);
        }
      });
    };

    const setPropertyCustomLogic = (elements, prop, data, customFn) => {
        const dataType = getArgumentType(data[0]); 
        if (dataType === "string") {
          setPropertyCustomLogicForElements(
            elements,
            prop,
            createObjectFromArray([data[0], data[1]]), 
            customFn
          );
        } else if (dataType === "object") {
          setPropertyCustomLogicForElements(elements, prop, data[0], customFn);
        }
    };

    const addEvents = (ele, prop, callback) => {
        ele[prop] = callback;
    };

    const addEventToElements = (elements) => {
        addEvents(elements, "css", (...opts) =>
          setPropertyCustomLogic(elements, "style", opts, (ele, prop, key, value) => {
            ele[prop][key] = value;
          })
        );

        addEvents(elements, "html", () => elements[0].innerHTML);
        addEvents(elements, "text", () => elements[0].textContent);

        addEvents(elements, "on", (...opts) =>
          addListener(elements, opts[0], opts[1])
        );

        addEvents(elements, "each", (opts) => {
          invokeCallbackForElements(elements, opts);
        });
    };

    const $_ = (argument) => {
        const argumentType = getArgumentType(argument); 
        if(argumentType === 'function') {
            window.addEventListener("DOMContentLoaded", argument);
            return;
        }
        if(argumentType === 'string') {
            const elements = document.querySelectorAll(argument);
            addEventToElements(elements);
            return elements;
        }else if(argumentType === 'object' && argument instanceof HTMLElement) {
            const elements = [argument];
            addEventToElements(elements);
            return elements;
        }
    };
```

lib.js and index.js are added to the index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library - Sample HTML</title>
</head>
<body>
    <div id="main">
        <h1>header</h1>
        <h2>Sub Header</h2>
        <button id="btnAlert" type="button">Alert JS</button>
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
        </ul>
    </div>
    <script src="./js/lib.js"></script>
    <script src="./js/index.js"></script>
</body>
</html>
```