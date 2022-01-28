const nsfw = localStorage.getItem("nsfw"),
      rpc = localStorage.getItem("rpc"),
      rpcEle = document.getElementById("rpc")
      nsfwEle = document.getElementById("nsfw"),
      nodeEle = document.getElementById("nodes"),
      nodeW = document.getElementById("node-wrap"),
      nodeBtn = document.getElementById("node-btn"),
      pp = document.getElementById("pp"),
      u = localStorage.getItem("username"),
      ppfile = document.getElementById("ppic"),
      imghEle = document.getElementById("ih");

let imgh = localStorage.getItem("im") || "https://ipfs.infura.io:5001/api/v0/add", hash;

function get() {
  nodeW.classList.toggle("d")
  nodeBtn.classList.toggle("active")
  if (nodeW.classList.contains("d")) {
    nodes()
    nodeBtn.innerHTML = "Hide Node Health"
  } else {
    nodeBtn.innerHTML = "Show Node Health"
  }
}
function nodes () {
  fetch("https://beacon.peakd.com/api/nodes").then(function(r){
    r.json().then(function(res){
      nodeEle.innerHTML = ""
      for (let node of res) {
        console.log(node)
        let status = "";
        if (node.score < 98 && node.score > 85) {
          status = "fine"
        }
        else if (node.score < 86 && node.score > 50) {
          status = "mid"
        }
        else if (node.score < 51) {
          status = "red"
        }
        nodeEle.innerHTML += `<div><span>${node.name}</span> <progress class="${status}" value="${node.score}" max="100">${node.score}</progress></div>`
      }
    })
  })
}

if (nsfw == "false") {
  nsfwEle.checked = true
}
if (rpc && rpc !== "") {
  rpcEle.value = rpc
}
pp.src = `https://images.ecency.com/webp/u/${u}/avatar/medium`;
imgpf()
imghEle.value = imgh
function imgpf () {
  if (imgh && imgh.split("/").includes("skynet")) {
    imgp = "https://siasky.net/";
    localStorage.setItem("ih",imgp)
  } else {
    imgp = "https://ipfs.infura.io/ipfs/";
    localStorage.setItem("ih",imgp)
  }
}
nsfwEle.addEventListener("change",function(){
  if (nsfwEle.checked == true) {
    localStorage.setItem("nsfw","false")
  } else {
    localStorage.setItem("nsfw","true")
  }
})
rpcEle.addEventListener("change",function(){
  localStorage.setItem("rpc",rpcEle.value)
})
ppfile.addEventListener("change",function(e){
  const file = e.target.files[0];

  file.arrayBuffer().then(function(arbuf){
    const blob = new Blob([new Uint8Array(arbuf)], {
      type: 'application/octet-stream'
    }),
    formd = new FormData();

    formd.append('file', blob, file.name)

    upload(formd,function(l) {
      console.log(l)

      const op = [
        [
          'account_update2', {
            account: u,
            'json_metadata': '',
            'posting_json_metadata': JSON.stringify({
              profile: {
                name: "ak66",
                about: "",
                cover_image: "",
                profile_image: l,
                website: "",
                location: "",
                version: 2
              }
            })
          }
        ]
      ];


      window.hive_keychain.requestBroadcast(u, op, 'Posting', function(r){
        console.log(r)
        setTimeout(function(){
          pp.src = `https://images.ecency.com/webp/u/${u}/avatar/medium?${new Date().getTime()}`;
        }, 1000)
      })
    })
  })
  console.log(file)
})
function imghost(ele) {
  localStorage.setItem("im", ele.value);
  console.log(ele.value)
  imgp = ele.value;
  imgpf()
}
function logout () {
  localStorage.removeItem("username");
  location.href = "../login/"
}
function re () {
  localStorage.clear()
  localStorage.setItem("username",u)
  location.reload()
}
function done() {
  const re = new URLSearchParams(location.search),
        url = re.get("re");

  location.href = url || "../";
}
function upload(fd,callback) {
  fetch(imgh, {
    method: 'POST',
    body: fd,
    mode: 'cors'
  }).then(function(fr){
    fr.json().then(function(r){
      hash = r.skylink || r.Hash;
      const link = imgp + hash;
      callback(link,hash)
      console.log(link,r,hash)
    })
  })
}