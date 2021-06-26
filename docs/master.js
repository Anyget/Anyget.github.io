const theme_list = [
    "VSCode_Dark",
    "VSCode_Light",
    "HighDark",
    "5ch",
    "futaba",
    "Twitter",
    "Discord"
]
let deal_list = [];
let all_data = {};
let dragging = null;
let style_list = [];
let templates = [
        {
            "template" : "",
            "conf_htm" : "",
            "conf_col" : "",
            "conf_data" : [],
        }
    ]
let boxes_sort = [0,1,2]
let settings = {
    "views":{
        name:"表示",
        type:"head",
        list:{
            "colors":{
                name:"色",
                type:"head",
                list:{
                    "themeselect":{
                        name:"テーマ",
                        info:"エディタの全体的色設定",
                        type:"select",
                        init:0,
                        options:{
                            "VSCode_Dark":"01",
                            "VSCode_Light":"02",
                            "HighDark":"03",
                            "5ch":"04",
                            "futaba":"05",
                            "Twitter":"06",
                            "Discord":"07"
                        },
                        f:themechange
                    },
                    "highlightcheck":{
                        name:"色を付ける",
                        info:"",
                        type:"checkbox",
                        init:false,
                        label:"変数に色を付ける",
                        f:highlightchange
                    }
                }
            },
            "size":{
                name:"寸法",
                type:"head",
                list:{
                    "sortboxes":{
                        name:"パネルの並び替え",
                        info:"3枚のパネルを任意の順番で並び替えます",
                        type:"select",
                        init:0,
                        options:{
                            "縦長―メイン―二分割":"0,1,2",
                            "縦長―二分割―メイン":"0,2,1",
                            "メイン―縦長―二分割":"1,0,2",
                            "メイン―二分割―縦長":"1,2,0",
                            "二分割―メイン―縦長":"2,1,0",
                            "二分割―縦長―メイン":"2,0,1"
                        },
                        f:sortboxes
                    }
                }
            }
            
        }
    }
}
let now_temp = 0
let deal_sets = []
let inputing = {}
let now_theme = 0
const SUBFUNCTIONNAMES = [
    "テンプレートを変更",
    "変数の詳細設定",
    "ランダム文字列生成",
    "簡易プレビュー",
    "テキストメモ",
    "変数特定値メモ"
]
let selectedsubfunction = [0,1,2,3,4,5]
let subfunctionelements = []
let intersectobjects = new Set()
let windowsizelog = {w:window.innerWidth+0,h:window.innerHeight+0}
let mexsets = {}
const PRE_TEMPLETES={
    "5ch": {
        "deal_list":[],"deal_sets":[],"all_data":{"liner_num":{"dataset_adder":"1","dataset_adderm":true,"dataset_anchor?":true,"dataset_anchor":">>","dataset_fix?":true,"dataset_datalist?":false},"liner_name":{"dataset_adder":0,"dataset_adderm":false,"dataset_anchor?":false,"dataset_anchor":"","dataset_fix?":false,"dataset_datalist?":false},"liner_mail":{"dataset_adder":0,"dataset_adderm":false,"dataset_anchor?":false,"dataset_anchor":"","dataset_fix?":false,"dataset_datalist?":false},"blocker_message":{"dataset_adder":0,"dataset_adderm":false,"dataset_anchor?":false,"dataset_anchor":"","dataset_fix?":false,"dataset_datalist?":false}},"style_list":[],"templates":[{"template":"$num$：$name$ [$mail$]\n|message|","conf_htm":"<div class=\"$\"><input type=\"text\" class=\"$text liner_num\" placeholder=\"num\" list=\"list_liner_num\" value=\"\"></input></div>：<div class=\"$\"><input type=\"text\" class=\"$text liner_name\" placeholder=\"name\" list=\"list_liner_name\" value=\"\"></input></div> [<div class=\"$\"><input type=\"text\" class=\"$text liner_mail\" placeholder=\"mail\" list=\"list_liner_mail\" value=\"\"></input></div>]<br><textarea class=\"| blocker_message\" placeholder=\"message\"></textarea>","conf_col":"<span style=\"color:#FF0000;\">$num$</span>：<span style=\"color:#FF0000;\">$name$</span> [<span style=\"color:#FF0000;\">$mail$</span>]\n<span style=\"color:#0000FF;\">|message|</span>","conf_data":["liner_num","liner_name","liner_mail","blocker_message"]}],"inputing":{"liner_num":"1","liner_name":"名無し","liner_mail":"sage","blocker_message":""},"now_temp":0
    },
    "twitter":{
        "deal_list":[],"deal_sets":[],"all_data":{"liner_name":{"dataset_adder":0,"dataset_adderm":false,"dataset_anchor?":false,"dataset_anchor":"","dataset_fix?":false,"dataset_datalist?":false},"liner_screenname":{"dataset_adder":0,"dataset_adderm":false,"dataset_anchor?":false,"dataset_anchor":"","dataset_fix?":false,"dataset_datalist?":false},"liner_time":{"dataset_adder":0,"dataset_adderm":false,"dataset_anchor?":false,"dataset_anchor":"","dataset_fix?":false,"dataset_datalist?":false},"blocker_message":{"dataset_adder":0,"dataset_adderm":false,"dataset_anchor?":false,"dataset_anchor":"","dataset_fix?":false,"dataset_datalist?":false},"liner_rt":{"dataset_adder":0,"dataset_adderm":false,"dataset_anchor?":false,"dataset_anchor":"","dataset_fix?":false,"dataset_datalist?":false},"liner_fav":{"dataset_adder":0,"dataset_adderm":false,"dataset_anchor?":false,"dataset_anchor":"","dataset_fix?":false,"dataset_datalist?":false}},"style_list":[],"templates":[{"template":"$name$ @$screenname$ $time$\n|message|\n↻$rt$ ♥$fav$","conf_htm":"<div class=\"$\"><input type=\"text\" class=\"$text liner_name\" placeholder=\"name\" list=\"list_liner_name\" value=\"\"></input></div> @<div class=\"$\"><input type=\"text\" class=\"$text liner_screenname\" placeholder=\"screenname\" list=\"list_liner_screenname\" value=\"\"></input></div> <div class=\"$\"><input type=\"text\" class=\"$text liner_time\" placeholder=\"time\" list=\"list_liner_time\" value=\"\"></input></div><br><textarea class=\"| blocker_message\" placeholder=\"message\"></textarea>↻<div class=\"$\"><input type=\"text\" class=\"$text liner_rt\" placeholder=\"rt\" list=\"list_liner_rt\" value=\"\"></input></div> ♥<div class=\"$\"><input type=\"text\" class=\"$text liner_fav\" placeholder=\"fav\" list=\"list_liner_fav\" value=\"\"></input></div>","conf_col":"<span style=\"color:#FF0000;\">$name$</span> @<span style=\"color:#FF0000;\">$screenname$</span> <span style=\"color:#FF0000;\">$time$</span>\n<span style=\"color:#0000FF;\">|message|</span>\n↻<span style=\"color:#FF0000;\">$rt$</span> ♥<span style=\"color:#FF0000;\">$fav$</span>","conf_data":["liner_name","liner_screenname","liner_time","blocker_message","liner_rt","liner_fav"]}],"inputing":{"liner_name":"名無し","liner_screenname":"noname","liner_time":"3 秒前","blocker_message":"","liner_rt":"","liner_fav":""},"now_temp":0
    }
}
function epo_function(es){
    
    es.forEach(e=>{
        if (e.intersectionRatio > 0){
            intersectobjects.add(e.target)
            unieasypreviewreloader(Array.from(document.getElementById("easy_preview").children).indexOf(e.target))
        }else{
            intersectobjects.delete(e.target)
        }
    })
}
function settings_r(v,d,kk){
    if (v.type == "head"){
        document.getElementById("settings").insertAdjacentHTML("beforeend",`<h1 id="settings_${kk}" style="font-size:${2/Math.sqrt(d)}rem">${v.name}</h1>`)
        let t = document.getElementById("settingtab")
        for (let i = 0; i < d-1; i++) {
            t = t.lastElementChild;
        }
        t.insertAdjacentHTML("beforeend", `<div><input type="checkbox" id="settingtab_${kk}"><label for="settingtab_${kk}"><div></div></label><a href="#settings#settings_${kk}">${v.name}</a></div>`)
        Object.keys(v.list).forEach(vk=>{
            settings_r(v.list[vk],d+1,`${kk}_${vk}`)
        })
    }else{
        document.getElementById("settings").insertAdjacentHTML("beforeend", `<div class="settdiv"><h3>${v.name}</h3><span class="settinfo">${v.info}</span></div>`)
        let te = document.getElementById("settings").lastElementChild
        switch (v.type){
            case "checkbox":
                te.insertAdjacentHTML("beforeend",`<label><input type="checkbox" ${v.init?"checked":""} id="settings_${kk}" onchange="settings.${kk.split("_").join(".list.")}.f()">${v.label}</label>`)
                break
            case "select":
                te.insertAdjacentHTML("beforeend",`<select id="settings_${kk}" onchange="settings.${kk.split("_").join(".list.")}.f()"></select>`)
                Object.keys(v.options).forEach(i=>{
                    te.lastElementChild.insertAdjacentHTML("beforeend",`<option value="${v.options[i]}">${i}</option>`)
                })
                te.lastElementChild.children[v.init].selected = true

                break
        }
    }
}
let easypreviewobserver = new IntersectionObserver(epo_function,{root:document.getElementById("easy_preview")})
window.onload = function () {
    Object.keys(settings).forEach(cc=>{
        settings_r(settings[cc],1,cc)
    })
    let cc = 0
    for (let i of document.getElementsByClassName("functionselect")){
        let c = 0
        SUBFUNCTIONNAMES.forEach(n=>{
            i.insertAdjacentHTML("beforeend",`<option>${n}</option>`)
            if (c == selectedsubfunction[cc]){
                i.lastElementChild.selected = true
            }
            c++
        })
        subfunctionelements.push(i.parentNode.parentNode.cloneNode(true))
        fitselector(i)
        cc++
    }
    randgen()
};
window.addEventListener('beforeunload', function (event) {
    event.preventDefault()
    event.returnValue = ''
})
window.addEventListener("resize",e=>{
    Array.from(document.getElementById("box").children).forEach(i=>{
        if (i.style.width) {
            i.style.width = window.innerWidth/windowsizelog["w"]*Number(i.style.width.replace("px",""))  + "px"
        }
    })
    Array.from(document.getElementById("box4").children).forEach(i=>{
        if (i.style.height) {
            i.style.height = window.innerHeight/windowsizelog["h"]*Number(i.style.height.replace("px",""))  + "px"
        }
    })
    for (let i of document.getElementsByClassName("functionselect")) {
        fitselector(i)
    }
    windowsizelog["w"] = window.innerWidth
    windowsizelog["h"] = window.innerHeight
})
function escapeHtml(str) {
    let div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML.split("<br>").join("\n").split('"').join("&quot;");
};
function changetemp() {
    let col = "";
    let htm = "";
    let mode = "normal";
    let data = [];
    let temp = document.getElementById("template").value;
    for (let i = 0; i < temp.length; i++) {
        let char = temp[i];
        if (char != "\\") {
            switch (mode) {
                case ("normal"):
                    switch (char) {
                        case ("$"):
                            mode = "liner";
                            col += '<span style="color:#FF0000;">$';
                            htm += '<div class="$"><input type="text" class="$text liner_';
                            data.push("liner_");
                            break;
                        case ("|"):
                            mode = "blocker";
                            col += '<span style="color:#0000FF;">|';
                            htm += '<textarea class="| blocker_';
                            data.push("blocker_");
                            break;
                        default:
                            col += escapeHtml(char);
                            htm += escapeHtml(char);
                            break;
                    };
                    break;
                case ("liner"):
                    switch (char) {
                        case ("$"):
                            mode = "normal";
                            col += "$</span>";
                            let t = escapeHtml(data[data.length - 1]).replace("liner_", "")
                            htm += `" placeholder="${t}" list="list_liner_${t}" value=""></input></div>`;
                            break;
                        default:
                            col += escapeHtml(char);
                            htm += escapeHtml(char);
                            data[data.length - 1] += char;
                            break;
                    };
                    break;
                case ("blocker"):
                    switch (char) {
                        case ("|"):
                            mode = "normal";
                            col += "|</span>";
                            htm += `" placeholder="${escapeHtml(data[data.length - 1]).replace("blocker_", "")}"></textarea>`;
                            break;
                        default:
                            col += escapeHtml(char);
                            htm += escapeHtml(char);
                            data[data.length - 1] += char;
                            break;
                    };
                    break;
            };
        } else {
            if (i < temp.length) {
                i++;
                col += '<span style="color:#00FF00;">\\' + escapeHtml(temp[i]) + "</span>";
                htm += escapeHtml(temp[i]);
                if (mode != "normal") {
                    data[data.length - 1] += temp[i]
                };
            };
        };
    };
    htm = htm.split("</textarea>\n").join("</textarea>")
    htm = htm.split("\n").join("<br>")
    if (mode == "normal") {
        let backupconfdata = templates[now_temp]["conf_data"];
        document.getElementById("edited").innerHTML = col.split("\n").join("<br>");
        document.getElementById("form_inp").innerHTML = htm;
        templates[now_temp]["conf_htm"] = htm;
        templates[now_temp]["conf_col"] = col;
        templates[now_temp]["conf_data"] = Array.from(new Set(data))
        templates[now_temp]["conf_data"].forEach(i => {
        if (!Object.keys(all_data).includes(i)) {
            all_data[i] = ({"dataset_adder": 0,"dataset_adderm":false, "dataset_anchor?": false, "dataset_anchor": "", "dataset_fix?": false, "dataset_datalist?": false,"memo":{}});
            Array.from(document.getElementsByClassName("dataman")).forEach(s=>{
                s.insertAdjacentHTML("beforeend", `<option name="${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</option>`)
                if (s.id == "datamemopul" && i.startsWith("blocker_")){
                    s.lastChild.hidden = true
                }
            })
            document.getElementById("replace_list").insertAdjacentHTML("beforeend", `<li><input type="checkbox" id="replacecheck_${escapeHtml(i)}"></input><label for="replacecheck_${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</label></li>`)
        };
        if (!Object.keys(inputing).includes(i)){
            inputing[i] = ""
        }
    })
    deparr(Object.keys(inputing),templates[now_temp]["conf_data"]).forEach(i=>{
        let t = document.getElementById("form_inp").getElementsByClassName(i)[0]
        t.value = inputing[i]
        taras(t)
    })
    while (style_list.length < deal_list.length) {
        style_list.push({})
    }
    let n = 0
    deal_list.forEach(ii => {
        let box = mbyn(n).lastElementChild;
        let t = deal_sets[n]["use_temp"]
        templates[t]["conf_data"].forEach(x => {
            if (backupconfdata.includes(x) || now_temp != t) {
                style_list[n][x] = []
                if (x.startsWith("liner_")){
                    Array.from(box.getElementsByClassName(x)).forEach(cd => {
                        style_list[n][x].push(cd.parentNode.style.cssText)
                    })
                }else{
                    Array.from(box.getElementsByClassName(x)).forEach(cd => {
                        style_list[n][x].push(cd.style.cssText);
                    })
                }
                
            }else if (!Object.keys(style_list[n]).includes(x)) {
                style_list[n][x] = []
            }
        })
        n++;
    })
    templates[now_temp]["template"] = temp + "";
    messagereloadbynowtemp()
    } else {
        alert("Error:不正な構文");
    };
};
function messagereloadbynowtemp(){
    n = 0
    deal_list.forEach(ii => {
        let box = mbyn(n).lastElementChild;
        if (deal_sets[n]["use_temp"] == now_temp){
            box.innerHTML = templates[now_temp]["conf_htm"];
            Object.keys(all_data).forEach(xx => {
                if (typeof ii[xx] === "undefined") {
                    ii[xx] = "";
                };
                let cc = 0
                Array.from(box.getElementsByClassName(xx)).forEach(iii => {
                    iii.value = ii[xx];
                    if (xx.startsWith("blocker_")) {
                        iii.style = style_list[n][xx][cc]
                    } else {
                        iii.parentNode.style = style_list[n][xx][cc]
                    }
                    cc++
                })
            });
        }
        n++;
    });
}
function addmess() {
    for (let i = 0; i < document.getElementById("messv").value; i++) {
        document.getElementById("messages").insertAdjacentHTML("beforeend",messtemper(now_temp+1,templates[now_temp]["conf_htm"]));
        let formi_c = document.getElementById("form_inp")
        let now = document.getElementById("cd")
        now.id = ""
        let num = deal_list.length
        deal_list.push({})
        datamemodivreload()
        Object.keys(all_data).forEach(k=>{
            deal_list[num][k] = ""
        })
        deal_sets.push({
            "use_temp":now_temp+0,
            "locked":false
        })
        templates[now_temp]["conf_data"].forEach(i => {
            let n = 0
            Array.from(now.getElementsByClassName(i)).forEach(o=>{
                let nnnnn = formi_c.getElementsByClassName(i)[n];
                (i.startsWith("blocker_")?o:o.parentNode).style = (i.startsWith("blocker_")?nnnnn:nnnnn.parentNode).style.cssText;
                deal_list[num][i] = o.value = nnnnn.value
                n++
            })
        })
        templates[now_temp]["conf_data"].forEach(k => {
            let added = document.getElementById("form_inp").getElementsByClassName(k)[0].value
            let na = Number(all_data[k]["dataset_adder"])
            if (/^\-?[0-9]+(\.[0-9]+)?$/.test(added) && na != 0) {
                added = Number(added)+na
            }
            inputing[k] = added
            Array.from(document.getElementById("form_inp").getElementsByClassName(k)).forEach(i=>{
                i.value = inputing[k]
            })
        });
    }
    let nnn = getn()
    mexsets[nnn] = {};
    deal_list.forEach(d => {
        if (Object.keys(mexsets[nnn]).includes(d[nnn])) {
            mexsets[nnn][d[nnn]] = mexsets[nnn][d[nnn]] + 1
        } else {
            mexsets[nnn][d[nnn]] = 1
        }
    })
    let obj = document.getElementById("messages");
    obj.scrollTop = obj.scrollHeight;
    datamemoreload()
};

