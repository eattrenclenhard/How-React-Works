import { useState } from "react";

const content = [
  {
    summary: "React is a library for building UIs",
    details:
      "Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "State management is like giving state a home",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "We can think of props as the component API",
    details:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export default function App() {
  return (
    <div>
      <Tabbed content={content} />
    </div>
  );
}

console.log(<DifferentContent randomprop={"randomvalue"} />);

// CSRF protection, prevent injection of fake React element from json/api call by hacker, because when $$typeof Symbol, CANNOT be transmitted via json

// virtual DOM means one big react element tree that will be updated entirely whenever it's triggered

// current fiber state is a internal React mutable object(not js, but of reconciler aka engine of React) throughout its lifecycle
// diffing/reconciliation process to figure what exactly what changes to be made to the DOM to reflect latest react component state by comparing current reconciler/fiber state with newly created virtualDOM
// todo list of diffing(list of DOM updates) is placed in "list of effects" which will in turn be used for commit phase of render(effectively making changes to DOM/list of DOM operations to be made)

// React Library is ONLY responsible until render phase completes
// React DOM library takes over and handles DOM update
// So in fact, React itself never touches the DOM, and it actually has no idea where the result of the render phase will actually be committed and painted.
// There are many renderers(committers actually), ReactDOM is JUST one of'em
// remember, react can be used on many hosts(medium/media/device)
// React Native(ios and android)
// Remotion
// word document, figma, pdf
// remember, the output of render phase is INTERMEDIATE in nature, 'list of effects' required for DOM update/commit phase
// renderer has a new name, React elementary
// notice that each host requires DIFFERENT package, notice that we import in the React Library and ReactDOM in our index.js file

// fiber tree, fiber(each node represents a corresponding component instance)
// each fiber holds the actual component state, props, and a queue of work.
// Now the computation of these DOM updates is performed by a diffing algorithm, which step by step compares the elements in the new virtual DOM with the elements in the current fiber tree,
// Now the computation of these DOM updates is performed by a diffing algorithm, which step by step compares the elements in the new virtual DOM with the elements in the current fiber tree, so as to see what has changed.

// that the render face is asynchronous, so fiber can prioritize and split work into chunks, and pause and resume some work later. And this is necessary for concurrent features and also to prevent the JavaScript engine to be blocked by complex render processes.
// writing to the DOM happens all in ONE GO.
// committing phase: renderer will insert, delete and update DOM elements in a synchronous fashion to ensure uninterrupted and smooth committing. This is crucial for preventing partial results from being shown
// difference in prop being passed in does NOT inherently mean state reset, it will be reserved
// when a position in tree gets updated ot different react element, the state is destroyed
// after togglling any tab and revealling some text and no. of likes at either tab 1 or 2 or 3, go to tab 4 then back again, and notice that the no of likes and the tab content showing/not showing state has been reset
// direct consequence of diffing rules

// same element, same component in the same position, because of this, the state is preserved across render, the only thing that changes is the prop being passed in, because TabContent is NOT unique to each Tab component, it's shared
// however when we click Tab 4, a new component named DifferentContent is generated to replace TabContent. Implicitly, the state of the previous component vanishes as well, they are destroyed altogether with previous component, no more no. of likes, no more memory of hide/reveal text

// SOLUTION: key prop, gives React the ability to distinguish between multiple instances of the same component type via unique identification

// use keys in a List
// When a key stays the same across renders, the element will be kept in the DOM
// (even if the position in the tree changes)

// use key prop to deliberately and knowing reset state because
// When a key changes between renders, the element will be destroyed and a new one will be created (even if the position in the tree is the same as before)
// purpose trigger re-creation of DOM element
// key takeaway, different position of same element trigger recreation of DOM element, and the state and prop dies along with it/ensure key changes across render
function Tabbed({ content }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs">
        <Tab num={0} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={1} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={2} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={3} activeTab={activeTab} onClick={setActiveTab} />
      </div>

      {activeTab <= 2 ? (
        <TabContent
          item={content.at(activeTab)}
          key={content.at(activeTab).summary}
        />
      ) : (
        <DifferentContent />
      )}
    </div>
  );
}

function Tab({ num, activeTab, onClick }) {
  return (
    <button
      className={activeTab === num ? "tab active" : "tab"}
      onClick={() => onClick(num)}
    >
      Tab {num + 1}
    </button>
  );
}

function TabContent({ item }) {
  const [showDetails, setShowDetails] = useState(true);
  const [likes, setLikes] = useState(0);

  console.log("RENDER");
  function handleInc() {
    setLikes(likes + 1);
  }

  function handleTripleInc() {
    setLikes(likes + 3);
  }

  function handleUndo() {
    setShowDetails(true);
    setLikes(0);
    console.log(likes);
  }
  function handleUndoLater() {
    setTimeout(handleUndo, 2000);
  }
  return (
    <div className="tab-content">
      <h4>{item.summary}</h4>
      {showDetails && <p>{item.details}</p>}

      <div className="tab-actions">
        <button onClick={() => setShowDetails((h) => !h)}>
          {showDetails ? "Hide" : "Show"} details
        </button>

        <div className="hearts-counter">
          <span>{likes} ❤️</span>
          <button onClick={handleInc}>+</button>
          <button onClick={handleTripleInc}>+++</button>
        </div>
      </div>

      <div className="tab-undo">
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleUndoLater}>Undo in 2s</button>
      </div>
    </div>
  );
}

function DifferentContent() {
  return (
    <div className="tab-content">
      <h4>I'm a DIFFERENT tab, so I reset state 💣💥</h4>
    </div>
  );
}
