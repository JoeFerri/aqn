/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNFootnote {
  constructor ({anchor, description} = {}) {
    this.anchor = anchor;
    this.description = description;
  };

  equals (otherFootnote) {
    return (
      otherFootnote instanceof AQNFootnote &&
      this.anchor === otherFootnote.anchor &&
      this.description === otherFootnote.description
    );
  };

  toString () {
    return `[${this.anchor}]:${this.description}`;
  }
}