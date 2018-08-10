Java.perform(function x() {
	console.log("");
	console.log("[.] Android Nougat Trust CAs Bypass");
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
	}catch(err){}


	try {
		var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
			TrustManagerImpl.verifyChain.implementation = function (untrustedChain, trustAnchorChain, host, clientAuth, ocspData, tlsSctData) {
			return untrustedChain;
		}
	}catch (err) {}
});
