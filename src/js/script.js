/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */



(function() {
  window.addEventListener("load", function() {


    AQNSetting.init();


    const toggleAllButton = document.getElementById('toggleAllButton');
    const header = document.getElementById('header');
    const inputText = document.getElementById('markdownInput');
    const questionsContainer = document.getElementById('questionsContainer');
    const generateButton = document.getElementById('generateButton');
    const optionsButton = document.getElementById('optionsButton');
    const markdownInput = document.getElementById('markdownInput');
    const questionsBox = document.getElementById('questionsBox');
    const menuBtns = document.getElementById('menuBtns');
    const graphBoxContainer = document.getElementById('graphBoxContainer');
    const hierarchyBox = document.getElementById('hierarchyBox');
    const graphBox = document.getElementById('graphBox');

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const scrollBottomBtn = document.getElementById('scrollBottomBtn');
    const QuestionsBtn = document.getElementById('QuestionsBtn');

    const hierarchyBtn = document.getElementById('hierarchyBtn');
    const graphBtn = document.getElementById('graphBtn');



    const datas = [];

    let hierarchyHighlighted = [];
    let graphHighlighted = [];


    const hcy = new AQNGraphs({ defaults: 'hierarchy',
                                container: hierarchyBox,
                                listeners: [{eventType: 'tap', selector: 'node', handler: handleNodeClick}]
                              });
    const gcy = new AQNGraphs({ defaults: 'graph',
                                container: graphBox,
                                listeners: [{eventType: 'tap', selector: 'node', handler: handleNodeClick}]
                              });





    /**
     * Commuta tutte le risposte in visibili o nascoste al click del pulsante "Toggle All".
     */
    toggleAllButton.addEventListener('click', () => {
      if (toggleAllButton.disabled) return;

      const questionBodies = document.querySelectorAll('.question-body');
      const allVisible = questionsBox.dataset.allVisible === 'true';

      questionBodies.forEach(body => {
          body.style.display = allVisible ? 'none' : 'flex';
      });
      questionsBox.dataset.allVisible = allVisible ? 'false' : 'true';
  });




  function getElesHierarchyByData (data) {
    const hierarchyElements = [];
    data.hierarchyNodes.forEach((node) => {
      hierarchyElements.push({ data: { id: node.data.id, label: node.data.label } });
    });

    data.hierarchyEdges.forEach((edge) => {
      hierarchyElements.push({
                              data: {
                                id: edge.data.id,
                                source: edge.data.source,
                                target: edge.data.target
                              }
                            });
    });

    return hierarchyElements;
  }

  function getElesGraphByData (data) {
    const graphElements = [];
    data.nodes.forEach((node) => {
      graphElements.push({ data: { id: node.data.id, label: node.data.label } });
    });

    data.edges.forEach((edge) => {
      graphElements.push({
                          data: {
                            id: edge.data.id,
                            source: edge.data.source,
                            target: edge.data.target
                          }
                        });
    });

    return graphElements;
  }






    /**
       * Genera le domande al click del pulsante "Generate Questions".
       */
    generateButton.addEventListener('click', () => {
      
      if (generateButton.dataset.generate === 'false') {

        datas.splice(0, datas.length); // TODO: aggiungere feature per gestire più documenti
        const text = inputText.value;
        const data = AQNParser.parse(text);
    
        if (data.blocks.length > 0) {
          datas.push(data);
        }
        console.log(data);
        // document.data = data; // DEBUG

        hierarchyClickHandler(data);
        graphClickHandler(data);


        questionsBox.dataset.allVisible = 'false';
        toggleAllButton.disabled = false;
        toggleAllButton.classList.remove('button-fade');
        menuBtns.classList.remove('button-fade');

        // modifica la disposizione flex dell'header
        header.style.flexDirection = 'row';
        header.style.alignItems = 'center';

        // nasconde l'area di testo markdown
        markdownInput.style.display = 'none';

        // nasconde il pulsante di generazione
        generateButton.textContent = 'Modify';
        generateButton.style.width = 'var(--button-width)';
        generateButton.dataset.generate = 'true';

        optionsButton.style.width = 'var(--button-width)';
        optionsButton.style.margin = '0 14px 0 auto';

        // rende visibile la lista di domande
        questionsContainer.classList.remove('fade');

        // rende visibile i grafi
        graphBoxContainer.classList.remove('fade');

        // cancella le domande precedenti
        questionsContainer.innerHTML = '';


    /*
      TEMPLATE DI UN BLOCCO:

        ## TITOLO DEL BLOCCO                      // il titolo deve essere sempre presente
        [[#ROOT]] > [[#NODO_1]] > [[#NODO_2]]     // la gerarchia dei nodi deve essere sempre presente (almeno la radice)
        $FORMULA IN LATEX$                        // la formula è opzionale, se è assente il valore di default è "$-$"
        ![[PATH DI UNA IMMAGINE]]                 // il path dell'immagine è opzionale, se è assente il valore di defaultiore "![[]]"
        TESTO DEL BLOCCO                          // il testo del block deve essere sempre presente

      TEMPLATE DEI LINK NELLA GERARCHIA E ALL'INTERNO DEL TESTO DEL BLOCCO (gli spazi nel path link sono sostituiti con underscore):
        [[#PATH LINK]]            --->   <a href="#PATH_LINK">PATH LINK</a>
        [CONTENUTO](#PATH LINK)   --->   <a href="#PATH_LINK">CONTENUTO</a>
    */


        data.blocks.filter(block => !block.error).forEach((block, index) => {
          // crea il div per la domanda
          const questionDiv = document.createElement('div');
          questionDiv.classList.add('question');
          questionDiv.id = block.id;

            // il titolo corrisponde alla domanda
            const questionTitle = document.createElement('div');
            questionTitle.classList.add('question-title');

            const questionTitleContent = document.createElement('div');
            questionTitleContent.classList.add('question-title-content');
            questionTitleContent.innerHTML = block.label;
            questionTitle.appendChild(questionTitleContent);

            // box icone
            const iconBox = document.createElement('div');
            iconBox.classList.add('icon-box');
            questionTitle.appendChild(iconBox);

            // l'icona per la gerarchia
            const hierarchyIcon = document.createElement('img');
            hierarchyIcon.classList.add('hierarchy-icon');
            hierarchyIcon.src = 'img/hierarchy-icon.png';
            hierarchyIcon.alt = 'Hierarchy';
            // hierarchyIcon.dataset.title = block.label;
            hierarchyIcon.dataset.hierarchy = block.hierarchy.nodes.map(node => node.data.id).join(AQNParsing.SEPARATOR);
            if (block.id == AQNParsing.labelToId(AQNParsing.FOOTNOTE_LABEL) || block.hierarchy.nodes.length === 1) { //? la radice corrisponde al nodo foglia
              hierarchyIcon.classList.add('icon-disabled');
            }
            const hierarchyLink = document.createElement('a');
            hierarchyLink.classList.add('icon-link');
            hierarchyLink.appendChild(hierarchyIcon);
            iconBox.appendChild(hierarchyLink);

            // l'icona per il grafo non diretto
            const graphIcon = document.createElement('img');
            graphIcon.classList.add('graph-icon');
            graphIcon.src = 'img/graph-icon.png';
            graphIcon.alt = 'Undirected graph';
            graphIcon.dataset.source = block.id;
            graphIcon.dataset.links = block.links.map(link => link.data.id).join(AQNParsing.SEPARATOR);
            if (block.id == AQNParsing.labelToId(AQNParsing.FOOTNOTE_LABEL)) {
              graphIcon.classList.add('icon-disabled');
            }
            const graphLink = document.createElement('a');
            graphLink.classList.add('icon-link');
            graphLink.appendChild(graphIcon);
            iconBox.appendChild(graphLink);
            

            // crea il menu della gerarchia
            const hierarchyMenu = document.createElement('div');
            hierarchyMenu.classList.add('hierarchy-menu');
            hierarchyMenu.innerHTML = block.hierarchy.nodes
                                        .slice(0, -1) //? la foglia corrisponde all'etichetta, non viene mostrata
                                          .map((node, i) => `<a href="#${node.data.id}">${node.data.label}</a>`)
                                            .join(' → ');
            if (block.hierarchy.nodes.length === 1) { //? la radice corrisponde al nodo foglia
              hierarchyMenu.style.display = 'none';
            }

            // il paragrafo per la formula
            const formulaParagraph = document.createElement('p');
            formulaParagraph.classList.add('formula');
            formulaParagraph.innerHTML = block.symbol.HTML;
            if (block.symbol.plain === "") {
              formulaParagraph.style.display = 'none';
            }

            // l'immagine
            const image = document.createElement('img');
            image.classList.add('block-image');
            image.src = block.image.path;
            image.alt = block.image.alt || `Immagine per ${block.label}`;
            if (block.image.path === "") {
              image.style.display = 'none';
            }

            // contiene tutte le informazioni della risposta
            const questionBody = document.createElement('div');
            questionBody.classList.add('question-body');

            // il testo corrispondente alla risposta
            const questionText = document.createElement('div');
            questionText.innerHTML = block.content.HTML;


          // al click del titolo viene commutata la visibilità della risposta
          questionTitle.addEventListener('click', (event) => {
            // se la classe del target contiene il prefisso "question-title" allora esegue la funzione
            if ([...event.target.classList].some(c => c.startsWith('question-title'))) {
              questionBody.style.display = questionBody.style.display === 'flex' ? 'none' : 'flex';
            } else {
              if (event.target.classList.contains('hierarchy-icon')) {
                hierarchyHighlighted.push(event.target.dataset.hierarchy.split(AQNParsing.SEPARATOR));
                hierarchyBtn.click();
              } else if (event.target.classList.contains('graph-icon')) {
                graphHighlighted.push({source: event.target.dataset.source,
                                        links: event.target.dataset.links.split(AQNParsing.SEPARATOR)});
                graphBtn.click();
              }
            }
          });

          questionDiv.appendChild(questionTitle);
          questionBody.appendChild(hierarchyMenu);
          if (block.hierarchy.nodes.length > 1) {
            questionBody.appendChild(document.createElement('hr'));
          }
          questionBody.appendChild(formulaParagraph);
          questionBody.appendChild(image);
          questionBody.appendChild(questionText);
          questionDiv.appendChild(questionBody);
          questionsContainer.appendChild(questionDiv);

          anchorClickHandler();
        });


        // Canvas --------------------------------------------------------------------

        hcy.elements(getElesHierarchyByData(data));

        gcy.elements(getElesGraphByData(data));

        if (graphBoxContainer && graphBoxContainer.style.display === 'block') {
          if (hierarchyBox && hierarchyBox.style.display === 'block') {
            hcy.build();
          } else {
            gcy.build();
          }
        }


        // requestAnimationFrame(() => { //! preferibile ma non funziona
        //   AQNUtils.returnToTop();
        // });
        setTimeout(AQNUtils.returnToTop, 100); //! non elegante

        
        //! risolve il bug highlight "codice senza nome del linguaggio"
        const codeBlocks = document.getElementsByTagName('code');
        for (const codeBlock of codeBlocks) {
          codeBlock.classList.add('hljs');
        }

      } else {
        toggleAllButton.disabled = true;
        toggleAllButton.classList.add('button-fade');
        menuBtns.classList.add('button-fade');

        // modifica la disposizione flex dell'header
        header.style.flexDirection = 'column';
        header.style.alignItems = 'unset';

        // mostra l'area di testo e resetta il bottone
        markdownInput.style.display = 'block';
        generateButton.textContent = 'Generate Questions';
        generateButton.style.width = '98%';
        generateButton.dataset.generate = 'false';

        optionsButton.style.width = '98%';
        optionsButton.style.margin = '0 10px';
        
        // rende opaca la lista di domande
        questionsContainer.classList.add('fade');

        graphBoxContainer.classList.add('fade');
      }
    });





    /**
     * Torna all'inizio della pagina al click del pulsante "Torna su".
     */
    scrollTopBtn.addEventListener('click', () => {
      AQNUtils.returnToTop();
    });

    /**
     * Torna all'inizio della pagina al click del pulsante "Torna su".
     */
    scrollBottomBtn.addEventListener('click', () => {
      AQNUtils.returnToBottom();
    });


    /**
     * Gestisce il click su un link che punta ad un ancoraggio (ad es. <a href="#foo">) e
     * fa scrollare la pagina fino a quel punto. Lo fa in modo "smooth" e tiene conto
     * dell'altezza del menu fisso.
     */
    function anchorClickHandler() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            scrollToElement(targetElement);
          }
        });
      });
    }


    function scrollToElement (targetElement) {
      // TODO: offset dovrebbe essere calcolato dinamicamente (in style.css è usato --menu-height in rem)
      const offset = 110; // Altezza del menu fisso

      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }


    let hierarchyClickFunction = null;
    function hierarchyClickHandler(data) {
      // se hierarchyClickFunction non è null allora la funzione è già stata assegnata e deve essere rimossa
      if (hierarchyClickFunction && hierarchyClickFunction instanceof Function) {
        hierarchyBtn.removeEventListener('click', hierarchyClickFunction);
      }

      hierarchyClickFunction = (event) => {
        if (generateButton.dataset.generate === 'true') {
          scrollTopBtn.style.display = 'none';
          scrollBottomBtn.style.display = 'none';
          QuestionsBtn.style.display = 'block';

          graphBoxContainer.style.display = 'block';
          hierarchyBox.style.display = 'block';
          graphBox.style.display     = 'none';
          questionsBox.style.display = 'none';

          hcy.elements(getElesHierarchyByData(data)).buildIfNotSetted().buildIfReDone();

          hierarchyHighlighted.forEach((nodes, index) => {
            hcy.hstyle(nodes);
          });
          if (hierarchyHighlighted.length > 0) {
            hcy.cyReDone(true);
            hierarchyHighlighted = [];
          }
          
          toggleAllButton.disabled = true;
          toggleAllButton.classList.add('button-fade');
        }
      }
      
      hierarchyBtn.addEventListener('click', hierarchyClickFunction);
    }



    let graphClickFunction = null;
    function graphClickHandler(data) {
      // se graphClickFunction non è null allora la funzione è già stata assegnata e deve essere rimossa
      if (graphClickFunction && graphClickFunction instanceof Function) {
        graphBtn.removeEventListener('click', graphClickFunction);
      }

      graphClickFunction = (event) => {
        if (generateButton.dataset.generate === 'true') {
          scrollTopBtn.style.display = 'none';
          scrollBottomBtn.style.display = 'none';
          QuestionsBtn.style.display = 'block';

          graphBoxContainer.style.display = 'block';
          hierarchyBox.style.display = 'none';
          graphBox.style.display     = 'block';
          questionsBox.style.display = 'none';

          gcy.elements(getElesGraphByData(data)).buildIfNotSetted().buildIfReDone();

          graphHighlighted.forEach((obj, index) => {
            gcy.gstyle(obj);
          });
          if (graphHighlighted.length > 0) {
            gcy.cyReDone(true);
            graphHighlighted = [];
          }
          
          toggleAllButton.disabled = true;
          toggleAllButton.classList.add('button-fade');
        }
      }

      graphBtn.addEventListener('click', graphClickFunction);
    }



    QuestionsBtn.addEventListener('click', (event) => {
      if (generateButton.dataset.generate === 'true') {
        scrollTopBtn.style.display = 'block';
        scrollBottomBtn.style.display = 'block';
        QuestionsBtn.style.display = 'none';

        graphBoxContainer.style.display = 'none';
        hierarchyBox.style.display = 'none';
        graphBox.style.display     = 'none';
        questionsBox.style.display = 'flex';
        
        toggleAllButton.disabled = false;
        toggleAllButton.classList.remove('button-fade');
      }
    });



    window.addEventListener('resize', function() {
      // const winwidth = window.innerWidth;
      // const winHeight = window.innerHeight;

      hcy.resizeCy();
      gcy.resizeCy();
    });



    /**
     * Rimuove la classe "active-target" da tutti gli elementi
     * con classe "box".
     */
    function removeActiveTargetClass() {
      document.querySelectorAll('.question.active-target').forEach((el) => {
        el.classList.remove('active-target');
      });
    }


    /**
     * Gestisce il click su un link e attiva il blocco HTML corrispondente.
     */
    document.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        const hrefSplit = event.target.href.split('#');
        const element = document.getElementById(hrefSplit[hrefSplit.length - 1]);
        if (element) {
          removeActiveTargetClass();
          element.classList.add('active-target');
        }
      } else if (!(event.target instanceof HTMLCanvasElement)) {
        removeActiveTargetClass();
      }
    });


    /**
     * Gestisce il click su un nodo del grafo e scorre fino al blocco HTML corrispondente,
     * attivando anche il link corrispondente.
     * @param {Object} event - L'oggetto event del click
     */
    function handleNodeClick (event) {
      const nodeId = event.target.id(); // ottiene l'id del nodo cliccato
      const element = document.getElementById(nodeId.replace(/[\s]/g, '_')); // cerca l'elemento HTML corrispondente

      if (element) {
        QuestionsBtn.click();

        scrollToElement(element);

        const questionTitle = element.getElementsByClassName('question-title');
        const questionBody = element.getElementsByClassName('question-body');
        if (questionTitle.length > 0 && questionBody.length > 0 && questionBody[0].style.display != "flex") {
          questionTitle[0].click();
        }

        removeActiveTargetClass();

        // aggiunge la classe "active-target" al blocco corrente
        element.classList.add('active-target');
      }
    }




  });
})();