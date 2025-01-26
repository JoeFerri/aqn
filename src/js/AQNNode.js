/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNNode {
  static _index = 0;

  constructor ({label, id, raw, classes} = {}) {
    classes = Array.from(new Set(classes));

    this.data = {
        id: id || AQNParsing.labelToId(label),
        label,
        raw: raw || label,
        classes,
        index: AQNNode._index++
      };
  }

  equals (otherNode) {
    return otherNode instanceof AQNNode && otherNode && otherNode.data && this.data.id === otherNode.data.id;
  }

  nextPositionedOf (otherNode) {
    return this.data.index > otherNode.data.index;
  }

  toString () {
    return `[${this.data.label}](${this.data.id})`;
  }
}