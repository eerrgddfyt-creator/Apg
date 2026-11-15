const $=id=>document.getElementById(id),R=THREE,PI=Math.PI,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),rn=(a,b)=>a+Math.random()*(b-a);
const angD=(a,b)=>{let d=(a-b)%(2*PI);if(d>PI)d-=2*PI;if(d<-PI)d+=2*PI;return d};
const mob=matchMedia('(pointer:coarse)').matches,WIN=10;
const ren=new R.WebGLRenderer({canvas:$('c'),antialias:!mob});ren.setPixelRatio(Math.min(devicePixelRatio,mob?1.5:2));ren.shadowMap.enabled=true;ren.shadowMap.type=R.PCFShadowMap;
const sc=new R.Scene();sc.background=new R.Color(0x010204);sc.add(new R.AmbientLight(0x1b2540,.9));
const cam=new R.PerspectiveCamera(50,1,.5,80);
function rs(){ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();

/* MUNDO */
const WL=[[0,-20.5,42,1],[0,20.5,42,1],[-20.5,0,1,42],[20.5,0,1,42],[0,0,7,1.4],[0,0,1.4,7],[-9,-8,1.4,5],[9,8,1.4,5],[-9,8,5,1.4],[9,-8,5,1.4],[-14,0,2,2],[14,0,2,2],[0,-14,2,2],[0,14,2,2],[-5,-14,3,1],[5,14,3,1]];
const WB=[],wm=new R.MeshLambertMaterial({color:0x6a7484});
WL.forEach(([x,z,w,d])=>{const m=new R.Mesh(new R.BoxGeometry(w,3.2,d),wm);m.position.set(x,1.6,z);m.castShadow=m.receiveShadow=true;sc.add(m);WB.push({x,z,hw:w/2,hd:d/2})});
const gc=document.createElement('canvas');gc.width=gc.height=64;const g2=gc.getContext('2d');g2.fillStyle='#3b404b';g2.fillRect(0,0,64,64);g2.strokeStyle='#707890';g2.lineWidth=2;g2.strokeRect(0,0,64,64);
const gt=new R.CanvasTexture(gc);gt.wrapS=gt.wrapT=R.RepeatWrapping;gt.repeat.set(21,21);
const flr=new R.Mesh(new R.PlaneGeometry(42,42),new R.MeshLambertMaterial({map:gt}));flr.rotation.x=-PI/2;flr.receiveShadow=true;sc.add(flr);
function rayW(ox,oz,dx,dz,mx){let t=mx;for(const w of WB){let t0=0,t1=t;
 if(Math.abs(dx)<1e-9){if(ox<w.x-w.hw||ox>w.x+w.hw)continue}else{let a=(w.x-w.hw-ox)/dx,b=(w.x+w.hw-ox)/dx;if(a>b){const q=a;a=b;b=q}t0=Math.max(t0,a);t1=Math.min(t1,b)}
 if(Math.abs(dz)<1e-9){if(oz<w.z-w.hd||oz>w.z+w.hd)continue}else{let a=(w.z-w.hd-oz)/dz,b=(w.z+w.hd-oz)/dz;if(a>b){const q=a;a=b;b=q}t0=Math.max(t0,a);t1=Math.min(t1,b)}
 if(t0<=t1&&t0<t)t=t0}return t}
const inW=(x,z,m)=>WB.some(w=>Math.abs(x-w.x)<w.hw+m&&Math.abs(z-w.z)<w.hd+m);
function col(c){for(const w of WB){const nx=cl(c.x,w.x-w.hw,w.x+w.hw),nz=cl(c.z,w.z-w.hd,w.z+w.hd),dx=c.x-nx,dz=c.z-nz,d=Math.hypot(dx,dz);if(d<.5){if(d>1e-4){c.x=nx+dx/d*.5;c.z=nz+dz/d*.5}else c.x+=.5}}}
const rwp=()=>{for(let i=0;i<9;i++){const x=rn(-17,17),z=rn(-17,17);if(!inW(x,z,1))return[x,z]}return[0,-10]};
const SPW=[[-17,-17],[17,17],[-17,17],[17,-17],[0,-17],[0,17],[-17,0],[17,0]];
const KITS=[[-12,-12],[12,12],[-12,12],[12,-12]].map(([x,z])=>{const m=new R.Mesh(new R.BoxGeometry(.6,.6,.6),new R.MeshBasicMaterial({color:0x7fb069}));m.position.set(x,.7,z);sc.add(m);return{x,z,m,t:0}});

/* PARTÍCULAS */
const NP=300,pp=new Float32Array(NP*3).fill(1e5),pcl=new Float32Array(NP*3),pb=new Float32Array(NP*3),pv=new Float32Array(NP*3),pl=new Float32Array(NP),pm=new Float32Array(NP).fill(1);
const pg=new R.BufferGeometry();pg.setAttribute('position',new R.BufferAttribute(pp,3));pg.setAttribute('color',new R.BufferAttribute(pcl,3));
const gcv=document.createElement('canvas');gcv.width=gcv.height=32;const gx=gcv.getContext('2d'),gr=gx.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'#fff');gr.addColorStop(.8,'#fff');gr.addColorStop(.82,'#fff0');gx.fillStyle=gr;gx.fillRect(0,0,32,32);
const glow=new R.CanvasTexture(gcv);
const pts=new R.Points(pg,new R.PointsMaterial({size:.4,map:glow,vertexColors:true,transparent:true,blending:R.AdditiveBlending,depthWrite:false}));pts.frustumCulled=false;sc.add(pts);
let pi2=0;const TC=new R.Color();
function spk(x,y,z,n,sp,hex,life){TC.set(hex);for(let k=0;k<n;k++){const i=pi2++%NP,a=Math.random()*6.283,s=sp*rn(.3,1);pp.set([x,y,z],i*3);pv.set([Math.cos(a)*s,rn(0,sp*.7),Math.sin(a)*s],i*3);pb.set([TC.r,TC.g,TC.b],i*3);pl[i]=pm[i]=life*rn(.6,1.2)}}

