# node-red-contrib-monzo

### This is a node-red package that will allow you to retrive information from monzo. (this is not an official node developed by monzo)

Please Note - Monzo is a bank that is currently only available for UK residents.

This is an easy to use node, all you have to do is input a access token and select what information you want under the request dropdown.



- [Installation](#installation)
- [Getting your temporary AccessToken](#temptoken)
- [Getting your permanent AccessToken](#permtoken)
- [Usage](#usage)
	- [Monzo-in](#monzoin)
		- [Capabilitys](#incap)
	- [Monzo-out](#monzoout)
		- [Capabilitys](#outcap)



### <a name="installation"></a> Installation
##### <a name="installation-npm"></a> Install via npm
```js
npm install node-red-contrib-monzo
```

### <a name="temptoken"></a> Getting your temporary token
To get your access token you will need to go to "https://developers.monzo.com/api/playground" and log in with your monzo account, you will see your access token on the playground page. This token will last roughly 6 hours.

### <a name="permtoken"></a> Getting your permanent token
In order to have permanent authentication, this will require you to set up a monzo API client see "https://developers.monzo.com/apps/new", so that you can have a clientID and a API secret. (please note, the client will need Confidential set to TRUE, otherwise it will not automatically refresh).
If node-red is left not running, the system will lose its window to refresh its token, meaning the next time you run node-red, your token will be invalid. You will need to re-authorise.




### <a name="usage"></a> How to use these nodes.
After you have placed either nodes, enter its credential configuration, you can either add a temporary token or a clientID and API secret. If you added the clientID and secret you will now need to go through the authentication process by clicking "Authenticate With Monzo". Once a access token is added, you are ready to go.

### <a name="monzoin"></a> Monzo-in
select the request type you would like to do. To make a request simply inject anything into the input node to get a response from the output node.
##### <a name="incap"></a> Capabilitys
This node can retreive three kinds of information from your monzo account.
- Account Information
- Balance Information
- Pots


### <a name="monzoout"></a> Monzo-out
Monzo out node has specific requirements in configuration before a request can be successfully made, you must first select or create an authenticated token, then enter an accountID of which changes will be made. Then select the request type, this will dynamically create the new fields to be filled in. Once all fields have been filled in you will be able to make a request. (If you need to find out what the accountID or potID is. use the monzo-in node to find these.)

##### <a name="outcap"></a> Capabilitys
This node can retreive three kinds of information from your monzo account.
- Pot Deposit
- Pot Withdraw
- Create Feed Item (Planned)
