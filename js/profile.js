const au = location.search.replace(/\?\/|\?q=|\?u=/g,"") || u,
			params = {
				account: au,
				sort: 'blog',
				limit: 18
			};

bridge("bridge.get_profile",{account: au, observer: u},function(r) {
	console.log(r)
	const data = r.result;
	set(data)
})

call()
function blog() {
	reset("blog")
	params.sort = 'blog';
	call()
}
function posts() {
	reset("posts")
	params.sort = 'posts';
	call()
}
function info() {
	reset("info")
	params.sort = 'feed';
	call()
}
function reset(name) {
	q(".nav-item.active").classList.remove("active")
	q(".nav-item."+name).classList.add("active")
	q(".img-tray").innerHTML = "";
	params.start_author = null;
	params.start_permlink = null;
}
function call() {
	bridge("bridge.get_account_posts",params,function(r) {
		if(!r.error) {
			for (let post of r.result) {
				console.log(post)
				const meta = post.json_metadata;
				if(meta.image) {
					let c = "";

					if (post.author != au) {
						c = c + "re "
					}else if (meta.image.length > 2) {
						c = c + "alb"
					}
					q(".img-tray").innerHTML += `<div class="img-wrap ${c}" style="background-image: url('https://images.ecency.com/webp/400x0/${meta.image[0]}');" data-tr-author="${post.author}" data-tr-permlink="${post.permlink}">
						<a href="../view/?/${post.author}/${post.permlink}" class="img-shadow">
							<div>
								<span><img src="../assets/icons/heart-fill.svg"> ${post.active_votes.length} </span>
								<span><img src="../assets/icons/chat-fill.svg"> ${post.children} </span>
							</div>
							</a>
						</div>`
				}
			}
		}else {
			console.error(r.error);
		}
	})
}

function set(d) {
	const meta = d.metadata.profile,
		  stats = d.stats;

	q(".ppic").src = "https://images.ecency.com/webp/u/"+d.name+"/avatar/medium"
	q(".pa").innerText = d.name;
	q(".about").innerText = meta.about;
	q(".location").innerHTML = meta.location;
	q(".website").href = meta.website;
	q(".website").innerText = meta.website.replace("https://","").replace("http://","")
	q("#post-count").innerText = d.post_count;
	q("#followers").innerText = stats.followers;
	q("#following").innerText = stats.following
	if (d.context.followed) {
		q("#follow").innerText = "Followed"
		q("#follow").classList.add("active");
	}
}
function follow() {
	let folparms = [
		'follow', {
			follower: u,
			following: au,
			what: ['blog']
		}
	];

	if (q("#follow").classList.contains("active")){
		folparms[1].what = ['']
	}

	window.hive_keychain.requestCustomJson( u, 'follow', "Posting", JSON.stringify(folparms), `Follow ${au}`, function(r){
		console.log(r)
		if(r.success) {
			q("#follow").classList.toggle("active");
			if (folparms[1].what[0] == 'blog') {
				q("#follow").innerText = "Followed"
			} else {
				q("#follow").innerText = "Follow"
			}
		}
	})
}
window.addEventListener("scroll",function(){
	if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
		params.start_author = q(".img-wrap:last-child").getAttribute("data-tr-author");
		params.start_permlink = q(".img-wrap:last-child").getAttribute("data-tr-permlink");
		call()
	}
})