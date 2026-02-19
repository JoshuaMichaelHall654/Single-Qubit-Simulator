// Make a stack like structure using a doubly linked list for undo and redo

// First, make a node class for each node
class Node {
  // Each node should contain the alpha and beta values, as well as pointers to the next
  // and the previous values.
  constructor(alpha, beta) {
    this.alpha = alpha;
    this.beta = beta;
    this.next = null;
    this.prev = null;
  }
}

export class DoublyLinkedList {
  // Make a basic constructor
  constructor() {
    // create the top of the stack
    this.top = null;
    // create a "current" pointer. This will be the
    // node the user sees at any one time. This will
    // be used to let the user undo without deleting.
    this.current = null;
  }

  // When we want to add an alpha and beta to the stack, it should just be the
  // values to be added, not a node class.
  push(alpha, beta) {
    // Make a node with that value
    const newNode = new Node(alpha, beta);

    // If there is no top node, make this node
    // our top node
    if (this.top === null) {
      this.top = newNode;
      this.current = newNode;
      console.log("hello!");
    }

    // Otherwise, there is already a top of the stack, and
    // we need to push this node to the top of the stack.
    else {
      // First, make the current node's next pointer point to the new node.

      // We specifically use current instead of top in order to have code
      // that is consistent. When the user has undone something
      // and then types something new, we would like to push that
      // new value into the stack as usual above their last value.
      // Functionally, this means deleting everything between
      // current and top, which is what we want to do. Writing
      // this into push directly means we do not need to specifically
      // watch for the scenario when the user overrights several
      // layers of the stack using undo: it will simply work naturally.
      console.log(newNode);
      console.log(this.current);
      this.current.next = newNode;

      // Next, make our new node's previous value point
      // to our "current" node
      newNode.prev = this.current;

      // Make newNode our new current
      this.current = newNode;

      // Finally, make top and current the same, as
      // all the values above current have been deleted.
      // Since the garbage collector in javascript is reachability based,
      // the gc will recognize that there is no way to reach the old
      // current.next, and since it is unreachable, all of its relevant
      // nodes are also unreachable, so everything is garbage collected.
      this.top = this.current;
    }
  }

  // When we are undoing, we should move current but NOT top
  undo() {
    // Set current to its previous value at every undo.
    this.current = this.current.prev;

    // Return this.current at every undo so the user can see the changes
    return this.current;
  }

  // When we redo, we move current but not top
  redo() {
    // Set current to its next value UNLESS current
    // is already at the top. TODO, determine if
    // you want to prevent this from occuring at all
    // by not letting the user hit redo when there
    // is nothing to redo.
    if (this.current !== this.top) {
      this.current = this.current.next;
    }

    // Do nothing if they are already the same (for now).
    // Return this.current so we can update the value the user sees.
    return this.current;
  }

  // When we pop, we delete all values from current AND above.
  // The only time this is different from regular pop
  // is when the user undoes and then types a new value into
  // the text field. TODO figure out
  // if this is necessary. Since push is already written
  // to seamlessly intergrate deletion of higher stacks,
  // the careful changing of this.current instead of this.top
  // may be unnecessary. However, it is safe, so I will leave it
  // for now.
  pop() {
    // Functionally delete everything above by going back
    // from this.current by 1 and then deleting everything
    // above it, including it, by no longer referencing it
    this.current = this.current.prev;
    this.current.next = null;
    // Additionally, set top to this current value
    this.top = this.current;

    // Finally, return the current value
    return this.current;
  }

  // get the current value, which may or may not be the top value
  poll() {
    return this.current;
  }
}
