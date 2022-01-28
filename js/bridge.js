let u = localStorage.getItem("username"),
		nsfw = localStorage.getItem("nsfw"),
		rpc = localStorage.getItem("rpc") || "https://api.hive.blog";

console.log('%c%s', 'color: crimson; font-size: 2rem;',"STOP !! Using the console could compromize your keys !")

function bridge(method,params,callback) {
	fetch(rpc, {
	  method: 'POST',
	  referrer: "",
	  body: JSON.stringify({
	    "jsonrpc":"2.0",
	    "method": method,
	    "params": params,
	    "id":1
	  }),
	  mode: 'cors'
	}).then(function(r){
	  r.json().then(function(res){
	    callback(res)
	  })
	}).catch(function(err){
		alert(err)
	})
}
function unread(c) {
	bridge("bridge.unread_notifications", {
		account: u
	}, function(r) {
		if (u && r.result.unread !== 0) {
			c(r)
		}
	})
}
function q(qr) {
	return document.querySelector(qr)
}
function qa(qr) {
	return document.querySelectorAll(qr)
}
function timeDiff(inp) {
  const date = new Date(inp+"Z"),
  	    diff = new Date() - date;

  let time = diff / 1000,
  	  unit = " seconds ago";

  if (time > (24 * 3600)) {
    time = Math.round(time / ( 3600 * 24 ))
    unit = " days ago."
  }
  else if (time > 3600) {
    time = Math.round(time / 3600);
    unit = " hours ago."
  }
  else if (time > 60) {
    time = Math.round(time / 60)
    unit = " minutes ago."
  }
  else {
    time = Math.round(time)
  }

  if(time == 1) {
    unit = unit.replace("s "," ")
  }

  const result = time + unit
  return result;
}
function ptags(t,ru) {
	let final = []
	for (let i of t) {
		final.push(`<a href="${ru}/topics/?q=${i}">#${i}</a>`)
	}

	return final.toString().replaceAll(","," ");
}
function upload(file,callback) {
	let url = localStorage.im || "https://ipfs.infura.io:5001/api/v0/add",
			host = localStorage.ih || "https://ipfs.infura.io/ipfs/";

	file.arrayBuffer().then(function(arbuf){
    const blob = new Blob([new Uint8Array(arbuf)], {
      type: 'application/octet-stream'
    }),
    formd = new FormData();

    formd.append('file', blob, file.name);

	  fetch(url, {
	    method: 'POST',
	    body: formd,
	    mode: 'cors'
	  }).then(function(fr){
		  fr.json().then(function(r){
		  	hash = r.skylink || r.Hash;
		   	const link = host + hash;
		   	callback(link,hash)
	  	})
	  })
	})
}
function clean(str) {
	str = str.replace(/@(\S+)/gi,'<a href="../profile/?q=$1">@$1</a>')
	return str
}
function vote(a,p,w,c) {
	window.hive_keychain.requestVote(u,p,a,w,function(r) {
		c(r)
	})
}