"use strict";

console.log("FullWindowCanvas.js_is_loaded!");

class FullWindowCanvas{
  constructor(_set){
    console.log("Make_FullWindowCanvas_instance.");
    /* 設定を取得する. */
    this.set = JSON.parse(JSON.stringify(_set));
    /* キャンバス・2dコンテキスト・大きさを調整するための親要素を格納する */
    this.elm = {};
    this.rate = undefined;
    this.con = undefined;

    this.init();
    this.resize();
    window.addEventListener("resize", ()=>{ this.resize(); }, false);
  };


/* 初期化関数など ############################################################ */


  init(){
    this.variable_set();
    this.scroll_and_contextmenu_off();
    this.make_element();
    this.set_style();
  };

  variable_set(){
    if(this.set.width==undefined){
      this.set.width=1920;
    };
    if(this.set.height==undefined){
      this.set.height=1080;
    };
    if(this.set.quality==undefined){
      this.set.quality=1;
    };
  };

  scroll_and_contextmenu_off(){
    this.add_style("*{ margin: 0; padding: 0; }");
    document.oncontextmenu=()=>{return false;};
    document.addEventListener('touchmove', function(e){e.preventDefault();}, { passive: false });
    document.addEventListener('mousewheel', function(e){e.preventDefault();}, { passive: false });
  };

  make_element(){
    this.elm.par = document.createElement("div");
    this.elm.par.id = "FullWindowCanvasJS_create_thisPar_" + String(Math.floor(performance.now()));
    document.body.appendChild(this.elm.par);
    this.elm.can = document.createElement("canvas");
    if(this.set.id==undefined){
      this.elm.can.id = "FullWindowCanvasJS_create_thisCanvas_" + String(Math.floor(performance.now()));
    }else{
      this.elm.can.id = this.set.id;
    };
    document.body.appendChild(this.elm.can);
    this.con = this.elm.can.getContext("2d");
  };

  set_style(){
    this.add_style(`
    #${this.elm.par.id}{
        position: fixed;
        width: 100%;
        height: 100%;
    }
    #${this.elm.can.id}{
        display: block;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
    }`);
  };

  add_style(_text){
    const styleSheet = document.createElement("style");
    styleSheet.innerText = _text;
    document.head.appendChild(styleSheet);
  };


/* リサイズの関数など ######################################################## */


  resize(){
    this.set_canvas_style_size();
    this.set_canvas_raw_size();
    this.set_rate();
  };

  set_canvas_style_size(){
    const offset_width = Math.floor(Math.min(
      this.elm.par.offsetWidth,
      this.elm.par.offsetHeight * this.set.width / this.set.height
    ));
    const offset_height = Math.floor(offset_width * this.set.height / this.set.width);
    this.elm.can.style.width = offset_width + "px";
    this.elm.can.style.height = offset_height + "px";
  };

  set_canvas_raw_size(){
    const offset_width = Math.floor(Math.min(
      this.elm.par.offsetWidth,
      this.elm.par.offsetHeight * this.set.width / this.set.height
    ));
    const offset_height = Math.floor(offset_width * this.set.height / this.set.width);
    this.elm.can.width = offset_width * this.set.quality;
    this.elm.can.height = offset_height * this.set.quality;
  };

  set_rate(){
    this.clientWidth = Number(String(this.elm.can.style.width).slice(0, -2));
    this.clientHeight = Number(String(this.elm.can.style.height).slice(0, -2));
    this.rate = this.elm.can.width / this.set.width;
  };


/* プロパティ取得など ######################################################## */


  /* 画面上のキャンバスのサイズ */
  get offsetWidth(){ return this.clientWidth; };
  get offsetHeight(){ return this.clientHeight; };
  /* 描画上のキャンバスのサイズ */
  get drawWidth(){ return this.elm.can.width; };
  get drawHeight(){ return this.elm.can.height; };
  /* 仮想上の座標から実際の描画上のサイズに変換するためのレート */
  get getRate(){ return this.rate; };


/* 描画関数など ############################################################# */


  /* 描画関数の定義 */
  set fillStyle(_color){ this.con.fillStyle = _color; };
  set strokeStyle(_color){ this.con.strokeStyle = _color; };
  set globalAlpha(_num){ this.con.globalAlpha = _num; };

  set lineWidth(_num){ this.con.lineWidth = _num * this.rate; };
  set lineCap(_str){ this.con.lineCap = _str; };
  set lineJoin(_str){ this.con.lineJoin = _str; };
  set miterLimit(_num){ this.con.miterLimit = _num * this.rate; };

  set font(_str){
    const g = this.con; g.font = _str;
    const pixel = g.font.split(/\s/)[0].slice(0, -2);
    const name = g.font.split(/\s/)[1];
    g.font = `${ pixel * this.rate }px ${ name }`;
  };
  set smooth(_bool){ this.con.imageSmoothingEnabled = _bool; };
  set smoothQuality(_bool){ this.con.imageSmoothingQuality = _bool; };
  setProperty(_name, _obj){ this.con[_name] = JSON.parse(JSON.stringify(_obj)); };

