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

        this.players = new Map([
            [1, this.p1], 
            [2, this.p2],
            [3, this.p3],
        ]);

        //TO:DO add end game logic 
        let counter = 0
        while(this.isGameOn && counter< 10000) {
            console.log("-------TURN ", counter)
            this.nextTurn()
            counter++;
        }

        console.log(this.players)
    }

    nextTurn() {
        for (let player of this.players.values()) {
            if (player.isInGame && player.cards.length == 0) {
                console.error("Removing player ", player)
                player.isInGame = false;
                this.numPlayers -= 1;
            }
        }

        if (this.numPlayers == 1) {
            this.isGameOn = false;
            console.error("Player: ", this.players.keys().next().value, "wins! ")
            return;
        }

        //have index 0 be null for convi
        let playerCards = [null]

        for (let player of this.players.values()) {
            if (player.isInGame) {
                playerCards.push(player.cards.shift())
            }
            else {
                playerCards.push(new Card(-1, -1, -1, 0, 0))
            }
            //issue here after a player is removed it is going to wrong index
        }

        console.log("Player 1",this.players.get(1), "Player 2", this.players.get(2) ,"Player 3", this.players.get(3))
        console.log("Player 1 cards",this.players.get(1).cards, "Player 2 cards", this.players.get(2).cards ,"Player 3 cards", this.players.get(3).cards)

        console.log("p1 card", playerCards[1], "p2 card", playerCards[2], "p3 card", playerCards[3])

        let winner = 0; 
        if (playerCards[1].rank > playerCards[2].rank && playerCards[1].rank > playerCards[3].rank) {
            //add cards to winner
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
        else {
            console.warn("WAR...what is it good for absolutely nothing!")
            let winnerTuple = this._war()
            winner = winnerTuple[0]
            playerCards.push(...winnerTuple[1])
        }

        let winningPlayer  = this.players.get(winner)
        for (let card of playerCards) {
            if (card && card.rank != -1) {
                winningPlayer.cards.push(card)
            }
        }
    }

    _war() {
        let playerCards = [];
        let remainingCards = [];

        for (let player of this.players.values()) {
            if (player.cards.length < 2) {
                if (player.isInGame) {
                    player.isInGame = false;
                    this.numPlayers -= 1;
                }
                for (let card of playerCards){
                    remainingCards.push(card)
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
        else {
            console.warn("GIVE ME AN F  GIVE ME A U  GIVE ME A C GIVE ME A K WHATS THAT SPELL...well 1,2,3 what are we fighting for ")
            let winnerTuple = this._war()
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