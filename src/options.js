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

function reset(item){
	form.innerHTML='';
	form.appendChild(item);
	form.reset();
	return item;
}

function loadConfig(){
	chrome['storage']['local']['get']('patterns', function (ops){
		var patterns = ops && ops['patterns'];
		if(patterns && patterns.length){
			for(var i=0,n=patterns.length;i<n;i++){
				var div = container.children[i] || container.appendChild(template.cloneNode(true));
				var item = patterns[i];
				$$('.enabled',div).checked = item['enabled'];
				$$('.pattern_type',div).value = pattern_values[item['pattern_type']]||pattern_values[1];
				$$('.pattern',div).value = item['pattern'];
				$$('.response_type',div).value = item['response_type'];
				$$('.response',div).value = item['response'];
			}
			while(n > 1 && container.children.length > n){
				pool.push(container.removeChild(container.children[n-1]));
			}
		}
	});
}

loadConfig();

document.body.onclick = function (e){
	var cmd = e.target.getAttribute('cmd'), div;
	if(cmd=="add"){
		div = pool.pop() || template.cloneNode(true);
		reset(div);
		container.appendChild(div);
		$$('.pattern',div).focus();
	}
	if(cmd=="del"){
		if(container.children.length<2){
			container.appendChild(reset(container.children[0]));
			return;
		}
		pool.push(container.removeChild(e.target.parentNode));
	}
	if(cmd=="save"){
		var patterns = [], es = container.children, n = es.length, i, pattern, type;
		for(i=0;i<n;i++){
			div = es[i];
			pattern = $$('.pattern',div).value.trim();
			type = pattern_types[$$('.pattern_type',div).value];
			if(pattern && type){
				patterns.push({
					'enabled' : $$('.enabled',div).checked,
					'pattern_type' : type,
					'pattern' : pattern,
					'response_type' : $$('.response_type',div).value,
					'response' : $$('.response',div).value
				});
			}
		}
		chrome['storage']['local']['set']({'patterns':patterns}, function (){
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