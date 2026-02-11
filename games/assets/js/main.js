// Universal game hub - DO NOT MODIFY
window.GameHub = {
    gamesLoaded: new Set(),
    registerGame: function(gameName) {
        this.gamesLoaded.add(gameName);
        console.log(`✓ ${gameName} loaded`);
    }
};
