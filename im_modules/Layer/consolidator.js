class Node {
  constructor(layer) {
    this.layer = layer;
    this.parent = null;
    this.children = [];
  }

  SetParent(p) {
    this.parent = p;
  }

  Parent() {
    return this.parent;
  }

  AddChild(c) {
    this.children.push(c);
  }

  Layer() {
    return this.layer;
  }

  Type() {
    return this.layer.type;
  }
}

//--------------------------------

/**
 * @param {Layer} layer 
 * @returns {Array<Node>} Returns a list of Node objects.
 */
function ToNodeList(layer) {
  // Create stack of nodes

  let stack = [];
  let overlays = layer.args.overlays;

  let nodes = overlays.map(x => new Node(x));
  nodes.reverse().forEach(node => stack.push(node));

  // Iterate through all overlays and their children.

  while (stack && stack.length > 0) {
    let currNode = stack.pop();

    // Add children to parent

    let children = currNode.Layer().args.overlays.map(x => new Node(x));

    children.forEach(c => {
      c.SetParent(currNode);
      currNode.AddChild(c);
    });

    // Push children to stack

    stack = stack.concat(children.reverse());
  }

  return nodes.reverse();
}

//--------------------------------

/**
 * @param {Canvas | Effect} layer
 * @returns {Array<Layer>} Returns an ordered list of Layer objects.
 */
function ToLayerFlatList(layer) {
  let flatList = [];

  // Create stack of overlays

  let stack = [];
  let overlays = layer.args.overlays;
  overlays.forEach(x => stack.push(x));

  // Iterate through all overlays and their children.

  while (stack && stack.length > 0) {
    let currLayer = stack.pop();
    flatList.push(currLayer);

    let children = currLayer.args.overlays;
    stack = stack.concat(children.reverse());
  }

  // Include parent layer as first layer

  flatList = [layer].concat(flatList);
  return flatList;
}

//----------------------------

/**
 * @param {Array<Node>} nodes 
 * @param {number} indent Number of indents
 * @returns {string} Returns an indented string representing the hierarchy of the nodes.
 */
function NodesToHierarchyString(nodes, indent) {
  let string = '';

  let stack = [];
  nodes.reverse().forEach(node => stack.push(node));

  while (stack && stack.length > 0) {
    let currNode = stack.pop();
    string += `${'  '.repeat(indent)}${currNode.Layer().args.foundation.name}\n`; // Show effect name

    // Add children to parent
    let children = currNode.Layer().args.overlays.map(x => new Node(x));
    string += NodesToHierarchyString(children, indent + 1);
  }

  return string;
}

//----------------------------------

/**
 * Get nodes and hierarchy string.
 * @param {Layer} layer 
 * @returns {string} Returns an object containing nodes and a string representing the layer hierarchy.
 */
function Analyze(layer) {
  let nodes = ToNodeList(layer);
  let hStr = `${layer.args.foundation.name}\n${NodesToHierarchyString(nodes, 1)}`;

  return { nodes: nodes, string: hStr };
}

//-----------------------------

/**
 * @param {Array} items
 * @returns {Array} Returns a list of Effect objects.
 */
function GroupConsolidatables(items) {
  let groups = [];
  let currGroup = [];

  for (let i = 0; i < items.length; ++i) {
    let curr = items[i];

    if (i == 0)
      currGroup.push(curr);
    else {
      if (curr.IsConsolidatable())
        currGroup.push(curr);
      else {
        // Add current group to groups list
        groups.push(currGroup);

        // Clear current group and add current effect
        currGroup = [curr];
      }
    }

    // Push last group (if any)
    if (i == items.length - 1 && currGroup.length > 0)
      groups.push(currGroup);
  }

  return groups;
}

//-------------------------------------
// EXPORTS

exports.Analyze = Analyze;
exports.GroupConsolidatables = GroupConsolidatables;
exports.ToLayerFlatList = ToLayerFlatList;