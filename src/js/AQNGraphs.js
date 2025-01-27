/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNGraphs {

  constructor({container = null, style = [], layout = {}, listeners = [], defaults = false, options = {}}) {
    this._cy = null;
    this._cyReDone = false;
    this._elements = [];
    this._container = container || null;
    this._style = defaults === true ? AQNGraphs.defaults.styles.default : (defaults === "hierarchy" ? AQNGraphs.defaults.styles.hierarchy : (defaults === "graph" ? AQNGraphs.defaults.styles.graph : (style || [])));
    this._layout = defaults === true ? AQNGraphs.defaults.layout.default : (defaults === "hierarchy" ? AQNGraphs.defaults.layout.hierarchy : (defaults === "graph" ? AQNGraphs.defaults.layout.graph : (layout || {})));
    this._listeners = listeners || [];
    this._options = options || {};
  }

  cySetted () {
    return this._cy !== null ? true : false;
  }

  cyReDone (redone) {
    if (redone !== undefined) {
      this._cyReDone = redone;
      return this;
    }
    return this._cyReDone;
  }

  buildIfNotSetted () {
    if (!this.cySetted()) {
      this.build();
    }
    return this;
  }

  buildIfReDone () {
    if (this._cyReDone) {
      this.build();
    }
    return this;
  }

  build () {
    this._cy = AQNGraphs.graphFactory({ cy: this._cy,
                                        container: this._container,
                                        elements: this._elements,
                                        style: this._style,
                                        layout: this._layout,
                                        listeners: this._listeners,
                                        options: this._options});
    this._cyReDone = false;
    this.resizeCy();
    return this;
  }

  resizeCy() {
    if (this._cy) {
      this._cy.resize();
      this._cy.fit();
    }
  }

  destroy () {
    this._cy.destroy();
    return this;
  }

  elements (eles) {
    if (eles !== undefined) {
      this._elements = eles;
      return this;
    }
    return this._elements;
  }

  container (container) {
    if (container !== undefined) {
      this._container = container;
      return this;
    }
    return this._container;
  }

  style (style) {
    if (style !== undefined) {
      this._style = style;
      return this;
    }
    return this._style;
  }

  layout (layout) {
    if (layout !== undefined) {
      this._layout = layout;
      return this;
    }
    return this._layout;
  }

  listeners (listeners) {
    if (listeners !== undefined) {
      this._listeners = listeners;
      return this;
    }
    return this._listeners;
  }

  options (options) {
    if (options !== undefined) {
      this._options = options;
      return this;
    }
    return this._options;
  }

  
  static graphFactory({cy = null, container = null, elements = [], style = [], layout = {}, listeners = [], options = {}}) {
    // Distruggi cy precedente
    if (cy) {
      cy.destroy();
    }

    cy = cytoscape({
      minZoom: options.minZoom || AQNGraphs.defaults.minZoom,
      maxZoom: options.maxZoom || AQNGraphs.defaults.maxZoom,
      wheelSensitivity: options.wheelSensitivity || AQNGraphs.defaults.wheelSensitivity,
      container: container || null,
      elements: elements || [],
      style: style || AQNGraphs.defaults.styles.default,
      layout: layout || AQNGraphs.defaults.layout.default,
    });

    listeners.forEach((listener) => {
      const {eventType, selector, handler} = listener;
      if (eventType && selector && handler) {
        cy.on(eventType, selector, handler);
      }
    });

    return cy;
  }

  static defaults = {
    minZoom: 0.01,
    maxZoom: 3,
    wheelSensitivity: 0.1,

    layout : {
      default : {},

      hierarchy : {
        name: 'breadthfirst',
        directed: true,
        padding: 10,
        spacingFactor: 2.5,
        animate: true,
        animationDuration: 500 // ms
      },

      graph: {
        // name: 'cose',
        // nodeRepulsion: 4000,
        // idealEdgeLength: 100,
        // gravity: 0.1,
        // padding: 10,
        // componentSpacing: 40,
        // animate: true
      
        name: 'circle',
        spacingFactor: 2, // Fattore di scala (maggiore = più spazio tra i nodi)
        padding: 30,
        animate: true,
        animationDuration: 500 // ms
        
        // name: 'random'
      }
    },

    styles : {
      default : [],

      hierarchy : [
        {
          selector: 'node',
          style: {
            'width': 100,               // Aumenta la larghezza del nodo (default: 30)
            'height': 100,              // Aumenta l'altezza del nodo (default: 30
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#000',
            'background-color': '#CDEBB7',
            'font-size': '12px',
            'text-wrap': 'wrap',
            'text-max-width': '100px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#8DD15C',
            'target-arrow-color': '#8DD15C',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],

      graph : [
        {
          selector: 'node',
          style: {
            'width': 100,               // Aumenta la larghezza del nodo (default: 30)
            'height': 100,              // Aumenta l'altezza del nodo (default: 30
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#000',
            'background-color': '#94BCEB',
            'font-size': '12px',
            'text-wrap': 'wrap',
            'text-max-width': '100px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#558CF1'
          }
        }
      ]
    }
  }

  hstyle (hierarchy = [], config = {}) {
    AQNGraphs.styleHierarchy(this._cy,hierarchy,config);
    return this;
  }

  gstyle (objLinks = {}, config = {}) { // TODO: parola "link" sostituita da "edge"?
    AQNGraphs.styleGraph(this._cy,objLinks,config);
    return this;
  }
  
  /**
   * Colora gli archi e i nodi in base alla gerarchia e modifica la forma di radice e foglia.
   * @param {Object} cy - L'istanza del grafo Cytoscape.
   * @param {Array} hierarchy - Un array che rappresenta la gerarchia [radice, ..., foglia].
   */
  static styleHierarchy(cy, hierarchy = [], config = {}) {
    const { 
            rootShape = 'round-pentagon',
            leafShape = 'round-diamond',
            intermediateShape = 'ellipse',
            rootSize = 100,
            leafSize = 120,
            intermediateSize = 90,
            baseColorRed = 255,
            baseColorGreen = 204,
            baseColorBlue = 204,
            gradientStart = 235,
            gradientRedStart = 255,
            gradientGreenStart = 255,
            gradientBlueStart = 255,
            gradientOffset = 150,
            gradientRed = true,
            gradientGreen = false,
            gradientBlue = false
          } = config;

    // Colori gradiente
    const baseColor = `rgb(${baseColorRed}, ${baseColorGreen}, ${baseColorBlue})`;
    const colors = [];
    const numSteps = hierarchy.length;
    for (let i = 1; i < numSteps; i++) {
      const intensity = Math.floor(gradientStart - (i * gradientOffset) / numSteps);
      colors.push(`rgb(${gradientRed ? gradientRedStart : intensity}, ${gradientGreen ? gradientGreenStart : intensity}, ${gradientBlue ? gradientBlueStart : intensity})`);
    }

    // Archi
    hierarchy.slice(0, -1).forEach((source, index) => {
      const target = hierarchy[index + 1];
      const color = colors[index];
      cy.getElementById(`${source}${AQNParsing.SEPARATOR}${target}`).style({
        'line-color': color,
        'target-arrow-color': color
      });
    });

    // Nodi
    hierarchy.forEach((node, index) => {
      const size = node === hierarchy[0] ? rootSize : node === hierarchy[hierarchy.length - 1] ? leafSize : intermediateSize;
      const shape = node === hierarchy[0] ? rootShape : node === hierarchy[hierarchy.length - 1] ? leafShape : intermediateShape;
      cy.getElementById(node).style({
        'background-color': baseColor,
        'shape': shape,
        'border-width': 1,
        'border-color': '#ff0000',
        'width': size,
        'height': size
      });
    });
  }


    /**
   * Colora gli archi e i nodi del grafo non diretto in base a un nodo specifico.
   * @param {Object} cy - L'istanza del grafo Cytoscape.
   * @param {Object} objLinks - Un oggetto che contiene gli archi del grafo.
   */
    static styleGraph(cy, objLinks, config = {}) { // TODO: parola "link" sostituita da "edge"?
      const { sourceShape = 'round-pentagon',
              leafShape = 'round-diamond',
              sourceSize = 90,
              leafSize = 110,
              baseColorRed = 255,
              baseColorGreen = 204,
              baseColorBlue = 204,
              gradientStart = 235,
              gradientRedStart = 255,
              gradientGreenStart = 255,
              gradientBlueStart = 255,
              gradientOffset = 150,
              gradientRed = true,
              gradientGreen = false,
              gradientBlue = false
            } = config;
  
      // const title = objLinks.source;
      const links = objLinks.links;

      // Colori gradiente
      const baseColor = `rgb(${baseColorRed}, ${baseColorGreen}, ${baseColorBlue})`;
      const colors = [];
      const numSteps = links.length +1; // +1 per il nodo title
      for (let i = 1; i < numSteps; i++) {
        const intensity = Math.floor(gradientStart - (i * gradientOffset) / numSteps);
        colors.push(`rgb(${gradientRed ? gradientRedStart : intensity}, ${gradientGreen ? gradientGreenStart : intensity}, ${gradientBlue ? gradientBlueStart : intensity})`);
      }
  
      // Archi
      const source = objLinks.source;// title;
      links.forEach((target, index) => {
        // const collegamento = title < target ? `${title}${AQNParsing.SEPARATOR}${target}` : `${target}${AQNParsing.SEPARATOR}${title}`;
        const collegamento = `${source}${AQNParsing.SEPARATOR}${target}`;
        const color = colors[index];
        cy.getElementById(collegamento).style({
          'line-color': color
        });
      });
  
      // Nodi
      [source, ...links].forEach((node, index) => {
        const size = index == 0 ? sourceSize : leafSize;
        const shape = index == 0 ? sourceShape : leafShape;
        cy.getElementById(node).style({
          'background-color': baseColor,
          'shape': shape,
          'border-width': 1,
          'border-color': '#ff0000',
          'width': size,
          'height': size
        });
      });
    }
}