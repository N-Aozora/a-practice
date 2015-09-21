var height=document.documentElement.clientHeight||document.body.clientHeight,
    leftFloorNavs=document.getElementById("left-floor-navs"),
    leftFloorNavsList=leftFloorNavs.getElementsByTagName("a"),	  //左侧悬浮楼层导航集合
    floorList=getByClass("main-content","floor-item"),	//所有的楼层对象集合
    menuNavList=document.getElementById("side-navs").getElementsByTagName("li"),	//所有菜单导航对象集合
    moreNavItem=getByClass("navs-menu","navs-menu-item");	//所有2级菜单集合
    floorListHeight=[];	//储存所有楼层距文档最顶部的距离

getFloorsTopHeight();
leftFloorNavsEvent();
menuNavEvent();
document.onscroll=floorScollEvent;

//从一个父元素获取相应类名的子元素集合
function getByClass(parentId,cls){
	var parent=document.getElementById(parentId);
	var childs=parent.childNodes;
	var oDivs=[];
	for(var i in childs){
		if(childs[i].className==undefined) continue;
		var arr=childs[i].className.split(" ");
		for(var j in arr){
			if(arr[j]==cls) oDivs.push(childs[i]);
		}
	}
	return oDivs;
}

//判断一个元素是否是另一个元素的父元素
function isParentNode(childNode,parentNode){
	while(childNode&&childNode.tagName.toLowerCase()!="body"){
		if(childNode.parentNode==parentNode){
			return true;
		}else{
			childNode=childNode.parentNode;
		}
	}
	return false;
}

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

//商品分类导航事件
function menuNavEvent(){
	var timer;
	for(var i=0,n=menuNavList.length;i<n;i++){
		menuNavList[i].setAttribute("data-index",i);
		moreNavItem[i].setAttribute("data-index",i);

		menuNavList[i].onmouseover=function(e){
			var e=e||window.event;
			if(e.relatedTarget==this||isParentNode(e.relatedTarget,this)
				||e.relatedTarget.getAttribute("data-index")==this.getAttribute("data-index")){
				return;
			} 
			clearInterval(timer);
			for(var j=0;j<n;j++){
				if(/now/.test(menuNavList[j].className)){
					menuNavList[j].className=menuNavList[j].className.replace(/\s*now/,"");
				}
				if(/hover/.test(moreNavItem[j].className)&&j!=0){
					moreNavItem[j].className=moreNavItem[j].className.replace(/\s*hover/g,"");
					moreNavItem[j].style.left="-10px";
					moreNavItem[j].style.opacity=0.8;
				}
			}
			var i=this.getAttribute("data-index");
			moreNavItem[0].className=moreNavItem[0].className.replace(/\s*hover/g,"");
			if(i==0){
				moreNavItem[0].className+=" hover";
			}
			this.className+=" now hover";
			moreNavItem[i].className+=" hover";
			if(i!=0){
				timer=setInterval(function(){
					console.log(1)
					if(moreNavItem[i].style.left=="0px"){
						clearInterval(timer);
						return;
					}
					if(getComputedStyle(moreNavItem[i],false).display=="none"){
						moreNavItem[i].style.display="block";
					}
					moreNavItem[i].style.left=parseInt(getComputedStyle(moreNavItem[i],false).left)+2+"px";
					moreNavItem[i].style.opacity=parseFloat(getComputedStyle(moreNavItem[i],false).opacity)+0.03;
				},50)
			}
		}
		
		menuNavList[i].onmouseout=function(e){
			var e=e||window.event;
			if(e.relatedTarget==this||isParentNode(e.relatedTarget,this)) return;
			this.className=this.className.replace(/\s*hover/,"");
			var i=this.getAttribute("data-index");
			if(i==0){
				moreNavItem[0].className=moreNavItem[0].className.replace(/\s*hover/,"");
			}
			if(i!=0&&!isParentNode(e.relatedTarget,document.getElementById("navs-menu"))){
				clearInterval(timer);
				timer=setInterval(function(){

					if(moreNavItem[i].style.left=="-10px"){
						moreNavItem[i].className=moreNavItem[i].className.replace(/\s*hover/,"");
						clearInterval(timer);
						return;
					}
					moreNavItem[i].style.left=parseInt(getComputedStyle(moreNavItem[i],false).left)-2+"px";
					moreNavItem[i].style.opacity=parseFloat(getComputedStyle(moreNavItem[i],false).opacity)-0.03;
				},50)
			}
		}

		moreNavItem[i].onmouseover=function(e){
			var e=e||window.event;
			if(e.relatedTarget==this||isParentNode(e.relatedTarget,this)) return;
			menuNavList[this.getAttribute("data-index")].className+=" hover";
		}

		moreNavItem[i].onmouseout=function(e){
			var e=e||window.event;
			if(e.relatedTarget==this||isParentNode(e.relatedTarget,this)
				||e.relatedTarget.getAttribute("data-index")==this.getAttribute("data-index")){
				return;
			} 
			var i=this.getAttribute("data-index");
			menuNavList[i].className=menuNavList[i].className.replace(/\s*hover/,"");
			if(i!=0&&!isParentNode(e.relatedTarget,document.getElementById("navs-menu"))){
				timer=setInterval(function(){
					if(moreNavItem[i].style.left=="-10px"){
						moreNavItem[i].className=moreNavItem[i].className.replace(/\s*hover/,"");
						clearInterval(timer);
						return;
					}
					moreNavItem[i].style.left=parseInt(getComputedStyle(moreNavItem[i],false).left)-2+"px";
					moreNavItem[i].style.opacity=parseFloat(getComputedStyle(moreNavItem[i],false).opacity)-0.03;
				},50)
			}
		}
	}
}




