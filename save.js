const Save={d:null,def:{coins:0,name:'Jogador',vol:.8,sfx:1,mus:.5,q:1,shake:1},
load(){let o={};try{o=JSON.parse(localStorage.getItem('apagao_v2')||'{}')}catch(e){}this.d=Object.assign({},this.def,o);this.d.own=Object.assign({s:[0],l:[0],g:[0]},o.own||{});this.d.eq=Object.assign({s:0,l:0,g:0},o.eq||{})},
save(){try{localStorage.setItem('apagao_v2',JSON.stringify(this.d))}catch(e){}}};
Save.load();
const CAT={s:[['Cobalto',0x3f7fb5,0],['Terracota',0xc8553d,150],['Mostarda',0xd9a23a,150],['Oliva',0x7f9a45,200],['Ameixa',0x8a5a8f,250],['Marfim',0xe3d7bc,300]],
l:[['Vermelho',0xd0302f,0],['Musgo',0x5fa05a,120],['Tinta',0x3f6fd0,120],['Âmbar',0xe8902a,180]],
g:[['Quente',0xfff0cc,0],['Fria',0xd2e6ff,100],['Âmbar',0xffd08a,100],['Verde',0xdcffd2,150]]};
