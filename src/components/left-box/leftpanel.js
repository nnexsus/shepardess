import panels from './panels.js';


const LeftPanel = ({ panel }) => {
  var Panel = panels["map"];

  Panel = panels[panel];
  return (
    <Panel/>
  )
}

export default LeftPanel;