function datapulchange(e) {
    if (e.target.value != "設定変更する変数を選択") {
        document.getElementById("dataset_adder").disabled = false;
        let selecting = Object.keys(all_data)[(e.target.selectedIndex) - 1];
        document.getElementById("dataset_adder").value = all_data[selecting]["dataset_adder"];
        document.getElementById("dataset_adderm").disabled = false;
        document.getElementById("dataset_adderm").checked = all_data[selecting]["dataset_adderm"];
        document.getElementById("dataset_fix?").disabled = false;
        document.getElementById("dataset_fix?").checked = all_data[selecting]["dataset_fix?"];
        if (e.target.value.startsWith("$")) {
            document.getElementById("dataset_anchor?").disabled = false;
            document.getElementById("dataset_anchor?").checked = all_data[selecting]["dataset_anchor?"];
            document.getElementById("dataset_anchor").disabled = !all_data[selecting]["dataset_anchor?"]
            document.getElementById("dataset_anchor").value = all_data[selecting]["dataset_anchor"];
            document.getElementById("dataset_datalist?").disabled = false;
            document.getElementById("dataset_datalist?").checked = all_data[selecting]["dataset_datalist?"];
        } else {
            document.getElementById("dataset_anchor?").disabled = true;
            document.getElementById("dataset_anchor?").checked = false;
            document.getElementById("dataset_anchor").value = "";
            document.getElementById("dataset_datalist?").disabled = true;
            document.getElementById("dataset_datalist?").checked = false;
        }
        document.getElementById("dataset_datalist?").disabled = true;

    };
}

