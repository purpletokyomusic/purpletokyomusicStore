let amt=3,curIdx=-1,playing=false,curTrack='',curProj='';

// Year filter buttons
document.querySelectorAll('.fb').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.fb').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const f=b.dataset.filter;
    document.querySelectorAll('.project-block').forEach(bl=>{
      bl.style.display=(f==='all'||bl.dataset.year===f||(f==='older'&&bl.dataset.year==='older'))?'':'none';
    });
  });
});

// Click a track row to play
document.querySelectorAll('.track').forEach(t=>{
  t.addEventListener('click',e=>{
    if(e.target.classList.contains('gbtn')) return;
    play(parseInt(t.dataset.track),t.dataset.name,t.dataset.project,t);
  });
});

function play(idx,name,proj,el){
  document.querySelectorAll('.track').forEach(t=>t.classList.remove('playing'));
  if(curIdx===idx&&playing){playing=false;ppbtn('&#9654;');paused();return;}
  if(el) el.classList.add('playing');
  curIdx=idx;playing=true;
  document.getElementById('pname').textContent=name;
  document.getElementById('pproj').textContent=proj;
  ppbtn('&#9646;&#9646;');
  document.getElementById('pbar').classList.add('on');
  document.getElementById('pdot').style.animationPlayState='running';
  document.getElementById('pbuy').onclick=()=>openModal(name,proj,null);
  curTrack=name;curProj=proj;
}
function togPlay(){playing=!playing;ppbtn(playing?'&#9646;&#9646;':'&#9654;');if(playing)document.getElementById('pdot').style.animationPlayState='running';else paused();}
function paused(){document.getElementById('pdot').style.animationPlayState='paused';}
function ppbtn(h){document.getElementById('ppbtn').innerHTML=h;}
function prevT(){const t=document.querySelectorAll('.track');const i=Math.max(0,curIdx-1);play(i,t[i].dataset.name,t[i].dataset.project,t[i]);}
function nextT(){const t=document.querySelectorAll('.track');const i=Math.min(t.length-1,curIdx+1);play(i,t[i].dataset.name,t[i].dataset.project,t[i]);}

function openModal(name,proj,e){
  if(e) e.stopPropagation();
  curTrack=name;curProj=proj;
  document.getElementById('mname').textContent=name;
  document.getElementById('mproj').textContent=proj;
  document.getElementById('overlay').classList.add('open');
  setAmt(3);document.getElementById('cinp').value='';
}
function closeM(){document.getElementById('overlay').classList.remove('open');}
function closeOut(e){if(e.target===document.getElementById('overlay'))closeM();}
function setAmt(v){
  amt=v;
  document.querySelectorAll('.ab').forEach(b=>b.classList.toggle('sel',parseInt(b.textContent.replace('$',''))===v));
  document.getElementById('plbl').textContent='$'+v;
  document.getElementById('cinp').value='';
}
function custIn(){
  const v=parseFloat(document.getElementById('cinp').value);
  if(!isNaN(v)&&v>=0){amt=v;document.querySelectorAll('.ab').forEach(b=>b.classList.remove('sel'));document.getElementById('plbl').textContent='$'+v.toFixed(2);}
}
function doPay(){closeM();toast('&#10003; Downloading &#8212; thank you for $'+amt+'!');}
function doFree(){closeM();toast('&#10003; Downloading "'+curTrack+'" &#8212; enjoy.');}
function toast(msg){
  const t=document.getElementById('toast');
  t.innerHTML=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3200);
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeM();});