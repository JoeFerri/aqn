/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




/**
 * Rappresentazione di una gerarchia.
 * La gerarchia ha sempre almeno un nodo radice ed un nodo foglia.
 * Se la riga non ha nodi, radice e foglia coincidono nell'etichetta.
 * L'etichetta &egrave; sempre il nodo foglia.
 * 
 * @class
 * @param {Object} [param0={}] - Parametri opzionali
 * @param {AQNNode} [param0.root] - Nodo radice della gerarchia
 * @param {AQNNode} [param0.leaf] - Nodo foglia della gerarchia
 * @param {Array<AQNNode>} [param0.nodes] - Nodi della gerarchia
 * @param {Array<AQNEdge>} [param0.edges] - Archi della gerarchia
 * @returns {AQNHierarchy} - L'oggetto gerarchia
 */
class AQNHierarchy {
  constructor ({root, leaf, nodes, edges} = {nodes: []}) {
    if (!edges) {
      edges = [];
      // creazione degli archi diretti
      for (let i = 0; i < nodes.length - 1; i++) {
        edges.push(new AQNEdge({source: nodes[i].data.id, target: nodes[i + 1].data.id}));
      }
    }
    
    this.root = root || nodes[0];
    this.leaf = leaf || nodes[nodes.length - 1];
    this.nodes = nodes;
    this.edges = edges;

    if (!this.root instanceof AQNNode) {
      console.error('root is not a AQNNode');
      console.error(this.root);
    }

    if (!this.leaf instanceof AQNNode) {
      console.error('leaf is not a AQNNode');
      console.error(this.leaf);
    }

    for (let i = 0; i < this.nodes.length; i++) {
      if (!this.nodes[i] instanceof AQNNode) {
        console.error(`nodes[${i}] is not a AQNNode`);
        console.error(this.nodes[i]);
      }
    }

    for (let i = 0; i < this.edges.length; i++) {
      if (!this.edges[i] instanceof AQNEdge) {
        console.error(`edges[${i}] is not a AQNEdge`);
        console.error(this.edges[i]);
      } 
    }
  }

  equals (other) {
    return (
      other instanceof AQNHierarchy &&
      this.root.data.id === other.root.data.id &&
      this.leaf.data.id === other.leaf.data.id &&
      this.nodes.length === other.nodes.length &&
      this.edges.length === other.edges.length &&
      this.nodes.every((node, index) => node.equals(other.nodes[index])) &&
      this.edges.every((edge, index) => edge.equals(other.edges[index]))
    );
  };

  toString () {
    return `(${this.nodes.map(node => node.data.label || node.data.id).join(' ---> ')})`;
  }
}