/* PERSONAGENS */
const box=(w,h,d,m,y)=>{const g=new R.Mesh(new R.BoxGeometry(w,h,d),m);g.position.y=y||0;return g};
const limb=(w,l,m,par,x,y,z)=>{const p=new R.Group();p.position.set(x,y,z);p.add(box(w,l,w,m,-l/2));par.add(p);return p};
const BEAM=new R.ConeGeometry(5.4,12,20,1,true).translate(0,-6,0).rotateX(PI/2),LG=new R.BoxGeometry(.03,.03,1).translate(0,0,-.5);
const CH=[],TV=new R.Vector3();
function mkChar(i){const A=new R.MeshLambertMaterial({color:[0x38c8ff,0xff5a4a,0xffb020,0x7dff5a,0xc070ff][i]}),B=new R.MeshLambertMaterial({color:0x2c313c});
 const root=new R.Group(),legs=new R.Group(),top=new R.Group();top.rotation.order='YXZ';legs.position.y=top.position.y=.95;root.add(legs,top);
 const tL=limb(.17,.5,B,legs,-.14,0,0),tR=limb(.17,.5,B,legs,.14,0,0),sL=limb(.15,.5,B,tL,0,-.5,0),sR=limb(.15,.5,B,tR,0,-.5,0);
 top.add(box(.5,.62,.28,A,.3),box(.26,.26,.26,B,.8));
 const aR=limb(.12,.42,A,top,.3,.55,0),aL=limb(.12,.42,A,top,-.3,.55,0);aR.rotation.set(1.45,.2,0);aL.rotation.set(1.5,-.3,0);
 const gun=new R.Group();gun.position.set(.05,.5,-.5);gun.add(box(.1,.14,.7,B,0));top.add(gun);
 const tip=new R.Object3D();tip.position.z=-.4;gun.add(tip);const rd=new R.Mesh(new R.SphereGeometry(.05,6,5),new R.MeshBasicMaterial({color:0xff2030}));rd.position.z=-.4;gun.add(rd);
 root.traverse(o=>{if(o.isMesh)o.receiveShadow=true});sc.add(root);
 const sp=new R.SpotLight(0xfff0cc,0,30,.42,.55,1.2);sp.castShadow=true;sp.shadow.mapSize.set(mob?256:512,mob?256:512);sp.shadow.camera.near=.4;sp.shadow.camera.far=30;sp.shadow.bias=-.003;sc.add(sp,sp.target);
 const beam=new R.Mesh(BEAM,new R.MeshBasicMaterial({color:0xffe6b0,transparent:true,opacity:.055,blending:R.AdditiveBlending,depthWrite:false,side:R.DoubleSide}));beam.rotation.order='YXZ';sc.add(beam);
 const las=new R.Mesh(LG,new R.MeshBasicMaterial({color:0xff2030,transparent:true,opacity:.85,blending:R.AdditiveBlending,depthWrite:false}));sc.add(las);
 const dot=new R.Mesh(new R.SphereGeometry(.12,8,6),new R.MeshBasicMaterial({color:0xff4050}));sc.add(dot);
 const fsp=new R.Sprite(new R.SpriteMaterial({map:glow,color:0xffcc66,blending:R.AdditiveBlending,depthWrite:false,transparent:true}));fsp.scale.setScalar(1.8);fsp.visible=false;sc.add(fsp);
 const c={i,root,legs,top,tL,tR,sL,sR,aR,aL,gun,tip,A,B,sp,beam,las,dot,fsp,on:false,x:0,z:0,vx:0,vz:0,mx:0,mz:0,a:0,ly:0,ph:0,sg:1,hp:100,alive:false,ammo:24,rel:0,cd:0,lt:true,ls:true,dash:0,dcd:0,inv:0,shot:0,flash:0,kills:0,rec:0,bloom:0,fall:0,fs:1,rt:0,flt:0,fT:0,ai:i>0,skill:rn(.45,.9),sd:1,sdT:0,wp:null,react:0,err:0,errT:0,hadT:0,ft:0,hear:null,stuck:0};CH.push(c);return c}
