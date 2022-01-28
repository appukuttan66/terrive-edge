let search = location.search.replace("?/","").split("/"),
	params = {
		author: search[0],
		permlink: search[1]
	},
	morep = {
		account: search[0],
		sort: 'blog',
		limit: 9
	},
	step = 0;

if (!search[1]) location.href = "../profile/?/"+search[0]

get()
more()
replies()
share()

marked.setOptions({
	baseUrl: './?/',
	
})
function get() {
bridge('bridge.get_post',params,function(r){
	if (!r.error) {
		push(r.result)
	} else {
		console.log(r.error)
	}
})
}
function replies () {
	q("#chats").src = "../chats/?/" + params.author + '/' + params.permlink;
	bridge('condenser_api.get_content_replies',{author: params.author, permlink: params.permlink},function(r){
		if(!r.error && r.result.length != 0) {
			repl(r)
		} else {
			console.log(r,r.error)
		}
	})
}
function share() {
	const url = encodeURIComponent(location.href)
	q("#whatsapp").href = "https://web.whatsapp.com/send?text="+url;
	q("#reddit").href = "https://reddit.com/submit?url="+url;
	q("#twitter").href = "https://twitter.com/intent/tweet?url="+url;
}
function repl(r) {
	for (let rep of r.result) {
		q("#repl").innerHTML += `<p><span class="b">${rep.author}</span> ${DOMPurify.sanitize(marked.marked(rep.body),{
			USE_PROFILES: {html: true}
		})}</p> <a href="../chats/?/${rep.author}/${rep.permlink}></a>`;
	}
	if (r.result.length > 3) {
		over()
	}

}
function over() {
	q("#repl").classList.add("over")
}
function more () {
	bridge('bridge.get_account_posts',morep,function(r) {
		if(!r.error) {
			for (let post of r.result) {
				console.log(post);

				let meta = post.json_metadata;
				if (meta.image) {
					q(".img-tray").innerHTML += `<div class="img-wrap" style="background-image: url('https://images.ecency.com/webp/400x0/${meta.image[0]}');">
						<a href="../view/?/${post.author}/${post.permlink}" class="img-shadow">
							<div>
								<span><img src="../assets/icons/heart-fill.svg"> ${post.active_votes.length} </span>
								<span><img src="../assets/icons/chat-fill.svg"> ${post.children} </span>
							</div>
							</a>
						</div>`;
				}
			}
		} else {
			console.log(r.error)
		}
	})
}
function push(r) {
	let meta = r.json_metadata,
		voters = r.active_votes.map(function(r){return r.voter});

	console.log(r)
	qa(".pa").forEach(function(ele){
		ele.innerHTML = r.author;
	})
	q(".user").href = `../profile/?/${r.author}`
	q(".pp").src = `https://images.ecency.com/webp/u/${r.author}/avatar/small`;
	q(".post-body").innerHTML = DOMPurify.sanitize(marked.marked(r.body),{
		USE_PROFILES: {html: true},
		FORBID_TAGS: ['img']
	});
	q(".post-tags").innerHTML = ptags(meta.tags,"..")
	qa(".lks").forEach( function(ele) {
		ele.innerHTML = r.active_votes.length;
	})
	qa(".pay").forEach(function(ele){
		ele.innerHTML = r.payout.toFixed(2);
	})
	q(".date").innerHTML = timeDiff(r.created)

	if (meta.image.length > 1) {
		step = (1/meta.image.length)*100;
		q("#step").style.width = step+"%";
	}
	for (let img of meta.image) {
		q(".post-img-wrap").innerHTML += `<img class="main-img" src="https://images.ecency.com/webp/0x500/${img}">`
	}
	q(".main-img").classList.add("active")

	console.log(voters)

	if (voters.includes(u)) {
		console.log(voters.includes(u))
		q(".like").classList.add("liked")
	}
	else {
		console.log("nope")
	}
}

function next () {
	const ele = q(".main-img.active");
	let cstep = parseInt(q("#step").style.width);
	ele.classList.remove("active")

	const nele = ele.nextSibling || q(".main-img");

	nele.classList.add("active");

	if (cstep <= (100 - step)) {
		q("#step").style.width = cstep + step +"%";
	} else {
		q("#step").style.width = step + "%";
	}
}
function prev () {
	const ele = q(".main-img.active");
	let cstep = parseInt(q("#step").style.width);
	ele.classList.remove("active")

	let nele = ele.previousSibling

	if (nele.nodeType !== 1 || !nele) {
		nele = q(".main-img:last-child")
	}
	nele.classList.add("active");

	if (cstep > step) {
		q("#step").style.width = cstep - step +"%"
	} else {
		q("#step").style.width = "100%";
	}
}
function voteView() {
	q(".vw-wrap").classList.replace("d-none","d-flex")
	perc(q("#votew"))
}
function popHide(e,t) {
	if (e.target == t) {
		t.classList.replace("d-flex","d-none")
	}
}
function perc (el) {
	q("#vw-perc").innerHTML = el.value + "%"
}
function voting() {
	vote(params.author,params.permlink,q('#votew').value * 100,function(r){
		console.log(r)
		if (r.success) {
			q(".like").classList.add("liked")
		} else {
			alert(r.message)
		}
		q(".vw-wrap").classList.replace("d-flex","d-none")
	})
}
q("#chat-button").addEventListener("click",function(){
	q(".chats-tray").classList.toggle("d-none")
})
q("#close").addEventListener("click",function(){
	q(".chats-tray").classList.add("d-none");
})