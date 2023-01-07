import React from 'react';
import STLViewer from '../../src/App';
const App = () => {
  return (
    <STLViewer
      models={[
        'https://hassans.s3.eu-central-1.amazonaws.com/assets/newest01-07-2023:16:01:42.stl',
      ]}
      color="rgba(255,0,48,0.2)"
      range
      width={1000}
      height={1000}
      remove
      handleRemove={(item) => {
        console.log(item);
      }}
    />
  );
};

export default App;