for(let i=0;i<5;i++)mkChar(i);let P=CH[0];

/* ESTADO */
let gs='menu',nb=4,ts=1,hs=0,shk=0,fovp=0,fxA=0,tim=0,hmT=0,last=performance.now(),nbl=0;const bl=[],cp=new R.Vector3(0,20,9),SPD=70;
const BG=new R.BoxGeometry(.05,.05,1.8).translate(0,0,.9),BM=new R.MeshBasicMaterial({color:0xffd070,blending:R.AdditiveBlending,transparent:true,depthWrite:false});
const fx=$('fx');function fxf(c,a){fx.style.background=`radial-gradient(ellipse at center,transparent 35%,${c})`;fxA=a}
const nm=c=>c===P?'VOCÊ':(c.nick||'BOT '+c.i);
function feed(t){const d=document.createElement('div');d.textContent=t;$('feed').appendChild(d);setTimeout(()=>d.remove(),3000)}
function spawn(c){let best=SPW[0],bd=-1;for(const s of SPW){let m=99;for(const o of CH)if(o!==c&&o.on&&o.alive)m=Math.min(m,Math.hypot(o.x-s[0],o.z-s[1]));m+=Math.random()*4;if(m>bd){bd=m;best=s}}
 c.x=best[0];c.z=best[1];c.vx=c.vz=0;c.a=c.ly=Math.atan2(c.x,c.z);c.hp=100;c.ammo=24;c.rel=0;c.alive=true;c.inv=1.6;c.fall=0;c.root.rotation.z=0;c.root.position.y=0;c.lt=true;c.ls=true;c.wp=null;c.hadT=0;spk(c.x,1,c.z,24,6,0xffffff,.6)}
