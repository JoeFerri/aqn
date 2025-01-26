/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNParserState {
  static HIERARCHY = 'HIERARCHY';
  static SYMBOL = 'SYMBOL';
  static IMAGE = 'IMAGE';
  static FOOTNOTE = 'FOOTNOTE';
  static KEYWORD = 'KEYWORD';
  static CONTENT = 'CONTENT';
  static CONTENT_CODE = 'CONTENT_CODE';
  static BLOCK_END = 'BLOCK_END';
  static ERROR_HIERARCHY = 'ERROR_HIERARCHY';
  static ERROR_SYMBOL = 'ERROR_SYMBOL';
  static ERROR_IMAGE = 'ERROR_IMAGE';
  static ERROR_FOOTNOTE = 'ERROR_FOOTNOTE';
  static ERROR_KEYWORD = 'ERROR_KEYWORD';
  static ERROR_CONTENT = 'ERROR_CONTENT';
}