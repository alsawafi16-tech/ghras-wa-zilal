const S = [
  ["about","التعريف بالمشروع","🌱","الفكرة والأهداف والفوائد والتحديات"],
  ["outer","تشجير الجانب الخارجي","🌳","توثيق أعمال التشجير الخارجية"],
  ["inner","تشجير الجانب الداخلي","🌿","متابعة الأشجار والمساحات الداخلية"],
  ["yard","تشجير ساحة المدرسة","🏫","توثيق وتطوير المساحات الخضراء"],
  ["palms","مشروع 200 نخلة","🌴","متابعة مشروع زراعة 200 نخلة"],
  ["trials","التجارب الزراعية","🧪","تسجيل التجارب الزراعية والنتائج"],
  ["qitaf","شركة قطاف","🤝","توثيق التعاون والأعمال المشتركة"],
  ["visits","الزيارات","📍","توثيق الزيارات والملاحظات"],
  ["expenses","المصروفات","🧾","تسجيل المصروفات ومتابعتها"],
  ["sustainability","الاستدامة نمط حياة","🌍","الطاقة المتجددة وإدارة المياه وإدارة النفايات والزراعة والتشجير"],
  ["supporters","الجهات الداعمة","💚","توثيق الجهات الداعمة للمشروع"]
];

const K = "ghars_final_data_v10";
const PK = "ghars_admin_v10";
const IK = "ghars_icons_v10";

function loadIcons(){
  try{
    return JSON.parse(localStorage.getItem(IK)) || {};
  }catch(e){
    return {};
  }
}

let customIcons = loadIcons();

function saveIcons(){
  localStorage.setItem(IK, JSON.stringify(customIcons));
}
function seed(){
  return Object.fromEntries(S.map(x => [x[0], []]));
}

function load(){
  try{
    return JSON.parse(localStorage.getItem(K)) || seed();
  }catch(e){
    return seed();
  }
}

let data = load();
let admin = false;

function save(){
  localStorage.setItem(K, JSON.stringify(data));
}

function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}

function A(){
  return document.getElementById("app");
}

function shell(body, back=false){
  return `
    <main class="app" dir="rtl">
      <header class="topbar">
        <div class="brandmark">🌱</div>
        <div class="brandtext">
          <b>غرس وظلال</b>
          <small>معًا لبيئة أجمل ومستقبل أكثر خضرة</small>
        </div>
        ${back
          ? `<button class="iconbtn" onclick="home()">⌂</button>`
          : `<button class="adminbtn" onclick="login()">دخول المشرف</button>`
        }
      </header>
      ${body}
    </main>
  `;
}

function home(){
  const cards = S.map(([id,t,ic,d]) => `
    <button class="project-card" onclick="section('${id}')">
      <span class="project-icon">${customIcons[id] ? `<img src="${customIcons[id]}" alt="${t}" style="width:100%;height:100%;object-fit:cover;border-radius:12px">` : ic}</span>
      <span class="project-copy">
        <b>${t}</b>
        <small>${d}</small>
      </span>
      <span>‹</span>
    </button>
  `).join("");

  A().innerHTML = shell(`
    <section class="welcome">
      <div class="leaf">🌿</div>
      <div>
        <h1>غرس وظلال</h1>
        <p>نغرس اليوم... ليكبر الظل غدًا.</p>
      </div>
    </section>

    <section class="hero">
      <h2>نغرس اليوم.<br>ويكبر الظل غدًا.</h2>
      <p>مشروع مدرسي يوثق مراحل التشجير والزراعة والزيارات والمصروفات في مكان واحد.</p>
    </section>

    <h2 class="section-title">أقسام المشروع</h2>
    <section class="cards">${cards}</section>
  `);
}

