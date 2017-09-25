module.exports = function () {
    defineCachedGetter(StructureSpawn.prototype, 'energyAvailable', function () {
        return this.room.energyInExtensions + this.energy;
    });
};
