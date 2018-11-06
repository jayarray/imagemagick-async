let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let CONSOLIDATED_EFFECTS = require(PATH.join(IM_MODULES_DIR, 'Layer', 'consolidatedeffects.json')).effects;

//-------------------------------

class Node {
  constructor(layer) {
    this.layer_ = layer;
    this.parent_ = null;
    this.children_ = [];
  }

  SetParent(p) {
    this.parent_ = p;
  }

  Parent() {
    return this.parent_;
  }

  AddChild(c) {
    this.children_.push(c);
  }

  Children() {
    return this.children_;
  }

  Layer() {
    return this.layer_;
  }

  Xoffset() {
    return this.layer_.xOffset_;
  }

  Yoffset() {
    return this.layer_.yOffset_;
  }

  Type() {
    return this.layer_.Type();
  }
}

//----------------------------

function GetLayerHierarchy(layer) {
  let flatList = [];

  let nodes = layer.layers_.map(l => new Node(l));

  let stack = [];
  nodes.reverse().forEach(node => stack.push(node));

  while (stack && stack.length > 0) {
    // Get next node
    let currNode = stack.pop();
    flatList.push(currNode);

    // Add children to parent
    let children = currNode.Layer().layers_.map(l => new Node(l));
    children.forEach(c => c.SetParent(currNode));
    children.forEach(c => currNode.AddChild(c));

    // Push children to stack
    stack = stack.concat(children.reverse());
  }

  return { nodes: nodes.reverse(), flatlist: flatList };
}

//------------------------------

function GroupByParent(flatlist) {
  let currGroup = [];
  let groups = [];

  let prevParent = null;

  for (let i = 0; flatlist.length; ++i) {
    let currNode = flatlist[0];

    if (prevParent) {
      if (prevParent == currNode.Parent()) {
        currGroup.push(currNode);
      }
      else {
        groups.push(currGroup);
        currGroup = [];
        currGroup.push(currNode);
        prevParent = currNode.Parent();
      }
    }
    else {
      prevParent = currNode.Parent();
      currGroup.push(currNode);
    }

    if (i == flatlist.length - 1 && currGroup.length > 0) {
      groups.push(currGroup);
    }
  }

  return groups;
}

//----------------------------

function HierarchyToString(nodes, indent) {
  let string = '';

  let stack = [];
  nodes.reverse().forEach(node => stack.push(node));

  while (stack && stack.length > 0) {
    // Get next node
    let currNode = stack.pop();
    string += `${'  '.repeat(indent)}${currNode.Type()}\n`;

    // Add children to parent
    let children = currNode.Layer().layers_.map(l => new Node(l));
    string += HierarchyToString(children, indent + 1);
  }

  return string;
}

//-----------------------------

function Analyze(layer) {
  let hierarchy = GetLayerHierarchy(layer);
  let hStr = `${layer.Type()}\n${HierarchyToString(hierarchy.nodes, 1)}`;
  return { hierarchy: hierarchy, string: hStr };
}

/**
 * Get an ordered flat list of layers.
 * @param {Layer} layer 
 * @returns {Array<Layer>} Returns an aray of Layer objects.
 */
function GetOrderedFlatListOfLayers(layer) {
  let childrenFlatList = GetLayerHierarchy(layer).flatlist.map(node => node.Layer());
  return [layer].concat(childrenFlatList);
}

/**
 * Group layers into canvases.
 * @param {Canvas} canvas 
 */
function GroupIntoSeparateCanvases(canvas) {
  let canvasList = [];
  let flatlist = GetOrderedFlatListOfLayers(canvas);

  for (let i = 0; i < flatlist.length; ++i) {
    let currLayer = flatlist[i];
    if (currLayer.Type() != 'primitive')
      canvasList.push(currLayer);
  }
  return canvasList;
}

/**
 * Combine certain Fx and Mods with others to
 * @param {Array<Layer>} arr 
 */
function GroupConsolableFxAndMods(arr) {
  let groups = [];
  let currGroup = [];

  for (let i = 0; i < arr.length; ++i) {
    let currFxOrMod = arr[i];

    if (i == 0)
      currGroup.push(currFxOrMod);
    else {
      // Check if name exists
      let isConsolidated = CONSOLIDATED_EFFECTS.filter(x => x.name == currFxOrMod.Name());
      if (isConsolidated)
        currGroup.push(currFxOrMod);
      else {
        groups.push(currGroup);

        // Clear curr list
        currGroup = [];
        currGroup.push(currFxOrMod);
      }
    }

    if (i == arr.length - 1 && currGroup.length > 0)
      groups.push(currGroup);
  }

  return groups;
}

//--------------------------
// EXPORTS

exports.Analyze = Analyze;
exports.GroupIntoSeparateCanvases = GroupIntoSeparateCanvases;
exports.GroupConsolableFxAndMods = GroupConsolableFxAndMods;

exports.ComponentType = 'private';