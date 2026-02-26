let contacts=[];
let hierarchy={};
let selectedNode="";
let currentPage=1;
const pageSize=10;

fetch("data/directory.json")
.then(res=>res.json())
.then(data=>{
contacts=data.offices;
buildHierarchy();
renderTree();
applyFilters();
});

function buildHierarchy(){
hierarchy={};
contacts.forEach(c=>{
let path=[c.zone,c.circle,c.division,c.subdivision,c.section].filter(Boolean);
let ref=hierarchy;
path.forEach(p=>{
if(!ref[p]) ref[p]={};
ref=ref[p];
});
});
}

function renderTree(){
tree.innerHTML="";
createNode("All Offices",hierarchy,tree);
}

function createNode(label,children,parent){
let div=document.createElement("div");
let lbl=document.createElement("div");
lbl.className="tree-label";
lbl.innerText=label;

let child=document.createElement("div");
child.className="children";

if(children){
Object.keys(children).forEach(k=>{
createNode(k,children[k],child);
});
}

lbl.onclick=()=>{
selectedNode=label==="All Offices"?"":label;
breadcrumb.innerText=selectedNode;
applyFilters();
child.classList.toggle("active");
};

div.append(lbl,child);
parent.append(div);
}

search.oninput=applyFilters;
designationFilter.onchange=applyFilters;

function applyFilters(){
let term=search.value.toLowerCase();
let filtered=contacts.filter(c=>{
return(
(!selectedNode ||
c.zone===selectedNode||
c.circle===selectedNode||
c.division===selectedNode||
c.subdivision===selectedNode||
c.section===selectedNode) &&
(!designationFilter.value || c.designation===designationFilter.value) &&
(
c.name.toLowerCase().includes(term)||
c.mobile.includes(term)||
c.email.toLowerCase().includes(term)
)
);
});
renderPagination(filtered);
}

function renderPagination(data){
pagination.innerHTML="";
let pages=Math.ceil(data.length/pageSize);
for(let i=1;i<=pages;i++){
let btn=document.createElement("button");
btn.innerText=i;
btn.onclick=()=>{currentPage=i;renderGrid(data)};
pagination.appendChild(btn);
}
renderGrid(data);
}

function renderGrid(data){
grid.innerHTML="";
let start=(currentPage-1)*pageSize;
let pageData=data.slice(start,start+pageSize);

pageData.forEach(c=>{
let card=document.createElement("div");
card.className="card";
card.innerHTML=`
<strong>${c.name}</strong><br>
${c.designation}<br>
${c.zone}<br>
${c.mobile}<br>
${c.email}
`;
grid.append(card);
});
}

function exportJSON(){
let blob=new Blob([JSON.stringify(contacts,null,2)],{type:"application/json"});
let a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="directory_export.json";
a.click();
}

function toggleTheme(){
document.body.classList.toggle("dark");
}
