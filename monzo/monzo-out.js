module.exports = function(RED) {
    "use strict";
    var request = require("request");

    /*
    Setup MonzoOutNode
     */
    function MonzoOutNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.monzoConfig = RED.nodes.getNode(config.monzocreds);
        var monzocredentials = RED.nodes.getCredentials(config.monzocreds);
        var currentDeDupe = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        //console.log(currentDeDupe);
        if (this.monzoConfig) {
            if (monzocredentials.token != "") {
                // We have a token, lets first request all
                this.status({
                    fill: "green",
                    shape: "dot",
                    text: "ready"
                });
            }
        } else {
            this.status({
                fill: "red",
                shape: "dot",
                text: "no token"
            });
        }
        node.on('input', function(msg) {
         
            this.status({
                fill: "yellow",
                shape: "dot",
                text: "requesting"
            });
            var potid = "";
            if (config.potid != "") {
                potid = config.potid;
            }
            if (msg.potid != "" && msg.potid != undefined) {
                potid = msg.potid;
            }
            var orig_requesttype = "";
            var requesttype = "";
            if (config.requesttype != "") {
                orig_requesttype = config.requesttype;
                var type = config.requesttype;
                var typesplit = type.split('-');
                requesttype = typesplit[0];
            }
            if (msg.requesttype != "" && msg.requesttype != undefined) {
                orig_requesttype = msg.requesttype;
                var type = config.requesttype;
                var typesplit = type.split('-');
                requesttype = typesplit[0];
            }
            var accountid = "";
            if (config.accountid != "") {
                accountid = config.accountid;
            }
            if (msg.accountid != "" && msg.accountid != undefined) {
                accountid = msg.accountid;
            }
            var amount_value = "";
            if (config.amount != "") {
                amount_value = config.amount;
            }
            if (msg.amount != "" && msg.amount != undefined) {
                amount_value = msg.amount;
            }


            if (this.monzoConfig) {
                if (monzocredentials.token != "") {
                    var opts = {};
                    var postvars = {};
                    //initialise met requirements as false.
                    var met_requirements = false;


                    if (orig_requesttype == "deposit-pot" || orig_requesttype == "withdraw-pot") {
                        //check to see if all requorements have been met for the request type.
                        if (potid != "" && orig_requesttype != "" && accountid != "" && amount_value != "") {
                            met_requirements = true;
                        }
                        //Setup vars that will be needed for the request
                        opts.url = "https://api.monzo.com/pots/" + potid + "/" + requesttype;
                        if (orig_requesttype == "deposit-pot") {
                            postvars = {
                                source_account_id: accountid,
                                amount: amount_value,
                                dedupe_id: currentDeDupe
                            }
                        } else if (orig_requesttype == "withdraw-pot") {
                            postvars = {
                                destination_account_id: accountid,
                                amount: amount_value,
                                dedupe_id: currentDeDupe
                            }
                        }
                    }


                    //if all requirements for a request is met, send it out.
                    if (met_requirements == true) {
                        opts.timeout = 2000;
                        opts.method = "PUT";
                        opts.headers = {
                            Authorization: 'Bearer ' + monzocredentials.token
                        }
                        opts.maxRedirects = 21;
                        opts.form = postvars;
                        request(opts, function(err, ress, body) {
                            if (err) {
                                node.error(err, msg);
                                this.status({
                                    fill: "red",
                                    shape: "dot",
                                    text: "fail"
                                });
                            } else {
                                var bodyObject = JSON.parse(body);
                                if (!bodyObject.id) {
                                    node.error(bodyObject, msg);
                                } else {
                                    //Complete success, generate new dedupe
                                    currentDeDupe = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                                    node.status({
                                        fill: "green",
                                        shape: "dot",
                                        text: "ready"
                                    });
                                    msg.payload = bodyObject
                                    node.send(msg);
                                }
                            }
                        });
                    } else {
                        this.status({
                            fill: "red",
                            shape: "dot",
                            text: "missing arguments"
                        });
                        node.error("missing arguments", msg);
                    }
                } else {
                	this.status({
		                    fill: "red",
		                    shape: "dot",
		                    text: "no token"
	                });
	                node.error("you have not entered a token", msg);
                }
            }
        });
    }
    
    MonzoOutNode.prototype.close = function() {};
    
    RED.nodes.registerType("monzo-out", MonzoOutNode, {
        //Any credentials go here
    });
}