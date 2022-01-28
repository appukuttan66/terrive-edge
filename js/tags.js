const s = location.search,
	  p = new URLSearchParams(s);

let tag = null;

if(p.has("q")) {
	tag = p.get("q")
}

const params = {
  			"sort": "created",
  			"tag": tag,
  			"limit": 18,
	  		"start_author": null,
	  		"start_permlink": null
		};

if (tag) {
	q("#topic").innerText = tag;
	q(".pill.active").innerHTML = tag;
}

load()
unread(function(r){
	q("#unread").innerHTML = r.result.unread;
	q("#unread").classList.replace("d-none","d-flex");
})
function load () {
	bridge('bridge.get_ranked_posts',params,function(res){
		filter(res)
	})
}
function filter(r) {
	const json = r.result;

	for (let post of json) {
		let	meta = post.json_metadata, c;
		meta.tags = meta.tags || [];
		console.log(meta,meta.tags)
		if (meta.tags.includes("nsfw") && nsfw !== "false") {
			c = "blur"
		}

		if (meta.image && meta.image[0]) {
			q(".img-tray").innerHTML += `<div class="img-wrap ${c}" data-tr-author="${post.author}" data-tr-permlink="${post.permlink}" style="background-image: url('https://images.ecency.com/webp/300x300/${meta.image[0]}');">
			<a href="../view/?/${post.author}/${post.permlink}" class="img-shadow">
				<div>
					<span><img src="../assets/icons/heart-fill.svg"> ${post.active_votes.length} </span>
					<span><img src="../assets/icons/chat-fill.svg"> ${post.children} </span>
				</div>
				</a>
			</div>`;
		}
	}
}
tagQ()
function tagQ() {
	bridge("condenser_api.get_trending_tags", [tag,3], function(relTags) {
		let	rel = relTags.result;

		for (let r of rel) {
			let te = q('.pill:nth-child('+ (rel.indexOf(r) + 2) +')');
			te.innerHTML = r.name;
			te.href = `?q=${r.name}`
		}
	})
}

window.addEventListener("scroll",function(){
	if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
		q(".foot").innerHTML = '<span class="loader"></span>'
		params.start_author = q(".img-wrap:last-child").getAttribute("data-tr-author");
		params.start_permlink = q(".img-wrap:last-child").getAttribute("data-tr-permlink");
		load()
	}
})
q("#search").addEventListener("change",function(){
	location.search = "?q=" + q("#search").value.toLowerCase()
})
dyn()
function dyn(){
	q("#settinghref").search = "?re="+encodeURIComponent(location.href)
}