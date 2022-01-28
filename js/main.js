let params = {
		account: u,
		sort: "feed",
		start_author: null,
		start_permlink: null
	};

unread(function(r){
	q("#unread").innerHTML = r.result.unread;
	q("#unread").style.display = "flex";
})

feed()
if (window.innerWidth > (84*parseInt(getComputedStyle(document.body).fontSize))) tags()
tags()
q("#pp").src = `https://images.ecency.com/webp/u/${u}/avatar/small`

function feed() {
	bridge("bridge.get_account_posts", params, function(r) {
		const json = r.result;

		if (!json || json.length === 0) {
			q('.post-tray').innerHTML = `<div class="card">
				<h1>No feeds to Show</h1>
				<span>Go ahead, follow some people</span>
			</div>`
		}

		for (let post of json) {
			let	meta = post.json_metadata,
					v1 = "", v2 = "", v = post.active_votes.length;

			if (meta.image && meta.image[0]) {

				if (post.active_votes.length > 3) {
					v1 = post.active_votes[0].voter;
					v2 = post.active_votes[1].voter;
					v = post.active_votes.length - 2;
				}
				q(".post-tray").innerHTML += `<div class="post" data-tr-author="${post.author}" data-tr-permlink="${post.permlink}">
			  	<div class="post-head"><img src="https://images.ecency.com/webp/u/${post.author}/avatar/small"> <a href="./profile/?/${post.author}">${post.author}</a> <img class="dots" src="../assets/icons/three-dots.svg"></div>
			  	<img src="https://images.ecency.com/webp/600x0/${meta.image[0]}" onerror="ie(this)" onclick="location.href = './view/?/${post.author}/${post.permlink}'">
			  	<div class="post-nav">
			  		<img src="./assets/icons/heart-fill.svg">
			  		<img src="./assets/icons/chat-fill.svg">
			  		<img src="./assets/icons/cursor-fill.svg">
			  	</div>
			  	<div class="post-body">
			  		<p>Liked by <strong>${v1}</strong>, <strong>${v2}</strong> and <strong>${v}</strong> more.</p>
			  		<br>
			  		<p>${DOMPurify.sanitize(marked.marked(post.body.substring(0,150)),
			  			{
			  				USE_PROFILES: {html: true},
			  				FORBID_TAGS: ['img']
			  			})} ${ptags(meta.tags,".")}</p>
			  		<br>
			  		<span>Last updated ${timeDiff(post.updated)}</span>
			  		<br>
			  		<a href="./view/?/${post.author}/${post.permlink}">See all ${post.children} replies</a>
			  	</div>
			  </div>`
			}
		}
	})
}
function tags () {
	let coolTags = ["photography","shroom","nature","food","wierd"],
		i = Math.floor(Math.random() * coolTags.length);
		console.log(i,coolTags[i])
	bridge("bridge.list_communities", {query: coolTags[i], limit: 5}, function (r) {
		for (let res of r.result ) {
			console.log(res)
			q(".side-tray").innerHTML += `<div>
			<img src="https://images.ecency.com/webp/u/${res.name}/avatar/small" onerror="this.src='../assets/images/nomage-sq.jpg'">
			<a href="./topics?q=${res.name}">${res.title}</a>
			</div>`
		}
	})
}
function search(ele) {
	q(".search").innerHTML = "";
	q(".search").classList.replace("d-none","d-flex")
	bridge("condenser_api.lookup_accounts", [ele.value,5], function(r) {
		for (let s of r.result) {
			q(".search").innerHTML += `<a href="./profile/?q=${s}"><img src="https://images.ecency.com/webp/u/${s}/avatar/small"> ${s}</a><br>`;
		}
	})
}

window.addEventListener("click",function() {
	q(".search").classList.replace("d-flex","d-none")
})
window.addEventListener("scroll",function(){
	if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
		params.start_author = q(".post:last-child").getAttribute("data-tr-author");
		params.start_permlink = q(".post:last-child").getAttribute("data-tr-permlink");
		feed()
	}
})

function ie(el) {
	el.src = "./assets/images/nomage.jpg"
}
