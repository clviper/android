//Created by @clviper
//Script based on the work already researched by NCC and Sensepost.
//Additional research done by me for the Bypass to SSLCertificateChecker-PhoneGap-Plugin and Outsystems SSL Pinning Plugin

//CHANGEME
var burpRootCA = "/data/local/tmp/certificates/ca.crt"

Java.perform(function x() {
	

	    console.log("");
	    console.log("[.] Android Certificate Pinning Bypass");



	    var CertificateFactory = Java.use("java.security.cert.CertificateFactory");
	    var FileInputStream = Java.use("java.io.FileInputStream");
	    var BufferedInputStream = Java.use("java.io.BufferedInputStream");
	    var X509Certificate = Java.use("java.security.cert.X509Certificate");
	    var KeyStore = Java.use("java.security.KeyStore");
	    var TrustManagerFactory = Java.use("javax.net.ssl.TrustManagerFactory");
	    var SSLContext = Java.use("javax.net.ssl.SSLContext");

	    // Load CAs from an InputStream
	    console.log("[+] Loading our CA...")
	    cf = CertificateFactory.getInstance("X.509");
	    
	    try {
		
	    	var fileInputStream = FileInputStream.$new(burpRootCA);
	    }
	    catch(err) {
	    	console.log("[ERROR] " + err);
	    }
	    
	    var bufferedInputStream = BufferedInputStream.$new(fileInputStream);
	  	var ca = cf.generateCertificate(bufferedInputStream);
	    bufferedInputStream.close();

		var certInfo = Java.cast(ca, X509Certificate);
	    console.log("[o] Our CA Info: " + certInfo.getSubjectDN());

	    // Create a KeyStore containing our trusted CAs
	    console.log("[+] Creating a KeyStore for our CA...");
	    var keyStoreType = KeyStore.getDefaultType();
	    var keyStore = KeyStore.getInstance(keyStoreType);
	    keyStore.load(null, null);
	    keyStore.setCertificateEntry("ca", ca);
	    
	    // Create a TrustManager that trusts the CAs in our KeyStore
	    console.log("[+] Creating a TrustManager that trusts the CA in our KeyStore...");
	    var tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
	    var tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
	    tmf.init(keyStore);
	    console.log("[+] Our TrustManager is ready...");

	    console.log("[+] Hijacking SSLContext methods now...")
	    console.log("[-] Waiting for the app to invoke SSLContext.init()...")

	   	SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").implementation = function(a,b,c) {
	   		console.log("[o] App invoked javax.net.ssl.SSLContext.init...");
	   		SSLContext.init.overload("[Ljavax.net.ssl.KeyManager;", "[Ljavax.net.ssl.TrustManager;", "java.security.SecureRandom").call(this, a, tmf.getTrustManagers(), c);
	   		console.log("[+] SSLContext initialized with our custom TrustManager!");
	   	}

   try{
	var CertificatePinner = Java.use('okhttp3.CertificatePinner');
	CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function (){
          console.log("[-] okHTTP3 CertificatePinner Called!");
         };

   }catch(err){}




    try{
    	var OkHttpClient = Java.use("com.squareup.okhttp.OkHttpClient");
    	OkHttpClient.setCertificatePinner.implementation = function(certificatePinner){
        	// do nothing
    		console.log("[-] okHTTP setCertificatePinner Called!. Bypassing it.");
    		return this;
    	};
    }catch(err){
    }
  
    try{
	// Invalidate the certificate pinner checks (if "setCertificatePinner" was called before the previous invalidation)
    	var CertificatePinner = Java.use("com.squareup.okhttp.CertificatePinner");
    	CertificatePinner.check.overload('java.lang.String', '[Ljava.security.cert.Certificate;').implementation = function(p0, p1){
        	// do nothing
        	console.log("[-] okHTTP Certificate Pinner Called! [Certificate]");
        	return;
    	};
    	CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function(p0, p1){
        	// do nothing
        	console.log("[-] okHTTP Certificate Pinner Called! [List]");
        	return;
    	};
    }catch(err){
    }

    //Bypass Outsystems SSL Pinning Plugin

    try{
	var OutsystemsPinning = Java.use("com.outsystems.plugins.sslpinning.pinning.X509TrustManagerWrapper");
     OutsystemsPinning.getPinningHash.overload('android.content.Context', 'java.lang.String').implementation = function(a,b){
        console.log("[-] Outsystems SSLPinning X509TrustManagerWrapper called. Returning null json file");
	return null;
     }
    }
    catch(err){
    }
    
    //Bypass SSLCertificateChecker-PhoneGap-Plugin
    try{
	var CordovaClass = Java.use("nl.xservices.plugins.SSLCertificateChecker")
	CordovaClass.execute.overload('java.lang.String', 'org.json.JSONArray', 'org.apache.cordova.CallbackContext').implementation = function(a,b,c){
		c.success("CONNECTION_SECURE");
		return true;
        }

    }catch(err){}

    try{
	      var ANDROID_VERSION_M = 23;

	      var DefaultConfigSource = Java.use("android.security.net.config.ManifestConfigSource$DefaultConfigSource");
	      var NetworkSecurityConfig = Java.use("android.security.net.config.NetworkSecurityConfig");

	      DefaultConfigSource.$init.overload("boolean", "int").implementation = function(usesCleartextTraffic, targetSdkVersion){
		     console.log("[-] Nougat Modifying DefaultConfigSource constructor");
		     return this.$init.overload("boolean", "int").call(this, usesCleartextTraffic, ANDROID_VERSION_M);
	      };

	      NetworkSecurityConfig.getDefaultBuilder.overload("int").implementation = function(targetSdkVersion){
		     console.log("[-] Nougat getDefaultBuilder original targetSdkVersion => " + targetSdkVersion.toString());
		     return this.getDefaultBuilder.overload("int").call(this, ANDROID_VERSION_M);
	      };
     }catch(err){
     }


		try {

		    var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
		    TrustManagerImpl.verifyChain.implementation = function (untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
			return untrustedChain;
		    }

		} catch (err) {
		}


});
