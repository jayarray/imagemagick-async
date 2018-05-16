class Node {
  constructor(layer) {
    this.layer_ = layer;
    this.children_ = [];
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

  Type() {
    return this.layer_.layer.Type();
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
    let children = currNode.Layer().layer.layers_.map(l => new Node(l));
    children.forEach(c => currNode.AddChild(c));

    // Push children to stack
    stack = stack.concat(children.reverse());
  }

  return { nodes: nodes.reverse(), flatlist: flatList };
}

//----------------------------

function HierarchyToString(nodes, indent) {
  let string = '';

  let stack = [];
  nodes.reverse().forEach(node => stack.push(node));

  while (stack && stack.length > 0) {
    // Get next node
    let currNode = stack.pop();
    string += `${'  '.repeat(indent)}${currNode.Layer().layer.Type()}\n`;

    // Add children to parent
    let children = currNode.Layer().layer.layers_.map(l => new Node(l));
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

//--------------------------
// EXPORTS

exports.Analyze = Analyze;
