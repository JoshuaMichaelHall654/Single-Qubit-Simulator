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
    }

    // Otherwise, there is already a top of the stack, and
    // we need to push this node to the top of the stack.
    else {
      // We specifically use current instead of top in order to have code
      // that is consistent. When the user has undone something
      // and then types something new, we would like to push that
      // new value into the stack as usual above their last value.
      // Functionally, this means deleting everything from
      // current to top, including current. Writing
      // this into push directly means we do not need to specifically
      // watch for the scenario when the user overrights several
      // layers of the stack using undo: it will simply work naturally.

      // If the user hasn't undone something,
      // add the node normally.
      if (this.current === this.top) {
        newNode.prev = this.current;
        this.current.next = newNode;
      }
      // Otherwise, the user undid something and that values needs erased.
      // make our new node's previous value point
      // to our "current" node's previous value, and visa versa.
      else {
        newNode.prev = this.current.prev;
        // If previous is null, don't update the previous next value
        // since it doesn't exist
        if (this.current.prev != null) {
          this.current.prev.next = newNode;
        }
      }

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
  // but do not delete it.
  poll() {
    return this.current;
  }

  // Determine if redo is allowed. Redo is allowed when current and top
  // are not equal (i.e. there are values between current and top
  // to actually "redo")
  redoAllowed() {
    // If current and top are not equal, redo is allowed
    if (this.top !== this.current) {
      return true;
    }

    // Otherwise, redo is not allowed
    return false;
  }

  // Determine if undo is allowed. The stack
  // is a list of inputs that is only stored
  // once a transformation has occured. So
  // the stack does store the users first input,
  // but only after a transform occurs.
  undoAllowed() {
    // If current is null, there is no previous value, so return false
    if (this.current === null) {
      return false;
    }
    if (this.current.prev === null) {
      return false;
    }
    // Otherwise, a current and previous value exist, so we return true
    return true;
  }

  // get if the stack is empty
  isEmpty() {
    // If both top and current point to nothing, the stack is empty
    if (this.top === null && this.current === null) {
      return true;
    }
    // Top should not point to nothing while current does and visa versa, but
    // check for them just in case
    else if (this.top == null) {
      console.log("top empty when current not. How?");
    } else if (this.current == null) {
      console.log("current empty when top not. How?");
    }
    return false;
  }

  // empty all values from the stack
  clear() {
    // Set current equal to nothing
    this.current = null;
    // Set top equal to current so there is nothing
    // else pointing to the values in the stack,
    // and they will be garbage collected.
    this.top = null;
  }

  // For seeing the whole stack. Remove or call less when you finish testing
  toArray() {
    const out = [];
    let i = 0;

    // walk from the bottom (oldest) to the top (newest)
    // find the bottom
    let node = this.current;
    if (node === null) return out;

    while (node.prev !== null) node = node.prev;

    // now walk forward
    while (node !== null) {
      out.push({
        i,
        alpha: node.alpha,
        beta: node.beta,
        isCurrent: node === this.current,
        isTop: node === this.top,
      });
      node = node.next;
      i += 1;
    }

    return out;
  }

  // TODO, do you need to know the size of the stack?
}
