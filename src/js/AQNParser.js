/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNParser {

  static parse (text) {
    let match = null;

    let data = new AQNData();

    while ((match = AQNRegex.regexLabelData.exec(text)) !== null) {

      const contentRaw = match[3];

      const block = new AQNBlock(match[2]);

      let state = AQNParserState.HIERARCHY;
      let error = false;
      let errorLine = "";
      let indexLine = -1;

      // parsing sulle righe dei dati
      const contentLines = contentRaw.split(AQNRegex.regexLineBreak).map((line) => line);
      contentLines.forEach((line, index) => {
        let repeatSwitch = true;
        let rindex = index; //? switch viene ripetuto al massimo 2 volte per riga
        while (repeatSwitch && (rindex-2) <= index) {
          // console.table({label: block.label, state, index, rindex, line}); // DEBUG
          repeatSwitch = false;
          rindex++;

          if (line && !error) {
            switch (state) {

              case AQNParserState.HIERARCHY: {
                line = line.trim();
                // if (line[0] !== AQNParsing.HIERARCHY_SEPARATOR) {
                if (!line.startsWith(AQNParsing.HIERARCHY_SEPARATOR)) {
                  block.error = true;
                  block.errorLine = line;
                  block.parseError = AQNParserState.ERROR_HIERARCHY;
                  state = AQNParserState.ERROR_HIERARCHY;
                  error = true;
                  errorLine = line;
                  indexLine = index;
                } else {
                  const hs = [];
                  // estrazione dei nodi della gerarchia
                  if (line.substring(1).trim()) {
                    line.substring(1).split(AQNRegex.regexHierarchySeparator).forEach(node => {
                      const matchNode = node.match(AQNRegex.regexHierarchyNode);
                      const matchLabel = matchNode !== null ? matchNode[1] : "";
                      hs.push(new AQNNode({label: matchLabel}));
                    })
                  }

                  // controllo della correttezza della gerarchia
                  if (line.replace(AQNRegex.regexHierarchyCheck, '') != AQNUtils.noSpace(hs.map(h => h.data.label).join("")) ||
                      AQNUtils.hasDuplicates([block.label, ...hs.map(h => h.data.label)])) {
                    block.error = true;
                    block.errorLine = line;
                    block.parseError = AQNParserState.ERROR_HIERARCHY;
                    state = AQNParserState.ERROR_HIERARCHY;
                    error = true;
                    errorLine = line;
                    indexLine = index;
                  } else {
                      hs.push(new AQNNode({label: block.label, id: block.id}));
                      block.hierarchy = new AQNHierarchy({nodes: hs});

                      state = AQNParserState.SYMBOL;
                    }
                  }
                break;
              }

              case AQNParserState.SYMBOL: {
                const _line = AQNParsing.removeStartLine(line);
                if (_line) {
                  const matchLine = _line.match(AQNRegex.regexSymbol);
                  const matchSymbol = matchLine !== null ? matchLine[1] : "";
                  if (matchSymbol) {
                    if (AQNUtils.noSpace(_line) != AQNUtils.noSpace(`$${matchSymbol}$`)) {
                      block.error = true;
                      block.errorLine = line;
                      block.parseError = AQNParserState.ERROR_SYMBOL;
                      state = AQNParserState.ERROR_SYMBOL;
                      error = true;
                      errorLine = line;
                      indexLine = index;
                    } else {
                      block.symbol.plain = matchSymbol.trim();
                      block.symbol.LaTex = _line;
                      block.symbol.HTML = AQNRendering.renderMathInText(_line);

                      state = AQNParserState.IMAGE;
                    }
                  } else { //? line non è vuota e non contiene un simbolo
                    state = AQNParserState.IMAGE;
                    repeatSwitch = true;
                  }
                }
                break;
              }

              case AQNParserState.IMAGE: {
                const _line = AQNParsing.removeStartLine(line);
                if (_line) {
                  const matchLine = _line.match(AQNRegex.regexImage1);
                  const matchPath = matchLine !== null ? matchLine[1] : "";
                  if (matchPath) {
                    if (AQNUtils.noSpace(_line) != AQNUtils.noSpace(`![[${matchPath}]]`)) {
                      console.error(`1: "${AQNUtils.noSpace(_line)}" != "${AQNUtils.noSpace(`![[${matchPath}]]`)}"`);
                      block.error = true;
                      block.errorLine = line;
                      block.parseError = AQNParserState.ERROR_IMAGE;
                      state = AQNParserState.ERROR_IMAGE;
                      error = true;
                      errorLine = line;
                      indexLine = index;
                    } else {
                      block.image.path = matchPath.trim();
                      block.image.alt = block.label;
                      state = AQNParserState.CONTENT;
                    }
                  } else {
                    const matchLine2 = _line.match(AQNRegex.regexImage2);
                    const matchPath2 = matchLine2 !== null ? matchLine2[2] : "";
                    const matchAlt2 = matchLine2 !== null ? matchLine2[1] : "";
                    if (matchPath2 && matchAlt2) {
                      if (AQNUtils.noSpace(_line) != AQNUtils.noSpace(`![${matchAlt2}](${matchPath2})`)) {
                        console.error(`2: "${AQNUtils.noSpace(_line)}" != "${AQNUtils.noSpace(`![${matchAlt2}](${matchPath2})`)}"`);
                        block.error = true;
                        block.errorLine = line;
                        block.parseError = AQNParserState.ERROR_IMAGE;
                        state = AQNParserState.ERROR_IMAGE;
                        error = true;
                        errorLine = line;
                        indexLine = index;
                      } else {
                        block.image.path = matchPath2.trim();
                        block.image.alt = matchAlt2.trim();
                        state = AQNParserState.CONTENT;
                      }
                    } else {
                      //? line non è vuota e non contiene un immagine
                      state = AQNParserState.CONTENT;
                      repeatSwitch = true;
                    }
                  }
                }
                break;
              }

              case AQNParserState.CONTENT_CODE: {
                if (line && line == "```") {
                  state = AQNParserState.CONTENT;
                }
                block.content.plain += ((block.content.plain ? "\n" : "") + line);
                break;
              }

              case AQNParserState.CONTENT: {

                if (line && line.startsWith("```")) {
                  state = AQNParserState.CONTENT_CODE;
                  block.content.plain += ((block.content.plain ? "\n" : "") + line);
                  break;
                }

                //! ASSERT: non trova la fine del block
                if (AQNRegex.regexBlockEnd.test(line)) {
                  state = AQNParserState.BLOCK_END;
                  console.error(`fine block ${block.label}`);
                  break;
                }

                line = AQNParsing.removeStartLine(line);

                block.content.plain += ((block.content.plain ? "\n" : "") + line);

                let matchKeyword = null;

                let keyword = null;
                while ((matchKeyword = AQNRegex.regexKeywords.exec(line)) !== null) {
                  keyword = matchKeyword[1];
                  if (keyword) {
                    let labelKeyword = keyword;
                    let matchKeyLink = AQNRegex.regexLink1.exec(keyword);
                    let addLink = false;
                    let addKey = false;
                    if (matchKeyLink !== null) {
                      labelKeyword = matchKeyLink[1];
                      addLink = true;
                    } else {
                      matchKeyLink = AQNRegex.regexLink2.exec(keyword);
                      if (matchKeyLink !== null) {
                        labelKeyword = matchKeyLink[1];
                        addLink = true;
                      }
                    }
                    if (!block.keywords.some(k => k.data.id == AQNParsing.labelToId(labelKeyword))) {
                      addKey = true;
                    }

                    let node = null;
                    let edge = null;
                    if (addLink || addKey) {
                      node = new AQNNode({label: labelKeyword, raw: keyword});
                      edge = new AQNEdge({source: block.id, target: node.data.id});
                    }

                    if (addKey) {
                      block.keywords.push(node);
                      block.keywordsEdges.push(edge);
                    }

                    if (addLink) {
                      if (!block.links.some(l => l.equals(node))) {
                        block.links.push(node);
                      }
                      if (!block.linksEdges.some(e => e.equals(edge))) {
                        block.linksEdges.push(edge);
                      }
                    }
                  }
                }

                let matchContentLink = null;

                while ((matchContentLink = AQNRegex.regexLink1.exec(line)) !== null) {
                  let labelLink = matchContentLink[1];
                  if (!block.links.some(l => l.data.label == labelLink)) {
                    let nodeLink = new AQNNode({label: labelLink});
                    block.links.push(nodeLink);
                    block.linksEdges.push(new AQNEdge({source: block.id, target: nodeLink.data.id}));
                  }
                }

                while ((matchContentLink = AQNRegex.regexLink2.exec(line)) !== null) {
                  let labelLink = matchContentLink[2];
                  if (!block.links.some(l => l.data.label == labelLink)) {
                    let nodeLink = new AQNNode({label: labelLink});
                    block.links.push(nodeLink);
                    block.linksEdges.push(new AQNEdge({source: block.id, target: nodeLink.data.id}));
                  }
                }

                let matchFootnote = null;

                while ((matchFootnote = AQNRegex.regexFootnoteAnchor.exec(line)) !== null) {
                  if (!block.footnotes.anchors.includes(matchFootnote[1])) {
                    block.footnotes.anchors.push(matchFootnote[1]);
                  }
                }

                while ((matchFootnote = AQNRegex.regexFootnote.exec(line)) !== null) {
                  let footnoteAnchor = matchFootnote[1];
                  let footnoteDescription = matchFootnote[2];
                  if (!block.footnotes.notes.map(note => note.anchor).includes(footnoteAnchor)) {
                    block.footnotes.notes.push(new AQNFootnote({anchor: footnoteAnchor, description: footnoteDescription}));
                  }
                }

                break;
              } // case
            }
          }
        }
      });

      switch (state) {
        case AQNParserState.ERROR_HIERARCHY:
          console.error(`Error in line ${indexLine}: ${errorLine}\n`);
          break;
        case AQNParserState.ERROR_SYMBOL:
          console.error(`Error in line ${indexLine}: ${errorLine}`);
          break;
        case AQNParserState.ERROR_IMAGE:
          console.error(`Error in line ${indexLine}: ${errorLine}`);
          break;
        case AQNParserState.ERROR_FOOTNOTE:
          console.error(`Error in line ${indexLine}: ${errorLine}`);
          break;
        case AQNParserState.ERROR_KEYWORD:
          console.error(`Error in line ${indexLine}: ${errorLine}`);
          break;
        case AQNParserState.ERROR_CONTENT:
          console.error(`Error in line ${indexLine}: ${errorLine}`);
          break;
      }

      block.content.HTML =  marked.parse(
                              block.content.plain
                                    .replace(AQNRegex.regexLink1, (match, p1) => {
                                      return ` <a href="#${AQNParsing.labelToId(p1)}">${p1}</a> `;
                                    })
                                      .replace(AQNRegex.regexFootnote, (match, p1, p2) => {
                                        return ` <p id="footnote${p1}" class="footnote"><sup class="footnote">${p1}</sup> <span class="footnote-text">${p2}</span></p>`;
                                      })
                                        .replace(AQNRegex.regexFootnoteAnchor, (match, p1) => {
                                          return `<a href="#footnote${p1}"><sup class="footnote">${p1}</sup></a> `;
                                        })
                            )
                              .replace(AQNRegex.regexAnchorHTML, (match, p1) => {
                                return ` <a href="#${AQNParsing.labelToId(p1)}">`;
                              })
                                .replace(AQNRegex.regexKeywords, (match, p1) => {
                                  return ` <span class="keyword">${p1}</span> `;
                                })


      data.blocks.push(block);
    }


    // __________________________________________________________________________________________
    // popolazione dei dati generali (mantiene i riferimenti, non effettua copie di nodi e archi)

    data.blocks.filter(block => !block.error).forEach(block => {

      // gerarchie
      if (!data.hierarchies.some(h => h.equals(block.hierarchy))) {
        data.hierarchies.push(block.hierarchy);
        const hedge = block.hierarchy.edges.length > 0 ? block.hierarchy.edges[block.hierarchy.edges.length - 1] : null;
        if (hedge && !data.hierarchyLastEdges.some(e => e.equals(hedge))) {
          data.hierarchyLastEdges.push(hedge);
        }

        block.hierarchy.edges.forEach(edge => {
          if (!data.hierarchyEdges.some(e => e.equals(edge))) {
            data.hierarchyEdges.push(edge);
          }
        });

        block.hierarchy.nodes.forEach(node => {
          if (!data.nodes.some(n => n.equals(node))) {
            data.nodes.push(node);
          }
          if (!data.hierarchyNodes.some(n => n.equals(node))) {
            data.hierarchyNodes.push(node);
          }
        });
      }

      data.hierarchyLastEdges.forEach(edge => {
        if (!data.edges.some(e => e.equals(edge))) {
          data.edges.push(edge);
        }
      })

      // keywords
      block.keywords.forEach(keyword => {
        if (!data.keywords.some(k => k.equals(keyword))) {
          data.keywords.push(keyword);
        }
      });

      block.keywordsEdges.forEach(keywordEdge => {
        if (!data.keywordsEdges.some(e => e.equals(keywordEdge))) {
          data.keywordsEdges.push(keywordEdge);
        }
      });

      // links
      block.links.forEach(link => {
        if (!data.nodes.some(n => n.equals(link))) {
          data.nodes.push(link);
        }
      });

      block.linksEdges.forEach(linkEdge => {
        if (!data.edges.some(e => e.equals(linkEdge))) {
          data.edges.push(linkEdge);
        }
      });

      // footnotes
      block.footnotes.notes.forEach(note => {
        if (!data.footnotes.some(f => f.equals(note))) {
          data.footnotes.push(note);
        }
      });

    });

    return data;
  }

}