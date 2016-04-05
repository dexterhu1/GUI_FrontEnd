/* 
 * File: View.js
 * The client code
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, Scene, GameCore */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gameCore = null;

var EDITOR_OFFSETS = [30, 192, 95];

var rightClickedItem = null;
var nextObjectID = 0;

$(document).ready(function() {
    
    console.log("made it");
    gameCore = new GameCore();
    
    // Inheritance
    gEngine.Core.inheritPrototype(ClientScene, Scene);
    createCodeEditor();
    $('#codeEditor').hide();
    createPanelLeft();
    createPanelRight();
});

$('#menuFileOpen').click(function() {
    alert("open clicked");
});

$('#menuFileSave').click(function() {
    alert("save clicked");
});

$('#menuPanel').click(function() {
    alert("panel clicked");
});

$(document).bind("mousedown", function (event) {
    // Upon a click outside of the menu, hide all right-click menus (allows you to immediately open a new menu elsewhere)
    // Adapted from: http://stackoverflow.com/questions/4495626/making-custom-right-click-context-menus-for-my-web-app
    if (!$(event.target).parents(".objects-menu").length > 0) {
        $(".objects-menu").hide();
    }
});

$(document).bind("contextmenu", function (event) {
    // Prevents all regular right-click menus from showing when right-clicking
    event.preventDefault();
});

$(document).on('contextmenu', 'li', function(event) {
    // Checks out the id of the item and will provide the appropriate right-click menu
    // (since another function blocks the default one)
    var id = this.id;
    if (id.startsWith("objectListItem")) {
        $(".objects-menu").finish().toggle().css({top: event.pageY + 'px', left: event.pageX + 'px'});
        rightClickedItem = $(this).attr('id');
    }
});

$('.objects-menu li').click(function(){
    // When a right-click menu option is clicked

    switch($(this).attr("name")) {
        case "objectsMenuDetails":
            alert("details");
            break;
        case "objectsMenuEditCode":
            alert("edit");
            break;
        case "objectsMenuInstantiateToScene":
            alert("instantiate");
            break;
        case "objectsMenuDelete":
            $('#panelLeftObjectsBody li').each(function(index) {
                if ($(this).attr('id') === rightClickedItem) {
                    gameCore.deleteObjectAt(index - 1);
                    $('#' + rightClickedItem).remove();
                }
            });
            break;
        default:
            break;
    }
  
    // Done with the menu
    $(".objects-menu").hide();
});

