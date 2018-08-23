(function(){
  const deck = document.getElementsByClassName('deck')[0];
  const restart = document.getElementsByClassName('restart')[0];
  const stars = document.getElementsByClassName('stars')[0];
  const timerDisplay = document.getElementsByClassName('timer')[0];
  const closeBtn = document.getElementsByClassName('close')[0];
  const modal = document.getElementsByClassName('modal')[0];
  let moves = document.getElementsByClassName('moves')[0];
  let openCards = [];
  let timer;
  let timerOn = false;

  /**
   * Shuffle function from http://stackoverflow.com/a/2450976
   * @returns {array} shuffled cards
   */
  function shuffle(array) {
      let currentIndex = array.length, temporaryValue, randomIndex;

      while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
      }

      return array;
  }

   /**
    * Differentiate cards that have been matched from other cards that have not been macthed.
    * @description Adds CSS class `match` to card
    * @returns {void}
    */
   function showMatched(){
      openCards.forEach(el => {
          el.parentElement.classList.add("match");
      })
      emptyOpenCards();
  }

   /**
    * Differentiate cards that have not been matched from other cards that have been macthed.
    * Add animation to cards that have not been matched
    * @description Adds CSS class `not-match` to card
    * @returns {void}
    */
   function showNotMatched(){
      openCards.forEach(el => {
          el.parentElement.classList.add("not-match");
      })
  }

   /**
    * Display symbol on card
    * @description Adds CSS class `show` to card
    * @returns {void}
    */
  function displayCardSymbol(){
      event.target.classList.add("show");
  }

  /**
   * Rotate the card
   * @description Adds CSS class `open` to card
   * @returns {void}
   */
  function openCard(){
      event.target.classList.add("open");
  }

  /**
   * Close cards that have not been matched
   * @description Removes CSS class `open` from card
   * @returns {void}
   */
  function closeCards(){
      for (let card of deck.children){
          if (!card.classList.contains("match")){
              card.classList.remove("open");
              card.classList.remove("show");
              card.classList.remove("not-match");
              card.classList.remove("selected");
          }
      }
      emptyOpenCards();
  }

  /**
   * Empty the array of open cards
   * @description Empty open cards array
   * @returns {void}
   */
  function emptyOpenCards(){
      openCards = [];
  }

  /**
   * Allows the animation on cards that don't match to run smoothly
   * @description handles scenario when cards don't match
   * @returns {void}
   */
  function notMatchedHandler(){
      setTimeout(showNotMatched, 0);
      setTimeout(closeCards, 1000);
  }

  /**
   * This checks if a pair of cards has been found
   * @description Checks if cards match
   * @returns {bool} true | false
   */
  function foundMatch(){
      if(openCards.length === 2){
          let cardOne= Array.from(openCards[0].classList);
          let cardTwo= Array.from(openCards[1].classList);

          if(cardOne.join(' ') !== cardTwo.join(' ')){
              return false;
          }

          return true;
      }
  }

  /**
   * Add selected cards to array of open cards
   * @description push card first element child to openCards array
   * @returns {void}
   */
  function addToOpenCards(){
      if ( openCards.length >= 2 ){
        return;
      }
      event.target.classList.add("selected");
      openCards.push(event.target.firstElementChild);
  }

  /**
   * Increments the moves as the user makes them
   * @description increments moves by 1
   * @returns {void}
   */
  function makeMove(){
    moves.parentElement.lastElementChild.textContent = Number(moves.textContent) >= 1? ` Moves` : ` Move`;
    return Number(moves.textContent) + 1;
  }

  /**
   * @description resets moves to 0
   * @returns {void}
   */
  function resetMoves(){
    moves.parentElement.lastElementChild.textContent = " Move";
    moves.textContent = 0;
  }

  /**
   * @description handles matching and counts moves
   * @returns {void}
   */
  function handleMatch(){
    if (openCards.length === 2){
      moves.textContent = makeMove();
      foundMatch() ? showMatched() : notMatchedHandler();
    }
  }

  /**
   * @description creates multiple elements
   * @param {int} amount
   * @param {string} element
   * @returns {array}
   */
  function createMultipleElements(amount, element){
      let elements = [];
      for (let i = 0; i <= amount; i++){
          elements.push(document.createElement(element));
      }

      return elements;
  }

  /**
   * @description Add html contents to elements
   * @param {array} elements
   * @param {string} html
   * @returns {void}
   */
  function addToInnerHtml(elements = [], html = ''){
    for (let element of elements){
      element.innerHTML = html;
    }
  }

  /**
   * @description creates fragment and appends children elements to it
   * @param {array} elements
   * @returns {void}
   */
  function appendChildToFragment(elements=[]){
    const fragment = document.createDocumentFragment();
    for (let element of elements){
      fragment.appendChild(element);
    }

    return fragment;
  }

  /**
   * @description Reset star rating back to 3
   * @returns {void}
   */
  function resetStars(){
    stars.innerHTML = '';
    const [li1, li2, li3] = createMultipleElements(3, "li");
    addToInnerHtml([li1, li2, li3], '<i class="fa fa-star"></i>');
    let fragment = appendChildToFragment([li1, li2, li3]);
    stars.appendChild(fragment);
  }

  /**
   * @description Change number of stars shown based on the number of moves made
   * @returns {void}
   */
  function handleStars(){
      if (Number(moves.textContent) >  16)
      {
        stars.innerHTML = '';
        const [li1] = createMultipleElements(1, "li");
        addToInnerHtml([li1], '<i class="fa fa-star"></i>');
        let fragment = appendChildToFragment([li1]);
        stars.appendChild(fragment);
      }
      else if (Number(moves.textContent) > 12)
      {
        stars.innerHTML = '';
        const [li1, li2] = createMultipleElements(2, "li");
        addToInnerHtml([li1, li2], '<i class="fa fa-star"></i>');
        let fragment = appendChildToFragment([li1, li2]);
        stars.appendChild(fragment);
      }
      else {
          resetStars();
      }
  }

  /**
   * @description Close all open cards
   * @returns {void}
   */
  function closeAllOpenCards(){
      for (let card of deck.children){
          card.classList.remove("open");
          card.classList.remove("show");
          card.classList.remove("match");
          card.classList.remove("not-match");
          card.classList.remove("selected");
      }
  }

  /**
   * @description delete cards entirely from deck
   * @returns {void}
   */
  function deleteCardsFromDeck(){
      while(deck.lastChild)
          deck.removeChild(deck.lastChild);
  }

  /**
   * @description Check if all cards have matched
   * @returns {void}
   */
  function success(){
    let win = true;
    for (let card of deck.children){
      if (!card.classList.contains("match"))
      {
        win = false;
      }
    }

      return win;
  }

  /**
   * @description Shuffle the cards
   * @returns {void}
   */
  function shuffleCards(){
      const fragment = document.createDocumentFragment();
      let shuffled = shuffle(Array.from(deck.children));
      shuffled.forEach(el => {
          fragment.appendChild(el.firstElementChild.parentElement)
      })
      deleteCardsFromDeck();
      deck.appendChild(fragment);
  }


  /**
   * @description Close modal
   * @returns {void}
   */
  function closeModal(){
      closeBtn.addEventListener('click', function(){
          modal.style.display = 'none';
      });
  }

  /**
   * @description hide modal
   * @returns {void}
   */
  function hideModal(){
      modal.style.display = 'none';
  }

  /**
   * @description Show modal
   * @returns {void}
   */
  function showModal(){
      modal.style.display = 'flex';
      let modalBody = document.querySelector('.modal-body');
      modalBody.textContent = "";
      let fragment = document.createDocumentFragment();
      let modalMoves = document.createElement("p");
      let congratsText = document.createElement("p");
      let win = document.createElement("p");
      let modalStars = document.createElement("span");
      modalStars.classList.add("stars");
      congratsText.textContent = "Congratulations!";
      win.textContent = "You win!";
      modalStars.innerHTML = stars.innerHTML;
      modalMoves.innerHTML = `${moves.textContent} moves made in ${timerDisplay.textContent}.`;
      fragment.appendChild(congratsText);
      fragment.appendChild(win);
      fragment.appendChild(modalMoves);
      fragment.appendChild(modalStars);
      modalBody.appendChild(fragment);
  }

  /**
   * @description Display timer
   * @param {seconds} seconds - timestamp
   * @returns {void}
   */
  function displayTimer(seconds){
    const mins = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    let adjustedMins = `${mins < 10 ? '0' : ''}${mins}`;
    let adjustedSecs = `${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = `${adjustedMins}:${adjustedSecs}`;
  }

  /**
   * @description resets timer
   * @returns {void}
   */
  function resetTimer(){
    stopTimer();
    timerOn = false;
    timerDisplay.textContent = '00:00';
  }

  /**
   * @description Begin timer
   * @returns {void}
   */
  function startTimer(){
    const time = Date.now();
    let seconds = Math.round((Date.now() - time) / 1000);
    displayTimer(seconds);

    timer = setInterval(() => {
      seconds = Math.round((Date.now() - time) / 1000);
      displayTimer(seconds);
    }, 1000);
  }

  /**
   * @description Stop timer
   * @returns {void}
   */
  function stopTimer(){
    clearInterval(timer);
  }

  /**
   * @description Start the game (pre-init)
   * @returns {void}
   */
  function startGame(){
    deck.addEventListener('click', function(event){
      if ( event.target.classList.contains("card") && !(event.target.classList.contains("selected")) ){
          openCard();
          if (!timerOn){
            startTimer();
            timerOn = true;
          }
          displayCardSymbol();
          addToOpenCards();
          handleMatch();
          handleStars();
          if (success()){
            stopTimer();
            showModal();
          } else {
            hideModal();
          }
      }
    });
  }

  /**
   * @description restart the game
   * @returns {void}
   */
  function restartGame(){
    restart.addEventListener('click', function(event){
        resetMoves();
        resetStars();
        resetTimer();
        emptyOpenCards();
        closeAllOpenCards();
        shuffleCards();
    });
  }

  /**
   * @description Initialise the game
   * @returns {void}
   */
  function init(){
    document.addEventListener('DOMContentLoaded', function(){
        resetMoves();
        emptyOpenCards();
        closeAllOpenCards();
        shuffleCards();
        closeModal();
        startGame();
        restartGame();
    });
  }


  init(); // run

})();