function section(id){
if(id === "sustainability"){
  sustainabilityPage();
  return;
}  const item = S.find(x => x[0] === id);
  if(!item) return home();

  const [_, title, icon, desc] = item;
  const records = data[id] || [];

  const list = records.length
    ? records.map((r,i) => `
      <article class="record">
        <div>
          <b>${esc(r.title || "ملاحظة")}</b>
          <p>${esc(r.note || "")}</p>
          ${r.amount ? `<small>المبلغ: ${esc(r.amount)} ر.ع</small>` : ""}
          <small>${esc(r.date || "")}</small>
        </div>
        ${admin ? `<button onclick="del('${id}',${i})">حذف</button>` : ""}
      </article>
    `).join("")
    : `<div class="empty">لا توجد سجلات مضافة حتى الآن.</div>`;

  A().innerHTML = shell(`
    <section class="page-head">
      <div class="big-icon">${icon}</div>
      <h1>${title}</h1>
      <p>${desc}</p>
    </section>

    ${admin ? form(id) : `
      <div class="notice">
        يمكنك استعراض المحتوى هنا. الإضافة والتعديل متاحان من لوحة المشرف.
      </div>
    `}

    <section class="records">${list}</section>
  `, true);
}

function form(id){
  const expense = id === "expenses";

  return `
    <form class="entry-form" onsubmit="add(event,'${id}')">
      <h3>إضافة سجل جديد</h3>

      <input name="title" placeholder="${expense ? "اسم المصروف" : "عنوان السجل"}" required>

      ${expense
        ? `<input name="amount" type="number" step="0.001" placeholder="المبلغ بالريال العماني">`
        : ""
      }

      <textarea name="note" placeholder="اكتب الملاحظات والتفاصيل هنا..." required></textarea>

      <input name="date" type="date">

      <button class="primary" type="submit">حفظ السجل</button>
    </form>
  `;
}

function add(e,id){
  e.preventDefault();

  const f = new FormData(e.target);

  if(!data[id]) data[id] = [];

  data[id].unshift({
    title: f.get("title") || "",
    note: f.get("note") || "",
    amount: f.get("amount") || "",
    date: f.get("date") || new Date().toLocaleDateString("ar-OM")
  });

  save();
  section(id);
}

function del(id,i){
  if(!confirm("هل تريد حذف هذا السجل؟")) return;

  data[id].splice(i,1);
  save();
  section(id);
}

function login(){
  const pass = prompt("أدخل رمز دخول المشرف:");

  if(pass === null) return;

  let saved = localStorage.getItem(PK);

  if(!saved){
    localStorage.setItem(PK, pass);
    admin = true;
    alert("تم إنشاء رمز المشرف وحفظه على هذا الجهاز.");
    adminPanel();
    return;
  }

  if(pass === saved){
    admin = true;
    adminPanel();
  }else{
    alert("رمز الدخول غير صحيح.");
  }
}

function adminPanel(){
  if(!admin){
    login();
    return;
  }

  const total = Object.values(data)
    .reduce((n,a) => n + (Array.isArray(a) ? a.length : 0), 0);

  const buttons = S.map(([id,t,ic]) => `
    <button class="project-card" onclick="section('${id}')">
      <span class="project-icon">${customIcons[id] ? `<img src="${customIcons[id]}" class="custom-icon">` : ic}</span>
      <span class="project-copy">
        <b>${t}</b>
        <small>إدارة وإضافة السجلات</small>
      </span>
      <span>‹</span>
    </button>
  `).join("");

  A().innerHTML = shell(`
    <section class="page-head">
      <div class="big-icon">⚙️</div>
      <h1>لوحة المشرف</h1>
      <p>إدارة محتوى مشروع غرس وظلال</p>
    </section>

    <div class="notice">
      إجمالي السجلات المحفوظة: <b>${total}</b>
    </div>

    <section class="cards">${buttons}</section>

    <button class="primary" onclick="logout()">تسجيل الخروج</button>
  `, true);
}