/* ===== MODOS / ONLINE ===== */
const G={mode:'off',snT:0,inT:0,fi:0,q:[],onEnd:null},BOTC=[0x3f7fb5,0xc8553d,0xd9a23a,0x7f9a45,0x8a5a8f];
const evt=a=>{if(G.mode==='host')G.q.push(a)};
function flush(){if(G.mode==='host'&&G.q.length){Net.all({t:'ev',e:G.q});G.q=[]}}
function setLook(c,s){s=s||{};c.A.color.setHex(s.s!=null?CAT.s[s.s][1]:BOTC[c.i]);const l=s.l!=null?CAT.l[s.l][1]:0xd0302f,g=s.g!=null?CAT.g[s.g][1]:0xfff0cc;c.las.material.color.setHex(l);c.dot.material.color.setHex(l);c.sp.color.setHex(g);c.beam.material.color.setHex(g)}
function applyQ(){const q=Save.d.q,z=[256,512,1024][q];ren.setPixelRatio(Math.min(devicePixelRatio,[1,mob?1.5:1.75,2][q]));rs();CH.forEach(c=>{if(c.sp.shadow.map){c.sp.shadow.map.dispose();c.sp.shadow.map=null}c.sp.shadow.mapSize.set(z,z)})}
function bvis(c,a,x,z){const m=new R.Mesh(BG,BM);m.rotation.y=a;m.position.set(x,1.45,z);sc.add(m);bl.push({x,z,dx:-Math.sin(a),dz:-Math.cos(a),o:c,m,life:1});c.rec=1;c.shot=.9;c.fsp.visible=true;c.flt=.05;spk(x,1.45,z,5,4,0xffc060,.2);shotS(c===P?.3:.15);if(c===P)shk=Math.max(shk,.25)}
function fire(c){if(G.mode==='client'){if(c===P)G.fi=1;return}
if(c.cd>0||c.rel>0||c.dash>0||!c.alive)return;if(c.ammo<=0){reload(c);return}
c.cd=c.ai?.15:.1;c.ammo--;c.tip.getWorldPosition(TV);const a=c.a+(Math.random()-.5)*(.04+c.bloom)*2;c.bloom=Math.min(.1,c.bloom+.014);
bvis(c,a,TV.x,TV.z);evt(['f',c.i,a,+TV.x.toFixed(2),+TV.z.toFixed(2)]);
for(const b of CH)if(b.ai&&b.on&&b.alive&&b!==c&&!b.hadT&&Math.hypot(b.x-c.x,b.z-c.z)<32)b.hear=[c.x,c.z]}
function reload(c){if(G.mode==='client'){if(c===P)Net.send({t:'ac',k:'r'});return}if(c.rel>0||c.ammo>=24||!c.alive)return;c.rel=1.5;if(c===P){tone(300,200,.06,'sine',.12);setTimeout(()=>tone(400,300,.05,'sine',.1),600)}}
function dash(c){if(c.dcd>0||!c.alive||c.dash>0)return;if(G.mode==='client'&&c===P)Net.send({t:'ac',k:'d'});let x=c.mx,z=c.mz;if(Math.hypot(x,z)<.1){x=-Math.sin(c.a);z=-Math.cos(c.a)}const m=Math.hypot(x,z);c.vx=x/m*22;c.vz=z/m*22;c.dash=.16;c.dcd=1.1;c.inv=.25;spk(c.x,.4,c.z,16,5,0x9aa4b8,.4);noise(.12,3000,.2);if(c===P)fovp=14}
function tgF(c){c.lt=!c.lt;tone(c.lt?600:450,520,.06,'triangle',.18);if(c===P){$('bF').classList.toggle('off',!c.lt);if(G.mode==='client')Net.send({t:'ac',k:'F'})}}
function tgL(c){c.ls=!c.ls;tone(c.ls?680:480,560,.06,'triangle',.18);if(c===P){$('bL').classList.toggle('off',!c.ls);if(G.mode==='client')Net.send({t:'ac',k:'L'})}}
function hitVis(v,by){v.flash=1;spk(v.x,1.2,v.z,10,5,0xd05040,.4);if(by===P){hmT=.15;tone(700,500,.06,'triangle',.2)}if(v===P){fxf('rgba(150,40,30,.5)',.7);shk=Math.max(shk,.5);thud(.25)}}
function hurt(v,by,dmg,dx,dz){if(!v.alive||v.inv>0)return;v.hp-=dmg;v.vx+=dx*1.5;v.vz+=dz*1.5;hitVis(v,by);evt(['h',v.i,by.i]);
if(v.ai){if(Math.random()<.4){v.lt=false;v.ft=rn(1.5,3)}v.hear=[by.x,by.z]}if(v.hp<=0)kill(v,by)}
function killVis(v,by){v.alive=false;v.fall=0;v.fs=Math.random()<.5?-1:1;v.fsp.visible=false;hs=.13;ts=.3;spk(v.x,1,v.z,34,9,v.A.color.getHex(),.9);shk=Math.max(shk,.6);thud(.5);tone(300,70,.5,'sine',.25);feed(nm(by)+' ▸ '+nm(v))}
function kill(v,by){v.rt=2.6;by.kills++;killVis(v,by);evt(['k',v.i,by.i]);if(by.kills>=WIN)endM(by)}
function hudOff(){$('hud').style.display='none';['s1','s2'].forEach(i=>$(i).style.display='none');$('btns').style.display='none';$('cur').style.display='none';document.body.classList.remove('pl');if(document.exitPointerLock)document.exitPointerLock()}
function endM(w){if(gs!=='play')return;gs='over';evt(['e',w.i]);flush();hudOff();G.onEnd&&G.onEnd({win:w===P,w:nm(w),kills:P.kills})}
G.stop=()=>{gs='menu';CH.forEach(c=>c.on=false);bl.forEach(b=>sc.remove(b.m));bl.length=0;hudOff()};
function start(cfg){audio();applyQ();G.mode=cfg.mode;P=CH[cfg.me];
CH.forEach(c=>{c.on=false;c.alive=false;c.kills=0;c.rt=0;c.rm=false;c.ai=true;c.nick='';c.tx=null;c.inp=null;c.hadT=0;c.fall=0;c.root.rotation.z=0;c.root.position.y=0});
cfg.slots.forEach((s,i)=>{const c=CH[i];c.on=true;c.nick=s.h&&i!==cfg.me?s.n:'';c.ai=!s.h;c.rm=!!s.h&&i!==cfg.me&&cfg.mode==='host';setLook(c,s)});
if(cfg.mode!=='client')CH.forEach(c=>{if(c.on)spawn(c)});
bl.forEach(b=>sc.remove(b.m));bl.length=0;KITS.forEach(k=>k.t=0);gs='play';ts=1;G.snT=0;G.inT=0;G.fi=0;G.q=[];
$('hud').style.display='block';$('feed').innerHTML='';$('bF').classList.remove('off');$('bL').classList.remove('off');
if(mob)$('btns').style.display='grid';else{document.body.classList.add('pl');$('cur').style.display='block'}}
function cliStep(dt){if(P.alive&&P.on)upd(P,dt);
if(P.tx!=null&&P.alive){const k=Math.min(1,3*dt);P.x+=(P.tx-P.x)*k;P.z+=(P.tz-P.z)*k}
for(const c of CH){if(!c.on||c.tx==null)continue;if(c!==P){const k=Math.min(1,14*dt);c.x+=(c.tx-c.x)*k;c.z+=(c.tz-c.z)*k;c.a+=angD(c.ta,c.a)*k;c.cd-=dt;c.shot-=dt}c.rec*=Math.exp(-14*dt);c.flash*=Math.exp(-9*dt)}
G.inT-=dt;if(G.inT<=0){G.inT=1/30;Net.send({t:'in',mx:+P.mx.toFixed(2),mz:+P.mz.toFixed(2),a:+P.a.toFixed(2),f:G.fi});G.fi=0}}
function simStep(dt){if(G.mode==='client')return cliStep(dt);
for(const c of CH){if(!c.on)continue;if(c.alive){if(c.rm){const n=c.inp;if(n){c.mx=n.mx;c.mz=n.mz;c.a=n.a;if(n.f)fire(c)}}else if(c.ai)brain(c,dt);upd(c,dt)}else{c.rt-=dt;if(c.rt<=0)spawn(c)}}
snapMaybe(dt)}
function snapMaybe(dt){if(G.mode!=='host')return;G.snT-=dt;if(G.snT>0)return;G.snT=.05;
Net.all({t:'sn',s:CH.map(c=>c.on?[+c.x.toFixed(2),+c.z.toFixed(2),+c.a.toFixed(2),Math.max(0,c.hp|0),(c.alive?1:0)|(c.lt?2:0)|(c.ls?4:0)|(c.dash>0?8:0)|(c.inv>0?16:0),c.ammo,+c.vx.toFixed(1),+c.vz.toFixed(1),c.kills]:null)});flush()}
G.snap=s=>{if(G.mode!=='client'||gs!=='play')return;s.forEach((r,i)=>{const c=CH[i];if(!r){c.on=false;return}c.on=true;const f=r[4],al=!!(f&1);
if(c.tx==null||(al&&!c.alive)){c.x=r[0];c.z=r[1];c.vx=c.vz=0;c.ly=r[2];if(c!==P)c.a=r[2];c.fall=0;c.root.rotation.z=0;c.root.position.y=0}
c.alive=al;c.tx=r[0];c.tz=r[1];c.hp=r[3];c.ammo=r[5];c.kills=r[8];
if(c!==P){c.ta=r[2];c.vx=r[6];c.vz=r[7];c.lt=!!(f&2);c.ls=!!(f&4);c.dash=f&8?.1:0;c.inv=f&16?.2:0}else if(Math.hypot(r[0]-c.x,r[1]-c.z)>3){c.x=r[0];c.z=r[1]}})};
G.ev=e=>{if(G.mode!=='client'||gs!=='play')return;const[t,a,b,x,z]=e;
if(t==='f')bvis(CH[a],b,x,z);else if(t==='h')hitVis(CH[a],CH[b]);else if(t==='k')killVis(CH[a],CH[b]);
else if(t==='p'){const k=KITS[a];k.t=12;spk(k.x,.8,k.z,20,5,0x7fb069,.6)}
else if(t==='e'){gs='over';hudOff();G.onEnd&&G.onEnd({win:CH[a]===P,w:nm(CH[a]),kills:P.kills})}};
G.rx=(c,m)=>{const ch=CH[c.slot];if(!ch||gs!=='play'||!ch.rm)return;if(m.t==='in')ch.inp=m;else if(m.t==='ac'){if(m.k==='d')dash(ch);else if(m.k==='r')reload(ch);else if(m.k==='F')tgF(ch);else if(m.k==='L')tgL(ch)}};
G.drop=i=>{const c=CH[i];if(c){c.rm=false;c.ai=true}};

