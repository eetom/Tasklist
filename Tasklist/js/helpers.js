'use strict';
// Document ready helpers
$(function(){

	var createTask = $('#createTask');
	var taskElem = $('#task-item');

	// Initialize the App
	TaskManager.load();

	// animate tasks
	animateTask(createTask);

	// check if the textarea and input are focused and if not, hide them
	isFocused(createTask);

	// resize textarea when type
	resizeTextArea();

	updateTask();

	$('.btn').tooltip();
	$('.alert').alert();

});

/*=============== Helper Functions ==================*/

// Random ID for tasks
function randomId(length) {
	var chars = '0123456789'.split('');

	if (! length) {
		length = Math.floor(Math.random() * chars.length);
	}

	var str = '';
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
};

function showAlert(msg) {
	$('#alert').find('#alert-msg').empty();
	$('#alert').find('#alert-msg').append(msg);
	$('#alert').slideDown('fast/300/fast').fadeOut(3000);
};


// Update the edited Task whenever the user types inside the task
function updateTask() {
	$('#tasks-list').on('keyup', '#taskBox-title', function(){ 
		var title = this.value;
		var ref = this.getAttribute('data-ref');
		TaskManager.update(ref, title, null);
	});

	$('#tasks-list').on('keyup', '#taskBox-body', function(){ 
		var body = this.value;
		var ref = this.getAttribute('data-ref');

		TaskManager.update(ref, null, body);
	});

};


/* Resize the textarea, creating a new hidden DOM element,
 * which get the textarea input and his content with the input
 * and get the textarea get the same height as the hidden div
 */
 function resizeTextArea() {

 	// textarea element
 	var textarea = $('#task-body'),
 	textarea2 = $('#taskBox-body'),
 	// hidden element
 	clonedTextarea = $('.hiddendiv'), 

 	// init content as null
 	content = null;

 	// evet to get the input and height
 	textarea.on('keyup focus keypress cut paste change keydown', function() {
 		// set the new content value
 		content = textarea.val();
 		// set the textarea value to the hidden element
 		clonedTextarea.html(content);
 		// set the new textarea height with the height from the hidden element
 		textarea.css('height', clonedTextarea.height() + 50 + 'px');           

 	});

 	textarea2.on('keyup focus keypress cut paste change keydown', function() {
 		// set the new content value
 		content = textarea2.val();
 		// set the textarea value to the hidden element
 		clonedTextarea.html(content);
 		// set the new textarea height with the height from the hidden element
 		textarea2.css('height', clonedTextarea.height() + 50 + 'px');
 	});
 };

// jQuery Animations
function animateTask(createTask) {
	// When the task-element has focus or lost focus, show or hide controls and title
	createTask.find('#task-title').focus(function(){
		createTask.find('#task-body').show();
		createTask.find('.task-controls').show();
	});

	$('#taskEntry').find('#taskBox-body').focus(function(){
		$('#taskEntry').find('#taskBox-title').show();
	});

	$('#taskEntry').find('#taskBox-body').blur(function(){
		if($('#taskBox-title').val() === undefined || $('#taskBox-title').val().length === 0 || $('#taskBox-title').val() === ' ' || $('#taskEntry').find('#taskBox-title').val() === '') {
			$('#taskBox-title').hide();
		}
	});


	// reset input's when they both lose focus
	if(createTask.find('#task-title').blur() && createTask.find('#task-body').blur()) {
		createTask.find('#task-title').val('');
		createTask.find('#task-body').val('').hide();
		createTask.find('.task-controls').hide();
	}
};

// Reset Forms when lost focus
function isFocused(createTask) {
	// reset new task when the new button is clicked
	$('#newBtn').on('click', function(){
		createTask.find('#task-title').val('');
		createTask.find('#task-body').val('').hide();
		createTask.find('.task-controls').hide();
	});

	// Clean New Task input's when user click anywhere outside the NewTask element
	$('body').click(function(event) {
		if (!$(event.target).closest(createTask).length) {
			createTask.find('#task-title').val('')
			createTask.find('#task-body').val('').hide();
			createTask.find('.task-controls').hide();
		};
	});
};

function deleteNode(id) {
	$('#taskEntry').find("[data-id='" + id + "']");
}

// Update the DOM
function reloadDOM() {
	// Empty the values from ToolBar
	$('#tasksLength').empty();
	$('#archiveLength').empty();
	$('#trashLength').empty();

	// Empty the tasks list in all sections
	$('#tasks-list').empty();
	$('#archive-list').empty();
	$('#trash-list').empty();

	// Remove Remove all tasks from Trash tab, and the Empty Box Alert.
	$('#trashTab').find('.emptyTrash').remove();
	$('#tasks').find('.empty').remove();

	// Append new values in the ToolBar
	$('#tasksLength').append(TaskManager.openTasks());
	$('#archiveLength').append(TaskManager.inArchive());
	$('#trashLength').append(TaskManager.inTrash());

	$('#tasksTab').find('.empty').remove();
	$('#archiveTab').find('.empty').remove();
	$('#trashTab').find('.empty').remove();

	// Create all tasks in each box
	TaskManager.buildAll();

	// hide taskEntry title if is empty
	if($('#taskEntry').length > 0) {
		$('#tasks-list').find('#taskEntry').find('#taskBox-title').each(function(index) {
			if($(this).val() == '' || $(this).val() == ' '){
				$(this).hide();
			}
		});
	}

	// Check if the Task Box is empty and show a Message.
	if(TaskManager.openTasks() === 0) {
		$('#tasksTab').append('<h1 class="empty"><i class="glyphicon glyphicon-thumbs-up"></i>  No Tasks!</h1>');
	}

	if(TaskManager.inArchive() === 0) {
		$('#archiveTab').append('<h1 class="empty"><i class="glyphicon glyphicon-thumbs-up"></i>  No Tasks Archived!</h1>');
	}

	if(TaskManager.inTrash() === 0) {
		$('#trashTab').append('<h1 class="empty"><i class="glyphicon glyphicon-thumbs-up"></i> Empty!</h1>');
	}

	// Check if Trash Box have a least one Task to show the Delete All Tasks from Trash.
	if(TaskManager.inTrash() > 0) {
		$('#trashTab').find('.emptyTrash').remove();
		$('#trashTab').find('.modal').remove();

		$('#trashTab').prepend('<button type="button" class="btn btn-danger emptyTrash" data-toggle="modal" data-target=".bs-example-modal-sm">Empty Trash</button> <div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="emptyTrashModal" aria-hidden="true"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h4 class="modal-title" id="myModalLabel"><i class="glyphicon glyphicon-exclamation-sign"></i> Empty trash?</h4></div><div class="modal-body"><h4> All tasks in Trash will be permanently deleted.</h4></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button id="emptyTrashButton" type="button" class="btn btn-danger" data-dismiss="modal" onclick="TaskManager.emptyTrash()">Empty Trash</button></div></div></div></div>');
	}
};	