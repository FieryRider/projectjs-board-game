var $ = function (_selector) {

    let constr = function() {
        if (arguments.length == 0)
            return;

        if (typeof arguments[0] === 'string') {
            Object.assign(this, document.querySelectorAll(_selector));
        } else {
            Object.assign(this, arguments[0]);
        }
    }

    constr.prototype = {
        each: function(fn) {
            for (let element of Object.values(this)) {
                let newQuery = new constr([element]);
                fn(newQuery);
            }
            return this;
        },
        hide: function() {
            for (let element of Object.values(this)) {
                element.style.display = 'None';
            }
            return this;
        },
        show: function() {
            for (let element of Object.values(this)) {
                element.style.display = '';
            }
            return this;
        },
        add: function(el) {
            let createdElements = [];
            for (let element of Object.values(this)) {
                let htmlEl = document.createElement(el);
                createdElements.push(element.appendChild(htmlEl));
            }

            let newQuery = new constr(createdElements)
            return newQuery;
        },
        remove: function(el) {
            for (let element of Object.values(this)) {
                element.remove();
            }
            return this;
        },
        text: function() {
            if ((arguments.length == 0) && this.hasOwnProperty('0')) {
                return this['0'].innerHTML;
            } else if ((arguments.length == 1)) {
                let newText = arguments[0];

                for (let element of Object.values(this)) {
                    element.innerHTML = newText;
                }
            }
            return this;
        },
        html: function() {
            if ((arguments.length == 0) && (this.hasOwnProperty('0'))) {
                return this['0'].outerHTML;
            } else if ((arguments.length == 1)) {
                let newHTML = arguments[0];
                for (let element of Object.values(this)) {
                    element.outerHTML = newHTML;
                }
            }
            return this;
        },
        id: function() {
            if ((arguments.length == 0) && (this.hasOwnProperty('0'))) {
                return this[0].id;
            } else if (arguments.length == 1) {
                let newId = arguments[0];
                for (let element of Object.values(this)) {
                    element.id = newId;
                }
            }
            return this;
        },
        class: function() {
            if ((arguments.length == 0) && (this.hasOwnProperty('0'))) {
                return this[0].className;
            } else if (arguments.length == 1) {
                let newClass = arguments[0];
                for (let element of Object.values(this)) {
                    element.className = newClass;
                }
            }
            return this;
        },
        name: function() {
            if ((arguments.length == 0) && (this.hasOwnProperty('0'))) {
                return this[0].getAttibute('name')
            } else if (arguments.length == 1) {
                let newName = arguments[0];
                for (let element of Object.values(this)) {
                    element.setAttribute('name', newName);
                }
            }
            return this;
        },
        attr: function() {
            if ((arguments.length == 0) || (arguments.length > 2)) return this;

            let argumentIsObject = (typeof arguments[0] === 'object') && (!Array.isArray(arguments[0]));
            if (arguments.length == 1 && argumentIsObject) {
                for (let element of Object.values(this)) {
                    for (const [attributeName, attributeValue] of Object.entries(arguments[0])) {
                        element.setAttribute(attributeName, attributeValue);
                    }
                }
                return this;
            } else if (arguments.length == 2) {
                let argumentsAreStrings = ((typeof arguments[0] === 'string') && (typeof arguments[1] === 'string'));
                if (!argumentsAreStrings) return this;

                for (let element of Object.values(this)) {
                    element.setAttribute(arguments[0], arguments[1]);
                }
                return this;
            } else if ((arguments.length == 1) && (typeof arguments[0] === 'string')) {
                if (this.hasOwnProperty('0')) {
                    return this[0].getAttribute(arguments[0]);
                }
                return '';
            }
        },
        css: function() {
            if ((arguments.length == 0) || (arguments.length > 2)) return this;

            let argumentIsObject = (typeof arguments[0] === 'object') && (!Array.isArray(arguments[0]));
            if (arguments.length == 1 && argumentIsObject) {
                for (let element of Object.values(this)) {
                    for (const [cssKey, cssValue] of Object.entries(arguments[0])) {
                        element.style[cssKey] =  arguments[0][cssKey];
                    }
                }
                return this;
            } else if (arguments.length == 2) {
                let argumentsAreStrings = ((typeof arguments[0] === 'string') && (typeof arguments[1] === 'string'));
                if (!argumentsAreStrings) return this;

                for (let element of Object.values(this)) {
                    element.style[arguments[0]] = arguments[1];
                }
                return this;
            } else if ((arguments.length == 1) && (typeof arguments[0] === 'string')) {
                if (this.hasOwnProperty('0')) {
                    return this['0'].style[arguments[0]];
                }
                return this;
            }
        },
        parent: function() {
            let parents = [];
            for (let element of Object.values(this)) {
                parents.push(element.parentNode);
            }
            let newQuery = new constr(parents);

            return newQuery;
        },
        children: function() {
            let children = [];
            for (let element of Object.values(this)) {
                for (let child of element.children) {
                    children.push(child);
                }
            }

            let newQuery = new constr(children);
            return newQuery;
        },
        next: function() {
            let siblings = [];
            for (let element of Object.values(this)) {
                siblings.push(element.nextElementSibling);
            }
            let newQuery = new constr(siblings);

            return newQuery;
        },
        prev: function() {
            let siblings = [];
            for (let element of Object.values(this)) {
                siblings.push(element.previousElementSibling);
            }
            let newQuery = new constr(siblings);

            return newQuery;
        },
        on: function(ev, callback) {
            for (let element of Object.values(this)) {
                let elCallback = function(ev) {
                    let newQuery = new constr([element]);
                    callback.call(newQuery, ev);
                };

                if (!element.hasOwnProperty('eventListeners'))
                    element.eventListeners = {};
                if (!element.eventListeners.hasOwnProperty(ev))
                    element.eventListeners[ev] = [];

                element.eventListeners[ev].push(elCallback);
                element.addEventListener(ev, elCallback);
            }

            return this;
        },
        off: function(ev) {
            for (let element of Object.values(this)) {
                if ((!element.hasOwnProperty('eventListeners')) && (!element.eventListeners.hasOwnProperty(ev)))
                    return this;

                element.eventListeners[ev].forEach((callback) => {
                    element.removeEventListener(ev, callback);
                });
            }

            return this;
        }
    };

    if (this.__proto__.constructor !== $) {
        return new constr(_selector);
    }
}
