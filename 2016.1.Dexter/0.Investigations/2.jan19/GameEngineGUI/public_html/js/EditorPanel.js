var EditorPanel = function(htmlParentID, name){
    
    this.ComponentList = {};
    this.parent = $("#"+htmlParentID);
    this.panel = null;
    this.visible = true;
    
    
    this.initialize = function(){
        this.panel = $('<div class="panel panel-success" ></div>');
        var heading = $('<div class="panel-heading"></div>');               
        var icon = $('<span class="glyphicon glyphicon-edit">' + name + '</span>');
        //TODO: This doesn't work as id #panelEdit____Close
        var close = $('<button type="button" class="navbar-right" id="' + htmlParentID + 'Close"><span class="glyphicon glyphicon-remove"></span></button>'); 

        this.panel.append(heading.append(icon));
        this.panel.append(heading.append(close));
        this.panel.append('<br>');
    };
    
    this.getVisible = function() {
        return this.visible;
    };
    
    this.createComponent = function (name) {
        this.ComponentList[name] = new EditorComponent(name,this.panel);
        this.panel.append('<br>');
    };

    this.getComponentVal = function (name){
        return this.ComponentList[name].getVal();       
    };
    
    this.updateComponent = function (name,value){
        if (this.ComponentList[name] === undefined) {
            this.createComponent(name);
        }
        this.ComponentList[name].update(value);       
    };
    
    this.setVisible = function(bool){
        this.visible = bool;
        if(bool){
            this.parent.append(this.panel); 
        }
        else{
           this.panel.remove(); 
        }  
    };
    
    this.initialize();
    
};


var EditorComponent = function(name, parent){
    
    //private variables
    this.displayName = name;
    this.displayValue = null;

    //html JQuery object references
    this.htmlParent = parent;
    this.htmlLabel = null;
    this.htmlInput = null;

    //still JQuery objects but for the purposes of CSS 
    this.cssInputGroup = null;
    this.cssDivider = null;
    
//    the HTML looks like this! --
//    
//    '<div class="input-group">'
//        '<label class="control-label col-sm-4"></label> '                           
//        '<div class="col-sm-8" >'
//           '<input type="text" class="form-control" value=""/>'
//        '</div>'
//    '</div> '

    
    this.initialize = function(){

        this.cssInputGroup = $('<div class="input-group"></div>');
        
        this.htmlLabel = $('<label class="control-label col-sm-4"></label> ');
        this.htmlLabel.text(this.displayName);
        
        this.cssDivider = $('<div class="col-sm-8" ></div> ');
        
        this.htmlInput = $('<input type="text" class="form-control" value="" name="' + this.displayName + '"/>');
       
        this.addToParent();
        
    };
    
    this.addToParent = function(){
        this.cssInputGroup.append(this.htmlLabel);
        this.cssInputGroup.append(this.cssDivider);
        this.cssDivider.append(this.htmlInput);
        this.htmlParent.append(this.cssInputGroup);
    };
    
    this.removeFromParent = function(){
        //if you remove the parent html all children will be 
        //removed as well
        this.cssInputGroup.remove();
    };
        
    this.getVal = function(){
        return this.htmlInput.val();
    };
    
    this.update = function(newValue){
        this.displayValue = newValue;
        this.htmlInput.val(this.displayValue);
    };
    
    this.initialize();
   
};


