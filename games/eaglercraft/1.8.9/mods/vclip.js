(function VClipExploit() {
    ModAPI.meta.title("VClip Exploit");
    ModAPI.meta.description("/vclip command");
    ModAPI.meta.credits("By GetCmdRolled");

    ModAPI.require("player");

    ModAPI.addEventListener("sendchatmessage", (ev) => {
        var string = ev.message.toLowerCase(); //Get the lower case version of the command
        if (string.startsWith("/vclip")) { //does the chat `message start with .vclip?
            ev.preventDefault = true; //we don't want this being sent into chat as a message
            var yOffset = 1; //The offset on the y axis
            var args = string.split(" ");
            if (args[1]) { //If the second argument to .vclip exists (the vclip <amount>)
                yOffset = parseFloat(args[1]) || 0; //Convert the second argument into a number. We use || to replace NaN (invalid numbers) with 0. Then, store it into the y offset.
            } //This allows you to just type .vclip to clip upwards 1 block.
            
            ModAPI.player.setPosition( //This function sets the players position to an XYZ coordinate
                ModAPI.player.posX,
                ModAPI.player.posY + yOffset, //All XYZ elements are the same, except we add the yOffset variable to the y axis.
                ModAPI.player.posZ
            ); 

            //Finally, log the amount we've VClipped into the chat.
            ModAPI.displayToChat("[VClip] VClipped " + yOffset + " blocks.");
        }
    });
})();