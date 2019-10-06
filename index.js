/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

// https://developers.google.com/oauthplayground/#step1&url=https%3A%2F%2F&content_type=application%2Fjson&http_method=GET&useDefaultOauthCred=unchecked&oauthEndpointSelect=Custom&oauthAuthEndpointValue=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fapprove_app&oauthTokenEndpointValue=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Ftoken_endpoint&oauthClientId=8-lfM3g7Bzb0YAjYoyJw_g&oauthClientSecret=Udrp43Eh6oCyRtN_n4tS5w&includeCredentials=checked&accessTokenType=bearer&autoRefreshToken=unchecked&accessType=offline&prompt=consent&response_type=code&wrapLines=on

const fs = require('fs')
const axios = require("axios");

exports.createInvoice = (req, res) => {

  var access_token = '';
  var refresh_token = '';
  
  fs.readFile('/tmp/access_token', (err, data) => {
    if (err) {
      axios({
          "method":"POST",
          "url" : "https://api.freeagent.com/v2/token_endpoint",
          "headers":{
          "content-type":"application/json",
          },
          "auth": {
          "username" : "8-lfM3g7Bzb0YAjYoyJw_g",
          "password" : "Udrp43Eh6oCyRtN_n4tS5w"
          },
          "data":{
            "grant_type": "authorization_code",
            "code" : "1caAfMPA_SA9-O3LXr6QRmGNClKlzEuu9pNAreHdf",
            "redirect_uri" : "https://developers.google.com/oauthplayground",
            "client_id" : "8-lfM3g7Bzb0YAjYoyJw_g",
            "client_secret" : "Udrp43Eh6oCyRtN_n4tS5w"
          }
        })
        .then(function(response){
            access_token = response.data.access_token;
            fs.writeFile('/tmp/access_token', access_token, (err) => {
                // In case of a error throw err.
                if (err) console.log(err);
            })
            refresh_token = response.data.refresh_token;
            fs.writeFile('/tmp/refresh_token', refresh_token, (err) => {
                // In case of a error throw err.
                if (err) console.log(err);
            })
      });
    }
    else {
      access_token = data.toString();
    }
  })

  if(access_token) {
      axios({
          "method":"POST",
          "url":"https://api.freeagent.com/v2/invoices",
          "headers":{
          "content-type":"application/json",
          "authorization":'Bearer %s' % access_token,
          },"data":
            { "invoice":
              {
                "contact":"https://api.freeagent.com/v2/contacts/8781413",
                "dated_on":"2019-10-12",
                "due_on":"2019-10-17",
                "reference":"003",
                "currency":"EUR",
                "exchange_rate":"1.0",
                "net_value":"0.0",
                "total_value": "100.0",
                "paid_value": "0.0",
                "due_value": "100.0",
                "status":"Draft",
                "omit_header":false,
                "always_show_bic_and_iban": false,
                "send_thank_you_emails":false,
                "send_reminder_emails":false,
                "send_new_invoice_emails": false,
                "bank_account": "https://api.freeagent.com/v2/bank_accounts/714237",
                "payment_terms_in_days":5,
                "payment_methods": {
                  "paypal": false,
                  "stripe": false
                },
                "created_at":"2019-10-06T00:00:00Z",
                "updated_at":"2019-10-06T00:00:00Z",
                "invoice_items":[
                  {
                    "description":"Test InvoiceItem",
                    "item_type":"Hours",
                    "price":"100.0",
                    "quantity":"1.0"
                  }
                ]
              }
            }
          })
          .then((response)=>{
            console.log(response);
            res.status(200).send('OK');
          })
          .catch((error)=>{
            console.log(error);
            res.status(404).send('Eror');
          });
    }
}
