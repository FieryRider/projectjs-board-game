var Unit = function(characterClass, position, team) {
    this.characterClass = characterClass;
    this.health = characterClass.health;
    this.position = position;
    this.team = team;
    this.potions = 1;

}

Unit.prototype = {
    move: function(destination) {
        this.position = destination;
    },
    attack: function(target) {
        target.takeDamage(this.characterClass.strength);
    },
    takeDamage: function(attackPoints) {
        let damage = attackPoints - this.characterClass.armor;
        this.health -= damage;
    },
    // Adds random number between 1 and 6 to the health of the unit and remove 1 potion from it's inventory
    heal: function() {
        if (this.potions == 0)
            return;

        let healPoints = Math.floor((Math.random() * 6) + 1)
        this.health += healPoints;
        if (this.health > this.characterClass.health)
            this.health = this.characterClass.health
        this.potions -= 1;
    },
}
