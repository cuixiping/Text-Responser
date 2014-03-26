(function(){

var patterns;
var match;

/** 遍历每个元素 */
function loopEvery(obj,fn,ctx,arg){
	if(obj instanceof Array){
		for(var i=0,n=obj.length;i<n;i++){
			ctx ? fn.call(ctx,obj[i],i,arg) : fn(obj[i],i,arg);
		}
	}else if(obj instanceof Object){
		for(var k in obj){
			if(obj.hasOwnProperty(k)){
				ctx ? fn.call(ctx,k,obj[k],arg) : fn(k,obj[k],arg);
			}
		}
	}
}

/** 遍历到返回值为true时停止遍历并返回true，否则遍历结束后返回false */
function loopUntil(obj,fn,ctx,arg){
	//var hasArg = arguments.length>3;
	if(obj instanceof Array){
		for(var i=0,n=obj.length;i<n;i++){
			if((ctx ? fn.call(ctx,obj[i],i,arg) : fn(obj[i],i,arg))===true){
				return true;
			}
		}
	}else if(obj instanceof Object){
		for(var k in obj){
			if(obj.hasOwnProperty(k)){
				if((ctx ? fn.call(ctx,k,obj[k],arg) : fn(k,obj[k],arg))===true){
					return true;
				}
			}
		}
	}
	return false;
}

function loadConfig(){
	chrome['storage']['local']['get']('patterns', function (ops){
		patterns = ops && ops['patterns'];
		console.log(patterns);
	});
}


function checkMatch(item, i, url){
	if(url == item['pattern']){
		match = item;
		return true;
	}
}
function filterRequest(request) {
	//使用chrome.storage.local/sync来存取扩展的配置参数
	if(patterns && request && request['url']){
		match = null;
		loopUntil(patterns, checkMatch, null, request['url']);
		if(match){
			return {"redirectUrl": "data:application/javascript;base64,"+btoa(match['response'])};
		}
	}
}

loadConfig();

// http://developer.chrome.com/extensions/webRequest
// http://developer.chrome.com/extensions/match_patterns
chrome['webRequest']['onBeforeRequest']['addListener'](filterRequest,
	{"urls": ["http://*/*", "https://*/*"]},
	['blocking']
);

chrome['storage']['onChanged']['addListener'](function (changes, areaName){
	if(areaName == 'local'){
		loadConfig();
	}
});

}());