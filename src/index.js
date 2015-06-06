'use strict';
import { CLIEngine } from 'eslint';
import path from 'path';

const processHTML = {
  preprocess(text, filename) {
    const config = new CLIEngine({ useEslintrc: true }).getConfigForFile(path.resolve(filename));
    const quote = config.rules.quotes[1] === 'double' ? '"' : '\'';
    text = text;
    return [text
    // replace jinja comments with js comments
      .replace(/\{#.*?#\}/g, (str, val) => `/*${val}*/`)
    // replace jinja statements with js comments
      .replace(/\{%.*?%\}/g, (str, val) => `/*${val}*/`)
    // replace jinja expression tags in strings with spaces
      .replace(/(['"])(.*?)\1/g, str => str.replace(/(\{\{|\}\})/g, '  '))
    // replace jinja expressions with strings
      .replace(/\{\{(.*?)\}\}/g, (str, val) => `${quote} ${val} ${quote}`)]; 
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