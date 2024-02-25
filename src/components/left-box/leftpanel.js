import panels from './panels.js';


const LeftPanel = ({ panel, socket }) => {
  var Panel = panels["map"];

  Panel = panels[panel];
  return (
    <Panel socket={socket}/>
  )
}

export default LeftPanel;