/* Online ponto a ponto (WebRTC via PeerJS): o código da sala é o ID do anfitrião. */
const Net={p:null,cs:[],c:null,code:'',role:'',h:{},
mkCode(){const a='ABCDEFGHJKMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<5;i++)s+=a[Math.random()*a.length|0];return s},
host(ok,err,n){if(!window.Peer){err('Sem conexão com o servidor de salas');return}const code=this.mkCode(),p=this.p=new Peer('apagao-'+code);
p.on('open',()=>{this.code=code;this.role='host';ok()});
p.on('error',e=>{if(e.type==='unavailable-id'&&(n||0)<5){this.close();this.host(ok,err,(n||0)+1)}else{this.close();err('Falha ao criar a sala')}});
p.on('connection',c=>{c.on('open',()=>this.cs.push(c));c.on('data',m=>this.h.msg&&this.h.msg(c,m));c.on('close',()=>{this.cs=this.cs.filter(x=>x!==c);this.h.leave&&this.h.leave(c)})})},
join(code,ok,err){if(!window.Peer){err('Sem conexão com o servidor de salas');return}code=code.toUpperCase();const p=this.p=new Peer();let done=0;const fail=m=>{if(!done){done=1;this.close();err(m)}};
p.on('open',()=>{const c=this.c=p.connect('apagao-'+code,{reliable:true});const to=setTimeout(()=>fail('Sala não encontrada'),9000);
c.on('open',()=>{clearTimeout(to);done=1;this.role='client';this.code=code;ok()});c.on('data',m=>this.h.msg&&this.h.msg(c,m));c.on('close',()=>{if(done)this.h.leave&&this.h.leave(c)})});
p.on('error',()=>fail('Sala não encontrada'))},
send(m){if(this.role==='client'&&this.c&&this.c.open)this.c.send(m)},
all(m){for(const c of this.cs)if(c.open)c.send(m)},
close(){try{this.p&&this.p.destroy()}catch(e){}this.p=null;this.cs=[];this.c=null;this.role=''}};
