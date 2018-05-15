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
}

//----------------------------

function GetLayerHierarchy(layer) {
  let nodes = layer.layers_.map(l => new Node(l));

  let stack = [];
  nodes.reverse().forEach(node => stack.push(node));

  while (stack && stack.length > 0) {
    // Get next node
    let currNode = stack.pop();

    // Add children to parent
    let children = currNode.Layer().layer.layers_.map(l => new Node(l));
    children.forEach(c => currNode.AddChild(c));

    // Push children to stack
    stack = stack.concat(children.reverse());
  }

  return nodes;
}

//-----------------------------

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
    string += HierarchyToString(children, indent + 2);
  }

  return string;
}

//-----------------------------

function Analyze(layer) {
  console.log(`CURRENT_TYPE: ${layer.Type()}`);

  let layerInfo = [];

  let nodes = GetLayerHierarchy(layer);
  let hStr = HierarchyToString(nodes, 1);

  console.log(hStr);
}

//--------------------------
// EXPORTS

exports.Analyze = Analyze;