function logout(){
  admin = false;
  home();
}
function sustainabilityPage(){
  const items = [
    ["renewable","☀️","الطاقة المتجددة","استخدام حلول الطاقة النظيفة والمتجددة"],
    ["water","💧","إدارة المياه","ترشيد استهلاك المياه وإدارة مواردها"],
    ["waste","♻️","إدارة النفايات","الفرز وإعادة الاستخدام والتدوير"],
    ["agriculture","🌱","الزراعة والتشجير","الزراعة وزيادة المساحات الخضراء"]
  ];

  const cards = items.map(([id,icon,title,desc]) => `
    <button class="project-card" onclick="sustainabilitySection('${id}')">
      <span class="project-icon">${icon}</span>
      <span class="project-copy">
        <b>${title}</b>
        <small>${desc}</small>
      </span>
      <span>‹</span>
    </button>
  `).join("");

  A().innerHTML = shell(`
    <section class="page-head">
      <div class="big-icon">🌍</div>
      <h1>الاستدامة نمط حياة</h1>
      <p>ممارسات مستدامة من أجل بيئة أفضل ومستقبل أكثر خضرة</p>
    </section>

    <section class="cards">${cards}</section>
  `, true);
}
function sustainabilitySection(id){
  const items = {
    renewable:["☀️","الطاقة المتجددة"],
    water:["💧","إدارة المياه"],
    waste:["♻️","إدارة النفايات"],
    agriculture:["🌱","الزراعة والتشجير"]
  };

  const item = items[id];
  if(!item) return sustainabilityPage();

  const [icon,title] = item;
ensureSustainabilityData();

const key = "sustainability_" + id;
const records = data[key] || [];

const content = records.length ? records.map((r,i) => {
  const media = (r.media || []).map(m => {
    if((m.type || "").startsWith("video/")){
      return `<video class="media" controls src="${m.src}"></video>`;
    }
    return `<img class="media" src="${m.src}" alt="">`;
  }).join("");

  return `
    <article class="record">
      <div>
        <b>${esc(r.title || "محتوى")}</b>
        <p>${esc(r.note || "")}</p>
        ${media}
        <small>${esc(r.date || "")}</small>
      </div>
      ${admin ? `<button onclick="delSustainability('${id}',${i})">حذف</button>` : ""}
    </article>
  `;
}).join("") : `<div class="empty">لا يوجد محتوى مضاف حتى الآن.</div>`;
  A().innerHTML = shell(`
    <section class="page-head">
      <div class="big-icon">${icon}</div>
      <h1>${title}</h1>
      <p>قسم من مبادرة الاستدامة نمط حياة</p>
    </section>

${admin ? `
  <form class="entry-form" onsubmit="addSustainability(event,'${id}')">
    <h3>إضافة محتوى جديد</h3>

    <input name="title" placeholder="عنوان المحتوى" required>

    <textarea name="note" placeholder="اكتب الملاحظات والتفاصيل هنا..."></textarea>

    <label>إضافة صور أو فيديوهات</label>
    <input name="media" type="file" accept="image/*,video/*" multiple>

    <button class="primary" type="submit">حفظ المحتوى</button>
  </form>
` : `
  <div class="notice">
    الصور والفيديوهات والمحتوى المضاف لهذا القسم ستظهر هنا.
  </div>
`}
<section class="records">${content}</section>
  `, true);
}
function ensureSustainabilityData(){
  ["renewable","water","waste","agriculture"].forEach(id => {
    const key = "sustainability_" + id;
    if(!Array.isArray(data[key])){
      data[key] = [];
    }
  });
  save();
}
async function addSustainability(e,id){
  e.preventDefault();

  ensureSustainabilityData();

  const f = new FormData(e.target);
  const files = Array.from(f.getAll("media")).filter(file => file && file.size);
  const media = [];

  for(const file of files){
    const src = await fileToDataURL(file);
    media.push({
      name: file.name,
      type: file.type,
      src: src
    });
  }

  const key = "sustainability_" + id;

  data[key].unshift({
    title: f.get("title") || "",
    note: f.get("note") || "",
    media: media,
    date: new Date().toLocaleDateString("ar-OM")
  });

  save();
  alert("تم حفظ المحتوى بنجاح");
  sustainabilitySection(id);
}

function fileToDataURL(file){
  return new Promise((resolve,reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function delSustainability(id,i){
  if(!confirm("هل تريد حذف هذا المحتوى؟")) return;

  const key = "sustainability_" + id;

  if(Array.isArray(data[key])){
    data[key].splice(i,1);
    save();
  }

  sustainabilitySection(id);
}
home();
