"use strict";

const ini={
  id: "myCanvas",
  width: 2560,
  height: 1080,
  quality: 0.3
};
const hwc=new FullWindowCanvas(ini);
const points=[];
hwc.addEventListener("click", (e)=>{
  console.log(e);
  points.push({x:e.offsetX, y:e.offsetY, color:"black"});
}, false);

const loop=()=>{



  
  hwc.fillAll("blue");
  for(let i=0;i<points.length;i++){
    hwc.fillStyle=points[i].color;
    hwc.fillArc(points[i].x, points[i].y, 1080/2);
  };
  // console.log(points);





requestAnimationFrame(()=>{ loop(); });





};

requestAnimationFrame(()=>{ loop(); });
