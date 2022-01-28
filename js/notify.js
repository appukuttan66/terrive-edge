let params = {
	account: u,
	limit: null,
	last_id: null
};

set()
function set() {
	unread(function(r) {
		params.limit = r.result.unread;
		params.last_id = null;
		q(".notify-tray").innerHTML = ""
		q(".notify-tray").classList.add("teal")
		get()
	})
}
function get() {
	bridge('bridge.account_notifications',params,function(r){
		for (let n of r.result) {
			console.log(n)

			q(".notify-tray").innerHTML += `<a id="${n.id}" href="/view/?/${n.url.replace("@","")}">
				<img src="https://images.ecency.com/webp/u/${n.msg.split(" ")[0].replace("@","")}/avatar/small"><span>${n.msg}</span>
			</a>`
		}
	})
}
q(".all").addEventListener("click",function(){
	q(".notify-tray").innerHTML = "";
	q(".notify-tray").classList.remove("teal")
	q(".notify-nav span.active").classList.remove("active");
	q(".all").classList.add("active")
	params.limit = 30;
	get()
})
q("#mark").addEventListener("click",function(){
	let j = [
		"setLastRead",
		{
			"date": new Date().toISOString().split(".")[0].replace("Z","")
		}
	]
	window.hive_keychain.requestCustomJson("appukuttan66","notify","Posting",JSON.stringify(j),"Mark Unread",function(r){
  		if(r.success == true) {
  			window.location.href = window.location.href
  		} else {
  			alert(r.error)
  		}
	})
})
window.addEventListener("scroll",function(){
	if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight && params.limit == 30) {
		params.limit = 30;
		params.last_id = q(".notify-tray a:last-child").id;
		get()
	}
})