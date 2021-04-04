window.onload = function () {
    deal_list = [];
    all_data = {};
    dragging = null;
    style_list = [];
    conf_data = [];
    template = "";
    conf_htm = "";
    conf_col = "";
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

function datalistschange(name) {
    let x = {};
    let n
    if (!all_data[name]["datalist?"]) {
        n = document.getElementById(`n_list_${name}`);
    } else {
        n = document.getElementById(`list_${name}`);
    }
    n.innerHTML = ""
    deal_list.forEach(c => {
        if (Object.keys(x).includes(c[name])) {
            x[c[name]]["num"] += 1;
        } else {
            x[c[name]] = { "name": c[name], "num": 1 }
        }
    })
    x = Object.values(x).sort(function (a, b) {
        return b["num"] - a["num"];
    })
    for (let i = 0; i < (x.length < 5 ? x.length : 5); i++) {
        n.insertAdjacentHTML("beforeend", `<option value="${x[i]["name"]}"></option>`)
    }

}


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
    htm = htm.replace(/\n/g, "<br>");
    if (mode == "normal") {
        let backupconfdata = conf_data;
        document.getElementById("edited").innerHTML = col.replace(/\n/g, "<br>");
        document.getElementById("form_inp").innerHTML = htm;
        conf_htm = htm;
        conf_col = col;
        conf_data = Array.from(new Set(data))
        conf_data.forEach(i => {
            if (!Object.keys(all_data).includes(i)) {
                all_data[i] = ({ "adder": 0, "anchor?": false, "anchor": "", "fix?": false, "datalist?": false });
                document.getElementById("datapul").insertAdjacentHTML("beforeend", `<option name="${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</option>`)
                document.getElementById("subssel").insertAdjacentHTML("beforeend", `<option name="${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</option>`)
                document.getElementById("replace_list").insertAdjacentHTML("beforeend", `<li><input type="checkbox" id="replacecheck_${escapeHtml(i)}"></input><label for="replacecheck_${escapeHtml(i)}">${(escapeHtml(i) + "a").replace(/^[^_]*_|.$/g, i.startsWith("blocker_") ? "|" : "$")}</label></li>`)
                if (i.startsWith("liner_")) {
                    document.getElementById("datalists").insertAdjacentHTML("beforeend", `<datalist id="n_list_${escapeHtml(i)}"></datalist>`)
                };
            };
        })
        while (style_list.length < deal_list.length) {
            style_list.push({})
        }
        let n = 0
        deal_list.forEach(ii => {
            n++;
            let box = document.getElementById(`message_${n}`);
            conf_data.forEach(x => {
                if (backupconfdata.includes(x)) {
                    style_list[n-1][x] = []
                    Array.from(box.getElementsByClassName(x)).forEach(cd=>{
                        if (cd.classList.contains("|")) {
                            style_list[n - 1][x].push(cd.style.cssText);
                        } else {
                            style_list[n - 1][x].push(cd.parentNode.style.cssText)
                        }
                    })
                } else if (!Object.keys(style_list[n - 1]).includes(x)) {
                    style_list[n - 1][x] = []
                }
            })
            box.innerHTML = conf_htm;
            conf_data.forEach(xx => {
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
                })
                cc++
            });
        });
        template = temp + "";
    } else {
        alert("Error:不正な構文");
    };
};

