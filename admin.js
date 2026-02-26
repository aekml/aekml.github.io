let editIndex=null;

function toggleAdmin(){
adminPanel.classList.toggle("hidden");
renderAdminList();
}

function renderAdminList(){
adminList.innerHTML="";
contacts.forEach((c,i)=>{
let div=document.createElement("div");
div.innerHTML=`
<strong>${c.name}</strong> - ${c.designation}
<button onclick="editOfficer(${i})">Edit</button>
<button onclick="deleteOfficer(${i})">Delete</button>
<hr>
`;
adminList.append(div);
});
}

function editOfficer(index){
let c=contacts[index];
editIndex=index;

a_name.value=c.name;
a_designation.value=c.designation;
a_zone.value=c.zone;
a_circle.value=c.circle;
a_division.value=c.division;
a_subdivision.value=c.subdivision;
a_section.value=c.section;
a_mobile.value=c.mobile;
a_email.value=c.email;
}

function deleteOfficer(index){
if(confirm("Delete officer?")){
contacts.splice(index,1);
buildHierarchy();
renderTree();
renderAdminList();
applyFilters();
}
}

function saveOfficer(){

let officer={
name:a_name.value,
designation:a_designation.value,
zone:a_zone.value,
circle:a_circle.value,
division:a_division.value,
subdivision:a_subdivision.value,
section:a_section.value,
mobile:a_mobile.value,
email:a_email.value
};

if(editIndex!==null){
contacts[editIndex]=officer;
editIndex=null;
}else{
contacts.push(officer);
}

resetForm();
buildHierarchy();
renderTree();
renderAdminList();
applyFilters();
}

function resetForm(){
a_name.value="";
a_designation.value="";
a_zone.value="";
a_circle.value="";
a_division.value="";
a_subdivision.value="";
a_section.value="";
a_mobile.value="";
a_email.value="";
editIndex=null;
}

function downloadUpdatedJSON(){
let blob=new Blob([JSON.stringify({offices:contacts},null,2)],{type:"application/json"});
let a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="updated_directory.json";
a.click();
}
