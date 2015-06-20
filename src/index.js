'use strict';
import { CLIEngine } from 'eslint';
import path from 'path';

const processHTML = {
  preprocess(text, filename) {
    const config = new CLIEngine({ useEslintrc: true }).getConfigForFile(path.resolve(filename));
    const quote = config.rules.quotes[1] === 'double' ? '"' : '\'';
    text = text;
    const processed = text
    // replace jinja comments with js comments
      .replace(/\{#(.*?)#\}/g, (str, val) => `/*${val}*/`)
    // treat if-else statement as ( ... , ... )
      .replace(/\{%(-?\s*if.*?)%\}/g, (str, val) => `(/*${val.substr(1)}*/`)
      .replace(/\{%(-?\s*(else|elif).*?)%\}/g, (str, val) => `,/*${val.substr(1)}*/`)
      .replace(/\{%(-?\s*endif\s*-?)%\}/g, (str, val) => `/*${val.substr(1)}*/)`)
    // replace jinja statements with js comments
      .replace(/\{%(.*?)%\}/g, (str, val) => `/*${val}*/`)
    // replace jinja expression tags in strings with spaces
      .replace(/(['"])(.*?)\1/g, str => str.replace(/(\{\{|\}\})/g, '  '))
    // replace jinja expressions with strings
      .replace(/\{\{(.*?)\}\}/g, (str, val) => `${quote} ${val} ${quote}`);
    return [processed];
  },

  postprocess(messages) {
    return messages[0];
  }
};

export default {
  processors: {
    '.html': processHTML,
    '.htm': processHTML
  }
};