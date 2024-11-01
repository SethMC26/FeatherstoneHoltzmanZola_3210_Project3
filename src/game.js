import { Card } from "./Card";
import { Deck } from "./Deck"

class Game {
    constructor(scene) {
        //keep track of game state
        this.isGameOn = true;
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
        for (let i = 0; i < 1000; i++ ) {
            this.nextTurn();
        }

        console.log(this.players)
    }

    nextTurn() {
        if (!this.isGameOn) { 
            return
        }

        //have index 0 be null for convi
        let playerCards = [null]

        for (let player of this.players.values()) {
            //issue here after a player is removed it is going to wrong index
            playerCards[i] = player.cards.shift()
        }

        //handle case for logic below that player is no longer in game and card rank has undefined value
        for (let i = 1; i<4; i++)  {
            
            //might want to handle with more elegance 
            //falsy value null undefined, 0 "" NaN
            if (!playerCards[i]) {
                playerCards[i] = new Card(-1,-1,-1,0,0);
            }
        }

        console.log("p1 card", playerCards[1], "p2 card", playerCards[2], "p3 card", playerCards[3])

        if (playerCards[1].rank == playerCards[2].rank && playerCards[2].rank == playerCards[3].rank) {
            console.warn("War...what is is good for...absolutely nothing")
        }
        else {
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
            else {
                winner = 3;
                console.log("p3 wins")
            }

            let winningPlayer  = this.players.get(winner)
            for (let card of playerCards) {
                if (card && card.rank != -1) {
                    winningPlayer.cards.push(card)
                }
            }
            console.log(winningPlayer)
        }

        for (let playerIndex of this.players.keys()) {
            if (this.players.get(playerIndex).cards.length == 0) {
                console.warn("removing player ", playerIndex, this.players.get(playerIndex))
                this.players.delete(playerIndex)
            }
        }

        if (this.players.size == 1) {
            this.isGameOn = false;
            console.error("Player: ", this.players.keys().next().value, "wins! ")
        }
    }
}

class Player {
    constructor(playerNumber, cards) {
        this.number = playerNumber
        this.cards = cards;

    }
}



export { Game }