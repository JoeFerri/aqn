/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNRendering {

  /**
   * Sostituisce in una formula LaTeX i caratteri o i simboli
   * che possono causare problemi con KaTeX.
   * 
   * @param {string} formula
   * @returns la formula corretta
   */
  static sanitizeFormula(formula) {
    // sostituisce gli apici nella formula
    return formula
            .replace(/“/g, '"')
            .replace(/”/g, '"')
            .replace(/〝/g, '"')
            .replace(/〞/g, '"')
            .replace(/«/g, "<<")
            .replace(/»/g, ">>")
            .replace(/„/g, ",,")
            .replace(/“/g, '"')
            .replace(/’/g, "'")
            .replace(/`/g, "'")
            .replace(/–/g, "-");
  }


  /**
   * Renderizza le formule matematiche in un testo dal formato Latex al formato HTML.
   *
   * @param {string} text testo in cui sostituire le formule
   * @returns {string} testo con le formule sostituite
   */
  static renderMathInText(text) {
    // regex per catturare formule inline ($...$) e display ($$...$$)
    const inlineMathRegex = /\$(.+?)\$/g;
    const displayMathRegex = /\$\$(.+?)\$\$/g;

    // sostituisce le formule display
    if (displayMathRegex.test(text)) {
      text = text.replace(displayMathRegex, (_, formula) => {
        // Genera l'HTML della formula con KaTeX
        return katex.renderToString(AQNRendering.sanitizeFormula(formula), { displayMode: true });
      });
    }

    // sostituisce le formule inline
    if (inlineMathRegex.test(text)) {
      text = text.replace(inlineMathRegex, (_, formula) => {
        // genera l'HTML della formula con KaTeX
        return katex.renderToString(AQNRendering.sanitizeFormula(formula), { displayMode: false });
      });
    }

    return text;
  }
}