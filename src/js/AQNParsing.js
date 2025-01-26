/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNParsing {

  static FOOTNOTE_LABEL = 'Note';

  static SEPARATOR = '~ò°';

  static HIERARCHY_SEPARATOR = '>';

  static START_LINE = '>';

  static removeStartLine (line) {
    const _line = line.trimStart();
    return _line && _line[0] == AQNParsing.START_LINE ? _line.substring(1).trimStart() : line;
  }

  static labelToId (label) {
    //! ASSERT: 
    //! label viene mappato in un id potenzialmente non univoco
    //! {caratteri non alphanumeric} |--> {_}       perdita di informazione
    //! è necessario un controllo negli id dei blocchi precedenti prima di confermare questo block
    // TODO: inserire controllo id univoco
    return label.toLowerCase().replace(/[^\w]/g, '_');
  }
}