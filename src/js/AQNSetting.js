/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNSetting {
  static init() {
      // Configura il plugin marked-highlight
      const highlight = markedHighlight.markedHighlight({
        langPrefix: 'hljs language-', // Classe predefinita per Highlight.js
        highlight(code, lang) {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          } else {
            return hljs.highlightAuto(code).value; // Evidenziazione automatica
          }
        },
      });
      // Configura Marked.js con il plugin
      marked.use(highlight);
  }
}

