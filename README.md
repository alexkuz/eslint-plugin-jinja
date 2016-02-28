# eslint-plugin-jinja
This plugin treats Jinja template expressions and statements as valid Javascript expressions, so that ESLint can check javascript code, ignoring any Jinja expression found.

### Example

Plugin will convert (internally) this code:

```js
  (function() {
    'use strict';

    {# plain jinja variables are converted into strings
      (preferred quotes are getting from .eslintrc file) #}

    var a = 'this is' + {{ some_variable }};

    {# if it is already in string, it is wrapped with spaces #}

    var b = 'this is {{ other_variable }}';
    var c = 'and this is {{ another_one['field']}}';

    {# if-else statements are converted into ( ..., ... ) expression #}

    var d = {% if something %} 'this is something' {% else %} null {% endif %};

    {# any other statements become comments #}
    
    {% for i in [1, 2, 3] %}
      console.log(a, b, c, d);
    {% endfor %}
  })();
```
into this:
```js
 (function() {
    'use strict';

    /* plain jinja variables are converted into strings
      (preferred quotes are getting from .eslintrc file) */

    var a = 'this is' + '  some_variable  ';

    /* if it is already in string, it is wrapped with spaces */

    var b = 'this is    other_variable   ';
    var c = 'and this is    another_one[ field ]  ';

    /* if-else statements are converted into ( ..., ... ) expression */

    var d = (/*if something */ 'this is something' ,/*else */ null /*endif */);

    /* any other statements become comments */

    /* for i in [1, 2, 3] */
      console.log(a, b, c, d);
    /* endfor */
  })();
```
