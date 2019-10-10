/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

// https://developers.google.com/oauthplayground/#step1&url=https%3A%2F%2F&content_type=application%2Fjson&http_method=GET&useDefaultOauthCred=unchecked&oauthEndpointSelect=Custom&oauthAuthEndpointValue=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Fapprove_app&oauthTokenEndpointValue=https%3A%2F%2Fapi.freeagent.com%2Fv2%2Ftoken_endpoint&oauthClientId=8-lfM3g7Bzb0YAjYoyJw_g&oauthClientSecret=Udrp43Eh6oCyRtN_n4tS5w&includeCredentials=checked&accessTokenType=bearer&autoRefreshToken=unchecked&accessType=offline&prompt=consent&response_type=code&wrapLines=on

const request = require('request');
require('request').debug = true;
const axios = require("axios");

const refresh_token = process.env.REFRESH_TOKEN; // export REFRESH_TOKEN=1f93s015UrnVDs-YfXJ05ha7A3TQ3o80W0tY_tVpr
const client_id = process.env.CLIENT_ID; // export CLIENT_ID=8-lfM3g7Bzb0YAjYoyJw_g
const client_secret = process.env.CLIENT_SECRET; // export CLIENT_SECRET=Udrp43Eh6oCyRtN_n4tS5w

var global_access_token = '';
var global_ready_token = false;

function refresh_tokens(resolve, reject) {
  request.post(
    {
      "url" : "https://api.freeagent.com/v2/token_endpoint",
      "auth": {
        "username" : client_id,
        "password" : client_secret
      },
      "form": {
        "grant_type": "refresh_token",
        "refresh_token" : refresh_token,
        "client_id" : client_id,
        "client_secret" : client_secret
      }
    },
    (err, response, body) => {
      if(err) {
        console.log(response);
        reject(error);
      } else {
        console.log(body);
        var content = JSON.parse(body);
        if(content.error) {
          console.log(content.error);
          reject(content.error);
        } else {
            global_access_token = content.access_token;
            global_refresh_token = content.refresh_token;
            global_ready_token = true;
            setTimeout(refresh_tokens, content.expires_in-1000);
            resolve(global_access_token);
        }
      }
    });
}

function init_tokens() {
  return new Promise((resolve, reject) => {
    if(global_ready_token){
      resolve(global_access_token);
    } else {
      refresh_tokens(resolve, reject);
    }
  });
}

exports.createInvoice = (req, res) => {
  init_tokens().then(function(access_token){
    axios({
        "method":"POST",
        "url":"https://api.freeagent.com/v2/invoices",
        "headers":{
        "content-type":"application/json",
        "authorization":"Bearer " + access_token,
        },"data":
          { "invoice":
            {
              "contact":"https://api.freeagent.com/v2/contacts/8781413",
              "dated_on":"2019-10-12",
              "due_on":"2019-10-17",
              "reference":"Test 0003",
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
  }).catch((error)=>{
    console.log(error);
    res.status(404).send('Eror');
  });
}
