const domainData = {
  tan: {
    number:"DOMAIN / 01", label:"TENANT ACCESS NETWORK", title:"Tenant Access Network",
    description:"An anonymised, high-level view of the TAN Phase 1 / Phase 2 environment, showing the aggregation path towards server and storage access layers.",
    purpose:"Carries tenant-facing traffic between compute servers, tenant networks and connected storage platforms.",
    checks:["Check server NIC and switch-port link state.","Review interface counters, FEC, symbol errors and transceiver diagnostics.","Validate VLAN / VRF, LAG, MAC learning and routing.","Trace the path through access, spine, core and border layers."],
    note:"This portfolio view is intentionally sanitised. It represents the architecture hierarchy, not exact production cabling or port mapping.",
    layers:[
      {name:"UPSTREAM",nodes:[["External / Tenant","WAN / tenant", "storage"]]},
      {name:"BORDER",nodes:[["Border Leaf A","Routing", "network"],["Border Leaf B","Routing", "network"]]},
      {name:"TAN CORE",nodes:[["TAN Core A","Aggregation", "network"],["TAN Core B","Aggregation", "network"]]},
      {name:"SPINE",nodes:[["TAN Spine 01","Fabric", "network"],["TAN Spine 02","Fabric", "network"],["TAN Spine 03","Fabric", "network"],["TAN Spine 04","Fabric", "network"]]},
      {name:"ACCESS / LEAF",nodes:[["Compute Leaf Group","Phase 1 / 2", "network"],["Storage Leaf Group","WEKA / storage", "network"],["Service Leaf Group","Other access", "network"]]},
      {name:"ENDPOINTS",nodes:[["Compute Servers","TAN NICs", "compute"],["WEKA Storage","Storage ports", "storage"],["Other Services","Tenant endpoints", "compute"]]}
    ]
  },
  oob: {
    number:"DOMAIN / 02", label:"OUT-OF-BAND MANAGEMENT", title:"Out-of-Band Management",
    description:"Sanitised view based on the supplied OOB diagram: two core switches, eight spine switches and access connectivity to Phase 1 / Phase 2 server BMC endpoints.",
    purpose:"Provides a separate management path to server BMC interfaces and remote hardware consoles, independent of the host operating system and production data network.",
    checks:["Verify BMC NIC link and server management state.","Check the connected OOB access-switch port, VLAN and MAC learning.","Validate management IP, DHCP / gateway and routing reachability.","Trace the path from access switch through spine to OOB core."],
    note:"Hostnames and device-level identifiers are replaced with generic labels. Restrict BMC access to authorised management networks.",
    layers:[
      {name:"MANAGEMENT CORE",nodes:[["OOB Core A","Core switch", "network"],["OOB Core B","Core switch", "network"]]},
      {name:"SPINE FABRIC",nodes:Array.from({length:8},(_,i)=>[`OOB Spine ${String(i+1).padStart(2,'0')}`,'Spine switch','network'])},
      {name:"ACCESS",nodes:[["Phase 1 OOB Access","BMC access", "network"],["Phase 2 OOB Access","BMC access", "network"]]},
      {name:"SERVER ENDPOINTS",nodes:[["BMC Group 01","Phase 1 servers", "compute"],["BMC Group 02","Phase 1 servers", "compute"],["BMC Group 03","Phase 2 servers", "compute"],["BMC Group 04","Phase 2 servers", "compute"]]}
    ]
  },
  pxe: {
    number:"DOMAIN / 03", label:"PROVISIONING NETWORK", title:"PXE Network",
    description:"Sanitised view based on the supplied PXE diagram: two core switches, eight spine switches and Phase 1 / Phase 2 provisioning access switches serving server PXE interfaces.",
    purpose:"Provides network boot and provisioning connectivity for bare-metal server deployment and approved firmware / BIOS workflows.",
    checks:["Confirm the server is connected to the intended PXE interface and segment.","Verify DHCP scope, relay and boot options.","Check reachability to the approved TFTP / HTTP boot service.","Confirm boot image availability and server firmware boot mode."],
    note:"The diagram shows the network hierarchy only. DHCP, boot services and image repositories are logical services and are not mapped to specific production hosts.",
    layers:[
      {name:"PXE CORE",nodes:[["PXE Core A","Core switch", "network"],["PXE Core B","Core switch", "network"]]},
      {name:"SPINE FABRIC",nodes:Array.from({length:8},(_,i)=>[`PXE Spine ${String(i+1).padStart(2,'0')}`,'Spine switch','network'])},
      {name:"ACCESS",nodes:[["Phase 1 PXE Access","Provisioning", "network"],["Phase 2 PXE Access","Provisioning", "network"]]},
      {name:"SERVER ENDPOINTS",nodes:[["PXE Group 01","Phase 1 servers", "compute"],["PXE Group 02","Phase 1 servers", "compute"],["PXE Group 03","Phase 2 servers", "compute"],["PXE Group 04","Phase 2 servers", "compute"]]}
    ]
  },
  ib: {
    number:"DOMAIN / 04", label:"INFINIBAND FABRIC + UFM MANAGEMENT", title:"InfiniBand Fabric",
    description:"The UFM management path reaches a managed Ethernet switch, which connects to all InfiniBand core switches. The data fabric continues through IB spine switches, IB leaf switches and the server HCA / mlx ports.",
    purpose:"Provides high-throughput, low-latency server interconnectivity. UFM provides fabric monitoring and management visibility; it is separate from the InfiniBand data path.",
    checks:["Check the UFM view for fabric health, topology and port state.","Verify server HCA / mlx port state (Active, Init, Polling or Down).","Trace the data path through IB leaf, spine and core switch layers.","Check link width / speed, cable and transceiver health, and PKey membership."],
    note:"The management connection is shown separately: UFM → managed switch → all IB core switches. The data path is IB Core → IB Spine → IB Leaf → server mlx ports. InfiniBand uses PKeys / partitions rather than Ethernet VLANs.",
    layers:[
      {name:"FABRIC MANAGEMENT",nodes:[["UFM Platform","Management", "storage"]]},
      {name:"MANAGEMENT SWITCH",nodes:[["Managed Switch","Ethernet management", "network"]]},
      {name:"IB CORE",nodes:[["IB Core 01","Fabric core", "network"],["IB Core 02","Fabric core", "network"],["IB Core 03","Fabric core", "network"],["IB Core 04","Fabric core", "network"]]},
      {name:"IB SPINE",nodes:[["IB Spine 01","Fabric spine", "network"],["IB Spine 02","Fabric spine", "network"],["IB Spine 03","Fabric spine", "network"],["IB Spine 04","Fabric spine", "network"]]},
      {name:"IB LEAF",nodes:[["IB Leaf 01","Server access", "network"],["IB Leaf 02","Server access", "network"],["IB Leaf 03","Server access", "network"],["IB Leaf 04","Server access", "network"]]},
      {name:"SERVER HCA PORTS",nodes:[["mlx Port Group 01","Server HCA", "compute"],["mlx Port Group 02","Server HCA", "compute"],["mlx Port Group 03","Server HCA", "compute"],["mlx Port Group 04","Server HCA", "compute"]]}
    ], managementLinks:[[0,1],[1,2]], dataStartLayer:2
  }
};