/* IA */
function cover(b,tg){let best=null,bd=1e9;for(let i=4;i<WB.length;i++){const w=WB[i],d=Math.hypot(w.x-b.x,w.z-b.z);if(d<bd){bd=d;const dx=w.x-tg.x,dz=w.z-tg.z,m=Math.hypot(dx,dz)||1,r=Math.max(w.hw,w.hd)+1.3;best=[w.x+dx/m*r,w.z+dz/m*r]}}return best}
function brain(b,dt){let tg=null,bd=1e9;
 for(const c of CH){if(c===b||!c.on||!c.alive)continue;const dx=c.x-b.x,dz=c.z-b.z,d=Math.hypot(dx,dz);if(d<bd&&d<28&&rayW(b.x,b.z,dx/d,dz/d,d)>=d&&(d<9||c.shot>0||(c.lt&&d<24))){tg=c;bd=d}}
 b.errT-=dt;if(b.errT<=0){b.errT=.4;b.err=rn(-.1,.1)*(1.6-b.skill)}b.sdT-=dt;if(b.sdT<=0){b.sdT=rn(1,2.2);b.sd=Math.random()<.5?-1:1}
 let mx=0,mz=0;b.react-=dt;
 if(tg){if(!b.hadT)b.react=rn(.25,.5);b.hadT=1;const ex=tg.x-b.x,ez=tg.z-b.z,ang=Math.atan2(-ex,-ez);b.a+=angD(ang+b.err,b.a)*Math.min(1,(3+b.skill*3)*dt);
  if(b.react<=0&&Math.abs(angD(ang,b.a))<.2)fire(b);
  const ux=ex/bd,uz=ez/bd,f=bd>12?1:bd<6?-1:0;
  if(b.hp<45||b.rel>0){const cv=cover(b,tg);if(cv){mx=cv[0]-b.x;mz=cv[1]-b.z;const m=Math.hypot(mx,mz)||1;if(m>.8){mx/=m;mz/=m}else mx=mz=0}}
  else{mx=ux*f-uz*b.sd*.8;mz=uz*f+ux*b.sd*.8}b.hear=null}
 else{b.hadT=0;if(b.hear){b.wp=b.hear;b.hear=null}if(!b.wp||Math.hypot(b.wp[0]-b.x,b.wp[1]-b.z)<1.2||b.stuck>.6){b.wp=rwp();b.stuck=0}
  mx=b.wp[0]-b.x;mz=b.wp[1]-b.z;const m=Math.hypot(mx,mz)||1;mx/=m;mz/=m;b.a+=angD(Math.atan2(-mx,-mz)+Math.sin(tim*1.7+b.i)*.6,b.a)*Math.min(1,5*dt);if(b.ammo<8)reload(b)}
 const m2=Math.hypot(mx,mz);if(m2>1){mx/=m2;mz/=m2}b.mx=mx;b.mz=mz;if(m2>.1&&Math.hypot(b.vx,b.vz)<1)b.stuck+=dt;else b.stuck=0;if(b.ammo<=0)reload(b);
 b.ft-=dt;if(b.ft<=0&&!b.lt)b.lt=true}

