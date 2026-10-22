const STORE = "campus-desk-v1";
const departmentsSeed = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Electronics & Communication"];
const coursesSeed = [
  {id:"cse",name:"Computer Science & Engineering",code:"CSE",department:"Computer Science",duration:4},
  {id:"ece",name:"Electronics & Communication",code:"ECE",department:"Electronics & Communication",duration:4},
  {id:"me",name:"Mechanical Engineering",code:"ME",department:"Mechanical Engineering",duration:4},
  {id:"ce",name:"Civil Engineering",code:"CE",department:"Civil Engineering",duration:4},
  {id:"eee",name:"Electrical & Electronics",code:"EEE",department:"Electrical Engineering",duration:4},
  {id:"it",name:"Information Technology",code:"IT",department:"Computer Science",duration:4}
];
const demoStudents = [
  ["Aarav Sharma","BT23CSE014","aarav.sharma@campus.edu","9876543210","Male","2005-02-14","Computer Science","CSE","2023","B-204, North Hostel","2023-08-12"],
  ["Diya Nair","BT23ECE027","diya.nair@campus.edu","9845012387","Female","2004-11-08","Electronics & Communication","ECE","2023","14 Lake View Road","2023-08-14"],
  ["Kabir Reddy","BT22ME009","kabir.reddy@campus.edu","9986120453","Male","2004-04-22","Mechanical Engineering","ME","2022","C-117, East Hostel","2022-08-10"],
  ["Ananya Iyer","BT24CSE031","ananya.iyer@campus.edu","9900231465","Female","2006-01-17","Computer Science","CSE","2024","22 Green Park","2024-08-09"],
  ["Rohan Das","BT23CE018","rohan.das@campus.edu","9831048752","Male","2005-06-30","Civil Engineering","CE","2023","A-312, South Hostel","2023-08-13"],
  ["Meera Kulkarni","BT22EEE006","meera.kulkarni@campus.edu","9822047611","Female","2004-08-05","Electrical Engineering","EEE","2022","8 River Street","2022-08-11"],
  ["Arjun Menon","BT24ECE042","arjun.menon@campus.edu","9746123085","Male","2006-03-12","Electronics & Communication","ECE","2024","D-108, North Hostel","2024-08-10"],
  ["Sana Khan","BT23IT022","sana.khan@campus.edu","9893014672","Female","2005-09-26","Computer Science","IT","2023","31 Garden Lane","2023-08-15"],
  ["Vihaan Patel","BT22CE011","vihaan.patel@campus.edu","9825013476","Male","2004-12-03","Civil Engineering","CE","2022","C-208, East Hostel","2022-08-12"],
  ["Ishita Bose","BT24ME033","ishita.bose@campus.edu","9830014579","Female","2006-05-19","Mechanical Engineering","ME","2024","17 College Road","2024-08-12"],
  ["Neel Joshi","BT23EEE016","neel.joshi@campus.edu","9898063421","Male","2005-07-11","Electrical Engineering","EEE","2023","B-109, North Hostel","2023-08-16"],
  ["Tara Krishnan","BT22CSE004","tara.krishnan@campus.edu","9840027581","Female","2004-02-28","Computer Science","CSE","2022","6 Palm Avenue","2022-08-09"]
].map((s,i)=>({id:`s${i+1}`,name:s[0],roll:s[1],email:s[2],phone:s[3],gender:s[4],dob:s[5],department:s[6],course:s[7],year:s[8],address:s[9],admission:s[10],createdAt:s[10]}));
function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORE));
    if(saved&&Array.isArray(saved.students)&&Array.isArray(saved.courses)) return {...saved,departments:saved.departments||departmentsSeed,activities:saved.activities||[],preferences:saved.preferences||{theme:"light"}};
  }catch(e){console.warn("Local data could not be read",e)}
  return {students:demoStudents,courses:coursesSeed,departments:departmentsSeed,activities:[{text:"12 student records loaded for the new term",time:new Date().toISOString()}],preferences:{theme:"light"}};
}
let db=loadState(), page=1, pageSize=8, searchTerm="", activeModal=null, mobileOpen=false;
function persist(){localStorage.setItem(STORE,JSON.stringify(db))}
if(!localStorage.getItem(STORE))persist();
const app=document.querySelector("#app");
const esc=(v="")=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const initials=name=>String(name||"?").split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
const icon=(char)=>`<span class="nav-icon" aria-hidden="true">${char}</span>`;
const go=path=>{history.pushState({}, "", path);page=1;activeModal=null;mobileOpen=false;render()};
const studentById=id=>db.students.find(s=>s.id===id);
const courseByCode=code=>db.courses.find(c=>c.code===code);
const titleCase=s=>String(s).replace(/\b\w/g,c=>c.toUpperCase());
const formatDate=s=>s?new Date(`${s}T00:00:00`).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"—";
function activity(text){db.activities.unshift({text,time:new Date().toISOString()});db.activities=db.activities.slice(0,8);persist()}
function toast(message,type="success"){const el=document.createElement("div");el.className=`toast ${type}`;el.textContent=message;document.querySelector("#toast-region").append(el);setTimeout(()=>el.remove(),3400)}
function navLink(path,label,symbol,current){const active=path==="/students"?(current==="/students"||current.startsWith("/students/")):current===path;return `<a href="${path}" data-route="${path}" class="nav-item ${active?"active":""}">${icon(symbol)}<span>${label}</span></a>`}
function layout(content,current,title){
 const date=new Intl.DateTimeFormat("en-US",{weekday:"short",month:"short",day:"numeric"}).format(new Date());
 return `<div class="shell"><aside class="sidebar ${mobileOpen?"open":""}" aria-label="Main navigation"><div class="brand"><div class="brand-mark">cd</div><div><div class="brand-name">Campus Desk</div><div class="brand-caption">Operations workspace</div></div></div><div class="nav-label">Workspace</div><nav class="nav-list">${navLink("/","Overview","▦",current)}${navLink("/students","Students","○",current)}${navLink("/students/new","Add student","＋",current)}${navLink("/courses","Courses & departments","▤",current)}${navLink("/settings","Settings","⌘",current)}</nav><div class="side-bottom"><div class="campus-card"><small>Academic session</small><strong>2024 — 2025 &nbsp;·&nbsp; Semester II</strong></div><div class="user-chip"><div class="avatar">AD</div><div><strong>Admin desk</strong><small>College staff</small></div></div></div></aside><div class="mobile-overlay ${mobileOpen?"show":""}" data-action="close-menu"></div><main class="main"><header class="topbar"><button class="menu-toggle" data-action="toggle-menu" aria-label="Open navigation" aria-expanded="${mobileOpen}">☰</button><div class="breadcrumb">Campus Desk <span aria-hidden="true">/</span> <b>${esc(title)}</b></div><div class="top-actions"><form class="top-search" id="global-search-form" role="search"><label class="sr-only" for="global-search">Search student records</label><input id="global-search" name="q" type="search" placeholder="Search students…" autocomplete="off"><button type="submit" aria-label="Search student records">⌕</button></form><span class="today">${date}</span><div class="avatar top-avatar" aria-label="Admin profile">AD</div></div></header><section class="content">${content}</section></main></div>`;
}
function statsBlock(){
 const courseCount=db.courses.length, departments=db.departments.length, activeStudents=db.students.filter(s=>s.status!=="Inactive").length;
 return `<div class="stats-grid"><article class="stat-card"><div class="stat-top">Total students <span class="stat-symbol">♙</span></div><div class="stat-value">${db.students.length}</div><div class="stat-note"><em>Across ${departments} departments</em></div></article><article class="stat-card"><div class="stat-top">Active students <span class="stat-symbol">✓</span></div><div class="stat-value">${activeStudents}</div><div class="stat-note">Current student register</div></article><article class="stat-card"><div class="stat-top">Active courses <span class="stat-symbol">▤</span></div><div class="stat-value">${courseCount}</div><div class="stat-note">Undergraduate programmes</div></article><article class="stat-card"><div class="stat-top">Departments <span class="stat-symbol">⌂</span></div><div class="stat-value">${departments}</div><div class="stat-note">Engineering disciplines</div></article></div>`;
}
function tableRows(rows,actions=true){
 if(!rows.length)return `<tr><td colspan="6"><div class="empty-state"><div class="empty-mark">⌕</div><h3>No students found</h3><p>Try another search or adjust your filters.</p><button class="btn btn-small" data-action="clear-filters">Clear filters</button></div></td></tr>`;
 return rows.map(s=>`<tr><td><a class="student-name" href="/students/${encodeURIComponent(s.id)}" data-route="/students/${encodeURIComponent(s.id)}"><span class="avatar">${esc(initials(s.name))}</span><span>${esc(s.name)}</span></a></td><td class="mono">${esc(s.roll)}</td><td>${esc(s.department)}</td><td><span class="badge">${esc(s.course)}</span></td><td>${esc(s.year)}–${Number(s.year)+4}</td><td>${actions?`<div class="table-actions"><button class="icon-btn" aria-label="View ${esc(s.name)}" title="View profile" data-action="profile" data-id="${esc(s.id)}">↗</button><button class="icon-btn" aria-label="Edit ${esc(s.name)}" title="Edit" data-action="edit-student" data-id="${esc(s.id)}">✎</button><button class="icon-btn" aria-label="Delete ${esc(s.name)}" title="Delete" data-action="delete-student" data-id="${esc(s.id)}">×</button></div>`:formatDate(s.admission)}</td></tr>`).join("");
}
function recentTable(rows){return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Roll number</th><th>Department</th><th>Course</th><th>Year</th><th>Added</th></tr></thead><tbody>${tableRows(rows,false)}</tbody></table></div>`}
function dashboard(){
 const deptCounts=db.departments.map(dep=>({dep,count:db.students.filter(s=>s.department===dep).length})).sort((a,b)=>b.count-a.count);
 const max=Math.max(1,...deptCounts.map(x=>x.count));
 const activityHtml=db.activities.slice(0,5).map(a=>`<div class="activity-item"><span class="activity-dot"></span><div><div class="activity-text">${esc(a.text)}</div><div class="activity-time">${new Date(a.time).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div></div></div>`).join("")||`<div class="activity-text">Activity from your workspace will appear here.</div>`;
 return layout(`<div class="page-head"><div><div class="eyebrow">Tuesday · campus overview</div><h1 class="page-title">Good morning, Admin</h1><p class="page-subtitle">A clear view of your student records and programmes.</p></div><button class="btn btn-primary" data-route="/students/new">＋ &nbsp; Add student</button></div>${statsBlock()}<div class="dashboard-grid"><section class="panel"><div class="panel-head"><div><h2 class="panel-title">Students by department</h2><div class="panel-meta">Enrolment distribution across the college</div></div><a href="/courses" data-route="/courses" class="btn btn-small">View courses →</a></div><div class="panel-body dept-bars">${deptCounts.map(x=>`<div><div class="bar-head"><span>${esc(x.dep)}</span><span>${x.count} student${x.count===1?"":"s"}</span></div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(4,x.count/max*100)}%"></div></div></div>`).join("")||`<div class="empty-state"><h3>No departments yet</h3></div>`}</div></section><section class="panel"><div class="panel-head"><div><h2 class="panel-title">Recent activity</h2><div class="panel-meta">Latest updates from your desk</div></div><span class="stat-symbol">↻</span></div><div class="panel-body activity-list">${activityHtml}</div></section></div><section class="panel recent-panel"><div class="panel-head"><div><h2 class="panel-title">Recently added students</h2><div class="panel-meta">Latest records in your register</div></div><a href="/students" data-route="/students" class="btn btn-small">All students →</a></div>${recentTable([...db.students].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,5))}</section>`,`/`,"Overview");
}
function filteredStudents(){
 const params=new URLSearchParams(location.search),q=(params.get("q")||"").trim().toLowerCase(),dep=params.get("department")||"",course=params.get("course")||"",year=params.get("year")||"",sort=params.get("sort")||"name";
 let rows=db.students.filter(s=>(!q||[s.name,s.roll,s.email,s.department].some(v=>v.toLowerCase().includes(q)))&&(!dep||s.department===dep)&&(!course||s.course===course)&&(!year||s.year===year));
 const [field,direction]=sort.split(":");rows.sort((a,b)=>String(a[field]||"").localeCompare(String(b[field]||""),undefined,{numeric:true})*(direction==="desc"?-1:1));
 return rows;
}
function studentsPage(){
 const params=new URLSearchParams(location.search),rows=filteredStudents(),pages=Math.max(1,Math.ceil(rows.length/pageSize));page=Math.min(page,pages);const visible=rows.slice((page-1)*pageSize,page*pageSize);
 const dept=params.get("department")||"",course=params.get("course")||"",year=params.get("year")||"",sort=params.get("sort")||"name";
 return layout(`<div class="page-head"><div><div class="eyebrow">Student records</div><h1 class="page-title">Students</h1><p class="page-subtitle">Search, review and manage your student register.</p></div><div class="desktop-actions"><button class="btn" data-action="export-filtered">↓ &nbsp; Export CSV</button><button class="btn btn-primary" data-route="/students/new">＋ &nbsp; Add student</button></div></div>${statsBlock()}<section class="panel"><div class="panel-head"><div><h2 class="panel-title">Student register</h2><div class="panel-meta">${rows.length} record${rows.length===1?"":"s"} matching your view</div></div><button class="btn btn-small" data-action="export-filtered">↓ Export</button></div><div class="panel-body"><div class="toolbar"><label class="search-box"><span>⌕</span><input aria-label="Search students" placeholder="Search name, roll number, email or department" value="${esc(params.get("q")||"")}" data-input="search"></label><select class="filter-select" aria-label="Filter by department" data-filter="department"><option value="">All departments</option>${db.departments.map(d=>`<option ${d===dept?"selected":""}>${esc(d)}</option>`).join("")}</select><select class="filter-select" aria-label="Filter by course" data-filter="course"><option value="">All courses</option>${db.courses.map(c=>`<option value="${esc(c.code)}" ${c.code===course?"selected":""}>${esc(c.code)} · ${esc(c.name)}</option>`).join("")}</select><select class="filter-select" aria-label="Filter by academic year" data-filter="year"><option value="">All years</option>${[2024,2023,2022,2021,2020].map(y=>`<option ${String(y)===year?"selected":""}>${y}</option>`).join("")}</select><select class="filter-select" aria-label="Sort students" data-filter="sort"><option value="name" ${sort==="name"?"selected":""}>Name A–Z</option><option value="name:desc" ${sort==="name:desc"?"selected":""}>Name Z–A</option><option value="roll" ${sort==="roll"?"selected":""}>Roll number</option><option value="year:desc" ${sort==="year:desc"?"selected":""}>Newest year</option><option value="admission:desc" ${sort==="admission:desc"?"selected":""}>Recently admitted</option></select></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Roll number</th><th>Department</th><th>Course</th><th>Year</th><th>Actions</th></tr></thead><tbody>${tableRows(visible)}</tbody></table></div><div class="table-foot"><span>Showing ${rows.length?((page-1)*pageSize+1):0}–${Math.min(page*pageSize,rows.length)} of ${rows.length} students</span><div class="pagination"><button class="page-button" data-action="prev-page" ${page===1?"disabled":""} aria-label="Previous page">‹</button><span>Page ${page} of ${pages}</span><button class="page-button" data-action="next-page" ${page>=pages?"disabled":""} aria-label="Next page">›</button></div></div></div></section>`,`/students`,"Students");
}
function studentForm(student=null){
 const edit=!!student,v=student||{name:"",roll:"",email:"",phone:"",gender:"",dob:"",department:"",course:"",year:"2024",address:"",admission:new Date().toISOString().slice(0,10)};
 const courseOptions=()=>db.courses.filter(c=>!v.department||c.department===v.department).map(c=>`<option value="${esc(c.code)}" ${v.course===c.code?"selected":""}>${esc(c.code)} — ${esc(c.name)}</option>`).join("");
 return layout(`<div class="page-head"><div><div class="eyebrow">${edit?"Student record / Edit":"Student records / New record"}</div><h1 class="page-title">${edit?"Edit student":"Add a student"}</h1><p class="page-subtitle">${edit?"Update the details for this student.":"Create a complete student record in the college register."}</p></div><button class="btn" data-route="${edit?`/students/${encodeURIComponent(student.id)}`:"/students"}">← &nbsp; Back</button></div><form id="student-form" class="panel form-panel" data-student-id="${edit?esc(student.id):""}"><div class="form-section"><h2 class="form-section-title">Personal information</h2><p class="form-section-hint">Basic identity and contact details.</p><div class="form-grid"><div class="field"><label for="f-name">Full name <span class="required">*</span></label><input id="f-name" name="name" required maxlength="80" value="${esc(v.name)}" placeholder="e.g. Aditi Rao"></div><div class="field"><label for="f-roll">Roll number <span class="required">*</span></label><input id="f-roll" name="roll" required maxlength="24" value="${esc(v.roll)}" placeholder="e.g. BT24CSE018"></div><div class="field"><label for="f-gender">Gender <span class="required">*</span></label><select id="f-gender" name="gender" required><option value="">Select gender</option>${["Female","Male","Non-binary","Prefer not to say"].map(x=>`<option ${v.gender===x?"selected":""}>${x}</option>`).join("")}</select></div><div class="field"><label for="f-email">Email address <span class="required">*</span></label><input id="f-email" name="email" type="email" required value="${esc(v.email)}" placeholder="student@campus.edu"></div><div class="field"><label for="f-phone">Phone number <span class="required">*</span></label><input id="f-phone" name="phone" type="tel" required pattern="[+0-9 ()-]{7,18}" value="${esc(v.phone)}" placeholder="+91 98765 43210"></div><div class="field"><label for="f-dob">Date of birth <span class="required">*</span></label><input id="f-dob" name="dob" type="date" required value="${esc(v.dob)}"></div><div class="field span-3"><label for="f-address">Address <span class="required">*</span></label><textarea id="f-address" name="address" required maxlength="180" placeholder="Residential address">${esc(v.address)}</textarea></div></div></div><div class="form-section"><h2 class="form-section-title">Academic details</h2><p class="form-section-hint">Programme, department and admission information.</p><div class="form-grid"><div class="field"><label for="f-department">Department <span class="required">*</span></label><select id="f-department" name="department" required><option value="">Select department</option>${db.departments.map(d=>`<option ${v.department===d?"selected":""}>${esc(d)}</option>`).join("")}</select></div><div class="field"><label for="f-course">Course <span class="required">*</span></label><select id="f-course" name="course" required><option value="">Select course</option>${courseOptions()}</select></div><div class="field"><label for="f-year">Academic year <span class="required">*</span></label><select id="f-year" name="year" required>${[2024,2023,2022,2021,2020].map(y=>`<option ${String(y)===String(v.year)?"selected":""}>${y}</option>`).join("")}</select></div><div class="field"><label for="f-admission">Admission date <span class="required">*</span></label><input id="f-admission" name="admission" type="date" required value="${esc(v.admission)}"></div></div></div><div class="form-actions"><button type="button" class="btn" data-route="${edit?`/students/${encodeURIComponent(student.id)}`:"/students"}">Cancel</button><button type="submit" class="btn btn-primary">${edit?"Save changes":"Save student"}</button></div></form>`,edit?`/students/${student.id}/edit`:"/students/new",edit?"Edit student":"Add student");
}
function profilePage(s){
 if(!s)return notFound();
 const c=courseByCode(s.course);
 const fields=[["Roll number",s.roll],["Email address",s.email],["Phone number",s.phone],["Gender",s.gender],["Date of birth",formatDate(s.dob)],["Department",s.department],["Course",c?`${c.code} · ${c.name}`:s.course],["Academic year",`${s.year}–${Number(s.year)+4}`],["Admission date",formatDate(s.admission)],["Address",s.address]];
 return layout(`<div class="page-head"><div><div class="eyebrow">Student register / Profile</div><h1 class="page-title">Student profile</h1><p class="page-subtitle">Full record and academic details.</p></div><div class="desktop-actions"><button class="btn" data-route="/students">← &nbsp; All students</button><button class="btn btn-primary" data-action="edit-student" data-id="${esc(s.id)}">✎ &nbsp; Edit record</button></div></div><section class="panel"><div class="panel-body"><div class="profile-hero"><div class="avatar">${esc(initials(s.name))}</div><div><h2>${esc(s.name)}</h2><p>${esc(s.roll)} &nbsp;·&nbsp; ${esc(s.department)}</p></div></div><div class="profile-grid">${fields.map(([k,val])=>`<div class="profile-field"><small>${esc(k)}</small><strong>${esc(val||"—")}</strong></div>`).join("")}</div><div class="form-actions" style="border-top:1px solid var(--line);margin-top:14px"><button class="btn btn-danger" data-action="delete-student" data-id="${esc(s.id)}">Delete student</button></div></div></section>`,`/students/${s.id}`,s.name);
}
function coursesPage(){
 const counts=Object.fromEntries(db.courses.map(c=>[c.code,db.students.filter(s=>s.course===c.code).length]));
 const depts=db.departments.map(d=>({name:d,count:db.students.filter(s=>s.department===d).length}));
 return layout(`<div class="page-head"><div><div class="eyebrow">Academic structure</div><h1 class="page-title">Courses & departments</h1><p class="page-subtitle">A practical overview of programmes and enrolment.</p></div><button class="btn btn-primary" data-action="add-course">＋ &nbsp; Add course</button></div><div class="panel" style="margin-bottom:16px"><div class="panel-head"><div><h2 class="panel-title">Departments</h2><div class="panel-meta">${db.departments.length} engineering departments</div></div></div><div class="panel-body dept-bars">${depts.map(d=>`<div><div class="bar-head"><span>${esc(d.name)}</span><span>${d.count} student${d.count===1?"":"s"}</span></div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(3,d.count/Math.max(1,db.students.length)*100)}%"></div></div></div>`).join("")}</div></div><div class="course-grid">${db.courses.map(c=>`<article class="course-card"><div class="course-top"><span class="course-code">${esc(c.code)}</span><div class="table-actions"><button class="icon-btn" aria-label="Edit ${esc(c.name)}" title="Edit course" data-action="edit-course" data-id="${esc(c.id)}">✎</button><button class="icon-btn" aria-label="Delete ${esc(c.name)}" title="Delete course" data-action="delete-course" data-id="${esc(c.id)}">×</button></div></div><h3>${esc(c.name)}</h3><div class="course-dept">${esc(c.department)} · ${c.duration||4} year programme</div><div class="course-count"><span>Enrolled students</span><strong>${counts[c.code]||0}</strong></div></article>`).join("")||`<div class="empty-state"><h3>No courses yet</h3><p>Add the first course to get started.</p><button class="btn btn-primary" data-action="add-course">Add course</button></div>`}</div>`,`/courses`,"Courses & departments");
}
function settingsPage(){
 return layout(`<div class="page-head"><div><div class="eyebrow">Workspace preferences</div><h1 class="page-title">Settings</h1><p class="page-subtitle">Manage how your campus desk looks and handles data.</p></div></div><div class="settings-layout"><section class="settings-card"><h3>Appearance</h3><p>Choose a comfortable display for your workspace. Your preference is saved on this device.</p><div class="setting-row"><div><strong>Dark theme</strong><small>Use a darker, low-glare interface</small></div><button class="switch" role="switch" aria-checked="${db.preferences.theme==="dark"}" aria-label="Toggle dark theme" data-action="toggle-theme"></button></div></section><section class="settings-card"><h3>Data & privacy</h3><p>Your records are stored only in this browser. Nothing is sent to an external service.</p><div class="setting-row"><div><strong>Export student records</strong><small>Download every student as a CSV file</small></div><button class="btn btn-small" data-action="export-all">↓ Export CSV</button></div><div class="setting-row"><div><strong>Reset demo data</strong><small>Restore the original sample students and courses</small></div><button class="btn btn-small btn-danger" data-action="reset-data">Reset data</button></div></section><section class="settings-card"><h3>Workspace details</h3><p>Current local workspace information.</p><div class="setting-row"><div><strong>College operations desk</strong><small>Academic session · 2024–2025</small></div><span class="badge">Local workspace</span></div><div class="setting-row"><div><strong>Student records</strong><small>Saved in this browser</small></div><strong>${db.students.length}</strong></div><div class="setting-row"><div><strong>Courses</strong><small>Available programmes</small></div><strong>${db.courses.length}</strong></div></section></div>`,`/settings`,"Settings");
}
function notFound(){return layout(`<div class="empty-state"><div class="empty-mark">?</div><h3>Page not found</h3><p>This campus desk page doesn’t exist.</p><button class="btn btn-primary" data-route="/">Return to overview</button></div>`,"","Not found")}
function render(){
 document.documentElement.classList.toggle("dark",db.preferences.theme==="dark");
 const path=decodeURI(location.pathname);
 if(path==="/")app.innerHTML=dashboard();
 else if(path==="/students")app.innerHTML=studentsPage();
 else if(path==="/students/new")app.innerHTML=studentForm();
 else if(path==="/courses")app.innerHTML=coursesPage();
 else if(path==="/settings")app.innerHTML=settingsPage();
 else if(/^\/students\/[^/]+\/edit$/.test(path)){const s=studentById(path.split("/")[2]);app.innerHTML=s?studentForm(s):notFound()}
 else if(/^\/students\/[^/]+$/.test(path)){app.innerHTML=profilePage(studentById(path.split("/")[2]))}
 else app.innerHTML=notFound();
}
function csvEscape(value){return `"${String(value??"").replace(/"/g,'""')}"`}
function exportCsv(rows){
 const cols=["name","roll","email","phone","gender","dob","department","course","year","address","admission"];
 const csv=[cols.join(","),...rows.map(r=>cols.map(k=>csvEscape(r[k])).join(","))].join("\r\n");
 const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=`campus-students-${new Date().toISOString().slice(0,10)}.csv`;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);toast(`${rows.length} student records exported.`);
}
function modal(content){activeModal=content;document.body.insertAdjacentHTML("beforeend",`<div class="modal-backdrop" data-action="backdrop"><section class="modal" role="dialog" aria-modal="true">${content}</section></div>`)}
function closeModal(){document.querySelector(".modal-backdrop")?.remove();activeModal=null}
function courseModal(course=null){
 const c=course||{name:"",code:"",department:"",duration:4};
 modal(`<div class="modal-head"><h2>${course?"Edit course":"Add a course"}</h2><button class="icon-btn" aria-label="Close dialog" data-action="close-modal">×</button></div><form id="course-form" data-course-id="${course?esc(course.id):""}"><div class="modal-body"><div class="modal-grid"><div class="modal-field full"><label for="c-name">Course name *</label><input id="c-name" name="name" required maxlength="80" value="${esc(c.name)}" placeholder="e.g. Computer Science & Engineering"></div><div class="modal-field"><label for="c-code">Course code *</label><input id="c-code" name="code" required maxlength="8" value="${esc(c.code)}" placeholder="CSE"></div><div class="modal-field"><label for="c-duration">Duration (years)</label><select id="c-duration" name="duration"><option ${Number(c.duration)===4?"selected":""}>4</option><option ${Number(c.duration)===5?"selected":""}>5</option></select></div><div class="modal-field full"><label for="c-department">Department *</label><select id="c-department" name="department" required><option value="">Choose department</option>${db.departments.map(d=>`<option ${c.department===d?"selected":""}>${esc(d)}</option>`).join("")}</select></div></div></div><div class="modal-actions"><button type="button" class="btn" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">${course?"Save changes":"Add course"}</button></div></form>`);
}
function updateQuery(key,value){
 const p=new URLSearchParams(location.search);if(value)p.set(key,value);else p.delete(key);history.replaceState({}, "",`${location.pathname}${p.toString()?`?${p}`:""}`);page=1;render();
}
app.addEventListener("click",e=>{
 const route=e.target.closest("[data-route]");if(route){e.preventDefault();go(route.dataset.route);return}
 const el=e.target.closest("[data-action]");if(!el)return;
 const {action,id}=el.dataset;
 if(action==="toggle-menu"){mobileOpen=!mobileOpen;render()}
 if(action==="close-menu"){mobileOpen=false;render()}
 if(action==="next-page"){page++;render()}
 if(action==="prev-page"){page=Math.max(1,page-1);render()}
 if(action==="clear-filters"){searchTerm="";history.replaceState({},"",location.pathname);page=1;render()}
 if(action==="profile")go(`/students/${encodeURIComponent(id)}`);
 if(action==="edit-student")go(`/students/${encodeURIComponent(id)}/edit`);
 if(action==="delete-student"){
   const s=studentById(id);if(s&&confirm(`Delete ${s.name} (${s.roll})? This action cannot be undone.`)){db.students=db.students.filter(x=>x.id!==id);activity(`Removed student record for ${s.name}`);persist();toast("Student record deleted.");render()}
 }
 if(action==="export-filtered")exportCsv(filteredStudents());
 if(action==="export-all")exportCsv(db.students);
 if(action==="toggle-theme"){db.preferences.theme=db.preferences.theme==="dark"?"light":"dark";persist();render()}
 if(action==="reset-data"&&confirm("Reset the workspace to the original demo data? All changes in this browser will be lost.")){db={students:demoStudents.map(s=>({...s})),courses:coursesSeed.map(c=>({...c})),departments:[...departmentsSeed],activities:[{text:"Demo workspace restored to its original state",time:new Date().toISOString()}],preferences:{theme:"light"}};persist();page=1;history.replaceState({},"","/");toast("Demo data restored.");render()}
 if(action==="add-course")courseModal();
 if(action==="edit-course")courseModal(db.courses.find(c=>c.id===id));
 if(action==="delete-course"){
   const c=db.courses.find(x=>x.id===id);if(!c)return;
   const enrolled=db.students.filter(s=>s.course===c.code).length;
   if(enrolled){toast(`Cannot delete ${c.code}: ${enrolled} student${enrolled===1?" is":"s are"} enrolled.`, "error");return}
   if(confirm(`Delete course ${c.name}?`)){db.courses=db.courses.filter(x=>x.id!==id);activity(`Deleted course ${c.code} · ${c.name}`);persist();toast("Course deleted.");render()}
 }
 if(action==="close-modal")closeModal();
 if(action==="backdrop"&&e.target===el)closeModal();
});
app.addEventListener("input",e=>{
 if(e.target.matches('[data-input="search"]')){searchTerm=e.target.value;updateQuery("q",searchTerm);const input=app.querySelector('[data-input="search"]');input?.focus();input?.setSelectionRange(searchTerm.length,searchTerm.length)}
});
app.addEventListener("change",e=>{
 if(e.target.matches("[data-filter]"))updateQuery(e.target.dataset.filter,e.target.value);
 if(e.target.id==="f-department"){
   const selected=db.courses.filter(c=>c.department===e.target.value);const select=document.querySelector("#f-course");
   select.innerHTML=`<option value="">Select course</option>${selected.map(c=>`<option value="${esc(c.code)}">${esc(c.code)} — ${esc(c.name)}</option>`).join("")}`;
 }
});
app.addEventListener("submit",e=>{
 if(e.target.id==="global-search-form"){
   e.preventDefault();
   const query=new FormData(e.target).get("q").toString().trim();
   go(query?`/students?q=${encodeURIComponent(query)}`:"/students");
 }
 if(e.target.id==="student-form"){
   e.preventDefault();const form=e.target;if(!form.reportValidity())return;
   const data=Object.fromEntries(new FormData(form).entries()),editing=!!form.dataset.studentId;
   const duplicate=db.students.some(s=>s.roll.toLowerCase()===data.roll.trim().toLowerCase()&&s.id!==form.dataset.studentId);
   if(duplicate){const input=form.elements.roll;input.setCustomValidity("That roll number is already in use.");input.reportValidity();input.addEventListener("input",()=>input.setCustomValidity(""),{once:true});toast("Roll number must be unique.","error");return}
   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){toast("Enter a valid email address.","error");return}
   const course=db.courses.find(c=>c.code===data.course);if(!course||course.department!==data.department){toast("Choose a course that belongs to the selected department.","error");return}
   data.name=data.name.trim();data.roll=data.roll.trim();data.email=data.email.trim().toLowerCase();data.phone=data.phone.trim();
   if(editing){const i=db.students.findIndex(s=>s.id===form.dataset.studentId);if(i<0)return;db.students[i]={...db.students[i],...data};activity(`Updated student record for ${data.name}`);persist();toast("Student details updated.");go(`/students/${encodeURIComponent(form.dataset.studentId)}`)}
   else{const record={...data,id:`s${Date.now().toString(36)}`,createdAt:new Date().toISOString().slice(0,10)};db.students.unshift(record);activity(`Added ${record.name} · ${record.roll} to the register`);persist();toast("Student added to the register.");go(`/students/${encodeURIComponent(record.id)}`)}
 }
 if(e.target.id==="course-form"){
   e.preventDefault();const f=e.target;if(!f.reportValidity())return;const data=Object.fromEntries(new FormData(f).entries());data.code=data.code.trim().toUpperCase();data.name=data.name.trim();data.duration=Number(data.duration);
   const duplicate=db.courses.some(c=>c.code.toLowerCase()===data.code.toLowerCase()&&c.id!==f.dataset.courseId);
   if(duplicate){toast("That course code is already in use.","error");return}
   if(f.dataset.courseId){const i=db.courses.findIndex(c=>c.id===f.dataset.courseId);db.courses[i]={...db.courses[i],...data};activity(`Updated course ${data.code} · ${data.name}`);toast("Course updated.")}
   else{db.courses.push({...data,id:`c${Date.now().toString(36)}`});activity(`Added course ${data.code} · ${data.name}`);toast("Course added.")}
   persist();closeModal();render();
 }
});
window.addEventListener("popstate",()=>{page=1;mobileOpen=false;render()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();if(mobileOpen){mobileOpen=false;render()}}});
render();
