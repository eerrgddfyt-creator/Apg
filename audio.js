/* Sons macios: só ondas suaves, filtros passa-baixa e ataque lento. */
const Snd={c:null,pd:null,
init(){if(this.c){if(this.c.state==='suspended')this.c.resume();return}try{const c=this.c=new(window.AudioContext||window.webkitAudioContext)();this.mg=c.createGain();this.sg=c.createGain();this.mu=c.createGain();this.sg.connect(this.mg);this.mu.connect(this.mg);this.mg.connect(c.destination);
const n=c.createBuffer(1,c.sampleRate,c.sampleRate),d=n.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=l*.92+(Math.random()*2-1)*.08;d[i]=l*3}this.nb=n;this.vol()}catch(e){}},
vol(){if(!this.c)return;const s=Save.d;this.mg.gain.value=s.vol;this.sg.gain.value=s.sfx;this.mu.gain.value=s.mus*.6},
music(on){const c=this.c;if(!c)return;
if(on&&!this.pd){const g=c.createGain(),lp=c.createBiquadFilter();lp.frequency.value=520;g.gain.value=0;g.gain.linearRampToValueAtTime(.5,c.currentTime+2.5);lp.connect(g);g.connect(this.mu);this.os=[110,165,220.5].map(f=>{const o=c.createOscillator();o.frequency.value=f;o.connect(lp);o.start();return o});this.pd=g;
this.bt=setInterval(()=>{const n=[261.6,293.7,329.6,392,440][Math.random()*5|0];tone(n,n*.99,1.6,'triangle',.18,this.mu)},3200)}
else if(!on&&this.pd){const g=this.pd,os=this.os;g.gain.linearRampToValueAtTime(0,c.currentTime+1);setTimeout(()=>os.forEach(o=>o.stop()),1100);clearInterval(this.bt);this.pd=null}}};
function audio(){Snd.init()}
function tone(f1,f2,d,ty,v,dst){const s=Snd;if(!s.c)return;const c=s.c,t=c.currentTime,o=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();
o.type=ty==='triangle'?'triangle':'sine';lp.frequency.value=1500;f1=Math.min(f1,880);f2=Math.max(30,Math.min(f2,880));
o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*.5,t+.015);g.gain.exponentialRampToValueAtTime(.0008,t+d);
o.connect(lp);lp.connect(g);g.connect(dst||s.sg);o.start(t);o.stop(t+d+.05)}
function noise(v,f,d){const s=Snd;if(!s.c)return;const c=s.c,t=c.currentTime,b=c.createBufferSource(),lp=c.createBiquadFilter(),g=c.createGain();
b.buffer=s.nb;lp.type='lowpass';lp.frequency.value=Math.min(f,700);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v*.6,t+.012);g.gain.exponentialRampToValueAtTime(.0008,t+d);
b.connect(lp);lp.connect(g);g.connect(s.sg);b.start(t);b.stop(t+d)}
const shotS=v=>{noise(v*.7,600,.14);tone(140,55,.16,'sine',v*.9)},thud=v=>{noise(v*.5,260,.3);tone(80,45,.3,'sine',v*.9)};