const svgNS="http://www.w3.org/2000/svg";
const nodesGroup=document.getElementById("diagram-nodes");
const linksGroup=document.getElementById("diagram-links");
function svgEl(tag,attrs={}){const el=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;}
function renderDiagram(key){
  const data=domainData[key];
  document.getElementById("diagram-label").textContent=data.label;
  nodesGroup.replaceChildren();linksGroup.replaceChildren();
  const W=900,H=470,left=24,right=876,top=52,bottom=430,layerGap=(bottom-top)/Math.max(1,data.layers.length-1);
  const coords=[];
  data.layers.forEach((layer,li)=>{
    const count=layer.nodes.length, y=top+li*layerGap;
    const gap=(right-left)/Math.max(1,count);
    coords[li]=layer.nodes.map((n,ni)=>({x:left+gap*(ni+.5),y,label:n[0],sub:n[1],type:n[2]}));
  });
  // Draw fabric links between adjacent layers. IB management links are explicitly shown separately from the IB data fabric.
  data.layers.forEach((layer,li)=>{
    if(li===data.layers.length-1)return;
    const isMgmt=key==='ib'&&li===0;
    if(key==='ib'&&li===1){
      coords[li+1].forEach((b)=>coords[li].forEach((a)=>linksGroup.appendChild(svgEl('path',{d:`M ${a.x} ${a.y+16} L ${b.x} ${b.y-18}`,class:'management-link'}))));
    } else if(key==='ib'&&li===0){
      const a=coords[li][0],b=coords[li+1][0];linksGroup.appendChild(svgEl('path',{d:`M ${a.x} ${a.y+16} L ${b.x} ${b.y-18}`,class:'management-link'}));
    } else {
      coords[li].forEach((a,ai)=>coords[li+1].forEach((b,bi)=>{
        // Keep dense diagrams readable while indicating redundant paths across the layers.
        const d=`M ${a.x} ${a.y+16} L ${b.x} ${b.y-18}`;
        linksGroup.appendChild(svgEl('path',{d,class:'fabric-link'}));
      }));
    }
  });
  data.layers.forEach((layer,li)=>{
    const y=top+li*layerGap;
    const heading=svgEl('text',{x:12,y:y-27,class:'layer-heading'});heading.textContent=layer.name;nodesGroup.appendChild(heading);
    coords[li].forEach((p,ni)=>{
      const g=svgEl('g',{class:`diagram-node ${p.type}`,tabindex:'0',role:'button','aria-label':`Select ${p.label}`});
      const width=Math.min(150,Math.max(104,760/layer.nodes.length-12));
      g.appendChild(svgEl('rect',{x:p.x-width/2,y:p.y-17,width,height:34}));
      const title=svgEl('text',{x:p.x,y:p.y-2});title.textContent=p.label;
      const sub=svgEl('text',{x:p.x,y:p.y+10,class:'subtext'});sub.textContent=p.sub;
      g.append(title,sub);
      const select=()=>{nodesGroup.querySelectorAll('.diagram-node').forEach(n=>n.classList.remove('selected'));g.classList.add('selected');};
      g.addEventListener('click',select);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});
      nodesGroup.appendChild(g);
    });
  });
  if(nodesGroup.querySelector('.diagram-node'))nodesGroup.querySelector('.diagram-node').classList.add('selected');
  document.getElementById('domain-number').textContent=data.number;
  document.getElementById('domain-title').textContent=data.title;
  document.getElementById('domain-description').textContent=data.description;
  document.getElementById('domain-purpose').textContent=data.purpose;
  const list=document.getElementById('domain-checks');list.replaceChildren();data.checks.forEach(item=>{const li=document.createElement('li');li.textContent=item;list.appendChild(li);});
  document.getElementById('domain-note').textContent=data.note;
}
document.querySelectorAll('.domain-tab').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.domain-tab').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
  button.classList.add('active');button.setAttribute('aria-selected','true');renderDiagram(button.dataset.domain);
}));
document.querySelectorAll('.filter-btn').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));button.classList.add('active');
  const filter=button.dataset.filter;document.querySelectorAll('.case-card').forEach(card=>card.hidden=filter!=='all'&&card.dataset.category!==filter);
}));
const menuToggle=document.querySelector('.menu-toggle');
menuToggle.addEventListener('click',()=>{const nav=document.querySelector('.nav-links');const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.nav-links').classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}));
document.getElementById('year').textContent=new Date().getFullYear();
renderDiagram('tan');