  fillRect(_x, _y, _w, _h){
    const r = this.rate;
    this.con.fillRect(_x * r, _y * r, _w * r, _h * r);
  };
  fillRectCenter(_x, _y, _w, _h){
    const r = this.rate;
    this.con.fillRect((_x - _w/2)*r, (_y - _h/2)*r, _w*r, _h*r);
  };
  strokeRect(_x, _y, _w, _h){
    const r = this.rate;
    this.con.strokeRect(_x * r, _y * r, _w * r, _h * r);
  };
  strokeRectCenter(_x, _y, _w, _h){
    const r = this.rate;
    this.con.strokeRect((_x - _w/2)*r, (_y - _h/2)*r, _w*r, _h*r);
  };
  clearRect(_x, _y, _w, _h){
    const r = this.rate;
    this.clearRect(_x*r, _y*r, _w*r, _h*r);
  };
  fillAll(_color){
    if(_color==undefined){
      this.con.fillRect(0, 0, this.elm.can.width, this.elm.can.height);
      return
    };
    this.con.fillStyle = _color;
    this.con.fillRect(0, 0, this.elm.can.width, this.elm.can.height);
  };
  clearAll(){
    this.transReset();
    this.con.clearRect(0, 0, this.elm.can.width, this.elm.can.height);
  };
  fillArc(_x, _y, _r, start=0, end=1){
    const g = this.con; const ra = this.rate;
    g.beginPath(); g.arc(_x*ra, _y*ra, _r*ra, Math.PI*2*start, Math.PI*2*end, false);
    g.closePath(); g.fill();
  };
  strokeArc(_x, _y, _r, start=0, end=1){
    const g = this.con; const ra = this.rate;
    g.beginPath(); g.arc(_x*ra, _y*ra, _r*ra, Math.PI*2*start, Math.PI*2*end, false);
    g.closePath(); g.stroke();
  };
  fillPath(_points){
    if(_points.length<3){ console.error(`length of points is short.`); return `fail...`; };
    const g = this.con; const r = this.rate;
    g.beginPath(); g.moveTo(_points[0][0] * r, _points[0][1] * r);
    for(let i=1;i<_points.length;i++){ g.lineTo(_points[i][0] * r, _points[i][1] * r ); };
    g.closePath(); g.fill();
  };
  strokePath(_points, _bool=false){
    if(_points.length<3){ console.error(`length of points is short.`); return `fail...`; };
    const g = this.con; const r = this.rate;
    g.beginPath(); g.moveTo(_points[0][0] * r, _points[0][1] * r);
    for(let i=1;i<_points.length;i++){ g.lineTo(_points[i][0] * r, _points[i][1] * r ); };
    if(_bool==true){ g.closePath(); };
    g.stroke();
  };

  /* 処理系関数 translate など */
  translate(_x, _y){
    this.con.translate(_x*this.rate, _y*this.rate);
  };
  rotate(_rad){ this.con.rotate(_rad); };
  scale(_x, _y){ this.con.scale(_x, _y); };
  transReset(){ this.con.setTransform(1, 0, 0, 1, 0, 0); };


/* イベントリスナーなど ###################################################### */


  modifyClick(_e, _func){
    const result = {};
    for(const key in _e){ result[key] = _e[key]; };
    const offset = this.elm.can.getBoundingClientRect();
    const pageBasedWrate = this.set.width / this.clientWidth;
    const pageBasedHrate = this.set.height / this.clientHeight;
    result.offsetX = (result.pageX - offset.left) * pageBasedWrate;
    result.offsetY = (result.pageY - offset.top) * pageBasedHrate;
    _func(result);
  };

  modifyTouch(_e, _func){
    const result = {};
    for(const key in _e){ result[key] = _e[key]; };
    this.setOffset(result.touches);
    this.setOffset(result.changedTouches);
    this.setOffset(result.targetTouches);
    _func(result);
  };

  setOffset(_objList){
    const offset=this.elm.can.getBoundingClientRect();
    const pageBasedWrate = this.set.width / this.clientWidth;
    const pageBasedHrate = this.set.height / this.clientHeight;
    for(let i=0;i<_objList.length;i++){
      _objList[i].offsetX = (_objList[i].pageX - offset.left) * pageBasedWrate;
      _objList[i].offsetY = (_objList[i].pageY - offset.top) * pageBasedHrate;
    };
  };

  addEventListener(_name, _func, _bool){
    if(_name=="click"){
      this.elm.can.addEventListener("click", (e)=>{
        e.preventDefault();
        this.modifyClick(e, _func);
      }, _bool);
    }else{
      this.elm.can.addEventListener(_name, (e)=>{
        e.preventDefault();
        this.modifyTouch(e, _func);
      }, _bool);
    };
  };
};

const print=(_elm)=>{ console.log(_elm); };
