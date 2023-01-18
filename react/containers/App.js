import React from 'react';
import STLViewer from '../../src/App';
const App = () => {
  const [color, setColor] = React.useState('rgba(255,0,48,0.2)');
  const colors = [
    'rgba(255,0,48,0.2)',
    'rgba(0,244,48,0.2)',
    'rgba(0,0,255,0.2)',
  ];
  return (
    <div>
      <button
        onClick={() => {
          setColor(colors[0]);
        }}
      >
        Red
      </button>
      <button
        onClick={() => {
          setColor(colors[1]);
        }}
      >
        Green
      </button>
      <button
        onClick={() => {
          setColor(colors[2]);
        }}
      >
        Blue
      </button>
      <STLViewer
        models={[
          'https://hassans.s3.eu-central-1.amazonaws.com/youssef/assets/T406 ABDELKARIM ASHKANANI_L.STL',
        ]}
        color={color}
        range
        width={1200}
        height={1000}
        backgroundColor="#e8e8e8"
        remove
        fov={45}
        handleRemove={(item) => {
          console.log(item);
        }}
      />
    </div>
  );
};

export default App;