/* INPUT */
const K={},mo={x:0,y:0,d:0},tj={id:null,x0:0,y0:0,x:0,y:0},ta={id:null,x0:0,y0:0,m:0,a:0},ray=new R.Raycaster(),v2=new R.Vector2();
addEventListener('keydown',e=>{K[e.code]=1;if(gs!=='play')return;if(e.code==='KeyF')tgF(P);if(e.code==='KeyL'||e.code==='KeyG')tgL(P);if(e.code==='KeyR')reload(P);if(e.code==='ShiftLeft'||e.code==='Space'){e.preventDefault();dash(P)}});
addEventListener('keyup',e=>K[e.code]=0);
addEventListener('mousemove',e=>{mo.x=e.clientX;mo.y=e.clientY;$('cur').style.transform=`translate(${e.clientX}px,${e.clientY}px)`});
addEventListener('mousedown',e=>{if(e.button===0)mo.d=1});addEventListener('mouseup',()=>mo.d=0);addEventListener('contextmenu',e=>e.preventDefault());
function stk(n,x,y,show){const s=$('s'+n);s.style.display=show?'block':'none';s.style.left=x+'px';s.style.top=y+'px';$('k'+n).style.transform='none'}
addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'||gs!=='play'||e.target.closest('.b'))return;
 if(e.clientX<innerWidth*.5&&tj.id===null){tj.id=e.pointerId;tj.x0=e.clientX;tj.y0=e.clientY;tj.x=tj.y=0;stk(1,e.clientX,e.clientY,1)}
 else if(e.clientX>=innerWidth*.5&&ta.id===null){ta.id=e.pointerId;ta.x0=e.clientX;ta.y0=e.clientY;ta.m=0;stk(2,e.clientX,e.clientY,1)}});
addEventListener('pointermove',e=>{const o=e.pointerId===tj.id?tj:e.pointerId===ta.id?ta:null;if(!o)return;let dx=e.clientX-o.x0,dy=e.clientY-o.y0;const m=Math.hypot(dx,dy),k=Math.min(m,55)/(m||1);dx*=k;dy*=k;
 if(o===tj){tj.x=dx/55;tj.y=dy/55;$('k1').style.transform=`translate(${dx}px,${dy}px)`}else{ta.m=Math.min(m,55)/55;if(m>8)ta.a=Math.atan2(-dx,-dy);$('k2').style.transform=`translate(${dx}px,${dy}px)`}});
