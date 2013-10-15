//More normal OOP for JavaScript

Class = (function() {

    //definition of base class for everything 
    var Base = new Function(); 
    Base.prototype.callSuper = function(name, args) {
        //calls the super classes version of the method    
        var method = this.superClazz.prototype[name];
        if (!method) {
            throw 'No super class method named: ' + name.toString();
        }

        return method.apply(this, args);
    };

    function makeClass(config) {
        //to support a more familiar form of a constructor
        //the clazz is the class that has all the methods
        //and any variables from the config object.  the 
        //class being defined inherits from this clazz class.
        //Any classes that inherit from this class actually
        //will have their own verion of clazz with will inherit from
        //the clazz defined here.  It will also have it's own realClass
        //which will inherit from it's version of clazz.  Using this 
        //more complicated inheritance model supports a normal constructor
        //which is specified as the init method.

        var clazz = new Function(); //classes in js are modeled by functions
        setupSuperClazz(clazz, config);
        addMembers(clazz, config); //add member methods and variables from config object

        var realClass = makeRealClass();
        
        //here realClass is inheriting from clazz
        realClass.prototype = new clazz();
        realClass.clazz = clazz;

        return realClass;
    };

    function makeRealClass() {
        return function() {
            this.init.apply(this, arguments);
        };
    };

    function setupSuperClazz(clazz, config) {
        var superClazz = getSuperClazz(config);
        delete config.extend;
        clazz.prototype = new superClazz(); //setup prototype chain
        clazz.prototype.superClazz = superClazz; //save reference for the callSuper method
    };

    function getSuperClazz(config) {
        if (config.extend && config.extend.clazz) {
            return config.extend.clazz;
        }

        return Base; //lowest level class
    };

    function addMembers(clazz, config) {
        config.init = config.init || new Function(); //must have an init method 
        for (var member in config) {
            clazz.prototype[member] = config[member];
        }
    };
    
    return makeClass;
})();
