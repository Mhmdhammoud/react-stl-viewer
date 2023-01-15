import React from 'react';
import STLViewer from '../../src/App';
const App = () => {
  return (
    <STLViewer
      models={[
        'https://hassans.s3.eu-central-1.amazonaws.com/youssef/assets/T406 ABDELKARIM ASHKANANI_L.STL',
      ]}
      color="rgba(255,0,48,0.2)"
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
  );
};

export default App;