const up=e=>{if(e.pointerId===tj.id){tj.id=null;tj.x=tj.y=0;stk(1,0,0,0)}if(e.pointerId===ta.id){ta.id=null;ta.m=0;stk(2,0,0,0)}};addEventListener('pointerup',up);addEventListener('pointercancel',up);
[['bF',()=>tgF(P)],['bL',()=>tgL(P)],['bR',()=>reload(P)],['bD',()=>dash(P)]].forEach(([i,f])=>$(i).addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(gs==='play')f()}));
function pin(){let mx=(K.KeyD?1:0)-(K.KeyA?1:0)+tj.x,mz=(K.KeyS?1:0)-(K.KeyW?1:0)+tj.y;const m=Math.hypot(mx,mz);if(m>1){mx/=m;mz/=m}P.mx=mx;P.mz=mz;
 if(!P.alive)return;
 if(!mob){v2.set(mo.x/innerWidth*2-1,-(mo.y/innerHeight)*2+1);ray.setFromCamera(v2,cam);const o=ray.ray.origin,d=ray.ray.direction,t=(1.45-o.y)/d.y;if(t>0)P.a=Math.atan2(-(o.x+d.x*t-P.x),-(o.z+d.z*t-P.z));if(mo.d)fire(P)}
 else if(ta.id!==null){if(ta.m>.15)P.a=ta.a;if(ta.m>.5)fire(P)}}

/* UPDATE */
function upd(c,dt){c.cd-=dt;c.dcd-=dt;c.inv-=dt;c.shot-=dt;c.rec*=Math.exp(-14*dt);c.bloom*=Math.exp(-5*dt);c.flash*=Math.exp(-9*dt);
 if(c.rel>0){c.rel-=dt;if(c.rel<=0)c.ammo=24}
 const sp=c.ai?5.4:7.2;if(c.dash>0)c.dash-=dt;else{const k=Math.min(1,14*dt);c.vx+=(c.mx*sp-c.vx)*k;c.vz+=(c.mz*sp-c.vz)*k}
 c.x+=c.vx*dt;c.z+=c.vz*dt;col(c);c.fT-=dt;if(Math.hypot(c.vx,c.vz)>3&&c.fT<=0){c.fT=.16;spk(c.x,.1,c.z,1,.8,0x777c88,.4)}}
function vis(c,dt){c.root.visible=c.on;if(!c.on){c.sp.intensity=0;c.beam.visible=c.las.visible=c.dot.visible=c.fsp.visible=false;return}
 const sp=Math.hypot(c.vx,c.vz),mv=Math.min(1,sp/6),live=c.alive;
 if(live){if(sp>.6){const my=Math.atan2(-c.vx,-c.vz);let ty=my;c.sg=1;if(Math.abs(angD(my,c.a))>1.57){ty=my+PI;c.sg=-1}c.ly+=angD(ty,c.ly)*Math.min(1,16*dt);c.ph+=sp*dt*1.7}else c.ly+=angD(c.a,c.ly)*Math.min(1,8*dt);
  const s=Math.sin(c.ph)*.95*mv*c.sg;c.tL.rotation.x=s;c.tR.rotation.x=-s;c.sL.rotation.x=-(Math.max(0,-c.tL.rotation.x)*1.3+.1*mv);c.sR.rotation.x=-(Math.max(0,-c.tR.rotation.x)*1.3+.1*mv);
  c.legs.position.y=c.top.position.y=.95-Math.abs(Math.sin(c.ph))*.06*mv-(c.dash>0?.25:0);c.legs.rotation.y=c.ly;c.top.rotation.y=c.a;c.top.rotation.x=-.12*mv-(c.dash>0?.45:0)+c.rec*.1;
  c.gun.position.z=-.5+c.rec*.14;c.aR.rotation.x=1.45-c.rec*.25;c.aL.rotation.x=1.5-c.rec*.25;
  const e=Math.max(c.flash,c.inv>0&&Math.sin(tim*35)>0?.6:0);c.A.emissive.setScalar(e);c.B.emissive.setScalar(e)}
 else{c.fall=Math.min(1,c.fall+dt*4);c.root.rotation.z=c.fall*1.5*c.fs;c.root.position.y=c.fall*.2}
 c.root.position.x=c.x;c.root.position.z=c.z;
 c.tip.getWorldPosition(TV);const dx=-Math.sin(c.a),dz=-Math.cos(c.a);
 c.sp.position.copy(TV);c.sp.target.position.set(TV.x+dx*10,.2,TV.z+dz*10);c.sp.intensity=live&&c.lt?2.6+(c.fsp.visible?2:0):0;
 c.beam.visible=live&&c.lt;c.beam.position.copy(TV);c.beam.rotation.set(-.14,c.a,0);
 c.las.visible=c.dot.visible=live&&c.ls;if(live&&c.ls){const L=rayW(TV.x,TV.z,dx,dz,45);c.las.position.copy(TV);c.las.rotation.y=c.a;c.las.scale.z=L;c.dot.position.set(TV.x+dx*L,TV.y,TV.z+dz*L);c.dot.scale.setScalar(1+Math.sin(tim*20)*.15)}
 c.fsp.position.copy(TV);if(c.fsp.visible&&(c.flt-=dt)<=0)c.fsp.visible=false}

