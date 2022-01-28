let media = [];
function lvl2img() {
	q(".lvl-1-tray").classList.replace("d-flex","d-none")
	q(".lvl-2-tray").classList.replace("d-none","d-flex")
	prog(3)
	stps()
}
function lvl3() {
	q(".lvl-2-tray").classList.replace("d-flex","d-none");
	q(".lvl-3-tray").classList.replace("d-none","d-flex");
	prog(5)
	stps()
	const eles = q("#preview").children;
	for (let ele of eles) { media.push(ele.src); }
}
function stps () {
	let nowstp = q('h2.active')
	nowstp.nextElementSibling.classList.add("active")
	nowstp.classList.remove("active")
}
function prog(nu) {
	q(".level-line:nth-child("+(nu-1)+")").classList.add("active")
	q(".level-wrap:nth-child("+nu+")").classList.add("active")
}
q("#imgfile").addEventListener("dragenter",function(e) {
	e.target.classList.add("over")
})
q("#imgfile").addEventListener("dragexit",function(e) {
	e.target.classList.remove("over")
})
q("#imgfile").addEventListener("change",function(e) {
	let files = e.target.files;
	console.log(files);
	files.forEach(function(file) {
		media.push(file)
	})
})

function done() {
	for (let file of media) {
		upload(file,function(l,h) {
			q("#preview").innerHTML += `<img class="pre-grid" src="${l}">`;
		})
	}
}