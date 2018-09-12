/*
 * Create a list that holds all of your cards
 */

let clickCount = 0;

const cards = {
    el: Array.prototype.slice.call(document.querySelectorAll('.card')),
    container: document.querySelector('.deck'),
    init: function () {
        this.refresh();
        this.eventListener();
    },
    eventListener: function () {
        let cards = this.el;
        let self = this;
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            card.addEventListener('click', function () {
                clickCount++;
                if (clickCount <= 2) {
                    self.open(card);
                    self.checkMatch()
                } else {
                    alert("Please don't click too often!");
                }                
            });
        }
    },
    open: function (element) {
        element.classList.add('open', 'show', 'animated', 'faster', 'flipY');
        element.addEventListener('animationend', function () {
            element.classList.remove('animated', 'flipY', 'faster');
        });
    },
    close: function (element) {
        element.classList.remove('open', 'show');
    },
    match: function (element) {
        element.classList.remove('open', 'show');
        element.classList.add('match');
    },
    animatedCorrect: function (element) {
        element.classList.add('animated', 'tada');
        element.addEventListener('animationend', function () {
            element.classList.remove('animated', 'tada');
        });
    },
    animatedIncorrect: function (element) {
        element.classList.add('animated', 'shake');
        element.addEventListener('animationend', function () {
            element.classList.remove('animated', 'shake');
        });
    },
    refresh: function () {
        const fragment = document.createDocumentFragment();
        const container = this.container;
        const originalEl = this.el;
        const newEl = shuffle(originalEl);
        for (let i = 0; i < originalEl.length; i++) {
            originalEl[i].remove();
        }
        for (let i = 0; i < newEl.length; i++) {
            fragment.appendChild(newEl[i]);
        }
        container.appendChild(fragment);
    },
    checkMatch: function () {
        const children = Array.prototype.slice.call(this.container.children);
        let openedCard = [];
        let self = this;
        let count = 0;
        for (let i = 0; i < children.length; i++) {
            if (children[i].classList.contains('open')) {
                count += 1;
                openedCard.push(i)
            }
        }

        if (count == 2) {
            let firstEl = children[openedCard[0]];
            let secondEl = children[openedCard[1]];
            let firstData = firstEl.dataset.match;
            let secondData = secondEl.dataset.match;
            gameControls.addMove();
            gameControls.starsControl();
            if (firstData === secondData) {
                setTimeout(function () {
                    self.animatedCorrect(firstEl);
                    self.animatedCorrect(secondEl);
                    self.match(firstEl);
                    self.match(secondEl);
                    self.allCorrect();
                    clickCount = 0;
                }, 700)
            } else {
                setTimeout(function () {
                    self.animatedIncorrect(firstEl);
                    self.animatedIncorrect(secondEl);
                }, 700)
                setTimeout(function () {
                    self.close(firstEl);
                    self.close(secondEl);
                    clickCount = 0;
                }, 1000);
            }
        }

    },
    restart: function () {
        const allCards = this.el;
        for (let i = 0; i < allCards.length; i++) {
            allCards[i].classList.remove('show', 'match', 'open');
            allCards[i].classList.add('animated', 'flipY');
            allCards[i].addEventListener('animationend', function () {
                allCards[i].classList.remove('animated', 'flipY');
            });
        }
        this.refresh();
        gameControls.resetMoves();
        gameControls.resetStars();
        timer.reset();
        clickCount = 0;
    },
    allCorrect: function () {
        const allCards = this.el;
        let count = 0;
        for (let i = 0; i < allCards.length; i++) {
            if (allCards[i].classList.contains('match')) {
                count++;
            }
        }
        if (count == 16) {
            screenContainer.openScreen();
            timer.stop();
        }
    }
}

