/**
 * AQN - Asked Questions Notes
 * License: MIT
 * Source: https://github.com/JoeFerri/aqn
 * Copyright (c) 2025 Giuseppe Ferri <jfinfoit@gmail.com>
 */




class AQNRegex {
    // divide l'etichetta dai dati
    static regexLabelData = /\s*(#+\s*(.+?)\s*\n+\s*(.+?)\s*\n+\s*---\s*)\s*/gms;

    // trova le keyword nel contenuto
    static regexKeywords = /^\(\(\s*(.+?)\s*\)\)[^\)]|[^\(]\(\(\s*(.+?)\s*\)\)[^\)]|[^\(]\(\(\s*(.+?)\s*\)\)$/g;

    // trova le keyword nel contenuto
    //                               (1)          2    |   3           (4)          5    |   6            (7)
    static regexKeywords2 = /^\(\(\s*(.+?)\s*\)\)([^\)])|([^\(])\(\(\s*(.+?)\s*\)\)([^\)])|([^\(])\(\(\s*(.+?)\s*\)\)$/g;

    // separa i nodi in una gerarchia
    static regexHierarchySeparator = />\s*/;

    // trova un nodo in una gerarchia
    static regexHierarchyNode = /\[\[\s*#(.*)\s*\]\]/;

    // controllo di correttezza della gerarchia
    static regexHierarchyCheck = /[\[#\]>\s]/g;

    // divide le righe nei dati
    static regexLineBreak = /\r?\n/;

    // trova un simbolo in LaTex
    static regexSymbol = /\$\s*(.+)\s*\$/;

    // trova una immagine in Markdown
    static regexImage1 = /!\[\[\s*(.+)\s*\]\]/;

    // trova una immagine in Markdown
    static regexImage2 = /!\[\s*(.+)\s*\]\(\s*(.+)\s*\)/;

    // trova un link in Markdown
    static regexLink1 = /\[\[\s*#(.+?)\s*\]\]/g; //? senza 'g' loop infinite

    // trova un link in Markdown
    static regexLink2 = /\[\s*(.+?)\s*\]\(\s*#(.+?)\s*\)/g; //? senza 'g' loop infinite

    // trova il link alla nota
    static regexFootnoteAnchor = /\[\^(\d+)\]/g;

    // trova il testo e il numero della nota
    static regexFootnote = /\s*\[\^(\d+)\]\:\s*(.+)\s*$/gm;

    // trova la fine del block
    static regexBlockEnd = /^\s*---\s*$/;

    // trova il link all'ancoraggio HTML
    static regexAnchorHTML = /<a href="#(.+?)">/g;
}