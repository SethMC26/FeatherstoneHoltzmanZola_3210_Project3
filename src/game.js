import { Card } from "./Card";
import { Deck } from "./Deck"

class Game {
    constructor(scene) {
        //keep track of game state
        this.isGameOn = true;
        this.numPlayers = 3;
        //create new Deck
        const deck = new Deck(scene);

        //shuffle deck 
        deck.shuffle()

        //Create players
        this.p1 = new Player(1, deck.cards.slice(0, 17))
        //move cards to p1 area
        for (let card of this.p1.cards) {
            card.mesh.translateX(35)
        }
        console.debug(this.p1.cards)

        this.p2 = new Player(2, deck.cards.slice(17,34))
        //move cards to p2 area
        for (let card of this.p2.cards) {
            card.mesh.translateY(-35)
        }
        console.debug(this.p2.cards)

        this.p3 = new Player(3, deck.cards.slice(34, 52))
        //move cards to p3 area
        for (let card of this.p3.cards) {
            card.mesh.translateY(35)
        }
        console.debug(this.p3.cards)

        //create map of players
        this.players = new Map([
            [1, this.p1], 
            [2, this.p2],
            [3, this.p3],
        ]);

        //test function to see game in action below 
        let counter = 0
        while(this.isGameOn && counter < 10000) {
            console.log("-------TURN ", counter)
            this.nextTurn()
            counter++;
        }

        console.log(this.players)
    }

    /**
     * Goes through the next turn of each move 
     */
    nextTurn() {
        console.log("Player 1",this.players.get(1), "Player 2", this.players.get(2) ,"Player 3", this.players.get(3))

        //check if players still has cards
        for (let player of this.players.values()) {
            if (player.isInGame && player.cards.length == 0) {
                console.error("Removing player ", player)
                player.isInGame = false;
                this.numPlayers -= 1;
            }
        }

        //if only one player left they have one 
        if (this.numPlayers == 1) {
            this.isGameOn = false;
            console.error("Player: ", this.players.keys().next().value, "wins! ")
            return;
        }

        //have index 0 be null so player 1 is index one etc
        let playerCards = [null]

        //if player is not in game create a card with -1 rank to compare so logic still works 
        for (let player of this.players.values()) {
            if (player.isInGame) {
                //pop card off of players deck
                playerCards.push(player.cards.shift())
            }
            else {
                playerCards.push(new Card(-1, -1, -1, 0, 0))
            }
        }

        console.log("p1 card", playerCards[1], "p2 card", playerCards[2], "p3 card", playerCards[3])

        let winner = 0; 
        //logic to check for winner 
        if (playerCards[1].rank > playerCards[2].rank && playerCards[1].rank > playerCards[3].rank) {
            winner = 1;
            console.log("p1 wins")
        }
        else if (playerCards[2].rank > playerCards[1].rank && playerCards[2].rank > playerCards[3].rank) {
            winner = 2;
            console.log("p2 win")
        }
        else if (playerCards[3].rank > playerCards[1].rank && playerCards[3].rank > playerCards[2].rank) {
            winner = 3;
            console.log("p3 wins")
        }
        //no winner meaning WAR
        else {
            console.warn("WAR...what is it good for absolutely nothing!")
            let winnerTuple = this._war()
            //get winner
            winner = winnerTuple[0]
            //push war cards to playerCards
            playerCards.push(...winnerTuple[1])
        }

        //get winner and push cards to winner
        let winningPlayer  = this.players.get(winner)
        for (let card of playerCards) {
            //check if card not falsy(null, 0, "", NaN, etc) and rank is not -1 before adding it to winner's deck
            if (card && card.rank != -1) {
                winningPlayer.cards.push(card)
            }
        }
    }

    /**
     * Do war by drawing one face down and one face up card
     * @returns {Tuple} winnerTuple is an array with first index winnering players id(1, 2, or 3) and second element is array of war cards
     */
    _war() {
        //cards of war 
        let playerCards = [];
        //remaining cards if player runs out of cards during war 
        let remainingCards = [];

        for (let player of this.players.values()) {
            //if player has enough cards to play war 
            if (player.cards.length < 2) {
                //player runs out of cards and is no longer in the game
                if (player.isInGame) {
                    player.isInGame = false;
                    this.numPlayers -= 1;
                    
                    for (let card of playerCards){
                        remainingCards.push(card)
                    }
                }

                playerCards.push(null)
                playerCards.push(new Card(-1, -1, -1, 0, 0))
            }
            else if (player.isInGame) {
                playerCards.push(player.cards.shift())
                playerCards.push(player.cards.shift())
            }
        }

        console.log("war cards", playerCards)
        if (playerCards[1].rank > playerCards[3].rank && playerCards[1].rank > playerCards[5].rank) {
            //add cards to winner
            console.log("p1 wins WAR")
            return [1, playerCards]

        }
        else if (playerCards[3].rank > playerCards[1].rank && playerCards[3].rank > playerCards[5].rank) {
            console.log("p2 wins WAR")
            return [2, playerCards]
        }
        else if (playerCards[5].rank > playerCards[1].rank && playerCards[5].rank > playerCards[3].rank) {
            console.log("p3 wins WAR")
            return [3, playerCards]
        }
        //no winner do war again 
        else {
            console.warn("GIVE ME AN F  GIVE ME A U  GIVE ME A C GIVE ME A K WHATS THAT SPELL...well 1,2,3 what are we fighting for ")
            let winnerTuple = this._war()
            //add war cards to playerCards
            playerCards.push(...winnerTuple[1])
            playerCards.push(...remainingCards)
            return [winnerTuple[0], playerCards]
        }
    }
}

class Player {
    constructor(playerNumber, cards) {
        this.number = playerNumber
        this.cards = cards;
        this.isInGame = true;
    }
}

export { Game }