const gameControls = {
    counter: 0,
    moves: document.querySelector('.moves'),
    restartBtn: document.querySelector('.restart'),
    stars: document.querySelector('.stars'),
    init: function () {
        this.clickToRestart();
    },
    clickToRestart: function () {
        var restartBtn = this.restartBtn;
        restartBtn.addEventListener('click', function () {
            cards.restart();
        })
    },
    addMove: function () {
        const moves = this.moves;
        let counter = this.counter += 1;
        moves.innerHTML = counter;
    },
    resetMoves: function () {
        const moves = this.moves;
        this.counter = 0;
        moves.innerHTML = this.counter;
    },
    starsControl: function () {
        const moves = this.counter;
        const stars = this.stars;
        const star = stars.children;
        if (moves > 22) {
            star[0].innerHTML = '<i class="fa fa-star-o"></i>';
        } else if (moves > 20) {
            star[1].innerHTML = '<i class="fa fa-star-o"></i>';
        } else if (moves > 16) {
            star[2].innerHTML = '<i class="fa fa-star-o"></i>';
        }
    },
    resetStars: function () {
        const stars = this.stars.children;
        for (let i = 0; i < stars.length; i++) {
            stars[i].innerHTML = '<i class="fa fa-star"></i>'
        }
    }
}

const timer = {
    el: document.querySelector('#timer'),
    timer: new Timer(),
    init: function () {
        this.start();
        this.event();
    },
    printTimer: function () {
        this.el.innerText = this.timer.getTimeValues().toString();
    },
    start: function () {
        this.timer.start();
    },
    stop: function () {
        this.timer.stop();
    },
    reset: function () {
        this.timer.reset();
    },
    event: function () {
        const self = this;
        self.timer.addEventListener('secondsUpdated', function () {
            self.printTimer();
        });
        self.timer.addEventListener('started', function () {
            self.printTimer();
        })
        self.timer.addEventListener('reset', function () {
            self.printTimer();
        })
    },
    getTotalTimeSecond: function () {
        return this.timer.getTotalTimeValues().seconds;
    }
}

const screenContainer = {
    el: document.querySelector('.full-screen'),
    deckContainer: document.querySelector('.container'),
    closeBtn: document.querySelector('.full-screen__close'),
    startAgain: document.querySelector('.full-screen__button'),
    init: function () {
        this.closeBtnClick();
        this.restartBtn();
        this.openCloseAnimation();
        this.containerBlurAnimation();
    },
    restartBtn: function () {
        const self = this;
        const restartBtn = this.startAgain;
        restartBtn.addEventListener('click', function () {
            self.closeScreen();
            cards.restart();
        })
    },
    closeBtnClick: function () {
        const self = this;
        const closeBtn = this.closeBtn;
        closeBtn.addEventListener('click', function () {
            self.closeScreen();
        })
    },
    openScreen: function () {
        const screen = this.el;
        const container = this.deckContainer;
        screen.style.cssText = 'z-index: 99;';
        screen.classList.add('animated', 'zoomIn', 'faster', 'opening');
        container.classList.add('blurring');
        this.cloneStar();
        this.placeTime();
    },
    closeScreen: function () {
        const screen = this.el;
        const container = this.deckContainer;
        screen.classList.add('animated', 'zoomOut', 'faster', 'closing');
        container.classList.add('unblurring');
    },
    openCloseAnimation: function () {
        const screen = this.el;
        screen.addEventListener('animationend', function () {
            if (screen.classList.contains('opening')) {
                screen.classList.remove('animated', 'zoomIn', 'faster', 'opening');
            } else if (screen.classList.contains('closing')) {
                screen.classList.remove('animated', 'zoomOut', 'faster', 'closing');
                screen.style.cssText = 'z-index: -1;';
            }
        });
    },
    containerBlurAnimation: function () {
        const container = this.deckContainer;
        container.addEventListener('animationend', function () {
            if (container.classList.contains('blurring')) {
                container.classList.add('blurred');
                container.classList.remove('blurring');
            } else if (container.classList.contains('unblurring')) {
                container.classList.remove('unblurring', 'blurred');
            }
        })
    },
    cloneStar: function () {
        const starsTarget = document.querySelector('.stars');
        const target = document.querySelector('.full-screen__stars');
        const cloneItem = starsTarget.cloneNode(true);
        target.innerHTML = "";
        target.appendChild(cloneItem);
    },
    placeTime: function () {
        const target = document.querySelector('.full-screen__timer');
        target.innerText = timer.getTotalTimeSecond();
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

cards.init();
gameControls.init();
screenContainer.init();
timer.init();