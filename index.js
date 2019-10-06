/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const axios = require("axios");

//exports.createInvoice = (req, res) => {

// axios({
//     "method":"POST",
//     "url" : "https://api.freeagent.com/v2/token_endpoint",
//     "headers":{
//     "content-type":"application/json",
//     },
//     "auth": {
//     "username" : "8-lfM3g7Bzb0YAjYoyJw_g",
//     "password" : "Udrp43Eh6oCyRtN_n4tS5w"
//     },
//     "data":{
//       "grant_type": "authorization_code",
//       "code" : "16_-UxG2pI2OMYqLJeaKe08X9MivmGQyBcKZlGfkY",
//       "redirect_uri" : "https://developers.google.com/oauthplayground",
//       "client_id" : "8-lfM3g7Bzb0YAjYoyJw_g",
//       "client_secret" : "Udrp43Eh6oCyRtN_n4tS5w"
//     }
//   })
//   .then(function(response){
//       console.log(response.data.access_token);

      let access_token = '1bGZzarXLe-6EmjWjTtk0WpO2BGoPadEB8pUQK5M_';

      axios({
          "method":"POST",
          "url":"https://api.freeagent.com/v2/invoices",
          "headers":{
          "content-type":"application/json",
          "authorization":"Bearer 1bGZzarXLe-6EmjWjTtk0WpO2BGoPadEB8pUQK5M_",
          },"data":{
          "status":"Draft",
          "comments":"Test",
          "ec_status":"EC Services",
          "currency":"EUR",
          "invoice_items": [
              {
                'description':'Test InvoiceItem',
                'item_type':'Hours',
                'price':'100.0',
                'quantity':'1.0'
              }
          ],
          "contact":"https://api.freeagent.com/v2/contacts/8781413",
          "reference":"FACT001",
          "dated_on":"2019-10-04",
          "payment_terms_in_days":"à payer dans les 15 jours"
          }
          })
          .then((response)=>{
            console.log(response)
          })
          .catch((error)=>{
            console.log(error)
          });
  //  })
  // .catch(function (error) {
  //   console.log(error);
  // });
