//Do not read the cole below
//it will be re-written from the scratch
//now it just 'work' due to lack of time
(function () {
    var ALL_PARTS_WIDTH = 9173 + 50, ALL_PARTS_HEIGHT = 3137 + 50;

    var W_W = window.innerWidth,
        W_H = window.innerHeight;

    var MAX_STEP = 17,
        MAX_SUB_STEP = 4;

    var SLIDE_PANEL_WIDTH = 500;

    //display none for part img parent, fix scroll
    window.presentationAppReactUnderHood = {
        init: function () {
            this.currentSchemeStep = 0;
            this.currentSchemeSubStep = -1;
            this.isActingDone = true;

            this.initView();
            this.initEventsListeners();
        },

        initView: function() {
            this.view = {
                controls: document.getElementById('controls'),
                nextAction: document.getElementById('nextAction'),

                parentAllScheme: document.getElementById('parent-all-scheme'),
                imgAllScheme: document.getElementById('img-all-scheme'),

                parentPartScheme: document.getElementById('parent-part-scheme'),
                imgPartScheme: document.getElementById('img-part-scheme'),
                imgPartSchemeA: document.getElementById('img-part-scheme-a'),
                imgPartSchemeB: document.getElementById('img-part-scheme-b'),

                overlayPieceLeft: document.getElementById('overlay-piece-left'),
                overlayPieceTop: document.getElementById('overlay-piece-top'),
                overlayPieceRight: document.getElementById('overlay-piece-right'),
                overlayPieceBottom: document.getElementById('overlay-piece-bottom'),
                overlayBorderRect: document.getElementById('overlay-border-rect'),
                overlaysParent: document.getElementById('overlays-parent'),

                slidePanel: document.getElementById('slide-panel'),
                slideContent: document.getElementById('slide-content'),
                slideImgScheme: document.getElementById('slide-img-scheme'),
                htmlBlock: document.getElementById('html-block')
            }

        },

        initEventsListeners: function() {
            this.view.nextAction.addEventListener('click',  (e) => {
                if (!this.isActingDone) return;

                this.gotoSubStep(this.currentSchemeSubStep + 1);
            });

            this.view.controls.addEventListener('click',  (e) => {
                var actionStep = e.target.getAttribute('data-action-step');
                if (typeof actionStep === 'undefined') return;
                if (!this.isActingDone) return;

                this.highlightStep(+actionStep);

                this.hidePrevStepSideEffects().then(()=> {
                    this.gotoStep(+actionStep);
                });
            });

            document.body.addEventListener('keydown', (e) => {
                if (!this.isActingDone) return;

                switch (e.keyCode) {
                    case 78:
                        //n, next
                        return;// this.gotoStep(this.currentSchemeStep + 1);
                    case 80:
                        //p, prev
                        return;// this.gotoStep(this.currentSchemeStep - 1);
                    case 83:
                        //substep
                        return this.gotoSubStep(this.currentSchemeSubStep + 1);
                }
            });
        },

        gotoStep: function (actionStep = 0) {
            this.currentSchemeStep = actionStep;

            if (this.currentSchemeStep > MAX_STEP) {
                console.log('end!');
                return;
            }

            this.highlightStep(this.currentSchemeStep);

            this.gotoSubStep(0);
        },

        gotoSubStep: function (actionStep = 0) {
            this.currentSchemeSubStep = actionStep;
            this.isActingDone = false;

            this.handleSchemeSubStepAct();
        },

        highlightStep: function (currentSchemeStep) {
            var button;

            for (var i = 0; i< MAX_STEP; i++) {
                button = this.getControlsButton(i);
                button.style.background = '#272822';
            }

            button = this.getControlsButton(currentSchemeStep);
            button.style.background = '#24a8d0';
        },

        getControlsButton: function (step) {
            return this.view.controls.querySelector('[data-action-step="'+step+'"]')
        },

        getInnerHtmlOfTemplate: function (id) {
            var template = document.getElementById(id);
            if (!template) return new Error('Element is not foudd', id);

            return template.innerHTML;
        },

        showIntFactOnSidePanel: function (part, options) {
            var content = '<div class="intFactBlock"><b>&lt;interesting fact&gt;</b>' +
                this.getInnerHtmlOfTemplate(options.id)
                + '<b>&lt;/interesting fact&gt;</b></div>';

            return this.setAndShowContentOnSlidePanel(content, options);
        },

        showTextOnSidePanel: function (part, options) {
            var content = '<div class="textBlock">'+
                this.getInnerHtmlOfTemplate(options.id)
            + '</div>';

            return this.setAndShowContentOnSlidePanel(content, options);
        },

        showCodeOnSidePanel: function (part, options) {
            var content = '<pre class="codeBlock">'+
                this.getInnerHtmlOfTemplate(options.id)
                + '</pre>';

            return this.setAndShowContentOnSlidePanel(content, options);
        },

        showHtmlOnSidePanel: function (part, options) {
            var content = this.getInnerHtmlOfTemplate(options.id);

            return this.setAndShowContentOnSlidePanel(content, options);
        },

        setAndShowContentOnSlidePanel: function (content, options) {
            this.showSlidePanel();

            return this.resizeSlidePanelTo().then(()=> {
                this.setSlideContentHtml(content, options.offset);
            }).then(() => {
                this.isActingDone = true;
            });
        },

        setSlideContentHtml: function (html = '', offset={}) {
            this.view.htmlBlock.innerHTML = html;

            this.view.htmlBlock.style.left = (offset.x || 0) + 'px';
            this.view.htmlBlock.style.top = (offset.y || 0) + 'px';
        },

        resizeAndShowSidePanel: function (content, options) {
            this.showSlidePanel();

            return this.resizeSlidePanelTo().then(() => {
                this.isActingDone = true;
            });
        },

        resizeAndHideSidePanel: function (options) {
            this.hideSlidePanel().then(()=> {
                this.setSlideContentHtml();
                this.setSlideContentImg();
            });

            options.showAllScheme && this.showAllSchemeImg();
            return this.resizeSlidePanelTo(SLIDE_PANEL_WIDTH).then(() => {
                this.isActingDone = true;
            });
        },

        launchMovingParts: function (part, options) {
            var img, i,
                dF = document.createDocumentFragment(),
                list = [];

            for (i = 0; i< options.img.length; i++) {
                img = document.createElement('img');
                img.src = ROOT_PATH + options.img[i];
                img.style.position = 'absolute';
                img.style.top = '0px';
                img.style.left = W_W+'px';

                list.push(img);
                dF.appendChild(img);
            }

            this.view.htmlBlock.appendChild(dF);
            return this.moveCPartsToLeft(list).then(()=> {
                this.isActingDone = true;
            });
        },

        movePartSchemeAbsoluteTo: function (part, options) {
            return anime({
                targets: this.view.imgPartSchemeB,

                top: options.top,
                left: options.left,
                duration: 500,

                easing: 'easeInQuad'
            }).finished.then(()=> {
                this.isActingDone = true;
            });
        },

        exchangePanelImgs: function (part, options) {
            return this.hideSlideImg().then(()=> {
                this.setSlideContentImg(options.img, options.offset);
                return this.showSlideImg();
            }).then(() => {
                this.isActingDone = true;
            });
        },

        resizePanelAndSetImg: function (part, options) {
            this.setSlideContentImg();
            this.showSlidePanel();

            return this.resizeSlidePanelTo().then(()=> {
                this.hideAllSchemeImg();
                this.setSlideContentImg(options.img, options.offset);
                return this.showSlideImg();
            }).then(() => {
                this.isActingDone = true;
            });
        },

        setAndShowSidePanelImg: function (part, options) {
            this.setSlideContentImg(options.img, options.offset);
            return this.showSlidePanel().then(() => {
                this.isActingDone = true;
            });
        },

        scrollPartSchemeTo: function (part, options) {
            return this.scrollElementTo(this.view.parentPartScheme, options).then(() => {
                this.isActingDone = true;
            });
        },

        handleSchemeSubStepAct: function () {
            var part = STEPS[this.currentSchemeStep],
                subStep = part.subSteps[this.currentSchemeSubStep],
                name,
                options = {};

            if (typeof subStep === 'string') {
                name = subStep;
            } else {
                name = subStep.name;
                options = subStep.options;
            }

            switch (name) {
                case 'scaleAllSchemeTo':
                    return this.scaleAllSchemeTo(part, options);

                case 'showOverlay':
                    return this.showOverlay(part);

                case 'scaleAllSchemeAndScrollToPart':
                    return this.scaleAllSchemeAndScrollToPart(part);

                case 'showDefaultPart':
                    return this.showDefaultPart(this.currentSchemeStep, part);

                case 'showPartA':
                    return this.showPartA(this.currentSchemeStep, part);

                case 'backToAllScheme':
                    return this.backToAllScheme(part);

                case 'gotoStep':
                    return this.gotoStep(this.currentSchemeStep + 1);
                
                case 'setAndShowSidePanelImg':
                    return this.setAndShowSidePanelImg(part, options);

                case 'resizePanelAndSetImg':
                    return this.resizePanelAndSetImg(part, options);

                case 'exchangePanelImgs':
                    return this.exchangePanelImgs(part, options);

                case 'resizeAndHideSidePanel':
                    return this.resizeAndHideSidePanel(options);

                case 'resizeAndShowSidePanel':
                    return this.resizeAndShowSidePanel(options);

                case 'showIntFactOnSidePanel':
                    return this.showIntFactOnSidePanel(part, options);

                case 'showTextOnSidePanel':
                    return this.showTextOnSidePanel(part, options);

                case 'showCodeOnSidePanel':
                    return this.showCodeOnSidePanel(part, options);

                case 'showHtmlOnSidePanel':
                    return this.showHtmlOnSidePanel(part, options);

                case 'scrollPartSchemeTo':
                    return this.scrollPartSchemeTo(part, options);

                case 'launchMovingParts':
                    return this.launchMovingParts(part, options);

                case 'movePartSchemeAbsoluteTo':
                    return this.movePartSchemeAbsoluteTo(part, options);
            }
        },

        delay: function (delay) {
          return new Promise(resolve => {
              setTimeout(()=> {
                  resolve();
              }, delay);
          });
        },

        scaleAllSchemeTo: function (part, options) {
            return this.scaleAllScheme(options.allSchemeWidth).then(() => {
                this.isActingDone = true;
            });
        },

        showSlideImg: function () {
            return this.setImgVisibility(this.view.slideImgScheme, 1);
        },

        hideSlideImg: function () {
            return this.setImgVisibility(this.view.slideImgScheme, 0);
        },

        setSlideContentImg: function (img,  offset={}) {
            var slideImgScheme = this.view.slideImgScheme;

            slideImgScheme.src = img ? ROOT_PATH + img : '';
            slideImgScheme.style.left = (offset.x || 10) + 'px';
            slideImgScheme.style.top = (offset.y || 10) + 'px';
        },

        showSlidePanel: function (val) {
            this.setDisplayBlock(this.view.slidePanel);
            return this.setBlockVisibility(this.view.slidePanel, val || 1);
        },

        hideSlidePanel: function () {
            return this.setBlockVisibility(this.view.slidePanel, 0).then(()=>{
                this.setDisplayNone(this.view.slidePanel);
            });
        },

        resizeSlidePanelTo: function (width) {
            return anime({
                targets: this.view.slidePanel,

                width: width || W_W,
                duration: 500,

                easing: 'easeInQuad'
            }).finished;
        },

        scaleAllScheme: function (width) {
            return anime({
                targets: this.view.imgAllScheme,

                width: width || ALL_PARTS_WIDTH,
                duration: 500,

                easing: 'easeInQuad'
            }).finished;
        },

        scrollAllSchemeToPart: function (part) {
            return this.scrollElementTo(this.view.parentAllScheme, part);
        },

        scrollElementTo: function (element, position) {
            return anime({
                targets: element,

                scrollLeft: position.scrollLeft,
                scrollTop: position.scrollTop,
                duration: 500,

                easing: 'easeInQuad'
            }).finished;
        },

        showAllSchemeImg: function () {
            return this.setImgVisibility(this.view.imgAllScheme, 1, 1000);
        },

        hideAllSchemeImg: function () {
            return this.setImgVisibility(this.view.imgAllScheme, 0);
        },

        showPartImage(img) {
            return this.setImgVisibility(img, 1);
        },

        hidePartImage(img) {
            return this.setImgVisibility(img, 0);
        },

        hidePartImageParent() {
            this.setDisplayNone(this.view.parentPartScheme);
        },

        showPartImageParent() {
            this.setDisplayBlock(this.view.parentPartScheme);
        },

        setImgVisibility: function (img, opacity, duration) {
            return anime({
                targets: img,
                opacity: opacity,
                duration: duration || 500,
                easing: 'easeInQuad'
            }).finished;
        },

        scaleAllSchemeAndScrollToPart: function (part) {
            this.scaleAllScheme();
            return this.scrollAllSchemeToPart(part).then(() => {
                this.isActingDone = true;
            });
        },

        showOverlay: function (part) {
            return this.setOverlaysAround(this.getOverlayPieceOpt(part)).then(() => {
                this.isActingDone = true;
            });
        },

        showDefaultPart: function (currentSchemeStep, part) {
            var src = ROOT_PATH+ part.part+'/part-' + part.part + '.svg';

            this.hideOverlays();
            this.showPartImageParent();
            this.setPartImage(this.view.imgPartScheme, src, part.partSchemeDefaultPosition);
            this.hideAllSchemeImg();
            return this.showPartImage(this.view.imgPartScheme).then(() => {
                this.isActingDone = true;
            });
        },

        showPartA: function (currentSchemeStep, part) {
            var src = ROOT_PATH+ part.part+'/part-' + part.part + '-A.svg';

            this.hidePartImage(this.view.imgPartScheme);
            this.setPartImage(this.view.imgPartSchemeA, src, part.partSchemeAPosition);
            return this.showPartImage(this.view.imgPartSchemeA).then(()=> {
                return this.delay(2000);
            }).then(() => {
                this.hidePartImage(this.view.imgPartSchemeA);
                this.setPartImage(this.view.imgPartSchemeB, ROOT_PATH+ part.part+'/part-' +  part.part + '-B.svg', part.partSchemeBPosition);
                return this.showPartImage(this.view.imgPartSchemeB);
            }).then(() => {
                this.isActingDone = true;
            });
        },

        backToAllScheme: function (part) {
            this.hidePartImage(this.view.imgPartSchemeB).then(()=> {
                this.hidePartImageParent();
                this.scrollPartSchemeTo(null, {scrollLeft: 0, scrollTop: 0});
            });

            return this.scrollAllSchemeToPart(part).then(()=>{
                return this.showAllSchemeImg();
            }).then(() => {
                this.isActingDone = true;
            });
        },


        setPartImage: function (img, src, position={}) {
            img.src = src;
            img.style.opacity = 0;

            img.style.left = (position.left || 0) + 'px';
            img.style.top = (position.top || 0) + 'px';
        },

        hideOverlays: function () {
            var view = this.view;

            this.setBlockVisibility(view.overlayBorderRect);
            this.setBlockVisibility(view.overlayPieceLeft);
            this.setBlockVisibility(view.overlayPieceTop);
            this.setBlockVisibility(view.overlayPieceRight);
            return this.setBlockVisibility(view.overlayPieceBottom).then(()=> {
                this.setDisplayNone(view.overlaysParent);
            });
        },

        hidePrevStepSideEffects: function () {
            this.hideOverlays();

            this.hideSlidePanel().then(()=> {
                this.setSlideContentHtml();
                this.setSlideContentImg();
            });

            this.hidePartImage(this.view.imgPartScheme);
            this.hidePartImage(this.view.imgPartSchemeA);

            this.hidePartImage(this.view.imgPartSchemeB).then(()=> {
                this.hidePartImageParent();
                this.scrollPartSchemeTo(null, {scrollLeft: 0, scrollTop: 0});
            });

            this.showAllSchemeImg();

            return this.delay(1000);
        },

        setOverlaysAround: function(opt) {
            var view = this.view;

            this.setDisplayBlock(view.overlaysParent);
            this.configureOverlayPieceDimensionsAnim(view.overlayBorderRect, opt.x - 1, opt.y - 1, opt.w, opt.h);

            this.configureOverlayPieceDimensionsAnim(view.overlayPieceLeft, 0, 0, opt.x, ALL_PARTS_HEIGHT);
            this.configureOverlayPieceDimensionsAnim(view.overlayPieceTop, opt.x, 0, ALL_PARTS_WIDTH - opt.x, opt.y);
            this.configureOverlayPieceDimensionsAnim(view.overlayPieceRight, opt.x + opt.w, opt.y, ALL_PARTS_WIDTH - opt.x - opt.w, ALL_PARTS_HEIGHT - opt.y);
            return this.configureOverlayPieceDimensionsAnim(view.overlayPieceBottom, opt.x, opt.y + opt.h, opt.w, ALL_PARTS_HEIGHT - opt.y - opt.h);
        },

        configureOverlayPieceDimensions: function (piece, x, y, w, h) {
            piece.style.left = x + 'px';
            piece.style.top = y + 'px';
            piece.style.width = w + 'px';
            piece.style.height = h + 'px';
        },

        configureOverlayPieceDimensionsAnim: function (piece, x, y, w, h) {
            this.configureOverlayPieceDimensions(piece, x, y, w, h);
            return this.setBlockVisibility(piece, 1);
        },

        setBlockVisibility: function (piece, val=0) {
            return anime({
                targets: piece,
                opacity: val,
                duration: 800,

                easing: 'easeInQuad'
            }).finished;
        },

        setDisplayNone: function (el) {
            el.style.display = 'none';
        },

        setDisplayBlock: function (block) {
            block.style.display = 'block';
        },

        moveCPartsToLeft: function (parts, x, y) {
            return anime({
                targets: parts,
                left: x || 0,
                duration: 800,

                delay: function(el, i, l) {
                    return i * 300;
                },

                easing: 'easeInQuad'
            }).finished;
        },

        getOverlayPieceOpt: function (part) {
            return {
                x: part.overlay.x,
                y: part.overlay.y,
                w: part.overlay.w,
                h: part.overlay.h
            }
        }

    };

})();


window.presentationAppReactUnderHood.init();