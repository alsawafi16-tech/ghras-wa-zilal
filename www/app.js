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
  ["supporters","الجهات الداعمة","💚","توثيق الجهات الداعمة للمشروع"]
];

const K = "ghars_final_data_v10";
const PK = "ghars_admin_v10";

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
      <span class="project-icon">${ic}</span>
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
  const item = S.find(x => x[0] === id);
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
      <span class="project-icon">${ic}</span>
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

home();
