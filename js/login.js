
function check() {
	if (!window.hive_keychain) {
		alert("No Chain")
	}
	else {
		keychain()
	}
}
function keychain () {
	const user = prompt("username")
	window.hive_keychain.requestEncodeMessage(user, user, "#login", 'Posting', function(r){
		console.log(r)
		window.hive_keychain.requestVerifyKey(user, r.result, 'Posting', function(re) {
			console.log(re)
			if (re.result === "#login") {
				localStorage.setItem("username",user)
				location.href = "../"
			}
		})
	})
}
function hivesigner() {
	localStorage.setItem("username","appukuttan66")
	location.href = "../"
}