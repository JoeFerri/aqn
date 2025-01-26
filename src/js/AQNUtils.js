/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNUtils {

  static noSpace (text) {
    return text.replace(/[\s\t]/g, '');
  }

  static hasDuplicates(arr) {
    return arr.length !== new Set(arr).size;
  }

  static returnToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  }

}