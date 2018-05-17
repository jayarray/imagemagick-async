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
    return this.layer_.layer;
  }

  Xoffset() {
    return this.layer_.x;
  }

  Yoffset() {
    return this.layer_.y;
  }

  Type() {
    return this.Layer().Type();
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

//---------------------------------

function GroupBy

//---------------------------------

function IsOptimizable(flatlist) {

}


function GroupIntoOptimizedLayers(flatList) {
  let groups = [];

  // TO DO
}


//----------------------------

function HierarchyToString(nodes, indent) {
  let string = '';

  let stack = [];
  nodes.reverse().forEach(node => stack.push(node));

  while (stack && stack.length > 0) {
    // Get next node
    let currNode = stack.pop();
    string += `${'  '.repeat(indent)}${currNode.Layer().Type()}\n`;

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

//--------------------------
// EXPORTS

exports.Analyze = Analyze;
