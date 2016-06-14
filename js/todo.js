$(function(){

//动效
var ani = $('#ani');
  $(document).ajaxStart(function(){
    ani.stop(true,true).css({
      width:40,
      opacity:0,
      backgroundColor:'#0d6631'
    });
    ani.animate({opacity:1},20);
  })
  $(document).ajaxSend(function(){
    ani.animate({width:$(window).outerWidth(true)*0.9},200);
  })
  $(document).ajaxSuccess(function(){
    ani.finish().css('backgroundColor','#0575e6').animate({width:$(window).outerWidth(true)},120);
  })
  $(document).ajaxError(function(){
    ani.finish().css('backgroundColor','#e92d1b').animate({width:0},120);
  });
  $(document).ajaxComplete(function(){
    ani.animate({opacity:0},120);
  });




var todos=[];
//从服务器读取数据或从本地获取数据
if(localStorage.todos){
	todos = $.parseJSON(localStorage.todos);
	render();
}else{
	$.get({
		url:'/php/getTodo.php',
		dataType:'json'
	}).done(function(data){
		todos = data;
		render();
	})
}	
var state = localStorage.state||'all';
  
var saveData = function(){
	localStorage.todos=JSON.stringify(todos);
}


	function render(){
		
		var ftodos = $.grep(todos,function(v){
			if( state === 'all'){
				return v;
			}else if( state === 'active'){
				// return !v.isDone;
				return v.isDone === '0';				
			}else if( state === 'completed'){
				return v.isDone === '1';
			}
		})
		//1:true 选中    0：false 未选中
	$('#todo-list').empty().append(function(){
		return $.map(ftodos,function(v){
			var tmp =(v.isDone==='1')  ? 'checked':'';
			return '<li class="'+(v.isDone==='1'?'completed':'')+'" data-id="'+v.id+'"> <div class="view"> <input '+tmp+' type="checkbox" '+(v.isDone==='1'?'checked':'')+' class="toggle"> <label for="toggle">'+v.content+'</label> <button class="destroy"></button> </div> <input type="text" class="edit" value="'+v.content+'"> </li>'
		})

	})
	$('#footer .selected').removeClass('selected');
	$('#footer a[data-role ='+state+']').addClass('selected')
	$('#todo-count strong').text(ftodos.length);

	togglea();	
  }
  render();


// 全选都勾中
  function togglea(){
  	var fftodos = $.grep(todos,function(v){
			return v.isDone === '1';
		})
  	if (todos.length===fftodos.length) {
		$('#toggle-all').attr('checked','checked')
	};
  }

//增加数据
var addTodo = function(e){
	var zhi = $.trim($(this).val() );
	if(e.keyCode === 13 && zhi !==''){
		var todo = {
			id:todos.length? (Math.max.apply(null,$.map(todos,function(v){
										return v.id;
									})) + 1 + ''):' 1 ' ,
			content:zhi,
			isDone:'0'
		}
		$(this).val('');
		todos.push(todo);
		saveData();
		render();

		$.get({
			url:'/php/addTodo.php',
			data:todo,
		}).done(function(){

		}).fail(function(){

		})
		
	}	
}

$('#new-todo').on('keyup',addTodo);

//删除 (事件委托)
var deleteTodo = function(){
	var li =  $(this).closest('li');
	// var id = parseInt( li.attr('data-id'));
	var id = li.attr('data-id');
	//grep 遍历剔除false,保留true
	todos=$.grep(todos,function(v){
		return v.id !== id;
	})
	li.fadeOut(800,render)
	saveData();
	render();


	$.get({
		url:'/php/deleteTodo.php',
		data:{id:id},
	}).done(function(){

	}).fail(function(){

	})

}
$('#todo-list').on('click','.destroy',deleteTodo);



var gaizhuangtai=function(){
	var state=$(this).prop('checked');
	var id =$(this).closest('li').attr('data-id');
	$.each(todos,function(i,v){
		if(v.id === id){
			v.isDone=state?'1':'0';
		}
	})
	saveData();
	render();

	togglea();

};
$('#todo-list').on('click','.toggle',gaizhuangtai);


//修改 (找id将值换掉)
var update  = function(){
	// var id =parseInt($(this).closest('li').attr('data-id'));
	var id =$(this).closest('li').attr('data-id');	
	// var self = this;
	var value = $(this).val();
	$.each(todos,function(i,v){
		if(v.id === id){
			// v.content = $(self).val();
			v.content = value;
		}

	})
	saveData();
	render();

// $.get('php/updateTodo.php',{});

	$.get({
		url:'/php/updateTodo.php',
		data:{id:id,content:value},
	}).done(function(){

	}).fail(function(){

	});
}

$('#todo-list').on('change','.edit',update);

$('#todo-list').on('focusout','.edit',function(){
	$(this).closest('li').removeClass('editing');
	// var id =parseInt($(this).closest('li').attr('data-id'));	
	// saveData();
	// render()
 });
$('#todo-list').on('dblclick','li',function(){
	$(this).addClass('editing');
	var input = $(this).find('.edit');
  //把input原来的值拿出来再次赋值进去,之后调用focus()
	input.val(input.val()).focus()
});


//清除已完成的
var clearCompleted = $('#clear-completed');
clearCompleted.on('click',function(){
	todos = $.grep(todos,function(v){
		return v.isDone === '0'
	})
	saveData();
	render();
})


//全选
$('#toggle-all').on('click',function(){
	var state=$(this).prop('checked')?'1':'0'
    todos=$.grep(todos,function(v){
   		return v.isDone=state;
	})
   saveData();
   render();
})





$('#filters a').on('click',function(){
	$('#filters .selected').removeClass('selected');
	$(this).addClass('selected');
    state = localStorage.state = $(this).attr('data-role')
    render();
	return false;
})


})

