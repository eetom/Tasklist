'use strict';
/*============== Task Manager =======================*/
// Simple javascript task manager
// Created by Marcelo Quevedo Ucker


// Local Storage - Persist tasks
Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	return value && JSON.parse(value);
}

var TaskManager = function() {

	// Tasks Array - Store created Tasks
	var tasks = [];  
	// Archive Array - store archived tasks
	var archive = [];
	// Trash Array - Store deleted tasks
	var trash = [];

	// Task Class
	function Task(id, title, body, status, createdOn) {
		this.id = id;
		this.title = title;
		this.body = body;
		this.status = status;
		this.createdOn = createdOn;
	};

	// function to build the task element into the DOM
	function buildTask(task) {
		//  Get target Element to append
		var tasksList = document.getElementById('tasks-list');
		// Create the <li> element on document
		var element = document.createElement('li');
		element.setAttribute('id', 'taskEntry');
		element.setAttribute('data-id', task.id);
		element.setAttribute('class', 'taskBox transitions');
		element.setAttribute('data-status', task.status);
		// set the innerHTML
		element.innerHTML = '<input type="text" data-ref="'+task.id+'" id="taskBox-title" value="'+task.title+'" placeholder="Your Title" maxlength="50"><textarea data-ref="'+task.id+'" name="taskBox-body" id="taskBox-body" placeholder="Content Here">'+task.body+'</textarea><div class="taskBox-footer"><p><i class="glyphicon glyphicon-time"></i>Created on : '+task.createdOn+'</p><div class="actions"><ul><li><a href="javascript:;" onclick="TaskManager.archive('+task.id+')"  class="btn" data-toggle="tooltip" data-placement="bottom" title="Archive"><i class="glyphicon glyphicon-folder-close"></i></a></li><li><a href="javascript:;" onclick="TaskManager.delete('+task.id+')" class="btn" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="glyphicon glyphicon-remove-circle"></i></a></li></ul></div></div>';

		// append in the DOM
		tasksList.appendChild(element);

	};

	function buildArchive(task) {
		//  Get target Element to append
		var archiveList = document.getElementById('archive-list');
		// Create the <li> element on document
		var element = document.createElement('li');
		element.setAttribute('id', 'taskEntry');
		element.setAttribute('data-id', task.id);
		element.setAttribute('class', 'taskBox transitions');
		element.setAttribute('data-status', task.status);

		element.innerHTML = '<input type="text" data-ref="'+task.id+'" id="taskBox-title" value="'+task.title+'" placeholder="Your Title" READONLY><textarea data-ref="'+task.id+'" name="taskBox-body" id="taskBox-body" placeholder="Content Here" READONLY>'+task.body+'</textarea><div class="taskBox-footer"><p><i class="glyphicon glyphicon-time"></i>Created on : '+task.createdOn+'</p><div class="actions"><ul><li><a href="javascript:;" onclick="TaskManager.restoreArchive('+task.id+')"  class="btn" data-toggle="tooltip" data-placement="bottom" title="Archive"><i class="glyphicon glyphicon-tasks"></i></a></li><li><a href="javascript:;" onclick="TaskManager.fromArchiveToTrash('+task.id+')" class="btn" data-toggle="tooltip" data-placement="bottom" title="Delete"><i class="glyphicon glyphicon-remove-circle"></i></a></li></ul></div></div>';
		// append in the DOM
		archiveList.appendChild(element);
	};

	function buildTrash(task) {
		//  Get target Element to append
		var trashList = document.getElementById('trash-list');
		// Create the <li> element on document
		var element = document.createElement('li');
		element.setAttribute('id', 'taskEntry');
		element.setAttribute('data-id', task.id);
		element.setAttribute('class', 'taskBox transitions');
		element.setAttribute('data-status', task.status);

		element.innerHTML = '<input type="text" data-ref="'+task.id+'" id="taskBox-title" value="'+task.title+'" placeholder="Your Title" READONLY><textarea data-ref="'+task.id+'" name="taskBox-body" id="taskBox-body" placeholder="Content Here" READONLY>'+task.body+'</textarea><div class="taskBox-footer"><p><i class="glyphicon glyphicon-time"></i>Created on : '+task.createdOn+'</p><div class="actions"><ul><li><a href="javascript:;" onclick="TaskManager.restore('+task.id+')"  class="btn" data-toggle="tooltip" data-placement="bottom" title="Recover Task"><i class="glyphicon glyphicon-repeat"></i></a></li><li><a href="javascript:;" onclick="TaskManager.removeFromTrash('+task.id+')" class="btn" data-toggle="tooltip" data-placement="bottom" title="Remove from Trash"><i class="glyphicon glyphicon-remove-circle"></i></a></li></ul></div></div>';

		// append in the DOM
		trashList.appendChild(element);
	};

	// Delete element from the document
	// function deleteNode(id) {
	// 	var task = document.getElementById('taskEntry').getAttribute('data-id');;
	// 	task.parentNode.removeChild(task);
	// }

	return {
		load: function() {
			// Get tasks from local storage
			if (localStorage.getObject('tasks')) tasks = localStorage.getObject('tasks'); // Open Tasks
			if (localStorage.getObject('archive')) archive = localStorage.getObject('archive'); // Tasks in Archive
			if (localStorage.getObject('trash')) trash = localStorage.getObject('trash'); // Tasks in trash

			reloadDOM();
		},

		add: function() {

			//  Get values from the inputs
			var title = document.querySelector('#task-title').value;

			if(title.length > 50) {
				showAlert('Title have more than 50 characters!');
				return
			}

			var body = document.querySelector('#task-body').value;

			if(title.length > 150) {
				showAlert('Task content have more than 150 characters!');
				return;
			}

			// var color = document.querySelector('#color').value;
			var status = 'open';


			var d = new Date();
			var curr_date = d.getDate();
			var curr_month = d.getMonth();
			var curr_year = d.getFullYear();

			var createdOn = curr_date + '/' + curr_month + '/' + curr_year;

			// Check if the Content from task is greater than 0 and less or equals to 150
			if(body.length !== 0 && body.length < 150) {

				var taskId = randomId(4); // create a random number

				// check if ID already exist, and create new one if need
				if(!tasks.length === 0) {
					for(var i = 0; i < tasks.length; i++) {
						taskId = tasks[i].id === taskId ? randomId(4) : taskId;
					}
				}
				//  Create the task object
				var task = new Task(taskId, title, body, status, createdOn);

				// store task on tasks array
				tasks.push(task);

				// Save task in the cookie
				this.save();

				// update document
				reloadDOM();
				showAlert('Task has been created');

			} else {
				
				// Messages
				if(body.length === 0) {showAlert('Task without content!');}
				if(body.length > 150) {showAlert('Content is greater than 150 characters.');}
			}
		},

		delete: function(taskId) {
			// check if the task exist in the tasks array
			for(var i = 0; i < tasks.length; i++){
				if(tasks[i].id == taskId){

					// move the task to trash
					tasks[i].status = 'trash';
					trash.push(tasks[i]);
					tasks.splice(i, 1);

					deleteNode(taskId);

					this.save();
					reloadDOM();

					showAlert('Task has been removed');
				}
			}
			
		},

		update: function(taskId, title, body) {

			if(title !== null){
				for(var i = 0; i < tasks.length; i++){
					if(tasks[i].id == taskId){

						tasks[i].title = title;

						this.save();

						showAlert('Task Title has been updated');
					}
				}
			}

			if(body !== null){
				for(var i = 0; i < tasks.length; i++){
					if(tasks[i].id == taskId){

						tasks[i].body = body;

						this.save();

						showAlert('Task Body has been updated');
					}
				}
			}
		},

		// Archive a Task
		archive: function(taskId) {
			for(var i = 0; i < tasks.length; i++){
				if(tasks[i].id == taskId){

					// move the task to trash
					tasks[i].status = 'archive';
					archive.push(tasks[i]);
					tasks.splice(i, 1);

					deleteNode(taskId);

					this.save();
					reloadDOM();
					showAlert('Task Archived.');
				}
			}
		},

		// save in the cookie
		save: function() {
			localStorage.setObject("tasks", tasks);
			localStorage.setObject("archive", archive);
			localStorage.setObject("trash", trash);
		},

		// Move tasks from Archive to Trash
		fromArchiveToTrash: function(taskId) {
				// check if the task exist in the tasks array
				for(var i = 0; i < archive.length; i++){
					if(archive[i].id == taskId){

					// move the task to trash
					archive[i].status = 'trash';
					trash.push(archive[i]);
					archive.splice(i, 1);

					deleteNode(taskId);

					this.save();
					reloadDOM();

					showAlert('Task has been moved to trash');
				}
			}
		},

		// Move Tasks from Archive to Open Tasks
		restoreArchive: function(taskId) {
			// check if the task exist in the tasks array
			for(var i = 0; i < archive.length; i++){
				if(archive[i].id == taskId){

					// move the task to trash
					archive[i].status = 'open';
					tasks.push(archive[i]);
					archive.splice(i, 1);

					deleteNode(taskId);

					this.save();
					reloadDOM();

					showAlert('Task moved to Open Tasks.');
				}
			}
		},


		// Move Tasks in the Trash to Open Tasks
		restore: function(taskId){
			for(var i = 0; i < trash.length; i++){
				if(trash[i].id == taskId){

					trash[i].status = 'open';
					tasks.push(trash[i]);
					trash.splice(i, 1);

					deleteNode(taskId);

					this.save();
					reloadDOM();

					showAlert('Task removed from trash [To: Tasks].');
				}
			}
		},

		// Delete Task from Trash (can't recover after this)
		removeFromTrash: function(taskId) {
			// check if the task exist in the trash array
			for(var i = 0; i < trash.length; i++){
				if(trash[i].id == taskId){

					trash.splice(i, 1);

					deleteNode(taskId);

					this.save();
					reloadDOM();

					showAlert('Task deleted forever.');
				}
			}
		},

		// Clean trash, remove all task (can't recover after this)
		emptyTrash: function() {
			trash = new Array();
			this.save();
			reloadDOM();
			showAlert('Trash now is empty.');
		},

		openTasks: function() {
			return tasks.length;
		},

		inTrash: function() {
			return trash.length;
		},

		inArchive: function() {
			return archive.length;
		},

		buildAll: function() {
			for (var i = tasks.length - 1; i >= 0; i--) {
				buildTask(tasks[i]);
			};

			for (var i = archive.length - 1; i >= 0; i--) {
				buildArchive(archive[i]);
			};

			for (var i = trash.length - 1; i >= 0; i--) {
				buildTrash(trash[i]);
			};
		}
	};
}();