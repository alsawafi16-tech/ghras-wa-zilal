
const S=[
["about","التعريف بالمشروع","🌱","الفكرة والأهداف والفوائد والتحديات"],
["outer","تشجير الجانب الخارجي","🌳","توثيق أعمال التشجير الخارجية"],
["inner","تشجير الجانب الداخلي","🌿","متابعة الأشجار والمساحات الداخلية"],
["yard","تشجير ساحة المدرسة","🏫","تطوير المساحات الخضراء في الساحة"],
["palms","مشروع 200 نخلة","🌴","متابعة مشروع النخيل"],
["trials","التجارب الزراعية","🧪","تسجيل التجارب والنتائج"],
["qitaf","شركة قطاف","🤝","التعاون والأعمال المشتركة"],
["visits","الزيارات","📍","توثيق الزيارات والملاحظات"],
["expenses","المصروفات","🧾","تسجيل المصروفات"],
["supporters","الجهات الداعمة","💚","توثيق الجهات الداعمة"]
];
const K="ghars_v6_data",PK="ghars_v6_pass"; let admin=false,route="home";
const load=()=>{try{return JSON.parse(localStorage.getItem(K)||"{}")}catch{return {}}}; const save=d=>localStorage.setItem(K,JSON.stringify(d));
const esc=s=>(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16)};
function toast(s){let t=document.querySelector("#toast");t.textContent=s;t.style.display="block";setTimeout(()=>t.style.display="none",1800)}
function shell(x){return `<main class="app"><header class="top"><div class="brand"><div class="logo">🌱</div><div>غرس وظلال<div class="muted">نغرس أثرًا… ينمو</div></div></div><button class="btn alt" onclick="auth()">${admin?"لوحة المشرف":"دخول المشرف"}</button></header>${x}</main>`}
function home(){route="home";let cards=S.map(x=>`<div class="card" onclick="section('${x[0]}')"><div class="ico">${x[2]}</div><h3>${x[1]}</h3><small>${x[3]}</small></div>`).join("");
document.querySelector("#app").innerHTML=shell(`<section class="hero"><h1>نغرس اليوم.<br>ويكبر الظل غداً.</h1><p>مشروع مدرسي يوثق مراحل التشجير والزراعة والزيارات والمصروفات في مكان واحد.</p></section><div class="title">أقسام المشروع</div><div class="grid">${cards}</div>${admin?adminPanel():""}`)}
function section(id){route=id;let m=S.find(x=>x[0]===id),d=load(),a=d[id]||[];let rec=a.map((r,i)=>`<article class="record"><h3>${esc(r.title)}</h3><div>${esc(r.note)}</div>${r.amount?`<p><b>المبلغ:</b> ${esc(r.amount)} ر.ع</p>`:""}${r.qty?`<p><b>العدد:</b> ${esc(r.qty)}</p>`:""}${r.media?.length?`<div class="muted">📎 ${r.media.length} ملف/صورة مرفقة</div>`:""}<div class="muted">${esc(r.date)}</div>${admin?`<p><button class="btn danger" onclick="del('${id}',${i})">حذف</button></p>`:""}</article>`).join("");
document.querySelector("#app").innerHTML=shell(`<button class="back" onclick="home()">← الرئيسية</button><div class="title">${m[2]} ${m[1]}</div><p class="muted">${m[3]}</p>${admin?form(id):""}<div>${rec||'<div class="panel empty">لا توجد سجلات بعد</div>'}</div>`)}
function form(id){return `<form class="panel" onsubmit="add(event,'${id}')"><b>إضافة سجل جديد</b><input class="field" name="title" required placeholder="عنوان السجل"><textarea class="field" name="note" placeholder="الملاحظات والتفاصيل"></textarea>${id==="expenses"?'<input class="field" name="amount" type="number" step="0.001" placeholder="المبلغ بالريال العماني">':""}${id==="palms"?'<input class="field" name="qty" type="number" placeholder="عدد النخيل">':""}<label class="muted">صور أو فيديوهات</label><input class="field" name="media" type="file" accept="image/*,video/*" multiple><button class="btn">حفظ السجل</button></form>`}
function add(e,id){e.preventDefault();let f=e.target,d=load(),files=[...f.media.files];d[id]=d[id]||[];d[id].unshift({title:f.title.value,note:f.note.value,amount:f.amount?.value||"",qty:f.qty?.value||"",date:new Date().toLocaleString("ar-OM"),media:files.map(x=>({name:x.name,type:x.type}))});save(d);toast("تم الحفظ");section(id)}
function del(id,i){if(!confirm("حذف هذا السجل؟"))return;let d=load();d[id].splice(i,1);save(d);section(id)}
function auth(){if(admin){home();return}let p=localStorage.getItem(PK);if(!p){let a=prompt("أنشئ كلمة مرور للمشرف (8 أحرف على الأقل)");if(!a||a.length<8)return alert("كلمة المرور قصيرة");localStorage.setItem(PK,hash(a));admin=true;toast("تم إنشاء حساب المشرف");home()}else{let a=prompt("أدخل كلمة مرور المشرف");if(hash(a||"")===p){admin=true;toast("تم تسجيل الدخول");home()}else alert("كلمة المرور غير صحيحة")}}
function adminPanel(){let d=load(),n=Object.values(d).reduce((s,a)=>s+(Array.isArray(a)?a.length:0),0);return `<div class="title">لوحة المشرف</div><div class="panel"><div class="row"><div class="stat"><span>السجلات</span><b>${n}</b></div><div class="stat"><span>الأقسام</span><b>10</b></div></div><p class="muted">البيانات محفوظة على هذا الجهاز. استخدم النسخ الاحتياطي قبل حذف التطبيق أو تغيير الهاتف.</p><div class="row"><button class="btn" onclick="backup()">نسخة احتياطية</button><label class="btn alt">استعادة<input type="file" accept="application/json" hidden onchange="restore(this)"></label><button class="btn alt" onclick="admin=false;home()">تسجيل خروج</button></div></div>`}
function backup(){let b=new Blob([JSON.stringify({version:6,data:load()},null,2)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="ghars-backup.json";a.click();URL.revokeObjectURL(u)}
function restore(i){let f=i.files[0];if(!f)return;let r=new FileReader;r.onload=()=>{try{let x=JSON.parse(r.result);save(x.data||x);toast("تمت الاستعادة");home()}catch{alert("ملف غير صالح")}};r.readAsText(f)}
home();
