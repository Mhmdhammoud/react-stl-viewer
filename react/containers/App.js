import React, { useState } from 'react';
import STLViewer from '../../src/STLViewer';

const App = () => {
  const [color, setColor] = useState('rgba(255,0,48,0.2)');
  const [model, setModel] = useState(undefined);
  const [models, setModels] = useState([
    // 'https://hassans.s3.eu-central-1.amazonaws.com/youssef/order/order_g69r/impressions/order_g69rL.STL',
    'https://hassans.s3.eu-central-1.amazonaws.com/assets/002r_outputmodel09-04-2022:20:09:47.stl',
    'https://hassans.s3.eu-central-1.amazonaws.com/assets/002r_faceplatemodel09-04-2022:20:09:2.stl',
    'https://hassans.s3.eu-central-1.amazonaws.com/assets/002r_inputmodel09-05-2022:14:09:33.STL',
  ]);
  const [sliders, setSliders] = useState(
    models.map((_, index) => ({
      index,
      value: 1,
    }))
  );

  const onChange = ({ target }) => {
    const { files } = target;
    Promise.all(
      Object.values(files).map((item, index) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(files[index]);
        return new Promise((res, rej) => {
          reader.onload = () => {
            res(reader.result);
          };
        });
      })
    ).then((readers) => {
      const sliders = readers.map((item, index) => ({ index, value: 1 }));
      this.setState({
        models: readers,
        sliders: sliders,
      });
    });
  };
  return (
    <div>
      <input id="image-file" type="file" multiple onChange={onChange} />
      {sliders.map((item, index) => {
        return (
          <div key={index}>
            <label>{index}</label>
            <input
              type="range"
              min={0.0}
              max={1.0}
              step={0.1}
              value={item.value}
              onChange={(e) => {
                const { value } = e.target;
                const newSliders = sliders.map((item, i) => {
                  if (i === index) {
                    return { ...item, value: parseFloat(value) };
                  }
                  return item;
                });
                setSliders(newSliders);
              }}
            />
          </div>
        );
      })}
      <STLViewer
        modelColor={color}
        lights={[1, 1]}
        rotate={false}
        sliders={sliders}
        models={models}
      />
    </div>
  );
};
export default App;
