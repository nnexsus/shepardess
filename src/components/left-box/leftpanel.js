import panels from './panels.js';


const LeftPanel = ({ panel, socket, streams }) => {
  var Panel = panels["map"];

  Panel = panels[panel];
  return (
    <Panel socket={socket} streams={streams}/>
  )
}

export default LeftPanel;