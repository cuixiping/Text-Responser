(function(document){
function $(id){return document.getElementById(id);}
function $$(s,ctx){return (ctx || document).querySelector(s);}

var container = $('patterns');
var template = $$('.pattern-item',container).cloneNode(true);
var form = document.createElement('form');
var tip = $('tip');
var pool = [];
var timer;
var pattern_types = { "精确":1, "通配":2, "正则":3 };
var pattern_values = { 1:"精确", 2:"通配", 3:"正则" };
var PATTERNS='patterns';
var ENABLED='enabled',  PATTERN_TYPE='pattern_type', PATTERN='pattern', RESPONSE_TYPE='response_type', RESPONSE='response';

function reset(item){
	form.innerHTML='';
	form.appendChild(item);
	form.reset();
	return item;
}

function init(){
	chrome.storage.local.get('inited', function (ops){
		if(!ops || !ops['inited']){
			save({'inited':1,'patterns':[{"pattern":"http://www.google-analytics.com/analytics.js", "pattern_type":"extract", "response_type":"js", "response":"function ga(){}"}]}, loadConfig);
		}else{
			loadConfig();
		}
	});
}

function save(item, fn){
	chrome.storage.local.set(item, fn);
}

function loadConfig(){
	chrome.storage.local.get(PATTERNS, function (ops){
		var patterns = ops && ops[PATTERNS];
		if(patterns && patterns.length){
			for(var i=0,n=patterns.length;i<n;i++){
				var div = container.children[i] || container.appendChild(template.cloneNode(true));
				var item = patterns[i];
				$$('.'+ENABLED,div).checked = item[ENABLED];
				$$('.'+PATTERN_TYPE,div).value = pattern_values[item[PATTERN_TYPE]]||pattern_values[1];
				$$('.'+PATTERN,div).value = item[PATTERN];
				$$('.'+RESPONSE_TYPE,div).value = item[RESPONSE_TYPE];
				$$('.'+RESPONSE,div).value = item[RESPONSE];
			}
			while(n > 1 && container.children.length > n){
				pool.push(container.removeChild(container.children[n-1]));
			}
		}
	});
}

init();

document.body.onclick = function (e){
	var cmd = e.target.getAttribute('cmd'), div;
	if(cmd=="add"){
		div = pool.pop() || template.cloneNode(true);
		reset(div);
		container.appendChild(div);
		$$('.'+PATTERN,div).focus();
	}
	if(cmd=="del"){
		if(container.children.length<2){
			container.appendChild(reset(container.children[0]));
			return;
		}
		pool.push(container.removeChild(e.target.parentNode));
	}
	if(cmd=="save"){
		var patterns = [], es = container.children, n = es.length, i, pattern, type, item;
		for(i=0;i<n;i++){
			div = es[i];
			pattern = $$('.'+PATTERN,div).value.trim();
			type = pattern_types[$$('.'+PATTERN_TYPE,div).value];
			if(pattern && type){
				item = {};
				item[ENABLED] = $$('.'+ENABLED,div).checked;
				item[PATTERN_TYPE] = type;
				item[PATTERN] = pattern;
				item[RESPONSE_TYPE] = $$('.'+RESPONSE_TYPE,div).value;
				item[RESPONSE] = $$('.'+RESPONSE,div).value;
				patterns.push(item);
			}
		}
		item = {};
		item[PATTERNS] = patterns;
		save(item, function (){
			tip.innerHTML = 'Saved OK!';
			tip.style.display = 'block';
			tip.style.opacity = '1';
			tip.className = 'tip';
			easeoutTip();
		});
	}
};

function easeoutTip(){
	timer && clearTimeout(timer);
	function fn1(){
		tip.className = 'tip anim';
		timer = setTimeout(fn2,10);
	}
	function fn2(){
		tip.style.opacity = '0';
		timer = setTimeout(fn3,1100);
	}
	function fn3(){
		timer = 0;
		tip.className = 'tip';
		tip.style.display = 'none';
	}
	timer = setTimeout(fn1,10);
}

}(document));