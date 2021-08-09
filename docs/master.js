function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}
const theme_list = [
    "VSCode_Dark",
    "VSCode_Light",
    "HighDark",
    "5ch",
    "futaba",
    "Twitter",
    "Discord"
]
let lists = {"messages":{"deal_list":[],"style_list":[],"deal_sets":[]},"putmessagediv":{"deal_list":[],"style_list":[],"deal_sets":[]}}
let put_deal_list = []
let put_deal_sets = []
let all_data = {};
let all_label = {}
let dragging = null;
let searchlevel = 0
let templates = [
    {
        "template" : "",
        "conf_htm" : "",
        "conf_col" : "",
        "conf_data" : [],
        "conf_label" : []
    }
]
let boxes_sort = [0,1,2]
const settings = {
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
    },
    "outputs":{
        name:"出力",
        type:"head",
        list:{
            "plain":{
                name:"プレーンテキスト",
                type:"head",
                list:{
                    "span":{
                        name:"レス間文字列",
                        info:"レスとレスの間に挟む文字列を指定します",
                        type:"textarea",
                        init:"\n",
                        f:plainreload
                    },
                    "skip":{
                        name:"省略文字列",
                        info:"レスが省略された際、自動的に指定した文字列を挿入します",
                        type:"textarea",
                        init:"",
                        f:plainreload
                    },
                    "specialindent":{
                        name:"位置合わせインデント",
                        info:"",
                        type:"checkbox",
                        init:false,
                        label:"複数行変数の行頭を位置合わせ(他の字下げ・インデント設定を無視)",
                        f:plainreload
                    },
                    "indentex":{
                        name:"字下げの例外文字",
                        info:"行頭にある文字が含まれるとき、字下げの対象から除外されます",
                        type:"text",
                        init:"",
                        f:plainreload
                    },
                    "indentstr": {
                        name: "字下げ内容",
                        info: "複数行変数の行頭を指定した文字列で字下げします",
                        type: "text",
                        init: "",
                        f:plainreload
                    },
                    "replyindent": {
                        name: "返信インデント",
                        info: "一つ上の投稿に対する返信であると判定できる場合にインデントを行います",
                        type: "text",
                        init: "",
                        f: plainreload
                    },
                    "zenkaku": {
                        name: "全角化",
                        type: "head",
                        list:{
                            "zenkakunumber":{
                                name:"数字",
                                type:"checkbox",
                                info:"",
                                init:false,
                                label:"数字の全角化",
                                f:plainreload
                            },
                            "zenkakualphabet":{
                                name:"アルファベット",
                                type:"checkbox",
                                info:"",
                                init:false,
                                label:"アルファベットの全角化",
                                f:plainreload
                            },
                            "zenkakusymbol":{
                                name:"記号",
                                type:"checkbox",
                                info:"",
                                init:false,
                                label:"記号の全角化",
                                f:plainreload
                            },
                        }
                    }
                }
            }
        }
    }
}
let settings_now={}
let now_temp = 0
let inputing = {}
let now_theme = 0
const SUBFUNCTIONNAMES = [
    "テンプレートを変更",
    "変数の詳細設定",
    "ランダム文字列生成",
    "簡易プレビュー",
    "テキストメモ",
    "変数特定値メモ",
    "メッセージ仮置き場",
    "ラベルの詳細設定",
    "画像・アイコン"
]
let selectedsubfunction = [0,1,2,3,4,5,6,7,8]
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
function nowsetchange(id,v){
    let o = document.getElementById(id)
    switch (o.tagName.toLowerCase()){
        case "select":
            o.selectedIndex = v
            break
        case "input":
            if (o.type == "checkbox"){
                o.checked = v
            }else{
                o.value = v
            }
            break
        default:
            o.value = v
            break
    }
    
    o.dispatchEvent(new Event('change'))
}
function kilec(id){
    Array.from(document.querySelectorAll(`[data-tarid='${id}']`)).forEach(e=>{
        e.value = document.getElementById(id).value
    })
}
function settings_r(v,d,kk){
    let ssss = settings_now
    kk.split("_").forEach(kkk=>{
        ssss = ssss[kkk]
    })
    if (v.type == "head"){
        document.getElementById("settings").insertAdjacentHTML("beforeend",`<h1 id="settings_${kk}" style="font-size:${2/Math.sqrt(d)}rem">${v.name}</h1>`)
        let t = document.getElementById("settingtab")
        for (let i = 0; i < d-1; i++) {
            t = t.lastElementChild;
        }
        t.insertAdjacentHTML("beforeend", `<div><input type="checkbox" id="settingtab_${kk}"><label for="settingtab_${kk}"><div></div></label><a data-dhref="settings_${kk}" onclick="setsc(event)">${v.name}</a></div>`)
        Object.keys(v.list).forEach(vk=>{
            settings_r(v.list[vk],d+1,`${kk}_${vk}`)
        })
    }else{
        document.getElementById("settings").insertAdjacentHTML("beforeend", `<div class="settdiv" style="padding-left:${d<4?10:(d-3)*20}px;"><h3>${v.name}</h3><span class="settinfo">${v.info}</span></div>`)
        let te = document.getElementById("settings").lastElementChild
        switch (v.type){
            case "checkbox":
                te.insertAdjacentHTML("beforeend", `<label><input type="checkbox" ${ssss ? "checked" : ""} id="settings_${kk}" onchange="settings_now.${kk.split("_").join(".")}=event.target.checked;settings.${kk.split("_").join(".list.")}.f();kilec(event.target.id)">${v.label}</label>`)
                v.f()
                break
            case "select":
                te.insertAdjacentHTML("beforeend", `<select id="settings_${kk}" onchange="settings_now.${kk.split("_").join(".")}=event.target.selectedIndex;settings.${kk.split("_").join(".list.")}.f();kilec(event.target.id)"></select>`)
                Object.keys(v.options).forEach(i=>{
                    te.lastElementChild.insertAdjacentHTML("beforeend",`<option value="${v.options[i]}">${i}</option>`)
                })
                te.lastElementChild.children[ssss].selected = true
                v.f()
                break
            case "textarea":
                te.insertAdjacentHTML("beforeend", `<textarea id="settings_${kk}" onchange="settings_now.${kk.split("_").join(".")}=event.target.value;settings.${kk.split("_").join(".list.")}.f();kilec(event.target.id)">${ssss}</textarea>`)
                v.f()
                break
            case "text":
                te.insertAdjacentHTML("beforeend", `<input type="text" id="settings_${kk}" value="${ssss}" onchange="settings_now.${kk.split("_").join(".")}=event.target.value;settings.${kk.split("_").join(".list.")}.f();kilec(event.target.id)">`)
                v.f()
                break
        }
    }
}
function settingsnow_r(sv,nv){
    if (sv.type == "head"){
        Object.keys(sv.list).forEach(k=>{
            if (sv.list[k].type == "head"){
                nv[k] = {}
            }else{
                nv[k] = sv.list[k].init
            }
            settingsnow_r(sv.list[k],nv[k])
        })
    }else{
        nv = sv.init
    }
}
let easypreviewobserver = new IntersectionObserver(epo_function,{root:document.getElementById("easy_preview")})
window.onload = function () {
    Object.keys(settings).forEach(cc=>{
        if (settings[cc].type == "head"){
            settings_now[cc] = {}
        }else{
            settings_now[cc] = settings[cc].init
        }
        settingsnow_r(settings[cc], settings_now[cc])
    })
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
    template_valuereload()
    template_scrollreload()
    if (storageAvailable("localStorage")) {
        let eu = []
        if (localStorage.getItem("Anyget_Last_Session_Save_Data") != null) {
            eu = JSON.parse(localStorage.getItem("Anyget_Last_Session_Save_Data"))
        }
        if (!Array.isArray(eu)) {
            eu = []
        }
        let c = 0
        eu.forEach(euu=>{
            document.getElementById("backup_list").insertAdjacentHTML("beforeend",`<li onclick="sessionload(${c})">⌚${euu.date}</li>`)
            c++
        })
    }
};
window.addEventListener('beforeunload', function (event) {
    event.preventDefault()
    event.returnValue = ''
    if (storageAvailable("localStorage")){
        let eu = []
        if (localStorage.getItem("Anyget_Last_Session_Save_Data") != null){
            eu = JSON.parse(localStorage.getItem("Anyget_Last_Session_Save_Data"))
        }
        if (!Array.isArray(eu)){
            eu = []
        }

        eu.unshift({"data":saver(),"date":`${getMMDDHHSSMM()}`})
        if (eu.length > 5){
            eu.pop()
        }
        localStorage.setItem("Anyget_Last_Session_Save_Data",JSON.stringify(eu))
    }
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
function escapeHtmlSp(str) {
    let div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML.split('"').join("&quot;");
};
function changetemp() {
    let col = "";
    let htm = "";
    let mode = "normal";
    let data = [];
    let otemp = document.getElementById("template").value;
    let templi = []
    otemp.split("\n").forEach(l=>{
        if (!l.startsWith("//")){
            templi.push(l)
        }
    })
    let temp = templi.join("\n")
    let labelstack = ""
    let labeldata = []
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
                            htm += '<div class="|"><textarea class="|text blocker_';
                            data.push("blocker_");
                            break;
                        case ("%"):
                            mode = "labeler";
                            col += '<span style="color:#FFFF00;">%';
                            htm += `<span onclick="labelerclick(event)" class="% labeler_`;
                            labelstack = ""
                            labeldata.push(`labeler_`);
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
                            htm += `" placeholder="${t}" list="list_liner_${t}" value="" onscroll="linerscr(event)"><div class="s_$text s_text"></div></div>`;
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
                            htm += `" placeholder="${escapeHtml(data[data.length - 1]).replace("blocker_", "")}"onscroll="blockerscr(event)"></textarea><div class="s_|text s_text"></div></div>`;
                            break;
                        default:
                            col += escapeHtml(char);
                            htm += escapeHtml(char);
                            data[data.length - 1] += char;
                            break;
                    };
                    break;
                case ("labeler"):
                    switch (char) {
                        case ("%"):
                            mode = "normal";
                            col += "%</span>";
                            htm += `">${labelstack}</span>`;
                            break;
                        default:
                            col += escapeHtml(char);
                            htm += escapeHtml(char);
                            labeldata[labeldata.length - 1] += char;
                            labelstack += escapeHtml(char)
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
    htm = htm.split('</textarea><div class="s_|text s_text"></div></div>\n').join('</textarea><div class="s_|text s_text"></div></div>')
    htm = htm.split("\n").join("<br>")
    if (mode == "normal") {
        let backupconfdata = templates[now_temp]["conf_data"];
        document.getElementById("edited").innerHTML = col.split("\n").join("<br>");
        document.getElementById("form_inp").innerHTML = htm;
        templates[now_temp]["conf_htm"] = htm;
        templates[now_temp]["conf_col"] = col;
        templates[now_temp]["conf_label"] = labeldata;
        templates[now_temp]["conf_data"] = Array.from(new Set(data))
        templates[now_temp]["conf_data"].forEach(i => {
            if (!Object.keys(all_data).includes(i)) {
                all_data[i] = ({"dataset_adder": 0,"dataset_adderm":false, "dataset_anchor":  "", "dataset_fix?": false, "dataset_datalist?": false,"memo":{}});
                Array.from(document.getElementsByClassName("dataman")).forEach(s=>{
                    s.insertAdjacentHTML("beforeend", `<option name="${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</option>`)
                    if (s.id == "datamemopul" && i.startsWith("blocker_")){
                        s.lastChild.hidden = true
                    }
                })
                document.getElementById("replace_list").insertAdjacentHTML("beforeend", `<li><input type="checkbox" id="replacecheck_${escapeHtml(i)}"></input><label for="replacecheck_${escapeHtml(i)}">${(escapeHtml(i)  + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</label></li>`)
            };
            if (!Object.keys(inputing).includes(i)){
                inputing[i] = ""
            }
        })
        templates[now_temp]["conf_label"].forEach(i => {
            if (!Object.keys(all_label).includes(i)) {
                all_label[i] = { "labelset_calctarget": -1, "labelset_calcstr": "", "labelset_calcthen": i.replace("labeler_", ""), "labelset_calcelse": "","labelset_adder":"0"};
                Array.from(document.getElementsByClassName("labelman")).forEach(s=>{
                    s.insertAdjacentHTML("beforeend", `<option name="${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, "%")}</option>`)
                })
            }
        })
        deparr(Object.keys(inputing),templates[now_temp]["conf_data"]).forEach(i=>{
            let t = document.getElementById("form_inp").getElementsByClassName(i)[0]
            t.value = inputing[i]
            taras(t)
        })
        while (lists["messages"]["style_list"].length < lists["messages"]["deal_list"].length) {
            lists["messages"]["style_list"].push({})
        }
        let n = 0
        lists["messages"]["deal_list"].forEach(ii => {
            let box = mbyn(n).lastElementChild;
            let t = lists["messages"]["deal_sets"][n]["use_temp"]
            templates[t]["conf_data"].forEach(x => {
                if (backupconfdata.includes(x) || now_temp != t) {
                    lists["messages"]["style_list"][n][x] = []
                    if (x.startsWith("liner_")){
                        Array.from(box.getElementsByClassName(x)).forEach(cd => {
                            lists["messages"]["style_list"][n][x].push(cd.parentNode.style.cssText)
                        })
                    }else{
                        Array.from(box.getElementsByClassName(x)).forEach(cd => {
                            lists["messages"]["style_list"][n][x].push(cd.style.cssText);
                        })
                    }

                }else if (!Object.keys(lists["messages"]["style_list"][n]).includes(x)) {
                    lists["messages"]["style_list"][n][x] = []
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
    Object.keys(lists).forEach(id=>{
        let dl = lists[id]["deal_list"]
        let ds = lists[id]["deal_sets"]
        n = 0
        dl.forEach(ii => {
            let box = mbyidn(id,n).lastElementChild;
            if (ds[n]["use_temp"] == now_temp) {
                box.innerHTML = templates[now_temp]["conf_htm"];
                Object.keys(all_data).forEach(xx => {
                    if (typeof ii[xx] === "undefined") {
                        ii[xx] = "";
                    };
                    let cc = 0
                    Array.from(box.getElementsByClassName(xx)).forEach(iii => {
                        iii.value = ii[xx];
                        if (xx.startsWith("blocker_")) {
                            iii.style = lists["messages"]["style_list"][n][xx][cc]
                        } else {
                            iii.parentNode.style = lists["messages"]["style_list"][n][xx][cc]
                        }
                        cc++
                    })
                });
                labelreload(id, n)
            }
            n++;
        });
    })

}
function addmess() {
    for (let i = 0; i < document.getElementById("messv").value; i++) {
        document.getElementById("messages").insertAdjacentHTML("beforeend",messtemper(now_temp+1,templates[now_temp]["conf_htm"]));
        let formi_c = document.getElementById("form_inp")
        let now = document.getElementById("cd")
        now.id = ""
        let num = lists["messages"]["deal_list"].length
        lists["messages"]["deal_list"].push({})
        datamemodivreload()
        Object.keys(all_data).forEach(k=>{
            lists["messages"]["deal_list"][num][k] = ""
        })
        lists["messages"]["deal_sets"].push({
            "use_temp":now_temp+0,
            "locked":false
        })
        templates[now_temp]["conf_data"].forEach(i => {
            let n = 0
            Array.from(now.getElementsByClassName(i)).forEach(o=>{
                let nnnnn = formi_c.getElementsByClassName(i)[n];
                o.parentNode.style = nnnnn.parentNode.style.cssText;
                lists["messages"]["deal_list"][num][i] = o.value = nnnnn.value
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
        labelreload("messages",lists["messages"]["deal_list"].length-1)
    }
    let nnn = getn()
    mexsets[nnn] = {};
    lists["messages"]["deal_list"].forEach(d => {
        if (Object.keys(mexsets[nnn]).includes(d[nnn])) {
            mexsets[nnn][d[nnn]] = mexsets[nnn][d[nnn]] + 1
        } else {
            mexsets[nnn][d[nnn]] = 1
        }
    })
    let obj = document.getElementById("messages");
    obj.scrollTop = obj.scrollHeight;
    datamemodivreload()
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
            document.getElementById("dataset_anchor").disabled = false
            document.getElementById("dataset_anchor").value = all_data[selecting]["dataset_anchor"];
            document.getElementById("dataset_datalist?").disabled = false;
            document.getElementById("dataset_datalist?").checked = all_data[selecting]["dataset_datalist?"];
        } else {
            document.getElementById("dataset_anchor").disabled = true
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
        num = nbym(target.parentNode.parentNode.parentNode);
        inp = target.value;
        lists[target.parentNode.parentNode.parentNode.parentNode.id]["deal_list"][num][clas] = inp;
        Array.from(intersectobjects).forEach(i => {
            
            unieasypreviewreloader(Array.from(document.getElementById("easy_preview").children).indexOf(i))
        })
        if (target.tagName != "TEXTAREA"){
            labelreload(target.parentNode.parentNode.parentNode.parentNode.id, num)
            //mexsets[clas][lists[target.parentNode.parentNode.parentNode.parentNode.id]["deal_list"][num[clas]]   -= 1
            //mexsets[clas][inp] = typeof mexsets[clas][inp] == "undefined"?1:mexsets[clas][inp]+1
            //datamemodivreload()
        }
        searchunimessage(num,document.getElementById("messagesearcher").value,document.getElementById("search_regcheck").checked)
    };
    if (target.matches(".message textarea,.message input,#form_inp textarea,#form_inp input")){
        taras(target)
    }
    if (target.matches("#form_inp textarea,#form_inp input")){
        inputing[target.classList[1]] = target.value
        formlabelreload()
    }
});
function taras(target){
    let tp = target.parentNode.parentNode
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
    lockreload()
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
function put_dragover(e){
    if (!document.querySelector("body").classList.contains("nonono")) {return false;}
    if (e.target != e.currentTarget){return false}
    e.preventDefault()
    e.target.classList.add("put_dragover");
}
function put_dragleave(e){
    e.target.classList.remove("put_dragover");
}
function put_drop(e){
    if (document.getElementById("tuka")){
        document.getElementById("tuka").outerHTML = ""
    }
    if (!document.querySelector("body").classList.contains("nonono")) { return false; }
    e.preventDefault();
    document.querySelector("body").classList.remove("nonono");
    if (!e.target.classList.contains("put_dragover")){return false}
    e.target.classList.remove("put_dragover");
    if (e.target.classList.contains("checked_md")){return false}
    let f = e.target.matches(".checked_md~*")
    while (document.getElementsByClassName("checked_md").length > 0){
        let ragging = f ? document.getElementsByClassName("checked_md")[document.getElementsByClassName("checked_md").length-1] : document.getElementsByClassName("checked_md")[0]
        let dragging_num = nbym(ragging)
        ragging.classList.remove("checked_md")
        mcheckr(ragging)
        let c = ragging.cloneNode(true)
        lists[e.target.id]["deal_list"].push(lists[ragging.parentNode.id]["deal_list"][dragging_num])
        lists[e.target.id]["deal_sets"].push(lists[ragging.parentNode.id]["deal_sets"][dragging_num])
        lists[e.target.id]["style_list"].push(lists[ragging.parentNode.id]["style_list"][dragging_num])
        mesdel(ragging)
        e.target.appendChild(c)
    };
    lockreload()
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
    let newlists = JSON.parse(JSON.stringify(lists))
    let relolist = new Set()
    while (document.getElementsByClassName("checked_md").length > 0) {

        let ragging = f ? document.getElementsByClassName("checked_md")[document.getElementsByClassName("checked_md").length - 1] : document.getElementsByClassName("checked_md")[0]
        let fromid = ragging.parentNode.id
        let fromdl = newlists[fromid]["deal_list"]
        let fromds = newlists[fromid]["deal_sets"]
        let toid = e.target.parentNode.id
        let todl = newlists[toid]["deal_list"]
        let tods = newlists[toid]["deal_sets"]
        ragging.classList.remove("checked_md")
        let dragging_num = nbym(ragging)
        let to = nbym(e.target)
        mcheckr(ragging)
        let c = ragging.cloneNode(true)
        ragging.outerHTML = ""
        if (toid != fromid){
            let c1 = moveft(fromdl, todl, dragging_num, to)
            fromdl = c1[0]
            todl = c1[1]
            let c2 = moveft(fromds, tods, dragging_num, to)
            fromds = c2[0]
            tods = c2[1]
            if (toid == "messages"){
                let el = document.createElement("div")
                el.classList.add("neko")
                if (document.getElementById("easy_preview").childElementCount>=to){
                    document.getElementById("easy_preview").insertBefore(el,document.getElementById("easy_preview").children[to])
                }else{
                    document.getElementById("easy_preview").appendChild(el)
                }
                relolist.add(document.getElementById("easy_preview").children[to])
            }
            if (fromid == "messages"){
                document.getElementById("easy_preview").children[dragging_num].outerHTML = ""
            }
        }else{
            fromdl = moveAt(fromdl, dragging_num, to)
            fromds = moveAt(fromds, dragging_num, to)
        }
        if (target_num > dragging_num && toid == fromid) {
            if (e.target.matches("*:last-child")) {
                e.target.parentNode.appendChild(c)
            } else {
                e.target.parentNode.insertBefore(c, e.target.nextElementSibling)
            }
        } else {
            e.target.parentNode.insertBefore(c, e.target)
        }
    };
    Object.keys(all_data).forEach(k=>{
        if (all_data[k]["dataset_fix?"]){
            Object.keys(lists).forEach(kk=>{
                let c = 0
                lists[kk]["deal_list"].forEach(d=>{
                    if (newlists[kk]["deal_list"].length>c){
                        newlists[kk]["deal_list"][c][k] = d[k]
                        Array.from(mbyn(c).getElementsByClassName(k)).forEach(t=>{
                            t.value = d[k]
                        })
                    }
                    c++
                })
            })
        }
    })
    lists = newlists
    Array.from(relolist).forEach(r=>{
        unieasypreviewreloader(r)
    })
    lockreload()
};
function dragend(e) {
    if (document.getElementById("tuka")){
        document.getElementById("tuka").outerHTML = ""
    }
    document.querySelector("body").classList.remove("nonono");
}
function anchorchange(e){
    all_data[Object.keys(all_data)[(document.getElementById("datapul").selectedIndex) - 1]]["dataset_anchor"] = e.target.value;
}
function unescapeHtml(str) {
    let div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
                        .replace(/>/g,"&gt;")
                        .replace(/\r/g, "&#13;")
                        .replace(/\n/g, "&#10;");
    return div.textContent || div.innerText;
}
function plainreload() {
    let alll = []
    let c = 0
    lists["messages"]["deal_list"].forEach(i => {
        c++
        let sent = templates[lists["messages"]["deal_sets"][c-1]["use_temp"]]["template"]
        templates[lists["messages"]["deal_sets"][c-1]["use_temp"]]["conf_data"].forEach(d => {
            let dd = d.startsWith("liner_")?`$${d.replace("liner_","")}$`:`|${d.replace("blocker_","")}|`
            let idd = []
            if (d.startsWith("blocker_")){
                i[d].split("\n").forEach(l=>{
                    if (![...settings_now["outputs"]["plain"]["indentex"]].includes(l.charAt(0))){
                        idd.push(settings_now["outputs"]["plain"]["indentstr"]+l)
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
        templates[lists["messages"]["deal_sets"][c - 1]["use_temp"]]["conf_label"].forEach(d => {
            let dd = `%${d.replace("labeler_", "")}%`
            let inner = ""
            if (lists["messages"]["deal_list"][c - 1][ltget(d)] == all_label[d]["labelset_calcstr"]) {
                inner = all_label[d]["labelset_calcthen"]
            } else {
                inner = all_label[d]["labelset_calcelse"]
            }
            sent = sent.split(dd).join(escapeHtml(inner));
        })
        alll.push(sent)
        if (lists["messages"]["deal_list"].length>c){
            Object.keys(all_data).some(k=>{
                if (Number(all_data[k]["dataset_adder"]) != 0){
                    if (Number(lists["messages"]["deal_list"][c][k])-Number(i[k]) != Number(all_data[k]["dataset_adder"])){
                        if (settings_now["outputs"]["plain"]["skip"] != ""){
                            alll.push(settings_now["outputs"]["plain"]["skip"])
                            return true
                        }
                    }
                }
            })
        }
    })
    if (!settings_now["outputs"]["plain"]["specialindent"]){
        
        c = 0
        let reptree = []
        lists["messages"]["deal_list"].forEach(i=>{
            c++
            let conf_data = templates[lists["messages"]["deal_sets"][c-1]["use_temp"]]["conf_data"]
            let mexaflag = false
            if (c != 1){
                let cc = 0
                reptree.slice().reverse().some(m=>{
                    conf_data.forEach(k=>{
                        if (!mexaflag){
                            if (all_data[k]["dataset_anchor"] != ""){
                                conf_data.forEach(d=>{
                                    if (d.startsWith("blocker_")){
                                        if (i[d].indexOf(all_data[k]["dataset_anchor"] + m[k])+1){
                                            mexaflag = true
                                        }
                                    }
                                })
                            }
                        }
                    })
                    if (mexaflag) {
                        for (let iii = 0; iii < cc; iii++) {
                            reptree.pop()
                        }
                        alll[c - 1] = alll[c - 1].replace(/^/gm, settings_now["outputs"]["plain"]["replyindent"].repeat (reptree.length))
                        reptree.push(i)
                        return true
                    }
                    cc++
                })
            }
            if (!mexaflag){
                reptree = [i]
            }
        })
    }
    let str = unescapeHtml(alll.join(settings_now["outputs"]["plain"]["span"]))
    if (settings_now["outputs"]["plain"]["zenkaku"]["zenkakunumber"]){
        str = str.replace(/[0-9]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
    }
    if (settings_now["outputs"]["plain"]["zenkaku"]["zenkakualphabet"]){
        str = str.replace(/[a-zA-Z]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
    }
    if (settings_now["outputs"]["plain"]["zenkaku"]["zenkakusymbol"]) {
        str = str.replace(/[!-/:-@\[-`{-~\ ]/g, function (s) {
            return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
        });
    }
    document.getElementById("previewplain").value = str
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
                lists["messages"]["deal_list"].map(xx => xx[k]).forEach(l => {
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
    Array.from(document.getElementById(e.target.parentNode.dataset.radioto).getElementsByClassName("radised")).forEach(n=>{
        if (n.parentNode.id == e.target.parentNode.dataset.radioto){
            n.classList.remove("radised")
        }
    })
    document.getElementById(e.target.id.replace("radio_","")).classList.add("radised");
    switch (e.target.name){
        case ("tab_item"):
            switch (e.target.id) {
                case ("radio_preview"):
                    document.getElementById("normalp").innerHTML = ""
                    let anchorok = {}
                    let dm = lists["messages"]["deal_list"].map(xx => Object.values(xx).join("")).join("")
                    Object.keys(all_data).forEach(a => {
                        if (all_data[a]["dataset_anchor"] == "") { return };
                        let dms = dm.split(all_data[a]["dataset_anchor"])
                        if (dms.length>10000 || dms.length<0) { return };
                        if (Object.values(anchorok).includes(all_data[a]["dataset_anchor"])) { return };
                        anchorok[a] = escapeHtml(all_data[a]["dataset_anchor"]);
                    })
                    let s = 0;
                    lists["messages"]["deal_list"].forEach(i => {
                        s++;
                        previewunimessage(s,anchorok)
                    })
                    break;
                case ("radio_plaintext"):
                    plainreload();
                    break;
            }
            break

    }
}
function previewunimessage(s,anchorok){
    let sent = templates[lists["messages"]["deal_sets"][s - 1]["use_temp"]]["template"]
    templates[lists["messages"]["deal_sets"][s - 1]["use_temp"]]["conf_data"].forEach(d => {
        let dd = d.startsWith("liner_") ? `$${d.replace("liner_", "")}$` : `|${d.replace("blocker_", "")}|`
        sent = sent.split(dd).join(escapeHtml(lists["messages"]["deal_list"][s - 1][d]));
    })
    templates[lists["messages"]["deal_sets"][s - 1]["use_temp"]]["conf_label"].forEach(d=>{
        let dd = `%${d.replace("labeler_", "")}%`
        let inner = ""
        if (lists["messages"]["deal_list"][s-1][ltget(d)] == all_label[d]["labelset_calcstr"]){
            inner = all_label[d]["labelset_calcthen"]
        }else{
            inner = all_label[d]["labelset_calcelse"]
        }
        sent = sent.split(dd).join(escapeHtml(inner));

    })
    sent = previewanchor(sent, anchorok).replace(/(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+)/, "<a href='$1'>$1</a>")
    document.getElementById("normalp").insertAdjacentHTML("beforeend",`<div class="neko" id="preview_${s}">${sent.split("\n").join("<br>")}</div>`)
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
                            case ("%"):
                                mode = "labeler";
                                temp[tar.id].push("labeler_")
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
                    case ("labeler"):
                        switch (char) {
                            case ("%"):
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
            if (Object.keys(all_data).includes(p) || (p.startsWith("labeler_") && Object.keys(all_label).includes(p)) || ((p.startsWith("text_")) && p != "text_")) {
                newtemp.push(p);
            }
        });
        temp[tar.id] = newtemp
    }
    let strs = []
    let title = escapeHtml(document.getElementById("dat_title").value)
    n = 0
    lists["messages"]["deal_list"].forEach(m => {
        n++;
        strs.push("")
        Object.keys(temp).forEach(k => {
            let tar = temp[k]
            tar.forEach(t => {
                if (t.startsWith("text_")) {
                    strs[n - 1] += t.replace("text_", "")
                }else if (t.startsWith("labeler_")){
                    strs[n - 1] += (m[Object.keys(all_data)[all_label[t]["labelset_calctarget"]]] == all_label[t]["labelset_calcstr"]) ? all_label[t]["labelset_calcthen"] : all_label[t]["labelset_calcelse"]
                } else if (k === "dat_main") {
                    strs[n - 1] += " " + escapeHtml(m[t]).split("\n").join("<br>")+ " "
                } else {
                    strs[n - 1] += escapeHtml(m[t]).replace(/\n/g, "")
                }

            })
            strs[n - 1] += "<>"
        })
    })
    title = title != "" ? title : "Untitled";
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
    let j = saver()
    let name = `${document.getElementById("save_inp").value != "" ? document.getElementById("save_inp").value : "Untitled"}.json`
    let blob = new Blob([j], { type: "application/json" });
    let a = document.createElement('a');
    a.download = name;
    a.target = '_blank';
    a.href = window.webkitURL.createObjectURL(blob);
    a.click();
}
function tempsave() {
    let j = JSON.stringify(
        { 
            "lists":{"messages":{"deal_list":[],"style_list":[],"deal_sets":[]},"putmessagediv":{"deal_list":[],"style_list":[],"deal_sets":[]}},
            "all_data": all_data, 
            "templates": templates,
            "inputing":inputing,
            "now_temp":now_temp,
            "all_label":all_label,
            "settings_now":settings_now
        }
    )
    let name = `${document.getElementById("tempsave_inp").value != "" ? document.getElementById("tempsave_inp").value : "Untitled"}.json`
    let blob = new Blob([j], { type: "application/json" });
    let a = document.createElement('a');
    a.download = name;
    a.target = '_blank';
    a.href = window.webkitURL.createObjectURL(blob);
    a.click();
}
function setsave() {
    let j = JSON.stringify(
        { 
            "lists":{"messages":{"deal_list":[],"style_list":[],"deal_sets":[]},"putmessagediv":{"deal_list":[],"style_list":[],"deal_sets":[]}},
            "all_data": {}, 
            "templates": [
                {
                    "template" : "",
                    "conf_htm" : "",
                    "conf_col" : "",
                    "conf_data" : []
                }
            ],
            "inputing":{},
            "now_temp":0,
            "all_label":{},
            "settings_now":settings_now
        }
    )
    let name = `${document.getElementById("setsave_inp").value != "" ? document.getElementById("setsave_inp").value : "Untitled"}.json`
    let blob = new Blob([j], { type: "application/json" });
    let a = document.createElement('a');
    a.download = name;
    a.target = '_blank';
    a.href = window.webkitURL.createObjectURL(blob);
    a.click();
}
function saver(){
    Object.keys(lists).forEach(k => {
        let sl = lists[k]["style_list"]
        let dl = lists[k]["deal_list"]
        let ds = lists[k]["deal_sets"]
        while (sl.length < dl.length) {
            sl.push({})
        }
        let n = 0;
        ds.forEach(d => {
            templates[now_temp]["conf_data"].forEach(c => {
                sl[n][c] = []
                Array.from(mbyn(n).lastElementChild.getElementsByClassName(c)).forEach(cd => {
                    sl[n][c].push(cd.parentNode.style.cssText);
                })
            })
            n++;
        })
    })
    return JSON.stringify(

        {
            "lists":lists,
            "all_data": all_data, 
            "templates": templates,
            "inputing": inputing,
            "now_temp":now_temp,
            "all_label":all_label,
            "settings_now":settings_now
        }
    )
}
function loadrap(f) {
    f.text().then(t => {
        load(JSON.parse(t))
    })
}
function load(n){
    all_data = n["all_data"];
    lists = n["lists"];
    templates = n["templates"];
    inputing = n["inputing"]
    now_temp=n["now_temp"]
    all_label=n["all_label"]
    settings_now=n["settings_now"]
    document.getElementById("settings").innerHTML = ""
    document.getElementById("settingtab").innerHTML = ""
    Object.keys(settings).forEach(cc=>{
        settings_r(settings[cc],1,cc)
    })
    document.getElementById("messages").innerHTML = "";
    let x = 0;
    Object.keys(lists).forEach(kd => {
        let dl = lists[kd]["deal_list"]
        let ds = lists[kd]["deal_sets"]
        let sl = lists[kd]["style_list"]
        dl.forEach(d => {
            x++;
            document.getElementById(kd).insertAdjacentHTML("beforeend",
                messtemper(ds[x - 1]["use_temp"] + 1, templates[ds[x - 1]["use_temp"]]["conf_htm"]))
            let now = document.getElementById("cd")
            now.id = ""
            templates[ds[x - 1]["use_temp"]]["conf_data"].forEach(c => {
                let z = 0
                Array.from(now.getElementsByClassName(c)).forEach(m => {
                    m.value = d[c]
                    m.parentNode.style = sl[x - 1][c][z]
                    z++
                })
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
    lockreload()
    datamemodivreload()
    template_valuereload()
    template_scrollreload()
}
function subs() {
    let sel = document.getElementById("subssel");
    let num = Math.floor(Number(document.getElementById("subsnum").value))
    let txts = document.getElementById("randgenopt").value.split("\n")
    if (sel.selectedIndex < 1) return false;
    if (num < 1) return false;
    let selecting = Object.keys(all_data)[sel.selectedIndex - 1]
    for (let i = num + 0; i - num < txts.length && i <= lists["messages"]["deal_list"].length; i++) {
        if (!lists["messages"]["deal_sets"][i-1]["locked"]){
            lists["messages"]["deal_list"][i - 1][selecting] = txts[i - num]
            if (templates[lists["messages"]["deal_sets"][i-1]["use_temp"]]["conf_data"].includes(selecting)) {
                mbyn(i-1).lastElementChild.getElementsByClassName(selecting)[0].value = txts[i - num];
            }
        }  
    }
    template_valuereload()
    template_scrollreload()
}
/*document.addEventListener("keydown", e => {
    if (e.target.matches(".\\$text,.\\|text")) {
        if (e.code === "ArrowRight" || (e.code === "ArrowDown" && e.target.classList.contains("|"))) {
            if ((e.target.selectionStart === e.target.selectionEnd) && (e.target.selectionStart === e.target.value.length)) {
                e.target.id = "sd"
                let nekoflag = false;
                for (let i of document.querySelectorAll(".\\$text,.\\|text")) {
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
                for (let i of [].slice.call(document.querySelectorAll(".\\$text,.\\|text"), 0).reverse()) {
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
                        if (i.classList.contains("|")) {
                            i.focus()
                            let a = i.firstChild.value.includes("\n") ? Math.min(i.value.indexOf("\n"), s) : s
                            i.firstChild.setSelectionRange(a, a)
                            return true;
                        }
                        if (i.tagName == "BR" && !i.nextSibling.classList.contains("|") || (i.matches(".\\$") && i.parentNode != e.target.parentNode.parentNode)) {
                            let nn = i
                            let ss = i.classList.contains("$") ? i.firstChild.value.length : 0;
                            while (nn.nextSibling.tagName == "BR") {
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
})*/
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
        if (e.target.parentNode.parentNode.id == "normalp" || (e.target.parentNode.parentNode.parentNode.id=="abss" && e.target.parentNode.parentNode.parentNode.dataset.per=="p")) {
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
    flag += g ? "gm" : ""
    let reg = new RegExp(document.getElementById("replace_a").value, flag)
    let n = 0;
    let rr_list = []
    for (let i of lists["messages"]["deal_list"]){
        n++;
        let to = mbyn(n-1).lastElementChild
        for (let r of r_list){
            i[r] = i[r].replace(reg,document.getElementById("replace_b").value)
            rr_list.push(r)
            if (templates[lists["messages"]["deal_sets"][n-1]["use_temp"]]["conf_data"].includes(r)){
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
    return deparr(templates[lists["messages"]["deal_sets"][n1]["use_temp"]]["conf_data"], templates[lists["messages"]["deal_sets"][n2]["use_temp"]]["conf_data"])
}
function tempselectover(t){
    let el = t.parentNode.parentNode.parentNode
    let s = nbym(el)
    let pid = el.parentNode.id
    t.innerHTML = ""
    for (let i = 0; i < templates.length; i++) {
        t.insertAdjacentHTML("beforeend",`<option value="${i+1}"${lists[pid]["deal_sets"][s]["use_temp"] == i ? " selected" : ""}>${i+1}</option>`)
        
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
        let dl = lists[t.parentNode.id]["deal_list"]
        let ds = lists[t.parentNode.id]["deal_sets"]
        let el = t.lastElementChild
        let s = nbym(t)
        ds[s]["use_temp"] = e.target.selectedIndex
        el.innerHTML = templates[e.target.selectedIndex]["conf_htm"]
        templates[e.target.selectedIndex]["conf_data"].forEach(d=>{
            Array.from(el.getElementsByClassName(d)).forEach(b=>{
                b.value = dl[s][d]
            })
        })
        tempselectover(t.getElementsByClassName("tempselect")[0])
        t.getElementsByClassName("tempselect")[0].children[e.target.selectedIndex].selected=true

    })
}
function tab_next_scroll(e){
    let basevh = e.target.parentNode.getElementsByClassName("tab_header")[0].getBoundingClientRect().height*1.3
    let t = e.target.parentNode.getElementsByClassName("tab_header_in")[0]
    let inh = t.getBoundingClientRect().height
    if (Math.floor((Number(t.dataset.martop) - 1) * basevh) < Math.floor(inh) * -1) { return false }
    t.dataset.martop = String(Number(t.dataset.martop)-1)
    t.style.marginTop = `${Number(t.dataset.martop)*1.3}rem`
}
function tab_end_scroll(e){
    let basevh = e.target.parentNode.getElementsByClassName("tab_header")[0].getBoundingClientRect().height*4/3
    let t = e.target.parentNode.getElementsByClassName("tab_header_in")[0]
    let inh = t.getBoundingClientRect().height
    t.dataset.martop = Math.floor(inh/Math.floor(basevh))*-1+1
    t.style.marginTop = `${Number(t.dataset.martop)*1.3}rem`
}
function tab_prev_scroll(e){
    let t = e.target.parentNode.getElementsByClassName("tab_header_in")[0]
    if (t.dataset.martop=="0") { return false }
    t.dataset.martop = String(Number(t.dataset.martop)+1)
    t.style.marginTop = `${Number(t.dataset.martop)*1.3}rem`
}
function tab_start_scroll(e){
    let t = e.target.parentNode.getElementsByClassName("tab_header_in")[0]
    t.dataset.martop = 0
    t.style.marginTop = "0vh"
}
function plaincopy(){
    navigator.clipboard.writeText(document.getElementById("previewplain").value)
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
            lists[i.parentNode.id]["deal_sets"][nbym(i)]["locked"] = true
        }else{
            i.classList.remove("locked_mess")
            lists[i.parentNode.id]["deal_sets"][nbym(i)]["locked"] = false
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
function loadbybutton3(){
    if (document.getElementById("contextmenu_additionalload_inp").files.length === 0) return false;
    let f = document.getElementById("contextmenu_additionalload_inp").files[0];
    f.text().then(t => {
        additionalloader(t)
    })
}
function additionalloader(t){
    checkedremove()
    let n = JSON.parse(t)
    let conlist = {}
    let medt = templates.map(t=>t["template"])
    let c = 0
    n["templates"].forEach(k=>{
        if (medt.includes(k["template"])){
            conlist[c] = medt.indexOf(k["template"])
        }else{
            templates.push(k)
            conlist[c] = templates.length-1
        }
        c++
    })
    Object.keys(n["all_data"]).forEach(d=>{
        if (!Object.keys(all_data).includes(d)){
            all_data[d] = n["all_data"][d]
            Object.keys(lists).forEach(k=>{
                lists[k]["deal_list"].forEach(dd=>{
                    dd[d] = ""
                })
            })
        }
    })
    Object.keys(n["all_label"]).forEach(d=>{
        if (!Object.keys(all_label).includes(d)){
            all_label[d] = n["all_label"][d]
        }
    })
    Object.keys(n["lists"]).forEach(k=>{
        let dl = n["lists"][k]["deal_list"]
        let ds = n["lists"][k]["deal_sets"]
        let sl = n["lists"][k]["style_list"]
        ds.forEach(dss=>{
            dss["use_temp"] = conlist[dss["use_temp"]]
        })
        Object.keys(all_data).forEach(db => {
            if (!Object.keys(n["all_data"]).includes(db)) {
                dl.forEach(dd=>{
                    dd[db] = ""
                })
            }
        })
        let x = 0
        dl.forEach(d => {
            x++;
            document.getElementById(k).insertAdjacentHTML("beforeend",
                messtemper(ds[x - 1]["use_temp"] + 1, templates[ds[x - 1]["use_temp"]]["conf_htm"]))
            let now = document.getElementById("cd")
            now.id = ""
            now.parentNode.classList.add("checked_md")
            mcheckr(now.parentNode)
            templates[ds[x - 1]["use_temp"]]["conf_data"].forEach(c => {
                let z = 0
                Array.from(now.getElementsByClassName(c)).forEach(m => {
                    m.value = d[c]
                    m.parentNode.style = sl[x - 1][c][z]
                    z++
                })
            })
            lists[k]["deal_list"].push(d)
            lists[k]["deal_sets"].push(ds[x-1])
        })
    })
}
function sessionload(n){
    if (storageAvailable("localStorage")){
        let m = localStorage.getItem("Anyget_Last_Session_Save_Data")
        if (m != null){
            let a = JSON.parse(m)
            if (Array.isArray(a)){
                if (a.length > n){
                    load(JSON.parse(a[n]["data"]))
                    startmenukill()
                }
            }
        }
    }
}
function lockreload(){
    Object.keys(lists).forEach(k => {
        let c = 0
        lists[k]["deal_sets"].forEach(s => {
            let m = mbyidn(k,c)
            m.getElementsByClassName("meslockcheck")[0].checked = s["locked"]
            m.classList.remove("locked_mess")
            if (s["locked"]) {
                m.classList.add("locked_mess")
            }
            c++
        })

    })
}
function themeprev(){
    if (settings_now["views"]["colors"]["themeselect"] > 0) {
        nowsetchange("settings_views_colors_themeselect",settings_now["views"]["colors"]["themeselect"]-1)
    }
}
function themenext() {
    if (settings_now["views"]["colors"]["themeselect"]+1 < Object.keys(settings["views"]["list"]["colors"]["list"]["themeselect"]["options"]).length) {
        nowsetchange("settings_views_colors_themeselect", settings_now["views"]["colors"]["themeselect"] + 1)
    }
}
function themechange(){
    let n = String(settings_now["views"]["colors"]["themeselect"]+1).padStart(2,"0")
    let s = `@import url(themes/${n}.css);`
    let ss = ""
    if (settings_now["views"]["colors"]["highlightcheck"]){
        ss = `@import url(themes/fontcolors/${n}.css);`
    }
    document.getElementsByTagName("style")[0].innerText = s
    document.getElementsByTagName("style")[1].innerText = ss
}
function highlightchange(){
    let n = String(settings_now["views"]["colors"]["themeselect"]+1).padStart(2, "0")
    let ss = ""
    if (settings_now["views"]["colors"]["highlightcheck"]) {
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
    const o = settings["views"]["list"]["size"]["list"]["sortboxes"]["options"]
    boxes_sort = o[Object.keys(o)[settings_now["views"]["size"]["sortboxes"]]].split(",").map(Number)
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
    if (lists["messages"]["deal_list"].length < n+1){
        easypreviewobserver.unobserve(document.getElementById("easy_preview").children[n])
        document.getElementById("easy_preview").children[n].outerHTML = ""
        return false
    }
    let sent = templates[lists["messages"]["deal_sets"][n]["use_temp"]]["template"]
    templates[lists["messages"]["deal_sets"][n]["use_temp"]]["conf_data"].forEach(d => {
        let dd = d.startsWith("liner_") ? `$${d.replace("liner_", "")}$` : `|${d.replace("blocker_", "")}|`
        sent = sent.split(dd).join(escapeHtml(lists["messages"]["deal_list"][n][d]));
    })
    templates[lists["messages"]["deal_sets"][n]["use_temp"]]["conf_label"].forEach(d => {
        let dd = `%${d.replace("labeler_", "")}%`
        let inner = ""
        if (lists["messages"]["deal_list"][n][ltget(d)] == all_label[d]["labelset_calcstr"]) {
            inner = all_label[d]["labelset_calcthen"]
        } else {
            inner = all_label[d]["labelset_calcelse"]
        }
        sent = sent.split(dd).join(escapeHtml(inner));
    })
    if (document.getElementById("easy_preview").childElementCount < n+1){
        document.getElementById("easy_preview").insertAdjacentHTML("beforeend",`<div class="neko">${sent.replace(/\n/g, "<br>")}</div>`)
        easypreviewobserver.observe(document.getElementById("easy_preview").lastElementChild)
    }else{

        if (intersectobjects.has(document.getElementById("easy_preview").children[n])) {
            let anchorok = {}
            Object.keys(all_data).forEach(a => {
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
    return `<div class="messagediv droppable" onclick="md_click(event)" draggable="false" ondragstart="dragstart(event);" ondragover="dragover(event);" ondragleave="dragleave(event);" ondrop="drop(event);" ondragend="dragend(event);"><div class="messagehead"><div class="headright"><div class="meslock"><label class="meslocklabel"><input type="checkbox" class="meslockcheck" onchange="lockmes(event);"></label></div><input type="checkbox" class="messelectcheck" onchange="mescheck(event)"></div><div class="tempselectdiv"><select class="tempselect" onmouseover="tempselectover(event.target)" onmouseout="tempselectout(event.target)" onchange="tempselected(event)"><option value="${t}" selected">${t}</option></select></div><button class="closebtn" onclick="closebtnclick(event)" title="レスの削除"></button></div><div class="message" id="cd">${h}</div></div>`
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
    e.stopPropagation()
    if (e.target.tagName!="DIV"){return false}
    if (!(e.ctrlKey || e.metaKey) && e.shiftKey) {
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
    } else if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.currentTarget.classList.add("checked_md")
        mcheckr(e.currentTarget)
    }else if ((e.ctrlKey || e.metaKey)){
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
                    toc.value = lists["messages"]["deal_list"][toi][d]
                }
            }
            nnn++
        })
    });
}
function mesdel(target){
    let pid = target.parentNode.id
    let dl = lists[pid]["deal_list"]
    let ds = lists[pid]["deal_sets"]
    let newdeal = dl.map( list => ({...list}))
    let mememedl = dl.map( list => ({...list}))
    let num = nbym(target)+1;
    target.outerHTML = ""
    ds.splice(num - 1, 1)
    newdeal.splice(num - 1, 1)
    mememedl.pop()
    Object.keys(all_data).forEach(k=>{
        if (all_data[k]["dataset_fix?"]){
            let c = 0
            mememedl.forEach(d=>{
                newdeal[c][k] = d[k]
                Array.from(mbyidn(pid,c).getElementsByClassName(k)).forEach(t=>{
                    t.value = d[k]
                })
                c++
            })
        }
    })
    lists[pid]["deal_list"] = newdeal.map( list => ({...list}))
    if (pid == "messages") {
        if (document.getElementById("easy_preview").children[num - 1]){
            document.getElementById("easy_preview").children[num - 1].outerHTML = ""
        }
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
    }
    
    let n =getn()
    mexsets[n] = {};
    dl.forEach(d=>{
        if (Object.keys(mexsets[n]).includes(d[n])){
            mexsets[n][d[n]] = mexsets[n][d[n]]+1
        }else{
            mexsets[n][d[n]] = 1
        }
    })
    
    datamemodivreload()

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
    if (m == null || m.parentNode==null){return false}
    return Array.from(m.parentNode.children).indexOf(m)
}
function mbyn(n){
    return document.getElementById("messages").children[n]
}
function mbyidn(id,n){
    return document.getElementById(id).children[n]
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
function moveft(array,array2, index, at) {
    const value = array[index]
    array.splice(index,1)
    array2.splice(at,0,value)
    return [array,array2]
}
function datamemoreload(){
    let t = document.getElementById("datamemopul")
    let i = t.selectedIndex-1
    if (i == -1){return false}
    let n = Object.keys(all_data)[i];
    mexsets[n] = {};
    lists["messages"]["deal_list"].forEach(d=>{
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
function labelreload(id,n){
    templates[lists[id]["deal_sets"][n]["use_temp"]]["conf_label"].forEach(xx => {
        if (all_label[xx]["labelset_calctarget"] >= 0) {
            Array.from(mbyidn(id,n).getElementsByClassName(xx)).forEach(iii => {
                if (lists[id]["deal_list"][n][Object.keys(all_data)[all_label[xx]["labelset_calctarget"]]] == all_label[xx]["labelset_calcstr"]) {
                    iii.innerText = all_label[xx]["labelset_calcthen"]
                }else{

                    iii.innerText = all_label[xx]["labelset_calcelse"]
                }
            })
        }
    })
}
function ltget(d){
    return Object.keys(all_data)[all_label[d]["labelset_calctarget"]]
}
function labelpulchange(e){
    if (e.target.selectedIndex != 0){
        let selecting = Object.keys(all_label)[e.target.selectedIndex-1]
        document.getElementById("labelset_calctarget").children[all_label[selecting]["labelset_calctarget"]+1].selected=true
        document.getElementById("labelset_calctarget").disabled=false
        document.getElementById("labelset_calcstr").value = all_label[selecting]["labelset_calcstr"]
        document.getElementById("labelset_calcthen").value = all_label[selecting]["labelset_calcthen"]
        document.getElementById("labelset_calcelse").value = all_label[selecting]["labelset_calcelse"]
        document.getElementById("labelset_adder").value = all_label[selecting]["labelset_adder"]
    }
}
function labelset_textchange(e){
    let selecting = Object.keys(all_label)[document.getElementById("labelpul").selectedIndex - 1]
    all_label[selecting][e.target.id] = e.target.value
    Object.keys(lists).forEach(k=>{
        let c = 0
        lists[k]["deal_list"].forEach(kk=>{
            labelreload(k,c)
            c++
        })
    })
    formlabelreload()
}
function labelset_calctargetchange(e){
    let selecting = Object.keys(all_label)[document.getElementById("labelpul").selectedIndex - 1]
    all_label[selecting][e.target.id] = e.target.selectedIndex-1
    document.getElementById("labelset_calcstr").disabled=false
    document.getElementById("labelset_calcthen").disabled=false
    document.getElementById("labelset_calcelse").disabled = false
    document.getElementById("labelset_adder").disabled = false
}
function formlabelreload(){
    templates[now_temp]["conf_label"].forEach(xx => {
        if (all_label[xx]["labelset_calctarget"] >= 0) {
            Array.from(document.getElementById("form_inp").getElementsByClassName(xx)).forEach(iii => {
                if (inputing[Object.keys(all_data)[all_label[xx]["labelset_calctarget"]]] == all_label[xx]["labelset_calcstr"]) {
                    iii.innerText = all_label[xx]["labelset_calcthen"]
                } else {
                    iii.innerText = all_label[xx]["labelset_calcelse"]
                }
            })
        }
    })
}
function labelerclick(e){
    let at = all_label[e.target.classList[1]]["labelset_calctarget"]
    if (at < 0) { return false }
    let av = all_label[e.target.classList[1]]["labelset_adder"]
    if (e.target.parentNode.parentNode.classList.contains("messagediv")){
        let pid = e.target.parentNode.parentNode.parentNode.id
        let n = nbym(e.target.parentNode.parentNode)
        let v = lists[pid]["deal_list"][n][Object.keys(all_data)[at]]
        if (/^\-?[0-9]+(\.[0-9]+)?$/.test(v) && e.target.value != 0){
            lists[pid]["deal_list"][n][Object.keys(all_data)[at]] = Number(v)+Number(av)
            Array.from(e.target.parentNode.getElementsByClassName(Object.keys(all_data)[at])).forEach(b=>{
                b.value = lists[pid]["deal_list"][n][Object.keys(all_data)[at]]
            })
        }
    }else{
        let v = inputing[Object.keys(all_data)[at]]
        if ((/^\-?[0-9]+(\.[0-9]+)?$/.test(v) || v == "") && e.target.value != 0) {
            inputing[Object.keys(all_data)[at]] = Number(v) + Number(av)
            Array.from(e.target.parentNode.getElementsByClassName(Object.keys(all_data)[at])).forEach(b => {
                b.value = inputing[Object.keys(all_data)[at]]
            })
        }
    }

}
document.addEventListener("contextmenu",e=>{
    e.preventDefault()
    Array.from(document.getElementsByClassName("contextmenu")).forEach(cm => {
        cm.style.display = "none"
    })
    if (e.target.matches(".checked_md div,.checked_md")){
        const cm = document.getElementById("messagediv_contextmenu")
        cm.style.left = String(e.clientX) + "px"
        cm.style.top = String(e.clientY) + "px"
        cm.style.display = "flex"
    } else if (e.target.id == "messages" || e.target.matches(".messagediv div,.messagediv")){
        const cm = document.getElementById("messages_contextmenu")
        cm.style.left = String(e.clientX) + "px"
        cm.style.top = String(e.clientY) + "px"
        cm.style.display = "flex"
    }
})
document.addEventListener("click",e=>{
    Array.from(document.getElementsByClassName("contextmenu")).forEach(cm=>{
        cm.style.display = "none"
    })
})
function checkedtosavedata(){
    Object.keys(lists).forEach(k => {
        let sl = lists[k]["style_list"]
        let dl = lists[k]["deal_list"]
        let ds = lists[k]["deal_sets"]
        while (sl.length < dl.length) {
            sl.push({})
        }
        let n = 0;
        ds.forEach(d => {
            templates[now_temp]["conf_data"].forEach(c => {
                sl[n][c] = []
                Array.from(mbyn(n).lastElementChild.getElementsByClassName(c)).forEach(cd => {
                    sl[n][c].push(cd.parentNode.style.cssText)
                })
            })
            n++;
        })
    })
    let mellists = {}
    Object.keys(lists).forEach(k => {
        mellists[k] = {}
        let cs = document.getElementById(k).getElementsByClassName("checked_md")
        Object.keys(lists[k]).forEach(kk => {
            mellists[k][kk] = []
            Array.from(cs).forEach(c=>{
                mellists[k][kk].push(lists[k][kk][nbym(c)])
            })
        })
    })
    return JSON.stringify(
        {
            "lists": mellists,
            "all_data": all_data,
            "templates": templates,
            "inputing": inputing,
            "now_temp": now_temp,
            "all_label": all_label,
            "settings_now": settings_now
        })
}
function contextcommand_checkedsave() {
    let blob = new Blob([checkedtosavedata()], { type: "application/json" });
    let name = `${prompt("ファイル名を入力")}.json`
    let a = document.createElement('a');
    a.download = name;
    a.target = '_blank';
    a.href = window.webkitURL.createObjectURL(blob);
    a.click();
}
function contextcommand_checkedcopy(){
    if (!storageAvailable("localStorage")){return false}
    let j = checkedtosavedata()
    localStorage.setItem("Anyget_clipboard_data",j)

}
function contextcommand_checkedcut(){
    contextcommand_checkedcopy()
    document.getElementsByClassName("checked_md")[0].getElementsByClassName("closebtn")[0].click()
}
function contextcommand_flatpaste(){
    if (!storageAvailable("localStorage")) { return false }
    let t = localStorage.getItem("Anyget_clipboard_data")
    if (t != null){
        additionalloader(t)
    }
}
function asetyc(e){
    nowsetchange(e.target.dataset.tarid,e.target.value)
}
function setsc(e){
    document.getElementById("settings").scrollTop = document.getElementById(e.target.dataset.dhref).offsetTop
}

function searchtest(s,r){
    if (r){
        try {
            new RegExp(s);
        } catch (e) {
            s = ""
        }
    }
    if (s != ""){
        let count = 0
        lists["messages"]["deal_list"].forEach(d=>{
            searchunimessage(count,s,r)
            count++
        })
    }else{
        Array.from(document.getElementsByClassName("s_span")).forEach(st=>{
            st.outerHTML = st.innerHTML
        })
    }
}

function searchunimessage(n,s,r){
    if (r){
        try {
            new RegExp(s);
        } catch (e) {
            return false
        }
    }
    let d = lists["messages"]["deal_list"][n]
    templates[lists["messages"]["deal_sets"][n]["use_temp"]]["conf_data"].forEach(c => {
        let m = mbyn(n)
        let o = ""
        if (r){
            o = escapeHtmlSp(d[c]).replace(new RegExp("("+escapeHtmlSp(s)+")","gm"),'<span class="s_span">$1</span>')
        }else{
            o = escapeHtmlSp(d[c]).split(escapeHtmlSp(s)).join(`<span class="s_span">${escapeHtmlSp(s)}</span>`)
        }
        Array.from(m.getElementsByClassName(c)).forEach(mm => {
            let t = mm.nextElementSibling
            mm.value = d[c]
            t.innerHTML = o
            if (c.startsWith("liner_")) {
                t.scrollLeft = mm.scrollLeft
            } else {
                t.scrollTop = mm.scrollTop
            }
        })
    })
}

document.addEventListener("keydown",e=>{
    if ((e.ctrlKey || e.metaKey) && e.code == "KeyF"){
        e.preventDefault()
        if (!document.body.classList.contains("nonono_startmenu")){
            if (document.getElementById("mesandform").classList.contains("radised")){
                document.getElementById("messagesearcherdiv").dataset.searching = "true"
                document.getElementById("messagesearcher").focus()
            }
        }
    }
    if (e.code == "Escape"){
        e.preventDefault()
        if (!document.body.classList.contains("nonono_startmenu")){
            if (document.getElementById("mesandform").classList.contains("radised")){
                document.getElementById("messagesearcherdiv").dataset.searching = "false"
            }
        }
    }
    if ((e.ctrlKey || e.metaKey) && e.code == "KeyC" && document.querySelector(":focus")==null){
        if (!document.body.classList.contains("nonono_startmenu")){
            if (document.getElementById("mesandform").classList.contains("radised")){
                contextcommand_checkedcopy()
            }
        }
    }
    if ((e.ctrlKey || e.metaKey) && e.code == "KeyX" && document.querySelector(":focus")==null){
        if (!document.body.classList.contains("nonono_startmenu")){
            if (document.getElementById("mesandform").classList.contains("radised")){
                contextcommand_checkedcut()
            }
        }
    }
    if ((e.ctrlKey || e.metaKey) && e.code == "KeyV" && document.querySelector(":focus") == null) {
        if (!document.body.classList.contains("nonono_startmenu")) {
            if (document.getElementById("mesandform").classList.contains("radised")) {
                if (document.getElementsByClassName("checked_md").length > 0){
                    contextcommand_checkedpaste()
                }else{
                    contextcommand_flatpaste()
                }
            }
        }
    }
})
function searcherpress(e){
    if (e.code == "Enter") {
        e.preventDefault()
        if (document.getElementsByClassName("s_span_special").length > 0){
            document.getElementsByClassName("s_span_special")[0].classList.remove("s_span_special")
        }
        if (!document.body.classList.contains("nonono_startmenu")) {
            if (Array.from(document.getElementsByClassName("s_span")).length>0){
                if (searchlevel == "?"){
                    searchlevel = 0
                }else{
                    if (e.shiftKey){
                        searchlevel -= 1
                        searchlevel += Array.from(document.getElementsByClassName("s_span")).length
                    }else{
                        searchlevel += 1
                    }
                }
                searchlevel = searchlevel % Array.from(document.getElementsByClassName("s_span")).length
                let tt = document.getElementsByClassName("s_span")[searchlevel]
                tt.classList.add("s_span_special")
                tt.parentNode.scrollTop = tt.offsetTop
                tt.parentNode.previousElementSibling.scrollTop = tt.parentNode.scrollTop
                document.getElementById("messages").scrollTop = tt.parentNode.parentNode.offsetTop
                document.getElementById("searchcounter").innerHTML = ` ${searchlevel + 1} / ${Array.from(document.getElementsByClassName("s_span")).length}`
                
                
            }else{
                searchlevel = 0
                document.getElementById("searchcounter").innerHTML = ` 0 / 0`
            }
        }
    }
}
function messagesearch(){
    searchtest(document.getElementById("messagesearcher").value,document.getElementById("search_regcheck").checked)
    document.getElementById("searchcounter").innerHTML = ` ? / ${Array.from(document.getElementsByClassName("s_span")).length}`
    searchlevel = "?"
}

function linerscr(e){
    e.target.nextElementSibling.scrollLeft = e.target.scrollLeft
}

function blockerscr(e){
    e.target.nextElementSibling.scrollTop = e.target.scrollTop
}

function replacerpress(e){
    if (e.code == "Enter") {
        e.preventDefault()
        if (!e.shiftKey){
            if ((e.ctrlKey || e.metaKey) && e.altKey){
                let r = document.getElementById("search_regcheck").checked
                let v = document.getElementById("messagesearcher").value
                let ff = false
                if (r) {
                    try {
                        new RegExp(v);
                    } catch (ee) {
                        ff = true
                    }
                }
                if (ff) { return false }
                let n = 0
                lists["messages"]["deal_list"].forEach(d=>{
                    templates[lists["messages"]["deal_sets"][n]["use_temp"]]["conf_data"].forEach(c=>{
                        if (r){
                            d[c] = d[c].replace(new RegExp(v,"gm"),document.getElementById("messagereplacer").value)
                        }else{
                            d[c] = d[c].split(v).join(document.getElementById("messagereplacer").value)
                        }
                    })
                    n++
                })
                messagesearch()
            } else {
                if (searchlevel == "?" || document.getElementsByClassName("s_span_special").length < 1){
                    document.getElementById("messagesearcher").dispatchEvent(new KeyboardEvent("keydown", {code:"Enter", shiftKey: false }))
                }else{
                    let r = document.getElementById("search_regcheck").checked
                    let v = document.getElementById("messagesearcher").value
                    let ff = false
                    if (r) {
                        try {
                            new RegExp(v);
                        } catch (ee) {
                            ff = true
                        }
                    }
                    if (ff){return false}
                
                    let searchlevelback = searchlevel+0
                    let t = document.getElementsByClassName("s_span_special")[0]
                    let n = nbym(t.parentNode.parentNode.parentNode.parentNode)
                    let tn = nbym(t)
                    if (r){
                        let o = lists["messages"]["deal_list"][n][t.parentNode.parentNode.firstElementChild.classList[1]]
                        let ma = [...o.matchAll(new RegExp(v,"gm"))]
                        let reger = new RegExp(v, "ym")
                        reger.lastIndex = ma[tn]["index"]
                        o = o.replace(reger, document.getElementById("messagereplacer").value)
                        lists["messages"]["deal_list"][n][t.parentNode.parentNode.firstElementChild.classList[1]] = o
                    }else{
                        let c = 0
                        let l = lists["messages"]["deal_list"][n][t.parentNode.parentNode.firstElementChild.classList[1]].split(v)
                        let o = l.shift()
                        l.forEach(s=>{
                            if (c == tn){
                                o += document.getElementById("messagereplacer").value
                            }else{
                                o += v
                            }
                            o += s
                            c++
                        })
                        lists["messages"]["deal_list"][n][t.parentNode.parentNode.firstElementChild.classList[1]] = o
                    }
                    searchunimessage(n,v,r)
                    searchlevel = searchlevelback-(e.shiftKey?-1:1)
                    document.getElementById("messagesearcher").dispatchEvent(new KeyboardEvent("keydown", {code:  "Enter", shiftKey: false }))
                }
            }
        }
    }
}

function template_valuereload(){
    let t = document.getElementById("template")
    let h = document.getElementById("template_highlighter")
    let o = ""
    t.value.split("\n").forEach(l=>{
        if (l.startsWith("//")){
            o += `<span class="highlight_comment">${escapeHtmlSp(l)}</span>`
        }else{
            o += escapeHtmlSp(l)
        }
        o += "<br>"
    })
    h.innerHTML = o
}

function template_scrollreload(){
    let t = document.getElementById("template")
    let h = document.getElementById("template_highlighter")
    h.scrollTop = t.scrollTop
}
function getMMDDHHSSMM()
{
    var dt = new Date() ;
    var month = dt.getMonth() + 1 ;
    var date = dt.getDate() ;
    var hours = dt.getHours() ;
    var minutes = dt.getMinutes() ;
    var seconds = dt.getSeconds();
    var ymdhms = ( "00" + new String( month )).slice( -2 ) + "/" + ( "00" + new String(  date )).slice( -2 ) ;
    ymdhms += " " + ( "00" + new String( hours )).slice( -2 ) + ":" + ( "00" + new String( minutes )).slice( -2 ) +     ":" + ( "00" + new String( seconds )).slice( -2 ) ;
    return ymdhms ;
}
function checkedremove(){
    Array.from(document.getElementsByClassName("checked_md")).forEach(cm => {
        cm.classList.remove("checked_md")
        mcheckr(cm)
    })
}

function contextcommand_checkedpaste(){
    if (document.getElementsByClassName("checked_md").length==0){return false}
    let tm = document.getElementsByClassName("checked_md")[document.getElementsByClassName("checked_md").length-1]
    if (tm.nextElementSibling == null){
        contextcommand_flatpaste()
    }else{
        let tmn = tm.nextElementSibling
        contextcommand_flatpaste()
        if (document.getElementsByClassName("checked_md").length==0){return false}
        let dm = document.getElementsByClassName("checked_md")[0]
        dm.dispatchEvent(new DragEvent("dragstart",{"dataTransfer":new DataTransfer()}))
        tmn.dispatchEvent(new DragEvent("drop"))
    }

}