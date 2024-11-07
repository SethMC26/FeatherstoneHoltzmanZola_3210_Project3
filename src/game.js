import { Card } from "./Card.js";
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
        deck.shuffle()

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
        //set rotation for later use when moving cards to p1 area
        this.p1.setPlayerRotation()

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
        //set rotation for later use when moving cards to p2 area
        this.p2.setPlayerRotation()

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
        //set rotation for later use when moving cards to p3 area
        this.p3.setPlayerRotation()

        //create map of players
        this.players = new Map([
            [1, this.p1], 
            [2, this.p2],
            [3, this.p3],
        ]);
        console.log(this.players)

        //list of cards to animate 
        this.cardsToAnimate = []
        //animation list of cards going to winner pile 
        this.winnerCardsToAnimate = []
        this.animationWinner
        //set p1 to last winner on start this makes no real difference overall just stops undefined behavoir on first run of nextTurn()    
        this.lastWinner = this.p1

        this.war = false;
    }

    /**
     * Goes through the next turn of each move 
     */
    nextTurn() {
        let winner = 0; 

        //this is akwards but necessary to make war take another turn for smooth animations
        //shes a smooooothhh operatorrrrr 
        if (this.war) {
            winner = this._war();
            if (winner == -1) {
                //handle case of a multiple wars 
                return;
            }
            this.lastWinner = this.players.get(winner);
            return;
        }

        console.log("Player 1",this.players.get(1).cards, "Player 2", this.players.get(2).cards ,"Player 3", this.players.get(3).cards)

        //stop moving cards from last turn to avoid issues and set proper z value  
        let offset = 0;
        for (let card of this.winnerCardsToAnimate) {
            card.moveToWinner.stop();
            card.mesh.position.set(this.animationWinner.position.x, this.animationWinner.position.y + offset, this.animationWinner.position.z)
            card.mesh.quaternion.copy(this.animationWinner.quaternion)
            offset += 0.05 
        }
        this.winnerCardsToAnimate = [];
        
        //go through animating cards to stop there animations and add it to winner pile
        for (let card of this.cardsToAnimate) {
            //stop animations needed to move cards properly
            card.stopAnimations()

            //play animation moving to winner
            this.animationWinner = this.lastWinner
            let winnerPos = this.lastWinner.position
            card.playWinnerClip(winnerPos, this.lastWinner.quaternion);
            this.winnerCardsToAnimate.push(card);

            //remake animation clips to avoid issues
            card.addAnimationClips()
            //push card to winners cards 
            this.lastWinner.cards.push(card)
        }
        this.cardsToAnimate = []

        //bump up winner deck
        for (let card of this.lastWinner.cards) {
            card.mesh.translateZ(-0.08)
        }

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
                nextCard.playCardAnimation(player.number)
                this.cardsToAnimate.push(nextCard)
            }
            else {
                playerCards.push(new Card(-1, -1, 0, 0))
            }
        }
        
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
            //set war to true we are in a war!
            this.war = true;
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
                    //add the remaining cards as a face down animaiton
                    for (let card of player.cards){
                        card.warFaceDownAnimation(player.number)
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

                //play animations for cards
                faceUpCard.playWarCard(player.number)
                faceDownCard.warFaceDownAnimation(player.number)
                this.cardsToAnimate.push(faceDownCard, faceUpCard)
            }
        }

        console.log("war cards", playerCards)
        if (playerCards[1].rank > playerCards[3].rank && playerCards[1].rank > playerCards[5].rank) {
            console.log("p1 wins WAR")
            this.war = false;
            return 1

        }
        else if (playerCards[3].rank > playerCards[1].rank && playerCards[3].rank > playerCards[5].rank) {
            console.log("p2 wins WAR")
            this.war = false;
            return 2
        }
        else if (playerCards[5].rank > playerCards[1].rank && playerCards[5].rank > playerCards[3].rank) {
            console.log("p3 wins WAR")
            this.war = false; 
            return 3
        }
        //no winner do war again 
        else {
            console.warn("GIVE ME AN F  GIVE ME A U  GIVE ME A C GIVE ME A K WHATS THAT SPELL...well 1,2,3 what are we fighting for ")
            this.war = true    
            return -1;        
            //return this._war()
        }
    }

    //updates mixers for any cards currently animating 
    updateAnimations(delta) {
        for (let card of this.cardsToAnimate) {
            card.mixer.update(delta)
        }

        for (let card of this.winnerCardsToAnimate) {
            card.mixer.update(delta)
        }
    }
}

/**
 * Player represents a player in the game 
 */
class Player {
    constructor(playerNumber, cards, position) {
        //player number 1, 2, 3
        this.number = playerNumber
        //subset of deck players has
        this.cards = cards;
        //Keep track of if player has lost
        this.isInGame = true;
        //position of players pile of cards
        this.position = position

        //copy rotation of first card essentially this is rotation of our pile 
        this.quaternion = null;
    }

    /**
     * Call this after setting up the pile of cards for the player
     * Internally we are saving the rotations of the pile
     */
    setPlayerRotation() {
        this.quaternion = new THREE.Quaternion()
        this.quaternion.copy(this.cards[0].mesh.quaternion)
    }
}

export { Game }