var windowResize = function() {
    //var initWidth = 640.0;
    //var initHeight = 480.0;
    //var width = $(window).width() * 0.7;
    //var height = (initHeight / initWidth) * width;
    
    //$("#GLCanvas").width(width);
    //$("#GLCanvas").height(height);
    $('#aceEditor').width($(window).width() - EDITOR_OFFSETS[0]);
    $('#aceEditor').height($(window).height() - EDITOR_OFFSETS[1]);
    $('#codeBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    $('#panelLeftBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    $('#panelRightBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
};

window.onresize = function(event) {
    windowResize();
};

var createCodeEditor = function() {
    // Make the code editor
    var codeEditor = $('#codeEditor');
    codeEditor.append('<ul class="nav-menu">' +
            '<li class="header-text-only">Code Editor</li>' +
            '</ul>');
    
    // Make the body of the code editor
    codeEditor.append('<ul class="panel-body" id="codeBody"></ul>');
    
    // Create a separate area within the panel for the editor
    var editorArea = $('#codeBody');
    var editorDiv = $('<div id="aceEditor"></div>'); // You can insert default code between the divs, but I already gave the default code to GameObject's script update variable.
    editorArea.append(editorDiv);
    
    // Set up the editor
    var editor = ace.edit('aceEditor');
    editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/javascript');
    
    // Set a size for it
    $('#aceEditor').width($(window).width() - EDITOR_OFFSETS[0]);
    $('#aceEditor').height($(window).height() - EDITOR_OFFSETS[1]);
    $('#codeBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    // Add a button at the bottom
    editorArea.append('<br>');
    editorArea.append('<ul class="nav-menu">' +
            '<li id="codeOK"><a href="#">OK</a></li>' +           // Places this on the farthest right
            '<li id="codeCancel"><a href="#">Cancel</a></li>' +   // Left of the OK button
            '</ul>');
    $('#codeOK').css('float', 'right');
    $('#codeCancel').css('float', 'right');
    
    // Add the function directly to it
    $('#codeOK').click(function() {
        alert("Your code was successfully saved.");
        $('#codeEditor').hide();
        $('#panelLeft').show();
        $('#GLCanvas').show();
        $('#panelRight').show();
    });
    $('#codeCancel').click(function() {
        $('#codeEditor').hide();
        $('#panelLeft').show();
        $('#GLCanvas').show();
        $('#panelRight').show();
    });
    
    // Populate the text for the current object.
    // Note that changing objects or pressing some other button to open this panel also should also populate the text.
    // 7 = the update script
    //editor.setValue(selected.getAllContents()[7].value);
};

var createPanelLeft = function() {
    // Make the panel
    var panelLeft = $('#panelLeft');
    panelLeft.append('<ul class="nav-menu">' +
            '<li><a href="#" id="panelLeftObjects">Objects</a></li>' +
            '<li><a href="#" id="panelLeftTextures">Textures</a></li>' +
            '<li><a href="#" id="panelLeftScenes">Scenes</a></li>' +
            '</ul>');
    
    // Add the function directly to it
    $('#panelLeftObjects').click(function() {
        alert("objects clicked");
    });
    $('#panelLeftTextures').click(function() {
        alert("textures clicked");
    });
    $('#panelLeftScenes').click(function() {
        alert("scenes clicked");
    });
    
    // Resize it
    panelLeft.css('width', '234px');
    
    createPanelLeftObjects();
};

var createPanelLeftObjects = function() {
    // Now add the UL for the body
    var panelLeft = $('#panelLeft');
    
    panelLeft.append('<ul class="panel-body" id="panelLeftObjectsBody">' +
            '<ul class="nav-menu" id="panelLeftAddGameObjectUL"><li><a href="#" id="panelLeftAddGameObject">+ GameObject</a></li></ul>' +
            '</ul>');
    
    var panelLeftBody = $('#panelLeftObjectsBody');
    var i;
    var list = gameCore.getObjectList();
    
    for (i = 0; i < list.length; i++) {
        // Add objects in with a default name
        panelLeftBody.append('<li class="object-list-item" id="objectListItem' + list.get(i).mID + '">' + list.get(i).mName + '</li><p><br>');
    }
    
    $('#panelLeftAddGameObjectUL').css('width', '120px');
    panelLeftBody.css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    $('#panelLeftAddGameObject').click(function() {
        gameCore.createDefaultObject(nextObjectID);
        panelLeftBody.append('<li class="object-list-item" id="objectListItem' + nextObjectID + '">GameObj' + nextObjectID + '</li><p><br>');
        nextObjectID++;
    });
};

var createPanelRight = function() {
    // Make the panel
    var panelRight = $('#panelRight');
    panelRight.append('<ul class="nav-menu">' +
            '<li><a id="panelRightDetails">Details</a></li>' +
            '</ul>');
        
    // Resize it
    panelRight.css('width', '234px');
    
    createDetailsObjects();
};

var createDetailsObjects = function() {
    // Now add the UL for the body
    var panelRight = $('#panelRight');
    
    panelRight.append('<ul class="panel-body" id="panelRightBody">' +
            '<font color="black">Name </font><input type="text" id="panelRightObjectsName"/><br><br>' +
            '<font color="black">X &nbsp</font><input type="text" id="panelRightObjectsX"/>' +
            '<font color="black"> Y </font><input type="text" id="panelRightObjectsY"/><br><br>' +
            '<font color="black">W </font><input type="text" id="panelRightObjectsW"/>' +
            '<font color="black"> H </font><input type="text" id="panelRightObjectsH"/><br><br>' +
            '<font color="black">Rot </font><input type="text" id="panelRightObjectsRot"/><br><br><br><br>' +
            '<font color="black">Color </font><input type="text" id="panelRightObjectsColor"/><br><br>' +
            '<font color="black" id="panelRightObjectsTextureText">Texture&nbsp</font><select id="panelRightObjectsTexture"><option value="TempTexture1">TempTexture1</option><option value="TempTexture2">TempTexture2</option></select>' +
            '<li><a href="#" id="panelRightObjectsAddTexture">+</a></li><br><br><br><br>' +
            '<li><a href="#" id="panelRightObjectsEditCode">Edit Code</a></li>' +
            '</ul>');
    
    $('#panelRightObjectsTextureText').css('float', 'left');
    $('#panelRightObjectsTexture').css('float', 'left');
    $('#panelRightObjectsAddTexture').css('float', 'right').css('height', '1px').css('line-height', '0px');
    $('#panelRightBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    $('#panelRightObjectsAddTexture').click(function() {
        alert("+ texture clicked\nyou selected: " + $('#panelRightObjectsTexture').val());
    });
    
    $('#panelRightObjectsEditCode').click(function() {
        $('#codeEditor').show();
        $('#panelLeft').hide();
        $('#GLCanvas').hide();
        $('#panelRight').hide();
    });
    
    /* Later we will use a for loop to loop through GameCore's texture list
     * And append it in the following format:
     * 
     * '<select id="panelRightObjectsTexture"><option value="this is the .val() and it will the texture name">Display text here (same as value)</option></select>' +
     * Insert as many options (within the select) as you want
     */
    
    $('#panelRightObjectsName').css('width', '153px');
    $('#panelRightObjectsX').css('width', '80px');
    $('#panelRightObjectsY').css('width', '81px');
    $('#panelRightObjectsW').css('width', '80px');
    $('#panelRightObjectsH').css('width', '80px');
    $('#panelRightObjectsRot').css('width', '169px');
    $('#panelRightObjectsColor').css('width', '157px');
    $('#panelRightObjectsTexture').css('width', '120px');
    
    
    // You can get the contents with $('#panelRightObjectsName').val() -- that's the name, as an example
};