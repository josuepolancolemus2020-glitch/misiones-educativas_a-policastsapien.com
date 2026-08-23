/* ============================================================
   M.E.T.A.S · Un Three.js de mentira, para las sondas
   ------------------------------------------------------------
   Los juegos 3D bajan Three.js de un CDN. Una sonda que dependiera
   de eso no correría sin internet —que es la mitad de las veces— y
   además necesitaría tarjeta gráfica de verdad para el WebGL.

   Esto pone en `window.THREE` lo justo para que la LÓGICA de los
   juegos corra: escenas, mallas, materiales y cámaras que no
   dibujan nada. Con eso se comprueban las cuentas, los niveles y
   los avisos, que es lo que puede enseñarle algo mal a un alumno.

   Lo que NO comprueba —y conviene no olvidarlo— es que la pantalla
   se vea bien. Eso hay que mirarlo con los ojos, una vez, en el
   teléfono.

   Los juegos lo permiten porque arrancan preguntando
   `if (window.THREE) return listo()`: si la pieza ya está puesta,
   no bajan nada. Esa línea es la que hace posible esta sonda, y de
   paso la que permitiría mañana guardar una copia de Three.js
   dentro del sitio sin tocar ni un juego.
   ============================================================ */
module.exports = `
(function(){
  function V3(x,y,z){ this.x=x||0; this.y=y||0; this.z=z||0; }
  V3.prototype.set=function(x,y,z){ this.x=x;this.y=y;this.z=z; return this; };
  V3.prototype.copy=function(v){ this.x=v.x;this.y=v.y;this.z=v.z; return this; };
  V3.prototype.clone=function(){ return new V3(this.x,this.y,this.z); };
  V3.prototype.project=function(){ return this; };
  V3.prototype.add=function(v){ this.x+=v.x;this.y+=v.y;this.z+=v.z; return this; };
  V3.prototype.distanceTo=function(v){ var a=this.x-v.x,b=this.y-v.y,c=this.z-v.z; return Math.sqrt(a*a+b*b+c*c); };
  function V2(x,y){ this.x=x||0; this.y=y||0; }
  function Col(h){ this.hex=h||0; }
  Col.prototype.setHex=function(h){ this.hex=h; return this; };
  function Obj(){ this.position=new V3(); this.rotation=new V3(); this.scale=new V3(1,1,1);
    this.children=[]; this.userData={}; this.visible=true; this.material=null; this.geometry=null; }
  Obj.prototype.add=function(o){ this.children.push(o); return this; };
  Obj.prototype.remove=function(o){ var i=this.children.indexOf(o); if(i>=0) this.children.splice(i,1); return this; };
  Obj.prototype.lookAt=function(){ return this; };
  Obj.prototype.localToWorld=function(v){ return v; };
  Obj.prototype.translateX=function(){ return this; };
  Obj.prototype.translateY=function(){ return this; };
  Obj.prototype.translateZ=function(){ return this; };
  Obj.prototype.rotateX=function(){ return this; };
  Obj.prototype.rotateY=function(){ return this; };
  Obj.prototype.rotateZ=function(){ return this; };
  Obj.prototype.clone=function(){ var o=new Obj(); o.material=this.material; o.geometry=this.geometry; return o; };
  function Geo(){ this.attributes={}; }
  Geo.prototype.dispose=function(){};
  Geo.prototype.setFromPoints=function(){ return this; };
  Geo.prototype.setAttribute=function(n,a){ this.attributes[n]=a; return this; };
  Geo.prototype.computeVertexNormals=function(){ return this; };
  Geo.prototype.computeBoundingBox=function(){ return this; };
  function Mat(p){ p=p||{}; for(var k in p) this[k]=p[k]; this.color=new Col(p.color); }
  function hijo(cls){ var f=function(g,m){ Obj.call(this); this.geometry=g||new Geo(); this.material=m||new Mat(); };
    f.prototype=Object.create(Obj.prototype); return f; }
  function luz(){ var f=function(){ Obj.call(this); }; f.prototype=Object.create(Obj.prototype); return f; }
  var T = {
    Scene: (function(){ var f=function(){ Obj.call(this); this.fog=null; }; f.prototype=Object.create(Obj.prototype); return f; })(),
    Group: (function(){ var f=function(){ Obj.call(this); }; f.prototype=Object.create(Obj.prototype); return f; })(),
    Mesh: hijo(), Line: hijo(), LineSegments: hijo(), Points: hijo(),
    PerspectiveCamera: (function(){ var f=function(fov,as){ Obj.call(this); this.aspect=as;
      this.updateProjectionMatrix=function(){}; }; f.prototype=Object.create(Obj.prototype); return f; })(),
    GridHelper: (function(){ var f=function(){ Obj.call(this); }; f.prototype=Object.create(Obj.prototype); return f; })(),
    AmbientLight: luz(), DirectionalLight: luz(), PointLight: luz(),
    WebGLRenderer: function(){ this.domElement=document.createElement('canvas');
      this.setSize=function(){}; this.setPixelRatio=function(){}; this.render=function(){}; },
    Raycaster: function(){ this.setFromCamera=function(){};
      this.intersectObjects=function(){ return []; }; this.intersectObject=function(){ return []; }; },
    Fog: function(){}, Shape: function(){ this.moveTo=function(){}; this.lineTo=function(){}; this.closePath=function(){}; },
    Vector2: V2, Vector3: V3, Color: Col, DoubleSide: 2,
    BufferAttribute: function(a,n){ this.array=a; this.itemSize=n; this.needsUpdate=false; },
    BufferGeometry: Geo, BoxGeometry: Geo, PlaneGeometry: Geo, CircleGeometry: Geo, ConeGeometry: Geo,
    CylinderGeometry: Geo, SphereGeometry: Geo, EdgesGeometry: Geo, ShapeGeometry: Geo, RingGeometry: Geo,
    TorusGeometry: Geo, LatheGeometry: Geo,
    MeshBasicMaterial: Mat, MeshLambertMaterial: Mat, MeshPhongMaterial: Mat, MeshStandardMaterial: Mat,
    LineBasicMaterial: Mat, PointsMaterial: Mat
  };
  window.THREE = T;
  window.__ESTUB = true;
})();
`;
