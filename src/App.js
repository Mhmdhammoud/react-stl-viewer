import React, { useState, useEffect } from 'react';
import STLViewer from './STLViewer';
import Slider from 'react-input-slider';
const App = (props) => {
  const { models, color, rotate = false } = props;
  // const [color, setColor] = useState('rgba(255,0,48,0.2)');
  // const [models, setModels] = useState([
  //   // 'https://hassans.s3.eu-central-1.amazonaws.com/youssef/order/order_g69r/impressions/order_g69rL.STL',
  //   'https://hassans.s3.eu-central-1.amazonaws.com/assets/002r_outputmodel09-04-2022:20:09:47.stl',
  //   'https://hassans.s3.eu-central-1.amazonaws.com/assets/002r_faceplatemodel09-04-2022:20:09:2.stl',
  //   'https://hassans.s3.eu-central-1.amazonaws.com/assets/002r_inputmodel09-05-2022:14:09:33.STL',
  // ]);
  const [sliders, setSliders] = useState([]);
  useEffect(() => {
    setSliders(
      models.map((_, index) => ({
        index,
        value: 1,
      }))
    );
  }, [models]);
  if (!models || sliders.length === 0) return null;
  return (
    <div>
      <div style={{ margin: '10px 0px' }}>
        {sliders.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                margin: '10px 0px',
              }}
            >
              <input
                type="checkbox"
                onClick={(e) => {
                  const newSliders = sliders.map((item, i) => {
                    if (i === index) {
                      if (e.target.checked) {
                        return { ...item, value: 0 };
                      } else {
                        return { ...item, value: 1 };
                      }
                    }
                    return item;
                  });
                  setSliders(newSliders);
                }}
              />
              <Slider
                axis="x"
                xstep={0.1}
                xmin={0.0}
                xmax={1.0}
                x={item.value}
                onChange={({ x }) => {
                  const newSliders = sliders.map((item, i) => {
                    if (i === index) {
                      return { ...item, value: parseFloat(x) };
                    }
                    return item;
                  });
                  setSliders(newSliders);
                }}
                style={{ marginLeft: '20px' }}
              />
            </div>
          );
        })}
      </div>
      <STLViewer
        modelColor={color}
        rotate={rotate}
        sliders={sliders}
        models={models}
      />
    </div>
  );
};
export default App;
