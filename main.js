var height=document.documentElement.clientHeight||document.body.clientHeight;
var leftFloorNavs=document.getElementById("left-floor-navs");

document.onscroll=function(){
	var scrollHeight=document.documentElement.scrollTop||document.body.scrollTop;
	if(scrollHeight>height){
		leftFloorNavs.style.display="block";
		leftFloorNavs.style.opacity="1";
	}else if(scrollHeight<height){
		leftFloorNavs.style.display="none";
		leftFloorNavs.style.opacity="0";
	}
}