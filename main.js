var height=document.documentElement.clientHeight||document.body.clientHeight,
    leftFloorNavs=document.getElementById("left-floor-navs"),
    leftFloorNavsList=leftFloorNavs.getElementsByTagName("a"),	  //左侧悬浮楼层导航集合
    floorList=document.getElementsByClassName("floor-item"),	//所有的楼层对象集合
    floorListHeight=[];	//储存所有楼层距文档最顶部的距离

getFloorsTopHeight();
leftFloorNavsEvent();
document.onscroll=floorScollEvent;

//获得所有楼层距离顶部的距离
function getFloorsTopHeight(){
	for(var i=0,n=floorList.length;i<n;i++){
		floorListHeight[i]=floorList[i].offsetTop+floorList[i].offsetHeight/2;
	}
}

//页面滚动左侧楼层导航响应事件
function floorScollEvent(){
	var timer;
	var scrollHeight=document.documentElement.scrollTop||document.body.scrollTop;
	if(scrollHeight>height&&getComputedStyle(leftFloorNavs,false).display=="none"){
		leftFloorNavs.style.display="block";
		leftFloorNavs.style.opacity=0;
		timer=setInterval(function(){
			leftFloorNavs.style.opacity=parseFloat(leftFloorNavs.style.opacity)+0.1;
			if(leftFloorNavs.style.opacity>=1){
				clearInterval(timer);
			}
		},100)
	}else if(scrollHeight<height&&getComputedStyle(leftFloorNavs,false).display!="none"){
		clearInterval(timer);
		timer=setInterval(function(){
			leftFloorNavs.style.opacity=parseFloat(leftFloorNavs.style.opacity)-0.1;
			if(leftFloorNavs.style.opacity<=0){
				clearInterval(timer);
				leftFloorNavs.style.display="none";
			}
		},100)
	}
	readychange(scrollHeight);
}

//左侧悬浮楼层导航相关事件
function leftFloorNavsEvent(){
	var timer;
	for(var i=0;i<leftFloorNavsList.length;i++){
		leftFloorNavsList[i].setAttribute("data-index",i+1);
		leftFloorNavsList[i].onclick=function(){
			clearInterval(timer);
			var index=this.getAttribute("data-index")-1; 
			var goalTop=floorListHeight[index]-floorList[index].offsetHeight/2; //目标滚动高度
			timer=setInterval(function(){
				var nowTop=document.documentElement.scrollTop; //现在的滚动高度
				var _h=Math.floor((goalTop-nowTop)/2);
				_h=(Math.abs(goalTop-nowTop)<5)?(goalTop-nowTop):_h;
				document.documentElement.scrollTop=nowTop+_h;
				if(nowTop-goalTop==0){
					clearInterval(timer);
				}
			},50)										
		}

		leftFloorNavsList[i].onmouseover=function(){
			if(/now/.test(this.className)){
				this.className+=" hover";
				return;
			} 
			var value=this.getAttribute("data-value");
			if(value.length>2){
				this.className="two-line";
			}
			this.className+=" hover";
			this.innerHTML=value;
		}

		leftFloorNavsList[i].onmouseout=function(){
			if(/now/.test(this.className)){
				this.className=this.className.replace(/\s*hover\s*/,"");
				return;
			} 
			this.removeAttribute("class");
			this.innerHTML=this.getAttribute("data-index")+"F";
		}
	}
}

//滚动时检测条件
function readychange(h){
	var firstFloorNav=leftFloorNavsList[0]; //取得第一个楼层导航
	var lastFloorNav=leftFloorNavsList[leftFloorNavsList.length-1]; //取得最后一个楼层导航
	if(h+height<floorListHeight[0]){
		firstFloorNav.innerHTML=firstFloorNav.getAttribute("data-index")+"F";
		firstFloorNav.removeAttribute("class");
	}else if(h+height>floorListHeight[floorListHeight.length-1]){
		lastFloorNav.innerHTML=lastFloorNav.getAttribute("data-index")+"F";
		lastFloorNav.removeAttribute("class");
	}else{
		for(var i=0;i<floorListHeight.length-1;i++){
			if(h+height>=floorListHeight[i]&&h+height<floorListHeight[i+1]){
				changeLeftNavs(i);
			}
		}
	}
}

//滚动达到条件时改变样式
function changeLeftNavs(n){
	var oA=leftFloorNavsList[n];
	for(var i=0;i<leftFloorNavsList.length;i++){
		if(/now/.test(leftFloorNavsList[i].className)&&!/hover/.test(leftFloorNavsList[i].className)){
			leftFloorNavsList[i].innerHTML=leftFloorNavsList[i].getAttribute("data-index")+"F";
			leftFloorNavsList[i].removeAttribute("class");
		}else if(/now/.test(leftFloorNavsList[i].className)&&/hover/.test(leftFloorNavsList[i].className)){
			leftFloorNavsList[i].className=leftFloorNavsList[i].className.replace(/\s*now\s*/,"");
		}
	}
	if(leftFloorNavsList[n].getAttribute("data-value").length>2){
		oA.className+=" two-line";
	}
	oA.innerHTML=oA.getAttribute("data-value");
	oA.className+=" now";
}
