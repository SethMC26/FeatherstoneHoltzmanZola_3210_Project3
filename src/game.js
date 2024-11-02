import { Card } from "./Card";
import { Deck } from "./Deck";
import * as THREE from 'three';

class Game {
    constructor(scene) {
        //keep track of game state
        this.isGameOn = true;
        this.numPlayers = 3;
        //create new Deck
        const deck = new Deck(scene);
        console.log(deck)

        //shuffle deck
        //shuffle cards seems to be causing some indexing issues 
        //deck.shuffle()

        //Create players
        this.p1 = new Player(1, deck.cards.slice(0, 17), new THREE.Vector3(-25,9.5,0))
        //move cards to p1 area
        let offset = 0; //offset will "Stack" the cards
        for (let card of this.p1.cards) {
            offset += 0.05
            card.mesh.position.set(-25,9.5 + offset,0)
            card.mesh.rotateZ(Math.PI/2)
            card.addAnimationClips()
        }
        console.debug(this.p1.cards)

        this.p2 = new Player(2, deck.cards.slice(17,35),new THREE.Vector3(0,9.5,25))
        //move cards to p2 area
        offset = 0;
        for (let card of this.p2.cards) {
            offset += 0.05
            card.mesh.position.set(0,9.5 + offset,25)
            card.addAnimationClips()
        }
        console.debug(this.p2.cards)

        //move cards to p3 area
        offset = 0;
        this.p3 = new Player(3, deck.cards.slice(35), new THREE.Vector3(25,9.5,0))
        //move cards to p3 area
        for (let card of this.p3.cards) {
            offset += 0.05
            card.mesh.position.set(25,9.5 + offset,0)
            card.mesh.rotateZ(Math.PI/2)
            card.addAnimationClips()
        }
        console.debug(this.p3.cards)

        //create map of players
        this.players = new Map([
            [1, this.p1], 
            [2, this.p2],
            [3, this.p3],
        ]);
        console.log(this.players)

        this.cardsToAnimate = []
        this.lastWinner = this.p1
    }

    /**
     * Goes through the next turn of each move 
     */
    nextTurn() {
        console.log("Player 1",this.players.get(1).cards, "Player 2", this.players.get(2).cards ,"Player 3", this.players.get(3).cards)
        //clear animation list and update winnings from last turn 
        let offset = 0;
        for (let card of this.cardsToAnimate) {
            //stop animations 
            card.moveToCenterP1.stop()
            card.moveToCenterP2.stop()
            card.moveToCenterP3.stop()

            this.lastWinner.cards.push(card)

            console.log("card before move", card.mesh.position)
            card.mesh.position.set(this.lastWinner.position.x, this.lastWinner.position.y + offset, this.lastWinner.position.z)
            console.log("card after move", card.mesh.position)
            offset += 0.05;
        }

        for (let card of this.lastWinner.cards) {
            card.mesh.translateZ(-0.05);  // Example movement
        }

        this.cardsToAnimate = []
        
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
        for (let i = 1; i < 4; i++) {
            let player = this.players.get(i);
            if (player.isInGame) {
                //pop card off of players deck
                let nextCard = player.cards.shift()
                playerCards.push(nextCard)
                console.log("player ", player.number, "next card ", nextCard)

                //play animation 
                nextCard.cardToCenterAnimation(player.number)
                this.cardsToAnimate.push(nextCard)
            }
            else {
                playerCards.push(new Card(-1, -1, 0, 0))
            }
        }
        
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
            //get winner
            winner = this._war()
        }

        //set winner 
        this.lastWinner = this.players.get(winner)
    }

    /**
     * Do war by drawing one face down and one face up card
     * @returns {Tuple} winnerTuple is an array with first index winnering players id(1, 2, or 3) and second element is array of war cards
     */
    _war() {
        //cards of war 
        let playerCards = [];
        //remaining cards if player runs out of cards during war 

        for (let player of this.players.values()) {
            //if player has enough cards to play war 
            if (player.cards.length < 2) {
                //player runs out of cards and is no longer in the game
                if (player.isInGame) {
                    player.isInGame = false;
                    this.numPlayers -= 1;
                    
                    for (let card of playerCards){
                        this.cardsToAnimate.push(card)
                    }
                }

                playerCards.push(null)
                playerCards.push(new Card(-1, -1, 0, 0))
            }
            else if (player.isInGame) {
                let faceDownCard = player.cards.shift()
                let faceUpCard = player.cards.shift()

                playerCards.push(faceDownCard,faceUpCard)

                //to:do add animations 
                this.cardsToAnimate.push(faceDownCard, faceUpCard)
            }
        }

        console.log("war cards", playerCards)
        if (playerCards[1].rank > playerCards[3].rank && playerCards[1].rank > playerCards[5].rank) {
            //add cards to winner
            console.log("p1 wins WAR")
            return 1

        }
        else if (playerCards[3].rank > playerCards[1].rank && playerCards[3].rank > playerCards[5].rank) {
            console.log("p2 wins WAR")
            return 2
        }
        else if (playerCards[5].rank > playerCards[1].rank && playerCards[5].rank > playerCards[3].rank) {
            console.log("p3 wins WAR")
            return 3
        }
        //no winner do war again 
        else {
            console.warn("GIVE ME AN F  GIVE ME A U  GIVE ME A C GIVE ME A K WHATS THAT SPELL...well 1,2,3 what are we fighting for ")            
            return this._war()
        }
    }

    updateAnimations(delta) {
        for (let card of this.cardsToAnimate) {
            card.mixer.update(delta)
        }
    }
}

class Player {
    constructor(playerNumber, cards, position) {
        this.number = playerNumber
        this.cards = cards;
        this.isInGame = true;
        this.position = position
    }
}

export { Game }