function frame(now){requestAnimationFrame(frame);let dt=Math.min((now-last)/1000,.05);last=now;if(hs>0){hs-=dt;dt*=.1}else ts+=(1-ts)*Math.min(1,5*dt);dt*=ts;tim+=dt;
 if(gs==='play'){pin();simStep(dt);
  for(let i=bl.length-1;i>=0;i--){const b=bl[i],s=SPD*dt,t=rayW(b.x,b.z,b.dx,b.dz,s);let hit=null,ht=t;
   for(const c of CH){if(G.mode==='client'||c===b.o||!c.on||!c.alive)continue;const rx=c.x-b.x,rz=c.z-b.z,pr=rx*b.dx+rz*b.dz;if(pr<0||pr>ht)continue;if(rx*rx+rz*rz-pr*pr<.3){hit=c;ht=pr}}
   if(hit){hurt(hit,b.o,14,b.dx,b.dz);sc.remove(b.m);bl.splice(i,1)}
   else if(t<s){spk(b.x+b.dx*t,1.4,b.z+b.dz*t,9,5,0xffb050,.35);sc.remove(b.m);bl.splice(i,1);if(Math.hypot(b.x-P.x,b.z-P.z)<14)noise(.06,2500,.06)}
   else{b.x+=b.dx*s;b.z+=b.dz*s;b.m.position.set(b.x,1.45,b.z);if((b.life-=dt)<=0){sc.remove(b.m);bl.splice(i,1)}}}
  for(const k of KITS){k.t-=dt;k.m.visible=k.t<=0;k.m.rotation.y=tim*2;if(k.t<=0)for(const c of CH)if(G.mode!=='client'&&c.on&&c.alive&&c.hp<100&&Math.hypot(c.x-k.x,c.z-k.z)<1){c.hp=Math.min(100,c.hp+40);k.t=12;evt(['p',KITS.indexOf(k)]);spk(k.x,.8,k.z,20,5,0x33ff88,.6);if(c===P){tone(500,1000,.2,'sine',.2);fxf('rgba(60,255,140,.4)',.5)}}}}
 for(const c of CH)vis(c,dt);
 for(let i=0;i<NP;i++)if(pl[i]>0){pl[i]-=dt;const f=Math.max(0,pl[i]/pm[i]);pp[i*3]+=pv[i*3]*dt;pp[i*3+1]+=pv[i*3+1]*dt;pp[i*3+2]+=pv[i*3+2]*dt;pv[i*3+1]-=9*dt;if(pp[i*3+1]<.05){pp[i*3+1]=.05;pv[i*3+1]*=-.3}
  pcl[i*3]=pb[i*3]*f;pcl[i*3+1]=pb[i*3+1]*f;pcl[i*3+2]=pb[i*3+2]*f;if(pl[i]<=0)pp[i*3+1]=1e5}
 pg.attributes.position.needsUpdate=pg.attributes.color.needsUpdate=true;
 shk*=Math.exp(-8*dt);fovp*=Math.exp(-7*dt);const ax=-Math.sin(P.a),az=-Math.cos(P.a);
 const tx=P.x+ax*2.5,tz=P.z+az*2.5;cp.x+=(tx-cp.x)*Math.min(1,6*dt);cp.z+=(tz+9-cp.z)*Math.min(1,6*dt);
 const SK=shk*Save.d.shake;cam.position.set(cp.x+rn(-1,1)*SK,20+rn(-1,1)*SK,cp.z+rn(-1,1)*SK);cam.lookAt(cp.x,0,cp.z-9);cam.fov=50+fovp+P.rec*1.5;cam.updateProjectionMatrix();cam.updateMatrixWorld();
 fxA*=Math.exp(-6*dt);fx.style.opacity=fxA;hmT-=dt;$('hm').style.opacity=hmT>0?1:0;
 if(gs==='play'){$('hp').firstElementChild.style.width=Math.max(0,P.hp)+'%';$('am').textContent=P.ammo+'/24';let mk=0;for(const c of CH)if(c.on&&c!==P)mk=Math.max(mk,c.kills);$('sc').textContent=P.kills+'  ×  '+mk;
  $('st').textContent=!P.alive?'ABATIDO':P.rel>0?'RECARREGANDO':'';$('cur').style.borderColor=P.rel>0?'#888':'#ff3b4e'}
 ren.render(sc,cam)}
requestAnimationFrame(frame);