function addmess() {
    for (let i = 0; i < document.getElementById("messv").value; i++) {
        document.getElementById("messages").insertAdjacentHTML("beforeend",
            '<div class="messagediv"  draggable="true" ondragstart="dragstart(event);" ondragover="dragover(event);" ondragleave="dragleave(event);" ondrop="drop(event);" ondragend="dragend(event);"><div class="closebtndiv"><button class="closebtn" title="レスの削除">×</button></div><div class="message" id="cd">'
            + conf_htm + "</div></div>");
        let formi_c = document.getElementById("form_inp")
        let now = document.getElementById("cd")
        let num = deal_list.length
        now.id = "message_" + (num + 1)
        deal_list.push({})
        conf_data.forEach(i=>{
            let m = 0
            Array.from(now.getElementsByClassName(i)).forEach(o=>{
                
                if (i.startsWith("blocker_")) {
                    Array.from(formi_c.getElementsByClassName(i)).forEach(nnnnn => {
                        o.style = formi_c.getElementsByClassName(i)[m].style.cssText;
                        deal_list[num][i] = o.value = nnnnn.value
                    })
                } else {
                    Array.from(formi_c.getElementsByClassName(i)).forEach(nnnnn => {
                        o.parentNode.style = formi_c.getElementsByClassName(i)[m].parentNode.style.cssText;
                        deal_list[num][i] = o.value = nnnnn.value
                    });
                    datalistschange(i)
                };
                m++
            })
        })
        conf_data.forEach(k => {
            let added = String(document.getElementById("form_inp").getElementsByClassName(k)[0].value)
            if (/^\-?[0-9]+(\.[0-9]+)?$/.test(added) && all_data[k]["adder"] != 0) {
                added = Number(added) + Number(all_data[k]["adder"])
                console.log(added)
            }
            Array.from(document.getElementById("form_inp").getElementsByClassName(k)).forEach(i=>{
                i.value = String(added)
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
            num = target.parentNode.id.replace(/^[^_]*_/, "") - 1;
            inp = target.value;
            deal_list[num][clas] = inp;
        } else {
            num = target.parentNode.parentNode.id.replace(/^[^_]*_/, "") - 1;
            inp = target.value;
            deal_list[num][clas] = inp;
            datalistschange(target.classList[1])
        };
    };
    if (target.matches(".message textarea,.message input,#form_inp textarea,#form_inp input")){
        taras(target)
    }
});
function taras(target){
    let tp = target.matches("textarea") ? target.parentNode : target.parentNode.parentNode
    Array.from(tp.getElementsByClassName(target.classList[1])).filter(n => n !== target).forEach(k => {
        k.value = target.value
    })
}
document.addEventListener("click", (e) => {
    let target = e.target;
    if (target.className === "closebtn") {
        let num = Number(target.parentNode.nextElementSibling.id.replace("message_", ""));
        for (let i = num; i < deal_list.length; i++) {
            let to = document.getElementById(`message_${i}`);
            let from = document.getElementById(`message_${i + 1}`);
            conf_data.forEach(d => {
                let nnn = 0
                Array.from(to.getElementsByClassName(d)).forEach(toc=>{
                    let fromc = from.getElementsByClassName(d)[nnn];
                    if (!all_data[d]["fix?"]) {
                        toc.style = fromc.style.cssText;
                        toc.parentNode.style = fromc.parentNode.style.cssText;
                        toc.value = fromc.value;
                        deal_list[i - 1][d] = deal_list[i][d];
                    };
                    nnn++
                })
            });
        };
        deal_list.pop();
        document.getElementById("messages").lastChild.outerHTML = "";
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
            console.log("a")
            let dragmes = dragging.children[1];
            let itiho = dragmes.cloneNode(true);
            let itihoarr = {};
            conf_data.forEach(d => {
                let nnn = 0
                Array.from(itiho.getElementsByClassName(d)).forEach(toc => {
                    let fromc = dragmes.getElementsByClassName(d)[nnn];
                    if (!all_data[d]["fix?"]) {
                        toc.style = fromc.style.cssText;
                        toc.parentNode.style = fromc.parentNode.style.cssText;
                        toc.value = fromc.value;
                        itihoarr[d] = deal_list[dragging_num - 1][d]
                    };
                    nnn++
                })
            })
            for (let i = dragging_num; i < target_num; i++) {
                let to = document.getElementById(`message_${i}`);
                let from = document.getElementById(`message_${i + 1}`);
                conf_data.forEach(d => {
                    let nnn = 0
                    Array.from(to.getElementsByClassName(d)).forEach(toc => {
                        let fromc = from.getElementsByClassName(d)[nnn];
                        if (!all_data[d]["fix?"]) {
                            toc.style = fromc.style.cssText;
                            toc.parentNode.style = fromc.parentNode.style.cssText;
                            toc.value = fromc.value;
                            deal_list[i - 1][d] = deal_list[i][d];
                        };
                        nnn++
                    })
                });
            };
            console.log(conf_data)
            conf_data.forEach(d => {
                let nnn = 0
                Array.from(target.getElementsByClassName(d)).forEach(toc => {
                    let fromc = itiho.getElementsByClassName(d)[nnn];
                    if (!all_data[d]["fix?"]) {
                        if (!all_data[d]["fix?"]) {
                            toc.style = fromc.style.cssText;
                            toc.parentNode.style = fromc.parentNode.style.cssText;
                            toc.value = fromc.value;
                            deal_list[target_num - 1][d] = itihoarr[d]
                        };
                    };
                    nnn++
                })
            });
        } else {
            let dragmes = dragging.children[1];
            let itiho = dragmes.cloneNode(true);
            let itihoarr = {}
            conf_data.forEach(d => {
                let nnn = 0
                Array.from(dragmes.getElementsByClassName(d)).forEach(toc => {
                    let fromc = itiho.getElementsByClassName(d)[nnn];
                    if (!all_data[d]["fix?"]) {
                        toc.style = fromc.style.cssText;
                        toc.parentNode.style = fromc.parentNode.style.cssText;
                        toc.value = fromc.value;
                        itihoarr[d] = deal_list[dragging_num - 1][d]
                    };
                    nnn++
                })
            })
            for (let i = dragging_num; i > target_num; i--) {
                let to = document.getElementById(`message_${i}`);
                let from = document.getElementById(`message_${i - 1}`);
                conf_data.forEach(d => {
                    let nnn = 0
                    Array.from(to.getElementsByClassName(d)).forEach(toc => {
                        let fromc = from.getElementsByClassName(d)[nnn];
                        if (!all_data[d]["fix?"]) {
                            toc.style = fromc.style.cssText;
                            toc.parentNode.style = fromc.parentNode.style.cssText;
                            toc.value = fromc.value;
                            deal_list[i - 1][d] = deal_list[i - 2][d];
                        };
                        nnn++
                    })
                    
                });
            };
            conf_data.forEach(d => {
                let nnn = 0
                Array.from(target.getElementsByClassName(d)).forEach(toc => {
                    let fromc = itiho.getElementsByClassName(d)[nnn];
                    if (!all_data[d]["fix?"]) {
                        if (!all_data[d]["fix?"]) {
                            toc.style = fromc.style.cssText;
                            toc.parentNode.style = fromc.parentNode.style.cssText;
                            toc.value = fromc.value;
                            deal_list[target_num - 1][d] = itihoarr[d];
                        };
                    };
                    nnn++
                })
                
            });
        }
    };
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
    let doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent;
}
function plainreload() {
    let alll = []
    deal_list.forEach(i => {
        let sent = conf_col.replace(/<[^<>]*>/g,"");
        conf_data.forEach(d => {
            let dd = d.startsWith("liner_")?`$${d.replace("liner_","")
            .replace(/\\/g,"\\\\")
            .replace(/\$/g,"\\$")
            .replace(/\|/g,"\\|")
            }$`:`|${d.replace("blocker_","")
            .replace(/\\/g,"\\\\")
            .replace(/\$/g,"\\$")
            .replace(/\|/g,"\\|")}|`
            dd = escapeHtml(dd)
            console.log(dd)
            sent = sent.split(dd).join(i[d]);
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
    document.getElementById(e.target.id.replace(/^[^_]*_/, "")).classList.add("radised");
    switch (e.target.id) {
        case ("radio_preview"):
            let anchorok = {}
            conf_data.forEach(a => {
                if (!all_data[a]["anchor?"]) { return };
                if (all_data[a]["anchor"] === "") { return };
                if (deal_list.map(xx => Object.values(xx).join("")).join("").split(all_data[a]["anchor"]).length - 1 > 10000 || deal_list.map(xx => Object.values(xx).join("")).join("").split(all_data[a]["anchor"]).length - 1 < 1) { return };
                if (Object.values(anchorok).includes(all_data[a]["anchor"])) { return };
                anchorok[a] = all_data[a]["anchor"];
            })
            let alll = "";
            let s = 0;
            deal_list.forEach(i => {
                s++;
                let sent = conf_col.replace(/<[^<>]*>/g, "");
                conf_data.forEach(d => {
                    let dd = d.startsWith("liner_") ? `$${d.replace("liner_", "")
                        .replace(/\\/g, "\\\\")
                        .replace(/\$/g, "\\$")
                        .replace(/\|/g, "\\|")
                        }$` : `|${d.replace("blocker_", "")
                            .replace(/\\/g, "\\\\")
                            .replace(/\$/g, "\\$")
                            .replace(/\|/g, "\\|")}|`
                    dd = escapeHtml(dd)
                    sent = sent.split(dd).join(i[d]);
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
        conf_data.forEach(c => {
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
    let j = JSON.stringify({ "deal_list": deal_list, "all_data": all_data, "style_list": style_list, "conf_data": conf_data, "template": template, "conf_htm": conf_htm, "conf_col": conf_col })
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
        conf_data.forEach(c => {
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
    let j = JSON.stringify({ "deal_list": [], "all_data": all_data, "style_list": [], "conf_data": conf_data, "template": template, "conf_htm": conf_htm, "conf_col": conf_col })
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
        style_list = n["style_list"];
        template = n["template"];
        conf_htm = n["conf_htm"];
        conf_data = n["conf_data"];
        document.getElementById("messages").innerHTML = "";
        let x = 0;
        deal_list.forEach(d => {
            x++;
            document.getElementById("messages").insertAdjacentHTML("beforeend",
                `<div class="messagediv"  draggable="true" ondragstart="dragstart(event);" ondragover="dragover(event);" ondragleave="dragleave(event);" ondrop="drop(event);" ondragend="dragend(event);"><div class="closebtndiv"><button class="closebtn" title="レスの削除">×</button></div><div class="message" id="message_${x}">`
                + conf_htm + "</div></div>")
            let now = document.getElementById(`message_${x}`)
            conf_data.forEach(c=>{
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
        document.getElementById("template").value = template
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
        deal_list[i - 1][selecting] = txts[i - num]
        if (conf_data.includes(selecting)) {
            document.getElementById(`message_${i}`).getElementsByClassName(selecting)[0].value = txts[i - num];
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
/*https://qiita.com/Sinraptor@github/items/1b3802db80eadf864633のパクリ*/
function strWidth(str) {
    let canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        let context = canvas.getContext('2d');
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
        pos_x = pos_x + a.clientWidth > window.innerWidth ? pos.left - a.clientWidth : pos_x
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
            to.getElementsByClassName(r)[0].value = i[r]
            taras(to.getElementsByClassName(r)[0])
            if (!g){
                break
            }
        }
        if (!g) {
            break
        }
    }
    for (r of rr_list){
        console.log(r)
        datalistschange(r)
    }
}