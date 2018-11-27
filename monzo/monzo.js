module.exports = function(RED) {
    function MonzoCredentialsNode(n) {
        const Monzo = require('monzo-js');
        RED.nodes.createNode(this, n);
    }
    RED.nodes.registerType("monzo-credentials", MonzoCredentialsNode, {
        credentials: {
            token: {
                type: "password"
            }
        }
    });

    function MonzoNodeIn(config) {
        RED.nodes.createNode(this, config);
        this.requesttype = config.requesttype;
        this.monzoConfig = RED.nodes.getNode(config.monzocreds);
        const Monzo = require('monzo-js');
        if (!this.monzoConfig) {
            this.status({
                fill: "red",
                shape: "dot",
                text: "no token"
            });
        } else {
            this.status({
                fill: "green",
                shape: "dot",
                text: "ready"
            });
        }
        var node = this;
        node.on('input', function(msg) {
            this.status({
                fill: "yellow",
                shape: "dot",
                text: "requesting"
            });
            if (!this.monzoConfig) {
                this.status({
                    fill: "red",
                    shape: "dot",
                    text: "no token"
                });
                node.error("you have not entered a token", msg);
            } else {
                const monzo = new Monzo(this.monzoConfig.credentials.token);
                if (this.requesttype == "accounts") {
                    monzo.accounts.all().then(accounts => {
                        for (const [id, acc] of accounts) {
                            msg.payload = {
                                "response": acc._account
                            };
                            node.send(msg);
                            this.status({
                                fill: "green",
                                shape: "dot",
                                text: "ready"
                            });
                        }
                    }).catch(error => {
                        node.error("your token is not authenticated.", msg);
                        this.status({
                            fill: "red",
                            shape: "dot",
                            text: "no auth"
                        });
                    });
                }
                if (this.requesttype == "balances") {
                    monzo.accounts.all().then(accounts => {
                        for (const [id, acc] of accounts) {
                            msg.payload = {
                                "response": acc._balance._balance
                            };
                            node.send(msg);
                            this.status({
                                fill: "green",
                                shape: "dot",
                                text: "ready"
                            });
                        }
                    }).catch(error => {
                        node.error("your token is not authenticated.", msg);
                        this.status({
                            fill: "red",
                            shape: "dot",
                            text: "no auth"
                        });
                    });
                }
                if (this.requesttype == "pots") {
                    monzo.pots.all().then(pots => {
                        for (const [id, pot] of pots) {
                            msg.payload = {
                                "response": {
                                    "pot_name": pot.name,
                                    "pot_balance": pot.balance
                                }
                            };
                            node.send(msg);
                            this.status({
                                fill: "green",
                                shape: "dot",
                                text: "ready"
                            });
                        }
                    }).catch(error => {
                        node.error("your token is not authenticated.", msg);
                        this.status({
                            fill: "red",
                            shape: "dot",
                            text: "no auth"
                        });
                    });
                }
            }
        });
    }
    RED.nodes.registerType("monzo-in", MonzoNodeIn);
}