function dataset_adderchange(e){
    all_data[Object.keys(all_data)[(document.getElementById("datapul").selectedIndex) - 1]]["dataset_adder"] = e.target.value;
}

document.addEventListener("input", (e) => {
    let target = e.target;
    let num;
    let inp;
    if (target.matches(".message textarea,.message input")) {
        let clas = target.className.replace(/^[^ ]* /, "");
        if (target.matches("textarea")) {
            num = nbym(target.parentNode.parentNode);
            inp = target.value;
            deal_list[num][clas] = inp;
            Array.from(intersectobjects).forEach(i => {
                
                unieasypreviewreloader(Array.from(document.getElementById("easy_preview").children).indexOf(i))
            })
        } else {
            num = nbym(target.parentNode.parentNode.parentNode);
            inp = target.value;
            mexsets[clas][deal_list[num][clas]] -= 1
            mexsets[clas][inp] = typeof mexsets[clas][inp] == "undefined"?1:mexsets[clas][inp]+1
            datamemodivreload()
            deal_list[num][clas] = inp;
            Array.from(intersectobjects).forEach(i => {
                
                unieasypreviewreloader(Array.from(document.getElementById("easy_preview").children).indexOf(i))
            })
        };
    };
    if (target.matches(".message textarea,.message input,#form_inp textarea,#form_inp input")){
        taras(target)
    }
    if (target.matches("#form_inp textarea,#form_inp input")){
        inputing[target.classList[1]] = target.value
    }
});
function taras(target){
    let tp = target.matches("textarea") ? target.parentNode : target.parentNode.parentNode
    Array.from(tp.getElementsByClassName(target.classList[1])).filter(n => n != target).forEach(k => {
        k.value = target.value
    })
}
function closebtnclick(e){
    if (e.target.parentNode.parentNode.classList.contains("checked_md")){
        while (document.getElementsByClassName("checked_md").length>0){
            mesdel(document.getElementsByClassName("checked_md")[0])
        }
    }else{
        mesdel(e.target.parentNode.parentNode)
    }
}
function changefix() {
    let selecting = Object.keys(all_data)[document.getElementById("datapul").selectedIndex - 1];
    all_data[selecting]["dataset_fix?"] = document.getElementById("dataset_fix?").checked;
}
function flapdatalist() {
    let selecting = Object.keys(all_data)[document.getElementById("datapul").selectedIndex - 1];
    all_data[selecting]["dataset_datalist?"] = document.getElementById("dataset_datalist?").checked;
    if (!document.getElementById("dataset_datalist?").checked) {
        document.getElementById(`list_${selecting}`).id = `n_list_${selecting}`
    } else {
        document.getElementById(`n_list_${selecting}`).id = `list_${selecting}`
    }
}
function dragstart(e) {
    if (!e.currentTarget.classList.contains("checked_md")){return false}
    dragging = e.target
    document.querySelector("body").classList.add("nonono");
    let tuka = document.createElement("div")
    Array.from(document.getElementsByClassName("checked_md")).forEach(i=>{
        let ss = i.cloneNode(true)
        ss.lastElementChild.id=""
        tuka.appendChild(ss)
    })
    tuka.style.zIndex="-10"
    tuka.style.display="flex"
    tuka.style.position="absolute"
    tuka.style.flexDirection="column"
    tuka.style.width = e.target.getBoundingClientRect().width + "px"
    tuka.id="tuka"
    document.body.appendChild(tuka)
    e.dataTransfer.setDragImage(tuka,0,0);
}
function dragover(e) {
    e.preventDefault();
    if (!(e.target.classList.contains("messagediv") && document.querySelector("body").classList.contains("nonono"))) {return false;}
    e.target.classList.add("dragover");
}
function dragleave(e) {
    e.target.classList.remove("dragover");
}
function drop(e) {
    document.getElementById("tuka").outerHTML = ""
    if (!(e.target.classList.contains("messagediv") && document.querySelector("body").classList.contains("nonono"))) { return false; }
    e.preventDefault();
    document.querySelector("body").classList.remove("nonono");
    e.target.classList.remove("dragover");
    if (e.target.classList.contains("checked_md")){return false}
    let target_num = nbym(e.target)
    let f = e.target.matches(".checked_md~*")
    let newdeal = deal_list.map( list => ({...list}))
    while (document.getElementsByClassName("checked_md").length > 0){

        let ragging = f ? document.getElementsByClassName("checked_md")[document.getElementsByClassName("checked_md").length-1] : document.getElementsByClassName("checked_md")[0]
        ragging.classList.remove("checked_md")
        let dragging_num = nbym(ragging)
        let to = nbym(e.target)
        mcheckr(ragging)
        let c = ragging.cloneNode(true)
        ragging.outerHTML = ""
        newdeal = moveAt(newdeal,dragging_num,to)
        deal_sets = moveAt(deal_sets,dragging_num,to)
        if (target_num > dragging_num) {
            if (e.target.matches("*:last-child")){
                e.target.parentNode.appendChild(c)
            }else{
                e.target.parentNode.insertBefore(c,e.target.nextElementSibling)
            }
        } else {
            e.target.parentNode.insertBefore(c,e.target)
        }
    };
    Object.keys(all_data).forEach(k=>{
        if (all_data[k]["dataset_fix?"]){
            let c = 0
            deal_list.forEach(d=>{
                newdeal[c][k] = d[k]
                Array.from(mbyn(c).getElementsByClassName(k)).forEach(t=>{
                    t.value = d[k]
                })
                c++
            })
        }
    })
    deal_list = newdeal
    lockreload()
};
function dragend(e) {
    if (document.getElementById("tuka")){
        document.getElementById("tuka").outerHTML = ""
    }
    document.querySelector("body").classList.remove("nonono");
}
function anchorcheck() {
    let c = document.getElementById("dataset_anchor?").checked
    document.getElementById("dataset_anchor").disabled = !c;
    all_data[Object.keys(all_data)[(document.getElementById("datapul").selectedIndex) - 1]]["dataset_anchor?"] = c;
}
function anchorchange(e){
    all_data[Object.keys(all_data)[(document.getElementById("datapul").selectedIndex) - 1]]["dataset_anchor"] = e.target.value;
}
function unescapeHtml(str) {
    let div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
                        .replace(/>/g,"&gt;")
                        .replace(/ /g, "&nbsp;")
                        .replace(/\r/g, "&#13;")
                        .replace(/\n/g, "&#10;");
    return div.textContent || div.innerText;
}
function plainreload() {
    let alll = []
    let c = 0
    deal_list.forEach(i => {
        c++
        let sent = templates[deal_sets[c-1]["use_temp"]]["template"]
        templates[deal_sets[c-1]["use_temp"]]["conf_data"].forEach(d => {
            let dd = d.startsWith("liner_")?`$${d.replace("liner_","")
            .replace(/\\/g,"\\\\")
            .replace(/\$/g,"\\$")
            .replace(/\|/g,"\\|")
            }$`:`|${d.replace("blocker_","")
            .replace(/\\/g,"\\\\")
            .replace(/\$/g,"\\$")
            .replace(/\|/g,"\\|")}|`
            let idd = []
            if (d.startsWith("blocker_")){
                i[d].split("\n").forEach(l=>{
                    if (![...document.getElementById("plainindentex").value].includes(l.charAt(0))){
                        idd.push(document.getElementById("plainindentspace").value+l)
                    }else{
                        idd.push(l)
                    }
                })
                idd = idd.join("\n")
            }else{
                idd = i[d]
            }
            sent = sent.split(dd).join(escapeHtml(idd));
        })
        alll.push(sent)
    })
    document.getElementById("previewplain").value = unescapeHtml(alll.join(document.getElementById("plainset").value))
    document.getElementById("plainsize").innerText = document.getElementById("previewplain").value.length
}
function previewanchor(s, ok) {
    let out = ""
    let sent = "a" + s;
    while (sent) {
        sent = sent.slice(1)
        out += sent ? sent[0] : ""
        let nnn = ""
        let nnns = []
        Object.keys(ok).forEach(k => {
            if (sent.startsWith(ok[k])) {
                let ith = sent.slice(0, ok[k].length)
                out = out.slice(0, -1)
                sent = sent.slice(ok[k].length)
                let sss = 0
                deal_list.map(xx => xx[k]).forEach(l => {
                    sss++;
                    if (l == "") { return };
                    if (sent.startsWith(l)) {
                        if (nnn != "") {
                            if (l == nnn) {
                                nnns.push(sss)
                            } else if (nnn.length < l.length) {
                                nnns = [sss]
                                nnn = l
                            }
                        } else {
                            nnns = [sss]
                            nnn = l
                        }
                    }
                })
                if (nnn != ""){
                    out += `<a href="#preview_${nnns[0]}" class="anchorspan" onmouseover="anchorspanmouseover(event)" onmouseout="anchorspanmouseout(event)" data-to="${nnns.join(",")}">${ith}${nnn}</a>`
                    sent = sent.slice(nnn.length)
                }else{
                    out += ith
                }
                sent = "a" + sent
                return;
            }
        })
    }
    return out;
}
function radiochange(e) {
    document.getElementsByClassName("radised")[0].classList.remove("radised");
    document.getElementById(e.target.id.replace("radio_","")).classList.add("radised");
    switch (e.target.id) {
        case ("radio_preview"):
            document.getElementById("preview").innerHTML = ""
            let anchorok = {}
            let dm = deal_list.map(xx => Object.values(xx).join("")).join("")
            Object.keys(all_data).forEach(a => {
                if (!all_data[a]["dataset_anchor?"]) { return };
                if (all_data[a]["dataset_anchor"] === "") { return };
                let dms = dm.split(all_data[a]["dataset_anchor"])
                if (dms.length>10000 || dms.length<0) { return };
                if (Object.values(anchorok).includes(all_data[a]["dataset_anchor"])) { return };
                anchorok[a] = escapeHtml(all_data[a]["dataset_anchor"]);
            })
            let s = 0;
            deal_list.forEach(i => {
                s++;
                previewunimessage(s,anchorok)
            })
            break;
        case ("radio_plaintext"):
            plainreload();
            break;
    }
}
function previewunimessage(s,anchorok){
    let sent = templates[deal_sets[s - 1]["use_temp"]]["template"]
    templates[deal_sets[s - 1]["use_temp"]]["conf_data"].forEach(d => {
        let dd = d.startsWith("liner_") ? `$${d.replace("liner_", "")
            .replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/\|/g, "\\|")
            }$` : `|${d.replace("blocker_", "")
                .replace(/\\/g, "\\\\")
                .replace(/\$/g, "\\$")
                .replace(/\|/g, "\\|")}|`
        sent = sent.split(dd).join(escapeHtml(deal_list[s - 1][d]));
    })
    sent = previewanchor(sent, anchorok).replace(/(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+)/, "<a href='$1'>$1</a>")
    document.getElementById("preview").insertAdjacentHTML("beforeend",`<div class="neko" id="preview_${s}">${sent.split("\n").join("<br>")}</div>`)
}
function previewplaininput(){
    document.getElementById("plainsize").innerText = document.getElementById("previewplain").value.length
}
function randgen() {
    let str = ""
    str += document.getElementById("check_uaz").checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
    str += document.getElementById("check_daz").checked ? "abcdefghijklmnopqrstuvwxyz" : "";
    str += document.getElementById("check_num").checked ? "0123456789" : "";
    str += document.getElementById("check_sim").checked ? "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" : "";
    str += document.getElementById("check_sp").checked ? " " : "";
    str += document.getElementById("check_inp").checked ? document.getElementById("randinp").value : "";
    str = str.replace(/(.)(?=.*(\1))/g, "");
    if (str.length != 0) {
        let len = Math.max(1, Number(document.getElementById("randlen").value))
        let man = Math.max(1, Number(document.getElementById("randman").value))
        let result = ""
        for (let ii = 0; ii < man; ii++) {
            for (let i = 0; i < len; i++) {
                result += str[Math.floor(Math.random() * str.length)];
            }
            result += "\n"
        }
        document.getElementById("randgenopt").value = result;
    }
}
function checkinpchange() {
    let t = document.getElementById("randinp");
    t.disabled = !t.disabled;
}
function datgen() {
    let temp = {}
    for (let tar of document.querySelectorAll(".datgen_div :not(#dat_title)")) {
        let mode = "normal"
        temp[tar.id] = ["text_"]
        for (let i = 0; i < tar.value.length; i++) {
            let char = tar.value[i]
            if (char != "\\") {
                switch (mode) {
                    case ("normal"):
                        switch (char) {
                            case ("$"):
                                mode = "liner";
                                temp[tar.id].push("liner_")
                                break;
                            case ("|"):
                                mode = "blocker";
                                temp[tar.id].push("blocker_")
                                break;
                            default:
                                temp[tar.id][temp[tar.id].length - 1] += escapeHtml(char)
                                break;
                        };
                        break;
                    case ("liner"):
                        switch (char) {
                            case ("$"):
                                mode = "normal";
                                temp[tar.id].push("text_")
                                break;
                            default:
                                temp[tar.id][temp[tar.id].length - 1] += escapeHtml(char)
                                break;
                        };
                        break;
                    case ("blocker"):
                        switch (char) {
                            case ("|"):
                                mode = "normal";
                                temp[tar.id].push("text_")
                                break;
                            default:
                                temp[tar.id][temp[tar.id].length - 1] += escapeHtml(char)
                                break;
                        };
                        break;
                };
            } else {
                if (i < tar.value.length) {
                    i++;
                    temp[tar.id][temp[tar.id].length - 1] += escapeHtml(tar.value[i]);
                };
            };
        }
        let newtemp = []
        temp[tar.id].forEach(function (p) {
            if ((Object.keys(all_data).includes(p)) || ((p.startsWith("text_")) && p != "text_")) {
                newtemp.push(p);
            }
        });
        temp[tar.id] = newtemp
    }
    let strs = []
    let title = escapeHtml(document.getElementById("dat_title").value)
    n = 0
    deal_list.forEach(m => {
        n++;
        strs.push("")
        Object.keys(temp).forEach(k => {
            let tar = temp[k]
            tar.forEach(t => {
                if (t.startsWith("text_")) {
                    strs[n - 1] += t.replace("text_", "")
                } else if (k === "dat_main") {
                    strs[n - 1] += " " + escapeHtml(m[t]).split("\n").join("<br>")+ " "
                } else {
                    strs[n - 1] += escapeHtml(m[t]).replace(/\n/g, "")
                }

            })
            strs[n - 1] += "<>"
        })
    })
    title = title != "" ? title : "UNKNOWN";
    strs[0] += title;
    let name = `${title}.dat`
    let blob = new Blob([strs.join("\n")], { type: "application/octet-stream" });
    let a = document.createElement('a');
    a.download = name;
    a.target = '_blank';
    a.href = window.webkitURL.createObjectURL(blob);
    a.click();
}
function save() {
    while (style_list.length < deal_list.length) {
        style_list.push({})
    }
    let n = 0;
    deal_list.forEach(d => {
        templates[now_temp]["conf_data"].forEach(c => {
            style_list[n][c] = []
            Array.from(mbyn(n).lastElementChild.getElementsByClassName(c)).forEach(cd=>{
                if (cd.classList.contains("|")) {
                    style_list[n][c].push(cd.style.cssText);
                } else {
                    style_list[n][c].push(cd.parentNode.style.cssText);
                }
            })
        })
        n++;
    })
    let j = JSON.stringify(
        { "deal_list": deal_list, 
        "deal_sets": deal_sets,
        "all_data": all_data, 
        "style_list": style_list,
        "templates": templates,
        "inputing": inputing,
        "now_temp":now_temp})
    let name = `${document.getElementById("save_inp").value != "" ? document.getElementById("save_inp").value : "UNKNOWN"}.json`
    let blob = new Blob([j], { type: "application/json" });
    let a = document.createElement('a');
    a.download = name;
    a.target = '_blank';
    a.href = window.webkitURL.createObjectURL(blob);
    a.click();
}
function tempsave() {
    while (style_list.length < deal_list.length) {
        style_list.push({})
    }
    let n = 0;
    deal_list.forEach(d => {
        templates[deal_sets[n]["use_temp"]]["conf_data"].forEach(c => {
            style_list[n][c] = []
            Array.from(mbyn(n).lastElementChild.getElementsByClassName(c)).forEach(cd=>{
                if (cd.classList.contains("|")) {
                    style_list.push(cd.style.cssText)
                } else {
                    style_list.push(cd.parentNode.style.cssText)
                }
            })
        })
        n++;
    })
    let j = JSON.stringify(
        { 
            "deal_list": [],
            "deal_sets":[],
            "all_data": all_data, 
            "style_list": [], 
            "templates": templates,
            "inputing":inputing,
            "now_temp":now_temp
        }
    )
    let name = `${document.getElementById("tempsave_inp").value != "" ? document.getElementById("tempsave_inp").value : "UNKNOWN"}.json`
    let blob = new Blob([j], { type: "application/json" });
    let a = document.createElement('a');
    a.download = name;
    a.target = '_blank';
    a.href = window.webkitURL.createObjectURL(blob);
    a.click();
}
function loadrap(f) {
    f.text().then(t => {
        load(JSON.parse(t))
    })
}
function load(n){
    all_data = n["all_data"];
    deal_list = n["deal_list"];
    deal_sets=n["deal_sets"];
    style_list = n["style_list"];
    templates = n["templates"];
    inputing = n["inputing"]
    now_temp=n["now_temp"]
    document.getElementById("messages").innerHTML = "";
    let x = 0;
    deal_list.forEach(d => {
        x++;
        document.getElementById("messages").insertAdjacentHTML("beforeend",
            messtemper(deal_sets[x - 1]["use_temp"] + 1, templates[deal_sets[x - 1]["use_temp"]]["conf_htm"]))
        let now = document.getElementById("cd")
        now.id = ""
        templates[deal_sets[x-1]["use_temp"]]["conf_data"].forEach(c=>{
            let z = 0
            Array.from(now.getElementsByClassName(c)).forEach(m=>{
                m.value = d[c]
                if (m.classList.contains("|")) {
                    m.style = style_list[x - 1][c][z]
                } else {
                    m.parentNode.style = style_list[x - 1][c][z]
                }
                z++
            })
        })
    })
    document.getElementById("template").value = templates[now_temp]["template"]
    changetemp()
    document.getElementById("datapul").innerHTML = "<option hidden selected>設定変更する変数を選択</option>"
    document.getElementById("datamemopul").innerHTML = "<option hidden selected>変数を選択</option>"
    document.getElementById("subssel").innerHTML = "<option hidden selected>変数を選択</option>"
    document.getElementById("datalists").innerHTML = ""
    document.getElementById("replace_list").innerHTML = ""
    Object.keys(all_data).forEach(c => {
        Array.from(document.getElementsByClassName("dataman")).forEach(s => {
            s.insertAdjacentHTML("beforeend", `<option name="${escapeHtml(c)}">${(escapeHtml(c) + "a").replace(/^[^_]*_|.$/g, c.startsWith("blocker_") ? "|" : "$")}</option>`)
            if (s.id == "datamemopul" && c.startsWith("blocker_")) {
                s.lastChild.hidden = true
            }
        })
        document.getElementById("replace_list").insertAdjacentHTML("beforeend", `<li><input type="checkbox" id="replacecheck_${escapeHtml(c)}"></input><label for="replacecheck_${escapeHtml(c)}">${(escapeHtml(c) + "a").replace(/^[^_]*_|.$/g, c.startsWith("blocker_") ? "|" : "$")}</label></li>`)
    })
}
function subs() {
    let sel = document.getElementById("subssel");
    let num = Math.floor(Number(document.getElementById("subsnum").value))
    let txts = document.getElementById("randgenopt").value.split("\n")
    if (sel.selectedIndex < 1) return false;
    if (num < 1) return false;
    let selecting = Object.keys(all_data)[sel.selectedIndex - 1]
    for (let i = num + 0; i - num < txts.length && i <= deal_list.length; i++) {
        if (!deal_sets[i-1]["locked"]){
            deal_list[i - 1][selecting] = txts[i - num]
            if (templates[deal_sets[i-1]["use_temp"]]["conf_data"].includes(selecting)) {
                mbyn(i-1).lastElementChild.getElementsByClassName(selecting)[0].value = txts[i - num];
            }
        }  
    }
}
document.addEventListener("keydown", e => {
    if (e.target.matches(".\\$text,.\\|")) {
        if (e.code === "ArrowRight" || (e.code === "ArrowDown" && e.target.classList.contains("|"))) {
            if ((e.target.selectionStart === e.target.selectionEnd) && (e.target.selectionStart === e.target.value.length)) {
                e.target.id = "sd"
                let nekoflag = false;
                for (let i of document.querySelectorAll(".\\$text,.\\|")) {
                    if (nekoflag) {
                        i.focus()
                        i.setSelectionRange(0, 0)
                        nekoflag = false;
                        break;
                    }
                    if (i.id === "sd") {
                        nekoflag = true;
                        i.id = "";
                    }
                }
                e.preventDefault()
            }
        } else if (e.code === "ArrowLeft" || (e.code === "ArrowUp" && e.target.classList.contains("|"))) {
            if ((e.target.selectionStart === 0) && (e.target.selectionEnd === 0)) {
                e.target.id = "sd";
                let nekoflag = false;
                for (let i of [].slice.call(document.querySelectorAll(".\\$text,.\\|"), 0).reverse()) {
                    if (nekoflag) {
                        i.focus();
                        i.setSelectionRange(i.value.length, i.value.length);
                        nekoflag = false;
                        break;
                    }
                    if (i.id === "sd") {
                        nekoflag = true;
                        i.id = "";
                    }
                }
                e.preventDefault();
            }
        } else if (e.code === "ArrowDown") {
            if (e.target.selectionStart === e.target.selectionEnd) {
                let n = e.target.parentNode
                let s = e.target.selectionStart
                while (n.previousSibling) {
                    if (n.previousSibling.nodeName === "#text") {
                        n = n.previousSibling
                        s += n.textContent.length
                    } else if (n.previousSibling.classList.contains("$")) {
                        n = n.previousSibling
                        s += n.firstChild.value.length
                    } else {
                        break;
                    }
                }
                n.id = "hd"
                let sflag = false;
                [...document.querySelectorAll(".message>*")].some(i => {
                    if (sflag) {
                        if (i.matches("textarea")) {
                            i.focus()
                            let a = i.value.includes("\n") ? Math.min(i.value.indexOf("\n"), s) : s
                            i.setSelectionRange(a, a)
                            return true;
                        }
                        if (i.matches("br") && !i.nextSibling.matches("textarea") || (i.matches(".\\$") && i.parentNode != e.target.parentNode.parentNode)) {
                            let nn = i
                            let ss = i.matches(".\\$") ? i.firstChild.value.length : 0;
                            while (nn.nextSibling.matches("br")) {
                                nn = nn.nextSibling
                            }
                            while (nn.nextSibling) {
                                if (nn.nextSibling.nodeName === "#text") {
                                    nn = nn.nextSibling
                                    ss += nn.textContent.length
                                } else if (nn.nextSibling.classList.contains("$")) {
                                    if (ss >= s) {
                                        break;
                                    }
                                    nn = nn.nextSibling
                                    ss += nn.firstChild.value.length
                                } else {
                                    break;
                                }
                            }
                            nn.firstChild.focus()
                            let a = Math.max(0, nn.firstChild.value.length - (ss - s))
                            nn.firstChild.setSelectionRange(a, a)
                            return true;
                        }
                    } else {
                        if (i.id === "hd") {
                            i.id = "";
                            sflag = true;
                        }
                    }
                })
                e.preventDefault();
            }
        }
    }
})
/*https://qiita.com/Sinraptor@github/items/1b3802db80eadf864633 のパクリ*/
function strWidth(str) {
    let canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        let context = canvas.getContext('2d');
        context.font = "10px sans-serif"
        let metrics = context.measureText(str);
        return metrics.width;
    }
    return -1;
}
function anchorspanmouseover(e){
    if (e.target.classList.contains("anchorspan")) {
        
        let d = []
        if (e.target.parentNode.parentNode.id == "preview" || (e.target.parentNode.parentNode.parentNode.id=="abss" && e.target.parentNode.parentNode.parentNode.dataset.per=="p")) {
            e.target.dataset.to.split(",").forEach(s => {
                let n = document.getElementById(`preview_${s}`)
                d.push(n.outerHTML.replace(' id="preview_', ' id="n_preview_').replace(/ class\=\"[^\"]*\"/, " class='abssneko'"))
            })
            document.getElementById("abss").dataset.per = "p"

        } else if (e.target.parentNode.parentNode.id == "easy_preview" || (e.target.parentNode.parentNode.parentNode.id == "abss" && e.target.parentNode.parentNode.parentNode.dataset.per == "e")){
            e.target.dataset.to.split(",").forEach(s => {
                if (!intersectobjects.has(e.target.parentNode)){
                    
                    unieasypreviewreloader(Number(s) - 1)
                }
                let n = document.getElementById("easy_preview").children[Number(s)-1]
                d.push(n.outerHTML.replace(/ class\=\"[^\"]*\"/, " class='abssneko'"))
            })
            document.getElementById("abss").dataset.per = "e"
        }
        if (!document.getElementById("abss").querySelector(".abssc:hover,.abssc[data-flag='true'],.abssc:hover~.abssc")){
            document.getElementById("abss").innerHTML = ""
        }
        let pos = e.target.getBoundingClientRect()

        if (e.target.parentNode.parentNode != document.getElementById("abss").firstChild && e.target.parentNode.parentNode.classList.contains("abssc")){
            document.getElementById("abss").firstChild.outerHTML = ""
        }
        document.getElementById("abss").insertAdjacentHTML("afterbegin",`<div class="abssc">${d.join("")}</div>`)
        let a = document.getElementById("abss").firstChild
        let pos_x = pos.left + strWidth(e.target.innerText + "aa")
        let pos_y = pos_x + a.clientWidth > window.innerWidth ? pos.top + e.target.clientHeight : pos.top
        if (pos_x > window.innerWidth*0.8){
            a.style.maxWidth = String(pos.left - strWidth(e.target.innerText + "aa")) + "px"
            pos_x = pos.left - a.clientWidth
        }else{
            a.style.maxWidth = String(window.innerWidth-pos_x) + "px"
        }
        
        a.style.display = "block"
        a.style.top = Math.floor(pos_y) + "px"
        a.style.left = Math.floor(pos_x) + "px"
        a.style.bottom = "auto"
        a.style.right = "auto"
        a.style.zIndex = Number(e.target.parentNode.parentNode.style.zIndex) + 1
        a.dataset.flag = "true"
    }
}
function anchorspanmouseout(e){
    if (e.target.matches(".anchorspan") && document.getElementById("abss").querySelector(".abssc:hover,.abssc[data-flag='true'],.abssc:hover~.abssc")){
        document.getElementById("abss").firstChild.dataset.flag = "false"
    }
}
function replace_allselect(){
    for (let i of document.getElementById("replace_list").children){
        i.firstChild.checked = "true"
    }
}
function replace_reflect(){
    for (let i of document.getElementById("replace_list").children) {
        i.firstChild.checked = !i.firstChild.checked
    }
}
function replacing(){
    let r_list = []
    for (let i of document.querySelectorAll("#replace_list input:checked")){
        r_list.push(i.id.replace("replacecheck_",""))
    }
    let g = document.getElementById("replace_g?").checked
    let flag = document.getElementById("replace_s?").checked ? "s" : ""
    flag += document.getElementById("replace_m?").checked ? "m" : ""
    flag += document.getElementById("replace_i?").checked ? "i" : ""
    flag += g ? "g" : ""
    let reg = new RegExp(document.getElementById("replace_a").value, flag)
    let n = 0;
    let rr_list = []
    for (let i of deal_list){
        n++;
        let to = mbyn(n-1).lastElementChild
        for (let r of r_list){
            i[r] = i[r].replace(reg,document.getElementById("replace_b").value)
            rr_list.push(r)
            if (templates[deal_sets[n-1]["use_temp"]]["conf_data"].includes(r)){
                to.getElementsByClassName(r)[0].value = i[r]
                taras(to.getElementsByClassName(r)[0])
            }
            if (!g){
                break
            }
        }
        if (!g) {
            break
        }
    }
}
function plainreplace(){
    if (document.getElementById("ps_reg_cb").checked){
        let reg = new RegExp(document.getElementById("plainsearch").value, "gi")
        document.getElementById("previewplain").value = document.getElementById("previewplain").value.replace(reg,document.getElementById("plainreplace").value)
    }else{
        document.getElementById("previewplain").value = document.getElementById("previewplain").value.split(document.getElementById("plainsearch").value).join(document.getElementById("plainreplace").value)
    }
    document.getElementById("plainsize").innerText = document.getElementById("previewplain").value.length
}
function temp_number_change(){
    let t = document.getElementById("temp_select_number")
    t.value = Math.floor(Number(t.value))
    let n = Number(t.value)
    if (n < 1){
        t.value = 1
    }
    if (templates.length<t.value){
        t.value = templates.length+1
        templates.push({
            "template" : "",
            "conf_htm" : "",
            "conf_col" : "",
            "conf_data" :[]
        })
    }
    now_temp = Number(t.value)-1
    document.getElementById("template").value = templates[now_temp]["template"]
    changetemp()
}
function temp_select_start_click(){
    document.getElementById("temp_select_number").value = 1
    temp_number_change()
}
function temp_select_prev_click(){
    document.getElementById("temp_select_number").value = Number(document.getElementById("temp_select_number").value)-1
    temp_number_change()
}
function temp_select_next_click() {
    document.getElementById("temp_select_number").value = Number(document.getElementById("temp_select_number").value)+1
    temp_number_change()
}
function temp_select_end_click() {
    document.getElementById("temp_select_number").value = templates.length
    temp_number_change()
}

function deparr(arr1,arr2){
    let arr1arr2 = [...arr1, ...arr2]
    dep = arr1arr2.filter(
        item => arr1.includes(item) && arr2.includes(item)
    )
    return [...new Set(dep)]
}
function confdep(n1,n2){
    return deparr(templates[deal_sets[n1]["use_temp"]]["conf_data"], templates[deal_sets[n2]["use_temp"]]["conf_data"])
}
function tempselectover(t){
    let el = t.parentNode.parentNode.nextElementSibling
    let s = nbym(el.parentNode)
    t.innerHTML = ""
    for (let i = 0; i < templates.length; i++) {
        t.insertAdjacentHTML("beforeend",`<option value="${i+1}"${deal_sets[s]["use_temp"] == i ? " selected" : ""}>${i+1}</option>`)
        
    }
}
function tempselectout(t){
    return false
}
function tempselected(e){
    let l = []
    if (e.target.parentNode.parentNode.parentNode.classList.contains("checked_md")) {
        l = Array.from(document.getElementsByClassName("checked_md"))
    } else {
        l = [e.target.parentNode.parentNode.parentNode]
    }
    l.forEach(t=>{
        let el = t.lastElementChild
        let s = nbym(el.parentNode)
        deal_sets[s]["use_temp"] = e.target.selectedIndex
        el.innerHTML = templates[e.target.selectedIndex]["conf_htm"]
        templates[e.target.selectedIndex]["conf_data"].forEach(d=>{
            Array.from(el.getElementsByClassName(d)).forEach(b=>{
                b.value = deal_list[s][d]
            })
        })
        tempselectover(t.getElementsByClassName("tempselect")[0])
        t.getElementsByClassName("tempselect")[0].children[e.target.selectedIndex].selected=true

    })
}
function tab_next_scroll(){
    let basevh = document.getElementById("tab_header").getBoundingClientRect().height*4/3
    let t = document.getElementById("tab_header_in")
    let inh = t.getBoundingClientRect().height
    if (Math.floor((Number(t.dataset.martop) - 1) * basevh) < Math.floor(inh) * -1) { return false }
    t.dataset.martop = String(Number(t.dataset.martop)-1)
    t.style.marginTop = `${Number(t.dataset.martop)*4}vh`
}
function tab_end_scroll(){
    let basevh = document.getElementById("tab_header").getBoundingClientRect().height*4/3
    let t = document.getElementById("tab_header_in")
    let inh = t.getBoundingClientRect().height
    t.dataset.martop = Math.floor(inh/Math.floor(basevh))*-1+1
    t.style.marginTop = `${Number(t.dataset.martop)*4}vh`
}
function tab_prev_scroll(){
    let t = document.getElementById("tab_header_in")
    if (t.dataset.martop=="0") { return false }
    t.dataset.martop = String(Number(t.dataset.martop)+1)
    t.style.marginTop = `${Number(t.dataset.martop)*4}vh`
}
function tab_start_scroll(){
    let t = document.getElementById("tab_header_in")
    t.dataset.martop = 0
    t.style.marginTop = "0vh"
}
function plaincopy(){
    navigator.clipboard.writeText(document.getElementById("previewplain").value)
}
function setradiochange(e) {
    document.getElementsByClassName("setradised")[0].classList.remove("setradised");
    document.getElementById(e.target.id.replace("setradio_","")).classList.add("setradised");
}

function lockmes(e){
    e.target.checked = !e.target.checked
    let l = []
    if (e.target.parentNode.parentNode.parentNode.parentNode.parentNode.classList.contains("checked_md")) {
        l = Array.from(document.getElementsByClassName("checked_md"))
    } else {
        l = [e.target.parentNode.parentNode.parentNode.parentNode.parentNode]
    }
    l.forEach(i=>{
        let t = i.getElementsByClassName("meslockcheck")[0]
        t.checked = !t.checked
        if (t.checked){
            i.classList.add("locked_mess")
            deal_sets[nbym(i)]["locked"] = true
        }else{
            i.classList.remove("locked_mess")
            deal_sets[nbym(i)]["locked"] = false
        }
    })
}
function loadbybutton1(){
    if (document.getElementById("startmenu_load_inp").files.length === 0) return false;
    let f = document.getElementById("startmenu_load_inp").files[0];
    loadrap(f)
    startmenukill()
}
function loadbybutton2(){
    if (document.getElementById("load_inp").files.length === 0) return false;
    let f = document.getElementById("load_inp").files[0];
    if (!window.confirm(`このファイルをロードします：${f.name}\n編集中のデータは消滅しますが、本当によろしいですか？`)) { return false; }

    loadrap(f)
}
function lockreload(){
    let c = 0
    deal_sets.forEach(s => {
        let m = mbyn(c)
        m.getElementsByClassName("meslockcheck")[0].checked = s["locked"]
        m.classList.remove("locked_mess")
        if (s["locked"]) {
            m.classList.add("locked_mess")
        }
        c++
    })
}
function themeprev(){
    let t = document.getElementById("settings_views_colors_themeselect")
    let n = t.selectedIndex
    if (n > 0){
        t.children[n - 1].selected = true
        themechange()
    }
}
function themenext() {
    let t = document.getElementById("settings_views_colors_themeselect")
    let n = t.selectedIndex
    if (n < theme_list.length-1) {
        t.children[n + 1].selected = true
        themechange()
    }
}
function themechange(){
    let t = document.getElementById("settings_views_colors_themeselect")
    let n = t.options[t.selectedIndex].value
    let s = `@import url(themes/${n}.css);`
    let ss = ""
    if (document.getElementById("settings_views_colors_highlightcheck").checked){
        ss = `@import url(themes/fontcolors/${n}.css);`
    }
    document.getElementsByTagName("style")[0].innerText = s
    document.getElementsByTagName("style")[1].innerText = ss
}
function highlightchange(){
    let t = document.getElementById("settings_views_colors_themeselect")
    let n = t.options[t.selectedIndex].value
    let ss = ""
    if (document.getElementById("settings_views_colors_highlightcheck").checked) {
        ss = `@import url(themes/fontcolors/${n}.css);`
    }
    document.getElementsByTagName("style")[1].innerText = ss
}
function resizermousedown(e){
    if (e.target.classList.contains("resizer")) {
        if (document.getElementsByClassName("draggingresizer").length < 1){
            document.addEventListener("mousemove",mousemovelistener)
        }
        e.target.classList.add("draggingresizer")
        document.body.classList.add("nonono_resize")
    }
}
function mousemovelistener(e){
    let t = document.getElementsByClassName("draggingresizer")[0]
    let btarget = t.previousElementSibling
    let atarget = t.nextElementSibling
    if (t.hasAttribute("data-order")){
        let o = Number(t.getAttribute("data-order"))
        btarget = t.parentNode.children[(boxes_sort[(o+1)/2-1])*2]
        atarget = t.parentNode.children[(boxes_sort[(o+1)/2])*2]
    }
    if (t.classList.contains("hresizer")) {
        let bc = btarget.getBoundingClientRect()
        let ac = atarget.getBoundingClientRect()
        let old_ar = ac.right+0
        let bw = e.clientX - bc.left
        let lim = parseFloat(getComputedStyle(document.documentElement).fontSize)*9
        if (bw >= lim && old_ar - e.clientX>=lim){
            btarget.style.width = bw + "px"
            atarget.style.width = old_ar - e.clientX + "px"
        }

    } else if (t.classList.contains("vresizer")){
        let bc = btarget.getBoundingClientRect()
        let ac = atarget.getBoundingClientRect()
        let old_ab = ac.bottom+0
        let bh = e.clientY - bc.top
        btarget.style.height = bh + "px"
        atarget.style.height = old_ab - e.clientY + "px"
    }
    for (let i of btarget.getElementsByClassName("functionselect")) {
        fitselector(i)
    }
    for (let i of atarget.getElementsByClassName("functionselect")) {
        fitselector(i)
    }
}
document.addEventListener("mouseup",e=>{
    if (document.getElementsByClassName("draggingresizer").length > 0){
        document.getElementsByClassName("draggingresizer")[0].classList.remove("draggingresizer")
        document.body.classList.remove("nonono_resize")
    }
    if (document.getElementsByClassName("draggingresizer").length < 1) {
        document.removeEventListener("mousemove", mousemovelistener)
    }
})
function fitselector(t){
    let pr = t.parentNode.getBoundingClientRect()
    t.style.fontSize = (pr.width-30) / strWidth(t.options[t.selectedIndex].innerText) * 10 + "px"
    t.parentNode.parentNode.style.setProperty("--title_font_size", (pr.width - 30) / strWidth(t.options[t.selectedIndex].innerText) * 10 + "px")
}
function sortboxes(){
    let t = document.getElementById("settings_views_size_sortboxes")
    boxes_sort = t.options[t.selectedIndex].value.split(',').map(Number)
    c = 0
    boxes_sort.forEach(i=>{
        document.getElementById("box").children[i*2].style.order = c
        c+=2
    })
}
function subfunctionchange(e) {
    let is = e.target
    let i = Number(is.parentNode.parentNode.dataset.subboxindex)
    if (is.selectedIndex == selectedsubfunction[i]){return false}
    let it = is.parentNode.nextElementSibling
    let ind = selectedsubfunction.indexOf(is.selectedIndex)
    let tt = document.getElementsByClassName("mainer")[ind]
    let ts = tt.previousElementSibling.firstElementChild
    ts.children[ts.selectedIndex].selected = false
    ts.children[selectedsubfunction[i]].selected = true
    selectedsubfunction[ind] = selectedsubfunction[i] + 0
    selectedsubfunction[i] = is.selectedIndex
    let i_s = it.cloneNode(true)
    let t_s = tt.cloneNode(true)
    let ip = it.parentNode
    let tp = tt.parentNode
    intersectobjects.clear()
    tt.outerHTML = ""
    it.outerHTML = ""
    ip.insertAdjacentElement("beforeend",t_s)
    tp.insertAdjacentElement("beforeend",i_s)
    fitselector(is)
    fitselector(ts)
    easypreviewobserver = new IntersectionObserver(epo_function, { root: document.getElementById("easy_preview") })
    for (let ch of document.getElementById("easy_preview").children){
        easypreviewobserver.observe(ch)
        
    }
}
new MutationObserver(e=>{
    let editlist = new Set()
    if (!e[0].target.classList.contains("tempselect")){
        e.forEach(r=>{
            if (!r.target.classList.contains("tempselect")){
                if (r.type == "childList"){
                    if (r.target.id == "messages"){
                        if (r.addedNodes.length > 0) {
                            if (r.addedNodes[0].lastElementChild != null){
                                editlist.add(nbym(r.addedNodes[0])+1)
                            }
                        }
                    }
                    if (r.target.classList.contains("message")){
                        if (r.addedNodes.length > 0) {
                            if (r.addedNodes[0].parentNode != null) {
                                editlist.add(nbym(r.addedNodes[0].parentNode.parentNode)+1)
                            }
                        }
                    }
                }
            }
        })
        if (editlist.size > 0){
            Array.from(editlist).sort(function (a,b){if (a > b) return -1;if (a < b) return 1;return 0;}).forEach(i=>{
                unieasypreviewreloader(i-1)
            })
        }
    }
}).observe(document.getElementById("messages"), {childList: true,attributes: true,subtree: true})

function unieasypreviewreloader(n){
    if (deal_list.length < n+1){
        easypreviewobserver.unobserve(document.getElementById("easy_preview").children[n])
        document.getElementById("easy_preview").children[n].outerHTML = ""
        return false
    }
    let sent = templates[deal_sets[n]["use_temp"]]["template"]
    templates[deal_sets[n]["use_temp"]]["conf_data"].forEach(d => {
        let dd = d.startsWith("liner_") ? `$${d.replace("liner_", "")
            .replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/\|/g, "\\|")
            }$` : `|${d.replace("blocker_", "")
                .replace(/\\/g, "\\\\")
                .replace(/\$/g, "\\$")
                .replace(/\|/g, "\\|")}|`
        sent = sent.split(dd).join(escapeHtml(deal_list[n][d]));
    })
    if (document.getElementById("easy_preview").childElementCount < n+1){
        document.getElementById("easy_preview").insertAdjacentHTML("beforeend",`<div class="neko">${sent.replace(/\n/g, "<br>")}</div>`)
        easypreviewobserver.observe(document.getElementById("easy_preview").lastElementChild)
    }else{

        if (intersectobjects.has(document.getElementById("easy_preview").children[n])) {
            let anchorok = {}
            Object.keys(all_data).forEach(a => {
                if (!all_data[a]["dataset_anchor?"]) { return };
                if (all_data[a]["dataset_anchor"] == "") { return };
                if (Object.values(anchorok).includes(all_data[a]["dataset_anchor"])) { return };
                anchorok[a] = escapeHtml(all_data[a]["dataset_anchor"]);
            })
            sent = previewanchor(sent, anchorok).replace(/(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+)/, "<a href='$1'>$1</a>")
        }
        document.getElementById("easy_preview").children[n].innerHTML = `${sent.split("\n").join("<br>")}`
    }

}
function changeadderm() {
    let selecting = Object.keys(all_data)[document.getElementById("datapul").selectedIndex - 1];
    all_data[selecting]["dataset_adderm"] = document.getElementById("dataset_adderm").checked
}
function addmemo(e){
    e.target.insertAdjacentHTML("afterend","<div><div><button onclick='memoup(event)'>^</button><button onclick='memodown(event)'>v</button><button onclick='memofontzoomout(event)'>-</button><button onclick='memofontzoom(event)'>+</button></div><textarea data-fontsizer='1.5' style='font-size:1.5em;'></textarea></div>")
}

function memofontzoom(e){
    let ta = e.target.parentNode.parentNode.lastElementChild
    ta.dataset.fontsizer = Number(ta.dataset.fontsizer)+0.5
    ta.style.fontSize =  Number(ta.dataset.fontsizer) + "em"
}
function memofontzoomout(e){
    let ta = e.target.parentNode.parentNode.lastElementChild
    ta.dataset.fontsizer = Number(ta.dataset.fontsizer)-0.5
    ta.style.fontSize =  Number(ta.dataset.fontsizer) + "em"
}
function memoup(e){
    let td = e.target.parentNode.parentNode
    if (td == td.parentNode.firstElementChild.nextElementSibling){return false}
    td.parentNode.insertBefore(td.cloneNode(true), td.previousElementSibling)
    td.outerHTML = ""
}
function memodown(e) {
    if (e.target.parentNode.parentNode == e.target.parentNode.parentNode.parentNode.lastElementChild){return false}
    let td = e.target.parentNode.parentNode.nextElementSibling
    td.parentNode.insertBefore(td.cloneNode(true), td.previousElementSibling)
    td.outerHTML = ""
}

function messtemper(t,h){
    return `<div class="messagediv" onclick="md_click(event)" draggable="false" ondragstart="dragstart(event);" ondragover="dragover(event);" ondragleave="dragleave(event);" ondrop="drop(event);" ondragend="dragend(event);"><div class="messagehead"><div class="headright"><div class="meslock"><label class="meslocklabel"><input type="checkbox" class="meslockcheck" onchange="lockmes(event);"></label></div><input type="checkbox" class="messelectcheck" onchange="mescheck(event)"></div><div class="tempselectdiv"><select class="tempselect" onmouseover="tempselectover(event.target)" onmouseout="tempselectout(event.target)" onchange="tempselected(event)"><option value="${t}" selected">${t}</option></select></div><button class="closebtn" onclick="closebtnclick(event)" title="レスの削除">×</button></div><div class="message" id="cd">${h}</div></div>`
}
function startmenukill(){
    document.body.classList.remove("nonono_startmenu")
}
function load5ch(){
    load(PRE_TEMPLETES["5ch"])
    startmenukill()
}
function loadtwitter(){
    load(PRE_TEMPLETES["twitter"])
    startmenukill()
}
function mescheck(e){
    e.target.parentNode.parentNode.parentNode.classList.remove("checked_md")
    if (e.target.checked){
        e.target.parentNode.parentNode.parentNode.classList.add("checked_md")
    }
}
function md_click(e){
    if (e.target.tagName!="DIV"){return false}
    if (!e.ctrlKey && e.shiftKey) {
        e.currentTarget.id="telstro"
        if (e.currentTarget.matches(".checked_md~div:not(.checked_md)")){
            let now = e.currentTarget
            while (!now.classList.contains("checked_md") || now.id == "telstro") {
                now.classList.add("checked_md")
                mcheckr(now)
                now = now.previousElementSibling
            }
        }
        if (document.querySelector("#telstro~.checked_md")){
            let now = e.currentTarget
            while (!now.classList.contains("checked_md") || now.id == "telstro") {
                now.classList.add("checked_md")
                mcheckr(now)
                now = now.nextElementSibling
            }
        }
        e.currentTarget.id = ""
    } else if (e.ctrlKey && e.shiftKey) {
        e.currentTarget.classList.add("checked_md")
        mcheckr(e.currentTarget)
    }else if (e.ctrlKey){
        if (e.currentTarget.classList.contains("checked_md")){
            e.currentTarget.classList.remove("checked_md")
        }else{
            e.currentTarget.classList.add("checked_md")
        }
        mcheckr(e.currentTarget)
    }else{
        let f = false
        Array.from(document.getElementsByClassName("checked_md")).forEach(i => {
            if (i != e.currentTarget){
                f = true
                i.classList.remove("checked_md")
                mcheckr(i)
            }
        })
        if (e.currentTarget.classList.contains("checked_md") && !f){
            e.currentTarget.classList.remove("checked_md")
        }else{
            e.currentTarget.classList.add("checked_md")
        }
        mcheckr(e.currentTarget)
    }
    
    
}
function mcheckr(e){
    e.getElementsByClassName("messelectcheck")[0].checked =e.classList.contains("checked_md")
    e.draggable=e.classList.contains("checked_md")
}
function tfer(to,from,toi,toic,fromic){
    if (from.parentNode.classList.contains("checked_md")){
        to.parentNode.classList.add("checked_md")
    }else{
        to.parentNode.classList.remove("checked_md")
    }
    mcheckr(to.parentNode)
    Object.keys(all_data).forEach(d => {
        let nnn = 0
        if (!all_data[d]["dataset_fix?"]) {
            toic[d] = fromic[d];
        }
        Array.from(to.getElementsByClassName(d)).forEach(toc => {
            let fromc = from.getElementsByClassName(d)[nnn];
            if (fromc) {
                if (!all_data[d]["dataset_fix?"]) {
                    toc.style = fromc.style.cssText;
                    toc.parentNode.style = fromc.parentNode.style.cssText;
                    toc.value = fromc.value;
                } else {
                    toc.value = deal_list[toi][d]
                }
            }
            nnn++
        })
    });
}
function mesdel(target){
    let newdeal = deal_list.map( list => ({...list}))
    let num = nbym(target)+1;
    target.outerHTML = ""
    deal_sets.splice(num - 1, 1)
    newdeal.splice(num - 1, 1)
    let mememedl = deal_list.map( list => ({...list}))
    mememedl.pop()
    Object.keys(all_data).forEach(k=>{
        if (all_data[k]["dataset_fix?"]){
            let c = 0
            mememedl.forEach(d=>{
                newdeal[c][k] = d[k]
                Array.from(mbyn(c).getElementsByClassName(k)).forEach(t=>{
                    t.value = d[k]
                })
                c++
            })
        }
    })
    deal_list = newdeal
    document.getElementById("easy_preview").children[num-1].outerHTML = ""
    lockreload()
    templates[now_temp]["conf_data"].forEach(k => {
        if (all_data[k]["dataset_adderm"]){
            let added = String(document.getElementById("form_inp").getElementsByClassName(k)[0].value)
            let na = Number(all_data[k]["dataset_adder"])
            if (/^\-?[0-9]+(\.[0-9]+)?$/.test(added)) {
                added = Number(added) - na
            }
            inputing[k] = String(added)
            Array.from(document.getElementById("form_inp").getElementsByClassName(k)).forEach(i => {
                i.value = inputing[k]
            })
        }
    });
    let n =getn()
    mexsets[n] = {};
    deal_list.forEach(d=>{
        if (Object.keys(mexsets[n]).includes(d[n])){
            mexsets[n][d[n]] = mexsets[n][d[n]]+1
        }else{
            mexsets[n][d[n]] = 1
        }
    })
    datamemoreload()
}
function settingsearcher(){
    let k = escapeHtml(document.getElementById("settingsearch").value)
    document.getElementById("settings").innerHTML = document.getElementById("settings").innerHTML.split("<mark>").join("").split("</mark>").join("")
    if (k == ""){
        Array.from(document.getElementById("settings").children).forEach(i => {
            i.classList.remove("unfilt")
        })
    }else{
        Array.from(document.getElementById("settings").children).forEach(i=>{
            i.classList.add("unfilt")
            if (i.innerHTML.indexOf(k) > -1) {
                i.classList.remove("unfilt")
                markloop(k,i)
            }
        })
    }
}
function markloop(k,o){
    if (o.firstElementChild){
    Array.from(o.children).forEach(i=>{
        markloop(k,i)
    })
    }else{
        o.innerHTML = o.innerHTML.split("<mark>").join("").split("</mark>").join("").split(k).join(`<mark>${k}</mark>`)
    }
}
function nbym(m){
    return Array.from(document.getElementById("messages").children).indexOf(m)
}
function mbyn(n){
    return document.getElementById("messages").children[n]
}
function moveAt(array, index, at) {//https://qiita.com/nowayoutbut/items/991515b32805e21f8892
    if (index === at || index > array.length -1 || at > array.length - 1) {
        return array;
    }
    const value = array[index];
    const tail = array.slice(index + 1);

    array.splice(index);

    Array.prototype.push.apply(array, tail);

    array.splice(at, 0, value);

    return array;
}
function datamemoreload(){
    let t = document.getElementById("datamemopul")
    let i = t.selectedIndex-1
    if (i == -1){return false}
    let n = Object.keys(all_data)[i];
    mexsets[n] = {};
    deal_list.forEach(d=>{
        if (Object.keys(mexsets[n]).includes(d[n])){
            mexsets[n][d[n]] = mexsets[n][d[n]]+1
        }else{
            mexsets[n][d[n]] = 1
        }
    })
    document.getElementById("datamemoselpul").innerHTML = '<option hidden>変数値を選択</option>'
    if (Object.keys(mexsets[n]).length > 0) {
        Object.keys(mexsets[n]).forEach(d => {
            document.getElementById("datamemoselpul").insertAdjacentHTML("beforeend", `<option>${escapeHtml(d)}<span class="pulg">(${mexsets[n][d]})</span></option>`)
            if (typeof all_data[n]["memo"][d] === "undefined") {
                all_data[n]["memo"][d] = ""
            }
        })
        document.getElementById("datamemoselpul").children[1].selected = true
        document.getElementById("datamemo").value = all_data[n]["memo"][Object.keys(mexsets[n])[0]]
    }
}
function datamemochange(){
    let t = document.getElementById("datamemopul")
    let i = t.selectedIndex-1
    if (i == -1){return false}
    let n = Object.keys(all_data)[i]
    let tt = document.getElementById("datamemo")
    all_data[n]["memo"][Object.keys(mexsets[n])[document.getElementById("datamemoselpul").selectedIndex-1]] = tt.value
}
function datamemoselpulchange(){
    console.log(all_data)
    let t = document.getElementById("datamemopul")
    let i = t.selectedIndex-1
    if (i == -1){return false}
    let n = Object.keys(all_data)[i]
    let tt = document.getElementById("datamemo")
    if (typeof all_data[n]["memo"][mexsets[n]] === "undefined") {
        all_data[n]["memo"][mexsets[n]] = ""
    }
    tt.value = all_data[n]["memo"][Object.keys(mexsets[n])[document.getElementById("datamemoselpul").selectedIndex-1]]
}
function datamemodivreload(){
    let t = document.getElementById("datamemopul")
    let i = t.selectedIndex - 1
    if (i == -1) { return false }
    let n = Object.keys(all_data)[i];
    document.getElementById("datamemoselpul").innerHTML = '<option hidden>変数値を選択</option>'
    if (Object.keys(mexsets[n]).length > 0) {
        Object.keys(mexsets[n]).forEach(d => {
            document.getElementById("datamemoselpul").insertAdjacentHTML("beforeend", `<option>${escapeHtml(d)}<span class="pulg">(${mexsets[n][d]})</span></option>`)
            if (typeof all_data[n]["memo"][d] === "undefined") {
                all_data[n]["memo"][d] = ""
            }
            if (mexsets[n][d]==0){
                document.getElementById("datamemoselpul").lastChild.hidden = true
            }
        })
        document.getElementById("datamemoselpul").children[i+1].selected = true
        document.getElementById("datamemo").value = all_data[n]["memo"][Object.keys(mexsets[n])[0]]
    }
}
function getn(){
    let t = document.getElementById("datamemopul")
    let i = t.selectedIndex-1
    return Object.keys(all_data)[i];
}