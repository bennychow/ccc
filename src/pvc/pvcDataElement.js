
def.type('pvc.DataElement')
.init(function(dimension, value, parent, leafIndex){
    var localKey,
        rawValue = value;

    if(!parent){
        // Parent is a dummy root
        localKey = '';
        value = undefined;
    } else {
        if(value == null){
            throw new Error("Element cannot have a null value.");
        }

        // Pre parsing yields somewhat nicer keys for dates
        localKey = value + '';
        value = dimension._parseRawValue(value);
    }

    pv.Dom.Node.call(this, value);
    
    //this.nodeValue = value; // base constructor does this
    this.nodeName = localKey;

    this.dimension = dimension;
    this.value = value;
    this.rawValue = rawValue; // exists mainly to ease backward compatibility

    this.childNodesByKey = {};
    // NOTE: Unfortunately 'index' is already taken by the base class
    // and, when filled, its value is the PRE-ORDER DFS order!
    this.leafIndex = leafIndex;

    if(!parent){
        this.path     = [];
        this.absValue = null;
        this.label    = "";
        this.absLabel = "";
    } else {
        this.path     = parent.path.concat(value);
        this.absValue = def.join("~",   parent.absValue, localKey);
        this.label    = "" + def.nullTo(dimension._calcLabel ? dimension._calcLabel(value) : value, "");
        this.absLabel = def.join(" ~ ", parent.absLabel, this.label);

        parent.appendChild(this);
        parent.childNodesByKey[value] = this;
    }
})
.add(pv.Dom.Node)
.add({
    toString: function(){
        return this.nodeName; // holds the localKey
    }
});