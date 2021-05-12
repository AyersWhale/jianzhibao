'use strict'
import { Config } from 'c2-mobile'
var AuthHost = Config.mainUrl;
// var clientServerHost = 'http://172.16.81.126:8080/c2_portal';

class Constant{

  
   clientServerHost = 'http://10.100.29.17/c2_portal';
    
    clientId = 'EA13F6DC07AB47EDA3CD20862BF290BA';
    clientSecret = 'FA6BFE5220964841972E1EC156459F3F';
    redirect_uri = AuthHost + '/appIndex.html';

    Auth_URL = AuthHost + 'oauth2/authorize?client_id=' + clientId + '&response_type=code&scope=read,dev&redirect_uri=' + redirect_uri;
    Logout_URL = AuthHost + 'oauth2/logout?client_id=' + clientId + '&response_type=code&redirect_uri=' + redirect_uri;

    strApiBaseUr = AuthHost + "/mobileapp/";
    strApiBaseUr1 = AuthHost + "/mobilebusiness/";
    strApiBaseUr2 = AuthHost + "/mobileworkflow/";
    strApiBaseUr3 = AuthHost + "/mobileoafile/";
    strApiBaseUr4 = AuthHost + "/appVersion/";

}



module.exports = Constant;