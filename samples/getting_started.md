#Adding a MYOB AccountRight Connector
1. Register for MYOB developer access at [http://developer.myob.com/contact/register-for-myobapi-access/](http://developer.myob.com/contact/register-for-myobapi-access/) 
2. Log into your [my.myob.com](https://my.myob.com) account and choose the correct country.
2. Select 'Developer' from the top menu on the page.
3. Click on 'Register App'.
4. In Redirect URL use https://bouncer.hoist.io/bounce, fill out the rest of the form and click Register App.
5. Copy the Key into 'API Key' here.
6. Copy the Secret into 'API Secret' here

##A note about Company File Id
The connector will retrieve all company files during authorize and select the first company file as the company file to use, call setFileId with the Id of the company file you want to use if this isn't correct. Changes to the company file id used are saved alongside authorization, do a get to '/' to retrieve a list of company files

##A note about Company File Username and Password
To access company files through MYOB AccountRight users need to supply their username and password for the company file itself. To record these you need to call .setUsernameAndPassword after authorizing the connector

The username and password will be saved along with authorization so you only need to call this once

