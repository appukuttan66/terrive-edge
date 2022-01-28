let search = location.search.replace("?/","").split("/"),
	params = {
		author: search[0],
		permlink: search[1]
	},
	comments = {};

get()
function get() {
	bridge("bridge.get_discussion",params,function(r) {
		console.log(r.result)
		comments = r.result
		
		for (let comment in comments) {
			let data = comments[comment];
			data.body = DOMPurify.sanitize(marked.marked(data.body));

			if (comments[comment] && comments[comment].permlink != params.permlink) {
				console.log(comment,data)
				let pre = comments[data.parent_author+"/"+data.parent_permlink];

				q("main").innerHTML += `<div class="bubble">
					<div class="bubble-head"><img src="https://images.ecency.com/webp/u/${data.author}/avatar/small"> <span>${data.author}</span></div>
					<div class="bubble-body">
						<blockquote>
							<div class="pre-author">${pre.author}</div>
							${DOMPurify.sanitize(pre.body,{
								FORBID_TAGS: ["p","img","span","sub","center","h1","h2","h3","h4","h5","h6","hr"]
							}).substring(0,150)}
						</blockquote>
						<div>${data.body}</div>
						<div class="bubble-foot">
							<span class="liked">${data.active_votes.length || ""}</span>
						</div>
				</div>`
			}
		}
	})
}