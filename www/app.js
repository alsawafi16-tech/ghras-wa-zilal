const S=[
["about","التعريف بالمشروع","🌱","الفكرة والأهداف والفوائد والتحديات"],
["outer","تشجير الجانب الخارجي","🌳","توثيق مواقع التشجير الخارجية ومراحل التنفيذ"],
["inner","تشجير الجانب الداخلي","🌿","متابعة تشجير المساحات الداخلية"],
["yard","تشجير ساحة المدرسة","🏫","توثيق أعمال تشجير ساحة المدرسة"],
["palms","مشروع 200 نخلة","🌴","متابعة مراحل مشروع زراعة 200 نخلة"],
["trials","التجارب الزراعية","🧪","تسجيل التجارب الزراعية والنتائج"],
["qitaf","شركة قطاف","🤝","توثيق التعاون والأعمال المشتركة"],
["visits","الزيارات","📍","توثيق الزيارات والملاحظات"],
["expenses","المصروفات","🧾","تسجيل المصروفات ومتابعتها"],
["supporters","الجهات الداعمة","💚","توثيق الجهات الداعمة للمشروع"]
];

const K="ghars_final_v8_data",PK="ghars_final_v8_pass";
const seed=()=>Object.fromEntries(S.map(([id])=>[id,[]]));
let data=load(),admin=false;

function load(){
 try{
  const x=JSON.parse(localStorage.getItem(K));
  return x&&typeof x==="object"?x:seed();
 }catch(e){return seed()}
}
function save(){localStorage.setItem(K,JSON.stringify(data))}
function esc(s){
 return String(s??"").replace(/[&<>"']/g,m=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
 }[m]))
}
function A(){return document.getElementById("app")}

function shell(body){
 return `<main class="app" dir="rtl">
 <header class="topbar">
  <div class="brandmark">🌱</div>
  <div class="brandtext">
   <b>غرس وظلال</b>
   <small>معًا لبيئة أجمل ومستقبل أكثر خضرة</small>
  </div>
  <button class="iconbtn" onclick="home()">⌂</button>
 </header>${body}</main>`;
}

function home(){
 const cards=S.map(([id,t,ic,d])=>`
 <button class="project-card" onclick="section('${id}')">
  <span class="project-icon">${ic}</span>
  <span class="project-copy"><b>${t}</b><small>${d}</small></span>
  <span>‹</span>
 </button>`).join("");

 A().innerHTML=shell(`
 <section class="welcome">
  <div class="leaf">🌿</div>
  <div><h1>غرس وظلال</h
