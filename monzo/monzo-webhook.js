module.exports = function(RED) {
    "use strict";
    var request = require("request");
    var querystring = require("querystring");
    /*
    Setup MonzoWebHook
     */
    function MonzoWebHookNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.monzoConfig = RED.nodes.getNode(config.monzocreds);
        var monzocredentials = RED.nodes.getCredentials(config.monzocreds);

        if(RED.settings.uiHost != "0.0.0.0"){

        
        

	        if(this.monzoConfig){
		        if(monzocredentials.token != ""){
		        	// We have a token, lets first request all
		        	this.status({
		                fill: "green",
		                shape: "dot",
		                text: "ready"
		            });

		        	const Monzo = require('monzo-js');
		        	const monzo = new Monzo(monzocredentials.token);

		        	if(config.accountid){

			        	monzo.accounts.find(config.accountid).then(account => {

			        		account.webhooks.all().then(webhooks => {

			        			var already_live = false;
							    for (const [id, webhook] of webhooks) {

							    	if(webhook.url = "http://")

							        console.log(`Webhook ${id} hooked to ${webhook.url}`);
							    }
							   
							}).catch(error => {
	                        	console.log(error)
	                    	});



						}).catch(error => {
	                        console.log(error)
	                    });

		        	} else {
		        		//NO accountID
		        	}



		        }

	    	} else {
	    		this.status({
	                fill: "red",
	                shape: "dot",
	                text: "no token"
	            });
	    	}
    	} else {
    		this.status({
	                fill: "red",
	                shape: "dot",
	                text: "no localhost"
	            });
    	}
       
    }

    /*
    Upon node close i.e when node-red closes or a user redeploys the flow, stop the cronjob and remove it.
     */
    MonzoWebHookNode.prototype.close = function() {
        
    };

    /*
    Register the monzo credentials node along with the credentials it will need.
     */
    RED.nodes.registerType("monzo-live", MonzoWebHookNode, {
        //Any credentials go here


    });

}