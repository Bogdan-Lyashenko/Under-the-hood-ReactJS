var SLIDE = 0;

var W_W = window.innerWidth,
    W_H = window.innerHeight;

var ROOT_PATH = '../images/';

var STEPS = [{
    dir: 'intro',
    subSteps: [
        {name: 'setAndShowSidePanelImg', options: {img: 'intro/modules-src-path.svg', offset: {x:10}}},
        {name: 'resizePanelAndSetImg', options: {img: 'intro/files-scheme.svg'}},
        {name: 'exchangePanelImgs', options: {img: 'intro/modules-per-platform-scheme.svg'}},
        {name: 'resizeAndHideSidePanel', options: {showAllScheme: true}},
        {name: 'showCodeOnSidePanel', options: {id: 'firstCodeExample', offset: {x: 0, y: 0}}},
        'resizeAndHideSidePanel',
        'gotoStep'
    ]
},{
    part: 0,
    overlay: {
        x: 390,
        y: 275,
        w: 850,
        h: 590
    },

    scrollTop: 200,
    scrollLeft: 150,

    partSchemeDefaultPosition: {left: 226, top: 88},
    partSchemeAPosition: {left: 226, top: 104},
    partSchemeBPosition: {left: 226, top: 104},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showHtmlOnSidePanel', options: {id: 'firstZoom', offset: {x: 200, y: 0}}},
        'resizeAndHideSidePanel',
        {name: 'showTextOnSidePanel', options: {id: 'mountingDescription0', offset: {x: 200, y: 200}}},
        'resizeAndHideSidePanel',
        {name: 'showHtmlOnSidePanel', options: {id: 'mountingScheme1Small', offset: {x: 200, y: 200}}},
        'resizeAndHideSidePanel',
        {name: 'showHtmlOnSidePanel', options: {id: 'mountingScheme1Big', offset: {x: 200, y: 200}}},
        'resizeAndHideSidePanel',
        {name: 'showTextOnSidePanel', options: {id: 'jsxToVdom', offset: {x: 200, y: 200}}},
        'resizeAndHideSidePanel',
        {name: 'showIntFactOnSidePanel', options: {id: 'validateDOMNesting', offset: {x: 200, y: 200}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]

}, {
    part: 1,
    overlay: {
        x: 410,
        y: 860,
        w: 1400,
        h: 640
    },

    scrollTop: 800,
    scrollLeft: 150,

    partSchemeDefaultPosition: {left: 251, top: 49},
    partSchemeAPosition: {left: 292, top: 49},
    partSchemeBPosition: {left: 292, top: 78},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showHtmlOnSidePanel', options: {id: 'communicationChannel', offset: {x: 200, y: 100}}},
        'resizeAndHideSidePanel',
        {name: 'showHtmlOnSidePanel', options: {id: 'transaction', offset: {x: 200, y: 100}}},
        'resizeAndHideSidePanel',
        {name: 'showTextOnSidePanel', options: {id: 'transactionsInReact', offset: {x: 200, y: 100}}},
        'resizeAndHideSidePanel',
        {name: 'showCodeOnSidePanel', options: {id: 'transactionCodeExample', offset: {x: 20, y: 20}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 2,
    overlay: {
        x: 300,
        y: 1255,
        w: 1850,
        h: 720
    },

    scrollTop: 1250,
    scrollLeft: 150,

    partSchemeDefaultPosition: {left: 106, top: 11},
    partSchemeAPosition: {left: 127, top: 63},
    partSchemeBPosition: {left: 127, top: 63},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showCodeOnSidePanel', options: {id: 'transactionReactReconcileTransaction', offset: {}}},
        'resizeAndHideSidePanel',
        {name: 'showIntFactOnSidePanel', options: {id: 'reactReconciler', offset: {x: 200, y: 150}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 3,
    overlay: {
        x: 4690,
        y: 990,
        w: 1950,
        h: 700
    },

    scrollTop: 980,
    scrollLeft: 4650,

    partSchemeDefaultPosition: {left: 13, top: 11},
    partSchemeAPosition: {left: 13, top: 125},
    partSchemeBPosition: {left: 13, top: 125},

    subSteps: [
        {name: 'scaleAllSchemeTo', options: {allSchemeWidth: W_W}},
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showTextOnSidePanel', options: {id: 'componentWillMount3', offset: {x: 200, y: 200}}},
        'resizeAndHideSidePanel',
        {name: 'showCodeOnSidePanel', options: {id: 'willUpdate3', offset: {}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 4,
    overlay: {
        x: 6900,
        y: 940,
        w: 1290,
        h: 650
    },

    scrollTop: 936,
    scrollLeft: 6826,

    partSchemeDefaultPosition: {left: 125, top: 105},
    partSchemeAPosition: {left: 126, top: 129},
    partSchemeBPosition: {left: 126, top: 128},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showCodeOnSidePanel', options: {id: 'setHtml4', offset: {x: -100, y: 0}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 5,
    overlay: {
        x: 7650,
        y: 1585,
        w: 1200,
        h: 1600
    },

    scrollTop: 1572,
    scrollLeft: 7503,

    partSchemeDefaultPosition: {left: 205, top: 29},
    partSchemeAPosition: {left: 207, top: 30},
    partSchemeBPosition: {left: 207, top: 30},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showTextOnSidePanel', options: {id: 'detectingDifferences5', offset: {x: 200, y: 150}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 6,
    overlay: {
        x: 8220,
        y: 670,
        w: 998,
        h: 1050
    },

    scrollTop: 630,
    scrollLeft: 7553,

    partSchemeDefaultPosition: {left: 385, top: 18},
    partSchemeAPosition: {left: 238, top: 20},
    partSchemeBPosition: {left: 154, top: 5},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'resizePanelAndSetImg', options: {img: '6/overall-mounting-scheme.svg', offset: {x: 0, y: 150}}},
        'resizeAndHideSidePanel',
        {name: 'showTextOnSidePanel', options: {id: 'mountingScheme6', offset: {x: 100, y: 50}}},
        'showPartA',
        'resizeAndHideSidePanel',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 7,
    overlay: {
        x: 5,
        y: 1340,
        w: 2150,
        h: 1050
    },


    scrollTop: 1333,
    scrollLeft: 0,

    partSchemeDefaultPosition: {left: 13, top: 0},
    partSchemeAPosition: {left: 214, top: 0},
    partSchemeBPosition: {left: 265, top: 350},

    subSteps: [
        {name: 'scaleAllSchemeTo', options: {allSchemeWidth: W_W}},
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        'showPartA',
        {name: 'movePartSchemeAbsoluteTo', options: {left: 202, top: 50}},
        'backToAllScheme',
        'gotoStep'
    ]
},{
    subSteps: [
        'resizeAndShowSidePanel',
        {name: 'launchMovingParts', options: {img: [
            'mounting-c-parts/C-0-mounting-parts.svg',
            'mounting-c-parts/C-1-mounting-parts.svg',
            'mounting-c-parts/C-2-mounting-parts.svg',
            'mounting-c-parts/C-3-mounting-parts.svg',
            'mounting-c-parts/C-4-mounting-parts.svg',
            'mounting-c-parts/C-5-mounting-parts.svg',
            'mounting-c-parts/C-6-mounting-parts.svg',
            'mounting-c-parts/C-7-mounting-parts.svg'
        ]}},
        'resizeAndHideSidePanel',
        {name: 'showHtmlOnSidePanel', options: {id: 'mountingDoneGif', offset: {x: 200, y: 150}}},
        'resizeAndHideSidePanel',
        'gotoStep'
    ]
},{
    part: 8,
    overlay: {
        x: 1520,
        y: 20,
        w: 1400,
        h: 600
    },

    scrollTop: 0,
    scrollLeft: 1470,

    partSchemeDefaultPosition: {left: 47, top: 37},
    partSchemeAPosition: {left: 47, top: 37},
    partSchemeBPosition: {left: 310, top: 106},

    subSteps: [
        {name: 'scaleAllSchemeTo', options: {allSchemeWidth: W_W}},
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showCodeOnSidePanel', options: {id: 'setState8', offset: {}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 9,
    overlay: {
        x: 930,
        y: 5,
        w: 750,
        h: 670
    },

    scrollTop: 0,
    scrollLeft: 780,

    partSchemeDefaultPosition: {left: 201, top: 7},
    partSchemeAPosition: {left: 200, top: 9},
    partSchemeBPosition: {left: 201, top: 7},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        'showPartA',
        {name: 'showCodeOnSidePanel', options: {id: 'fakeEventCode9', offset: {}}},
        'resizeAndHideSidePanel',
        {name: 'showHtmlOnSidePanel', options: {id: 'setState9', offset: {x: 200, y: 100}}},
        'resizeAndHideSidePanel',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 10,
    overlay: {
        x: 2000,
        y: 440,
        w: 2250,
        h: 1100
    },

    scrollTop: 435,
    scrollLeft: 1918,

    partSchemeDefaultPosition: {left: 45, top: 1},
    partSchemeAPosition: {left: 45, top: 36},
    partSchemeBPosition: {left: 105, top: 35},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showCodeOnSidePanel', options: {id: 'nestedTransactions10', offset: {}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 11,
    overlay: {
        x: 4450,
        y: 50,
        w: 1150,
        h: 750
    },

    scrollTop: 37,
    scrollLeft: 4444,

    partSchemeDefaultPosition: {left: 56, top: 29},
    partSchemeAPosition: {left: 56, top: 29},
    partSchemeBPosition: {left: 56, top: 132},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showTextOnSidePanel', options: {id: 'updateMethod11', offset: {x: 200, y: 100}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 12,
    overlay: {
        x: 5500,
        y: 130,
        w: 1450,
        h: 750
    },

    scrollTop: 110,
    scrollLeft: 5418,

    partSchemeDefaultPosition: {left: 73, top: 40},
    partSchemeAPosition: {left: 73, top: 93},
    partSchemeBPosition: {left: 73, top: 93},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showCodeOnSidePanel', options: {id: 'shouldUpdate12', offset: {}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 13,
    overlay: {
        x: 7000,
        y: 1350,
        w: 750,
        h: 390
    },

    scrollTop: 1345,
    scrollLeft: 6910,

    partSchemeDefaultPosition: {left: 98, top: 31},
    partSchemeAPosition: {left: 98, top: 31},
    partSchemeBPosition: {left: 98, top: 31},

    subSteps: [
        {name: 'scaleAllSchemeTo', options: {allSchemeWidth: W_W}},
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    part: 14,
    overlay: {
        x: 6840,
        y: 1645,
        w: 865,
        h: 1350
    },

    scrollTop: 1606,
    scrollLeft: 6744,

    partSchemeDefaultPosition: {left: 120, top: 49},
    partSchemeAPosition: {left: 168, top: 51},
    partSchemeBPosition: {left: 454, top: 49},

    subSteps: [
        'scaleAllSchemeAndScrollToPart',
        'showOverlay',
        'showDefaultPart',
        {name: 'showHtmlOnSidePanel', options: {id: 'updating14', offset: {x: 200, y: 100}}},
        'resizeAndHideSidePanel',
        {name: 'showCodeOnSidePanel', options: {id: 'updateConfig14', offset: {}}},
        'resizeAndHideSidePanel',
        {name: 'showCodeOnSidePanel', options: {id: 'domChildrenOperation14', offset: {}}},
        'resizeAndHideSidePanel',
        'showPartA',
        'backToAllScheme',
        'gotoStep'
    ]
},{
    subSteps: [
        'resizeAndShowSidePanel',
        {name: 'launchMovingParts', options: {img: [
            'updating-c-parts/C-8-updating-parts.svg',
            'updating-c-parts/C-9-updating-parts.svg',
            'updating-c-parts/C-10-updating-parts.svg',
            'updating-c-parts/C-11-updating-parts.svg',
            'updating-c-parts/C-12-updating-parts.svg',
            'updating-c-parts/C-13-updating-parts.svg',
            'updating-c-parts/C-14-updating-parts.svg'

        ]}},
        'resizeAndHideSidePanel',
        {name: 'showHtmlOnSidePanel', options: {id: 'updatingDoneGif', offset: {x: 200, y: 150}}},
        'resizeAndHideSidePanel',
        {name: 'scaleAllSchemeTo', options: {allSchemeWidth: W_W}},
        'gotoStep'
    ]
}];


