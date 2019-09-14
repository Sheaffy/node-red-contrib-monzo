module.exports = function(RED) {
    "use strict";
    var request = require("request");
    /*
    Setup MonzoWebHook
     */

    RED.httpAdmin.post('/monzo-webhook/:nodeId', function(req,res) {
        var nodeId = req.params.nodeId;
        var node = RED.nodes.getNode(nodeId);
        if (node) { 
           // call the callback function you have added to the individual node instance.
           node.WebhookCallback(req,res);
        } else {
           res.send(404).end();
        }
     });

    //Set up endpoint to allow you to retreive active webhooks within the admin (REQUIRES PERMISSIONS IF SET)
    RED.httpAdmin.get('/monzo-get-hooks/:nodeId', RED.auth.needsPermission('monzo-hook.read'), function(req, res){ 
        var nodeId = req.params.nodeId;
        var node = RED.nodes.getNode(nodeId);
        if (node) { 
           // call the callback function you have added to the individual node instance.
           node.GetHooksCallback(req,res);
        } else {
           res.send(404).end();
        }
    });

    //Set up endpoint to allow you to delete a webhook through the admin, (REQUIRES PERMISSIONS IF SET)
    RED.httpAdmin.get('/monzo-delete-hook/:nodeId/:id', RED.auth.needsPermission('monzo-hook.read'), function(req, res){ 
        var nodeId = req.params.nodeId;
        var node = RED.nodes.getNode(nodeId);
        if (node) { 
           // call the callback function you have added to the individual node instance.
           node.DeleteHookCallback(req,res);
        } else {
           res.send(404).end();
        }
    });


    function MonzoWebHookNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.monzoConfig = RED.nodes.getNode(config.monzocreds);
        var monzocredentials = RED.nodes.getCredentials(config.monzocreds);

        this.WebhookCallback = function WebhookCallback(req, res){            
            const Monzo = require('monzo-js');
            var monzocredentials_local = RED.nodes.getCredentials(config.monzocreds);
            const monzo = new Monzo(monzocredentials_local.token);
            try {
                //console.log(req.body);
                if (req.body != "{}") {
                    var hookdata = req.body;
                    var msg = {
                        payload: hookdata
                    };
                    node.send(msg);
                }
            } catch (err) {
                node.error(err);
            }
            res.end("done");
        }

        this.GetHooksCallback = function GetHooksCallback(req, res) {
            const Monzo = require('monzo-js');
            var monzocredentials_local = RED.nodes.getCredentials(config.monzocreds);
            const monzo = new Monzo(monzocredentials_local.token);
            monzo.accounts.find(config.accountid).then(account => {
                account.webhooks.all().then(webhooks => {
                    var hooks = [];
                    for (const [id, webhook] of webhooks) {
                        hooks.push([id, webhook])
                    }
                    var datatosend = JSON.stringify(hooks);
                    res.send(datatosend);
                }).catch(error => {
                    res.send(error);
                    //console.log(error);
                });
            }).catch(error => {
                res.send(error);
                //console.log(error);
            });
        }

        this.DeleteHookCallback = function DeleteHookCallback(req, res) {
            const Monzo = require('monzo-js');
            var monzocredentials_local = RED.nodes.getCredentials(config.monzocreds);
            const monzo = new Monzo(monzocredentials_local.token);

            var opts = {};
            opts.url = "https://api.monzo.com/webhooks/" + req.params.id;
            opts.timeout = 2000;
            opts.method = "DELETE";
            opts.headers = {
                Authorization: 'Bearer ' + monzocredentials_local.token
            }
            opts.maxRedirects = 21;
            request(opts, function(err, ress, body) {
                if (err) {
                    console.log(err);
                    res.send("failed");
                } else {
                    var bodyObject = JSON.parse(body);
                    res.send("deleted");
                }
            });
        }

        if (this.monzoConfig) {
            if (monzocredentials.token != "") {
                // We have a token, lets first request all
                this.status({
                    fill: "green",
                    shape: "dot",
                    text: "ready"
                });

                const Monzo = require('monzo-js');
                const monzo = new Monzo(monzocredentials.token);

                if (config.accountid && config.url != undefined) {
                    monzo.accounts.find(config.accountid).then(account => {
                        account.webhooks.all().then(webhooks => {
                            var hookurl = "";
                            if (config.hooktype == "remote") {
                                hookurl = config.url;
                            } else {
                                hookurl = config.url + "/monzo-webhook/" + node.id;
                            }
                            var already_live = false;
                            for (const [id, webhook] of webhooks) {
                                if (config.hooktype == "local") {
                                    if (webhook.url == config.url + "/monzo-webhook/" + node.id) {
                                        already_live = true;
                                        //console.log(`Webhook ${id} hooked to ${webhook.url}`);
                                        break;
                                    }
                                } else if (config.hooktype == "remote") {
                                    if (webhook.url == config.url) {
                                        already_live = true;
                                        //console.log(`Webhook ${id} hooked to ${webhook.url}`);
                                        break;
                                    }
                                }
                            }
                            if (already_live == false) {
                                //register new hook!
                                //console.log("register hook now");
                                var registered_hook = account.webhooks.register(hookurl).then(webhook => {
                                    this.status({
                                        fill: "green",
                                        shape: "dot",
                                        text: "hook registered"
                                    });
                                }).catch(error => {
                                    this.status({
                                        fill: "red",
                                        shape: "dot",
                                        text: "failed hook"
                                    });
                                    node.error(error);
                                });
                            }
                        }).catch(error => {
                            //console.log(error);
                            this.status({
	                            fill: "red",
	                            shape: "dot",
	                            text: "no auth"
                        	});
                        });
                    }).catch(error => {
                        //console.log(error)
                        this.status({
                            fill: "red",
                            shape: "dot",
                            text: "no auth"
                        });
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
    }
    /*
    Upon node close i.e when node-red closes or a user redeploys the flow, stop the cronjob and remove it.
     */
   // MonzoWebHookNode.prototype.close = function() { };
    /*
    Register the monzo credentials node along with the credentials it will need.
     */
    RED.nodes.registerType("monzo-hook", MonzoWebHookNode, {
        //Any credentials go here
    });
}