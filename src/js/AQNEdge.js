/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNEdge {
  constructor ({id, source, target} = {}) {
    this.data = {
      id: id || `${AQNParsing.labelToId(source)}${AQNParsing.SEPARATOR}${AQNParsing.labelToId(target)}`,
      source,
      target
    };
  }

  equals (otherEdge) {
    return otherEdge instanceof AQNEdge && otherEdge && otherEdge.data && this.data.id === otherEdge.data.id;
  };

  toString () {
    return `(${this.data.source} ---> ${this.data.target})`;
  }
}

