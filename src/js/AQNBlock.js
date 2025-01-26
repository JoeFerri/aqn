/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNBlock {
  
  constructor(label) {
    // TODO: inserire controllo <label,hierarchy> univoco
    this.label = label;

    this.id = AQNParsing.labelToId(label);

    this.hierarchy = null;   // type: Hierarchy
    
    this.symbol= {
      plain: "",
      LaTex: "",
      HTML: ""
    };
    this.image = {
      path: "",
      alt: ""
    };
    this.footnotes = {
      anchors: [],            // type: int[]
      notes: []               // type: AQNFootnote[]
    };
    this.keywords = [];       // type: AQNNode[]
    this.keywordsEdges = [];  // type: AQNEdge[]
    this.links = [];          // type: AQNNode[]
    this.linksEdges = [];     // type: AQNEdge[]

    this.content = {
      plain: "",
      HTML: ""
    };

    this.error = false;
    this.errorLine = "";
    this.parseError = null;   // type: AQNParserState
  }
}