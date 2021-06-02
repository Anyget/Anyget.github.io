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
let now_temp = 0
let deal_sets = []
let inputing = {}
let now_theme = 0
window.onload = function () {
    let l = document.getElementById("themeselect")
    let c = 0
    theme_list.forEach(t=>{
        c++
        l.insertAdjacentHTML("beforeend", `<option value=${("0" + c).slice(-2)}>${t}</option>`)
    })
    l.firstChild.selected = true
    for (i of document.getElementsByClassName("functionselect")){
        fitselector(i)
    }
};
window.addEventListener('beforeunload', function (event) {
    event.preventDefault()
    event.returnValue = ''
})
document.addEventListener("paste", function (e) {
    let target = e.target
    if (target.matches("div[contenteditable='true']")) {
        let text = e.clipboardData.getData("text/plain");
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;
        selection.deleteFromDocument();
        let cas = selection.getRangeAt(0);
        cas.insertNode(document.createTextNode(text));
        selection.collapseToEnd();
        e.preventDefault();
    };
});


function escapeHtml(str) {
    let div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML.replace(/<br>/g, "\n").replace(/\"/g, "&quot;");
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
                            let t = escapeHtml(data[data.length - 1]).replace(/[^_]*_/, "")
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
                            htm += `" placeholder="${escapeHtml(data[data.length - 1]).replace(/[^_]*_/, "")}"></textarea>`;
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
    htm = htm.replace(/\<\/textarea\>\n/g,"</textarea>")
    htm = htm.replace(/\n/g, "<br>");
    if (mode == "normal") {
        let backupconfdata = templates[now_temp]["conf_data"];
        document.getElementById("edited").innerHTML = col.replace(/\n/g, "<br>");
        document.getElementById("form_inp").innerHTML = htm;
        templates[now_temp]["conf_htm"] = htm;
        templates[now_temp]["conf_col"] = col;
        templates[now_temp]["conf_data"] = Array.from(new Set(data))
        templates[now_temp]["conf_data"].forEach(i => {
        if (!Object.keys(all_data).includes(i)) {
            all_data[i] = ({"adder": 0, "anchor?": false, "anchor": "", "fix?": false, "datalist?": false});
            document.getElementById("datapul").insertAdjacentHTML("beforeend", `<option name="${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</option>`)
            document.getElementById("subssel").insertAdjacentHTML("beforeend", `<option name="${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</option>`)
            document.getElementById("replace_list").insertAdjacentHTML("beforeend", `<li><input type="checkbox" id="replacecheck_${escapeHtml(i)}"></input><label for="replacecheck_${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</label></li>`)
            if (i.startsWith("liner_")) {
                document.getElementById("datalists").insertAdjacentHTML("beforeend", `<datalist id="n_list_${escapeHtml(i)}"></datalist>`)
            };
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
        n++;
        let box = document.getElementById(`message_${n}`);
        let t = deal_sets[n-1]["use_temp"]
        templates[t]["conf_data"].forEach(x => {
            if (backupconfdata.includes(x) || now_temp != t) {
                style_list[n - 1][x] = []
                if (x.startsWith("liner_")){
                    Array.from(box.getElementsByClassName(x)).forEach(cd => {
                        style_list[n - 1][x].push(cd.parentNode.style.cssText)
                    })
                }else{
                    Array.from(box.getElementsByClassName(x)).forEach(cd => {
                        style_list[n - 1][x].push(cd.style.cssText);
                    })
                }
                
            }else if (!Object.keys(style_list[n - 1]).includes(x)) {
                style_list[n - 1][x] = []
            }
        })
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
        n++;
        let box = document.getElementById(`message_${n}`);
        if (deal_sets[n - 1]["use_temp"] == now_temp){
            box.innerHTML = templates[now_temp]["conf_htm"];
            Object.keys(all_data).forEach(xx => {
                if (typeof ii[xx] === "undefined") {
                    ii[xx] = "";
                };
                let cc = 0
                Array.from(box.getElementsByClassName(xx)).forEach(iii => {
                    iii.value = ii[xx];
                    if (xx.startsWith("blocker_")) {
                        iii.style = style_list[n - 1][xx][cc]
                    } else {
                        iii.parentNode.style = style_list[n - 1][xx][cc]
                    }
                    cc++
                })
            });
        }
        
    });
}
function addmess() {
    for (let i = 0; i < document.getElementById("messv").value; i++) {
        document.getElementById("messages").insertAdjacentHTML("beforeend",
            '<div class="messagediv" draggable="true" ondragstart="dragstart(event);" ondragover="dragover(event);" ondragleave="dragleave(event);" ondrop="drop(event);" ondragend="dragend(event);">'
            +'<div class="messagehead"><div class="meslock"><label class="meslocklabel"><input type="checkbox" class="meslockcheck" onchange="lockmes(event);"></label></div><div class="tempselectdiv">'
            + '<select class="tempselect" onmouseover="tempselectover(event)" onmouseout="tempselectout(event)" onchange="tempselected(event)">'
            + '<option value="'
            + (Number(now_temp)+1)
            + '" selected">'
            + (Number(now_temp)+1)
            + '</option></select></div><button class="closebtn" title="レスの削除">×</button></div><div class="message" id="cd">'
            + templates[now_temp]["conf_htm"] + "</div></div>");
        let formi_c = document.getElementById("form_inp")
        let now = document.getElementById("cd")
        let num = deal_list.length
        now.id = "message_" + (num + 1)
        deal_list.push({})
        Object.keys(all_data).forEach(k=>{
            deal_list[num][k] = ""
        })
        deal_sets.push({
            "use_temp":now_temp+0,
            "locked":false
        })
        templates[now_temp]["conf_data"].forEach(i=>{
            if (i.startsWith("blocker_")) {
                let n = 0
                Array.from(now.getElementsByClassName(i)).forEach(o=>{
                    let nnnnn = formi_c.getElementsByClassName(i)[n]
                    o.style = nnnnn.style.cssText;
                    deal_list[num][i] = o.value = nnnnn.value
                    n++
                })
            } else {
                let n = 0
                Array.from(now.getElementsByClassName(i)).forEach(o=>{
                    let nnnnn = formi_c.getElementsByClassName(i)[n]
                    o.parentNode.style = nnnnn.parentNode.style.cssText;
                    deal_list[num][i] = o.value = nnnnn.value
                    n++
                })
            };
        })
        templates[now_temp]["conf_data"].forEach(k => {
            let added = String(document.getElementById("form_inp").getElementsByClassName(k)[0].value)
            let na = Number(all_data[k]["adder"])
            if (/^\-?[0-9]+(\.[0-9]+)?$/.test(added) && na != 0) {
                added = Number(added) + na
            }
            inputing[k] = String(added)
            Array.from(document.getElementById("form_inp").getElementsByClassName(k)).forEach(i=>{
                i.value = inputing[k]
            })
        });
    }
    let obj = document.getElementById("messages");
    obj.scrollTop = obj.scrollHeight;
};

document.getElementById("datapul").addEventListener("change", (e) => {
    if (e.target.value != "設定変更する変数を選択") {
        document.getElementById("adder").disabled = false;
        let selecting = Object.keys(all_data)[(e.target.selectedIndex) - 1];
        document.getElementById("adder").value = all_data[selecting]["adder"];
        document.getElementById("fix?").disabled = false;
        document.getElementById("fix?").checked = all_data[selecting]["fix?"];
        if (e.target.value.startsWith("$")) {
            document.getElementById("anchor?").disabled = false;
            document.getElementById("anchor?").checked = all_data[selecting]["anchor?"];
            document.getElementById("anchor").disabled = !all_data[selecting]["anchor?"]
            document.getElementById("anchor").value = all_data[selecting]["anchor"];
            document.getElementById("datalist?").disabled = false;
            document.getElementById("datalist?").checked = all_data[selecting]["datalist?"];
        } else {
            document.getElementById("anchor?").disabled = true;
            document.getElementById("anchor?").checked = false;
            document.getElementById("anchor").value = "";
            document.getElementById("datalist?").disabled = true;
            document.getElementById("datalist?").checked = false;
        }

    };
});

document.getElementById("adder").addEventListener("change", (e) => {
    all_data[Object.keys(all_data)[(document.getElementById("datapul").selectedIndex) - 1]]["adder"] = e.target.value;
});

document.addEventListener("input", (e) => {
    let target = e.target;
    let num;
    let inp;
    if (target.matches(".message textarea,.message input")) {
        let clas = target.className.replace(/^[^ ]* /, "");
        if (target.matches("textarea")) {
            num = target.parentNode.id.replace("blocker_", "") - 1;
            inp = target.value;
            deal_list[num][clas] = inp;
        } else {
            num = target.parentNode.parentNode.id.replace("liner_", "") - 1;
            inp = target.value;
            deal_list[num][clas] = inp;
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
document.addEventListener("click", (e) => {
    let target = e.target;
    if (target.className === "closebtn") {
        let num = Number(target.parentNode.nextElementSibling.id.replace("message_", ""));
        for (let i = num; i < deal_list.length; i++) {
            let to = document.getElementById(`message_${i}`);
            to.innerHTML = templates[deal_sets[i]["use_temp"]]["conf_htm"]
            let from = document.getElementById(`message_${i + 1}`);
            Object.keys(all_data).forEach(d => {
                let nnn = 0
                if (!all_data[d]["fix?"]) {
                    deal_list[i - 1][d] = deal_list[i][d];
                };
                Array.from(to.getElementsByClassName(d)).forEach(toc=>{
                    let fromc = from.getElementsByClassName(d)[nnn];
                    if (fromc) {
                        if (!all_data[d]["fix?"]) {
                            toc.style = fromc.style.cssText;
                            toc.parentNode.style = fromc.parentNode.style.cssText;
                            toc.value = fromc.value;
                        }else{
                            toc.value = deal_list[i-1][d]
                        }
                    }
                    nnn++
                })
            });
        };
        deal_list.pop();
        deal_sets.splice(num-1,1)
        document.getElementById("messages").lastChild.outerHTML = "";
        lockreload()
    };
});
function changefix() {
    let selecting = Object.keys(all_data)[document.getElementById("datapul").selectedIndex - 1];
    all_data[selecting]["fix?"] = document.getElementById("fix?").checked;
}
function flapdatalist() {
    let selecting = Object.keys(all_data)[document.getElementById("datapul").selectedIndex - 1];
    all_data[selecting]["datalist?"] = document.getElementById("datalist?").checked;
    if (!document.getElementById("datalist?").checked) {
        document.getElementById(`list_${selecting}`).id = `n_list_${selecting}`
    } else {
        document.getElementById(`n_list_${selecting}`).id = `list_${selecting}`
    }
}
function dragstart(e) {
    dragging = e.target
    document.querySelector("body").classList.add("nonono");
}
function dragover(e) {
    if (!(e.target.classList.contains("messagediv") && document.querySelector("body").classList.contains("nonono"))) {
        return false;
    }
    e.preventDefault();
    e.target.classList.add("dragover");
}
function dragleave(e) {
    e.target.classList.remove("dragover");
}
function drop(e) {
    let target = e.target
    if (!(target.classList.contains("messagediv") && document.querySelector("body").classList.contains("nonono"))) {
        return false;
    }
    e.preventDefault();
    document.querySelector("body").classList.remove("nonono");
    target.classList.remove("dragover");
    let target_num = Number(target.children[1].id.replace("message_", ""))
    let dragging_num = Number(dragging.children[1].id.replace("message_", ""))

    if (target_num != dragging_num) {
        if (target_num > dragging_num) {
            let dragmes = dragging.children[1];
            let itiho = dragmes.cloneNode(true);
            let itihoarr = {};
            let itihods = deal_sets[dragging_num - 1]
            Object.keys(all_data).forEach(d => {
                let nnn = 0
                if (!all_data[d]["fix?"]) {
                    itihoarr[d] = deal_list[dragging_num - 1][d]
                }
                Array.from(itiho.getElementsByClassName(d)).forEach(toc => {
                    let fromc = dragmes.getElementsByClassName(d)[nnn];
                    if (fromc) {
                        if (!all_data[d]["fix?"]) {
                            toc.style = fromc.style.cssText;
                            toc.parentNode.style = fromc.parentNode.style.cssText;
                            toc.value = fromc.value;
                        }else{
                            toc.value = deal_list[target_num-1][d]
                        }
                    }
                    nnn++
                })
            })
            for (let i = dragging_num; i < target_num; i++) {
                let to = document.getElementById(`message_${i}`);
                to.innerHTML = templates[deal_sets[i]["use_temp"]]["conf_htm"]
                let from = document.getElementById(`message_${i + 1}`);
                Object.keys(all_data).forEach(d => {
                    let nnn = 0
                    if (!all_data[d]["fix?"]) {
                        deal_list[i - 1][d] = deal_list[i][d];
                    }
                    Array.from(to.getElementsByClassName(d)).forEach(toc => {
                        let fromc = from.getElementsByClassName(d)[nnn];
                        if (fromc) {
                            if (!all_data[d]["fix?"]) {
                                toc.style = fromc.style.cssText;
                                toc.parentNode.style = fromc.parentNode.style.cssText;
                                toc.value = fromc.value;
                            } else {
                                toc.value = deal_list[i - 1][d]
                            }
                        }
                        nnn++
                    })
                });
                deal_sets[i-1] = deal_sets[i]
            };
            deal_sets[target_num-1] = itihods
            target.children[1].innerHTML = templates[deal_sets[target_num-1]["use_temp"]]["conf_htm"]
            Object.keys(all_data).forEach(d => {
                let nnn = 0
                if (!all_data[d]["fix?"]) {
                    deal_list[target_num - 1][d] = itihoarr[d];
                }
                Array.from(target.getElementsByClassName(d)).forEach(toc => {
                    let fromc = itiho.getElementsByClassName(d)[nnn];
                    if (fromc) {
                        if (!all_data[d]["fix?"]) {
                            toc.style = fromc.style.cssText;
                            toc.parentNode.style = fromc.parentNode.style.cssText;
                            toc.value = fromc.value;
                        }else{
                            toc.value = deal_list[target_num-1][d]
                        }
                    }
                    nnn++
                })
            });
        } else {
            let dragmes = dragging.children[1];
            let itiho = dragmes.cloneNode(true);
            let itihoarr = {}
            let itihods = deal_sets[dragging_num - 1]
            Object.keys(all_data).forEach(d => {
                let nnn = 0
                if (!all_data[d]["fix?"]) {
                    itihoarr[d] = deal_list[dragging_num - 1][d]
                }
                Array.from(itiho.getElementsByClassName(d)).forEach(toc => {
                    let fromc = dragmes.getElementsByClassName(d)[nnn];
                    if (fromc) {
                        if (!all_data[d]["fix?"]) {
                            toc.style = fromc.style.cssText;
                            toc.parentNode.style = fromc.parentNode.style.cssText;
                            toc.value = fromc.value;
                        }else{
                            toc.value = deal_list[target_num-1][d]
                        }
                    }
                    nnn++
                })
            })
            for (let i = dragging_num; i > target_num; i--) {
                deal_sets[i - 1] = deal_sets[i - 2]
                let to = document.getElementById(`message_${i}`);
                to.innerHTML = templates[deal_sets[i-2]["use_temp"]]["conf_htm"]
                let from = document.getElementById(`message_${i - 1}`);
                Object.keys(all_data).forEach(d => {
                    let nnn = 0
                    if (!all_data[d]["fix?"]) {
                        deal_list[i - 1][d] = deal_list[i-2][d];
                    }
                    Array.from(to.getElementsByClassName(d)).forEach(toc => {
                        let fromc = from.getElementsByClassName(d)[nnn];
                        if (fromc) {
                            if (!all_data[d]["fix?"]) {
                                toc.style = fromc.style.cssText;
                                toc.parentNode.style = fromc.parentNode.style.cssText;
                                toc.value = fromc.value;
                            } else {
                                toc.value = deal_list[i-1][d]
                            }
                        }
                        nnn++
                    })
                });
            };
            deal_sets[target_num-1] = itihods
            target.children[1].innerHTML = templates[deal_sets[target_num-1]["use_temp"]]["conf_htm"]
            Object.keys(all_data).forEach(d => {
                let nnn = 0
                if (!all_data[d]["fix?"]) {
                    deal_list[target_num - 1][d] = itihoarr[d];
                }
                Array.from(target.getElementsByClassName(d)).forEach(toc => {
                    let fromc = itiho.getElementsByClassName(d)[nnn];
                    if (fromc) {
                        if (!all_data[d]["fix?"]) {
                            toc.style = fromc.style.cssText;
                            toc.parentNode.style = fromc.parentNode.style.cssText;
                            toc.value = fromc.value;
                        } else {
                            toc.value = deal_list[target_num - 1][d]
                        }
                    }
                })
            });
        }
    };
    lockreload()
};
function dragend(e) {
    document.querySelector("body").classList.remove("nonono");
}
function anchorcheck() {
    let c = document.getElementById("anchor?").checked
    document.getElementById("anchor").disabled = !c;
    all_data[Object.keys(all_data)[(document.getElementById("datapul").selectedIndex) - 1]]["anchor?"] = c;
}
document.getElementById("anchor").addEventListener("change", (e) => {
    all_data[Object.keys(all_data)[(document.getElementById("datapul").selectedIndex) - 1]]["anchor"] = e.target.value;
});
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
        let sent = templates[deal_sets[c-1]["use_temp"]]["conf_col"].replace(/<[^<>]*>/g,"");
        templates[deal_sets[c-1]["use_temp"]]["conf_data"].forEach(d => {
            let dd = d.startsWith("liner_")?`$${d.replace("liner_","")
            .replace(/\\/g,"\\\\")
            .replace(/\$/g,"\\$")
            .replace(/\|/g,"\\|")
            }$`:`|${d.replace("blocker_","")
            .replace(/\\/g,"\\\\")
            .replace(/\$/g,"\\$")
            .replace(/\|/g,"\\|")}|`
            sent = sent.split(dd).join(escapeHtml(i[d]));
        })
        alll.push(sent)
    })
    document.getElementById("previewplain").value = unescapeHtml(alll.join(document.getElementById("plainset").value))
    document.getElementById("plainsize").innerText = document.getElementById("previewplain").value.length
}
function previewanchor(s, ok) {
    console.log(ok)
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
                    if (l === "") { return };
                    if (sent.startsWith(l)) {
                        if (nnn != "") {
                            if (l === nnn) {
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
                    out += `<a href="#preview_${nnns[0]}" class="anchorspan" data-to="${nnns.join(",")}">${ith}${nnn}</a>`
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
            let anchorok = {}
            let dm = deal_list.map(xx => Object.values(xx).join("")).join("")
            Object.keys(all_data).forEach(a => {
                if (!all_data[a]["anchor?"]) { return };
                if (all_data[a]["anchor"] === "") { return };
                let dms = dm.split(all_data[a]["anchor"])
                if (dms.length - 1 > 10000 || dms.length - 1 < 1) { return };
                if (Object.values(anchorok).includes(all_data[a]["anchor"])) { return };
                anchorok[a] = escapeHtml(all_data[a]["anchor"]);
            })
            let alll = "";
            let s = 0;
            deal_list.forEach(i => {
                s++;
                let sent = templates[deal_sets[s-1]["use_temp"]]["conf_col"].replace(/<[^<>]*>/g, "");
                templates[deal_sets[s-1]["use_temp"]]["conf_data"].forEach(d => {
                    let dd = d.startsWith("liner_") ? `$${d.replace("liner_", "")
                        .replace(/\\/g, "\\\\")
                        .replace(/\$/g, "\\$")
                        .replace(/\|/g, "\\|")
                        }$` : `|${d.replace("blocker_", "")
                            .replace(/\\/g, "\\\\")
                            .replace(/\$/g, "\\$")
                            .replace(/\|/g, "\\|")}|`
                    sent = sent.split(dd).join(escapeHtml(i[d]));
                })
                sent = previewanchor(sent, anchorok).replace(/(https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+)/,"<a href='$1'>$1</a>")
                alll += `<div class="neko" id="preview_${s}">${sent.replace(/\n/g, "<br>")}</div>`
            })
            document.getElementById("preview").innerHTML = alll;
            break;
        case ("radio_plaintext"):
            plainreload();
            break;
    }
}
document.getElementById("plainset").addEventListener("input", function (e) {
    plainreload();
})
document.getElementById("previewplain").addEventListener("input",function (e){
    document.getElementById("plainsize").innerText = document.getElementById("previewplain").value.length
})
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
                    strs[n - 1] += " " + escapeHtml(m[t]).replace(/\n/g, " <br> ") + " "
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
        n++;
        templates[now_temp]["conf_data"].forEach(c => {
            style_list[n-1][c] = []
            Array.from(document.getElementById(`message_${n}`).getElementsByClassName(c)).forEach(cd=>{
                if (cd.classList.contains("|")) {
                    style_list[n - 1][c].push(cd.style.cssText);
                } else {
                    style_list[n - 1][c].push(cd.parentNode.style.cssText);
                }
            })
        })
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
        n++;
        templates[deal_sets[n-1]["use_temp"]]["conf_data"].forEach(c => {
            style_list[n-1][c] = []
            Array.from(document.getElementById(`message_${n}`).getElementsByClassName(c)).forEach(cd=>{
                if (cd.classList.contains("|")) {
                    style_list.push(cd.style.cssText)
                } else {
                    style_list.push(cd.parentNode.style.cssText)
                }
            })
        })
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
function load() {
    if (document.getElementById("load_inp").files.length === 0) return false;
    let f = document.getElementById("load_inp").files[0];
    if (!window.confirm(`このファイルをロードします：${f.name}\n編集中のデータは消滅しますが、本当によろしいですか？`)) { return false; }
    let n = ""
    f.text().then(t => {
        n = JSON.parse(t);
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
                '<div class="messagediv" draggable="true" ondragstart="dragstart(event);" ondragover="dragover(event);" ondragleave="dragleave(event);" ondrop="drop(event);" ondragend="dragend(event);">'
                + '<div class="messagehead"><div class="meslock"><label class="meslocklabel"><input type="checkbox" class="meslockcheck" onchange="lockmes(event);"></label></div><div class="tempselectdiv">'
                + '<select class="tempselect" onmouseover="tempselectover(event)" onmouseout="tempselectout(event)" onchange="tempselected(event)">'
                + '<option value="'
                + String(deal_sets[x - 1]["use_temp"] + 1)
                + '" selected">'
                + String(deal_sets[x - 1]["use_temp"] + 1)
                + '</option></select></div><button class="closebtn" title="レスの削除">×</button></div><div class="message" id="message_'
                + x + '">'
                + templates[deal_sets[x - 1]["use_temp"]]["conf_htm"] + "</div></div>")
            let now = document.getElementById(`message_${x}`)
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
        document.getElementById("subssel").innerHTML = "<option hidden selected>変数を選択</option>"
        document.getElementById("datalists").innerHTML = ""
        document.getElementById("replace_list").innerHTML = ""
        Object.keys(all_data).forEach(c => {
            document.getElementById("datapul").insertAdjacentHTML("beforeend", `<option name="${escapeHtml(c)}">${(escapeHtml(c) + "a").replace(/^[^_]*_|.$/g, c.startsWith("blocker_") ? "|" : "$")}</option>`)
            document.getElementById("subssel").insertAdjacentHTML("beforeend", `<option name="${escapeHtml(c)}">${(escapeHtml(c) + "a").replace(/^[^_]*_|.$/g, c.startsWith("blocker_") ? "|" : "$")}</option>`)
            document.getElementById("replace_list").insertAdjacentHTML("beforeend", `<li><input type="checkbox" id="replacecheck_${escapeHtml(c)}"></input><label for="replacecheck_${escapeHtml(c)}">${(escapeHtml(c) + "a").replace(/^[^_]*_|.$/g, c.startsWith("blocker_") ? "|" : "$")}</label></li>`)

            if (c.startsWith("liner_")) {
                document.getElementById("datalists").insertAdjacentHTML("beforeend", `<datalist id="${all_data[c]["datalist?"] ? "" : "n_"}list_${escapeHtml(c)}"></datalist>`)
            };
        })
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
                document.getElementById(`message_${i}`).getElementsByClassName(selecting)[0].value = txts[i - num];
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
document.addEventListener("mouseover", function (e){
    if (e.target.classList.contains("anchorspan")){
        if (!document.getElementById("abss").querySelector(".abssc:hover,.abssc[data-flag='true'],.abssc:hover~.abssc")){
            document.getElementById("abss").innerHTML = ""
        }
        let d = []
        e.target.dataset.to.split(",").forEach(s=>{
            let n = document.getElementById(`preview_${s}`)
            d.push(n.outerHTML.replace(/ id="preview_/, ' id="n_preview_').replace(/ class\=\"[^\"]*\"/, " class='abssneko'"))
        })
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
})
document.addEventListener("mouseout",function (e){
    if (e.target.matches(".anchorspan") && document.getElementById("abss").querySelector(".abssc:hover,.abssc[data-flag='true'],.abssc:hover~.abssc")){
        document.getElementById("abss").firstChild.dataset.flag = "false"
    }
})
function replace_allselect(){
    for (i of document.getElementById("replace_list").children){
        i.firstChild.checked = "true"
    }
}
function replace_reflect(){
    for (i of document.getElementById("replace_list").children) {
        i.firstChild.checked = !i.firstChild.checked
    }
}
function replacing(){
    let r_list = []
    for (i of document.querySelectorAll("#replace_list input:checked")){
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
    for (i of deal_list){
        n++;
        let to = document.getElementById(`message_${n}`)
        for (r of r_list){
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
function tempselectover(e){
    let t = e.target
    let el = t.parentNode.parentNode.nextElementSibling
    let s = Number(el.id.replace(/[^_]*_/, ""))-1
    t.innerHTML = ""
    for (let i = 0; i < templates.length; i++) {
        t.insertAdjacentHTML("beforeend",`<option value="${i+1}"${deal_sets[s]["use_temp"] == i ? " selected" : ""}>${i+1}</option>`)
        
    }
}
function tempselectout(e){
    let t = e.target
    let el = t.parentNode.parentNode.nextElementSibling
    let s = Number(el.id.replace(/[^_]*_/, "")) - 1
    t.innerHTML = ""
    t.insertAdjacentHTML("beforeend", `<option value="${deal_sets[s]["use_temp"] + 1}" selected>${deal_sets[s]["use_temp"] + 1}</option>`)

}
function tempselected(e){
    let t = e.target
    let el = t.parentNode.parentNode.nextElementSibling
    let s = Number(el.id.replace(/[^_]*_/, ""))-1
    let n = t.selectedIndex + 1
    deal_sets[s]["use_temp"] = t.selectedIndex
    el.innerHTML = templates[t.selectedIndex]["conf_htm"]
    templates[t.selectedIndex]["conf_data"].forEach(d=>{
        Array.from(el.getElementsByClassName(d)).forEach(b=>{
            b.value = deal_list[s][d]
        })
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
    if (e.target.checked){
        e.target.parentNode.parentNode.parentNode.parentNode.classList.add("locked_mess")
        deal_sets[Number(e.target.parentNode.parentNode.parentNode.nextElementSibling.id.replace("message_",""))-1]["locked"] = true
    }else{
        e.target.parentNode.parentNode.parentNode.parentNode.classList.remove("locked_mess")
        deal_sets[Number(e.target.parentNode.parentNode.parentNode.nextElementSibling.id.replace("message_",""))-1]["locked"] = false
    }
}

function lockreload(){
    let c = 0
    deal_sets.forEach(s => {
        c++
        let m = document.getElementById(`message_${c}`).parentNode
        m.getElementsByClassName("meslockcheck")[0].checked = s["locked"]
        m.classList.remove("locked_mess")
        if (s["locked"]) {
            m.classList.add("locked_mess")
        }
    })
}
function themechange(){
    let t = document.getElementById("themeselect")
    let n = t.options[t.selectedIndex].value
    let s = `@import url(themes/${n}.css);`
    let ss = ""
    if (document.getElementById("highlightcheck").checked){
        ss = `@import url(themes/fontcolors/${n}.css);`
    }
    document.getElementsByTagName("style")[0].innerText = s
    document.getElementsByTagName("style")[1].innerText = ss
}
function highlightchange(){
    let t = document.getElementById("themeselect")
    let n = t.options[t.selectedIndex].value
    let ss = ""
    if (document.getElementById("highlightcheck").checked) {
        ss = `@import url(themes/fontcolors/${n}.css);`
    }
    document.getElementsByTagName("style")[1].innerText = ss
}
document.addEventListener("mousedown", e => {
    if (e.target.classList.contains("resizer")) {
        e.target.classList.add("draggingresizer")
        document.body.classList.add("nonono_resize")
    }
})
document.addEventListener("mousemove",e=>{
    if (document.getElementsByClassName("draggingresizer").length > 0){
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
            btarget.style.width = bw + "px"
            atarget.style.width = old_ar - e.clientX + "px"
        } else if (t.classList.contains("vresizer")){
            let bc = btarget.getBoundingClientRect()
            let ac = atarget.getBoundingClientRect()
            let old_ab = ac.bottom+0
            let bh = e.clientY - bc.top
            btarget.style.height = bh + "px"
            atarget.style.height = old_ab - e.clientY + "px"
        }
        for (i of btarget.getElementsByClassName("functionselect")) {
            fitselector(i)
        }
        for (i of atarget.getElementsByClassName("functionselect")) {
            fitselector(i)
        }
    }
})
document.addEventListener("mouseup",e=>{
    if (document.getElementsByClassName("draggingresizer").length > 0){
        document.getElementsByClassName("draggingresizer")[0].classList.remove("draggingresizer")
        document.body.classList.remove("nonono_resize")
    }
})
function fitselector(t){
    let pr = t.parentNode.getBoundingClientRect()
    t.style.fontSize = (pr.width-30) / strWidth(t.options[t.selectedIndex].innerText) * 10 + "px"
    t.parentNode.parentNode.style.setProperty("--title_font_size", (pr.width - 30) / strWidth(t.options[t.selectedIndex].innerText) * 10 + "px")
}
function sortboxes(){
    let t = document.getElementById("sortboxesselect")
    boxes_sort = t.options[t.selectedIndex].value.split(',').map(Number)
    c = 0
    boxes_sort.forEach(i=>{
        document.getElementById("box").children[i*2].style.order = c
        c+=2
    })
}