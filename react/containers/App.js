import React from 'react';
import STLViewer from '../../src/App';
const App = () => {
  return (
    <STLViewer
      models={[
        // 'https://hassans.s3.eu-central-1.amazonaws.com/youssef/order/order_g69r/impressions/order_g69rL.STL',
        'https://hassans.s3.eu-central-1.amazonaws.com/assets/002r_outputmodel09-04-2022:20:09:47.stl',
        'https://hassans.s3.eu-central-1.amazonaws.com/assets/002r_faceplatemodel09-04-2022:20:09:2.stl',
        'https://hassans.s3.eu-central-1.amazonaws.com/assets/002r_inputmodel09-05-2022:14:09:33.STL',
      ]}
      color="rgba(255,0,48,0.2)"
      range
      remove
      handleRemove={(item) => {
        console.log(item);
      }}
    />
  );
};

export default App;
